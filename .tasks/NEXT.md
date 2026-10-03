# Next

## TASK-001: Enable GitHub Pages
**Priority:** P0 | **Tags:** deployment

In repository settings, set Pages > Source to "GitHub Actions". Needed once before the first deploy can succeed. Cannot be done from the repository itself.

## TASK-002: Commit the lockfile
**Priority:** P1 | **Tags:** ci

Run `pnpm install` locally, commit `pnpm-lock.yaml`, then change CI to `--frozen-lockfile` (see D-005).
