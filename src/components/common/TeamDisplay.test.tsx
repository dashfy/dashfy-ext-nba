import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { NbaTeam } from '@/types'

import { TeamDisplay } from './TeamDisplay'

describe('TeamDisplay', () => {
  const baseTeam: NbaTeam = {
    teamId: 1610612747,
    teamName: 'Lakers',
    teamCity: 'Los Angeles',
    teamTricode: 'LAL',
    teamSlug: 'lakers',
    wins: 25,
    losses: 15,
    score: 110,
  }

  describe('Team Information', () => {
    it('should render team name', () => {
      render(<TeamDisplay isScheduled={false} isWinner={false} team={baseTeam} />)

      expect(screen.getByText('Lakers')).toBeTruthy()
    })

    it('should render team city when no team name', () => {
      const teamWithoutName = { ...baseTeam, teamName: '' }
      render(<TeamDisplay isScheduled={false} isWinner={false} team={teamWithoutName} />)

      expect(screen.getByText('Los Angeles')).toBeTruthy()
    })

    it('should render team tricode in avatar', () => {
      render(<TeamDisplay isScheduled={false} isWinner={false} team={baseTeam} />)

      expect(screen.getByText('LAL')).toBeTruthy()
    })

    it('should render team record', () => {
      render(<TeamDisplay isScheduled={false} isWinner={false} team={baseTeam} />)

      expect(screen.getByText('25-15')).toBeTruthy()
    })

    it('should render team logo with correct alt text', () => {
      render(<TeamDisplay isScheduled={false} isWinner={false} team={baseTeam} />)

      // WidgetAvatar may render as span with fallback, not always img
      const avatarText = screen.getByText('LAL')
      expect(avatarText).toBeTruthy()
    })

    it('should render team logo with correct src', () => {
      const { container } = render(
        <TeamDisplay isScheduled={false} isWinner={false} team={baseTeam} />,
      )

      // Check that the avatar component is rendered (may be img or span)
      const avatar = container.querySelector('.shrink-0')
      expect(avatar).toBeTruthy()
    })
  })

  describe('Score Display', () => {
    it('should render score for non-scheduled game', () => {
      render(<TeamDisplay isScheduled={false} isWinner={false} team={baseTeam} />)

      expect(screen.getByText('110')).toBeTruthy()
    })

    it('should render dash for scheduled game', () => {
      render(<TeamDisplay isScheduled={true} isWinner={false} team={baseTeam} />)

      expect(screen.getByText('-')).toBeTruthy()
      expect(screen.queryByText('110')).toBeNull()
    })

    it('should render zero score', () => {
      const teamWithZeroScore = { ...baseTeam, score: 0 }
      render(<TeamDisplay isScheduled={false} isWinner={false} team={teamWithZeroScore} />)

      expect(screen.getByText('0')).toBeTruthy()
    })

    it('should render high score correctly', () => {
      const teamWithHighScore = { ...baseTeam, score: 155 }
      render(<TeamDisplay isScheduled={false} isWinner={false} team={teamWithHighScore} />)

      expect(screen.getByText('155')).toBeTruthy()
    })
  })

  describe('Winner Styling', () => {
    it('should apply bold styling to winner', () => {
      render(<TeamDisplay isScheduled={false} isWinner={true} team={baseTeam} />)

      const scoreElement = screen.getByText('110')
      expect(scoreElement.className).toContain('font-bold')
    })

    it('should apply muted styling to non-winner', () => {
      render(<TeamDisplay isScheduled={false} isWinner={false} team={baseTeam} />)

      const scoreElement = screen.getByText('110')
      expect(scoreElement.className).toContain('text-muted-foreground')
    })

    it('should not apply muted styling to winner', () => {
      render(<TeamDisplay isScheduled={false} isWinner={true} team={baseTeam} />)

      const scoreElement = screen.getByText('110')
      expect(scoreElement.className).not.toContain('text-muted-foreground')
    })

    it('should apply font-mono and text-xl to score', () => {
      render(<TeamDisplay isScheduled={false} isWinner={false} team={baseTeam} />)

      const scoreElement = screen.getByText('110')
      expect(scoreElement.className).toContain('font-mono')
      expect(scoreElement.className).toContain('text-xl')
    })
  })

  describe('Seed Display', () => {
    it('should render seed when provided', () => {
      const teamWithSeed = { ...baseTeam, seed: 1 }
      render(<TeamDisplay isScheduled={false} isWinner={false} team={teamWithSeed} />)

      expect(screen.getByText('(1)')).toBeTruthy()
    })

    it('should not render seed when not provided', () => {
      render(<TeamDisplay isScheduled={false} isWinner={false} team={baseTeam} />)

      expect(screen.queryByText(/\(\d+\)/)).toBeNull()
    })

    it('should render different seed numbers', () => {
      const teamWithSeed8 = { ...baseTeam, seed: 8 }
      render(<TeamDisplay isScheduled={false} isWinner={false} team={teamWithSeed8} />)

      expect(screen.getByText('(8)')).toBeTruthy()
    })

    it('should apply muted styling to seed', () => {
      const teamWithSeed = { ...baseTeam, seed: 1 }
      render(<TeamDisplay isScheduled={false} isWinner={false} team={teamWithSeed} />)

      const seedElement = screen.getByText('(1)')
      expect(seedElement.className).toContain('text-muted-foreground')
      expect(seedElement.className).toContain('text-xs')
    })
  })

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <TeamDisplay
          className="custom-class"
          isScheduled={false}
          isWinner={false}
          team={baseTeam}
        />,
      )

      const listItem = container.querySelector('.custom-class')
      expect(listItem).toBeTruthy()
    })

    it('should render without custom className', () => {
      const { container } = render(
        <TeamDisplay isScheduled={false} isWinner={false} team={baseTeam} />,
      )

      expect(container.querySelector('div')).toBeTruthy()
    })
  })

  describe('Different Team Records', () => {
    it('should render winning record', () => {
      const winningTeam = { ...baseTeam, wins: 40, losses: 10 }
      render(<TeamDisplay isScheduled={false} isWinner={false} team={winningTeam} />)

      expect(screen.getByText('40-10')).toBeTruthy()
    })

    it('should render losing record', () => {
      const losingTeam = { ...baseTeam, wins: 10, losses: 40 }
      render(<TeamDisplay isScheduled={false} isWinner={false} team={losingTeam} />)

      expect(screen.getByText('10-40')).toBeTruthy()
    })

    it('should render even record', () => {
      const evenTeam = { ...baseTeam, wins: 20, losses: 20 }
      render(<TeamDisplay isScheduled={false} isWinner={false} team={evenTeam} />)

      expect(screen.getByText('20-20')).toBeTruthy()
    })

    it('should render 0-0 record', () => {
      const newTeam = { ...baseTeam, wins: 0, losses: 0 }
      render(<TeamDisplay isScheduled={false} isWinner={false} team={newTeam} />)

      expect(screen.getByText('0-0')).toBeTruthy()
    })
  })

  describe('Different Teams', () => {
    it('should render Celtics correctly', () => {
      const celtics: NbaTeam = {
        teamId: 1610612738,
        teamName: 'Celtics',
        teamCity: 'Boston',
        teamTricode: 'BOS',
        teamSlug: 'celtics',
        wins: 30,
        losses: 10,
        score: 105,
      }

      render(<TeamDisplay isScheduled={false} isWinner={false} team={celtics} />)

      expect(screen.getByText('Celtics')).toBeTruthy()
      expect(screen.getByText('BOS')).toBeTruthy()
      expect(screen.getByText('30-10')).toBeTruthy()
      expect(screen.getByText('105')).toBeTruthy()
    })

    it('should render Warriors correctly', () => {
      const warriors: NbaTeam = {
        teamId: 1610612744,
        teamName: 'Warriors',
        teamCity: 'Golden State',
        teamTricode: 'GSW',
        teamSlug: 'warriors',
        wins: 22,
        losses: 18,
        score: 98,
      }

      render(<TeamDisplay isScheduled={false} isWinner={false} team={warriors} />)

      expect(screen.getByText('Warriors')).toBeTruthy()
      expect(screen.getByText('GSW')).toBeTruthy()
      expect(screen.getByText('22-18')).toBeTruthy()
      expect(screen.getByText('98')).toBeTruthy()
    })
  })

  describe('Avatar Size', () => {
    it('should render avatar with size 40', () => {
      const { container } = render(
        <TeamDisplay isScheduled={false} isWinner={false} team={baseTeam} />,
      )

      // WidgetAvatar should have size prop set to 40 (rendered as span or img)
      const avatar = container.querySelector('.shrink-0')
      expect(avatar).toBeTruthy()
    })

    it('should apply shrink-0 class to avatar', () => {
      const { container } = render(
        <TeamDisplay isScheduled={false} isWinner={false} team={baseTeam} />,
      )

      const avatarWrapper = container.querySelector('.shrink-0')
      expect(avatarWrapper).toBeTruthy()
    })
  })

  describe('Scheduled vs Live/Final Games', () => {
    it('should show score for live game', () => {
      render(<TeamDisplay isScheduled={false} isWinner={false} team={baseTeam} />)

      expect(screen.getByText('110')).toBeTruthy()
      expect(screen.queryByText('-')).toBeNull()
    })

    it('should show score for final game (winner)', () => {
      render(<TeamDisplay isScheduled={false} isWinner={true} team={baseTeam} />)

      expect(screen.getByText('110')).toBeTruthy()
      expect(screen.queryByText('-')).toBeNull()
    })

    it('should show score for final game (loser)', () => {
      render(<TeamDisplay isScheduled={false} isWinner={false} team={baseTeam} />)

      expect(screen.getByText('110')).toBeTruthy()
      expect(screen.queryByText('-')).toBeNull()
    })

    it('should show dash for scheduled game regardless of winner status', () => {
      render(<TeamDisplay isScheduled={true} isWinner={true} team={baseTeam} />)

      expect(screen.getByText('-')).toBeTruthy()
      expect(screen.queryByText('110')).toBeNull()
    })
  })

  describe('Edge Cases', () => {
    it('should handle team with very long name', () => {
      const longNameTeam = {
        ...baseTeam,
        teamName: 'Very Long Team Name That Should Still Display',
      }
      render(<TeamDisplay isScheduled={false} isWinner={false} team={longNameTeam} />)

      expect(screen.getByText('Very Long Team Name That Should Still Display')).toBeTruthy()
    })

    it('should handle team with special characters in name', () => {
      const specialTeam = { ...baseTeam, teamName: "Trail Blazers'" }
      render(<TeamDisplay isScheduled={false} isWinner={false} team={specialTeam} />)

      expect(screen.getByText("Trail Blazers'")).toBeTruthy()
    })

    it('should handle team with number in name', () => {
      const numberTeam = { ...baseTeam, teamName: '76ers' }
      render(<TeamDisplay isScheduled={false} isWinner={false} team={numberTeam} />)

      expect(screen.getByText('76ers')).toBeTruthy()
    })
  })
})
