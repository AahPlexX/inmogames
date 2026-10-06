# Next

## TASK-004: Optional Firebase Hosting deployment
**Priority:** P2 | **Tags:** deployment, firebase-hosting | **Status:** blocked

Optional Firebase Hosting compatibility and a root-base build are implemented. GitHub Pages remains the canonical deployment target, and Firebase Hosting is not required for Firebase Authentication or Cloud Firestore. Live Hosting deployment remains blocked on authenticating an identity with Hosting deployment access. Follow `docs/FIREBASE_HOSTING.md`; do not commit credentials.

Current repository validation includes the full unit suite plus Firestore rules, account/persistence browser tests, design/game browser tests and both host builds. Royal Palace game verification is complete independently of optional Hosting.

## TASK-003: Configure and verify live Firebase account services
**Priority:** P0 | **Tags:** platform, firebase, auth, firestore | **Status:** blocked externally

Repository implementation is verified with unit, Security Rules and Chromium Auth/Firestore emulator tests. The Firebase Web app `inmogames` is now registered to project `inmogames-c4b7f`, and the user has supplied all four public Web configuration values as the documented GitHub repository variables. Connector permissions do not expose Actions-variable administration, so their presence is user-confirmed and must be functionally verified by a fresh production build rather than claimed from an unavailable variables API.

Real integration still requires:

- A fresh GitHub Pages build/deployment that consumes the four repository variables and exposes the account UI on the deployed site.
- Console/live verification that Email/Password is enabled, the default native Firestore database exists, repository `firestore.rules` are published, and `aahplexx.github.io` is authorized for password-reset return URLs.
- Real-site registration/sign-in/restoration, password-reset email/action/return, guest migration, two-browser checkpoint/reset, failure/retry and denied-access checks from `docs/FIREBASE_SETUP.md`.

### Current handoff — 2026-10-06

- Historical game/platform baseline: `dfeef18eb46eb7672888d7bb7d6c81a380a18345` / run `37394205294`.
- Latest fully validated/deployed pre-Firebase-config revision: `e24a268abea0cce99cf710450c752b4976c67b38` / run `37474501728`; that deployment still showed accounts unavailable because the variables had not yet been supplied.
- The registered Firebase Web SDK configuration identifies project `inmogames-c4b7f` and provides the expected `apiKey`, `authDomain`, `projectId`, and `appId`; only those four values are consumed by the current client configuration contract. Service-account/Admin SDK credentials are not used by this GitHub Pages client architecture.
- The user reports all four required repository variables are now present. This documentation integration is intentionally used to trigger a new Pages workflow against that configuration.
- Royal Palace Blackjack and Threefold remain game-local `verified`; TASK-003 is shared platform work and does not reopen either game.

**Immediate continuation:** observe the configured Pages workflow, verify the deployed site no longer reports accounts unavailable, then test/identify the remaining Firebase Console prerequisites and execute every safe live verification case. Do not mark TASK-003 complete until real-project evidence is recorded distinctly from emulator evidence.

Optional Firebase Hosting deployment is TASK-004 and is not required for these account services.
