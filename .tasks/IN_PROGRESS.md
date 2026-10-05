# In progress

## GAME-001: Threefold
**Priority:** P0 | **Tags:** first-game, puzzle, reference-implementation

Approved 2026-10-03. Its engine TDD contract is established and active. Continue implementation from current `main`; do not let its spec/tracker drift.

## PLATFORM-001: Firebase authentication and account saves
**Priority:** P0 | **Tags:** firebase, auth, firestore, persistence

Repository implementation of `docs/FIREBASE_ARCHITECTURE.md` is verified: shared optional email/password Auth, isolated guest/account repositories, transactional migration, secured/tested rules, durable Blackjack/Threefold checkpoints and browser emulator checks. Live completion is blocked by TASK-003 (actual Firebase configuration/provisioning and deployed-site account/save verification). GitHub Pages is enabled and remains canonical; optional Hosting is independent.

## DESIGN-001: Global and per-game design refinement
**Priority:** P0 | **Tags:** design-system, responsive, accessibility, game-ui

The InMo Game Cabinet shared shell plus distinct Threefold and Royal Palace visual systems are implemented. Royal Palace has completed its game-local design/playability verification: deterministic browser accessibility/gameplay/WebAudio/mobile-layout suites are green, and deployed desktop/mobile inspection found no remaining game-local overflow, clipping, broken assets or visible overlap after the lone-action mobile correction. Continue DESIGN-001 for shared-shell and Threefold refinement without regressing those gates. Real Firebase project verification remains a separate PLATFORM-001/TASK-003 blocker.
