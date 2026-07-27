import { dateFns } from '@getdashfy/utils'

import type { GameStatus, NbaConference, NbaGame } from './types'

export const CONFERENCES = {
  EAST: {
    value: 'East',
    abbr: 'E',
    display: 'Eastern Conference',
  },
  WEST: {
    value: 'West',
    abbr: 'W',
    display: 'Western Conference',
  },
} as const

/**
 * Filter standings by conference.
 *
 * @param conference - The conference to filter by
 * @returns The filtered standings
 *
 * @example
 * ```ts
 * filterStandingsByConference(standings, 'East')
 * // => [
 * //   { name: 'Boston Celtics', conference: 'East', record: '30-10' },
 * //   { name: 'New York Knicks', conference: 'East', record: '25-15' },
 * // ]
 * ```
 */
export function filterStandingsByConference<T extends { conference: NbaConference }>(
  standings: T[],
  conference: NbaConference,
): T[] {
  return standings.filter((standing) => standing.conference === conference)
}

/**
 * Format date string for NBA API (YYYY-MM-DD).
 *
 * @param date - The date to format
 * @returns The formatted date string
 *
 * @example
 * ```ts
 * formatDateForApi('2024-01-01')
 * // => '2024-01-01'
 * ```
 */
export function formatDateForApi(date: string): string {
  // If already in correct format, return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date
  }

  // Try to parse as ISO first, then fallback to Date constructor
  let parsed = dateFns.parseISO(date)
  if (!dateFns.isValid(parsed)) {
    parsed = new Date(date)
    if (!dateFns.isValid(parsed)) {
      throw new Error(`Invalid date format: ${date}`)
    }
  }

  return dateFns.format(parsed, 'yyyy-MM-dd')
}

/**
 * Format game time for display.
 * Converts UTC time to local time.
 *
 * @param gameTimeUTC - The UTC time to format
 * @returns The formatted game time string
 *
 * @example
 * ```ts
 * formatGameTime('2024-01-01T00:00:00Z')
 * // => '12:00 AM'
 * ```
 */
export function formatGameTime(gameTimeUTC: string): string {
  const date = dateFns.parseISO(gameTimeUTC)
  return dateFns.format(date, 'h:mm a')
}

/**
 * Format player minutes for display.
 * Converts "PT12M34S" format to "12:34".
 *
 * @param minutes - The minutes to format
 * @returns The formatted minutes string
 *
 * @example
 * ```ts
 * formatMinutes('PT12M34S')
 * // => '12:34'
 * ```
 */
export function formatMinutes(minutes: string): string {
  if (!minutes) {
    return '0:00'
  }

  // Handle ISO duration format (PT12M34S)
  if (minutes.startsWith('PT')) {
    const match = /PT(\d+)M(\d+(?:\.\d+)?)S/.exec(minutes)

    if (match) {
      const mins = match[1]
      const secs = Math.floor(parseFloat(match[2] ?? '0'))
      return `${mins}:${String(secs).padStart(2, '0')}`
    }

    return '0:00'
  }

  // Already in correct format
  return minutes
}

/**
 * Format win percentage for display.
 *
 * @param record - The record to format
 * @returns The formatted win percentage string
 *
 * @example
 * ```ts
 * formatWinPercentage('30-10')
 * // => '75%'
 * ```
 */
export function formatWinPercentage(record: string): string {
  const pct = getWinPercentage(record)
  return `${Math.round(pct * 100)}%`
}

/**
 * Get conference display name.
 *
 * @param conference - The conference to get the display name for
 * @returns The display name of the conference
 *
 * @example
 * ```ts
 * getConferenceDisplayName('East')
 * // => 'Eastern Conference'
 * ```
 */
export function getConferenceDisplayName(conference: NbaConference): string {
  return conference === CONFERENCES.EAST.value ? CONFERENCES.EAST.display : CONFERENCES.WEST.display
}

/**
 * Get the current NBA season in YYYY-YY format.
 * NBA season starts in October.
 *
 * @returns The current NBA season in YYYY-YY format
 *
 * @example
 * ```ts
 * getCurrentSeason()
 * // => '2024-25'
 * ```
 */
