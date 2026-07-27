import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { GameStatus } from './GameStatus'

// Mock the utils functions
vi.mock('@/utils', () => ({
  formatGameTime: vi.fn((time: string) => {
    // Mock implementation for testing
    if (time === '2024-01-15T00:00:00Z') {
      return '7:00 PM'
    }
    if (time === '2024-01-15T02:30:00Z') {
      return '9:30 PM'
    }
    return '12:00 AM'
  }),
  formatMinutes: vi.fn((minutes: string) => {
    // Mock implementation for testing
    if (minutes === 'PT10M30S') {
      return '10:30'
    }
    if (minutes === 'PT5M15S') {
      return '5:15'
    }
    if (minutes === 'PT0M45S') {
      return '0:45'
    }
    if (minutes === '') {
      return '0:00'
    }
    return minutes
  }),
}))

describe('GameStatus', () => {
  describe('Live Games', () => {
    it('should render LIVE badge for live game', () => {
      render(
        <GameStatus
          gameClock="PT10M30S"
          gameTimeUTC="2024-01-15T00:00:00Z"
          isFinal={false}
          isLive={true}
          isScheduled={false}
          period={2}
        />,
      )

      expect(screen.getByText('LIVE')).toBeTruthy()
    })

    it('should render quarter and game clock for live game', () => {
      render(
        <GameStatus
          gameClock="PT10M30S"
          gameTimeUTC="2024-01-15T00:00:00Z"
          isFinal={false}
          isLive={true}
          isScheduled={false}
          period={2}
        />,
      )

      expect(screen.getByText(/Q2/)).toBeTruthy()
      expect(screen.getByText(/10:30/)).toBeTruthy()
    })

    it('should render first quarter correctly', () => {
      render(
        <GameStatus
          gameClock="PT5M15S"
          gameTimeUTC="2024-01-15T00:00:00Z"
          isFinal={false}
          isLive={true}
          isScheduled={false}
          period={1}
        />,
      )

      expect(screen.getByText(/Q1/)).toBeTruthy()
      expect(screen.getByText(/5:15/)).toBeTruthy()
    })

    it('should render fourth quarter correctly', () => {
      render(
        <GameStatus
          gameClock="PT0M45S"
          gameTimeUTC="2024-01-15T00:00:00Z"
          isFinal={false}
          isLive={true}
          isScheduled={false}
          period={4}
        />,
      )

      expect(screen.getByText(/Q4/)).toBeTruthy()
      expect(screen.getByText(/0:45/)).toBeTruthy()
    })

    it('should render overtime period correctly', () => {
      render(
        <GameStatus
          gameClock="PT3M20S"
          gameTimeUTC="2024-01-15T00:00:00Z"
          isFinal={false}
          isLive={true}
          isScheduled={false}
          period={5}
        />,
      )

      expect(screen.getByText(/Q5/)).toBeTruthy()
    })

    it('should render empty game clock', () => {
      render(
        <GameStatus
          gameClock=""
          gameTimeUTC="2024-01-15T00:00:00Z"
          isFinal={false}
          isLive={true}
          isScheduled={false}
          period={2}
        />,
      )

      expect(screen.getByText(/Q2/)).toBeTruthy()
      expect(screen.getByText(/0:00/)).toBeTruthy()
    })
  })

  describe('Final Games', () => {
    it('should render Final text for completed game', () => {
      render(
        <GameStatus
          gameClock=""
          gameTimeUTC="2024-01-15T00:00:00Z"
          isFinal={true}
          isLive={false}
          isScheduled={false}
          period={4}
        />,
      )

      expect(screen.getByText('Final')).toBeTruthy()
    })

    it('should not render LIVE badge for final game', () => {
      render(
        <GameStatus
          gameClock=""
          gameTimeUTC="2024-01-15T00:00:00Z"
          isFinal={true}
          isLive={false}
          isScheduled={false}
          period={4}
        />,
      )

      expect(screen.queryByText('LIVE')).toBeNull()
    })

    it('should not render game clock for final game', () => {
      render(
        <GameStatus
          gameClock="PT10M30S"
          gameTimeUTC="2024-01-15T00:00:00Z"
          isFinal={true}
          isLive={false}
          isScheduled={false}
          period={4}
        />,
      )

      expect(screen.queryByText(/Q4/)).toBeNull()
      expect(screen.queryByText(/10:30/)).toBeNull()
    })
  })

  describe('Scheduled Games', () => {
    it('should render game time for scheduled game', () => {
      render(
        <GameStatus
          gameClock=""
          gameTimeUTC="2024-01-15T00:00:00Z"
          isFinal={false}
          isLive={false}
          isScheduled={true}
          period={0}
        />,
      )

      expect(screen.getByText('7:00 PM')).toBeTruthy()
    })

    it('should not render LIVE badge for scheduled game', () => {
      render(
        <GameStatus
          gameClock=""
          gameTimeUTC="2024-01-15T00:00:00Z"
          isFinal={false}
          isLive={false}
          isScheduled={true}
          period={0}
        />,
      )

      expect(screen.queryByText('LIVE')).toBeNull()
    })

    it('should not render Final text for scheduled game', () => {
      render(
        <GameStatus
          gameClock=""
          gameTimeUTC="2024-01-15T00:00:00Z"
          isFinal={false}
          isLive={false}
          isScheduled={true}
          period={0}
        />,
      )

      expect(screen.queryByText('Final')).toBeNull()
    })

    it('should render different game times correctly', () => {
      render(
        <GameStatus
          gameClock=""
          gameTimeUTC="2024-01-15T02:30:00Z"
          isFinal={false}
          isLive={false}
          isScheduled={true}
          period={0}
        />,
      )

      expect(screen.getByText('9:30 PM')).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('should handle all flags false', () => {
      const { container } = render(
        <GameStatus
          gameClock=""
          gameTimeUTC="2024-01-15T00:00:00Z"
          isFinal={false}
          isLive={false}
          isScheduled={false}
          period={0}
        />,
      )

      // Should render empty container
      expect(container.querySelector('div')).toBeTruthy()
      expect(screen.queryByText('LIVE')).toBeNull()
      expect(screen.queryByText('Final')).toBeNull()
    })

    it('should render correct structure with flex layout', () => {
      const { container } = render(
        <GameStatus
          gameClock="PT10M30S"
          gameTimeUTC="2024-01-15T00:00:00Z"
          isFinal={false}
          isLive={true}
          isScheduled={false}
          period={2}
        />,
      )

      const wrapper = container.querySelector('.flex.flex-col.items-center.gap-1')
      expect(wrapper).toBeTruthy()
    })

    it('should apply muted styling to Final text', () => {
      const { container } = render(
        <GameStatus
          gameClock=""
          gameTimeUTC="2024-01-15T00:00:00Z"
          isFinal={true}
          isLive={false}
          isScheduled={false}
          period={4}
        />,
      )

      const finalText = container.querySelector('.text-muted-foreground')
      expect(finalText).toBeTruthy()
      expect(finalText?.textContent).toBe('Final')
    })

    it('should apply muted styling to scheduled time', () => {
      const { container } = render(
        <GameStatus
          gameClock=""
          gameTimeUTC="2024-01-15T00:00:00Z"
          isFinal={false}
          isLive={false}
          isScheduled={true}
          period={0}
        />,
      )

      const timeText = container.querySelector('.text-muted-foreground')
      expect(timeText).toBeTruthy()
      expect(timeText?.textContent).toBe('7:00 PM')
    })

    it('should render LIVE badge with error status', () => {
      render(
        <GameStatus
          gameClock="PT10M30S"
          gameTimeUTC="2024-01-15T00:00:00Z"
          isFinal={false}
          isLive={true}
          isScheduled={false}
          period={2}
        />,
      )

      // WidgetStatusChip with status="error" should be rendered
      expect(screen.getByText('LIVE')).toBeTruthy()
    })

    it('should handle halftime (period 2, no clock)', () => {
      render(
        <GameStatus
          gameClock=""
          gameTimeUTC="2024-01-15T00:00:00Z"
          isFinal={false}
          isLive={true}
          isScheduled={false}
          period={2}
        />,
      )

      expect(screen.getByText(/Q2/)).toBeTruthy()
      expect(screen.getByText(/0:00/)).toBeTruthy()
    })

    it('should handle end of quarter (very short clock)', () => {
      render(
        <GameStatus
          gameClock="PT0M3S"
          gameTimeUTC="2024-01-15T00:00:00Z"
          isFinal={false}
          isLive={true}
          isScheduled={false}
          period={3}
        />,
      )

      expect(screen.getByText(/Q3/)).toBeTruthy()
    })
  })

  describe('Multiple Overtime', () => {
    it('should render double overtime correctly', () => {
      render(
        <GameStatus
          gameClock="PT2M15S"
          gameTimeUTC="2024-01-15T00:00:00Z"
          isFinal={false}
          isLive={true}
          isScheduled={false}
          period={6}
        />,
      )

      expect(screen.getByText(/Q6/)).toBeTruthy()
    })

    it('should render triple overtime correctly', () => {
      render(
        <GameStatus
          gameClock="PT1M30S"
          gameTimeUTC="2024-01-15T00:00:00Z"
          isFinal={false}
          isLive={true}
          isScheduled={false}
          period={7}
        />,
      )

      expect(screen.getByText(/Q7/)).toBeTruthy()
    })
  })
})
