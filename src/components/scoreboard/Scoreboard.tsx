import {
  generateReactKey,
  useApiSubscription,
  Widget,
  WidgetBody,
  WidgetEmpty,
  WidgetError,
  WidgetErrorBoundary,
  WidgetHeader,
  WidgetLoader,
} from '@getdashfy/ui'

import { BasketballIcon } from '@/components/common/Icons'
import type { ScoreboardResponse } from '@/types'

import { GameRow } from './GameRow'

export interface ScoreboardProps {
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
   * @default 'Scoreboard'
   */
  subject?: string
  /**
   * Date in YYYY-MM-DD format (defaults to today)
   * @default today
   */
  date?: string
}

/**
 * Displays NBA games for a given day with live scores and status.
 *
 * @example
 * ```yaml
 * - extension: nba
 *   widget: Scoreboard
 *   date: "2024-12-25"
 * ```
 */
export const Scoreboard = ({
  api = 'nba',
  endpoint = 'games',
  title = 'NBA',
  subject = 'Scoreboard',
  date,
}: ScoreboardProps) => {
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
  const games = scoreboardData?.scoreboard?.games || []
  const gameDate = scoreboardData?.scoreboard?.gameDate
  const resetKeys = [gameDate ?? '', games.length, games[0]?.gameId ?? '']

  return (
    <Widget>
      <WidgetHeader
        count={games.length}
        icon={<BasketballIcon />}
        subject={subject}
        title={title}
      />
      <WidgetBody scrollable>
        <WidgetErrorBoundary resetKeys={resetKeys}>
          {games.length === 0 ? (
            <WidgetEmpty message={`No games ${gameDate ? `on ${gameDate}` : 'today'}`} />
          ) : (
            <div className="divide-border/50 divide-y">
              {games.map((game) => (
                <GameRow key={generateReactKey('game', game.gameId)} game={game} />
              ))}
            </div>
          )}
        </WidgetErrorBoundary>
      </WidgetBody>
    </Widget>
  )
}
