# Next

## TASK-004: Optional Firebase Hosting deployment
**Priority:** P2 | **Tags:** deployment, firebase-hosting | **Status:** blocked

Optional Firebase Hosting compatibility and a root-base build are implemented. GitHub Pages remains the canonical deployment target, and Firebase Hosting is not required for Firebase Authentication or Cloud Firestore. Live Hosting deployment remains blocked on authenticating an identity with Hosting deployment access. Follow `docs/FIREBASE_HOSTING.md`; do not commit credentials.

Current repository validation includes the full unit suite plus Firestore rules, account/persistence browser tests, design/game browser tests and both host builds. Royal Palace game verification is complete independently of optional Hosting.

## TASK-003: Configure and verify live Firebase account services
**Priority:** P0 | **Tags:** platform, firebase, auth, firestore | **Status:** blocked externally

Repository implementation is verified with unit, Security Rules and Chromium Auth/Firestore emulator tests. The Firebase Web app `inmogames` is registered to project `inmogames-c4b7f`, and configured revision `05d035914d50bf8ab206745a8c07ff672c1cb99e` passed the complete Pages workflow in run `37478582518`. A fresh uncached production fetch now renders `Sign in / create account`, proving the four Web configuration variables are present in the deployed bundle and accepted by the current client configuration contract.

Live service verification now has two concrete external blockers:

- Firebase Authentication is not yet initialized/configured enough for the app: the public Identity Toolkit project-configuration request for the registered Web app returns HTTP 400 `CONFIGURATION_NOT_FOUND`. Firebase's official guidance associates this error with Authentication/sign-in-provider setup not being enabled. Enable Authentication and the Email/Password provider before registration/sign-in tests.
- The default Cloud Firestore service is not yet available: a direct REST probe to project `inmogames-c4b7f` returns HTTP 403 stating that the Cloud Firestore API has not been used in the project before or is disabled. Create the `(default)` Firestore database in native/Standard mode and then publish the repository's `firestore.rules`.

After those two prerequisites are complete, verify `aahplexx.github.io` in Authentication > Settings > Authorized domains and execute the real-site registration/sign-in/restoration, password-reset email/action/return, deterministic guest migration, two-browser durable saves, scoped reset, failed-write retry and denied ownership/unauthenticated access cases from `docs/FIREBASE_SETUP.md`.

### Evidence — 2026-10-06

- Historical game/platform baseline: `dfeef18eb46eb7672888d7bb7d6c81a380a18345` / run `37394205294`.
- Latest configured production revision: `05d035914d50bf8ab206745a8c07ff672c1cb99e` / run `37478582518`; build and deploy both concluded successfully.
- Production account UI is now enabled, replacing the previous unavailable-account banner. This verifies GitHub Actions consumed a syntactically valid Web configuration; it does not by itself verify Firebase Auth or Firestore provisioning.
- Identity Toolkit public project configuration currently returns `CONFIGURATION_NOT_FOUND`.
- Default Firestore REST currently returns HTTP 403 indicating the Cloud Firestore API has not been used before or is disabled for `inmogames-c4b7f`.
- Royal Palace Blackjack and Threefold remain game-local `verified`; TASK-003 remains shared external platform work and does not reopen either game.

**Immediate continuation after Console provisioning:** re-run the public/Auth/Firestore probes, then perform the deployed-site verification matrix. Do not mark TASK-003 complete until real-project evidence is recorded distinctly from emulator evidence.

Optional Firebase Hosting deployment is TASK-004 and is not required for these account services.
