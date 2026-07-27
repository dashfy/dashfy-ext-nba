import { describe, expect, it, vi } from 'vitest'

import type { NbaConference, NbaGame } from './types'
import {
  CONFERENCES,
  filterStandingsByConference,
  formatDateForApi,
  formatGameTime,
  formatMinutes,
  formatWinPercentage,
  getConferenceDisplayName,
  getCurrentSeason,
  getGameStatusText,
  getTeamLogoUrl,
  getTeamLogoUrlById,
  getTodayDate,
  getWinPercentage,
  isGameFinal,
  isGameLive,
  isGameScheduled,
  sortStandingsByRank,
} from './utils'

describe('filterStandingsByConference', () => {
  const standings = [
    { conference: 'East' as NbaConference, playoffRank: 1, teamName: 'Celtics' },
    { conference: 'East' as NbaConference, playoffRank: 2, teamName: 'Knicks' },
    { conference: 'West' as NbaConference, playoffRank: 1, teamName: 'Lakers' },
    { conference: 'West' as NbaConference, playoffRank: 2, teamName: 'Warriors' },
  ]

  it('should filter by East conference', () => {
    const result = filterStandingsByConference(standings, 'East')
    expect(result).toHaveLength(2)
    expect(result[0]?.teamName).toBe('Celtics')
    expect(result[1]?.teamName).toBe('Knicks')
  })

  it('should filter by West conference', () => {
    const result = filterStandingsByConference(standings, 'West')
    expect(result).toHaveLength(2)
    expect(result[0]?.teamName).toBe('Lakers')
    expect(result[1]?.teamName).toBe('Warriors')
  })

  it('should return empty array when no matches', () => {
    const emptyStandings: { conference: NbaConference; playoffRank: number }[] = []
    const result = filterStandingsByConference(emptyStandings, 'East')
    expect(result).toHaveLength(0)
  })
})

describe('formatDateForApi', () => {
  it('should return date in correct format as-is', () => {
    expect(formatDateForApi('2024-01-15')).toBe('2024-01-15')
  })

  it('should format ISO date string', () => {
    expect(formatDateForApi('2024-01-15T10:00:00Z')).toBe('2024-01-15')
  })

  it('should format date string with time', () => {
    expect(formatDateForApi('2024-01-15T10:30:00')).toBe('2024-01-15')
  })

  it('should handle Date object string', () => {
    const isoString = '2024-01-15T12:00:00.000Z'
    expect(formatDateForApi(isoString)).toBe('2024-01-15')
  })

  it('should throw error for invalid date format', () => {
    expect(() => formatDateForApi('invalid-date')).toThrow('Invalid date format')
  })

  it('should handle empty string', () => {
    expect(() => formatDateForApi('')).toThrow('Invalid date format')
  })
})

describe('formatGameTime', () => {
  it('should format UTC time to local time', () => {
    const result = formatGameTime('2024-01-15T12:00:00Z')
    expect(result).toMatch(/\d{1,2}:\d{2} (AM|PM)/)
  })

  it('should format midnight UTC', () => {
    const result = formatGameTime('2024-01-15T00:00:00Z')
    expect(result).toBeTruthy()
  })

  it('should format noon UTC', () => {
    const result = formatGameTime('2024-01-15T12:00:00Z')
    expect(result).toBeTruthy()
  })
})

describe('formatMinutes', () => {
  it('should format ISO duration format', () => {
    expect(formatMinutes('PT12M34S')).toBe('12:34')
  })

  it('should format ISO duration with decimal seconds', () => {
    expect(formatMinutes('PT12M34.5S')).toBe('12:34')
  })

  it('should format single digit minutes', () => {
    expect(formatMinutes('PT5M30S')).toBe('5:30')
  })

  it('should format single digit seconds', () => {
    expect(formatMinutes('PT12M5S')).toBe('12:05')
  })

  it('should return already formatted string as-is', () => {
    expect(formatMinutes('12:34')).toBe('12:34')
  })

  it('should return 0:00 for empty string', () => {
    expect(formatMinutes('')).toBe('0:00')
  })

  it('should return 0:00 for invalid ISO format', () => {
    expect(formatMinutes('PT12M')).toBe('0:00')
  })

  it('should handle minutes only', () => {
    expect(formatMinutes('PT12M0S')).toBe('12:00')
  })
})

describe('formatWinPercentage', () => {
  it('should format win percentage correctly', () => {
    expect(formatWinPercentage('30-10')).toBe('75%')
  })

  it('should format 50% win rate', () => {
    expect(formatWinPercentage('20-20')).toBe('50%')
  })

  it('should format 0% win rate', () => {
    expect(formatWinPercentage('0-10')).toBe('0%')
  })

  it('should format 100% win rate', () => {
    expect(formatWinPercentage('10-0')).toBe('100%')
  })

  it('should round percentage correctly', () => {
    expect(formatWinPercentage('33-10')).toBe('77%') // 33/43 = 0.767...
  })
})

