import { Card } from '@getdashfy/ui'

import { GameStatus } from '@/components/common/GameStatus'
import { TeamDisplay } from '@/components/common/TeamDisplay'
import type { NbaGame } from '@/types'
import { isGameFinal, isGameLive, isGameScheduled } from '@/utils'

interface GameContentProps {
  game: NbaGame
}

export const GameContent = ({ game }: GameContentProps) => {
  const isLive = isGameLive(game)
  const isFinal = isGameFinal(game)
  const isScheduled = isGameScheduled(game)

  const awayTeamWon = isFinal && game.awayTeam.score > game.homeTeam.score
  const homeTeamWon = isFinal && game.homeTeam.score > game.awayTeam.score

  return (
    <Card className="overflow-hidden p-0">
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

      {/* Series Text (Playoffs) */}
      {game.seriesText && (
        <div className="border-border bg-muted/20 text-muted-foreground border-t px-4 py-2 text-center text-xs">
          {game.seriesText}
        </div>
      )}

      {/* Game Leaders */}
      {game.gameLeaders && isFinal && (
        <div className="border-border bg-muted/20 border-t px-4 py-3">
          <div className="text-muted-foreground mb-2 text-center text-xs font-medium">
            Game Leaders
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="text-center">
              <div className="font-medium">{game.gameLeaders.awayLeaders.name}</div>
              <div className="text-muted-foreground">
                {game.gameLeaders.awayLeaders.points} PTS, {game.gameLeaders.awayLeaders.rebounds}{' '}
                REB, {game.gameLeaders.awayLeaders.assists} AST
              </div>
            </div>
            <div className="text-center">
              <div className="font-medium">{game.gameLeaders.homeLeaders.name}</div>
              <div className="text-muted-foreground">
                {game.gameLeaders.homeLeaders.points} PTS, {game.gameLeaders.homeLeaders.rebounds}{' '}
                REB, {game.gameLeaders.homeLeaders.assists} AST
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
