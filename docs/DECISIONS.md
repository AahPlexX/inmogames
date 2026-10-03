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
