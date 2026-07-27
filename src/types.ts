export type GameStatus = 1 | 2 | 3 // 1=Not Started, 2=In Progress, 3=Final

export type NbaConference = 'East' | 'West'
export type NbaConferenceFilter = NbaConference | 'both'

export interface NbaTeam {
  teamId: number
  teamName: string
  teamCity: string
  teamTricode: string
  teamSlug: string
  wins: number
  losses: number
  score: number
  seed?: number
}

export interface NbaPeriodScore {
  period: number
  periodType: string
  score: number
}

export interface NbaGame {
  gameId: string
  gameCode: string
  gameStatus: GameStatus
  gameStatusText: string
  period: number
  gameClock: string
  gameTimeUTC: string
  gameEt: string
  regulationPeriods: number
  ifNecessary: boolean
  seriesGameNumber: string
  gameLabel: string
  gameSubLabel: string
  seriesText: string
  homeTeam: NbaTeam
  awayTeam: NbaTeam
  gameLeaders?: NbaGameLeaders
}

export interface NbaGameLeaders {
  homeLeaders: NbaPlayerLeader
  awayLeaders: NbaPlayerLeader
}

export interface NbaPlayerLeader {
  personId: number
  name: string
  jerseyNum: string
  position: string
  teamTricode: string
  points: number
  rebounds: number
  assists: number
}

export interface NbaScoreboard {
  gameDate: string
  leagueId: string
  leagueName: string
  games: NbaGame[]
}

export interface ScoreboardResponse {
  scoreboard: NbaScoreboard
}

export interface NbaBoxScore {
  gameId: string
  gameTimeLocal: string
  gameTimeUTC: string
  gameTimeHome: string
  gameTimeAway: string
  gameEt: string
  duration: number
  gameCode: string
  gameStatusText: string
  gameStatus: GameStatus
  regulationPeriods: number
  period: number
  gameClock: string
  attendance: number
  sellout: string
  arena: NbaArena
  officials: NbaOfficial[]
  homeTeam: NbaBoxScoreTeam
  awayTeam: NbaBoxScoreTeam
}

export interface NbaArena {
  arenaId: number
  arenaName: string
  arenaCity: string
  arenaState: string
  arenaCountry: string
  arenaTimezone: string
}

export interface NbaOfficial {
  personId: number
  name: string
  nameI: string
  firstName: string
  familyName: string
  jerseyNum: string
  assignment: string
}

export interface NbaBoxScoreTeam {
  teamId: number
  teamName: string
  teamCity: string
  teamTricode: string
  score: number
  inBonus: string
  timeoutsRemaining: number
  periods: NbaPeriodScore[]
  players: NbaPlayerStats[]
  statistics: NbaTeamStatistics
}

export interface NbaPlayerStats {
  status: string
  order: number
  personId: number
  jerseyNum: string
  position: string
  starter: string
  oncourt: string
  played: string
  statistics: NbaPlayerStatistics
  name: string
  nameI: string
  firstName: string
  familyName: string
  notPlayingReason: string
  notPlayingDescription: string
}

export interface NbaPlayerStatistics {
  assists: number
  blocks: number
  blocksReceived: number
  fieldGoalsAttempted: number
  fieldGoalsMade: number
  fieldGoalsPercentage: number
  foulsOffensive: number
  foulsDrawn: number
  foulsPersonal: number
  foulsTechnical: number
  freeThrowsAttempted: number
  freeThrowsMade: number
  freeThrowsPercentage: number
  minus: number
  minutes: string
  minutesCalculated: string
  plus: number
  plusMinusPoints: number
  points: number
  pointsFastBreak: number
  pointsInThePaint: number
  pointsSecondChance: number
  reboundsDefensive: number
  reboundsOffensive: number
  reboundsTotal: number
  steals: number
  threePointersAttempted: number
  threePointersMade: number
  threePointersPercentage: number
  turnovers: number
  twoPointersAttempted: number
  twoPointersMade: number
  twoPointersPercentage: number
}

