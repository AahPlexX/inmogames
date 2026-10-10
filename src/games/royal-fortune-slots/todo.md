# Royal Fortune Slots implementation checklist

**Status:** Implementing — source integration and validation in progress  
**Architecture / Engine:** Pure TypeScript reel/payline engine with React presentation, source-controlled strips/paytable and shared versioned persistence.  
**Dependencies Used:**
- [x] React 19.3.0 / React DOM 19.3.0
- [x] TypeScript 7.0.2 / Vite 8.3.4
- [x] Vitest 5.0.3 / Playwright 1.64.0
- [x] Firebase 13.0.0 shared optional account-save platform

## Core Feature Execution Pipeline

### RFS-001 — Reel and payline engine
**Purpose:** Produce deterministic, testable 5×3 outcomes from five explicit reel strips and evaluate twenty fixed paylines.  
**Inputs / Parameters:** RandomSource integer stops; ReelWindow; total wager 5/10/20/40/100.  
**Dependencies Touched:** `reels.ts`, `paytable.ts`, `engine.ts`, focused unit tests.  
**Technical Notes & Edge Cases:** Wild cannot substitute Scatter; all-Wild line resolves to the highest valid configured normal-symbol award; invalid wagers/window dimensions reject without mutating durable state.  
**Implementation Details:**
- [x] Explicit 32-stop reel strips and 20 paylines.
- [x] Browser `crypto.getRandomValues()` adapter with modulo-bias rejection.
- [x] Injected deterministic random seam.
- [x] Left-to-right line evaluation and additive line awards.
- [x] Scatter-independent payout/feature trigger.
**Verification & State Sign-off:** focused unit coverage exists; exact CI revision evidence still pending.

### RFS-002 — Free spins and multiplier
**Purpose:** Implement the disclosed 8/12/20 free-spin feature and player-paced retriggers.  
**Inputs / Parameters:** Settled SpinEvaluation plus current feature checkpoint.  
**Dependencies Touched:** `engine.ts`, `storage.ts`, `persistence.ts`, workspace.  
**Technical Notes & Edge Cases:** Free spins never charge bankroll; retrigger adds five; multiplier applies only to line wins and caps at ×5; feature state checkpoints only after complete spins.  
**Implementation Details:**
- [x] Base trigger and retrigger rules.
- [x] Feature multiplier progression/cap.
- [x] Player-paced free-spin action instead of autoplay.
- [x] Settled feature checkpoint persistence.
**Verification & State Sign-off:** unit coverage added; browser feature-flow validation pending.

### RFS-003 — Bankroll and persistence
**Purpose:** Maintain a resilient 2,500-credit practice bankroll and settled statistics without serializing transient animation.  
**Inputs / Parameters:** Schema-v1 save, paid/free SpinEvaluation, feature checkpoint.  
**Dependencies Touched:** `storage.ts`, `persistence.ts`, shared save platform.  
**Technical Notes & Edge Cases:** Restore credits is available only below the 5-credit minimum and outside an active feature; malformed/inconsistent net totals decode to defaults through the shared repository boundary.  
**Implementation Details:**
- [x] Schema-v1 decoder and save definition.
- [x] Atomic paid/free settlement accounting.
- [x] Restore-practice-credit helper preserving history/preferences.
- [x] Local/account save integration seam.
**Verification & State Sign-off:** unit coverage added; account emulator and live TASK-003 status remain to be recorded.

### RFS-004 — Responsive accessible machine UI
**Purpose:** Deliver a premium but legible video-slot experience across phone/tablet/desktop, keyboard/touch and reduced-motion use.  
**Inputs / Parameters:** Durable save, current ReelWindow, settled result.  
**Dependencies Touched:** `RoyalFortuneSlotsWorkspace.tsx`, `royal-fortune-slots.css`, `audio.ts`.  
**Technical Notes & Edge Cases:** No sticky action layer; 320px must not horizontally overflow; 200% text must reflow; rules/paytable remain available before first spin; sound is opt-in enhancement only.  
**Implementation Details:**
- [x] Five-reel visual machine and status hierarchy.
- [x] Native wager/Spin/preferences/reset controls.
- [x] Native rules/paytable disclosures.
- [x] Polite aggregate result live region.
- [x] Finite normal motion and reduced-motion overrides.
- [ ] Dedicated browser accessibility/mobile/audio regression green.
**Verification & State Sign-off:** source implemented; browser evidence pending.

### RFS-005 — Probability audit
**Purpose:** Demonstrate that the published strips/paytable are fixed, inspectable and non-adaptive and quantify expected return/feature frequency.  
**Inputs / Parameters:** Source-controlled reel strips, paytable and feature rules.  
**Dependencies Touched:** engine/paytable audit tests or tooling plus `TRACKER.md`.  
**Technical Notes & Edge Cases:** Simulation may supplement but not replace exact analytical checks where practical; no RTP claim is recorded until evidence exists.  
**Implementation Details:**
- [x] Fixed strips/paytable committed as source.
- [ ] Exact base-game return and Scatter/feature-entry audit automated.
- [ ] Feature contribution/theoretical total return evidence recorded.
**Verification & State Sign-off:** remains open and prevents Verified status.

## Final Game Assembly & Verification Checklist

- [ ] No console/runtime errors in the dedicated browser flow.
- [ ] Responsive viewport/reflow gates pass at 320 CSS px and representative larger viewports, including 200% text.
- [ ] Persistence/reload/restart restores only fully settled durable checkpoints and resumes settled free-spin features correctly.
- [ ] Dependency exact pins and current-version checks remain green.
- [ ] `TRACKER.md`, `PRD.md`, `docs/GAME_INDEX.md`, task state and authoritative spec are synchronized atomically for evidence changes.
- [ ] `pnpm validate` passes on an exact revision.
- [ ] GitHub Pages build artifact uploads and deploys successfully for that exact revision.
- [ ] Final status may be changed to Complete / Verified only after all game-local gates above are checked and exact evidence is recorded; TASK-003 may remain externally blocked.