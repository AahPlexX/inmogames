# In progress

## GAME-001: Threefold
**Priority:** P0 | **Tags:** first-game, puzzle, reference-implementation

Approved 2026-10-03. Its engine TDD contract is established and active. Continue implementation from current `main`; do not let its spec/tracker drift.

## GAME-002: Royal Palace Blackjack
**Priority:** P0 | **Tags:** card-board, blackjack, production-game

Approved from the user's Royal Palace Blackjack prototype on 2026-10-03. Convert the concept into the independent multi-file game defined by `docs/specs/2026-10-03-royal-palace-blackjack-design.md`. Use the prototype as visual/product direction, not as a single-file implementation. TDD applies to rules, shoe, persistence and strategy behavior. Current action-legality/soft-17 regression tests have been implemented on `main`; preserve them while Firebase work changes persistence boundaries.

## PLATFORM-001: Firebase authentication and account saves
**Priority:** P0 | **Tags:** firebase, auth, firestore, persistence

Repository implementation of `docs/FIREBASE_ARCHITECTURE.md` is verified: shared optional email/password Auth, isolated guest/account repositories, transactional migration, secured/tested rules, durable Blackjack/Threefold checkpoints and browser emulator checks. Live completion is blocked by TASK-003 (actual Firebase configuration/provisioning and deployed-site account/save verification). GitHub Pages is enabled and remains canonical; optional Hosting is independent.

## DESIGN-001: Global and per-game design refinement
**Priority:** P0 | **Tags:** design-system, responsive, accessibility, game-ui

The InMo Game Cabinet shared shell plus distinct Threefold and Royal Palace visual systems are implemented. Exact-revision CI on `aea637c1` verifies design lint, 320 CSS-px/200% rendered reflow, global skip/focus behavior, Threefold keyboard/non-color selection and touch target sizing, Royal Palace rule-help discovery/minimum chip sizing/reduced motion, both production builds and automatic Pages deployment. Continue refinement without regressing those gates. Broader assistive-technology/gameplay review and an independent live visual inspection remain open; the external browser connector was unavailable during this pass, so no unsupported live-visual claim is recorded.
