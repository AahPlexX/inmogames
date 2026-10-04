# AGENTS.md

Rules for every contributor and agent working in InMo Games.

## Platform rules

These are binding defaults. Change them only through an explicit repository decision recorded in `docs/DECISIONS.md`.

- The frontend remains a static React/Vite application deployed on GitHub Pages. Do not add a custom application server.
- Firebase Authentication and Cloud Firestore are the approved managed backend services for optional user accounts and account-bound game persistence.
- Guest play remains supported. Guest saves use browser-local storage; authenticated saves use the shared Firebase save layer and may keep a browser-local cache.
- Runtime network access is limited to the site's own static files plus the Firebase endpoints required by the shared authentication/save platform. Games must not add arbitrary third-party APIs, telemetry, ads or runtime assets without a new explicit decision.
- No privileged Firebase credential may enter client code or the repository. Service-account JSON, private keys, Admin SDK credentials and secret tokens are forbidden. Firebase Web configuration is public client configuration, not an authorization secret; Firestore Security Rules enforce data ownership.
- Every asset (art, audio, fonts, word lists) must be original or have a redistribution-compatible licence recorded in the game's `TRACKER.md`.

Game-specific consequences:

- A game must not call Firebase directly from scattered UI code. Account/save behavior goes through shared platform modules.
- Persistent game data must have a documented schema version and migration behavior.
- Active/transient game state is persisted only when the game spec explicitly requires it.
- Online leaderboards and server-authoritative multiplayer remain out of scope unless separately designed and approved.

Default integration rule: if a feature fits these rules, build it and document it (spec, tracker, `.tasks/`). Exclude a feature only when it conflicts with these rules, a source's terms/licence, security requirements, or the static-client/Firebase platform boundary.

## Branch rule

Work on `origin/main` only. Commit directly to `main`; do not leave branches or open pull requests. See `GOVERNANCE.md`.

## Where things live

- `src/catalog.ts` - the list of games.
- `src/games/<slug>/` - one folder per game: `<slug>.meta.ts`, `<Name>Workspace.tsx`, engine modules, `TRACKER.md`.
- `src/games/workspaces.tsx` - lazy workspace registry keyed by slug.
- `src/platform/` - shared platform concerns such as Firebase bootstrap, authentication and game-save repositories.
- `docs/FIREBASE_ARCHITECTURE.md` - authoritative account/save platform contract.
- `docs/DOCUMENTATION_STANDARD.md` - naming, required docs, definition of done.
- `docs/DECISIONS.md` - decision log.
- `docs/GAME_INDEX.md` - one row per game.
- `.tasks/` - task state.

## Adding a game

1. Add a spec in `docs/specs/YYYY-MM-DD-<slug>-design.md`.
2. Add `src/games/<slug>/` with the files listed above.
3. Register it in `src/catalog.ts` and `src/games/workspaces.tsx`.
4. Add a row to `docs/GAME_INDEX.md` and unit tests for the engine.
5. If the game persists data, define its save schema/version and guest/account behavior without bypassing the shared save repository.
6. Run `pnpm validate`, then update `.tasks/` and `docs/GAME_INDEX.md`.

## Code standards

- Keep game rules in pure engine modules (no React, DOM, Firebase, storage or audio) so they can be unit tested.
- Responsive layout with flexbox/grid and CSS `clamp()` typography; no horizontal overflow at 320 CSS px.
- Keyboard and touch operable; respect `prefers-reduced-motion`.
- YAGNI, KISS, DRY.
