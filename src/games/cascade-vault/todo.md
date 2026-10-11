# Cascade Vault execution

**Status:** Implementing — Task 1 exact ways/cascade engine TDD RED opening  
**Architecture / Engine:** Immutable 6×5 board → adjacent ways evaluation → simultaneous removal → gravity/refill → bounded cascade/feature transitions → reproducible simulation → settled persistence → React presentation.  
**Dependencies Used:** React 19.3.0; TypeScript 7.0.2; Vitest 5.0.3; Playwright 1.64.0; Firebase 13.0.0; Vite 8.3.4.

## Core Feature Execution Pipeline

### CV-001 — Exact ways / cascade / Vault Run engine
**Purpose:** Establish deterministic, inspectable core rules before any probability tuning, persistence or presentation.  
**Inputs / Parameters:** immutable 6×5 board, base wager 10/20/50/100/250 credits, injected symbol/random source, base/free mode, optional settled Vault Run state.  
**Dependencies Touched:** planned `symbols.ts`, `paytable.ts`, `engine.ts`; `tests/unit/cascade-vault-engine.test.ts`.  
**Technical Notes & Edge Cases:** ways must start on reel 1 and span at least three consecutive reels; Wild substitutes normal symbols only; identical all-Wild interpretations are deduplicated to the highest valid award; all accepted wins are computed from one immutable snapshot before removals; refill never generates Scatter; base multiplier caps ×10; feature multiplier caps ×20; meter advances once/free spin; +3 step-3 award is one-time; retriggers cap remaining spins at 20; 51st winning cascade throws instead of silently resolving. Approved fractional paytable math is represented as integer centi-credit units (`CREDIT_SCALE = 100`) so quarter-credit feature results remain exact.  
**Implementation Details:** first integration intentionally contains the focused unit contract before the three engine modules exist. The expected RED is module-missing after governance passes.  
**Verification & State Sign-off:** RED not yet recorded; no engine capability may be marked verified until the unchanged focused contract passes.

- [ ] Focused unit contract records the expected missing-module RED.
- [ ] Exact ways/Wild/dedup/removal/gravity/refill behavior passes.
- [ ] Base and Vault Run multiplier/meter/retrigger/cap behavior passes.
- [ ] 50-cascade corruption guard passes.

### CV-002 — Reproducible probability / balance audit
**Purpose:** Fix final source-controlled symbol weights using evidence rather than intuition.  
**Inputs / Parameters:** final engine, weighted initial/refill distributions, deterministic audit seed, at least 10,000,000 paid spins.  
**Dependencies Touched:** planned `simulation.ts`, focused simulation tests, tracker evidence.  
**Technical Notes & Edge Cases:** production randomness remains cryptographic; seeded PRNG is audit/test-only; streaming statistics must avoid retaining all outcomes; report standard error/95% CI/feature frequency/average cascade depth.  
**Implementation Details:** planned only; provisional engineering weights may exist during Task 1 but cannot be called balanced or final before this gate.  
**Verification & State Sign-off:** final CI must intersect the approved 94%-97% RTP range.

- [ ] Deterministic simulation tests RED/GREEN.
- [ ] Final 10M-spin audit recorded with seed/count/RTP/SE/95% CI/feature frequency/cascade depth.
- [ ] Final source-controlled weights fixed only after acceptance.

### CV-003 — Settled durable checkpoint contract
**Purpose:** Make practice progress durable without persisting unresolved payout state.  
**Inputs / Parameters:** settled bankroll, wager, lifetime statistics, last result, preferences, fully resolved post-free-spin Vault Run checkpoint.  
**Dependencies Touched:** planned `storage.ts`, `persistence.ts`, shared `GameSaveDefinition`, focused persistence tests.  
**Technical Notes & Edge Cases:** no board/cascade animation or partially resolved paid/free spin is durable; malformed states reject/sanitize; restore 5,000 preserves statistics/preferences. Internal credit accounting must preserve exact centi-credit values.  
**Implementation Details:** planned after probability constants stabilize enough for schema decisions.  
**Verification & State Sign-off:** open.

- [ ] Persistence RED/GREEN recorded.
- [ ] Reload cannot duplicate or lose a completed award.
- [ ] Restore-to-5,000 preserves prior history/preferences.

### CV-004 — Accessible cascading board / Vault Run presentation / audio
**Purpose:** Deliver the modern vault/energy-chamber interface without allowing animation to affect scoring.  
**Inputs / Parameters:** pre-resolved engine event sequence, settled save state, motion/audio preferences.  
**Dependencies Touched:** planned `CascadeVaultWorkspace.tsx` production implementation, `cascade-vault.css`, `audio.ts`, consolidated `tests/browser/cascade-vault.mjs`. The current Workspace file is a governance-only placeholder and remains intentionally unregistered.  
**Technical Notes & Edge Cases:** aggregate live announcements instead of per-cell noise; 48×48 important targets; 320px/200%-text reflow; no sticky overlay; reduced motion replaces travel with immediate/minimal transitions; audio is opt-in/user-gesture initialized.  
**Implementation Details:** browser RED must be opened before registering the playable route so missing route/workspace remains the intended initial browser failure.  
**Verification & State Sign-off:** planned.

- [ ] Consolidated browser route/cabinet RED recorded.
- [ ] Paid spin, deterministic multi-cascade, Vault Run entry/progression/exit and settled reload pass.
- [ ] 320px/200%-text, keyboard/touch, reduced motion, target size, audio and overflow checks pass.

### CV-005 — Catalog / governance / exact-revision release
**Purpose:** Finish discoverability, documentation and production deployment only after core gameplay evidence is green.  
**Inputs / Parameters:** metadata, lazy workspace route, exact final simulation constants/evidence, synchronized docs/tasks, canonical CI.  
**Dependencies Touched:** `src/catalog.ts`, `src/games/workspaces.tsx`, GAME_INDEX/spec/plan/tracker/PRD/todo/`.tasks`, package browser script if required.  
**Technical Notes & Edge Cases:** verified state requires terminal tracker rows, no open game-local work, exact revision/run evidence, both production builds and Pages success; TASK-003 remains external only.  
**Implementation Details:** implementing governance shell begins with Task 1; playable catalog registration intentionally waits for browser TDD.  
**Verification & State Sign-off:** open.

- [ ] Catalog and lazy route integrated after browser RED.
- [ ] Full exact-revision canonical validation passes.
- [ ] GitHub Pages deployment succeeds for the same functional revision.
- [ ] Final evidence-only closeout commit passes verified-state governance and deployment.

## Final Game Assembly & Verification Checklist

- [ ] Console/runtime quality gate passes without uncaught game-local errors.
- [ ] Responsive viewport/reflow contract passes at 320px and 200% text with no horizontal overflow.
- [ ] Persistence/reload/restart/restore and settled Vault Run checkpoint behavior are verified.
- [ ] Exact dependency pins/current-version checks remain green.
- [ ] TRACKER, PRD, GAME_INDEX, authoritative spec, plan, todo and `.tasks` are synchronized.
- [ ] Final 10,000,000-spin audit meets the documented RTP confidence acceptance gate.
- [ ] Full canonical validation passes on the exact final functional revision.
- [ ] GitHub Pages deployment succeeds for that exact revision.
- [ ] Mark Complete / Verified only after all game-local gates are evidenced; TASK-003 may remain externally blocked.
