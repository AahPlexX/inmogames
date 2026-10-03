# Next

## TASK-001: Enable GitHub Pages
**Priority:** P0 | **Tags:** deployment

In repository settings, set Pages > Source to "GitHub Actions". The frozen-lockfile validation run on `1cef80a` passed install, typecheck, game structure checks, unit tests and production build, then `actions/configure-pages@v6` failed because the Pages site is not enabled.
