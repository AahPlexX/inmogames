# Next

## TASK-001: Enable GitHub Pages
**Priority:** P0 | **Tags:** deployment

In repository settings, set Pages > Source to "GitHub Actions".

Evidence: the frozen-lockfile workflow passes dependency policy, install, typecheck, game structure checks, unit tests and production build, then `actions/configure-pages@v6` fails because the Pages site is not enabled.

Do not try to work around this with `configure-pages enablement: true`: the current action contract requires a token other than the default `GITHUB_TOKEN` for enablement, while this repository intentionally uses no extra secrets or tokens.