export interface NbaTeamStatistics {
  assists: number
  assistsTurnoverRatio: number
  benchPoints: number
  biggestLead: number
  biggestLeadScore: string
  biggestScoringRun: number
  biggestScoringRunScore: string
  blocks: number
  blocksReceived: number
  fastBreakPointsAttempted: number
  fastBreakPointsMade: number
  fastBreakPointsPercentage: number
  fieldGoalsAttempted: number
  fieldGoalsEffectiveAdjusted: number
  fieldGoalsMade: number
  fieldGoalsPercentage: number
  foulsOffensive: number
  foulsDrawn: number
  foulsPersonal: number
  foulsTeam: number
  foulsTechnical: number
  foulsTeamTechnical: number
  freeThrowsAttempted: number
  freeThrowsMade: number
  freeThrowsPercentage: number
  leadChanges: number
  minutes: string
  minutesCalculated: string
  points: number
  pointsAgainst: number
  pointsFastBreak: number
  pointsFromTurnovers: number
  pointsInThePaint: number
  pointsInThePaintAttempted: number
  pointsInThePaintMade: number
  pointsInThePaintPercentage: number
  pointsSecondChance: number
  reboundsDefensive: number
  reboundsOffensive: number
  reboundsPersonal: number
  reboundsTeam: number
  reboundsTeamDefensive: number
  reboundsTeamOffensive: number
  reboundsTotal: number
  secondChancePointsAttempted: number
  secondChancePointsMade: number
  secondChancePointsPercentage: number
  steals: number
  threePointersAttempted: number
  threePointersMade: number
  threePointersPercentage: number
  timeLeading: string
  timesTied: number
  trueShootingAttempts: number
  trueShootingPercentage: number
  turnovers: number
  turnoversTeam: number
  turnoversTotal: number
  twoPointersAttempted: number
  twoPointersMade: number
  twoPointersPercentage: number
}

export interface BoxScoreResponse {
  game: NbaBoxScore
}

export interface NbaStanding {
  teamId: number
  leagueId: string
  seasonYear: string
  leagueRank: number
  seasonType: string
  teamCity: string
  teamName: string
  teamSlug: string
  conference: NbaConference
  conferenceRecord: string
  playoffRank: number
  clinchIndicator: string
  divisionRank: number
  divisionName: string
  record: string
  home: string
  road: string
  l10: string
  longWinStreak: number
  longLossStreak: number
  currentStreak: string
  conferenceGamesBack: number
  clinchedConferenceTitle: number
  clinchedPlayoffBirth: number
  clinchedPlayIn: number
  eliminatedConference: number
  pointsPerGame: number
  opponentPointsPerGame: number
  diffPointsPerGame: number
}

export interface StandingsResponse {
  standings: NbaStanding[]
}

export interface NbaPlayoffSeries {
  seriesId: string
  roundNumber: number
  seriesNumber: number
  seriesConference: string
  seriesText: string
  highSeedTricode: string
  highSeedId: number
  highSeedName: string
  highSeedWins: number
  lowSeedTricode: string
  lowSeedId: number
  lowSeedName: string
  lowSeedWins: number
  seriesWinner: number
}

export interface NbaPlayoffBracket {
  seasonYear: string
  leagueId: string
  series: NbaPlayoffSeries[]
}

export interface PlayoffBracketResponse {
  bracket: NbaPlayoffBracket
}

export interface GameCardFeedResponse {
  cards: NbaGameCard[]
}

export interface NbaGameCard {
  cardData: NbaGameCardData
}

export interface NbaGameCardData {
  gameId: string
  period: number
  gameStatus: GameStatus
  gameStatusText: string
  gameClock: string
  gameTimeUtc: string
  homeTeam: NbaGameCardTeam
  awayTeam: NbaGameCardTeam
}

export interface NbaGameCardTeam {
  teamId: number
  teamName: string
  teamTricode: string
  teamSlug: string
  wins: number
  losses: number
  score: number
  periods: NbaGameCardPeriod[]
  teamLeader?: NbaGameCardTeamLeader
}

export interface NbaGameCardPeriod {
  period: number
  score: number
}

export interface NbaGameCardTeamLeader {
  personId: number
  name: string
  jerseyNum: string
  position: string
  points: string
  rebounds: string
  assists: string
}