describe('getConferenceDisplayName', () => {
  it('should return Eastern Conference for East', () => {
    expect(getConferenceDisplayName('East')).toBe(CONFERENCES.EAST.display)
  })

  it('should return Western Conference for West', () => {
    expect(getConferenceDisplayName('West')).toBe(CONFERENCES.WEST.display)
  })
})

describe('getCurrentSeason', () => {
  it('should return season in YYYY-YY format', () => {
    const result = getCurrentSeason()
    expect(result).toMatch(/^\d{4}-\d{2}$/)
  })

  it('should handle season transition correctly', () => {
    // Mock October (month 9) - should be current season
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 9, 1)) // October 1, 2024
    expect(getCurrentSeason()).toBe('2024-25')
    vi.useRealTimers()
  })

  it('should handle pre-season correctly', () => {
    // Mock September (month 8) - should be previous season
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 8, 1)) // September 1, 2024
    expect(getCurrentSeason()).toBe('2023-24')
    vi.useRealTimers()
  })
})

describe('getGameStatusText', () => {
  it('should return Scheduled for status 1', () => {
    expect(getGameStatusText(1)).toBe('Scheduled')
  })

  it('should return In Progress for status 2', () => {
    expect(getGameStatusText(2)).toBe('In Progress')
  })

  it('should return Final for status 3', () => {
    expect(getGameStatusText(3)).toBe('Final')
  })

  it('should return Unknown for invalid status', () => {
    expect(getGameStatusText(99 as never)).toBe('Unknown')
  })
})

describe('getTeamLogoUrl', () => {
  it('should return correct logo URL for team tricode', () => {
    expect(getTeamLogoUrl('BOS')).toBe('https://cdn.nba.com/logos/nba/BOS/primary/L/logo.svg')
  })

  it('should handle different team tricodes', () => {
    expect(getTeamLogoUrl('LAL')).toBe('https://cdn.nba.com/logos/nba/LAL/primary/L/logo.svg')
  })
})

describe('getTeamLogoUrlById', () => {
  it('should return correct logo URL for team ID', () => {
    expect(getTeamLogoUrlById(1610612738)).toBe(
      'https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg',
    )
  })

  it('should handle different team IDs', () => {
    expect(getTeamLogoUrlById(1610612747)).toBe(
      'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg',
    )
  })
})

describe('getTodayDate', () => {
  it('should return date in YYYY-MM-DD format', () => {
    const result = getTodayDate()
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it("should return today's date", () => {
    const today = new Date()
    const expected = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    expect(getTodayDate()).toBe(expected)
  })
})

describe('getWinPercentage', () => {
  it('should calculate win percentage correctly', () => {
    expect(getWinPercentage('30-10')).toBe(0.75)
  })

  it('should calculate 50% win rate', () => {
    expect(getWinPercentage('20-20')).toBe(0.5)
  })

  it('should return 0 for 0 wins', () => {
    expect(getWinPercentage('0-10')).toBe(0)
  })

  it('should return 1 for 100% win rate', () => {
    expect(getWinPercentage('10-0')).toBe(1)
  })

  it('should return 0 for invalid record', () => {
    expect(getWinPercentage('invalid')).toBe(0)
  })

  it('should return 0 for empty record', () => {
    expect(getWinPercentage('')).toBe(0)
  })

  it('should return 0 for 0-0 record', () => {
    expect(getWinPercentage('0-0')).toBe(0)
  })
})

describe('isGameFinal', () => {
  it('should return true for final game', () => {
    const game: NbaGame = {
      gameId: '1',
      gameCode: 'BOSLAL',
      gameStatus: 3,
      gameStatusText: 'Final',
      period: 4,
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
        teamId: 1,
        teamName: 'Lakers',
        teamCity: 'Los Angeles',
        teamTricode: 'LAL',
        teamSlug: 'lakers',
        wins: 10,
        losses: 5,
        score: 100,
      },
      awayTeam: {
        teamId: 2,
        teamName: 'Celtics',
        teamCity: 'Boston',
        teamTricode: 'BOS',
        teamSlug: 'celtics',
        wins: 12,
        losses: 3,
        score: 95,
      },
    }
    expect(isGameFinal(game)).toBe(true)
  })

  it('should return false for non-final game', () => {
    const game: NbaGame = {
      gameId: '1',
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
        teamId: 1,
        teamName: 'Lakers',
        teamCity: 'Los Angeles',
        teamTricode: 'LAL',
        teamSlug: 'lakers',
        wins: 10,
        losses: 5,
        score: 0,
      },
      awayTeam: {
        teamId: 2,
        teamName: 'Celtics',
        teamCity: 'Boston',
        teamTricode: 'BOS',
        teamSlug: 'celtics',
        wins: 12,
        losses: 3,
        score: 0,
      },
    }
    expect(isGameFinal(game)).toBe(false)
  })
})

