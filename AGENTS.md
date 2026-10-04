# AGENTS.md

Rules for every contributor and agent working in InMo Games.

## Platform rules (never change)

- No user accounts or authentication.
- No server, backend or server-side database; the site is static files on GitHub Pages or Firebase Hosting.
- Everything runs in the player's browser; game data stays in that browser (IndexedDB, localStorage).

Game-specific consequences:

- No online leaderboards, no server multiplayer, no analytics, no ads. Multiplayer is same-device (hot-seat) only.
- Network use is limited to the site's own static files. No API keys.
- Every asset (art, audio, fonts, word lists) is original or has a licence compatible with redistribution, recorded in the game's `TRACKER.md`.

Default integration rule: if a feature fits these rules, build it and document it (spec, tracker, `.tasks/`). Exclude a feature only when it breaks these rules, a source's terms or licence, needs a key, or cannot run in a browser.

## Branch rule

Work on `origin/main` only. Commit directly to `main`; do not leave branches or open pull requests. See `GOVERNANCE.md`.

## Where things live

- `src/catalog.ts` - the list of games.
- `src/games/<slug>/` - one folder per game: `<slug>.meta.ts`, `<Name>Workspace.tsx`, engine modules, `TRACKER.md`.
- `src/games/workspaces.tsx` - lazy workspace registry keyed by slug.
- `docs/DOCUMENTATION_STANDARD.md` - naming, required docs, definition of done.
- `docs/DECISIONS.md` - decision log.
- `docs/GAME_INDEX.md` - one row per game.
- `.tasks/` - task state.

## Adding a game

1. Add a spec in `docs/specs/YYYY-MM-DD-<slug>-design.md`.
2. Add `src/games/<slug>/` with the files listed above.
3. Register it in `src/catalog.ts` and `src/games/workspaces.tsx`.
4. Add a row to `docs/GAME_INDEX.md` and a unit test for the engine.
5. Run `pnpm validate`, then update `.tasks/` and `docs/GAME_INDEX.md`.

## Code standards

- Keep game rules in pure engine modules (no React, no DOM) so they can be unit tested.
- Responsive layout with flexbox/grid and CSS `clamp()` typography; no horizontal overflow at 320 CSS px.
- Keyboard and touch operable; respect `prefers-reduced-motion`.
- YAGNI, KISS, DRY.
