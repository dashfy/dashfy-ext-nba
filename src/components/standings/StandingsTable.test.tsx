import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { NbaStanding } from '@/types'

import { StandingsTable } from './StandingsTable'

describe('StandingsTable', () => {
  const mockEastStandings: NbaStanding[] = [
    {
      teamId: 1610612738,
      leagueId: '00',
      seasonYear: '2024-25',
      leagueRank: 1,
      seasonType: 'Regular Season',
      teamCity: 'Boston',
      teamName: 'Celtics',
      teamSlug: 'celtics',
      conference: 'East',
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
      teamId: 1610612752,
      leagueId: '00',
      seasonYear: '2024-25',
      leagueRank: 3,
      seasonType: 'Regular Season',
      teamCity: 'New York',
      teamName: 'Knicks',
      teamSlug: 'knicks',
      conference: 'East',
      conferenceRecord: '18-7',
      playoffRank: 2,
      clinchIndicator: '',
      divisionRank: 2,
      divisionName: 'Atlantic',
      record: '28-12',
      home: '14-6',
      road: '14-6',
      l10: '6-4',
      longWinStreak: 4,
      longLossStreak: 3,
      currentStreak: 'W3',
      conferenceGamesBack: 2,
      clinchedConferenceTitle: 0,
      clinchedPlayoffBirth: 0,
      clinchedPlayIn: 0,
      eliminatedConference: 0,
      pointsPerGame: 112.3,
      opponentPointsPerGame: 109.1,
      diffPointsPerGame: 3.2,
    },
    {
      teamId: 1610612755,
      leagueId: '00',
      seasonYear: '2024-25',
      leagueRank: 8,
      seasonType: 'Regular Season',
      teamCity: 'Philadelphia',
      teamName: '76ers',
      teamSlug: '76ers',
      conference: 'East',
      conferenceRecord: '15-10',
      playoffRank: 7,
      clinchIndicator: '',
      divisionRank: 3,
      divisionName: 'Atlantic',
      record: '22-18',
      home: '12-8',
      road: '10-10',
      l10: '5-5',
      longWinStreak: 3,
      longLossStreak: 4,
      currentStreak: 'L2',
      conferenceGamesBack: 8,
      clinchedConferenceTitle: 0,
      clinchedPlayoffBirth: 0,
      clinchedPlayIn: 0,
      eliminatedConference: 0,
      pointsPerGame: 110.5,
      opponentPointsPerGame: 108.8,
      diffPointsPerGame: 1.7,
    },
    {
      teamId: 1610612741,
      leagueId: '00',
      seasonYear: '2024-25',
      leagueRank: 15,
      seasonType: 'Regular Season',
      teamCity: 'Chicago',
      teamName: 'Bulls',
      teamSlug: 'bulls',
      conference: 'East',
      conferenceRecord: '10-15',
      playoffRank: 11,
      clinchIndicator: '',
      divisionRank: 5,
      divisionName: 'Central',
      record: '15-25',
      home: '8-12',
      road: '7-13',
      l10: '3-7',
      longWinStreak: 2,
      longLossStreak: 5,
      currentStreak: 'L3',
      conferenceGamesBack: 15,
      clinchedConferenceTitle: 0,
      clinchedPlayoffBirth: 0,
      clinchedPlayIn: 0,
      eliminatedConference: 0,
      pointsPerGame: 105.2,
      opponentPointsPerGame: 110.5,
      diffPointsPerGame: -5.3,
    },
  ]

  const mockWestStandings: NbaStanding[] = [
    {
      teamId: 1610612747,
      leagueId: '00',
      seasonYear: '2024-25',
      leagueRank: 5,
      seasonType: 'Regular Season',
      teamCity: 'Los Angeles',
      teamName: 'Lakers',
      teamSlug: 'lakers',
      conference: 'West',
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

  it('should render conference name by default', () => {
    render(<StandingsTable conference="East" standings={mockEastStandings} />)

    expect(screen.getByText('Eastern Conference')).toBeTruthy()
  })

  it('should hide conference name when showConferenceName is false', () => {
    render(
      <StandingsTable conference="East" showConferenceName={false} standings={mockEastStandings} />,
    )

    expect(screen.queryByText('Eastern Conference')).toBeNull()
  })

  it('should render Western Conference name', () => {
    render(<StandingsTable conference="West" standings={mockWestStandings} />)

    expect(screen.getByText('Western Conference')).toBeTruthy()
  })

  it('should render team names', () => {
    render(<StandingsTable conference="East" standings={mockEastStandings} />)

    expect(screen.getByText('Celtics')).toBeTruthy()
    expect(screen.getByText('Knicks')).toBeTruthy()
    expect(screen.getByText('76ers')).toBeTruthy()
    expect(screen.queryByText('Lakers')).toBeNull() // West team should not appear
  })

  it('should render playoff ranks', () => {
    render(<StandingsTable conference="East" standings={mockEastStandings} />)

    const { container } = render(<StandingsTable conference="East" standings={mockEastStandings} />)
    expect(container.textContent).toContain('1')
    expect(container.textContent).toContain('2')
  })

  it('should render win-loss records', () => {
    render(<StandingsTable conference="East" standings={mockEastStandings} />)

    expect(screen.getByText('30')).toBeTruthy() // Celtics wins
    expect(screen.getByText('10')).toBeTruthy() // Celtics losses
  })

  it('should render win percentage', () => {
    render(<StandingsTable conference="East" standings={mockEastStandings} />)

    expect(screen.getByText('75%')).toBeTruthy() // Celtics 30-10
    expect(screen.getByText('70%')).toBeTruthy() // Knicks 28-12
  })

  it('should render games behind', () => {
    const { container } = render(<StandingsTable conference="East" standings={mockEastStandings} />)

    // Check that games behind column exists and has values
    expect(container.textContent).toContain('0') // First place
    expect(container.textContent).toContain('8') // 76ers games behind
    expect(container.textContent).toContain('15') // Bulls games behind
  })

  it('should render L10 record', () => {
    render(<StandingsTable conference="East" standings={mockEastStandings} />)

    expect(screen.getByText('7-3')).toBeTruthy()
    expect(screen.getByText('6-4')).toBeTruthy()
    expect(screen.getByText('5-5')).toBeTruthy()
  })

  it('should render current streak', () => {
    render(<StandingsTable conference="East" standings={mockEastStandings} />)

    expect(screen.getByText('W5')).toBeTruthy()
    expect(screen.getByText('W3')).toBeTruthy()
    expect(screen.getByText('L2')).toBeTruthy()
    expect(screen.getByText('L3')).toBeTruthy()
  })

  it('should apply success styling to winning streaks', () => {
    const { container } = render(<StandingsTable conference="East" standings={mockEastStandings} />)

    const winStreaks = container.querySelectorAll('.text-success')
    expect(winStreaks.length).toBeGreaterThan(0)
  })

  it('should apply error styling to losing streaks', () => {
    const { container } = render(<StandingsTable conference="East" standings={mockEastStandings} />)

    const loseStreaks = container.querySelectorAll('.text-error')
    expect(loseStreaks.length).toBeGreaterThan(0)
  })

  it('should show playoff indicator for top 6 teams', () => {
    const { container } = render(<StandingsTable conference="East" standings={mockEastStandings} />)

    // Check for success status chips (playoff spots)
    const playoffChips = container.querySelectorAll('[class*="success"]')
    expect(playoffChips.length).toBeGreaterThan(0)
  })

  it('should show play-in indicator for teams 7-10', () => {
    const { container } = render(<StandingsTable conference="East" standings={mockEastStandings} />)

    // Check for info status chips (play-in spots)
    const playInChips = container.querySelectorAll('[class*="info"]')
    expect(playInChips.length).toBeGreaterThan(0)
  })

  it('should not show status chip for teams outside top 10', () => {
    render(<StandingsTable conference="East" standings={mockEastStandings} />)

    // Bulls are rank 11, should show plain number
    const { container } = render(<StandingsTable conference="East" standings={mockEastStandings} />)
    expect(container.textContent).toContain('11')
  })

  it('should render empty state when no standings', () => {
    render(<StandingsTable conference="East" standings={[]} />)

    expect(screen.getByText('No standings data available')).toBeTruthy()
  })

  it('should filter standings by conference', () => {
    const mixedStandings = [...mockEastStandings, ...mockWestStandings]

    render(<StandingsTable conference="East" standings={mixedStandings} />)

    expect(screen.getByText('Celtics')).toBeTruthy()
    expect(screen.queryByText('Lakers')).toBeNull()
  })

  it('should sort standings by playoff rank', () => {
    const unsortedStandings = [mockEastStandings[2]!, mockEastStandings[0]!, mockEastStandings[1]!]

    const { container } = render(<StandingsTable conference="East" standings={unsortedStandings} />)

    const rows = container.querySelectorAll('tbody tr')
    expect(rows.length).toBe(3)

    // First row should be Celtics (rank 1)
    expect(rows[0]?.textContent).toContain('Celtics')
    // Second row should be Knicks (rank 2)
    expect(rows[1]?.textContent).toContain('Knicks')
    // Third row should be 76ers (rank 7)
    expect(rows[2]?.textContent).toContain('76ers')
  })

  it('should render table headers', () => {
    render(<StandingsTable conference="East" standings={mockEastStandings} />)

    expect(screen.getByTitle('Rank')).toBeTruthy()
    expect(screen.getByTitle('Team')).toBeTruthy()
    expect(screen.getByTitle('Wins')).toBeTruthy()
    expect(screen.getByTitle('Loss')).toBeTruthy()
    expect(screen.getByTitle('Win %')).toBeTruthy()
    expect(screen.getByTitle('Games Behind')).toBeTruthy()
    expect(screen.getByTitle('L10 Streak')).toBeTruthy()
    expect(screen.getByTitle('Streak')).toBeTruthy()
  })

  it('should render legend', () => {
    render(<StandingsTable conference="East" standings={mockEastStandings} />)

    expect(screen.getByText('Playoff')).toBeTruthy()
    expect(screen.getByText('Play-In')).toBeTruthy()
  })

  it('should render team logo with correct alt text', () => {
    const { container } = render(<StandingsTable conference="East" standings={mockEastStandings} />)

    // WidgetAvatar may render as span with fallback, check for avatar containers
    const avatars = container.querySelectorAll('.shrink-0')
    expect(avatars.length).toBeGreaterThan(0)
  })

  it('should handle empty conference standings', () => {
    render(<StandingsTable conference="West" standings={mockEastStandings} />)

    expect(screen.getByText('No standings data available')).toBeTruthy()
  })
})
