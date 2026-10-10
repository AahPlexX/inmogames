# Royal Fortune Slots implementation checklist

**Status:** Implementing — final exact-revision evidence pass in progress  
**Architecture / Engine:** Pure TypeScript reel/payline engine with React presentation, source-controlled strips/paytable, exact probability recurrence and shared versioned persistence.  
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
**Verification & State Sign-off:** source/focused tests passed on baseline `8c3e2fa` / run `38089533535`; final exact revision pending.

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
- [x] Reload-resume assertion added to dedicated browser suite.
**Verification & State Sign-off:** baseline feature flow green; expanded reload gate pending final exact revision.

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
- [x] Depleted-save restore/history browser assertion added.
**Verification & State Sign-off:** unit/account baseline green; expanded restore gate pending final exact revision. Live configured Firebase remains TASK-003.

### RFS-004 — Responsive accessible machine UI
**Purpose:** Deliver a premium but legible video-slot experience across phone/tablet/desktop, keyboard/touch and reduced-motion use.  
**Inputs / Parameters:** Durable save, current ReelWindow, settled result.  
**Dependencies Touched:** `RoyalFortuneSlotsWorkspace.tsx`, `royal-fortune-slots.css`, `audio.ts`.  
**Technical Notes & Edge Cases:** No sticky action layer; 320px must not horizontally overflow; 200% text must reflow; rules/paytable remain available before first spin; sound is opt-in enhancement only; paid returns below wager are presented as net losses rather than celebratory wins.  
**Implementation Details:**
- [x] Five-reel visual machine and status hierarchy.
- [x] Native wager/Spin/preferences/reset controls.
- [x] Native rules/paytable disclosures and theoretical-return context.
- [x] Polite aggregate result live region with explicit return/net wording.
- [x] Finite normal motion and reduced-motion overrides.
- [x] RNG-failure path preserves bankroll and surfaces retry status.
- [ ] Expanded browser accessibility/mobile/audio/RNG/reload/restore regression green on final exact revision.
**Verification & State Sign-off:** prior browser suite green in run `38089533535`; current expanded suite pending.

### RFS-005 — Probability audit
**Purpose:** Demonstrate that published strips/paytable are fixed, inspectable and non-adaptive and quantify exact expected return/feature frequency.  
**Inputs / Parameters:** Source-controlled reel strips, paytable and feature rules.  
**Dependencies Touched:** `audit.ts`, probability unit tests, `TRACKER.md`.  
**Technical Notes & Edge Cases:** Base return uses exact symbol/stop distributions; paying-spin probability exhausts 32³ first-three-reel stops plus exact tail Scatter counts; feature value uses exact event probabilities in a finite multiplier recurrence with closed-form ×5 retrigger queue expectation.  
**Implementation Details:**
- [x] Fixed strips/paytable committed as source.
- [x] Exact base-game return and Scatter/feature-entry audit automated.
- [x] Exact any-paying-spin probability automated.
- [x] Full free-feature expected-value recurrence automated.
- [x] Configured total theoretical return bound to `0.9943076586882423` (99.4307658688%).
- [ ] Final exact-revision probability tests green.
**Verification & State Sign-off:** implementation complete; final CI evidence pending.

## Final Game Assembly & Verification Checklist

- [ ] No console/runtime errors in the expanded dedicated browser flow on the final exact revision.
- [ ] Responsive viewport/reflow gates pass at 320 CSS px and representative larger viewports, including 200% text, on the final exact revision.
- [ ] Persistence/reload/restart restores only fully settled durable checkpoints and resumes settled free-spin features correctly on the final exact revision.
- [x] Dependency exact pins and current-version checks were green on baseline run `38089533535`.
- [x] Baseline repository-wide validation/build/Pages deployment passed at `8c3e2fa` / run `38089533535`.
- [ ] Current `TRACKER.md`, PRD, `docs/GAME_INDEX.md`, task state and authoritative spec are atomically synchronized for final verification evidence.
- [ ] `pnpm validate` equivalent workflow gates pass on the final exact revision.
- [ ] GitHub Pages artifact uploads and deploys successfully for that exact revision.
- [ ] Final status may change to Complete / Verified only after all game-local gates above are checked and exact evidence is recorded; TASK-003 may remain externally blocked.