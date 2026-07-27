# @getdashfy/ext-nba

## 0.1.0

### Initial Release

First public release of the Dashfy NBA extension — widgets and a data client for visualizing NBA live scores, standings, and game statistics in a Dashfy dashboard.

- **NBA API client** (`createNbaClient`) with a configurable `baseUrl` proxy and request `timeout`.
- **Game widgets**: `Scoreboard`, `GameCard`.
- **Standings widget**: `Standings` with per-conference filtering.
- Real-time updates via WebSocket subscriptions and full Dashfy theme (light/dark) support.
