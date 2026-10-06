# InMo Games

InMo Games is a local-first collection of focused browser games. The frontend is a static React/Vite application deployed with GitHub Pages. Guest play remains browser-local; optional user accounts use Firebase Authentication and Cloud Firestore so supported game progress can follow a signed-in player across browsers/devices.

## Platform rules

- Static frontend with GitHub Pages as the canonical deployment target; optional Firebase Hosting compatibility is secondary and not required for accounts/saves. No custom application server.
- Firebase Authentication + Cloud Firestore are the approved account/save backend.
- Guest mode remains available with local browser persistence.
- Authenticated persistent game data goes through a shared account-save layer rather than game-specific Firebase calls.
- Runtime network access is limited to site assets plus approved Firebase authentication/save traffic.
- No privileged credentials or service-account material may be shipped to the browser.

See `docs/FIREBASE_ARCHITECTURE.md` for the canonical account/save contract. See `DESIGN.md` for the shared visual language and game-specific design boundaries. Every game also owns an authoritative dated spec in `docs/specs/` plus a live `src/games/<slug>/TRACKER.md`; together they are the provider-neutral completion and continuation contract.

## Stack

- React + TypeScript + Vite
- pnpm with latest-stable, exact-pinned direct dependencies and a frozen lockfile
- Vitest for unit tests
- Playwright Chromium for account/persistence and rendered design regression checks
- Firebase Authentication + Cloud Firestore for optional accounts/account saves
- GitHub Actions validates and deploys to GitHub Pages from `main`

## Layout

- `DESIGN.md` - durable visual identity and semantic design contract.
- `AGENTS.md` - rules every contributor and agent follows.
- `GOVERNANCE.md` - binding repository-mutation rules.
- `docs/specs/YYYY-MM-DD-<slug>-design.md` - authoritative per-game scope/rules/completion sheet.
- `src/games/<slug>/TRACKER.md` - live per-game handoff/resume state.
- `docs/` - documentation standard, decision log, platform architecture and game index.
- `.tasks/` - task tracking.
- `src/catalog.ts` - the game catalog; `src/games/<slug>/` holds one game each.
- `src/platform/` - shared authentication/save platform modules.
- `scripts/game-check.mjs` - structural/completion check for every game folder.
- `scripts/game-doc-sync.mjs` - history-aware same-integration freshness check for game source/tests/index versus spec+tracker.

## Commands

- `pnpm dev` - local development server.
- `pnpm dependency:check` - reject dependency ranges so installs remain reproducible.
- `pnpm dependency:current` - require every direct dependency/devDependency to match the researched manifest and npm's current stable `latest` tag.
- `pnpm design:check` - validate the durable `DESIGN.md` contract with the exact pinned validator.
- `pnpm game:check` - validate per-game file/spec/tracker/completion structure **and** reject game changes whose authoritative spec+tracker were not updated in the same integration.
- `pnpm test:design-browser` - rendered UI regression checks for responsive composition, 200% text reflow, keyboard focus/selection, touch targets and reduced motion.
- `pnpm validate` - dependency/design policy, typecheck, game documentary checks, unit tests, rules/account browser tests, design-browser tests and both production builds.
- `pnpm test:rules` / `pnpm test:browser` - isolated Firebase rules and browser account/save checks.
- `pnpm build:firebase` - optional root-base static build for the existing Firebase Hosting compatibility path.

## Per-game continuity

Game implementation, game-specific tests/evidence, and a game's `GAME_INDEX` status cannot outrun its documentation. A game-local source/test/index change requires both the authoritative spec and tracker in that same commit/integration. Updating only one document is invalid. CI evaluates every commit in a pushed range so a later documentation-only commit cannot retroactively make an earlier stale game commit acceptable.

A game is complete only when its own spec `Completion contract` says `verified`, every applicable checklist gate is checked, its tracker/index/task state agrees, and recorded evidence supports the claim. Before any provider stops, the tracker's Current handoff must state the exact current status, open game-local work, external blockers and next action so another provider can resume without chat history.

## Deployment

GitHub Pages is enabled with Source = GitHub Actions. The Vite production base is `/inmogames/`, matching the repository project-site path. Every normal push to `main` starts the validate-and-deploy workflow; deployment runs only after the build/validation job succeeds. The dependency-maintenance workflow explicitly dispatches the Pages workflow after its own bot commit because GitHub intentionally suppresses recursive workflow triggers from `GITHUB_TOKEN` pushes.

Configure the public Web variables, Email/Password provider, Firestore database/rules and authorized hostname using [Firebase setup](docs/FIREBASE_SETUP.md). Missing configuration keeps the build and guest play available. No privileged credentials belong in the GitHub Pages bundle.

## Status

All current catalog games use the shared optional account/save platform and the shared InMo Game Cabinet shell. Threefold and Royal Palace Blackjack are game-local verified. Mergrove is implementing until its exact CI, rendered-browser, emulator and Pages evidence is reconciled in its authoritative completion contract. Real Firebase provisioning and deployed account-save verification remain external TASK-003 work. Guest play requires no Firebase setup.

For validation, use pnpm 10.0.0, Node 24.12.0+, Java 21 and Playwright Chromium. After `pnpm install --frozen-lockfile`, run `pnpm exec playwright install chromium` (add `--with-deps` on Linux when needed), then `pnpm validate`. An existing compatible Chromium may be selected with `CHROMIUM_PATH`. See the architecture document for cache, retry and reset semantics. Dependency integration rules and the current evidence matrix are in `docs/DEPENDENCY_POLICY.md`.
