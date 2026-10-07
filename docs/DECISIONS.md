# Decision log

## D-001 Games-only sibling of InMo Tools (2026-10-03)

InMo Games reuses the InMo Tools concept (static, local-first, GitHub Pages, spec plus tracker per item) but contains games only. Tools stay in `inmotools`.

## D-002 Stack (2026-10-03)

React, TypeScript, Vite, pnpm, Vitest. Chosen to match InMo Tools so patterns transfer.

## D-003 Hash routing (2026-10-03)

Routes are `#/games/<slug>`. This works on GitHub Pages without fallback files. Trade-off: fragment routes are not reliably indexed by search engines as separate pages. InMo Tools records the same limitation.

## D-004 Direct commits to main (2026-10-03)

No branches or pull requests. Validation runs on every push to `main` and deployment is gated on it.

## D-005 Lockfile bootstrap (2026-10-03)

The first commit has no `pnpm-lock.yaml`, so CI installs with `--no-frozen-lockfile`. After the first local `pnpm install`, commit the lockfile and switch CI to `--frozen-lockfile`.

## D-006 Dependency maintenance follows the direct-main rule (2026-10-03)

Automated version-update pull requests are disabled because this repository does not use pull requests. Dependency updates are researched against authoritative release documentation, corroborated with npmjs.com, expressed as explicit exact targets, fully validated, and committed directly to `main`. The maintenance workflow may apply an explicit researched target set and commit it only after full validation; it never chooses a prerelease or blindly upgrades to an unreviewed target.

## D-007 Exact direct dependencies (2026-10-03)

Direct runtime and development dependencies are pinned to exact versions and must equal npm's stable `latest` tag at integration time. The lockfile remains authoritative for the full transitive graph. `dependency:check` enforces exact syntax; `dependency:current` compares the researched target manifest to `package.json` and npm's live stable tag. Dependency upgrades are deliberate main-branch changes that must pass frozen install and the full validation workflow.

## D-008 Pages bootstrap remains a one-time repository setting (2026-10-03)

The deployment workflow uses the default `GITHUB_TOKEN` only. Current `actions/configure-pages` documentation requires a different token with elevated repository permissions when `enablement: true` is used. InMo Games will not add a privileged token just to automate a one-time setting, so Pages must be enabled once in Settings > Pages with GitHub Actions as the source.

## D-009 Vite Pages base path (2026-10-03)

The production base is `/inmogames/`, matching Vite's current GitHub Pages guidance for a project site hosted at `<owner>.github.io/<repo>/`. Hash routing remains under that static project path. If the site later moves to a custom domain or an owner-level Pages repository, this base decision must be revisited.

## D-010 Firebase account and save platform (2026-10-04)

InMo Games retains a static React/Vite frontend on GitHub Pages but now supports optional user accounts and cross-device persistent game data through Firebase Authentication and Cloud Firestore. This supersedes the original no-auth/no-database/no-runtime-network platform restriction.

No custom application server is introduced. Runtime network access is restricted to the site's static assets and the Firebase services required by the shared authentication/save layer unless a later decision explicitly expands the platform boundary.

## D-011 Guest-first hybrid persistence (2026-10-04)

Account creation is optional. Guests continue to play with browser-local persistence. Authenticated players use Cloud Firestore as the authoritative account save with a browser-local mirror/cache.

Games must not call Firestore directly from their workspaces or engines. Shared platform repositories own cloud/local selection, serialization, migration and error handling. Each persistent game owns a versioned game-state schema.

When a user signs in and no cloud save exists for a game, eligible local progress may seed the account save. When a cloud save already exists, it is authoritative; implementations must not silently overwrite it with unrelated guest progress.

## D-012 Firebase security boundary (2026-10-04)

Firebase Web configuration is public browser configuration and is not an authorization secret. Privileged credentials—including service-account JSON, private keys and Firebase Admin credentials—must never enter the repository or client bundle.

Firestore Security Rules must deny access by default and permit a signed-in user to read/write only their own account-save documents. Initial account saves use the path `users/{uid}/games/{gameSlug}`. Security enforcement belongs in Firestore rules, not merely in React route/UI checks.

## D-013 Firebase Hosting is optional and separate from account persistence (2026-10-04)

The repository already contains a secondary Firebase Hosting build/configuration path. It is retained as optional static-host compatibility only. GitHub Pages remains the canonical deployment target.

Firebase Authentication and Cloud Firestore must work from the GitHub Pages build and must not require Firebase Hosting. Hosting project selection/deployment is a separate lower-priority task and must not block account/save implementation.

