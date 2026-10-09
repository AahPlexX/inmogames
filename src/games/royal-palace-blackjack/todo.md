# Royal Palace Blackjack Execution Todo

**Status:** Verified — 2026-10-09 table experience/viewport/motion polish complete.  
**Architecture / engine:** React/Vite casino-table UI over deterministic TypeScript blackjack rules, save contracts, and procedural local audio.  
**Dependencies:**
- [x] Uses repository exact-pinned dependency set; no game-local package dependency.
- [x] Runtime network is restricted to the shared optional Firebase account/save platform.
- [x] No third-party visual/audio/font/gameplay asset dependency.

## Core Feature Execution Pipeline

### RPB-001 — Blackjack Rules Engine
**Purpose:** Enforce the table's complete deterministic dealing, scoring, dealer, shoe, and settlement rules.  
**Inputs:** shoe state, wagers, hands, dealer upcard/hole card, legal actions.  
**Dependencies Touched:** TypeScript engine and unit/browser regressions.  
**Technical Notes & Edge Cases:** preserve S17, 3:2 naturals, split settlement, cut-card lifecycle, and immediate-action card consumption.  
**Implementation Details:** six-deck rules engine with deterministic legality and settlement coverage.  
**Verification & State Sign-off:**
- [x] Shoe, scoring, natural-blackjack, S17, payout, and settlement semantics verified.
- [x] Immediate Hit/Double/split-Ace shoe-consumption regression verified.

### RPB-002 — Complete Player Action Set
**Purpose:** Provide the intended legal player decision surface.  
**Inputs:** active hand/table phase and wager state.  
**Dependencies Touched:** engine, workspace controls, deterministic browser tests.  
**Technical Notes & Edge Cases:** one split; DAS; split-Ace restrictions; surrender only after dealer check; insurance is half wager with 2:1 profit.  
**Implementation Details:** Hit, Stand, Double, Split, Surrender, and Insurance with phase legality.  
**Verification & State Sign-off:**
- [x] Hit/Stand/Double verified.
- [x] Split/DAS/split-Ace restrictions verified.
- [x] Surrender and Insurance verified.

### RPB-003 — Practice Bankroll and Betting
**Purpose:** Support complete non-real-money practice wagering and useful session feedback.  
**Inputs:** virtual balance, chip selection, wager controls, settlement result.  
**Dependencies Touched:** engine/checkpoint state, workspace, browser tests.  
**Technical Notes & Edge Cases:** below-minimum restore must preserve intended statistics; no real-money purchase/wager path; active-round wager display must reflect committed hand exposure after Deal/split/double.  
**Implementation Details:** chips, re-bet, 2×, all-in, undo, clear, restore, W/L/P/session net, plus persistent visible active-round wager.  
**Verification & State Sign-off:**
- [x] Betting controls verified.
- [x] Restore/reload/stat preservation verified.
- [x] Settlement statistics verified.
- [x] Active wager remains accurate before and after Deal and during round transitions; run `37994433846` passed the dedicated gameplay/mobile regressions.

### RPB-004 — Durable Save and Reset
**Purpose:** Preserve valid table state while keeping save failures from corrupting gameplay.  
**Inputs:** versioned guest/account state, migration, reset.  
**Dependencies Touched:** shared save contracts/repositories, unit tests, browser emulator tests.  
**Technical Notes & Edge Cases:** cloud state wins when it already exists; guest may seed only the first account save; TASK-003 blocks only live configured Firebase verification.  
**Implementation Details:** defensive v1 guest persistence plus shared account migration/reset.  
**Verification & State Sign-off:**
- [x] Guest save decoder/persistence verified.
- [x] Guest-to-account seeding and scoped reset verified in repository/emulator coverage.
- [ ] Real deployed Firebase project verification — externally blocked by TASK-003 and not a game-local completion gate.

