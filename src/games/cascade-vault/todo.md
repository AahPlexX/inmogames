# Cascade Vault execution

**Status:** Implementing — CV-001 engine hardened; canonical GREEN pending  
**Architecture / Engine:** Immutable 6×5 board → adjacent ways → simultaneous removal → gravity/refill → bounded base/Vault transitions → production-engine simulation → settled persistence → accessible React presentation.  
**Dependencies Used:** React 19.3.0; TypeScript 7.0.2; Vitest 5.0.3; Playwright 1.64.0; Firebase 13.0.0; Vite 8.3.4.

## Core Feature Execution Pipeline

### CV-001 — Exact ways / cascade / Vault Run engine
**Purpose:** Lock deterministic inspectable game rules before balance, persistence or UI work.  
**Inputs / Parameters:** immutable 6×5 board; wagers 10/20/50/100/250; injected random source; base/Vault mode; optional active Vault Run state.  
**Dependencies Touched:** `symbols.ts`, `paytable.ts`, `engine.ts`, `tests/unit/cascade-vault-engine.test.ts`.  
**Technical Notes & Edge Cases:** reel-1 consecutive ways >=3; Wild normal-symbol substitution only; concrete all-Wild way paid once at highest interpretation; immutable simultaneous evaluation; refill rejects Scatter; base ×1..×10; Vault ×2..×20; meter once/free spin; step-3 +3 once; +4 retrigger; 20-spin cap; exact centi-credit units; 51st winning cascade throws; after all free-spin awards, zero remaining spins terminates the feature and `nextVaultState` is null.  
**Implementation Details:** RED `a52d99774c9384ad6a0b4c0ccfbf1c5e7cb51e9a` / run `38122640264`; implementation `f71588d2ca0c96e685f54631c0afb6ded56ade84`; fixture correction `ae5a7e3630964d13efb23bb06c57dc582dbb2455`. Independent strict TypeScript + reconstructed behavior harness pass after the fixture-only correction. The terminal-feature regression is integrated next; provisional weights remain non-final until CV-002.  
**Verification & State Sign-off:** canonical GREEN still required before CV-001 is terminal.

- [x] Focused unit contract records the intended missing-module RED.
- [x] Fixture collision corrected without weakening the 400-unit deterministic assertion.
- [ ] Exact ways/Wild/dedup/removal/gravity/refill behavior passes canonical focused/full tests.
- [ ] Base/Vault multiplier/meter/retrigger/cap and terminal-null behavior pass canonical focused/full tests.
- [ ] 50-cascade guard passes canonical focused/full tests.

### CV-002 — Reproducible probability / balance audit
**Purpose:** Fix final source-controlled weights from evidence, not intuition.  
**Inputs / Parameters:** GREEN production engine, provisional initial/refill distributions, deterministic audit seed, >=10,000,000 paid spins.  
**Dependencies Touched:** planned `simulation.ts`, `tests/unit/cascade-vault-simulation.test.ts`, audit command/evidence.  
**Technical Notes & Edge Cases:** seeded PRNG is audit/test-only; simulation must call production `resolveSpin`; include all feature value per paid spin; stream Welford-style statistics rather than retaining outcomes; define average cascade-depth denominator.  
**Implementation Details:** no second gameplay model. Rebalance weights/paytable only with full audit reruns and unchanged rule tests.  
**Verification & State Sign-off:** final 95% RTP interval must intersect 94%-97%.

- [ ] Simulation module RED recorded.
- [ ] Deterministic reproducibility and confidence-stat tests GREEN.
- [ ] Final >=10M-spin seed/count/RTP/SE/95% CI/feature frequency/cascade depth recorded.
- [ ] Final weights fixed only after acceptance.

### CV-003 — Settled durable checkpoint contract
**Purpose:** Persist practice progress without durable unresolved payout state.  
**Inputs / Parameters:** centi-credit bankroll/totals; wager; paid/free counters; stats; preferences; last settled result; fully resolved Vault checkpoint or null.  
**Dependencies Touched:** planned `storage.ts`, `persistence.ts`, shared `GameSaveDefinition`, `tests/unit/cascade-vault-persistence.test.ts`.  
**Technical Notes & Edge Cases:** no board/animation/partial cascade; active feature requires >=1 remaining spin; completed feature is null; malformed/non-finite/negative values reject; restore 5000 only below minimum and outside active feature while preserving stats/preferences.  
**Implementation Details:** schema v1; slug `cascade-vault`; storage key `inmogames:cascade-vault:v1`.  
**Verification & State Sign-off:** open.

- [ ] Persistence RED/GREEN recorded.
- [ ] Reload cannot duplicate or lose a completed award.
- [ ] Final free-spin completion checkpoints feature null.
- [ ] Restore-to-5,000 preserves prior history/preferences.

### CV-004 — Accessible cascading board / Vault Run presentation / audio
**Purpose:** Present pre-resolved outcomes clearly without animation affecting score.  
**Inputs / Parameters:** resolved engine event sequence; settled save; motion/audio preferences.  
**Dependencies Touched:** production `CascadeVaultWorkspace.tsx`, `cascade-vault.css`, `audio.ts`, `tests/browser/cascade-vault.mjs`.  
**Technical Notes & Edge Cases:** aggregate live announcements; >=48×48 important targets; 320px/200%-text reflow; no sticky overlap; reduced motion avoids travel; opt-in user-gesture audio; rules/paytable before play.  
**Implementation Details:** playable catalog/lazy route remains absent until browser RED.  
**Verification & State Sign-off:** planned.

- [ ] Consolidated route/gameplay browser RED recorded.
- [ ] Paid spin, deterministic multi-cascade, Vault entry/progression/exit and settled reload pass.
- [ ] 320px/200%-text, keyboard/touch, target size, reduced motion, audio and overflow checks pass.

### CV-005 — Catalog / governance / exact-revision release
**Purpose:** Finish discoverability and release only after gameplay evidence is green.  
**Inputs / Parameters:** final metadata/workspace, final audit constants/evidence, synchronized documentation/tasks, canonical workflow.  
**Dependencies Touched:** `src/catalog.ts`, `src/games/workspaces.tsx`, `package.json` if suite registration changes, spec/plan/tracker/PRD/todo/GAME_INDEX/`.tasks`.  
**Technical Notes & Edge Cases:** verified state requires terminal capability rows, exact revision/run, no open game-local work, both production builds and Pages success; TASK-003 stays external.  
**Implementation Details:** governance shell is present; route waits for browser TDD.  
**Verification & State Sign-off:** open.

- [ ] Catalog/workspace integration after browser RED.
- [ ] Full exact-revision canonical validation passes.
- [ ] GitHub Pages deployment succeeds for same functional revision.
- [ ] Evidence-only closeout commit passes verified-state governance/deployment.

## Final Game Assembly & Verification Checklist

- [ ] Console/runtime quality gate has no uncaught game-local errors.
- [ ] Responsive viewport/reflow passes 320px and 200% text without horizontal overflow.
- [ ] Persistence/reload/restart/restore/final-feature checkpoint behavior is verified.
- [ ] Exact dependency pin/current-version gates pass.
- [ ] TRACKER, PRD, GAME_INDEX, authoritative spec, plan, todo and `.tasks` are synchronized.
- [ ] Final >=10,000,000-spin audit meets the RTP confidence gate.
- [ ] Full canonical validation passes on the exact final functional revision.
- [ ] GitHub Pages deployment succeeds for that exact revision.
- [ ] Mark Complete / Verified only after every game-local gate is evidenced; TASK-003 may remain externally blocked.
