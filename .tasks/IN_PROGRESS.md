# In progress

## PLATFORM-001: Firebase authentication and account saves
**Priority:** P0 | **Tags:** firebase, auth, firestore, persistence

Repository implementation of `docs/FIREBASE_ARCHITECTURE.md` is verified: shared optional email/password Auth, isolated guest/account repositories, transactional migration, secured/tested rules, durable Blackjack/Threefold/Mergrove checkpoints and browser emulator checks. Live completion is tracked by TASK-003. GitHub Pages is canonical; optional Firebase Hosting is independent.

**2026-10-06 live-project verification:** the Firebase Web app `inmogames` is registered to project `inmogames-c4b7f`, all four documented public repository variables are now being consumed by production, and configured revision `05d035914d50bf8ab206745a8c07ff672c1cb99e` passed/deployed in Pages run `37478582518`. A fresh uncached post-deploy fetch renders the optional `Sign in / create account` UI rather than `Accounts are not available on this site yet`, functionally proving the production bundle accepted the Web configuration. Real Firebase services are not yet provisioned enough to complete TASK-003: the public Identity Toolkit project-config probe returned `CONFIGURATION_NOT_FOUND`, consistent with Firebase Authentication/provider setup not yet being enabled, and a direct default Firestore REST probe returned HTTP 403 stating that the Cloud Firestore API had not been used in project `inmogames-c4b7f` before or was disabled. Therefore no registration, persistence, rules, authorized-domain, password-reset, migration, cross-browser, retry, reset or ownership-denial **live-project** claim is made yet. Royal Palace Blackjack, Threefold and Mergrove are game-local verified; their account-save emulator evidence remains distinct from TASK-003 live verification.

## GAME-003 (reopened): Mergrove v1.1
**Priority:** P2 | **Tags:** mergrove, balance, accessibility | **Status:** awaiting CI

Reopened 2026-10-07 under the per-game continuity contract. Adds the MER-023 dev-only balance harness with a drift gate, edge-case unit coverage for the engine and v1 decoder, a pure next-draw preview, and Escape-to-cancel Compost. No save-schema change. Passing locally: typecheck, unit suite, `game:check`, Mergrove design-browser suite. Remaining: full CI chain and a Pages deploy check, then re-verify per `src/games/mergrove/TRACKER.md`. Schema-v2 features stay blocked on roadmap MER-020.
