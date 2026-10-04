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

## D-010 Firebase Hosting integration (2026-10-04)

Firebase integration defaults to static Hosting under the user's request. `build:firebase` overrides Vite's base to `/` while the Pages build keeps `/inmogames/`. Both hosts serve the same browser-only app and hash routes. `firebase.json` serves `dist` with immutable caching for hashed assets and revalidation for the HTML entry point. No runtime Firebase SDK, authentication, database or analytics is introduced. A live Firebase deployment requires a project ID and an authenticated deployment identity; these have not been supplied.
