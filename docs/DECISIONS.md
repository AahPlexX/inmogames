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

Automated version-update pull requests are disabled because this repository does not use pull requests. Dependency updates are researched, validated and committed directly to `main` under the same evidence and CI requirements as other changes. Major-version updates are never merged automatically.

## D-007 Exact direct dependencies (2026-10-03)

Direct runtime and development dependencies are pinned to exact versions, matching the reproducibility model used by InMo Tools. The lockfile remains authoritative for the full transitive graph. Dependency upgrades are deliberate main-branch changes that must pass frozen install and the full validation workflow.

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
