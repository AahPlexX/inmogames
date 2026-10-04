# Next

## TASK-004: Optional Firebase Hosting deployment
**Priority:** P2 | **Tags:** deployment, firebase-hosting | **Status:** blocked

Optional Firebase Hosting compatibility and a root-base build are implemented. GitHub Pages remains the canonical deployment target, and Firebase Hosting is not required for Firebase Authentication or Cloud Firestore. Live Hosting deployment remains blocked on selecting a Firebase project ID and authenticating an identity with Hosting deployment access. Follow `docs/FIREBASE_HOSTING.md`; do not invent project identifiers or commit credentials.

After incorporating the concurrent Blackjack fix `207c458`, all 21 unit tests pass. Dependency policy, typecheck, game structure, and both host builds pass. Live Hosting verification remains pending the project and deployment identity.

## TASK-001: Enable GitHub Pages
**Priority:** P0 | **Tags:** deployment

In repository settings, set Pages > Source to "GitHub Actions".

Evidence: the frozen-lockfile workflow passes dependency policy, install, typecheck, game structure checks, unit tests and production build, and uploads the artifact. The separate deployment job still stops at `actions/configure-pages@v6` because the Pages site is not enabled.

Do not try to work around this with `configure-pages enablement: true`: the current action contract requires a token other than the default `GITHUB_TOKEN` for enablement, while this repository intentionally uses no extra secrets or tokens.


## TASK-003: Configure and verify live Firebase account services
**Priority:** P0 | **Tags:** platform, firebase, auth, firestore | **Status:** blocked externally

The repository implementation is verified with unit, Security Rules and Chromium Auth/Firestore emulator tests. Real integration still requires:

- Actual Web app `apiKey`, `authDomain`, `projectId`, `appId` supplied as the four documented public repository variables.
- Console verification that Email/Password is enabled, the default native Firestore database exists, repository rules are published and the final Pages/custom hostname is authorized for password-reset return URLs.
- TASK-001 Pages enablement plus deployment of the configured build.
- Real-site registration/sign-in/restoration, password-reset email/action/return, guest migration, two-browser checkpoint/reset, failure/retry and denied-access checks from `docs/FIREBASE_SETUP.md`.

No real Firebase project configuration or provisioning evidence is available. Emulator results do not establish live verification. Optional Firebase Hosting deployment is TASK-004 and is not required for these account services.
