import type { APIRegistration } from '@getdashfy/types'
import { getErrorMessage, stringifyValue } from '@getdashfy/utils'

import type {
  BoxScoreResponse,
  GameCardFeedResponse,
  NbaConference,
  NbaGame,
  PlayoffBracketResponse,
  ScoreboardResponse,
  StandingsResponse,
} from './types'
import { formatDateForApi, getCurrentSeason, getTodayDate } from './utils'

const DEFAULT_API_PROXY_URL = 'https://proxy.boxscores.site'
const DEFAULT_TIMEOUT = 10_000

export interface NbaClientConfig {
  /**
   * Base URL for the NBA API proxy
   * @default https://proxy.boxscores.site
   */
  baseUrl?: string
  /**
   * Request timeout in milliseconds
   * @default 10_000
   */
  timeout?: number
}

/**
 * Creates an NBA API client for Dashfy.
 * The client uses a proxy to avoid rate limiting and CORS issues.
 *
 * @param config - Client configuration
 * @param config.baseUrl - Base URL for the NBA API proxy (default: https://proxy.boxscores.site)
 * @param config.timeout - Request timeout in milliseconds (default: 10_000)
 * @returns API registration function for Dashfy
 *
 * @example
 * ```ts
 * import { Dashfy } from '@getdashfy/server'
 * import { createNbaClient } from '@getdashfy/ext-nba'
 *
 * const dashfy = new Dashfy()
 * dashfy.registerApi('nba', createNbaClient())
 * ```
 */
