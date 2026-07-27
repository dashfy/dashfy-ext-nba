import { generateReactKey, WidgetAvatar, WidgetEmpty, WidgetStatusChip } from '@getdashfy/ui'

import type { NbaConference, NbaStanding } from '@/types'
import {
  filterStandingsByConference,
  formatWinPercentage,
  getConferenceDisplayName,
  getTeamLogoUrlById,
  sortStandingsByRank,
} from '@/utils'

interface StandingsTableProps {
  conference: NbaConference
  standings: NbaStanding[]
  showConferenceName?: boolean
}

export const StandingsTable = ({
  conference,
  standings,
  showConferenceName = true,
}: StandingsTableProps) => {
  const filteredStandings = filterStandingsByConference(standings, conference)
  const sortedStandings = sortStandingsByRank(filteredStandings)

  if (sortedStandings.length === 0) {
    return <WidgetEmpty message="No standings data available" />
  }

  return (
    <div className="overflow-x-auto">
      {showConferenceName && (
        <div className="mb-2 px-3">
          <span className="text-muted-foreground text-xs font-semibold">
            {getConferenceDisplayName(conference)}
          </span>
        </div>
      )}
      <table className="w-full table-fixed text-xs">
        <thead>
          <tr className="border-border/50 text-muted-foreground border-b">
            <th className="w-12 px-3 py-1.5 text-left font-medium" title="Rank">
              Rank
            </th>
            <th className="w-[200px] px-3 py-1.5 text-left font-medium" title="Team">
              Team
            </th>
            <th className="px-3 py-1.5 text-center font-medium" title="Wins">
              W
            </th>
            <th className="px-3 py-1.5 text-center font-medium" title="Loss">
              L
            </th>
            <th className="px-3 py-1.5 text-center font-medium" title="Win %">
              W%
            </th>
            <th className="px-3 py-1.5 text-center font-medium" title="Games Behind">
              GB
            </th>
            <th className="px-3 py-1.5 text-center font-medium" title="L10 Streak">
              L10
            </th>
            <th className="px-3 py-1.5 text-center font-medium" title="Streak">
              STRK
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedStandings.map((team) => {
            const [wins, losses] = team.record.split('-').map(Number)
            const isPlayoffSpot = team.playoffRank <= 6
            const isPlayIn = team.playoffRank > 6 && team.playoffRank <= 10

            return (
              <tr key={generateReactKey('team', team.teamId)} className="border-border/30 border-b">
                <td className="px-3 py-1.5 font-medium">
                  {isPlayoffSpot || isPlayIn ? (
                    <WidgetStatusChip
                      label={team.playoffRank.toString()}
                      showDot={false}
                      status={isPlayoffSpot ? 'success' : 'info'}
                    />
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium">
                      {team.playoffRank}
                    </span>
                  )}
                </td>
                <td className="px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    <WidgetAvatar
                      alt={team.teamName}
                      className="shrink-0"
                      size={24}
                      src={getTeamLogoUrlById(team.teamId)}
                    >
                      {team.teamSlug.slice(0, 3).toUpperCase()}
                    </WidgetAvatar>
                    <span className="font-medium">{team.teamName}</span>
                  </div>
                </td>
                <td className="px-3 py-1.5 text-center font-mono whitespace-nowrap">{wins}</td>
                <td className="px-3 py-1.5 text-center font-mono whitespace-nowrap">{losses}</td>
                <td className="px-3 py-1.5 text-center font-mono whitespace-nowrap">
                  {formatWinPercentage(team.record)}
                </td>
                <td className="px-3 py-1.5 text-center font-mono whitespace-nowrap">
                  {Number(team.conferenceGamesBack) === 0 ? 0 : team.conferenceGamesBack}
                </td>
                <td className="px-3 py-1.5 text-center font-mono whitespace-nowrap">{team.l10}</td>
                <td
                  className={`px-3 py-1.5 text-center font-mono whitespace-nowrap ${
                    team.currentStreak.startsWith('W')
                      ? 'text-success'
                      : team.currentStreak.startsWith('L')
                        ? 'text-error'
                        : ''
                  }`}
                >
                  {team.currentStreak}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {/* Legend */}
      <div className="text-muted-foreground flex gap-4 px-3 py-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="bg-success h-2 w-2 rounded-full" />
          <span>Playoff</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="bg-info h-2 w-2 rounded-full" />
          <span>Play-In</span>
        </div>
      </div>
    </div>
  )
}
