import { describe, expect, it, vi } from 'vitest'

import { createNbaClient } from './client'
import type { BoxScoreResponse, ScoreboardResponse, StandingsResponse } from './types'

const mockLogger = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
}

describe('createNbaClient', () => {
  it('should create a client with default config', () => {
    const client = createNbaClient({})
    expect(client).toBeDefined()
    expect(typeof client).toBe('function')
  })

  it('should create a client with custom config', () => {
    const client = createNbaClient({
      baseUrl: 'https://custom-proxy.example.com',
      timeout: 5000,
    })
    expect(client).toBeDefined()
  })

  it('should throw error when request helper is not provided', () => {
    const client = createNbaClient({})
    expect(() => {
      client({ logger: mockLogger, request: undefined })
    }).toThrow('@getdashfy/ext-nba requires the request helper')
  })

  describe('games endpoint', () => {
    it("should fetch today's games", async () => {
      const mockScoreboard = {
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
      }
      const mockRequest = vi.fn().mockResolvedValue(mockScoreboard)
      const client = createNbaClient({})
      const api = client({ logger: mockLogger, request: mockRequest })

      const result = (await api.games!({})) as ScoreboardResponse

      expect(mockRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining(
            'cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json',
          ),
          method: 'GET',
        }),
      )
      expect(result.scoreboard.games).toHaveLength(1)
    })

    it('should fetch games for specific date', async () => {
      const mockGameCards = {
        cards: [
          {
            cardData: {
              gameId: '0022300001',
              period: 0,
              gameStatus: 1,
              gameStatusText: 'Scheduled',
              gameClock: '',
              gameTimeUtc: '2024-01-15T00:00:00Z',
              homeTeam: {
                teamId: 1610612747,
                teamName: 'Lakers',
                teamTricode: 'LAL',
                teamSlug: 'lakers',
                wins: 25,
                losses: 15,
                score: 0,
              },
              awayTeam: {
                teamId: 1610612738,
                teamName: 'Celtics',
                teamTricode: 'BOS',
                teamSlug: 'celtics',
                wins: 30,
                losses: 10,
                score: 0,
              },
            },
          },
        ],
      }
      const mockRequest = vi.fn().mockResolvedValue(mockGameCards)
      const client = createNbaClient({})
      const api = client({ logger: mockLogger, request: mockRequest })

      const result = (await api.games!({ date: '2024-01-15' })) as ScoreboardResponse

      expect(mockRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('core-api.nba.com/cp/api/v1.9/feeds/gamecardfeed'),
          method: 'GET',
        }),
      )
      expect(result.scoreboard.games).toHaveLength(1)
      expect(result.scoreboard.gameDate).toBe('2024-01-15')
    })

    it('should handle games with team leaders', async () => {
      const mockGameCards = {
        cards: [
          {
            cardData: {
              gameId: '0022300001',
              period: 2,
              gameStatus: 2,
              gameStatusText: 'In Progress',
              gameClock: '10:30',
              gameTimeUtc: '2024-01-15T00:00:00Z',
              homeTeam: {
                teamId: 1610612747,
                teamName: 'Lakers',
                teamTricode: 'LAL',
                teamSlug: 'lakers',
                wins: 25,
                losses: 15,
                score: 55,
                teamLeader: {
                  personId: 2544,
                  name: 'LeBron James',
                  jerseyNum: '23',
                  position: 'F',
                  points: '15',
                  rebounds: '8',
                  assists: '6',
                },
              },
              awayTeam: {
                teamId: 1610612738,
                teamName: 'Celtics',
                teamTricode: 'BOS',
                teamSlug: 'celtics',
                wins: 30,
                losses: 10,
                score: 50,
                teamLeader: {
                  personId: 1628369,
                  name: 'Jayson Tatum',
                  jerseyNum: '0',
                  position: 'F',
                  points: '18',
                  rebounds: '5',
                  assists: '4',
                },
              },
            },
          },
        ],
      }
      const mockRequest = vi.fn().mockResolvedValue(mockGameCards)
      const client = createNbaClient({})
      const api = client({ logger: mockLogger, request: mockRequest })

      const result = (await api.games!({ date: '2024-01-15' })) as ScoreboardResponse

      expect(result.scoreboard.games[0]?.gameLeaders).toBeDefined()
      expect(result.scoreboard.games[0]?.gameLeaders?.homeLeaders.name).toBe('LeBron James')
      expect(result.scoreboard.games[0]?.gameLeaders?.awayLeaders.name).toBe('Jayson Tatum')
    })

    it('should fall back to proxy on direct request failure', async () => {
      const mockScoreboard = {
        scoreboard: {
          gameDate: '2024-01-15',
          leagueId: '00',
          leagueName: 'NBA',
          games: [],
        },
      }
      const mockRequest = vi
        .fn()
        .mockRejectedValueOnce(new Error('Direct request failed'))
        .mockResolvedValueOnce(mockScoreboard)

      const client = createNbaClient({})
      const api = client({ logger: mockLogger, request: mockRequest })

      const result = await api.games!({})

      expect(mockRequest).toHaveBeenCalledTimes(2)
      expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining('falling back to proxy'))
      expect(result).toEqual(mockScoreboard)
    })
  })

  describe('boxScore endpoint', () => {
    it('should fetch box score for a game', async () => {
      const mockBoxScore = {
        game: {
          gameId: '0022300001',
          gameTimeLocal: '2024-01-15T19:00:00',
          gameTimeUTC: '2024-01-15T00:00:00Z',
          gameTimeHome: '2024-01-15T19:00:00',
          gameTimeAway: '2024-01-15T22:00:00',
          gameEt: '2024-01-15T19:00:00',
          duration: 120,
          gameCode: 'BOSLAL',
          gameStatusText: 'Final',
          gameStatus: 3,
          regulationPeriods: 4,
          period: 4,
          gameClock: '',
          attendance: 18997,
          sellout: '1',
          arena: {
            arenaId: 1,
            arenaName: 'Crypto.com Arena',
            arenaCity: 'Los Angeles',
            arenaState: 'CA',
            arenaCountry: 'USA',
            arenaTimezone: 'America/Los_Angeles',
          },
          officials: [],
          homeTeam: {
            teamId: 1610612747,
            teamName: 'Lakers',
            teamCity: 'Los Angeles',
            teamTricode: 'LAL',
            score: 110,
            inBonus: '0',
            timeoutsRemaining: 0,
            periods: [],
            players: [],
            statistics: {} as never,
          },
          awayTeam: {
            teamId: 1610612738,
            teamName: 'Celtics',
            teamCity: 'Boston',
            teamTricode: 'BOS',
            score: 105,
            inBonus: '0',
            timeoutsRemaining: 0,
            periods: [],
            players: [],
            statistics: {} as never,
          },
        },
      }
      const mockRequest = vi.fn().mockResolvedValue(mockBoxScore)
      const client = createNbaClient({})
      const api = client({ logger: mockLogger, request: mockRequest })

      const result = (await api.boxScore!({ gameId: '0022300001' })) as BoxScoreResponse

      expect(mockRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining(
            'cdn.nba.com/static/json/liveData/boxscore/boxscore_0022300001.json',
          ),
          method: 'GET',
        }),
      )
      expect(result.game.gameId).toBe('0022300001')
      expect(result.game.homeTeam.score).toBe(110)
      expect(result.game.awayTeam.score).toBe(105)
    })
  })

  describe('standings endpoint', () => {
    it('should fetch league standings', async () => {
      const mockStandingsResponse = {
        resultSets: [
          {
            rowSet: [
              [
                '00', // leagueId
                '2024-25', // seasonYear
                1610612738, // teamId
                'Boston', // teamCity
                'Celtics', // teamName
                'celtics', // teamSlug
                'East', // conference
                '20-5', // conferenceRecord
                1, // playoffRank
                '', // clinchIndicator
                'Atlantic', // divisionName
                null,
                1, // divisionRank
                30, // wins
                10, // losses
                null,
                0.75, // winPct
                null,
                '15-5', // home
                '15-5', // road
                '7-3', // l10
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                5, // longWinStreak
                2, // longLossStreak
                null,
                null,
                null,
                null,
                null,
                null,
                'W5', // currentStreak
                0, // conferenceGamesBack
                null,
                0, // clinchedConferenceTitle
                null,
                0, // clinchedPlayoffBirth
                0, // clinchedPlayIn
                0, // eliminatedConference
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                115.5, // pointsPerGame
                108.2, // opponentPointsPerGame
                7.3, // diffPointsPerGame
              ],
            ],
          },
        ],
      }
      const mockRequest = vi.fn().mockResolvedValue(mockStandingsResponse)
      const client = createNbaClient({})
      const api = client({ logger: mockLogger, request: mockRequest })

      const result = (await api.standings!({})) as StandingsResponse

      expect(mockRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('stats.nba.com/stats/leaguestandingsv3'),
          method: 'GET',
        }),
      )
      expect(result.standings).toHaveLength(1)
      expect(result.standings[0]?.teamName).toBe('Celtics')
      expect(result.standings[0]?.conference).toBe('East')
      expect(result.standings[0]?.record).toBe('30-10')
    })

    it('should support custom season parameter', async () => {
      const mockRequest = vi.fn().mockResolvedValue({ resultSets: [{ rowSet: [] }] })
      const client = createNbaClient({})
      const api = client({ logger: mockLogger, request: mockRequest })

      await api.standings!({ season: '2023-24' })

      expect(mockRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('Season=2023-24'),
        }),
      )
    })

    it('should support season type parameter', async () => {
      const mockRequest = vi.fn().mockResolvedValue({ resultSets: [{ rowSet: [] }] })
      const client = createNbaClient({})
      const api = client({ logger: mockLogger, request: mockRequest })

      await api.standings!({ seasonType: 'Playoffs' })

      expect(mockRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('SeasonType=Playoffs'),
        }),
      )
    })

    it('should return empty array when no standings', async () => {
      const mockRequest = vi.fn().mockResolvedValue({ resultSets: [] })
      const client = createNbaClient({})
      const api = client({ logger: mockLogger, request: mockRequest })

      const result = (await api.standings!({})) as StandingsResponse

      expect(result.standings).toEqual([])
    })
  })

  describe('playoffBracket endpoint', () => {
    it('should fetch playoff bracket', async () => {
      const mockBracket = {
        bracket: {
          seasonYear: '2024',
          leagueId: '00',
          series: [
            {
              seriesId: '1',
              roundNumber: 1,
              seriesNumber: 1,
              seriesConference: 'East',
              seriesText: 'First Round',
              highSeedTricode: 'BOS',
              highSeedId: 1610612738,
              highSeedName: 'Celtics',
              highSeedWins: 4,
              lowSeedTricode: 'MIA',
              lowSeedId: 1610612748,
              lowSeedName: 'Heat',
              lowSeedWins: 1,
              seriesWinner: 1610612738,
            },
          ],
        },
      }
      const mockRequest = vi.fn().mockResolvedValue(mockBracket)
      const client = createNbaClient({})
      const api = client({ logger: mockLogger, request: mockRequest })

      const result = (await api.playoffBracket!({})) as typeof mockBracket

      expect(mockRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('stats.nba.com/stats/playoffbracket'),
          method: 'GET',
        }),
      )
      expect(result.bracket.series).toHaveLength(1)
      expect(result.bracket.series[0]?.seriesConference).toBe('East')
    })

    it('should support custom season parameter', async () => {
      const mockRequest = vi.fn().mockResolvedValue({ bracket: { series: [] } })
      const client = createNbaClient({})
      const api = client({ logger: mockLogger, request: mockRequest })

      await api.playoffBracket!({ season: '2023' })

      expect(mockRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('SeasonYear=2023'),
        }),
      )
    })
  })

  describe('error handling', () => {
    it('should throw error on API failure', async () => {
      const mockRequest = vi.fn().mockRejectedValue(new Error('Network error'))
      const client = createNbaClient({})
      const api = client({ logger: mockLogger, request: mockRequest })

      await expect(api.games!({})).rejects.toThrow('NBA API error: Network error')
    })

    it('should throw error when both direct and proxy requests fail', async () => {
      const mockRequest = vi
        .fn()
        .mockRejectedValueOnce(new Error('Direct failed'))
        .mockRejectedValueOnce(new Error('Proxy failed'))

      const client = createNbaClient({})
      const api = client({ logger: mockLogger, request: mockRequest })

      await expect(api.games!({})).rejects.toThrow('NBA API error')
    })
  })

  describe('custom baseUrl', () => {
    it('should use custom base URL for proxy', async () => {
      const mockRequest = vi
        .fn()
        .mockRejectedValueOnce(new Error('Direct failed'))
        .mockResolvedValueOnce({ scoreboard: { games: [] } })

      const client = createNbaClient({ baseUrl: 'https://custom-proxy.example.com' })
      const api = client({ logger: mockLogger, request: mockRequest })

      await api.games!({})

      expect(mockRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('custom-proxy.example.com'),
        }),
      )
    })
  })

  describe('timeout configuration', () => {
    it('should use custom timeout', async () => {
      const mockRequest = vi.fn().mockResolvedValue({ scoreboard: { games: [] } })
      const client = createNbaClient({ timeout: 5000 })
      const api = client({ logger: mockLogger, request: mockRequest })

      await api.games!({})

      expect(mockRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          timeout: 5000,
        }),
      )
    })
  })
})
