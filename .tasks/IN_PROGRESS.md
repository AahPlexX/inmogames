# In progress

## PLATFORM-001: Firebase authentication and account saves
**Priority:** P0 | **Tags:** firebase, auth, firestore, persistence

Repository implementation of `docs/FIREBASE_ARCHITECTURE.md` is verified: shared optional email/password Auth, isolated guest/account repositories, transactional migration, secured/tested rules, durable Blackjack/Threefold/Mergrove/Royal Fortune checkpoints and browser emulator checks. Live completion is tracked by TASK-003. GitHub Pages is canonical; optional Firebase Hosting is independent.

**2026-10-06 live-project verification:** the Firebase Web app `inmogames` is registered to project `inmogames-c4b7f`, all four documented public repository variables are now being consumed by production, and configured revision `05d035914d50bf8ab206745a8c07ff672c1cb99e` passed/deployed in Pages run `37478582518`. A fresh uncached post-deploy fetch renders the optional `Sign in / create account` UI rather than `Accounts are not available on this site yet`, functionally proving the production bundle accepted the Web configuration. Real Firebase services are not yet provisioned enough to complete TASK-003: the public Identity Toolkit project-config probe returned `CONFIGURATION_NOT_FOUND`, consistent with Firebase Authentication/provider setup not yet being enabled, and a direct default Firestore REST probe returned HTTP 403 stating that the Cloud Firestore API had not been used in project `inmogames-c4b7f` before or was disabled. Therefore no registration, persistence, rules, authorized-domain, password-reset, migration, cross-browser, retry, reset or ownership-denial **live-project** claim is made yet. Royal Palace Blackjack, Threefold, Mergrove v1 and Royal Fortune Slots have verified game-local baselines; their account-save emulator evidence remains distinct from TASK-003 live verification.

## GAME-MERGROVE-002: Progression expansion planning
**Priority:** P1 | **Tags:** mergrove, campaign, levels, power-ups, progression, achievements | **Status:** design approved; implementation not started

Product owner approved the v2 direction on 2026-10-07. The authoritative Mergrove spec defines the written launch target: 40 Campaign levels across five groves, seven deterministic objective patterns, 1–3 star mastery, existing Compost plus Sunbeam/Gust/Rewind Leaf, deterministic rewards, 20 permanent achievements, an eight-entry Spirit Almanac, Challenge Grove, optional procedural audio, evidence-driven balance simulation and a safe v1→v2 persistence migration.

This task remains at its documented architectural gate. TASK-003 live Firebase remains separate and must not be represented as completed by emulator migration tests.

## QUALITY-001: Device- and viewport-agnostic game UX contract
**Priority:** P0 | **Tags:** responsive, device-agnostic, viewport, accessibility, design-browser, quality | **Status:** design approved; written specification awaiting review

Product owner approved a repository-wide quality direction on 2026-10-07: every current and future game must deliver equivalent gameplay quality, legibility, control access and hierarchy across narrow phones, rotated phones, tablets, compact laptops, desktops, large displays, 200% text, keyboard, pointer/touch and reduced-motion use.

The written architectural specification is `docs/superpowers/specs/2026-10-07-device-viewport-agnostic-game-quality-design.md`. It remains documentation-only until its normal implementation gate is opened; actual game defects continue through each game's own continuity workflow.

## GAME-LUCKY-SEVEN-001: Lucky Seven Classic production implementation
**Priority:** P1 | **Tags:** slots, classic, arcade, accessibility, persistence, probability, responsive | **Status:** implementing

Approved design: `docs/specs/2026-10-10-lucky-seven-classic-design.md`. Implementation plan: `docs/plans/2026-10-10-lucky-seven-classic.md`.

The exact v1 math contract is bound: three independent 32-stop reels, one center payline, wagers 1/2/5/10/25, explicit Cherry/Mixed-BAR/exact-match precedence, 94.775390625% theoretical RTP and 42.047119140625% paying-result frequency. Engine TDD RED is revision `1085f461f474f9d5ac1976a991d4f6079a9aae75` / run `38098884217`; engine/probability GREEN is synchronized revision `de1136d18390b1044eab16475fab5aee31b2c6f6` / run `38099279607`, where `game:check` and the unit-test step passed.

Current work is LSC-002 settled persistence. A focused persistence RED is being introduced before `storage.ts` and `persistence.ts`. It covers only game-local schema decoding, atomic settlement/accounting, insufficient bankroll and restore-to-500 semantics, reusing the already-tested shared save repository rather than duplicating platform tests. After persistence GREEN: build the mechanical cabinet/audio, then dedicated browser/responsive regression, catalog/route integration, full validation and exact-revision Pages evidence. TASK-003 remains solely the external live-Firebase blocker.
