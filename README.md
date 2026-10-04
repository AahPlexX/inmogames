# InMo Games

InMo Games is a local-first collection of focused browser games. The frontend is a static React/Vite application deployed with GitHub Pages. Guest play remains browser-local; optional user accounts use Firebase Authentication and Cloud Firestore so supported game progress can follow a signed-in player across browsers/devices.

## Platform rules

- Static frontend on GitHub Pages; no custom application server.
- Firebase Authentication + Cloud Firestore are the approved account/save backend.
- Guest mode remains available with local browser persistence.
- Authenticated persistent game data goes through a shared account-save layer rather than game-specific Firebase calls.
- Runtime network access is limited to site assets plus approved Firebase authentication/save traffic.
- No privileged credentials or service-account material may be shipped to the browser.

See `docs/FIREBASE_ARCHITECTURE.md` for the canonical account/save contract.

## Stack

- React + TypeScript + Vite
- pnpm with exact dependency versions and a frozen lockfile
- Vitest for unit tests
- Firebase Authentication + Cloud Firestore for optional accounts/account saves
- GitHub Actions validates and deploys to GitHub Pages from `main`

## Layout

- `AGENTS.md` - rules every contributor and agent follows.
- `GOVERNANCE.md` - binding repository-mutation rules.
- `docs/` - documentation standard, decision log, platform architecture and game index.
- `.tasks/` - task tracking.
- `src/catalog.ts` - the game catalog; `src/games/<slug>/` holds one game each.
- `src/platform/` - shared authentication/save platform modules.
- `scripts/game-check.mjs` - structural check for every game folder.

## Commands

- `pnpm dev` - local development server.
- `pnpm dependency:check` - reject dependency ranges so installs remain reproducible.
- `pnpm validate` - dependency policy, typecheck, game check, unit tests and production build.

## Deployment

In the repository settings, set Pages > Source to "GitHub Actions" once. The Vite production base is `/inmogames/`, matching the repository project-site path. After Pages is enabled, every push to `main` that passes validation is published.

Firebase project provisioning, authorized domains, Authentication providers and Firestore rules are separate managed-service configuration. They must match `docs/FIREBASE_ARCHITECTURE.md`; no privileged credentials belong in the GitHub Pages bundle.

## Status

Two games are under active implementation. The Firebase account/save architecture is approved and documented; implementation is tracked as a separate platform workstream.
