# Lucky Seven Classic execution

**Status:** Implementing — engine TDD active  
**Architecture / Engine:** Pure three-reel center-line rules and probability audit separated from React/persistence/audio.  
**Dependencies Used:** React 19.3.0; TypeScript 7.0.2; Vitest 5.0.3; Playwright 1.64.0; Firebase 13.0.0 shared platform.

## Core Feature Execution Pipeline

### LSC-001 — Exact reel engine
**Purpose:** Produce transparent, deterministic scoring over three independent 32-stop reels and derive the exact long-run math from the actual configuration.  
**Inputs / Parameters:** stop source, three ordered strips, center-line symbols, supported wager 1/2/5/10/25.  
**Dependencies Touched:** game-local `reels.ts`, `paytable.ts`, `engine.ts`; focused unit test only.  
**Technical Notes & Edge Cases:** Cherry precedence is evaluated first; exact BAR-family results beat Mixed BAR; invalid wagers/stops reject; cryptographic random-source failure must propagate before UI deducts bankroll.  
**Implementation Details:** Red revision `1085f461f474f9d5ac1976a991d4f6079a9aae75` established missing-module failure. Engine source revision `cec193e955e73834fcf5144703b35a8b411d8591` adds explicit strips, paytable, unbiased stop selection and exhaustive 32^3 audit.  
**Verification & State Sign-off:** Awaiting green TypeScript/game-governance/unit evidence; do not mark complete from source presence alone.

- [ ] Focused engine test passes without weakening assertions.
- [ ] Audit derives 94.775390625% RTP and 42.047119140625% hit frequency from source-controlled rules.

### LSC-002 — Settled durable persistence
**Purpose:** Preserve practice progress without ever checkpointing an in-flight spin.  
**Inputs / Parameters:** settled bankroll, selected wager, lifetime spins, wagered/won/net totals, largest win, last result, sound/motion preferences.  
**Dependencies Touched:** game-local `storage.ts` and `persistence.ts`; existing shared save/session contracts.  
**Technical Notes & Edge Cases:** malformed or wrong-version states reject safely; restore-to-500 preserves stats/preferences; live Firebase remains TASK-003 only.  
**Implementation Details:** Add one focused persistence red/green cycle after LSC-001 is green.  
**Verification & State Sign-off:** Planned; no persistence implementation claim yet.

- [ ] Schema-v1 decode/checkpoint/restore tests pass.
- [ ] Reload/account-save boundaries are covered without duplicating shared platform tests.

### LSC-003 — Mechanical cabinet UI / UX
**Purpose:** Deliver a tactile but accessible three-reel cabinet that remains distinct from Royal Fortune Slots.  
**Inputs / Parameters:** settled save, reel result, spin phase, paytable, sound/motion preferences.  
**Dependencies Touched:** `LuckySevenClassicWorkspace.tsx`, scoped CSS, procedural audio, metadata, existing SaveStatus/useGameSave seams.  
**Technical Notes & Edge Cases:** native button is canonical; lever visual never requires drag; repeated spin is phase-guarded; reduced motion replaces reel travel; result text is authoritative even without animation/audio.  
**Implementation Details:** Normal-flow layout with three visible reel windows and textual center-line marker; pre-spin rules/paytable; >=48px primary controls.  
**Verification & State Sign-off:** Planned; browser evidence required before completion.

- [ ] Keyboard/touch spin, paytable, wager bounds and random-source failure behavior pass browser regression.
- [ ] 320px, 200%-text, reduced-motion and audio-opt-in assertions pass.

### LSC-004 — Integration and release evidence
**Purpose:** Make Lucky Seven discoverable and prove it against the full repository contract.  
**Inputs / Parameters:** metadata/workspace registration, browser test script, synchronized governance docs.  
**Dependencies Touched:** catalog, workspace registry, package test script, GAME_INDEX, `.tasks`, authoritative spec/tracker/PRD/todo.  
**Technical Notes & Edge Cases:** implementing status must remain non-verified until exact functional revision and Pages deployment succeed; TASK-003 stays external.  
**Implementation Details:** Add catalog/route only when the playable cabinet exists, then run the existing full validation/deployment chain.  
**Verification & State Sign-off:** Planned.

- [ ] Catalog/workspace route and dedicated browser suite are integrated.
- [ ] Exact probability evidence is recorded in TRACKER/spec.

## Final Game Assembly & Verification Checklist

- [ ] Console/runtime execution is free of uncaught game-local errors.
- [ ] Responsive viewport/reflow gates cover 320px and 200% text without page-level horizontal overflow.
- [ ] Persistence/reload/restore behavior is verified at settled checkpoints only.
- [ ] Dependency exact pins and current-version checks remain green.
- [ ] TRACKER, PRD, GAME_INDEX, authoritative spec, todo and `.tasks` are synchronized.
- [ ] Full `pnpm validate` passes on the exact functional revision.
- [ ] GitHub Pages deploy succeeds for that exact revision.
- [ ] Mark Complete / Verified only after all game-local gates above are evidenced; TASK-003 may remain externally blocked.
