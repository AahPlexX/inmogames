# In progress

## PLATFORM-001: Firebase authentication and account saves
**Priority:** P0 | **Tags:** firebase, auth, firestore, persistence

Repository implementation of `docs/FIREBASE_ARCHITECTURE.md` is verified: shared optional email/password Auth, isolated guest/account repositories, transactional migration, secured/tested rules, durable Blackjack/Threefold/Mergrove/Royal Fortune checkpoints and browser emulator checks. Live completion is tracked by TASK-003. GitHub Pages is canonical; optional Firebase Hosting is independent.

**2026-10-06 live-project verification:** the Firebase Web app `inmogames` is registered to project `inmogames-c4b7f`, all four documented public repository variables are consumed by production, and configured revision `05d035914d50bf8ab206745a8c07ff672c1cb99e` passed/deployed in Pages run `37478582518`. Real Firebase services are still not provisioned enough to complete TASK-003; therefore no live-project registration, persistence, rules, reset, migration or ownership-denial claim is made. Royal Palace Blackjack, Threefold, Mergrove v1 and Royal Fortune Slots have verified game-local baselines; emulator evidence remains distinct from TASK-003 live verification.

## GAME-MERGROVE-002: Progression expansion planning
**Priority:** P1 | **Tags:** mergrove, campaign, levels, power-ups, progression, achievements | **Status:** design approved; implementation not started

The approved v2 written scope remains in the authoritative Mergrove documentation and is intentionally held at its implementation gate. TASK-003 remains separate.

## QUALITY-001: Device- and viewport-agnostic game UX contract
**Priority:** P0 | **Tags:** responsive, device-agnostic, viewport, accessibility, design-browser, quality | **Status:** design approved; written specification awaiting review

The repository-wide responsive/accessibility direction remains documentation-only until its normal implementation gate opens. Game-specific defects continue through each game's own spec/tracker/PRD/todo workflow.

## GAME-LUCKY-SEVEN-001: Lucky Seven Classic production implementation
**Priority:** P1 | **Tags:** slots, classic, arcade, accessibility, persistence, probability, responsive | **Status:** implementing

Approved design: `docs/specs/2026-10-10-lucky-seven-classic-design.md`. Implementation plan: `docs/plans/2026-10-10-lucky-seven-classic.md`.

LSC-001 engine/probability is GREEN: RED revision `1085f461f474f9d5ac1976a991d4f6079a9aae75` / run `38098884217`; synchronized GREEN revision `de1136d18390b1044eab16475fab5aee31b2c6f6` / run `38099279607`. The exact configured math remains 94.775390625% theoretical RTP and 42.047119140625% paying-result frequency.

LSC-002 persistence RED is revision `eb89b259c60a3a12c9a832db94ea21602035d1eb` / run `38099468454`: dependency/current/design gates passed, then TypeScript failed solely because `storage.ts` and `persistence.ts` were intentionally absent. Those two production modules are now implemented against the unchanged focused test: defensive schema-v1 decoding, shared save definition, engine-derived atomic settlement with insufficient-bankroll rejection, and restore-to-500 that preserves durable history/preferences. GREEN evidence is pending; do not mark persistence verified until CI passes.

After persistence GREEN: build the mechanical cabinet/audio, then one lean dedicated browser suite covering gameplay/accessibility/responsive/audio/reload, integrate catalog/route, run full validation and collect exact-revision Pages evidence. TASK-003 remains solely the external live-Firebase blocker.