export function createNbaClient(config: NbaClientConfig = {}): APIRegistration {
  const { baseUrl = DEFAULT_API_PROXY_URL, timeout = DEFAULT_TIMEOUT } = config

  return ({ logger, request }) => {
    if (!request) {
      throw new Error(
        '@getdashfy/ext-nba requires the request helper. Make sure you are using @getdashfy/server',
      )
    }

    /**
     * Build and execute a request to the NBA API.
     * First tries the direct API URL, then falls back to the proxy if it fails.
     */
    const buildRequest = async <T>(
      apiUrl: string,
      params?: Record<string, unknown>,
    ): Promise<T> => {
      // Build direct URL (prepend https://)
      const directUrl = new URL(`https://${apiUrl}`)

      // Build proxy URL
      const proxyUrl = new URL(baseUrl)
      proxyUrl.searchParams.set('apiUrl', apiUrl)

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            const stringValue = stringifyValue(value)

            if (stringValue !== '') {
              directUrl.searchParams.set(key, stringValue)
              proxyUrl.searchParams.set(key, stringValue)
            }
          }
        })
      }

      const paramsDebug = params ? `${JSON.stringify(params)}` : ''

      // Try direct URL first
      try {
        logger.info(`[nba] Fetching direct: ${directUrl.toString()}${paramsDebug}`)

        const data = await request({
          url: directUrl.toString(),
          method: 'GET',
          timeout,
        })

        return data as T
      } catch (_error) {
        // Fall back to proxy URL
        logger.info(
          `[nba] Direct request failed, falling back to proxy: ${proxyUrl.toString()}${paramsDebug}`,
        )

        try {
          const data = await request({
            url: proxyUrl.toString(),
            method: 'GET',
            timeout,
          })

          return data as T
        } catch (proxyError) {
          throw new Error(`NBA API error: ${getErrorMessage(proxyError)}`)
        }
      }
    }

    return {
      /**
       * Get today's games or games for a specific date.
       */
      games: async ({ date }: { date?: string }): Promise<ScoreboardResponse> => {
        // Date in YYYY-MM-DD format (defaults to today)
        const formattedDate = formatDateForApi(date ?? getTodayDate())

        if (date) {
          // TODO: Uncomment this when the API is fixed
          // const response = await buildRequest<{
          //   scoreboard: ScoreboardResponse['scoreboard']
          // }>('stats.nba.com/stats/scoreboardv3', {
          //   GameDate: formattedDate,
          //   LeagueID: '00',
          // })
          // return { scoreboard: response.scoreboard }

          const response = await buildRequest<{
            cards: GameCardFeedResponse['cards']
          }>('core-api.nba.com/cp/api/v1.9/feeds/gamecardfeed', {
            gamedate: formattedDate,
          })

          // Transform gamecardfeed response to our scoreboard format
          const games: NbaGame[] = response.cards.map((card) => ({
            gameId: card.cardData.gameId,
            gameCode: `${card.cardData.awayTeam.teamTricode}${card.cardData.homeTeam.teamTricode}`,
            gameStatus: card.cardData.gameStatus,
            gameStatusText: card.cardData.gameStatusText,
            period: card.cardData.period,
            gameClock: card.cardData.gameClock,
            gameTimeUTC: card.cardData.gameTimeUtc,
            gameEt: card.cardData.gameTimeUtc,
            regulationPeriods: 4,
            ifNecessary: false,
            seriesGameNumber: '',
            gameLabel: '',
            gameSubLabel: '',
            seriesText: '',
            homeTeam: {
              teamId: card.cardData.homeTeam.teamId,
              teamName: card.cardData.homeTeam.teamName,
              teamCity: '',
              teamTricode: card.cardData.homeTeam.teamTricode,
              teamSlug: card.cardData.homeTeam.teamSlug,
              wins: card.cardData.homeTeam.wins,
              losses: card.cardData.homeTeam.losses,
              score: card.cardData.homeTeam.score,
            },
            awayTeam: {
              teamId: card.cardData.awayTeam.teamId,
              teamName: card.cardData.awayTeam.teamName,
              teamCity: '',
              teamTricode: card.cardData.awayTeam.teamTricode,
              teamSlug: card.cardData.awayTeam.teamSlug,
              wins: card.cardData.awayTeam.wins,
              losses: card.cardData.awayTeam.losses,
              score: card.cardData.awayTeam.score,
            },
            gameLeaders: card.cardData.homeTeam.teamLeader &&
              card.cardData.awayTeam.teamLeader && {
                homeLeaders: {
                  personId: card.cardData.homeTeam.teamLeader.personId,
                  name: card.cardData.homeTeam.teamLeader.name,
                  jerseyNum: card.cardData.homeTeam.teamLeader.jerseyNum,
                  position: card.cardData.homeTeam.teamLeader.position,
                  teamTricode: card.cardData.homeTeam.teamTricode,
                  points: parseInt(card.cardData.homeTeam.teamLeader.points),
                  rebounds: parseInt(card.cardData.homeTeam.teamLeader.rebounds),
                  assists: parseInt(card.cardData.homeTeam.teamLeader.assists),
                },
                awayLeaders: {
                  personId: card.cardData.awayTeam.teamLeader.personId,
                  name: card.cardData.awayTeam.teamLeader.name,
                  jerseyNum: card.cardData.awayTeam.teamLeader.jerseyNum,
                  position: card.cardData.awayTeam.teamLeader.position,
                  teamTricode: card.cardData.awayTeam.teamTricode,
                  points: parseInt(card.cardData.awayTeam.teamLeader.points),
                  rebounds: parseInt(card.cardData.awayTeam.teamLeader.rebounds),
                  assists: parseInt(card.cardData.awayTeam.teamLeader.assists),
                },
              },
          }))

          return {
            scoreboard: {
              gameDate: formattedDate,
              leagueId: '00',
              leagueName: 'NBA',
              games,
            },
          }
        } else {
          const response = await buildRequest<{
            scoreboard: ScoreboardResponse['scoreboard']
          }>('cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json')
          return { scoreboard: response.scoreboard }
        }
      },

      /**
       * Get box score for a specific game.
       */
      boxScore: async ({ gameId }: { gameId: string }): Promise<BoxScoreResponse> => {
        const response = await buildRequest<{ game: BoxScoreResponse['game'] }>(
          `cdn.nba.com/static/json/liveData/boxscore/boxscore_${gameId}.json`,
        )

        return { game: response.game }
      },

      /**
       * Get league standings.
       */
      standings: async ({
        season = getCurrentSeason(), // Season year in YYYY-YY format (e.g., "2024-25")
        seasonType = 'Regular Season', // Season type (default: "Regular Season")
      }: {
        season?: string
        seasonType?: 'Regular Season' | 'Playoffs' | 'Pre Season'
      }): Promise<StandingsResponse> => {
        const response = await buildRequest<{
          resultSets: { rowSet: unknown[][] }[]
        }>('stats.nba.com/stats/leaguestandingsv3', {
          GroupBy: 'conf',
          LeagueID: '00',
          Season: season,
          SeasonType: seasonType,
          Section: 'overall',
        })

        // Transform the response to standings format
        const standings = response.resultSets[0]?.rowSet.map((row: unknown[]) => ({
          teamId: row[2] as number,
          leagueId: row[0] as string,
          seasonYear: row[1] as string,
          leagueRank: (row[16] as number | null) ?? 0,
          seasonType,
          teamCity: row[3] as string,
          teamName: row[4] as string,
          teamSlug: row[5] as string,
          conference: row[6] as NbaConference,
          conferenceRecord: row[7] as string,
          playoffRank: row[8] as number,
          clinchIndicator: row[9] as string,
          divisionRank: row[12] as number,
          divisionName: row[10] as string,
          record: `${String(row[13])}-${String(row[14])}`,
          home: row[18] as string,
          road: row[19] as string,
          l10: row[20] as string,
          longWinStreak: row[30] as number,
          longLossStreak: row[31] as number,
          currentStreak: row[37] as string,
          conferenceGamesBack: row[38] as number,
          clinchedConferenceTitle: row[40] as number,
          clinchedPlayoffBirth: row[42] as number,
          clinchedPlayIn: row[43] as number,
          eliminatedConference: row[44] as number,
          pointsPerGame: row[57] as number,
          opponentPointsPerGame: row[58] as number,
          diffPointsPerGame: row[59] as number,
        }))

        return { standings: standings ?? [] }
      },

      /**
       * Get playoff bracket.
       */
      playoffBracket: async ({
        season = String(new Date().getFullYear()), // Season year in YYYY format (e.g., "2024")
      }: {
        season?: string
      }): Promise<PlayoffBracketResponse> => {
        const response = await buildRequest<{
          bracket: PlayoffBracketResponse['bracket']
        }>('stats.nba.com/stats/playoffbracket', {
          SeasonYear: season,
          LeagueID: '00',
          State: '2',
        })

        return { bracket: response.bracket }
      },
    }
  }
}
