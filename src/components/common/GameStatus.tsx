import { WidgetStatusChip } from '@getdashfy/ui'

import { formatGameTime, formatMinutes } from '@/utils'

interface GameStatusProps {
  isLive?: boolean
  isFinal?: boolean
  isScheduled?: boolean
  period: number
  gameClock: string
  gameTimeUTC: string
}

export const GameStatus = ({
  isLive = false,
  isFinal = false,
  isScheduled = false,
  period,
  gameClock,
  gameTimeUTC,
}: GameStatusProps) => {
  return (
    <div className="flex flex-col items-center gap-1">
      {isLive && (
        <>
          <WidgetStatusChip label="LIVE" status="error" pulse />
          <span className="text-xs">
            Q{period} {formatMinutes(gameClock)}
          </span>
        </>
      )}
      {isFinal && <span className="text-muted-foreground text-xs">Final</span>}
      {isScheduled && (
        <span className="text-muted-foreground text-xs">{formatGameTime(gameTimeUTC)}</span>
      )}
    </div>
  )
}
