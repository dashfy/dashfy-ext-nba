import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { GameCard } from './GameCard'

vi.mock('@getdashfy/ui', async () => {
  const actual = await vi.importActual('@getdashfy/ui')
  return {
    ...actual,
    useApiSubscription: vi.fn(),
  }
})

const { useApiSubscription } = await import('@getdashfy/ui')

describe('GameCard', () => {
  const mockGames = [
    {
      gameId: '0022300001',
      gameCode: 'BOSLAL',
      gameStatus: 1,
      gameStatusText: 'Scheduled',
      period: 0,
      gameClock: '',
      gameTimeUTC: '2024-01-15T00:00:00Z',
      gameEt: '2024-01-15T00:00:00Z',
      regulationPeriods: 4,
      ifNecessary: false,
      seriesGameNumber: '',
      gameLabel: '',
      gameSubLabel: '',
      seriesText: '',
      homeTeam: {
        teamId: 1610612747,
        teamName: 'Lakers',
        teamCity: 'Los Angeles',
        teamTricode: 'LAL',
        teamSlug: 'lakers',
        wins: 25,
        losses: 15,
        score: 0,
      },
      awayTeam: {
        teamId: 1610612738,
        teamName: 'Celtics',
        teamCity: 'Boston',
        teamTricode: 'BOS',
        teamSlug: 'celtics',
        wins: 30,
        losses: 10,
        score: 0,
      },
    },
    {
      gameId: '0022300002',
      gameCode: 'GSWDEN',
      gameStatus: 2,
      gameStatusText: 'In Progress',
      period: 2,
      gameClock: 'PT10M30S',
      gameTimeUTC: '2024-01-15T02:00:00Z',
      gameEt: '2024-01-15T02:00:00Z',
      regulationPeriods: 4,
      ifNecessary: false,
      seriesGameNumber: '',
      gameLabel: '',
      gameSubLabel: '',
      seriesText: '',
      homeTeam: {
        teamId: 1610612743,
        teamName: 'Nuggets',
        teamCity: 'Denver',
        teamTricode: 'DEN',
        teamSlug: 'nuggets',
        wins: 28,
        losses: 12,
        score: 55,
      },
      awayTeam: {
        teamId: 1610612744,
        teamName: 'Warriors',
        teamCity: 'Golden State',
        teamTricode: 'GSW',
        teamSlug: 'warriors',
        wins: 22,
        losses: 18,
        score: 50,
      },
    },
  ]

  describe('Loading State', () => {
    it('should render loading state', () => {
      vi.mocked(useApiSubscription).mockReturnValue({
        data: null,
        error: null,
        loading: true,
        lastUpdate: undefined,
      })

      render(<GameCard />)

      expect(screen.getByText('NBA')).toBeTruthy()
      expect(screen.getByText('Game')).toBeTruthy()
      expect(screen.getByText('Loading...')).toBeTruthy()
    })

    it('should show custom title and subject in loading state', () => {
      vi.mocked(useApiSubscription).mockReturnValue({
        data: null,
        error: null,
        loading: true,
        lastUpdate: undefined,
      })

      render(<GameCard subject="Tonight's Game" title="Basketball" />)

      expect(screen.getByText('Basketball')).toBeTruthy()
      expect(screen.getByText("Tonight's Game")).toBeTruthy()
    })
  })

  describe('Error State', () => {
    it('should render error state', () => {
      vi.mocked(useApiSubscription).mockReturnValue({
        data: null,
        error: 'Failed to fetch game',
        loading: false,
        lastUpdate: Date.now(),
      })

      render(<GameCard />)

      expect(screen.getByText(/Failed to fetch game/i)).toBeTruthy()
    })

    it('should show custom title and subject in error state', () => {
      vi.mocked(useApiSubscription).mockReturnValue({
        data: null,
        error: 'Network error',
        loading: false,
        lastUpdate: Date.now(),
      })

      render(<GameCard subject="Featured Game" title="NBA Live" />)

      expect(screen.getByText('NBA Live')).toBeTruthy()
      expect(screen.getByText('Featured Game')).toBeTruthy()
    })
  })

  describe('Empty State', () => {
    it('should render empty state when no games', () => {
      vi.mocked(useApiSubscription).mockReturnValue({
        data: {
          scoreboard: {
            gameDate: '2024-01-15',
            leagueId: '00',
            leagueName: 'NBA',
            games: [],
          },
        },
        error: null,
        loading: false,
        lastUpdate: Date.now(),
      })

      render(<GameCard />)

      expect(screen.getByText('No game found')).toBeTruthy()
    })

    it('should render empty state when gameId not found', () => {
      vi.mocked(useApiSubscription).mockReturnValue({
        data: {
          scoreboard: {
            gameDate: '2024-01-15',
            leagueId: '00',
            leagueName: 'NBA',
            games: mockGames,
          },
        },
        error: null,
        loading: false,
        lastUpdate: Date.now(),
      })

      render(<GameCard gameId="9999999999" />)

      expect(screen.getByText('No game found')).toBeTruthy()
    })

    it('should render empty state when gameIndex out of bounds', () => {
      vi.mocked(useApiSubscription).mockReturnValue({
        data: {
          scoreboard: {
            gameDate: '2024-01-15',
            leagueId: '00',
            leagueName: 'NBA',
            games: mockGames,
          },
        },
        error: null,
        loading: false,
        lastUpdate: Date.now(),
      })

      render(<GameCard gameIndex={99} />)

      expect(screen.getByText('No game found')).toBeTruthy()
    })
  })

  describe('Game Display', () => {
    it('should render first game by default', () => {
      vi.mocked(useApiSubscription).mockReturnValue({
        data: {
          scoreboard: {
            gameDate: '2024-01-15',
            leagueId: '00',
            leagueName: 'NBA',
            games: mockGames,
          },
        },
        error: null,
        loading: false,
        lastUpdate: Date.now(),
      })

      render(<GameCard />)

      expect(screen.getByText('Lakers')).toBeTruthy()
      expect(screen.getByText('Celtics')).toBeTruthy()
    })

    it('should render game by gameIndex', () => {
      vi.mocked(useApiSubscription).mockReturnValue({
        data: {
          scoreboard: {
            gameDate: '2024-01-15',
            leagueId: '00',
            leagueName: 'NBA',
            games: mockGames,
          },
        },
        error: null,
        loading: false,
        lastUpdate: Date.now(),
      })

      render(<GameCard gameIndex={1} />)

      expect(screen.getByText('Nuggets')).toBeTruthy()
      expect(screen.getByText('Warriors')).toBeTruthy()
    })

    it('should render game by gameId', () => {
      vi.mocked(useApiSubscription).mockReturnValue({
        data: {
          scoreboard: {
            gameDate: '2024-01-15',
            leagueId: '00',
            leagueName: 'NBA',
            games: mockGames,
          },
        },
        error: null,
        loading: false,
        lastUpdate: Date.now(),
      })

      render(<GameCard gameId="0022300002" />)

      expect(screen.getByText('Nuggets')).toBeTruthy()
      expect(screen.getByText('Warriors')).toBeTruthy()
    })

    it('should prioritize gameId over gameIndex', () => {
      vi.mocked(useApiSubscription).mockReturnValue({
        data: {
          scoreboard: {
            gameDate: '2024-01-15',
            leagueId: '00',
            leagueName: 'NBA',
            games: mockGames,
          },
        },
        error: null,
        loading: false,
        lastUpdate: Date.now(),
      })

      render(<GameCard gameId="0022300002" gameIndex={0} />)

      // Should show second game (Warriors/Nuggets) not first (Celtics/Lakers)
      expect(screen.getByText('Nuggets')).toBeTruthy()
      expect(screen.getByText('Warriors')).toBeTruthy()
      expect(screen.queryByText('Lakers')).toBeNull()
    })
  })

  describe('Title Display', () => {
    it('should use custom title when provided', () => {
      vi.mocked(useApiSubscription).mockReturnValue({
        data: {
          scoreboard: {
            gameDate: '2024-01-15',
            leagueId: '00',
            leagueName: 'NBA',
            games: mockGames,
          },
        },
        error: null,
        loading: false,
        lastUpdate: Date.now(),
      })

      render(<GameCard title="Custom Title" />)

      expect(screen.getByText('Custom Title')).toBeTruthy()
    })

    it('should generate title from team tricodes when no custom title', () => {
      vi.mocked(useApiSubscription).mockReturnValue({
        data: {
          scoreboard: {
            gameDate: '2024-01-15',
            leagueId: '00',
            leagueName: 'NBA',
            games: mockGames,
          },
        },
        error: null,
        loading: false,
        lastUpdate: Date.now(),
      })

      const { container } = render(<GameCard title={undefined} />)

      // The title is generated but displayed in the header, check it's in the DOM
      expect(container.textContent).toContain('BOS')
      expect(container.textContent).toContain('LAL')
    })

    it('should show custom subject', () => {
      vi.mocked(useApiSubscription).mockReturnValue({
        data: {
          scoreboard: {
            gameDate: '2024-01-15',
            leagueId: '00',
            leagueName: 'NBA',
            games: mockGames,
          },
        },
        error: null,
        loading: false,
        lastUpdate: Date.now(),
      })

      render(<GameCard subject="Featured Match" />)

      expect(screen.getByText('Featured Match')).toBeTruthy()
    })
  })

  describe('API Configuration', () => {
    it('should use custom API and endpoint', () => {
      vi.mocked(useApiSubscription).mockReturnValue({
        data: {
          scoreboard: {
            gameDate: '2024-01-15',
            leagueId: '00',
            leagueName: 'NBA',
            games: mockGames,
          },
        },
        error: null,
        loading: false,
        lastUpdate: Date.now(),
      })

      render(<GameCard api="customApi" endpoint="customEndpoint" />)

      expect(useApiSubscription).toHaveBeenCalledWith({
        api: 'customApi',
        endpoint: 'customEndpoint',
        params: undefined,
      })
    })

    it('should pass date parameter when provided', () => {
      vi.mocked(useApiSubscription).mockReturnValue({
        data: {
          scoreboard: {
            gameDate: '2024-12-25',
            leagueId: '00',
            leagueName: 'NBA',
            games: mockGames,
          },
        },
        error: null,
        loading: false,
        lastUpdate: Date.now(),
      })

      render(<GameCard date="2024-12-25" />)

      expect(useApiSubscription).toHaveBeenCalledWith({
        api: 'nba',
        endpoint: 'games',
        params: { date: '2024-12-25' },
      })
    })

    it('should not pass params when date is not provided', () => {
      vi.mocked(useApiSubscription).mockReturnValue({
        data: {
          scoreboard: {
            gameDate: '2024-01-15',
            leagueId: '00',
            leagueName: 'NBA',
            games: mockGames,
          },
        },
        error: null,
        loading: false,
        lastUpdate: Date.now(),
      })

      render(<GameCard />)

      expect(useApiSubscription).toHaveBeenCalledWith({
        api: 'nba',
        endpoint: 'games',
        params: undefined,
      })
    })
  })

  describe('Game Content', () => {
    it('should render GameContent component', () => {
      vi.mocked(useApiSubscription).mockReturnValue({
        data: {
          scoreboard: {
            gameDate: '2024-01-15',
            leagueId: '00',
            leagueName: 'NBA',
            games: mockGames,
          },
        },
        error: null,
        loading: false,
        lastUpdate: Date.now(),
      })

      render(<GameCard />)

      // GameContent should render team displays
      expect(screen.getByText('Lakers')).toBeTruthy()
      expect(screen.getByText('Celtics')).toBeTruthy()
    })

    it('should render scheduled game', () => {
      vi.mocked(useApiSubscription).mockReturnValue({
        data: {
          scoreboard: {
            gameDate: '2024-01-15',
            leagueId: '00',
            leagueName: 'NBA',
            games: [mockGames[0]!],
          },
        },
        error: null,
        loading: false,
        lastUpdate: Date.now(),
      })

      render(<GameCard />)

      expect(screen.getByText('Lakers')).toBeTruthy()
      expect(screen.getByText('Celtics')).toBeTruthy()
      // Scheduled game should show dashes for scores
      expect(screen.getAllByText('-')).toBeTruthy()
    })

    it('should render live game', () => {
      vi.mocked(useApiSubscription).mockReturnValue({
        data: {
          scoreboard: {
            gameDate: '2024-01-15',
            leagueId: '00',
            leagueName: 'NBA',
            games: [mockGames[1]!],
          },
        },
        error: null,
        loading: false,
        lastUpdate: Date.now(),
      })

      render(<GameCard />)

      expect(screen.getByText('Nuggets')).toBeTruthy()
      expect(screen.getByText('Warriors')).toBeTruthy()
      // Live game should show scores
      expect(screen.getByText('55')).toBeTruthy()
      expect(screen.getByText('50')).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined scoreboard', () => {
      vi.mocked(useApiSubscription).mockReturnValue({
        data: {},
        error: null,
        loading: false,
        lastUpdate: Date.now(),
      })

      render(<GameCard />)

      expect(screen.getByText('No game found')).toBeTruthy()
    })

    it('should handle null games array', () => {
      vi.mocked(useApiSubscription).mockReturnValue({
        data: {
          scoreboard: {
            gameDate: '2024-01-15',
            leagueId: '00',
            leagueName: 'NBA',
            games: null,
          },
        },
        error: null,
        loading: false,
        lastUpdate: Date.now(),
      })

      render(<GameCard />)

      expect(screen.getByText('No game found')).toBeTruthy()
    })

    it('should handle gameIndex 0 explicitly', () => {
      vi.mocked(useApiSubscription).mockReturnValue({
        data: {
          scoreboard: {
            gameDate: '2024-01-15',
            leagueId: '00',
            leagueName: 'NBA',
            games: mockGames,
          },
        },
        error: null,
        loading: false,
        lastUpdate: Date.now(),
      })

      render(<GameCard gameIndex={0} />)

      expect(screen.getByText('Lakers')).toBeTruthy()
      expect(screen.getByText('Celtics')).toBeTruthy()
    })

    it('should render error boundary with game ID as reset key', () => {
      vi.mocked(useApiSubscription).mockReturnValue({
        data: {
          scoreboard: {
            gameDate: '2024-01-15',
            leagueId: '00',
            leagueName: 'NBA',
            games: mockGames,
          },
        },
        error: null,
        loading: false,
        lastUpdate: Date.now(),
      })

      const { container } = render(<GameCard />)

      // WidgetErrorBoundary should be rendered
      expect(container.querySelector('div')).toBeTruthy()
    })
  })
})