describe('isGameLive', () => {
  it('should return true for live game', () => {
    const game: NbaGame = {
      gameId: '1',
      gameCode: 'BOSLAL',
      gameStatus: 2,
      gameStatusText: 'In Progress',
      period: 2,
      gameClock: '10:30',
      gameTimeUTC: '2024-01-15T00:00:00Z',
      gameEt: '2024-01-15T00:00:00Z',
      regulationPeriods: 4,
      ifNecessary: false,
      seriesGameNumber: '',
      gameLabel: '',
      gameSubLabel: '',
      seriesText: '',
      homeTeam: {
        teamId: 1,
        teamName: 'Lakers',
        teamCity: 'Los Angeles',
        teamTricode: 'LAL',
        teamSlug: 'lakers',
        wins: 10,
        losses: 5,
        score: 50,
      },
      awayTeam: {
        teamId: 2,
        teamName: 'Celtics',
        teamCity: 'Boston',
        teamTricode: 'BOS',
        teamSlug: 'celtics',
        wins: 12,
        losses: 3,
        score: 45,
      },
    }
    expect(isGameLive(game)).toBe(true)
  })

  it('should return false for non-live game', () => {
    const game: NbaGame = {
      gameId: '1',
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
        teamId: 1,
        teamName: 'Lakers',
        teamCity: 'Los Angeles',
        teamTricode: 'LAL',
        teamSlug: 'lakers',
        wins: 10,
        losses: 5,
        score: 0,
      },
      awayTeam: {
        teamId: 2,
        teamName: 'Celtics',
        teamCity: 'Boston',
        teamTricode: 'BOS',
        teamSlug: 'celtics',
        wins: 12,
        losses: 3,
        score: 0,
      },
    }
    expect(isGameLive(game)).toBe(false)
  })
})

describe('isGameScheduled', () => {
  it('should return true for scheduled game', () => {
    const game: NbaGame = {
      gameId: '1',
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
        teamId: 1,
        teamName: 'Lakers',
        teamCity: 'Los Angeles',
        teamTricode: 'LAL',
        teamSlug: 'lakers',
        wins: 10,
        losses: 5,
        score: 0,
      },
      awayTeam: {
        teamId: 2,
        teamName: 'Celtics',
        teamCity: 'Boston',
        teamTricode: 'BOS',
        teamSlug: 'celtics',
        wins: 12,
        losses: 3,
        score: 0,
      },
    }
    expect(isGameScheduled(game)).toBe(true)
  })

  it('should return false for non-scheduled game', () => {
    const game: NbaGame = {
      gameId: '1',
      gameCode: 'BOSLAL',
      gameStatus: 2,
      gameStatusText: 'In Progress',
      period: 2,
      gameClock: '10:30',
      gameTimeUTC: '2024-01-15T00:00:00Z',
      gameEt: '2024-01-15T00:00:00Z',
      regulationPeriods: 4,
      ifNecessary: false,
      seriesGameNumber: '',
      gameLabel: '',
      gameSubLabel: '',
      seriesText: '',
      homeTeam: {
        teamId: 1,
        teamName: 'Lakers',
        teamCity: 'Los Angeles',
        teamTricode: 'LAL',
        teamSlug: 'lakers',
        wins: 10,
        losses: 5,
        score: 50,
      },
      awayTeam: {
        teamId: 2,
        teamName: 'Celtics',
        teamCity: 'Boston',
        teamTricode: 'BOS',
        teamSlug: 'celtics',
        wins: 12,
        losses: 3,
        score: 45,
      },
    }
    expect(isGameScheduled(game)).toBe(false)
  })
})

describe('sortStandingsByRank', () => {
  it('should sort standings by playoff rank', () => {
    const standings = [
      { playoffRank: 3, teamName: 'Third' },
      { playoffRank: 1, teamName: 'First' },
      { playoffRank: 2, teamName: 'Second' },
    ]

    const result = sortStandingsByRank(standings)
    expect(result[0]?.teamName).toBe('First')
    expect(result[1]?.teamName).toBe('Second')
    expect(result[2]?.teamName).toBe('Third')
  })

  it('should not mutate original array', () => {
    const standings = [
      { playoffRank: 3, teamName: 'Third' },
      { playoffRank: 1, teamName: 'First' },
    ]

    const original = [...standings]
    sortStandingsByRank(standings)
    expect(standings).toEqual(original)
  })

  it('should handle empty array', () => {
    const result = sortStandingsByRank([])
    expect(result).toHaveLength(0)
  })
})
