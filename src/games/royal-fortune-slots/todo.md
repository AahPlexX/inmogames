# Royal Fortune Slots implementation checklist

**Status:** Verified — 2026-10-10 game-local production scope complete  
**Architecture / Engine:** Pure TypeScript five-reel/payline engine with source-controlled probability audit, React presentation and shared versioned persistence.  
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
**Verification & State Sign-off:** verified on `e89b9c64eada44a4a5953c17072d57b7d940b4d2` / run `38090041520`.

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
- [x] Reload-resume browser regression.
**Verification & State Sign-off:** verified in run `38090041520`.

### RFS-003 — Bankroll and persistence
**Purpose:** Maintain a resilient 2,500-credit practice bankroll and settled statistics without serializing transient animation.  
**Inputs / Parameters:** Schema-v1 save, paid/free SpinEvaluation, feature checkpoint.  
**Dependencies Touched:** `storage.ts`, `persistence.ts`, shared save platform.  
**Technical Notes & Edge Cases:** Restore credits is available only below the 5-credit minimum and outside an active feature; malformed/inconsistent state is rejected.  
**Implementation Details:**
- [x] Schema-v1 decoder and save definition.
- [x] Atomic paid/free settlement accounting.
- [x] Restore-practice-credit helper preserving history/preferences.
- [x] Guest/account save integration seam.
- [x] Depleted-save restore/history browser regression.
**Verification & State Sign-off:** game-local guest/emulator-backed persistence verified in run `38090041520`; live configured Firebase remains external TASK-003.

### RFS-004 — Responsive accessible machine UI
**Purpose:** Deliver a premium but legible video-slot experience across phone/tablet/desktop, keyboard/touch and reduced-motion use.  
**Inputs / Parameters:** Durable save, current ReelWindow, settled result.  
**Dependencies Touched:** `RoyalFortuneSlotsWorkspace.tsx`, `royal-fortune-slots.css`, `audio.ts`.  
**Technical Notes & Edge Cases:** No sticky action layer; 320px and 200% text reflow; rules/RTP available before play; sound is opt-in; paid partial returns are reported as net losses rather than celebratory wins.  
**Implementation Details:**
- [x] Five-reel visual machine and status hierarchy.
- [x] Native wager/Spin/preferences/reset controls.
- [x] Native rules/paytable/RTP disclosure.
- [x] Polite result live region with explicit return/net wording.
- [x] Finite normal motion and reduced-motion/Reduced effects suppression.
- [x] RNG-failure path preserves bankroll and surfaces retry status.
- [x] Browser accessibility/mobile/audio/RNG/reload/restore regression green.
**Verification & State Sign-off:** verified in run `38090041520`.

### RFS-005 — Probability audit
**Purpose:** Quantify and bind exact expected return and feature frequency to source-controlled strips/paytable/rules.  
**Inputs / Parameters:** Reel strips, paytable, fixed paylines and free-spin transition rules.  
**Dependencies Touched:** `audit.ts`, probability tests, `TRACKER.md`.  
**Technical Notes & Edge Cases:** Base return uses exact source distributions; paying-spin probability exhausts 32³ first-three-reel stops plus exact tail Scatter counts; free-feature value uses the exact finite multiplier/retrigger recurrence.  
**Implementation Details:**
- [x] Exact base-game return automated.
- [x] Exact Scatter/feature-entry probability automated.
- [x] Exact any-paying-spin probability automated.
- [x] Full free-feature expected-value recurrence automated.
- [x] Configured theoretical return bound to `0.9943076586882423` (99.4307658688%).
**Verification & State Sign-off:** verified in run `38090041520`.

## Final Game Assembly & Verification Checklist

- [x] No console/runtime errors in the dedicated browser flow.
- [x] 320 CSS-px and 200%-text reflow gates pass; primary Spin target remains >=48px.
- [x] Settled feature persistence/reload and depleted-bankroll restore behavior pass.
- [x] Dependency exact pins/current checks pass.
- [x] `TRACKER.md`, PRD, `docs/GAME_INDEX.md`, task state and authoritative spec are synchronized for closeout.
- [x] Full repository validation workflow passes on functional revision `e89b9c64eada44a4a5953c17072d57b7d940b4d2`.
- [x] Both production builds, Pages artifact upload and deployment pass in run `38090041520`.
- [x] Game-local status is Complete / Verified; TASK-003 remains a separate external live-Firebase blocker.