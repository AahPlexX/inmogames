# In progress

## PLATFORM-001: Firebase authentication and account saves
**Priority:** P0 | **Tags:** firebase, auth, firestore, persistence

Repository implementation of `docs/FIREBASE_ARCHITECTURE.md` is verified: shared optional email/password Auth, isolated guest/account repositories, transactional migration, secured/tested rules, durable Blackjack/Threefold checkpoints and browser emulator checks. Live completion is tracked by TASK-003. GitHub Pages is canonical; optional Firebase Hosting is independent.

**2026-10-06 live-project verification:** the Firebase Web app `inmogames` is registered to project `inmogames-c4b7f`, all four documented public repository variables are now being consumed by production, and configured revision `05d035914d50bf8ab206745a8c07ff672c1cb99e` passed/deployed in Pages run `37478582518`. A fresh uncached post-deploy fetch now renders the optional `Sign in / create account` UI rather than `Accounts are not available on this site yet`, functionally proving the production bundle accepted the Web configuration. Real Firebase services are not yet provisioned enough to complete TASK-003: the public Identity Toolkit project-config probe returns `CONFIGURATION_NOT_FOUND`, consistent with Firebase Authentication/provider setup not yet being enabled, and a direct default Firestore REST probe returns HTTP 403 stating that the Cloud Firestore API has not been used in project `inmogames-c4b7f` before or is disabled. Therefore no registration, persistence, rules, authorized-domain, password-reset, migration, cross-browser, retry, reset or ownership-denial live claim is made yet. Royal Palace Blackjack and Threefold remain game-local verified and are not reopened.

## GAME-MERGROVE-001: Build Mergrove
**Priority:** P1 | **Tags:** game, puzzle, merge, sprites, persistence | **Status:** implementing

Add the original 5 × 5 Mergrove placement/cascade puzzle with deterministic pure-engine rules, eight repository-authored SVG spirit sprites, sunlight/compost recovery, guest active-run checkpoints and the shared optional account-save path. Authoritative scope and completion gates are `docs/specs/2026-10-06-mergrove-design.md`; live continuation state is `src/games/mergrove/TRACKER.md`.

Current implementation has local RED→GREEN evidence for engine and save-decoder behavior. Integration CI, rendered browser QA, Auth/Firestore emulator checkpoint evidence and GitHub Pages deployment are still required before the game may be marked verified. TASK-003 remains only the external blocker for real configured-project Firebase verification.
