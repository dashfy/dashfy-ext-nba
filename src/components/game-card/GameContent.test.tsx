import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { NbaGame } from '@/types'

import { GameContent } from './GameContent'

describe('GameContent', () => {
  const baseGame: NbaGame = {
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
  }

  describe('Team Display', () => {
    it('should render both teams', () => {
      render(<GameContent game={baseGame} />)

      expect(screen.getByText('Lakers')).toBeTruthy()
      expect(screen.getByText('Celtics')).toBeTruthy()
    })

    it('should render team records', () => {
      render(<GameContent game={baseGame} />)

      expect(screen.getByText('25-15')).toBeTruthy()
      expect(screen.getByText('30-10')).toBeTruthy()
    })

    it('should render team tricodes', () => {
      render(<GameContent game={baseGame} />)

      expect(screen.getByText('LAL')).toBeTruthy()
      expect(screen.getByText('BOS')).toBeTruthy()
    })
  })

  describe('Scheduled Game', () => {
    it('should render dash for scheduled game scores', () => {
      render(<GameContent game={baseGame} />)

      expect(screen.getAllByText('-')).toHaveLength(2)
    })

    it('should not highlight any team in scheduled game', () => {
      const { container } = render(<GameContent game={baseGame} />)

      // Both teams should have muted styling
      const mutedElements = container.querySelectorAll('.text-muted-foreground')
      expect(mutedElements.length).toBeGreaterThan(0)
    })
  })

  describe('Live Game', () => {
    const liveGame: NbaGame = {
      ...baseGame,
      gameStatus: 2,
      gameStatusText: 'In Progress',
      period: 2,
      gameClock: 'PT10M30S',
      homeTeam: {
        ...baseGame.homeTeam,
        score: 55,
      },
      awayTeam: {
        ...baseGame.awayTeam,
        score: 50,
      },
    }

    it('should render scores for live game', () => {
      render(<GameContent game={liveGame} />)

      expect(screen.getByText('55')).toBeTruthy()
      expect(screen.getByText('50')).toBeTruthy()
    })

    it('should not highlight winner in live game', () => {
      const { container } = render(<GameContent game={liveGame} />)

      // Both teams should have muted styling since game is not final
      const mutedElements = container.querySelectorAll('.text-muted-foreground')
      expect(mutedElements.length).toBeGreaterThan(0)
    })
  })

  describe('Final Game', () => {
    const finalGame: NbaGame = {
      ...baseGame,
      gameStatus: 3,
      gameStatusText: 'Final',
      period: 4,
      gameClock: '',
      homeTeam: {
        ...baseGame.homeTeam,
        score: 110,
      },
      awayTeam: {
        ...baseGame.awayTeam,
        score: 105,
      },
    }

    it('should render final scores', () => {
      render(<GameContent game={finalGame} />)

      expect(screen.getByText('110')).toBeTruthy()
      expect(screen.getByText('105')).toBeTruthy()
    })

    it('should highlight home team winner', () => {
      const { container } = render(<GameContent game={finalGame} />)

      // Winner should have bold styling
      expect(container.querySelector('.font-bold')).toBeTruthy()
    })

    it('should highlight away team winner', () => {
      const awayWinGame: NbaGame = {
        ...finalGame,
        homeTeam: {
          ...finalGame.homeTeam,
          score: 105,
        },
        awayTeam: {
          ...finalGame.awayTeam,
          score: 110,
        },
      }

      const { container } = render(<GameContent game={awayWinGame} />)

      expect(container.querySelector('.font-bold')).toBeTruthy()
    })

    it('should not highlight any team in tied game', () => {
      const tiedGame: NbaGame = {
        ...finalGame,
        homeTeam: {
          ...finalGame.homeTeam,
          score: 105,
        },
        awayTeam: {
          ...finalGame.awayTeam,
          score: 105,
        },
      }

      const { container } = render(<GameContent game={tiedGame} />)

      // Both teams should have muted styling
      const mutedElements = container.querySelectorAll('.text-muted-foreground')
      expect(mutedElements.length).toBeGreaterThan(0)
    })
  })

  describe('Game Status', () => {
    it('should render game status component', () => {
      const { container } = render(<GameContent game={baseGame} />)

      // GameStatus component should be rendered
      expect(container.querySelector('.border-t')).toBeTruthy()
    })

    it('should render status footer with correct styling', () => {
      const { container } = render(<GameContent game={baseGame} />)

      const statusFooter = container.querySelector('.border-border.bg-muted\\/30.border-t')
      expect(statusFooter).toBeTruthy()
    })
  })

  describe('Series Text (Playoffs)', () => {
    it('should render series text when provided', () => {
      const playoffGame: NbaGame = {
        ...baseGame,
        seriesText: 'Series tied 2-2',
      }

      render(<GameContent game={playoffGame} />)

      expect(screen.getByText('Series tied 2-2')).toBeTruthy()
    })

    it('should not render series text when empty', () => {
      render(<GameContent game={baseGame} />)

      expect(screen.queryByText(/Series/)).toBeNull()
    })

    it('should render different series text', () => {
      const playoffGame: NbaGame = {
        ...baseGame,
        seriesText: 'Lakers lead 3-1',
      }

      render(<GameContent game={playoffGame} />)

      expect(screen.getByText('Lakers lead 3-1')).toBeTruthy()
    })

    it('should apply correct styling to series text', () => {
      const playoffGame: NbaGame = {
        ...baseGame,
        seriesText: 'Series tied 2-2',
      }

      render(<GameContent game={playoffGame} />)

      const seriesElement = screen.getByText('Series tied 2-2')
      expect(seriesElement.className).toContain('text-muted-foreground')
      expect(seriesElement.className).toContain('text-xs')
    })
  })

  describe('Game Leaders', () => {
    const finalGameWithLeaders: NbaGame = {
      ...baseGame,
      gameStatus: 3,
      gameStatusText: 'Final',
      period: 4,
      gameClock: '',
      homeTeam: {
        ...baseGame.homeTeam,
        score: 110,
      },
      awayTeam: {
        ...baseGame.awayTeam,
        score: 105,
      },
      gameLeaders: {
        homeLeaders: {
          personId: 2544,
          name: 'LeBron James',
          jerseyNum: '23',
          position: 'F',
          teamTricode: 'LAL',
          points: 28,
          rebounds: 10,
          assists: 8,
        },
        awayLeaders: {
          personId: 1628369,
          name: 'Jayson Tatum',
          jerseyNum: '0',
          position: 'F',
          teamTricode: 'BOS',
          points: 32,
          rebounds: 7,
          assists: 5,
        },
      },
    }

    it('should render game leaders section for final game', () => {
      render(<GameContent game={finalGameWithLeaders} />)

      expect(screen.getByText('Game Leaders')).toBeTruthy()
    })

    it('should render home team leader', () => {
      render(<GameContent game={finalGameWithLeaders} />)

      expect(screen.getByText('LeBron James')).toBeTruthy()
      expect(screen.getByText(/28 PTS/)).toBeTruthy()
      expect(screen.getByText(/10 REB/)).toBeTruthy()
      expect(screen.getByText(/8 AST/)).toBeTruthy()
    })

    it('should render away team leader', () => {
      render(<GameContent game={finalGameWithLeaders} />)

      expect(screen.getByText('Jayson Tatum')).toBeTruthy()
      expect(screen.getByText(/32 PTS/)).toBeTruthy()
      expect(screen.getByText(/7 REB/)).toBeTruthy()
      expect(screen.getByText(/5 AST/)).toBeTruthy()
    })

    it('should not render game leaders for live game', () => {
      const liveGameWithLeaders: NbaGame = {
        ...finalGameWithLeaders,
        gameStatus: 2,
        gameStatusText: 'In Progress',
      }

      render(<GameContent game={liveGameWithLeaders} />)

      expect(screen.queryByText('Game Leaders')).toBeNull()
    })

    it('should not render game leaders for scheduled game', () => {
      const scheduledGameWithLeaders: NbaGame = {
        ...finalGameWithLeaders,
        gameStatus: 1,
        gameStatusText: 'Scheduled',
      }

      render(<GameContent game={scheduledGameWithLeaders} />)

      expect(screen.queryByText('Game Leaders')).toBeNull()
    })

    it('should not render game leaders when not provided', () => {
      const finalGameNoLeaders: NbaGame = {
        ...baseGame,
        gameStatus: 3,
        gameStatusText: 'Final',
        period: 4,
        gameClock: '',
        homeTeam: {
          ...baseGame.homeTeam,
          score: 110,
        },
        awayTeam: {
          ...baseGame.awayTeam,
          score: 105,
        },
      }

      render(<GameContent game={finalGameNoLeaders} />)

      expect(screen.queryByText('Game Leaders')).toBeNull()
    })

    it('should render game leaders in grid layout', () => {
      const { container } = render(<GameContent game={finalGameWithLeaders} />)

      const gridContainer = container.querySelector('.grid.grid-cols-2')
      expect(gridContainer).toBeTruthy()
    })
  })

  describe('Card Styling', () => {
    it('should render card with overflow hidden', () => {
      const { container } = render(<GameContent game={baseGame} />)

      const card = container.querySelector('.overflow-hidden')
      expect(card).toBeTruthy()
    })

    it('should render card with no padding', () => {
      const { container } = render(<GameContent game={baseGame} />)

      const card = container.querySelector('.p-0')
      expect(card).toBeTruthy()
    })

    it('should apply border-b-0 to home team', () => {
      const { container } = render(<GameContent game={baseGame} />)

      const borderElements = container.querySelectorAll('.border-b-0')
      expect(borderElements.length).toBeGreaterThan(0)
    })
  })

  describe('Different Game States', () => {
    it('should handle overtime game', () => {
      const overtimeGame: NbaGame = {
        ...baseGame,
        gameStatus: 3,
        gameStatusText: 'Final/OT',
        period: 5,
        gameClock: '',
        homeTeam: {
          ...baseGame.homeTeam,
          score: 125,
        },
        awayTeam: {
          ...baseGame.awayTeam,
          score: 120,
        },
      }

      render(<GameContent game={overtimeGame} />)

      expect(screen.getByText('125')).toBeTruthy()
      expect(screen.getByText('120')).toBeTruthy()
    })

    it('should handle halftime', () => {
      const halftimeGame: NbaGame = {
        ...baseGame,
        gameStatus: 2,
        gameStatusText: 'Halftime',
        period: 2,
        gameClock: '',
        homeTeam: {
          ...baseGame.homeTeam,
          score: 55,
        },
        awayTeam: {
          ...baseGame.awayTeam,
          score: 52,
        },
      }

      render(<GameContent game={halftimeGame} />)

      expect(screen.getByText('55')).toBeTruthy()
      expect(screen.getByText('52')).toBeTruthy()
    })

    it('should handle blowout game', () => {
      const blowoutGame: NbaGame = {
        ...baseGame,
        gameStatus: 3,
        gameStatusText: 'Final',
        period: 4,
        gameClock: '',
        homeTeam: {
          ...baseGame.homeTeam,
          score: 140,
        },
        awayTeam: {
          ...baseGame.awayTeam,
          score: 90,
        },
      }

      render(<GameContent game={blowoutGame} />)

      expect(screen.getByText('140')).toBeTruthy()
      expect(screen.getByText('90')).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('should handle game with zero scores', () => {
      const zeroScoreGame: NbaGame = {
        ...baseGame,
        gameStatus: 2,
        gameStatusText: 'In Progress',
        period: 1,
        gameClock: 'PT11M45S',
        homeTeam: {
          ...baseGame.homeTeam,
          score: 0,
        },
        awayTeam: {
          ...baseGame.awayTeam,
          score: 0,
        },
      }

      render(<GameContent game={zeroScoreGame} />)

      expect(screen.getAllByText('0')).toHaveLength(2)
    })

    it('should handle game with very high scores', () => {
      const highScoreGame: NbaGame = {
        ...baseGame,
        gameStatus: 3,
        gameStatusText: 'Final',
        period: 4,
        gameClock: '',
        homeTeam: {
          ...baseGame.homeTeam,
          score: 155,
        },
        awayTeam: {
          ...baseGame.awayTeam,
          score: 150,
        },
      }

      render(<GameContent game={highScoreGame} />)

      expect(screen.getByText('155')).toBeTruthy()
      expect(screen.getByText('150')).toBeTruthy()
    })

    it('should handle game with both series text and leaders', () => {
      const complexGame: NbaGame = {
        ...baseGame,
        gameStatus: 3,
        gameStatusText: 'Final',
        period: 4,
        gameClock: '',
        seriesText: 'Lakers lead 3-2',
        homeTeam: {
          ...baseGame.homeTeam,
          score: 110,
        },
        awayTeam: {
          ...baseGame.awayTeam,
          score: 105,
        },
        gameLeaders: {
          homeLeaders: {
            personId: 2544,
            name: 'LeBron James',
            jerseyNum: '23',
            position: 'F',
            teamTricode: 'LAL',
            points: 28,
            rebounds: 10,
            assists: 8,
          },
          awayLeaders: {
            personId: 1628369,
            name: 'Jayson Tatum',
            jerseyNum: '0',
            position: 'F',
            teamTricode: 'BOS',
            points: 32,
            rebounds: 7,
            assists: 5,
          },
        },
      }

      render(<GameContent game={complexGame} />)

      expect(screen.getByText('Lakers lead 3-2')).toBeTruthy()
      expect(screen.getByText('Game Leaders')).toBeTruthy()
      expect(screen.getByText('LeBron James')).toBeTruthy()
      expect(screen.getByText('Jayson Tatum')).toBeTruthy()
    })
  })
})
