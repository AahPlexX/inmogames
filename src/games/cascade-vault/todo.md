# Cascade Vault execution

**Status:** Implementing — CV-001 source hardened; canonical GREEN dependency/governance-gated  
**Architecture / Engine:** Immutable 6×5 board → adjacent ways → simultaneous removal → gravity/refill → bounded base/Vault transitions → production-engine simulation → settled persistence → accessible React presentation.  
**Dependencies Used:** Current committed source still declares React 19.3.0; React DOM 19.3.0; TypeScript 7.0.2; Vitest 5.0.3; Playwright 1.64.0; Firebase 13.0.0; Vite 8.3.4. Dependency refresh request revision 8 targets React/React DOM 19.3.1, Firebase CLI 15.34.0, Playwright 1.64.1 and Vitest 5.0.5; maintenance must validate before the generated package/lockfile commit is accepted.

## Immediate repository gate

Pages run `39280095530` stopped at dependency freshness before game checks. Maintenance run `39294812001` verified the revision-8 dependency targets, then exposed two Cascade document-schema regressions after TypeScript GREEN. Commit `af5a10b6ba4551a7b940382a5d36b67a2b9aaf75` restored those exact PRD/todo structures. Maintenance run `39295604436` then proved `game-check: 7 game(s) OK`; history-aware `game-doc-sync` correctly required the changed tracker and authoritative spec to be updated together. This integration performs that atomic spec+tracker synchronization and preserves all evidence without changing gameplay source.

- [x] Dependency request revision 8 resolves the current stable direct-package targets.
- [x] Maintenance run `39294812001` reaches full validation with dependency-current, design lint and TypeScript green.
- [x] Required PRD/todo governance schema restored; run `39295604436` proves `game-check` passes.
- [ ] Atomic spec+tracker synchronization passes history-aware `game-doc-sync` on maintenance rerun.
- [ ] Remainder of `pnpm validate` passes and verified dependency refresh bot commit lands package.json/pnpm-lock.yaml.
- [ ] Pages validation reruns on refreshed `main` before CV-001 is called GREEN.

## Core Feature Execution Pipeline

### CV-001 — Exact ways / cascade / Vault Run engine
**Purpose:** Lock deterministic inspectable game rules before balance, persistence or UI work.  
**Inputs / Parameters:** immutable 6×5 board; wagers 10/20/50/100/250; injected random source; base/Vault mode; optional active Vault Run state.  
**Dependencies Touched:** `symbols.ts`, `paytable.ts`, `engine.ts`, `tests/unit/cascade-vault-engine.test.ts`.  
**Technical Notes & Edge Cases:** reel-1 consecutive ways >=3; Wild normal-symbol substitution only; concrete all-Wild way paid once at highest interpretation; immutable simultaneous evaluation; refill rejects Scatter; base ×1..×10; Vault ×2..×20; meter once/free spin; step-3 +3 once; +4 retrigger; 20-spin cap; exact centi-credit units; 51st winning cascade throws; after all free-spin awards, zero remaining spins terminates the feature and `nextVaultState` is null.  
**Implementation Details:** RED `a52d99774c9384ad6a0b4c0ccfbf1c5e7cb51e9a` / run `38122640264`; implementation `f71588d2ca0c96e685f54631c0afb6ded56ade84`; fixture correction `ae5a7e3630964d13efb23bb06c57dc582dbb2455`; terminal-feature hardening `206f2a6aa0ab4a3b0c31aeb4f450b7bc2d83b820`. Independent strict TypeScript + reconstructed behavior harness pass after the fixture-only correction. Canonical runs have so far been blocked before unit execution by repository dependency/governance gates, not a CV-001 assertion failure.  
**Verification & State Sign-off:** canonical GREEN still required before CV-001 is terminal.

- [x] Focused unit contract records the intended missing-module RED.
- [x] Fixture collision corrected without weakening the 400-unit deterministic assertion.
- [x] Terminal final-free-spin state hardened to `nextVaultState: null` in source + focused regression.
- [ ] Exact ways/Wild/dedup/removal/gravity/refill behavior passes canonical focused/full tests after repository gate recovery.
- [ ] Base/Vault multiplier/meter/retrigger/cap and terminal-null behavior pass canonical focused/full tests after repository gate recovery.
- [ ] 50-cascade guard passes canonical focused/full tests after repository gate recovery.

