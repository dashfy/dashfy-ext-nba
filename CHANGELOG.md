# @getdashfy/ext-nba

## 0.2.1

### Patch Changes

- Widen the `lucide-react` peer range to `>=0.454.0`. Because lucide is a `0.x` package, the previous `^0.454.0` only allowed patch bumps, so it could not be satisfied alongside `@getdashfy/ui`, which depends on `lucide-react@^0.555.0`. npm rejected the install with an `ERESOLVE` peer conflict.

## 0.2.0

### Minor Changes

- Require @getdashfy/ui ^0.3.1 and align @getdashfy/types dev dependency.

## 0.1.0

### Initial Release

First public release of the Dashfy NBA extension — widgets and a data client for visualizing NBA live scores, standings, and game statistics in a Dashfy dashboard.

- **NBA API client** (`createNbaClient`) with a configurable `baseUrl` proxy and request `timeout`.
- **Game widgets**: `Scoreboard`, `GameCard`.
- **Standings widget**: `Standings` with per-conference filtering.
- Real-time updates via WebSocket subscriptions and full Dashfy theme (light/dark) support.
