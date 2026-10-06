# In progress

## PLATFORM-001: Firebase authentication and account saves
**Priority:** P0 | **Tags:** firebase, auth, firestore, persistence

Repository implementation of `docs/FIREBASE_ARCHITECTURE.md` is verified: shared optional email/password Auth, isolated guest/account repositories, transactional migration, secured/tested rules, durable Blackjack/Threefold checkpoints and browser emulator checks. Live completion is blocked by TASK-003 (actual Firebase configuration/provisioning and deployed-site account/save verification). GitHub Pages is enabled and remains canonical; optional Hosting is independent.

**2026-10-06 live handoff:** the latest verified deployed application/dependency revision is `56a47d4ec080abc9887ceda1521ac8ae76818323`, which passed the complete validation chain and GitHub Pages deployment in run `37473631735` after the repository's required Vite 8.3.3 freshness refresh. A fresh uncached post-deploy fetch of `https://aahplexx.github.io/inmogames/` returned HTTP 200 and still reports `Playing as a guest. Accounts are not available on this site yet.` No Firebase Web configuration or live project-provisioning evidence has been supplied, so no live Auth/Firestore claim is made. Royal Palace Blackjack and Threefold remain game-local verified and are not reopened. Continue from TASK-003 after the four public Web configuration values are added and the Firebase Console prerequisites can be verified.
