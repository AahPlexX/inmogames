# Lucky Seven Classic execution

**Status:** Implementing — engine verified; persistence implementation awaiting GREEN  
**Architecture / Engine:** Pure three-reel center-line rules/probability audit, then settled durable persistence, then React cabinet/audio/browser integration.  
**Dependencies Used:** React 19.3.0; TypeScript 7.0.2; Vitest 5.0.3; Playwright 1.64.0; Firebase 13.0.0 shared platform.

## Core Feature Execution Pipeline

### LSC-001 — Exact reel engine
**Purpose:** Produce transparent deterministic scoring over three independent 32-stop reels and derive exact long-run math from actual configuration.  
**Inputs / Parameters:** stop source, three ordered strips, center-line symbols, supported wager 1/2/5/10/25.  
**Dependencies Touched:** game-local `reels.ts`, `paytable.ts`, `engine.ts`; focused unit test.  
**Technical Notes & Edge Cases:** Cherry precedence first; exact BAR-family results cannot be Mixed BAR; invalid wagers/stops reject; cryptographic source failure propagates before bankroll mutation.  
**Implementation Details:** RED `1085f461f474f9d5ac1976a991d4f6079a9aae75` / run `38098884217`; source `cec193e955e73834fcf5144703b35a8b411d8591`; synchronized GREEN `de1136d18390b1044eab16475fab5aee31b2c6f6` / run `38099279607`.  
**Verification & State Sign-off:** `game:check`, unit tests, builds and Pages passed on the GREEN revision.

- [x] Focused engine behavior passes without weakened assertions.
- [x] Audit derives 94.775390625% RTP and 42.047119140625% paying-result frequency from source-controlled rules.

### LSC-002 — Settled durable persistence
**Purpose:** Preserve practice progress without ever checkpointing an in-flight spin.  
**Inputs / Parameters:** settled bankroll; selected wager; lifetime spins; wagered/won/net totals; largest win; completed center-line result; sound/motion preferences.  
**Dependencies Touched:** game-local `storage.ts` and `persistence.ts`; existing shared `GameSaveDefinition` contract.  
**Technical Notes & Edge Cases:** decoder validates safe integer accounting/net consistency, supported wagers and symbol values; settlement derives payout from engine and rejects insufficient bankroll; restore-to-500 preserves history/preferences; generic save-repository behavior is not duplicated.  
**Implementation Details:** RED `eb89b259c60a3a12c9a832db94ea21602035d1eb` / run `38099468454` failed exactly on missing `storage.ts`/`persistence.ts` after dependency/current/design passed. Production now provides `DEFAULT_SAVE`, `decodeLuckySevenSave`, `luckySevenSaveDefinition`, `settleLuckySevenSpin`, and `restorePracticeCredits` against the unchanged focused test.  
**Verification & State Sign-off:** Awaiting GREEN CI; do not check completion until the same assertions pass.

- [ ] Schema-v1 decode/settlement/restore focused test passes.
- [ ] Persistence integration is ready for the later workspace through the existing shared save platform without cloned platform tests.

### LSC-003 — Mechanical cabinet UI / UX
**Purpose:** Deliver a tactile but accessible three-reel cabinet that remains distinct from Royal Fortune Slots.  
**Inputs / Parameters:** settled save, reel result, spin phase, paytable, sound/motion preferences.  
**Dependencies Touched:** `LuckySevenClassicWorkspace.tsx`, scoped CSS, procedural audio, metadata, existing SaveStatus/useGameSave seams.  
**Technical Notes & Edge Cases:** native button canonical; lever never requires drag; repeated spin phase-guarded; reduced motion replaces reel travel; text result authoritative without animation/audio.  
**Implementation Details:** Planned normal-flow layout with three visible reel windows, textual center-line marker, pre-spin paytable and >=48px primary controls.  
**Verification & State Sign-off:** Planned; browser evidence required.

- [ ] Keyboard/touch spin, paytable, wager bounds and random-source failure behavior pass browser regression.
- [ ] 320px, 200%-text, reduced-motion and audio-opt-in assertions pass.

### LSC-004 — Integration and release evidence
**Purpose:** Make Lucky Seven discoverable and prove it against the complete repository contract.  
**Inputs / Parameters:** metadata/workspace registration, one dedicated browser test script, synchronized governance docs.  
**Dependencies Touched:** catalog, workspace registry, package test script, GAME_INDEX, `.tasks`, authoritative spec/tracker/PRD/todo.  
**Technical Notes & Edge Cases:** keep implementing status until exact functional revision and Pages deployment succeed; TASK-003 stays external.  
**Implementation Details:** Add catalog/route only with the playable cabinet, then run the existing full validation/deployment chain.  
**Verification & State Sign-off:** Planned.

- [ ] Catalog/workspace route and dedicated browser suite are integrated.
- [ ] Final probability/persistence/browser evidence is recorded in TRACKER/spec.

## Final Game Assembly & Verification Checklist

- [ ] Console/runtime execution is free of uncaught game-local errors.
- [ ] Responsive viewport/reflow gates cover 320px and 200% text without page-level horizontal overflow.
- [ ] Persistence/reload/restore behavior is verified at settled checkpoints only.
- [ ] Dependency exact pins and current-version checks remain green.
- [ ] TRACKER, PRD, GAME_INDEX, authoritative spec, todo and `.tasks` are synchronized.
- [ ] Full `pnpm validate` passes on the exact functional revision.
- [ ] GitHub Pages deploy succeeds for that exact revision.
- [ ] Mark Complete / Verified only after all game-local gates above are evidenced; TASK-003 may remain externally blocked.
