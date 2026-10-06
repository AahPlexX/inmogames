# In progress

## PLATFORM-001: Firebase authentication and account saves
**Priority:** P0 | **Tags:** firebase, auth, firestore, persistence

Repository implementation of `docs/FIREBASE_ARCHITECTURE.md` is verified: shared optional email/password Auth, isolated guest/account repositories, transactional migration, secured/tested rules, durable Blackjack/Threefold checkpoints and browser emulator checks. Live completion is tracked by TASK-003. GitHub Pages is canonical; optional Firebase Hosting is independent.

**2026-10-06 configured-build handoff:** the Firebase Web app `inmogames` is registered to project `inmogames-c4b7f`, and the user has supplied all four documented public GitHub repository variables (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`) from the Firebase Web SDK configuration. Current connector permissions cannot independently enumerate Actions variables, so this is configuration provenance rather than a claim that GitHub exposed the values back to the agent. This integration intentionally triggers the Pages workflow so the variables can be consumed by a fresh production build. Remaining TASK-003 work is live-project verification: Email/Password provider, default native Firestore database, published repository rules, authorized `aahplexx.github.io` domain, and every deployed-site case in `docs/FIREBASE_SETUP.md`. Royal Palace Blackjack and Threefold remain game-local verified and are not reopened.
