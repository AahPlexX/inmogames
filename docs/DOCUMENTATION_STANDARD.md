# Documentation standard

## Platform rules (apply to every game and every spec)

- **Static frontend.** React/Vite uses GitHub Pages as the canonical deployment target. Optional Firebase Hosting compatibility may exist as a secondary static host, but auth/save features must not depend on it. No custom application server is part of the application architecture.
- **Optional accounts are supported.** Firebase Authentication is the approved identity provider.
- **Account-bound persistence is supported.** Cloud Firestore is the approved cloud save store.
- **Guest play remains local-first.** Browser-local storage remains the guest/offline cache path where the game has persistent data.
- **Shared platform layer.** Games do not embed ad hoc Firebase calls. Authentication and account saves go through shared `src/platform/` modules.
- **Restricted runtime network.** Runtime calls may reach the site's static assets and the approved Firebase authentication/save services only unless a later repository decision says otherwise.
- **No privileged client credentials.** Service accounts, Admin credentials, private keys and secret tokens are forbidden in browser code or the repository.

The canonical account/save contract is `docs/FIREBASE_ARCHITECTURE.md`.

## Dependency evidence

All direct `dependencies` and `devDependencies` must be exact-pinned latest stable releases at integration time. Any dependency change requires current authoritative release evidence plus npmjs.com corroboration recorded in `docs/DEPENDENCY_POLICY.md`, an updated `.tasks/dependency-refresh-request.json`, a regenerated frozen lockfile, and successful `pnpm dependency:check`, `pnpm dependency:current`, and full validation. Prerelease channels are excluded unless separately approved by a repository decision.

## Naming convention

- Slug: lowercase kebab-case, unique, stable once published (`^[a-z0-9]+(-[a-z0-9]+)*$`).
- Display name: short, plain, title case.
- Folder: `src/games/<slug>/`. Meta file: `<slug>.meta.ts`. Workspace: `<PascalName>Workspace.tsx`.
- Route: `#/games/<slug>`.

## Required documents per game

- Spec: `docs/specs/YYYY-MM-DD-<slug>-design.md` (rules, controls, scoring, persistence/schema behavior, accessibility).
- Tracker: `src/games/<slug>/TRACKER.md` (capability list with status `planned`, `started`, `verified`, `blocked`, `excluded`; asset licences).
- Index row: `docs/GAME_INDEX.md`.

If a game has persistent data, its spec must state:
- local storage key/cache behavior;
- cloud game slug/document identity;
- save schema version;
- which state is durable versus intentionally transient;
- reset behavior;
- guest-to-account migration behavior;
- behavior when Firebase is unavailable or the user is signed out.

## Definition of done for a game

- Playable start to finish on desktop and touch.
- Engine unit tests pass.
- No horizontal overflow at 320 CSS px; keyboard operable; reduced motion respected.
- Any persistent game data has verified guest-local behavior and, once the platform integration is available, verified authenticated account-save behavior.
- Save/reset/migration behavior is described in the spec and does not bypass the shared repository abstraction.
- Tracker has no capability left `planned` or `started`.
- `pnpm validate` green, including exact/current dependency gates, mandatory account/save rules and browser emulator checks, and Pages deployment successful.
- Firebase-enabled features also record real configured-project/deployed-site verification or its exact external blocker; emulator results alone do not establish live verification.
