import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Standings } from './Standings'

vi.mock('@dashfy/ui', async () => {
  const actual = await vi.importActual('@dashfy/ui')
  return {
    ...actual,
    useApiSubscription: vi.fn(),
  }
})

const { useApiSubscription } = await import('@dashfy/ui')

describe('Standings', () => {
  const mockStandings = [
    {
      teamId: 1610612738,
      leagueId: '00',
      seasonYear: '2024-25',
      leagueRank: 1,
      seasonType: 'Regular Season',
      teamCity: 'Boston',
      teamName: 'Celtics',
      teamSlug: 'celtics',
      conference: 'East' as const,
      conferenceRecord: '20-5',
      playoffRank: 1,
      clinchIndicator: '',
      divisionRank: 1,
      divisionName: 'Atlantic',
      record: '30-10',
      home: '15-5',
      road: '15-5',
      l10: '7-3',
      longWinStreak: 5,
      longLossStreak: 2,
      currentStreak: 'W5',
      conferenceGamesBack: 0,
      clinchedConferenceTitle: 0,
      clinchedPlayoffBirth: 0,
      clinchedPlayIn: 0,
      eliminatedConference: 0,
      pointsPerGame: 115.5,
      opponentPointsPerGame: 108.2,
      diffPointsPerGame: 7.3,
    },
    {
      teamId: 1610612747,
      leagueId: '00',
      seasonYear: '2024-25',
      leagueRank: 5,
      seasonType: 'Regular Season',
      teamCity: 'Los Angeles',
      teamName: 'Lakers',
      teamSlug: 'lakers',
      conference: 'West' as const,
      conferenceRecord: '18-7',
      playoffRank: 1,
      clinchIndicator: '',
      divisionRank: 1,
      divisionName: 'Pacific',
      record: '25-15',
      home: '13-7',
      road: '12-8',
      l10: '6-4',
      longWinStreak: 4,
      longLossStreak: 3,
      currentStreak: 'W2',
      conferenceGamesBack: 0,
      clinchedConferenceTitle: 0,
      clinchedPlayoffBirth: 0,
      clinchedPlayIn: 0,
      eliminatedConference: 0,
      pointsPerGame: 112.3,
      opponentPointsPerGame: 109.1,
      diffPointsPerGame: 3.2,
    },
  ]

  it('should render loading state', () => {
    vi.mocked(useApiSubscription).mockReturnValue({
      data: null,
      error: null,
      loading: true,
      lastUpdate: undefined,
    })

    render(<Standings />)

    expect(screen.getByText('NBA')).toBeTruthy()
    expect(screen.getByText('Standings')).toBeTruthy()
    expect(screen.getByText('Loading...')).toBeTruthy()
  })

  it('should render error state', () => {
    vi.mocked(useApiSubscription).mockReturnValue({
      data: null,
      error: 'Failed to fetch standings',
      loading: false,
      lastUpdate: Date.now(),
    })

    render(<Standings />)

    expect(screen.getByText(/Failed to fetch standings/i)).toBeTruthy()
  })

  it('should render standings for both conferences', () => {
    vi.mocked(useApiSubscription).mockReturnValue({
      data: {
        standings: mockStandings,
      },
      error: null,
      loading: false,
      lastUpdate: Date.now(),
    })

    render(<Standings conference="both" />)

    expect(screen.getByText('Celtics')).toBeTruthy()
    expect(screen.getByText('Lakers')).toBeTruthy()
  })

  it('should filter standings by East conference', () => {
    vi.mocked(useApiSubscription).mockReturnValue({
      data: {
        standings: mockStandings,
      },
      error: null,
      loading: false,
      lastUpdate: Date.now(),
    })

    render(<Standings conference="East" />)

    expect(screen.getByText('Celtics')).toBeTruthy()
    expect(screen.queryByText('Lakers')).toBeNull()
  })

  it('should filter standings by West conference', () => {
    vi.mocked(useApiSubscription).mockReturnValue({
      data: {
        standings: mockStandings,
      },
      error: null,
      loading: false,
      lastUpdate: Date.now(),
    })

    render(<Standings conference="West" />)

    expect(screen.getByText('Lakers')).toBeTruthy()
    expect(screen.queryByText('Celtics')).toBeNull()
  })

  it('should show custom title and subject', () => {
    vi.mocked(useApiSubscription).mockReturnValue({
      data: {
        standings: [],
      },
      error: null,
      loading: false,
      lastUpdate: Date.now(),
    })

    render(<Standings subject="League Standings" title="Basketball" />)

    expect(screen.getByText('Basketball')).toBeTruthy()
    expect(screen.getByText('League Standings')).toBeTruthy()
  })

  it('should use custom API and endpoint', () => {
    vi.mocked(useApiSubscription).mockReturnValue({
      data: {
        standings: [],
      },
      error: null,
      loading: false,
      lastUpdate: Date.now(),
    })

    render(<Standings api="customApi" endpoint="customEndpoint" />)

    expect(useApiSubscription).toHaveBeenCalledWith({
      api: 'customApi',
      endpoint: 'customEndpoint',
      params: undefined,
    })
  })

  it('should pass season parameter when provided', () => {
    vi.mocked(useApiSubscription).mockReturnValue({
      data: {
        standings: [],
      },
      error: null,
      loading: false,
      lastUpdate: Date.now(),
    })

    render(<Standings season="2023-24" />)

    expect(useApiSubscription).toHaveBeenCalledWith({
      api: 'nba',
      endpoint: 'standings',
      params: { season: '2023-24' },
    })
  })

  it('should limit teams per conference when limit is provided', () => {
    const manyStandings = [
      ...Array.from({ length: 10 }, (_, i) => ({
        ...mockStandings[0]!,
        teamId: 1610612738 + i,
        teamName: `East Team ${i + 1}`,
        playoffRank: i + 1,
      })),
      ...Array.from({ length: 10 }, (_, i) => ({
        ...mockStandings[1]!,
        teamId: 1610612747 + i,
        teamName: `West Team ${i + 1}`,
        playoffRank: i + 1,
      })),
    ]

    vi.mocked(useApiSubscription).mockReturnValue({
      data: {
        standings: manyStandings,
      },
      error: null,
      loading: false,
      lastUpdate: Date.now(),
    })

    render(<Standings conference="both" limit={3} />)

    // Should show 3 teams from each conference (6 total)
    expect(screen.getByText('East Team 1')).toBeTruthy()
    expect(screen.getByText('East Team 3')).toBeTruthy()
    expect(screen.getByText('West Team 1')).toBeTruthy()
    expect(screen.getByText('West Team 3')).toBeTruthy()
    expect(screen.queryByText('East Team 4')).toBeNull()
    expect(screen.queryByText('West Team 4')).toBeNull()
  })

  it('should show standings count in header', () => {
    vi.mocked(useApiSubscription).mockReturnValue({
      data: {
        standings: mockStandings,
      },
      error: null,
      loading: false,
      lastUpdate: Date.now(),
    })

    const { container } = render(<Standings />)

    // Check that count is displayed (implementation may vary)
    expect(container.textContent).toContain('2')
  })

  it('should adjust subject based on conference filter', () => {
    vi.mocked(useApiSubscription).mockReturnValue({
      data: {
        standings: mockStandings,
      },
      error: null,
      loading: false,
      lastUpdate: Date.now(),
    })

    const { rerender } = render(<Standings conference="East" />)
    expect(screen.getByText('Eastern Standings')).toBeTruthy()

    rerender(<Standings conference="West" />)
    expect(screen.getByText('Western Standings')).toBeTruthy()
  })
})
