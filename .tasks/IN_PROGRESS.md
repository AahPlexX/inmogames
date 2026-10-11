# In progress

## PLATFORM-001: Firebase authentication and account saves
**Priority:** P0 | **Tags:** firebase, auth, firestore, persistence

Shared optional email/password Auth, isolated guest/account repositories, transactional migration, secured/tested rules and durable game checkpoints are repository-verified. Live configured-project completion remains TASK-003. GitHub Pages is canonical; emulator/account-save evidence must not be represented as live-project completion.

## GAME-MERGROVE-002: Progression expansion planning
**Priority:** P1 | **Tags:** mergrove, campaign, levels, power-ups, progression, achievements | **Status:** design approved; implementation separately gated

The approved v2 Mergrove scope remains documented and outside this Lucky Seven workstream.

## QUALITY-001: Device- and viewport-agnostic game UX contract
**Priority:** P0 | **Tags:** responsive, device-agnostic, viewport, accessibility, design-browser, quality | **Status:** design approved; separately gated

Repository-wide quality direction remains governed by its own specification. Lucky Seven still must meet the same concrete 320px/200%-text/keyboard/touch/reduced-motion quality bar through its game-local workflow.

## GAME-LUCKY-SEVEN-001: Lucky Seven Classic production implementation
**Priority:** P1 | **Tags:** slots, classic, arcade, accessibility, persistence, probability, responsive | **Status:** implementing

Authoritative design: `docs/specs/2026-10-10-lucky-seven-classic-design.md`. Plan: `docs/plans/2026-10-10-lucky-seven-classic.md`.

Completed evidence:
- Engine/probability RED `1085f461f474f9d5ac1976a991d4f6079a9aae75` / run `38098884217`; GREEN `de1136d18390b1044eab16475fab5aee31b2c6f6` / run `38099279607`.
- Settled persistence RED `eb89b259c60a3a12c9a832db94ea21602035d1eb` / run `38099468454`.
- Persistence GREEN functional revision `a72d095e3569b056b211803335e6b6d401e048bb` / run `38099724416`; typecheck, game-check, unit/rules/account/browser/design-browser and both builds passed before the UI RED phase opened.

Current phase: one consolidated browser suite `tests/browser/lucky-seven-classic.mjs` is being added to `test:design-browser` while the Lucky Seven route and playable `.lsc` cabinet are intentionally still absent. The expected RED is therefore the missing playable route/cabinet. That suite fixes the externally visible contract for 3×3 cabinet rendering, textual center payline, pre-spin rules, >=48px primary action, 320px/200%-text no-overflow, RNG-failure safety, deterministic keyboard Gold-7 settlement, reload persistence, reduced motion, opt-in audio and restore-to-500 behavior.

After the RED is recorded, implement `LuckySevenClassicWorkspace.tsx`, scoped cabinet CSS, procedural `audio.ts`, and catalog/workspace registration in one synchronized production integration. Do not add separate redundant game browser suites. Then obtain browser GREEN, run full exact-revision validation/Pages deployment, close all game-local docs/tasks as verified, and proceed to Cascade Vault. TASK-003 remains solely the external live-Firebase blocker.
