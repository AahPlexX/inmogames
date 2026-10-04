# Documentation standard

## Platform rules (apply to every game and every spec)

- **No user accounts or authentication.** No sign-in, sessions, tokens or identity.
- **No server and no server-side database.** Static files on GitHub Pages or Firebase Hosting only.
- **Everything runs in the browser.** Saves, settings and scores live only in that browser (IndexedDB, localStorage) and are never uploaded.
- **Network use is limited** to the site's own static files.

## Naming convention

- Slug: lowercase kebab-case, unique, stable once published (`^[a-z0-9]+(-[a-z0-9]+)*$`).
- Display name: short, plain, title case.
- Folder: `src/games/<slug>/`. Meta file: `<slug>.meta.ts`. Workspace: `<PascalName>Workspace.tsx`.
- Route: `#/games/<slug>`.

## Required documents per game

- Spec: `docs/specs/YYYY-MM-DD-<slug>-design.md` (rules, controls, scoring, storage keys, accessibility).
- Tracker: `src/games/<slug>/TRACKER.md` (capability list with status `planned`, `started`, `verified`, `blocked`, `excluded`; asset licences).
- Index row: `docs/GAME_INDEX.md`.

## Definition of done for a game

- Playable start to finish on desktop and touch.
- Engine unit tests pass.
- No horizontal overflow at 320 CSS px; keyboard operable; reduced motion respected.
- Local save and reset work and are described in the spec.
- Tracker has no capability left `planned` or `started`.
- `pnpm validate` green and Pages deployment successful.
