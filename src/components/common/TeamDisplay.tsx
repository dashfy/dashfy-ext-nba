import { cn, WidgetAvatar, WidgetListItem } from '@dashfy/ui'

import type { NbaTeam } from '@/types'
import { getTeamLogoUrlById } from '@/utils'

interface TeamDisplayProps {
  team: NbaTeam
  isWinner?: boolean
  isScheduled?: boolean
  className?: string
}

export const TeamDisplay = ({
  team,
  isWinner = false,
  isScheduled = false,
  className,
}: TeamDisplayProps) => {
  return (
    <WidgetListItem
      className={className}
      icon={
        <WidgetAvatar
          alt={team.teamTricode}
          className="shrink-0"
          size={40}
          src={getTeamLogoUrlById(team.teamId)}
        >
          {team.teamTricode}
        </WidgetAvatar>
      }
      meta={`${team.wins}-${team.losses}`}
      title={
        <div className="flex items-center gap-1">
          <span>{team.teamName || team.teamCity}</span>
          {team.seed && <span className="text-muted-foreground text-xs">({team.seed})</span>}
        </div>
      }
      value={
        <span
          className={cn('font-mono text-xl font-bold', {
            'text-muted-foreground': !isWinner,
          })}
        >
          {isScheduled ? '-' : team.score}
        </span>
      }
    />
  )
}