### RPB-005 — Strategy, Audio, Help and Guidance
**Purpose:** Improve learnability and table feedback without external media or forced audio.  
**Inputs:** table state, user hint/audio preference, current phase.  
**Dependencies Touched:** strategy module, procedural WebAudio, workspace/help UI, tests.  
**Technical Notes & Edge Cases:** audio is opt-in/no-autoplay; hints must match exact table rules; help remains native details/summary and secondary to current round actions.  
**Implementation Details:** exact-table hints, local procedural cues, collapsed rule help, phase guidance; action controls precede secondary help in normal flow.  
**Verification & State Sign-off:**
- [x] Strategy hints verified.
- [x] Audio opt-in/resume/no-autoplay/persistence/cue suppression verified.
- [x] Revised action/help hierarchy passes keyboard, discovery and rendered regressions in run `37994433846`.

### RPB-006 — Accessible Responsive Casino Surface
**Purpose:** Keep the table fully usable and high-quality across device sizes and input modes.  
**Inputs:** pointer, touch, keyboard, viewport/text scaling, dialogs, reduced-motion preference.  
**Dependencies Touched:** React workspace, CSS, browser/design-browser coverage.  
**Technical Notes & Edge Cases:** dialog focus entry/confinement/restoration and lone-action mobile layout remain permanent regressions. The completed scope includes game-local route-chrome compaction, stable small-viewport sizing, initial primary-action reachability, tactile controls, staggered card/reveal motion, active-turn/outcome emphasis and safe-area-aware console spacing without sticky/fixed control obstruction.  
**Implementation Details:** native controls, accessible cards/status/dialogs, responsive table/action layout, reduced motion, scoped `:has()` route compaction with progressive fallback, `svh`-aware felt sizing, one-shot motion only.  
**Verification & State Sign-off:**
- [x] Keyboard/touch/focus semantics verified.
- [x] 320px and 200% text reflow plus compact mobile action layout pass the shared rendered suite.
- [x] Primary Deal action is reachable in the initial 320×900 viewport without scrolling; dedicated mobile-layout suite passed in run `37994433846`.
- [x] Normal-motion card feedback is present while `prefers-reduced-motion: reduce` removes cosmetic motion.
- [x] Dialog, card semantics, live status, target sizing and focus behavior remain green.

### RPB-007 — Catalog and Production Integration
**Purpose:** Keep the game discoverable, lazy-loaded, documented, tested, and deployable.  
**Inputs:** metadata, registry, catalog, docs, CI/deployment.  
**Dependencies Touched:** catalog, workspace registry, GAME_INDEX, spec/tracker/task docs, repository checks.  
**Technical Notes & Edge Cases:** verified state may only be restored after fresh evidence when implementation changes.  
**Implementation Details:** production integration with full repository validation and Pages evidence.  
**Verification & State Sign-off:**
- [x] Catalog/lazy workspace integration verified.
- [x] Exact revision `4814d85f375ccd90514252b07692c3c570ca410d` passed the complete validation chain and GitHub Pages deployment in run `37994433846`.
- [x] Documentation/task state synchronized back to verified after those gates passed.

## Final Game Assembly & Verification Checklist

- [x] Zero known uncaught game-local console failures on the verified polish revision.
- [x] Responsive behavior freshly verified across repository browser matrices, including 320 CSS px and 200% text.
- [x] Versioned persistence/reload/reset behavior remains deterministic for the defined save contract.
- [x] Exact dependency policy is repository-enforced; run `37994433846` reverified the current exact stable set.
- [x] TRACKER, authoritative spec, GAME_INDEX, PRD/todo and task state agree on the post-polish verified state.
- [x] Full repository validation and Pages deployment evidence are recorded in TRACKER.md.
- [x] Overall game-local state is Complete/Verified; TASK-003 remains a separate live-Firebase platform blocker.

**Continuation rule:** a new table rule, feature, material UI/persistence change, or discovered defect immediately reopens the applicable item above and the matching PRD/spec/TRACKER state before implementation is considered complete.