export function getCurrentSeason(): string {
  const today = new Date()
  const year = dateFns.getYear(today)
  const month = dateFns.getMonth(today) // 0-indexed

  // NBA season starts in October (month 9)
  // If before October, we're in the previous season
  const seasonStartYear = month < 9 ? year - 1 : year
  const seasonEndYear = seasonStartYear + 1

  return `${seasonStartYear}-${String(seasonEndYear).slice(-2)}`
}

/**
 * Get game status text.
 *
 * @param status - The game status to get the text for
 * @returns The text for the game status
 *
 * @example
 * ```ts
 * getGameStatusText(1)
 * // => 'Scheduled'
 * ```
 */
export function getGameStatusText(status: GameStatus): string {
  switch (status) {
    case 1:
      return 'Scheduled'
    case 2:
      return 'In Progress'
    case 3:
      return 'Final'
    default:
      return 'Unknown'
  }
}

/**
 * Get team logo URL.
 *
 * @param teamTricode - The team tricode to get the logo URL for
 * @returns The logo URL for the team
 */
export function getTeamLogoUrl(teamTricode: string): string {
  if (!teamTricode) {
    return 'https://cdn.nba.com/logos/nba/fallback.svg'
  }

  return `https://cdn.nba.com/logos/nba/${teamTricode}/primary/L/logo.svg`
}

/**
 * Get team logo URL by team ID.
 *
 * @param teamId - The team ID to get the logo URL for
 * @returns The logo URL for the team
 */
export function getTeamLogoUrlById(teamId: number): string {
  if (!teamId) {
    return 'https://cdn.nba.com/logos/nba/fallback.svg'
  }

  return `https://cdn.nba.com/logos/nba/${teamId}/primary/L/logo.svg`
}

/**
 * Get today's date in YYYY-MM-DD format.
 *
 * @returns The today's date in YYYY-MM-DD format
 *
 * @example
 * ```ts
 * getTodayDate()
 * // => '2024-01-01'
 * ```
 */
export function getTodayDate(): string {
  return dateFns.format(new Date(), 'yyyy-MM-dd')
}

/**
 * Get win percentage from record string "W-L".
 *
 * @param record - The record to get the win percentage for
 * @returns The win percentage
 *
 * @example
 * ```ts
 * getWinPercentage('30-10')
 * // => 0.75
 * ```
 */
export function getWinPercentage(record: string): number {
  const [winsStr, lossesStr] = record.split('-')
  const wins = Number(winsStr)
  const losses = Number(lossesStr)

  if (isNaN(wins) || isNaN(losses) || wins + losses === 0) {
    return 0
  }

  return wins / (wins + losses)
}

/**
 * Check if a game has finished.
 *
 * @param game - The game to check if it has finished
 * @returns True if the game has finished, false otherwise
 *
 * @example
 * ```ts
 * isGameFinal(game)
 * // => true
 * ```
 */
export function isGameFinal(game: NbaGame): boolean {
  return game.gameStatus === 3
}

/**
 * Check if a game is live.
 *
 * @param game - The game to check if it is live
 * @returns True if the game is live, false otherwise
 *
 * @example
 * ```ts
 * isGameLive(game)
 * // => true
 * ```
 */
export function isGameLive(game: NbaGame): boolean {
  return game.gameStatus === 2
}

/**
 * Check if a game hasn't started yet.
 *
 * @param game - The game to check if it hasn't started yet
 * @returns True if the game hasn't started yet, false otherwise
 *
 * @example
 * ```ts
 * isGameScheduled(game)
 * // => true
 * ```
 */
export function isGameScheduled(game: NbaGame): boolean {
  return game.gameStatus === 1
}

/**
 * Sort standings by conference rank.
 *
 * @param standings - The standings to sort
 * @returns The sorted standings
 *
 * @example
 * ```ts
 * sortStandingsByRank(standings)
 * // => [
 * //   { name: 'Boston Celtics', conference: 'East', record: '30-10' },
 * //   { name: 'New York Knicks', conference: 'East', record: '25-15' },
 * // ]
 * ```
 */
export function sortStandingsByRank<T extends { playoffRank: number }>(standings: T[]): T[] {
  return [...standings].sort((a, b) => a.playoffRank - b.playoffRank)
}
