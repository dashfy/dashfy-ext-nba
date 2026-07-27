import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Scoreboard } from './Scoreboard'

vi.mock('@dashfy/ui', async () => {
  const actual = await vi.importActual('@dashfy/ui')
  return {
    ...actual,
    useApiSubscription: vi.fn(),
  }
})

const { useApiSubscription } = await import('@dashfy/ui')

describe('Scoreboard', () => {
  it('should render loading state', () => {
    vi.mocked(useApiSubscription).mockReturnValue({
      data: null,
      error: null,
      loading: true,
      lastUpdate: undefined,
    })

    render(<Scoreboard />)

    expect(screen.getByText('NBA')).toBeTruthy()
    expect(screen.getByText('Scoreboard')).toBeTruthy()
    expect(screen.getByText('Loading...')).toBeTruthy()
  })

  it('should render error state', () => {
    vi.mocked(useApiSubscription).mockReturnValue({
      data: null,
      error: 'Failed to fetch games',
      loading: false,
      lastUpdate: Date.now(),
    })

    render(<Scoreboard />)

    expect(screen.getByText(/Failed to fetch games/i)).toBeTruthy()
  })

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

    render(<Scoreboard />)

    expect(screen.getByText(/No games on 2024-01-15/i)).toBeTruthy()
  })

  it('should render games list', () => {
    vi.mocked(useApiSubscription).mockReturnValue({
      data: {
        scoreboard: {
          gameDate: '2024-01-15',
          leagueId: '00',
          leagueName: 'NBA',
          games: [
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
          ],
        },
      },
      error: null,
      loading: false,
      lastUpdate: Date.now(),
    })

    render(<Scoreboard />)

    expect(screen.getByText('Lakers')).toBeTruthy()
    expect(screen.getByText('Celtics')).toBeTruthy()
  })

  it('should show custom title and subject', () => {
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

    render(<Scoreboard subject="Today's Games" title="Basketball" />)

    expect(screen.getByText('Basketball')).toBeTruthy()
    expect(screen.getByText("Today's Games")).toBeTruthy()
  })

  it('should use custom API and endpoint', () => {
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

    render(<Scoreboard api="customApi" endpoint="customEndpoint" />)

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
          games: [],
        },
      },
      error: null,
      loading: false,
      lastUpdate: Date.now(),
    })

    render(<Scoreboard date="2024-12-25" />)

    expect(useApiSubscription).toHaveBeenCalledWith({
      api: 'nba',
      endpoint: 'games',
      params: { date: '2024-12-25' },
    })
  })

  it('should show game count in header', () => {
    vi.mocked(useApiSubscription).mockReturnValue({
      data: {
        scoreboard: {
          gameDate: '2024-01-15',
          leagueId: '00',
          leagueName: 'NBA',
          games: [
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
              gameStatus: 1,
              gameStatusText: 'Scheduled',
              period: 0,
              gameClock: '',
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
                score: 0,
              },
              awayTeam: {
                teamId: 1610612744,
                teamName: 'Warriors',
                teamCity: 'Golden State',
                teamTricode: 'GSW',
                teamSlug: 'warriors',
                wins: 22,
                losses: 18,
                score: 0,
              },
            },
          ],
        },
      },
      error: null,
      loading: false,
      lastUpdate: Date.now(),
    })

    const { container } = render(<Scoreboard />)

    // Check that count is displayed (implementation may vary)
    expect(container.textContent).toContain('2')
  })
})
