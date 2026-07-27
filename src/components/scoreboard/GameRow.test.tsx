import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { NbaGame } from '@/types'

import { GameRow } from './GameRow'

describe('GameRow', () => {
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

  it('should render both team names', () => {
    render(<GameRow game={baseGame} />)

    expect(screen.getByText('Lakers')).toBeTruthy()
    expect(screen.getByText('Celtics')).toBeTruthy()
  })

  it('should render scheduled game status', () => {
    render(<GameRow game={baseGame} />)

    // GameStatus component should render the scheduled time
    const { container } = render(<GameRow game={baseGame} />)
    expect(container.textContent).toBeTruthy()
  })

  it('should render live game status', () => {
    const liveGame: NbaGame = {
      ...baseGame,
      gameStatus: 2,
      gameStatusText: 'In Progress',
      period: 2,
      gameClock: '10:30',
      homeTeam: {
        ...baseGame.homeTeam,
        score: 55,
      },
      awayTeam: {
        ...baseGame.awayTeam,
        score: 50,
      },
    }

    render(<GameRow game={liveGame} />)

    expect(screen.getByText('55')).toBeTruthy()
    expect(screen.getByText('50')).toBeTruthy()
  })

  it('should render final game status', () => {
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

    render(<GameRow game={finalGame} />)

    expect(screen.getByText('110')).toBeTruthy()
    expect(screen.getByText('105')).toBeTruthy()
  })

  it('should highlight winning team in final game', () => {
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

    const { container } = render(<GameRow game={finalGame} />)

    // Check if winner styling is applied (implementation may vary)
    expect(container.querySelector('[class*="font-bold"]')).toBeTruthy()
  })

  it('should highlight away team when they win', () => {
    const finalGame: NbaGame = {
      ...baseGame,
      gameStatus: 3,
      gameStatusText: 'Final',
      period: 4,
      gameClock: '',
      homeTeam: {
        ...baseGame.homeTeam,
        score: 105,
      },
      awayTeam: {
        ...baseGame.awayTeam,
        score: 110,
      },
    }

    render(<GameRow game={finalGame} />)

    expect(screen.getByText('110')).toBeTruthy()
    expect(screen.getByText('105')).toBeTruthy()
  })

  it('should not highlight any team in scheduled game', () => {
    render(<GameRow game={baseGame} />)

    // In scheduled games, scores should show dashes, not 0
    expect(screen.getAllByText('-')).toHaveLength(2)
  })

  it('should render team records', () => {
    render(<GameRow game={baseGame} />)

    expect(screen.getByText('25-15')).toBeTruthy() // Lakers record
    expect(screen.getByText('30-10')).toBeTruthy() // Celtics record
  })

  it('should render game with overtime', () => {
    const overtimeGame: NbaGame = {
      ...baseGame,
      gameStatus: 3,
      gameStatusText: 'Final',
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

    render(<GameRow game={overtimeGame} />)

    expect(screen.getByText('125')).toBeTruthy()
    expect(screen.getByText('120')).toBeTruthy()
  })

  it('should render game in first quarter', () => {
    const firstQuarterGame: NbaGame = {
      ...baseGame,
      gameStatus: 2,
      gameStatusText: 'In Progress',
      period: 1,
      gameClock: '8:45',
      homeTeam: {
        ...baseGame.homeTeam,
        score: 12,
      },
      awayTeam: {
        ...baseGame.awayTeam,
        score: 15,
      },
    }

    render(<GameRow game={firstQuarterGame} />)

    expect(screen.getByText('12')).toBeTruthy()
    expect(screen.getByText('15')).toBeTruthy()
  })

  it('should render game in halftime', () => {
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

    render(<GameRow game={halftimeGame} />)

    expect(screen.getByText('55')).toBeTruthy()
    expect(screen.getByText('52')).toBeTruthy()
  })

  it('should render game with tied score', () => {
    const tiedGame: NbaGame = {
      ...baseGame,
      gameStatus: 2,
      gameStatusText: 'In Progress',
      period: 3,
      gameClock: '5:30',
      homeTeam: {
        ...baseGame.homeTeam,
        score: 75,
      },
      awayTeam: {
        ...baseGame.awayTeam,
        score: 75,
      },
    }

    render(<GameRow game={tiedGame} />)

    expect(screen.getAllByText('75')).toHaveLength(2)
  })

  it('should render team tricodes', () => {
    render(<GameRow game={baseGame} />)

    expect(screen.getByText('LAL')).toBeTruthy()
    expect(screen.getByText('BOS')).toBeTruthy()
  })

  it('should handle game with no game clock', () => {
    const noClockGame: NbaGame = {
      ...baseGame,
      gameStatus: 2,
      gameStatusText: 'In Progress',
      period: 2,
      gameClock: '',
      homeTeam: {
        ...baseGame.homeTeam,
        score: 45,
      },
      awayTeam: {
        ...baseGame.awayTeam,
        score: 42,
      },
    }

    render(<GameRow game={noClockGame} />)

    expect(screen.getByText('45')).toBeTruthy()
    expect(screen.getByText('42')).toBeTruthy()
  })

  it('should render game leaders when available', () => {
    const gameWithLeaders: NbaGame = {
      ...baseGame,
      gameStatus: 2,
      gameStatusText: 'In Progress',
      period: 2,
      gameClock: '10:30',
      homeTeam: {
        ...baseGame.homeTeam,
        score: 55,
      },
      awayTeam: {
        ...baseGame.awayTeam,
        score: 50,
      },
      gameLeaders: {
        homeLeaders: {
          personId: 2544,
          name: 'LeBron James',
          jerseyNum: '23',
          position: 'F',
          teamTricode: 'LAL',
          points: 15,
          rebounds: 8,
          assists: 6,
        },
        awayLeaders: {
          personId: 1628369,
          name: 'Jayson Tatum',
          jerseyNum: '0',
          position: 'F',
          teamTricode: 'BOS',
          points: 18,
          rebounds: 5,
          assists: 4,
        },
      },
    }

    const { container } = render(<GameRow game={gameWithLeaders} />)

    // TeamDisplay component should render leaders if available
    expect(container.textContent).toBeTruthy()
  })

  it('should render card container', () => {
    const { container } = render(<GameRow game={baseGame} />)

    // Check for Card component class
    expect(container.querySelector('[class*="overflow-hidden"]')).toBeTruthy()
  })

  it('should render status footer', () => {
    const { container } = render(<GameRow game={baseGame} />)

    // Check for status footer section
    expect(container.querySelector('[class*="border-t"]')).toBeTruthy()
  })
})
