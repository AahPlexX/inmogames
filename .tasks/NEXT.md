# Next

## TASK-003: Connect Firebase Hosting project
**Priority:** P1 | **Tags:** deployment, firebase | **Status:** blocked

Hosting configuration and a root-base build are implemented. Live deployment remains blocked on selecting a Firebase project ID and authenticating an identity with Hosting deployment access. Follow `docs/FIREBASE_HOSTING.md`; do not invent project identifiers or commit credentials. Game status in `docs/GAME_INDEX.md` is unchanged by this hosting integration.

After incorporating the concurrent Blackjack fix `207c458`, all 21 unit tests pass. Dependency policy, typecheck, game structure, and both host builds pass. Live Hosting verification remains pending the project and deployment identity.

## TASK-001: Enable GitHub Pages
**Priority:** P0 | **Tags:** deployment

In repository settings, set Pages > Source to "GitHub Actions".

Evidence: the frozen-lockfile workflow passes dependency policy, install, typecheck, game structure checks, unit tests and production build, then `actions/configure-pages@v6` fails because the Pages site is not enabled.

Do not try to work around this with `configure-pages enablement: true`: the current action contract requires a token other than the default `GITHUB_TOKEN` for enablement, while this repository intentionally uses no extra secrets or tokens.


## TASK-003: Integrate Firebase account persistence
**Priority:** P0 | **Tags:** platform, firebase, auth, firestore

Implement `docs/FIREBASE_ARCHITECTURE.md` as a shared platform capability. Required scope includes email/password auth, persistent auth state, password reset, sign out, Firestore per-user game saves, guest-local fallback, first-sign-in local seeding only when no cloud save exists, Firestore ownership rules, tests, exact dependency pins, and migration of Royal Palace Blackjack/Threefold persistence.

Do not invent Firebase project configuration. If external Firebase project provisioning/config values are unavailable, finish all repository-side work that can be verified and record the exact external blocker.
