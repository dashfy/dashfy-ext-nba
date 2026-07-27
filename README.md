# Dashfy NBA Extension

[![npm version](https://img.shields.io/npm/v/@dashfy/ext-nba.svg?style=flat-square)](https://www.npmjs.com/package/@dashfy/ext-nba)
[![License](https://img.shields.io/github/license/dashfy/dashfy.svg?style=flat-square)](https://github.com/dashfy/dashfy/blob/main/LICENSE)

> NBA extension for [Dashfy](https://github.com/dashfy/dashfy) - Live scores, standings, and game statistics.

This extension provides widgets to display NBA games, scores, standings, and real-time game updates.

## Features

- **🏀 Live scores**: Real-time game scores and updates
- **📊 Standings**: Current season standings by conference
- **🎮 Game cards**: Detailed single game view with team stats
- **📅 Scoreboard**: Multiple games view for any date
- **⏱️ Live updates**: Real-time game status and scores
- **🏆 Conference filtering**: View East, West, or both conferences
- **📈 Team leaders**: Top performers for each game
- **⚡ Real-time updates**: Automatic data refresh via WebSocket subscriptions
- **🎨 Theme support**: Works with all Dashfy themes (light/dark mode)

## Installation

```bash
npm install @dashfy/ext-nba
# or
pnpm add @dashfy/ext-nba
# or
yarn add @dashfy/ext-nba
```

## Quick Start

### 1. Server Setup

Register the NBA API client in your Dashfy server:

```ts
import { Dashfy } from '@dashfy/server'
import { createNbaClient } from '@dashfy/ext-nba'

const dashfy = new Dashfy()

// Register NBA API
dashfy.registerApi('nba', createNbaClient())

await dashfy.start()
```

### 2. Client Setup

Register NBA widgets in your React application:

```tsx
import { WidgetRegistry } from '@dashfy/ui'
import { GameCard, Scoreboard, Standings } from '@dashfy/ext-nba'

// Register all NBA widgets
WidgetRegistry.addExtension('nba', {
  GameCard,
  Scoreboard,
  Standings,
})
```

### 3. Dashboard Configuration

Add NBA widgets to your dashboard configuration:

```yaml
# dashfy.config.yml
dashboards:
  - title: NBA Dashboard
    columns: 3
    rows: 2
    widgets:
      - extension: nba
        widget: Scoreboard
        title: NBA
        subject: Today's Games
        x: 0
        y: 0
        columns: 2
        rows: 1

      - extension: nba
        widget: Standings
        title: NBA
        subject: Standings
        conference: both
        x: 2
        y: 0
        columns: 1
        rows: 2
```

## NBA Client Configuration

### Configuration Options

```ts
createNbaClient({
  // Base URL for the NBA API proxy
  baseUrl: 'https://proxy.boxscores.site', // default

  // Request timeout in milliseconds
  timeout: 10000, // default
})
```

### API Proxy

This extension uses a proxy server to avoid CORS issues and rate limiting from the NBA API. The default proxy is `https://proxy.boxscores.site`.

If you want to use your own proxy, you can set the `baseUrl` option:

```ts
createNbaClient({
  baseUrl: 'https://your-proxy.example.com',
})
```

## Available Widgets

### `Scoreboard`

Display multiple NBA games for a specific date with live scores and status.

**Parameters:**

| Parameter  | Type   | Required | Default      | Description               |
| ---------- | ------ | -------- | ------------ | ------------------------- |
| `title`    | string | no       | "NBA"        | Custom widget title       |
| `subject`  | string | no       | "Scoreboard" | Custom widget subject     |
| `date`     | string | no       | today        | Date in YYYY-MM-DD format |
| `api`      | string | no       | "nba"        | API subscription ID       |
| `endpoint` | string | no       | "games"      | API endpoint to call      |

**Example:**

```yaml
- extension: nba
  widget: Scoreboard
  title: NBA
  subject: Today's Games
  columns: 2
  rows: 1
```

**Example (Specific Date):**

```yaml
- extension: nba
  widget: Scoreboard
  title: NBA
  subject: Christmas Games
  date: '2024-12-25'
  columns: 2
  rows: 1
```

**Game Status Indicators:**

- **Not Started**: Shows scheduled game time
- **In Progress**: Shows current quarter and game clock
- **Final**: Shows final score

---

### `GameCard`

Display a single NBA game with detailed information and team leaders.

**Parameters:**

| Parameter   | Type   | Required | Default | Description                             |
| ----------- | ------ | -------- | ------- | --------------------------------------- |
| `title`     | string | no       | "NBA"   | Custom widget title                     |
| `subject`   | string | no       | "Game"  | Custom widget subject                   |
| `gameId`    | string | no       | -       | Specific game ID to display             |
| `gameIndex` | number | no       | 0       | Index of game to display (if no gameId) |
| `date`      | string | no       | today   | Date in YYYY-MM-DD format               |
| `api`       | string | no       | "nba"   | API subscription ID                     |
| `endpoint`  | string | no       | "games" | API endpoint to call                    |

**Example (First Game of the Day):**

```yaml
- extension: nba
  widget: GameCard
  title: NBA
  subject: Game 1
  gameIndex: 0
  columns: 1
  rows: 1
```

**Example (Specific Game):**

```yaml
- extension: nba
  widget: GameCard
  title: NBA
  subject: Lakers vs Warriors
  gameId: '0022400123'
  columns: 1
  rows: 1
```

**Example (Specific Date):**

```yaml
- extension: nba
  widget: GameCard
  title: NBA
  subject: Christmas Game
  date: '2024-12-25'
  gameIndex: 0
  columns: 1
  rows: 1
```

**Features:**

- Team names and tricodes
- Current scores
- Game status (scheduled, live, final)
- Team records (wins-losses)
- Team leaders (points, rebounds, assists)

---

### `Standings`

Display NBA standings by conference with team records and statistics.

**Parameters:**

| Parameter    | Type                       | Required | Default     | Description                    |
| ------------ | -------------------------- | -------- | ----------- | ------------------------------ |
| `title`      | string                     | no       | "NBA"       | Custom widget title            |
| `subject`    | string                     | no       | "Standings" | Custom widget subject          |
| `conference` | "East" \| "West" \| "both" | no       | "both"      | Conference to display          |
| `season`     | string                     | no       | current     | Season in YYYY-YY format       |
| `limit`      | number                     | no       | 15          | Number of teams per conference |
| `api`        | string                     | no       | "nba"       | API subscription ID            |
| `endpoint`   | string                     | no       | "standings" | API endpoint to call           |

**Example (Both Conferences):**

```yaml
- extension: nba
  widget: Standings
  title: NBA
  subject: Standings
  conference: both
  columns: 2
  rows: 2
```

**Example (Eastern Conference Only):**

```yaml
- extension: nba
  widget: Standings
  title: NBA
  subject: Conference Standings
  conference: East
  limit: 10
  columns: 1
  rows: 2
```

**Example (Specific Season):**

```yaml
- extension: nba
  widget: Standings
  title: NBA
  subject: 2023-24 Standings
  conference: both
  season: '2023-24'
  columns: 2
  rows: 2
```

**Displayed Information:**

- Team rank
- Team name
- Win-loss record
- Conference record
- Home/Away records
- Last 10 games record
- Current streak

---

## Complete Examples

### Example 1: Live Games Dashboard

```yaml
# dashfy.config.yml
dashboards:
  - title: NBA Live
    columns: 3
    rows: 2
    widgets:
      # Today's scoreboard
      - extension: nba
        widget: Scoreboard
        title: NBA
        subject: Today's Games
        x: 0
        y: 0
        columns: 3
        rows: 1

      # Featured game
      - extension: nba
        widget: GameCard
        title: NBA
        subject: Featured Game
        gameIndex: 0
        x: 0
        y: 1
        columns: 1
        rows: 1

      # Standings
      - extension: nba
        widget: Standings
        title: NBA
        subject: Standings
        conference: both
        limit: 8
        x: 1
        y: 1
        columns: 2
        rows: 1
```

### Example 2: Conference-Focused Dashboard

```yaml
dashboards:
  - title: Eastern Conference
    columns: 2
    rows: 2
    widgets:
      # Eastern Conference standings
      - extension: nba
        widget: Standings
        title: NBA
        subject: Conference Standings
        conference: East
        x: 0
        y: 0
        columns: 1
        rows: 2

      # Today's games
      - extension: nba
        widget: Scoreboard
        title: NBA
        subject: Today's Games
        x: 1
        y: 0
        columns: 1
        rows: 1

      # Featured game
      - extension: nba
        widget: GameCard
        title: NBA
        subject: Game of the Day
        gameIndex: 0
        x: 1
        y: 1
        columns: 1
        rows: 1
```

### Example 3: Historical Games Dashboard

```yaml
dashboards:
  - title: NBA History
    columns: 3
    rows: 1
    widgets:
      # Christmas 2023 games
      - extension: nba
        widget: Scoreboard
        title: NBA
        subject: Christmas 2023
        date: '2023-12-25'
        x: 0
        y: 0
        columns: 1
        rows: 1

      # Opening night 2024
      - extension: nba
        widget: Scoreboard
        title: NBA
        subject: Opening Night 2024
        date: '2024-10-22'
        x: 1
        y: 0
        columns: 1
        rows: 1

      # 2023-24 final standings
      - extension: nba
        widget: Standings
        title: NBA
        subject: 2023-24 Final
        season: '2023-24'
        conference: both
        x: 2
        y: 0
        columns: 1
        rows: 1
```

### Example 4: TypeScript Configuration

```ts
import type { DashfyConfig } from '@dashfy/types'

const config: DashfyConfig = {
  dashboards: [
    {
      title: 'NBA Dashboard',
      columns: 3,
      rows: 2,
      widgets: [
        {
          extension: 'nba',
          widget: 'Scoreboard',
          title: 'NBA',
          subject: "Today's Games",
          x: 0,
          y: 0,
          columns: 2,
          rows: 1,
        },
        {
          extension: 'nba',
          widget: 'Standings',
          title: 'NBA',
          subject: 'Standings',
          conference: 'both',
          limit: 10,
          x: 2,
          y: 0,
          columns: 1,
          rows: 2,
        },
        {
          extension: 'nba',
          widget: 'GameCard',
          title: 'NBA',
          subject: 'Featured Game',
          gameIndex: 0,
          x: 0,
          y: 1,
          columns: 2,
          rows: 1,
        },
      ],
    },
  ],
}

export default config
```

## Advanced Features

### Real-Time Updates

The NBA extension automatically refreshes data at regular intervals to provide live score updates. The refresh rate depends on your Dashfy server configuration.

### Date Formatting

Dates should be provided in `YYYY-MM-DD` format:

```yaml
date: "2024-12-25"  # Christmas Day 2024
date: "2024-10-22"  # Opening Night 2024
```

### Season Formatting

Seasons should be provided in `YYYY-YY` format:

```yaml
season: "2024-25"  # 2024-2025 season
season: "2023-24"  # 2023-2024 season
```

### Conference Filtering

The `Standings` widget supports three conference options:

- `"East"` - Eastern Conference only
- `"West"` - Western Conference only
- `"both"` - Both conferences (default)

### Game Selection

The `GameCard` widget supports two ways to select a game:

1. **By Game ID**: Use the `gameId` parameter for a specific game
2. **By Index**: Use the `gameIndex` parameter to select by position (0 = first game, 1 = second game, etc.)

## Data Sources

This extension uses the official NBA API through a proxy server:

- **Scoreboard**: Live game scores and status
- **Standings**: Current season standings
- **Game Details**: Box scores and player statistics

## Troubleshooting

### No games displayed

**Solution:** Verify the date format is correct (YYYY-MM-DD) and that games were scheduled for that date.

### Proxy connection errors

**Solution:** The default proxy may be experiencing issues. Consider setting up your own proxy server or waiting for the service to recover.

### Standings not loading

**Solution:** Ensure the season format is correct (YYYY-YY) and matches an actual NBA season.

### Game not found

**Solution:** Verify the `gameId` is correct or use `gameIndex` instead to select by position.

## Contributing

Contributions are welcome! Please refer to the main [Dashfy contributing guide](https://github.com/dashfy/dashfy/blob/main/CONTRIBUTING.md).

## Related Packages

- [`@dashfy/server`](https://www.npmjs.com/package/@dashfy/server) - Dashfy server
- [`@dashfy/ui`](https://www.npmjs.com/package/@dashfy/ui) - Dashfy UI components
- [`@dashfy/types`](https://www.npmjs.com/package/@dashfy/types) - Dashfy TypeScript types
- [`@dashfy/ext-github`](https://www.npmjs.com/package/@dashfy/ext-github) - GitHub extension
- [`@dashfy/ext-json`](https://www.npmjs.com/package/@dashfy/ext-json) - JSON/REST API extension

## License

MIT © [Breno Polanski](https://github.com/brenopolanski)

---

Part of the [Dashfy](https://github.com/dashfy/dashfy) project.
