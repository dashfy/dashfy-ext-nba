import {
  useApiSubscription,
  Widget,
  WidgetBody,
  WidgetEmpty,
  WidgetError,
  WidgetErrorBoundary,
  WidgetHeader,
  WidgetLoader,
} from '@dashfy/ui'

import { BasketballIcon } from '@/components/common/Icons'
import type { ScoreboardResponse } from '@/types'

import { GameContent } from './GameContent'

export interface GameCardProps {
  /**
   * API subscription ID
   * @default 'nba'
   */
  api?: string
  /**
   * API endpoint to call
   * @default 'games'
   */
  endpoint?: string
  /**
   * Custom widget title
   * @default 'NBA'
   */
  title?: string
  /**
   * Custom widget subject
   * @default 'Game'
   */
  subject?: string
  /**
   * Game ID to display
   * @default '0022500672'
   */
  gameId?: string
  /**
   * Index of game to display if no gameId
   * @default 0
   */
  gameIndex?: number
  /**
   * Date in YYYY-MM-DD format (defaults to today)
   * @default today
   */
  date?: string
}

/**
 * Displays a single NBA game with scores.
 *
 * @example
 * ```json
 * {
 *   "extension": "nba",
 *   "widget": "GameCard",
 *   "api": "nba",
 *   "endpoint": "games",
 *   "title": "NBA",
 *   "subject": "Game",
 *   "gameId": "0022400123",
 *   "gameIndex": 0,
 *   "date": "2024-12-25"
 * }
 * ```
 *
 * @example
 * ```yaml
 * extension: nba
 * widget: GameCard
 * api: nba
 * endpoint: games
 * title: NBA
 * subject: Game
 * gameId: "0022400123"
 * gameIndex: 0
 * date: "2024-12-25"
 * ```
 *
 * @example
 * ```tsx
 * <GameCard
 *   api="nba"
 *   endpoint="games"
 *   title="NBA"
 *   subject="Game"
 *   gameId="0022400123"
 *   gameIndex=0
 *   date="2024-12-25"
 * />
 * ```
 */
export const GameCard = ({
  api = 'nba',
  endpoint = 'games',
  title = 'NBA',
  subject = 'Game',
  gameId,
  gameIndex = 0,
  date,
}: GameCardProps) => {
  const { data, error, loading } = useApiSubscription({
    api,
    endpoint,
    params: date ? { date } : undefined,
  })

  if (loading && !data) {
    return (
      <Widget>
        <WidgetHeader icon={<BasketballIcon />} subject={subject} title={title} />
        <WidgetBody>
          <WidgetLoader />
        </WidgetBody>
      </Widget>
    )
  }

  if (error) {
    return (
      <Widget>
        <WidgetHeader icon={<BasketballIcon />} subject={subject} title={title} />
        <WidgetBody>
          <WidgetError error={error} />
        </WidgetBody>
      </Widget>
    )
  }

  const scoreboardData = data as ScoreboardResponse
  const games = scoreboardData?.scoreboard?.games ?? []

  let game = games[gameIndex]

  if (gameId) {
    game = games.find((game) => game.gameId === gameId)
  }

  if (!game) {
    return (
      <Widget>
        <WidgetHeader icon={<BasketballIcon />} subject={subject} title={title} />
        <WidgetBody>
          <WidgetEmpty message="No game found" />
        </WidgetBody>
      </Widget>
    )
  }

  const displayTitle = title ?? `${game.awayTeam.teamTricode} x ${game.homeTeam.teamTricode}`

  return (
    <Widget>
      <WidgetHeader icon={<BasketballIcon />} subject={subject} title={displayTitle} />
      <WidgetBody>
        <WidgetErrorBoundary resetKeys={[game.gameId]}>
          <GameContent game={game} />
        </WidgetErrorBoundary>
      </WidgetBody>
    </Widget>
  )
}
