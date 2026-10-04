# InMo Games

InMo Games is a local-first collection of focused browser games. The frontend is a static React/Vite application deployed with GitHub Pages. Guest play remains browser-local; optional user accounts use Firebase Authentication and Cloud Firestore so supported game progress can follow a signed-in player across browsers/devices.

## Platform rules

- Static frontend with GitHub Pages as the canonical deployment target; optional Firebase Hosting compatibility is secondary and not required for accounts/saves. No custom application server.
- Firebase Authentication + Cloud Firestore are the approved account/save backend.
- Guest mode remains available with local browser persistence.
- Authenticated persistent game data goes through a shared account-save layer rather than game-specific Firebase calls.
- Runtime network access is limited to site assets plus approved Firebase authentication/save traffic.
- No privileged credentials or service-account material may be shipped to the browser.

See `docs/FIREBASE_ARCHITECTURE.md` for the canonical account/save contract.

## Stack

- React + TypeScript + Vite
- pnpm with latest-stable, exact-pinned direct dependencies and a frozen lockfile
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
- `pnpm dependency:current` - require every direct dependency/devDependency to match the researched manifest and npm's current stable `latest` tag.
- `pnpm validate` - dependency policy, typecheck, game check, unit tests, rules/browser emulator tests and both production builds.
- `pnpm test:rules` / `pnpm test:browser` - isolated Firebase rules and browser account/save checks.
- `pnpm build:firebase` - optional root-base static build for the existing Firebase Hosting compatibility path.

## Deployment

GitHub Pages is enabled with Source = GitHub Actions. The Vite production base is `/inmogames/`, matching the repository project-site path. Every normal push to `main` starts the validate-and-deploy workflow; deployment runs only after the build/validation job succeeds. The dependency-maintenance workflow explicitly dispatches the Pages workflow after its own bot commit because GitHub intentionally suppresses recursive workflow triggers from `GITHUB_TOKEN` pushes.

Configure the public Web variables, Email/Password provider, Firestore database/rules and authorized hostname using [Firebase setup](docs/FIREBASE_SETUP.md). Missing configuration keeps the build and guest play available. No privileged credentials belong in the GitHub Pages bundle.

## Status

Both games use the shared optional account/save platform. Repository behavior is verified with unit, rules and browser emulator tests; real Firebase provisioning and deployed-site verification remain external tasks. Guest play requires no Firebase setup.

For validation, use pnpm 10.0.0, Node 24.12.0+, Java 21 and Playwright Chromium. After `pnpm install --frozen-lockfile`, run `pnpm exec playwright install chromium` (add `--with-deps` on Linux when needed), then `pnpm validate`. An existing compatible Chromium may be selected with `CHROMIUM_PATH`. See the architecture document for cache, retry and reset semantics. Dependency integration rules and the current evidence matrix are in `docs/DEPENDENCY_POLICY.md`.
