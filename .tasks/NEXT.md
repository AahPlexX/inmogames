# Next

## TASK-004: Optional Firebase Hosting deployment
**Priority:** P2 | **Tags:** deployment, firebase-hosting | **Status:** blocked

Optional Firebase Hosting compatibility and a root-base build are implemented. GitHub Pages remains the canonical deployment target, and Firebase Hosting is not required for Firebase Authentication or Cloud Firestore. Live Hosting deployment remains blocked on selecting a Firebase project ID and authenticating an identity with Hosting deployment access. Follow `docs/FIREBASE_HOSTING.md`; do not invent project identifiers or commit credentials.

Current repository validation includes the full unit suite plus Firestore rules, account/persistence browser tests, design/game browser tests and both host builds. Royal Palace game verification is complete independently of optional Hosting. Live Hosting verification remains pending the project and deployment identity.

## TASK-003: Configure and verify live Firebase account services
**Priority:** P0 | **Tags:** platform, firebase, auth, firestore | **Status:** blocked externally

The repository implementation is verified with unit, Security Rules and Chromium Auth/Firestore emulator tests. Real integration still requires:

- Actual Web app `apiKey`, `authDomain`, `projectId`, `appId` supplied as the four documented public repository variables.
- Console verification that Email/Password is enabled, the default native Firestore database exists, repository rules are published and the final Pages/custom hostname is authorized for password-reset return URLs.
- Deploy a Firebase-configured `main` build through the already-enabled Pages workflow.
- Real-site registration/sign-in/restoration, password-reset email/action/return, guest migration, two-browser checkpoint/reset, failure/retry and denied-access checks from `docs/FIREBASE_SETUP.md`.

### Current handoff — 2026-10-06

- Live `origin/main` remains `dfeef18eb46eb7672888d7bb7d6c81a380a18345`; its full validation and Pages deployment evidence remains run `37394205294`.
- A fresh uncached fetch of `https://aahplexx.github.io/inmogames/` returned HTTP 200 and still renders: `Playing as a guest. Accounts are not available on this site yet.` This confirms the deployed bundle is currently unconfigured for Firebase accounts rather than merely carrying stale task text.
- No actual Firebase Web configuration or Console provisioning evidence is available in the repository or current connected tooling. The user intends to add the public Web configuration later. Do not invent values and do not request or store privileged credentials.
- Current GitHub connector access does not expose the repository Actions-variable endpoint, so presence/value verification of the four variables must be performed after the user adds them through GitHub or another authorized connection.
- Royal Palace Blackjack and Threefold remain game-local `verified`; TASK-003 is a shared external platform blocker and does not reopen either game.

**Next action once the public Web configuration is supplied:** verify the selected Firebase project against `docs/FIREBASE_SETUP.md` (Email/Password, default Firestore database, published repository rules, authorized `aahplexx.github.io` hostname), confirm/add the four repository variables, rebuild/deploy configured `main`, then execute and record every deployed-site verification case before changing TASK-003 from blocked externally.

Optional Firebase Hosting deployment is TASK-004 and is not required for these account services.