## D-014 Shared account-save implementation (2026-10-04)

The modular `firebase@12.19.0` SDK is pinned exactly after checking official Firebase documentation/release notes and the npm latest tag. Optional email/password Auth uses browser-local persistence and an explicit in-memory fallback when storage is blocked. Firestore Lite supplies direct server reads/writes; the shared platform owns per-user local mirrors, ordered checkpoint queues and nonblocking retry. Pure engines remain unchanged and Firebase-free.

Each game owns a version-1 schema. Atomic first-load migration seeds guest progress only if the account document is absent. Existing account saves take precedence. Account reset writes the game's default envelope instead of deleting its document, preventing old guest state from reseeding a reset game. Guest reset removes only the selected local key. Pending retry intent lives in the current page; a successful load after reload/sign-out gives cloud state precedence.

Blackjack persists only completed settlements and preferences merged into the last committed balance. Staged chips and unfinished rounds never alter durable credit totals. Threefold persists only a best completed five-round score. The Security Rules require ownership plus a versioned map/server-time envelope. Unit, Firebase-supported rules emulator and Chromium Auth/save emulator tests are required validation checks. Console provisioning, actual email delivery and deployed-site verification remain external requirements described in `docs/FIREBASE_SETUP.md`.

## D-015 Validation precedes Pages configuration (2026-10-04)

The build job validates both host builds plus unit/rules/browser tests and uploads the Pages artifact without requiring an enabled Pages site. The deployment job configures Pages immediately before deploying. This keeps exact-revision validation independent of the known external Pages-enable task while retaining deployment gating and the default GitHub token. No privileged enablement workaround is added.

## D-016 Automatic Pages deployment after validated main integration (2026-10-04)

GitHub Pages is enabled with GitHub Actions as its source. `.github/workflows/pages.yml` runs on every ordinary push to `main` and on manual dispatch; the deploy job depends on successful validation/build. A commit created by a workflow with `GITHUB_TOKEN` does not recursively emit another push workflow, so the dependency-maintenance workflow explicitly dispatches `pages.yml` after a successful bot commit. This preserves automatic deployment for every supported `main` integration path without adding a privileged external token.

## D-017 Latest-stable direct dependency gate (2026-10-04)

Every direct `dependencies` and `devDependencies` package must be the stable npm `latest` release when integrated, pinned exactly with no caret/range. Before integration, its target version is checked against the project's authoritative release source and npmjs.com and recorded in `docs/DEPENDENCY_POLICY.md` plus `.tasks/dependency-refresh-request.json`. CI additionally queries npm's live `latest` endpoint on each `main` validation. If a stable release appears before a later integration, validation blocks until the dependency set is deliberately refreshed and the full suite passes.

## D-018 Shared game-cabinet design system (2026-10-04)

InMo Games uses a shared product-shell visual system documented in `DESIGN.md`, with runtime shared tokens owned by `src/styles.css`. The shell uses a restrained blue-enamel/ivory/brick/brass language and system fonts only. Catalog, navigation, account/save surfaces, focus treatment and spacing remain shared.

Individual games may use scoped material identities when they support the game itself. Threefold uses a tactile paper/tile puzzle-board language; Royal Palace Blackjack uses a private felt/card-table language. Game-local styling must not redefine shared navigation, account, save, accessibility or responsive contracts.

`pnpm design:check` validates DESIGN.md on every normal Pages integration and through aggregate validation.

## D-019 Per-game documentation must be current at every integrated checkpoint (2026-10-05)

A game's authoritative spec sheet and live tracker are part of that game's implementation, not deferred documentation. Any change to `src/games/<slug>/`, game-specific tests/evidence, or the game's `docs/GAME_INDEX.md` row must update both the authoritative dated spec and `TRACKER.md` in the same commit/integration. Updating one without the other is invalid.

`scripts/game-doc-sync.mjs` is the history-aware enforcement layer behind `pnpm game:check`. Normal push validation fetches full history and supplies the pre-push base; each commit in the pushed range is evaluated separately, so a later documentation-only commit cannot retroactively repair an earlier stale game commit. Generic test files are mapped to games when they reference `src/games/<slug>` or `#/games/<slug>`. Local and maintenance validation also checks staged/working changes and a previous-commit fallback.

This rule exists so any provider or agent can resume from any integrated checkpoint using repository state alone. Hidden chat history, provider memory, or a promise to update docs later is never a valid continuation mechanism.