### CV-002 — Reproducible probability / balance audit
**Purpose:** Fix final source-controlled probability/paytable configuration from evidence, not intuition.  
**Inputs / Parameters:** GREEN production engine; provisional paytable + initial/refill distributions; deterministic audit seed; >=10,000,000 paid spins.  
**Dependencies Touched:** planned `simulation.ts`, `tests/unit/cascade-vault-simulation.test.ts`, audit command/evidence; `paytable.ts` and/or `symbols.ts` may change only through measured rebalancing.  
**Technical Notes & Edge Cases:** seeded PRNG is audit/test-only; simulation must call production `createWeightedVaultRandomSource` + `resolveSpin`; one observation is a paid spin plus complete attached Vault Run value; free spins add no wager denominator; stream online mean/variance; corruption-guard hits invalidate a candidate rather than being omitted; primary average cascade depth is winning cascades per paid spin, with engine-spin count diagnostic.  
**Implementation Details:** two isolated advisory reviews were centrally checked against source. Wager arguments remain displayed credits, while awards/totals remain centi-credit integers. Supporting pre-audit math/scratch simulation shows current balance is many multiples above target and even a favorable no-Wild/no-Scatter first-board probability optimization stays above 400% before cascades. The authoritative design permits rebalancing **distributions/paytable**, so weights-only tuning is rejected as an implementation strategy.  
**Verification & State Sign-off:** final 95% RTP interval must intersect 94%-97% and corruption-guard incidence must be zero in the accepted audit.

- [ ] Simulation module RED recorded after CV-001 canonical GREEN.
- [ ] Deterministic seeded PRNG reproducibility/bounds tests GREEN.
- [ ] Paid-spin + complete Vault Run aggregation, Welford variance/SE/95% CI and feature/cascade reporting GREEN.
- [ ] Candidate screening establishes safe paytable/weight configuration with zero observed corruption-guard hits.
- [ ] Final >=10M-spin seed/count/RTP/SE/95% CI/feature frequency/cascade depth recorded.
- [ ] Final paytable/weights frozen only after acceptance and synchronized into spec/PRD/tracker/todo.

### CV-003 — Settled durable checkpoint contract
**Purpose:** Persist practice progress without durable unresolved payout state.  
**Inputs / Parameters:** centi-credit bankroll/totals; selected `CascadeVaultWager` denomination; paid/free counters; stats; preferences; last settled result; fully resolved Vault checkpoint or null.  
**Dependencies Touched:** planned `storage.ts`, `persistence.ts`, shared `GameSaveDefinition`, `tests/unit/cascade-vault-persistence.test.ts`.  
**Technical Notes & Edge Cases:** no board/animation/partial cascade; active feature requires >=1 remaining spin; completed feature is null; malformed/non-finite/negative/unsafe values reject; net invariant; restore 5000 only below 10-credit minimum and outside active feature while preserving stats/preferences.  
**Implementation Details:** schema v1; slug `cascade-vault`; storage key `inmogames:cascade-vault:v1`. Controller ruling: engine denomination remains 10/20/50/100/250 credits while durable money fields use centi-credit integers. `largestSpinWin` is one resolved engine spin, and `highestCascadeChain` is `result.cascades.length`.  
**Verification & State Sign-off:** open.

- [ ] Persistence RED/GREEN recorded after CV-001 canonical GREEN.
- [ ] Base settlement deducts exactly wager×100 units; free-spin settlement deducts zero wager.
- [ ] Reload cannot duplicate or lose a completed award.
- [ ] Final free-spin completion checkpoints feature null and increments completed Vault Runs once.
- [ ] Decoder rejects inconsistent net/feature/result states and unsafe integers.
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
**Inputs / Parameters:** final metadata/workspace, accepted audit constants/evidence, synchronized documentation/tasks, canonical workflow.  
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
- [ ] Final >=10,000,000-spin audit meets the RTP confidence gate with zero corruption-guard hits.
- [ ] Full canonical validation passes on the exact final functional revision.
- [ ] GitHub Pages deployment succeeds for that exact revision.
- [ ] Mark Complete / Verified only after every game-local gate is evidenced; TASK-003 may remain externally blocked.
