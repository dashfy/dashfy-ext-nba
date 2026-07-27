# `@getdashfy/ext-nba`

![Full README Row](https://shieldcn.dev/group/npm/@getdashfy/ext-nba+github/stars/dashfy/dashfy-ext-nba+github/ci/dashfy/dashfy-ext-nba+github/license/dashfy/dashfy-ext-nba.svg?variant=branded&size=xs)

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/dashfy?referralCode=INMsTa&utm_medium=integration&utm_source=template&utm_campaign=generic)

> NBA extension for [Dashfy](https://github.com/dashfy/dashfy) - Live scores, standings, and game statistics.

This extension provides widgets to display NBA games, scores, standings, and real-time game updates.

## Features

- **🏀 Live scores**: Real-time game scores and updates
- **📊 Standings**: Current season standings by conference
- **🎮 Game cards**: Detailed single game view with team leaders
- **📅 Scoreboard**: Multiple games view for any date
- **🏆 Conference filtering**: View East, West, or both conferences
- **⚡ Real-time updates**: Automatic data refresh via WebSocket subscriptions
- **🎨 Theme support**: Works with all Dashfy themes (light/dark mode)

## Installation

Install with your favorite package manager:

#### `npm`

```bash
npm install @getdashfy/ext-nba
```

#### `pnpm`

```bash
pnpm add @getdashfy/ext-nba
```

#### `yarn`

```bash
yarn add @getdashfy/ext-nba
```

#### `bun`

```bash
bun add @getdashfy/ext-nba
```

## Quick start

### 1. Server setup

Register the NBA API client in your Dashfy server (`dashfy.server.ts`):

```ts
import { Dashfy } from '@getdashfy/server'
import { createNbaClient } from '@getdashfy/ext-nba/client'

// Create a new Dashfy server instance
const dashfy = new Dashfy()

// Load dashboard configuration
await dashfy.configureFromFile('./dashfy.config.yml')

// Register NBA API
dashfy.registerApi('nba', createNbaClient())

// Start server
await dashfy.start()
```

### 2. Client setup

Register NBA widgets in your React application (`App.tsx`):

```tsx
import { WidgetRegistry } from '@getdashfy/ui'
import { GameCard, Scoreboard, Standings } from '@getdashfy/ext-nba'

// Register NBA extension
WidgetRegistry.addExtension('nba', {
  GameCard,
  Scoreboard,
  Standings,
})
```

### 3. Dashboard configuration

Add NBA widgets to your dashboard configuration (`dashfy.config.yml`):

```yaml
dashboards:
  - title: NBA Dashboard
    columns: 3
    rows: 2
    widgets:
      - extension: nba
        widget: Scoreboard
        subject: Today's Games
        x: 0
        y: 0
        columns: 2
        rows: 1

      - extension: nba
        widget: Standings
        conference: both
        x: 2
        y: 0
        columns: 1
        rows: 2
```

## NBA client configuration

This extension uses a proxy server to avoid CORS issues and rate limiting from the NBA API. The default proxy is `https://proxy.boxscores.site`.

#### Configuration options

```ts
createNbaClient({
  // Base URL for the NBA API proxy
  baseUrl: 'https://proxy.boxscores.site', // default

  // Request timeout in milliseconds
  timeout: 10_000, // default
})
```

To use your own proxy, set the `baseUrl`:

```ts
createNbaClient({
  baseUrl: 'https://your-proxy.example.com',
})
```

## API endpoints

`createNbaClient` registers the endpoints below. Widgets subscribe to them through the `endpoint` parameter, and you can call any of them from your own custom widgets.

| Endpoint         | Parameters             | Returns                                        |
| ---------------- | ---------------------- | ---------------------------------------------- |
| `games`          | `date`                 | Scoreboard for a given day (defaults to today) |
| `boxScore`       | `gameId`               | Box score and player statistics for a game     |
| `standings`      | `season`, `seasonType` | Conference standings for a season              |
| `playoffBracket` | `season`               | Playoff bracket for a season                   |

`boxScore` and `playoffBracket` have no built-in widget yet — they are available for custom widgets.

## Available widgets

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
  subject: Today's Games
  columns: 2
  rows: 1
```

**Example (specific date):**

```yaml
- extension: nba
  widget: Scoreboard
  subject: Christmas Games
  date: '2024-12-25'
  columns: 2
  rows: 1
```

Game status indicators: scheduled games show the tip-off time, in-progress games show the quarter and clock, and finished games show the final score.

### `GameCard`

Display a single NBA game with detailed information and team leaders (points, rebounds, assists).

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

A game can be selected two ways: by `gameId` for a specific game, or by `gameIndex` to pick by position (`0` = first game of the day).

**Example (first game of the day):**

```yaml
- extension: nba
  widget: GameCard
  gameIndex: 0
  columns: 1
  rows: 1
```

**Example (specific game):**

```yaml
- extension: nba
  widget: GameCard
  subject: Lakers vs Warriors
  gameId: '0022400123'
  columns: 1
  rows: 1
```

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

**Example (both conferences):**

```yaml
- extension: nba
  widget: Standings
  conference: both
  columns: 2
  rows: 2
```

**Example (Eastern Conference only):**

```yaml
- extension: nba
  widget: Standings
  subject: Conference Standings
  conference: East
  limit: 10
  columns: 1
  rows: 2
```

## Formats

- **Dates** use `YYYY-MM-DD` (e.g. `2024-12-25`) and default to today.
- **Seasons** use `YYYY-YY` (e.g. `2024-25`) and default to the current season.

## Troubleshooting

### No games displayed

**Solution:** Verify the date format is correct (`YYYY-MM-DD`) and that games were scheduled for that date.

### Proxy connection errors

**Solution:** The default proxy may be experiencing issues. Consider setting up your own proxy server via `baseUrl`, or waiting for the service to recover.

### Standings not loading

**Solution:** Ensure the season format is correct (`YYYY-YY`) and matches an actual NBA season.

### Game not found

**Solution:** Verify the `gameId` is correct, or use `gameIndex` instead to select by position.

## Contributing

Contributions are welcome. For issues and pull requests related to the extension, use the [dashfy/dashfy-ext-nba](https://github.com/dashfy/dashfy-ext-nba) repository. Framework contributions belong in [dashfy/dashfy](https://github.com/dashfy/dashfy).

## Community

Join the community on [Dashfy's Discord server](https://dashfy.dev/discord) to discuss the project, ask questions, or get help.

Join the conversation on X (Twitter) and follow [@dashfydev](https://x.com/dashfydev) for updates and announcements.

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE](./LICENSE) file for details.
