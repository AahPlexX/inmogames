# InMo Games

InMo Games is a local-first collection of focused browser games. Every game runs entirely in the player's browser, and the static application is deployed with GitHub Pages. It follows the same repository concept as [InMo Tools](https://github.com/AahPlexX/inmotools), with games in place of tools.

## Platform rules

- No user accounts or authentication.
- No server and no database; the site is static files on GitHub Pages.
- Everything runs in the browser; saves and scores stay in that browser (localStorage, IndexedDB).

## Stack

- React + TypeScript + Vite
- pnpm
- Vitest for unit tests
- GitHub Actions validates and deploys to GitHub Pages from `main`

## Layout

- `AGENTS.md` - rules every contributor and agent follows.
- `GOVERNANCE.md` - binding repository-mutation rules.
- `docs/` - documentation standard, decision log and game index.
- `.tasks/` - task tracking.
- `src/catalog.ts` - the game catalog; `src/games/<slug>/` holds one game each.
- `scripts/game-check.mjs` - structural check for every game folder.

## Commands

- `pnpm dev` - local development server.
- `pnpm validate` - typecheck, game check, unit tests and production build.

## Deployment

In the repository settings, set Pages > Source to "GitHub Actions" once. After that, every push to `main` that passes validation is published.

## Status

Foundation only: the shell, documentation and pipeline exist, and the catalog has no games yet.
