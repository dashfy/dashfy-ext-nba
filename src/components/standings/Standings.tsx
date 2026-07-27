import {
  useApiSubscription,
  Widget,
  WidgetBody,
  WidgetError,
  WidgetErrorBoundary,
  WidgetHeader,
  WidgetLoader,
} from '@dashfy/ui'
import { TrophyIcon } from 'lucide-react'

import type { NbaConferenceFilter, StandingsResponse } from '@/types'
import { CONFERENCES, filterStandingsByConference } from '@/utils'

import { StandingsTable } from './StandingsTable'

export interface StandingsProps {
  /**
   * API subscription ID
   * @default 'nba'
   */
  api?: string
  /**
   * API endpoint to call
   * @default 'standings'
   */
  endpoint?: string
  /**
   * Custom widget title
   * @default 'NBA'
   */
  title?: string
  /**
   * Custom widget subject
   * @default 'Standings'
   */
  subject?: string
  /**
   * Conference to display
   * @default 'both'
   */
  conference?: NbaConferenceFilter
  /**
   * Season in YYYY-YY format
   * @default current year
   */
  season?: string
  /**
   * Number of teams to show per conference
   * @default 15
   */
  limit?: number
}

/**
 * Displays the standings for the NBA.
 *
 * @example
 * ```json
 * {
 *   "extension": "nba",
 *   "widget": "Standings",
 *   "api": "nba",
 *   "endpoint": "standings",
 *   "title": "NBA",
 *   "subject": "Standings",
 *   "conference": "both",
 *   "season": "2024-25",
 *   "limit": 15
 * }
 * ```
 *
 * @example
 * ```yaml
 * extension: nba
 * widget: Standings
 * api: nba
 * endpoint: standings
 * title: NBA
 * subject: Standings
 * conference: both
 * season: "2024-25"
 * limit: 15
 * ```
 *
 * @example
 * ```tsx
 * <Standings
 *   api="nba"
 *   endpoint="standings"
 *   title="NBA"
 *   subject="Standings"
 *   conference="both"
 *   season="2024-25"
 *   limit={15}
 * />
 * ```
 */
export const Standings = ({
  api = 'nba',
  endpoint = 'standings',
  title = 'NBA',
  subject = 'Standings',
  conference = 'both',
  season,
  limit = 15,
}: StandingsProps) => {
  const { data, error, loading } = useApiSubscription({
    api,
    endpoint,
    params: season ? { season } : undefined,
  })

  if (loading && !data) {
    return (
      <Widget>
        <WidgetHeader icon={<TrophyIcon />} subject={subject} title={title} />
        <WidgetBody>
          <WidgetLoader />
        </WidgetBody>
      </Widget>
    )
  }

  if (error) {
    return (
      <Widget>
        <WidgetHeader icon={<TrophyIcon />} subject={subject} title={title} />
        <WidgetBody>
          <WidgetError error={error} />
        </WidgetBody>
      </Widget>
    )
  }

  const standingsData = data as StandingsResponse
  let standings = standingsData?.standings || []

  if (limit) {
    const eastStandings = filterStandingsByConference(standings, CONFERENCES.EAST.value).slice(
      0,
      limit,
    )
    const westStandings = filterStandingsByConference(standings, CONFERENCES.WEST.value).slice(
      0,
      limit,
    )
    standings = [...eastStandings, ...westStandings]
  }

  // Remove any existing conference prefix to avoid duplication (e.g., "Eastern Conference" -> "Conference")
  const cleanedSubject = subject.replace(/^(eastern|western)\s+/i, '')
  const displaySubject = conference === 'both' ? subject : `${conference}ern ${cleanedSubject}`

  return (
    <Widget>
      <WidgetHeader
        count={conference === 'both' ? standings.length : limit}
        icon={<TrophyIcon />}
        subject={displaySubject}
        title={title}
      />
      <WidgetBody disablePadding scrollable>
        <WidgetErrorBoundary resetKeys={[conference, standings.length]}>
          {conference === 'both' ? (
            <div className="space-y-4">
              <StandingsTable conference={CONFERENCES.EAST.value} standings={standings} />
              <StandingsTable conference={CONFERENCES.WEST.value} standings={standings} />
            </div>
          ) : (
            <StandingsTable
              conference={conference}
              showConferenceName={false}
              standings={standings}
            />
          )}
        </WidgetErrorBoundary>
      </WidgetBody>
    </Widget>
  )
}
