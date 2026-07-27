import { Card } from '@dashfy/ui'

import { GameStatus } from '@/components/common/GameStatus'
import { TeamDisplay } from '@/components/common/TeamDisplay'
import type { NbaGame } from '@/types'
import { isGameFinal, isGameLive, isGameScheduled } from '@/utils'

interface GameRowProps {
  game: NbaGame
}

export const GameRow = ({ game }: GameRowProps) => {
  const isLive = isGameLive(game)
  const isFinal = isGameFinal(game)
  const isScheduled = isGameScheduled(game)

  const awayTeamWon = isFinal && game.awayTeam.score > game.homeTeam.score
  const homeTeamWon = isFinal && game.homeTeam.score > game.awayTeam.score

  return (
    <Card className="mb-4 overflow-hidden p-0">
      {/* Away Team */}
      <TeamDisplay isScheduled={isScheduled} isWinner={awayTeamWon} team={game.awayTeam} />

      {/* Home Team */}
      <TeamDisplay
        className="border-b-0"
        isScheduled={isScheduled}
        isWinner={homeTeamWon}
        team={game.homeTeam}
      />

      {/* Status Footer */}
      <div className="border-border bg-muted/30 border-t px-4 py-2 text-center">
        <GameStatus
          gameClock={game.gameClock}
          gameTimeUTC={game.gameTimeUTC}
          isFinal={isFinal}
          isLive={isLive}
          isScheduled={isScheduled}
          period={game.period}
        />
      </div>
    </Card>
  )
}
