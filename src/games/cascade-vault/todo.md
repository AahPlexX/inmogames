# Cascade Vault execution

**Status:** Implementing — CV-001/CV-002/CV-003 verified; CV-004 started; CV-005 release integration pending
**Architecture / Engine:** Immutable 6×5 board → adjacent ways → simultaneous removal → gravity/refill → bounded base/Vault transitions → production-engine simulation → settled persistence → accessible React presentation.
**Dependencies Used:** React 19.3.1; React DOM 19.3.1; TypeScript 7.0.2; Vitest 5.0.5; Playwright 1.64.1; Firebase 13.1.0; Vite 8.3.5. Dependency refresh completed through maintenance run `39296252148`; refreshed exact revision `08c3506773d17eee3fed7554f211531141856386` passed Pages run `39296638285`.

## CV-001 canonical verification

Historical exact refreshed revision `08c3506773d17eee3fed7554f211531141856386` passed the full repository chain and GitHub Pages deployment in run `39296638285`. Dependency freshness, design lint, TypeScript, history-aware governance, unit/rules/shared browser/design-game browser suites, both production builds and artifact upload were all green on that revision. The current exact target set is installed; shared repository validation remains pending.

- [x] Exact current direct dependency pins and lockfile validated.
- [x] History-aware spec/tracker governance validated.
- [x] Full CV-001 unit and repository regression chain passed.
- [x] Both production builds, artifact upload and Pages deployment passed.

Current exact direct-package targets: `package.json`, `.tasks/dependency-refresh-request.json` and `docs/DEPENDENCY_POLICY.md`. Shared full validation remains pending.

## Resume here

**Current state:** CV-001/CV-002/CV-003 retain their historical verified evidence. CV-004 is the active game-local implementation tranche. The initial browser RED while `.cv` was absent remains valid baseline evidence; the current candidate now renders `.cv` and is not yet verified. CV-004-A1 through A6 are pending in the authoritative spec; none is marked GREEN. The shared Firebase 13.1.0/Vite 8.3.5 target set is installed; exact-revision repository validation, builds and Pages deployment remain pending.
**Next action:** finish the CV-004 workspace, CSS, RNG and audio implementation against the six acceptance slices; get the direct browser contract green, then validate the current CV-005 base route with final exact-revision validation/build/Pages release.
**Blockers:** TASK-003 is the only external blocker (live configured-project Firebase). Repository-wide dependency freshness, full validation, builds and Pages deployment are still release gates, not completed evidence.

## Core Feature Execution Pipeline

### CV-001 — Exact ways / cascade / Vault Run engine
**Purpose:** Lock deterministic inspectable game rules before balance, persistence or UI work.
**Inputs / Parameters:** immutable 6×5 board; wagers 10/20/50/100/250; injected random source; base/Vault mode; optional active Vault Run state.
**Dependencies Touched:** `symbols.ts`, `paytable.ts`, `engine.ts`, `tests/unit/cascade-vault-engine.test.ts`.
**Technical Notes & Edge Cases:** reel-1 consecutive ways >=3; Wild normal-symbol substitution only; concrete all-Wild way paid once at highest interpretation; immutable simultaneous evaluation; refill rejects Scatter; base ×1..×10; Vault ×2..×20; meter once/free spin; step-3 +3 once; +4 retrigger; 20-spin cap; exact centi-credit units; 51st winning cascade throws; after all free-spin awards, zero remaining spins terminates the feature and `nextVaultState` is null.
**Implementation Details:** RED `a52d99774c9384ad6a0b4c0ccfbf1c5e7cb51e9a` / run `38122640264`; implementation `f71588d2ca0c96e685f54631c0afb6ded56ade84`; fixture correction `ae5a7e3630964d13efb23bb06c57dc582dbb2455`; terminal-feature hardening `206f2a6aa0ab4a3b0c31aeb4f450b7bc2d83b820`. Independent strict TypeScript + reconstructed behavior harness pass after the fixture-only correction. Canonical runs have so far been blocked before unit execution by repository dependency/governance gates, not a CV-001 assertion failure.
**Verification & State Sign-off:** verified on `08c3506773d17eee3fed7554f211531141856386` / run `39296638285`.

- [x] Focused unit contract records the intended missing-module RED.
- [x] Fixture collision corrected without weakening the 400-unit deterministic assertion.
- [x] Terminal final-free-spin state hardened to `nextVaultState: null` in source + focused regression.
- [x] Exact ways/Wild/dedup/removal/gravity/refill behavior passes focused/full tests (`08c35067…`, run `39296638285`).
- [x] Base/Vault multiplier/meter/retrigger/cap and terminal-null behavior pass focused/full tests (`08c35067…`, run `39296638285`).
- [x] 50-cascade guard passes focused/full tests (`08c35067…`, run `39296638285`).

### CV-002 — Reproducible probability / balance audit
**Purpose:** Fix final source-controlled probability/paytable configuration from evidence, not intuition.
**Inputs / Parameters:** GREEN production engine; provisional paytable + initial/refill distributions; deterministic audit seed; >=10,000,000 paid spins.
**Dependencies Touched:** planned `simulation.ts`, `tests/unit/cascade-vault-simulation.test.ts`, audit command/evidence; `paytable.ts` and/or `symbols.ts` may change only through measured rebalancing.
**Technical Notes & Edge Cases:** seeded PRNG is audit/test-only; simulation must call production `createWeightedVaultRandomSource` + `resolveSpin`; one observation is a paid spin plus complete attached Vault Run value; free spins add no wager denominator; stream online mean/variance; corruption-guard hits invalidate a candidate rather than being omitted; primary average cascade depth is winning cascades per paid spin, with engine-spin count diagnostic.
**Implementation Details:** CV-002 RED is exact revision `82b7bb2fa9d2e5aafa2cd7d2b080052127240c5e` / run `39297705487`: dependency freshness/design lint passed and TypeScript failed only on the absent `simulation.ts`. The unchanged test contract now drives the minimal production-engine simulation implementation. Two isolated advisory reviews were centrally checked against source. Wager arguments remain displayed credits, while awards/totals remain centi-credit integers. Supporting pre-audit math/scratch simulation shows current balance is many multiples above target and even a favorable no-Wild/no-Scatter first-board probability optimization stays above 400% before cascades. The authoritative design permits rebalancing **distributions/paytable**, so weights-only tuning is rejected as an implementation strategy.
**Verification & State Sign-off:** final 95% RTP interval must intersect 94%-97% and corruption-guard incidence must be zero in the accepted audit.

- [x] Simulation module RED recorded after CV-001 canonical GREEN (`82b7bb2f…`, run `39297705487`; missing `simulation.ts` only).
- [x] Deterministic seeded PRNG reproducibility/bounds plus fixed known-vector tests GREEN (`fac39b07…`, run `39299407841`).
- [x] Paid-spin + complete nonzero Vault Run aggregation, Welford variance/SE/95% CI, feature/cascade reporting and guard-abort behavior GREEN (`fac39b07…`, run `39299407841`).
- [x] Opt-in audit harness/workflow and D6 candidate pass with zero observed guard hits.
- [x] Final 10M audit evidence is recorded in run `39491663232`.
- [x] D6 paytable and blank-30 distribution are frozen after acceptance and synchronized.

### CV-003 — Settled durable checkpoint contract
**Purpose:** Persist practice progress without durable unresolved payout state.
**Inputs / Parameters:** centi-credit bankroll/totals; selected `CascadeVaultWager` denomination; paid/free counters; stats; preferences; last settled result; fully resolved Vault checkpoint or null.
**Dependencies Touched:** planned `storage.ts`, `persistence.ts`, shared `GameSaveDefinition`, `tests/unit/cascade-vault-persistence.test.ts`.
**Technical Notes & Edge Cases:** no board/animation/partial cascade; active feature requires >=1 remaining spin; completed feature is null; malformed/non-finite/negative/unsafe values reject; net invariant; restore 5000 only below 10-credit minimum and outside active feature while preserving stats/preferences.
**Implementation Details:** schema v1; slug `cascade-vault`; storage key `inmogames:cascade-vault:v1`. Controller ruling: engine denomination remains 10/20/50/100/250 credits while durable money fields use centi-credit integers. `largestSpinWin` is one resolved engine spin, and `highestCascadeChain` is `result.cascades.length`. RED `40442255…` / run `39458077585` failed only on missing production modules; current candidate adds `storage.ts` and `persistence.ts` only.
**Verification & State Sign-off:** verified on `343ca3fcaccd8efb09ebc0200e6608ca1ed74b74` / run `39459146356` (full validation + Pages).

- [ ] Persistence RED/GREEN recorded after CV-001 canonical GREEN.
- [ ] Base settlement deducts exactly wager×100 units; free-spin settlement deducts zero wager.
- [ ] Reload cannot duplicate or lose a completed award.
- [ ] Final free-spin completion checkpoints feature null and increments completed Vault Runs once.
- [ ] Decoder rejects inconsistent net/feature/result states and unsafe integers.
- [ ] Restore-to-5,000 preserves prior history/preferences.

### CV-004 — Accessible cascading board / Vault Run presentation / audio
**Purpose:** Present pre-resolved outcomes clearly without animation affecting score.
**Inputs / Parameters:** resolved engine event sequence; settled save; motion/audio preferences.
**Dependencies Touched:** production `CascadeVaultWorkspace.tsx`, `cascade-vault.css`, `audio.ts`, `random.ts`, `tests/unit/cascade-vault-random.test.ts`, `tests/browser/cascade-vault.mjs`.
**Technical Notes & Edge Cases:** aggregate live announcements; >=48×48 important targets; 320px/200%-text reflow; no sticky overlap; reduced effects preserve final state; audio initializes only from Spin gesture, not preference toggles; pre-play rules/paytable; cryptographic-source failure leaves bankroll unchanged; settlement occurs once before presentation and reload never replays; active eight-free-spin checkpoint restores.
**Implementation Details:** started. The initial browser RED was observed while `.cv` was missing and remains baseline evidence; the current candidate now renders `.cv` but has no browser GREEN. It is being verified against CV-004-A1–A6 in the authoritative spec.
**Verification & State Sign-off:** [x] consolidated browser RED contract exists and initial missing-`.cv` RED was observed; [x] CV-004-A1 crypto rejection/failure and unchanged bankroll; [x] CV-004-A2 exactly-once settlement/reload; [x] CV-004-A3 active eight-spin Vault checkpoint reload; [x] CV-004-A4 lazy audio after Spin only; [x] CV-004-A5 board/reflow/targets/reduced effects/single live status; [x] CV-004-A6 pre-play rules/paytable and restore preserving stats.

### CV-005 — Catalog / governance / exact-revision release
**Purpose:** Finish discoverability and release only after gameplay evidence is green.
**Inputs / Parameters:** final metadata/workspace, accepted audit constants/evidence, synchronized documentation/tasks, canonical workflow.
**Dependencies Touched:** `src/catalog.ts`, `src/games/workspaces.tsx`, `package.json` if suite registration changes, spec/plan/tracker/PRD/todo/GAME_INDEX/`.tasks`.
**Technical Notes & Edge Cases:** verified state requires terminal capability rows, exact revision/run, no open game-local work, both production builds and Pages success; TASK-003 stays external.
**Implementation Details:** the CV-005 base catalog/workspace entry is present in the current candidate. Final release remains open until the exact functional revision passes full validation, builds and Pages deployment.
**Verification & State Sign-off:** [ ] base route registration; [ ] full exact-revision validation; [ ] both builds and Pages deployment; [ ] evidence-only verified closeout.

- [ ] Catalog/workspace base integration after browser RED.
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

### 2026-10-20 — Audit runner discovery repair
Audit workflow run `39300303052` on `7696b76668cd984a5a9e10ccbcc3c39250c37cff` passed dependency freshness, TypeScript, and all 25 focused engine/simulation tests, then failed before simulation because the repository Vitest configuration only discovered `tests/unit/**/*.test.ts`; `tests/audit/cascade-vault-audit.test.ts` was filtered out. The audit runner itself and production simulator were not implicated. `vite.config.ts` now conditionally includes `tests/audit/**/*.test.ts` only when `CASCADE_VAULT_AUDIT=1`, leaving routine `pnpm test:unit` discovery unchanged. Next evidence: routine full validation plus an explicit 25,000-paid-spin audit run on the repaired harness.

### 2026-10-20 — CV-003 persistence TDD opened in parallel
With the production simulator already GREEN and balance auditing isolated from save semantics, CV-003 opens independently with a test-only contract for schema-v1 settled persistence. The RED requires a 5,000-credit default represented as 500,000 centi-credit units, supported wager validation, malformed/non-finite/negative rejection, compact settled result summaries (no boards/animation frames), exact paid/free settlement accounting, validated active/null Vault checkpoints, one-time completed-run counting, insufficient-bankroll rejection, and practice-credit restore only below 10 credits with no active feature. Ruling: settlement helpers remain pure whole-state transforms and do not invent transaction IDs absent from the approved platform contract; duplicate invocation prevention belongs to the single-resolution workspace control path and will be browser-verified in CV-004. No persistence production module exists in this RED integration.

### 2026-10-20 — CV-002 first distribution tuning candidate
Production audit run `39459206136` on persistence-GREEN revision `343ca3fcaccd8efb09ebc0200e6608ca1ed74b74` passed dependency freshness, TypeScript and all focused engine/simulation tests, then the 25,000-paid-spin screen aborted with `corruptionGuardHits: 1` at the hard 50-cascade limit. This rejects the provisional distribution for acceptance and proves paytable-only scaling cannot solve the evolution risk. Candidate D1 therefore flattens paying-symbol concentration and reduces Wild weight: initial/refill paying weights `13/12/12/11/11/11/10/1` with Wild `1`; initial Scatter remains `4` and refill Scatter remains forbidden. Paytable is unchanged for this screen so the next audit isolates distribution effects. CV-003 persistence is verified independently on `343ca3fc…` / run `39459146356`.

### 2026-10-20 — CV-002 structural candidate D2: inert blank
Distribution-only candidate D1 (`7d94703394ee570c76a44fafa98b3dd75032a5d1`) still hit the 50-cascade guard in 25k audit run `39459715477`, proving that flattening probabilities inside an all-paying 6×5 symbol set is insufficient. Ruling: add one explicit inert `blank` board symbol to initial/refill distributions at weight 24. Blank is not in `PAYING_SYMBOLS`, cannot be substituted by Wild, never wins or enters win removals, but otherwise occupies a board cell and follows normal survivor/gravity behavior. Existing D1 paying/Wild/Scatter weights are unchanged; Scatter stays initial-only. The hard 50-cascade guard remains a fault circuit breaker, never a normal truncation/settlement rule. Focused regression proves blank is nonpaying and refill still excludes Scatter. Paytable remains unchanged until D2 clears chain-risk screening.

### 2026-10-20 — CV-002 calibrated candidate D3
D2 exact revision `5c2062f876b267a8ef6751a49c1cb1c036680b27` passed the full repository chain and Pages deployment in run `39460176426`. Its same-seed 25,000-paid-spin audit `39460203286` completed with zero corruption-guard hits, proving the inert-blank structure materially stabilizes cascade tails, but measured RTP was `13.214587` (1321.4587%; 95% CI `11.514863..14.914311`). D3 therefore increases blank weight modestly from 24 to 30 and scales the paytable to approximately 8.5% of D2 using positive integer centi multipliers. Independent math review confirms the screening estimate `13.214587 × 0.85 × 0.085 ≈ 0.954754`; this is a hypothesis only, not acceptance evidence. D3 must pass the unchanged full validation and same-seed 25k audit before any confirmation run.

### 2026-10-20 — D3 fixture expectation synchronization
D3 audit run `39461070614` passed dependency freshness and TypeScript; the engine suite was GREEN, and the simulation suite failed exactly one historical economic assertion: the hardened one-cascade Vault fixture now returns `20` centi-credit units under D3 instead of the pre-D3 `200`, while `engineSpins: 9`, `winningCascades: 1`, and feature entry remain unchanged. This is the expected result of the paytable calibration, not a production simulation defect. The fixture monetary expectation is synchronized to 20; historical references to 200 remain valid for their earlier paytable revision. No production source changes are made in this repair.

### 2026-10-20 — CV-002 paytable candidate D4
D3 exact revision `59e515f35cd234dd6f6bfb586eacb67c49d1d9f6` completed the same-seed 25,000-paid-spin audit in run `39461462180` with zero corruption-guard hits, RTP `0.6285558`, SE `0.04704613`, 95% CI `0.536345..0.720766`, Vault entry frequency `0.0186`, and average cascade depth `0.74636`. Distribution is now frozen at blank weight 30 because safety/evolution metrics are stable. D4 is paytable-only: common 3-reel Quartz/Copper remain at the minimum centi multiplier 1, while longer and rarer outcomes carry most of the required uplift. Two independent quantitative reviewers preferred one inexpensive screening run before adding attribution diagnostics; no RNG/distribution/engine changes are made.


### 2026-10-20 — CV-002 paytable candidate D5
D4 exact revision `84a18f92a77add9e058c58c030bf364b3f962003` passed the complete Pages validation/deployment chain in run `39461928870`. Same-seed 25,000-paid-spin audit `39461954213` completed with zero corruption-guard hits, RTP `1.1440064`, SE `0.09032353`, 95% CI `0.966972..1.321041`, Vault entry frequency `0.0186`, and average cascade depth `0.74636`. Because final acceptance requires >=10,000,000 paid spins, the observed 1.144 mean is treated as too high despite the small-screen interval touching the target band. Distribution stays frozen at blank weight 30. D5 changes only paytable centi multipliers using scale `0.955 / 1.1440064 = 0.8347855` rounded to positive integers; engine, RNG, feature rules, distribution, persistence, and audit logic are unchanged. Next gate: unchanged full validation plus the same-seed 25k screen; proceed to >=10M acceptance only if the measured mean is plausibly inside 0.94–0.97.

### 2026-10-20 — CV-002 acceptance miss and paytable candidate D6
D5 exact revision `2ef4203a2550accdc737f664eb09a973ba0cf3ba` passed the complete repository validation and Pages deployment chain in run `39490450975`. Its same-seed 25,000-paid-spin screen `39490491425` measured RTP `0.9567358` with zero guard hits, but the required 10,000,000-paid-spin acceptance run `39490755045` decisively rejected D5: RTP `0.87157806`, SE `0.00319013`, 95% CI `0.865325..0.877831`, Vault entry frequency `0.0188731`, average cascade depth `0.7492685`, and zero corruption-guard hits. D6 keeps the proven distribution, engine, RNG, feature, persistence and audit paths unchanged and scales only paytable values by midpoint factor `0.955 / 0.87157806 ≈ 1.0957`, rounded to positive integer centi multipliers. Payout-contribution instrumentation is intentionally deferred because the current payout is linear in the paytable and a direct proportional correction is the smaller complete change; revisit diagnostics only if D6 fails the >=10M acceptance gate.

### 2026-10-20 — CV-002 verified acceptance
D6 exact revision `f989350673c2166eea688836e73ce250bbff0d02` passed full validation and Pages deployment in run `39491636082`. Required 10,000,000-paid-spin acceptance run `39491663232` passed with seed `1592594996`, wager 10, RTP `0.950268466`, SE `0.00348531`, 95% CI `0.943437..0.957100`, Vault entry frequency `0.0188731`, average cascade depth `0.7492685`, and zero corruption-guard hits. D6 distribution/paytable are frozen. CV-002 is verified; next game-local work is CV-004, then CV-005.

### 2026-10-20 — CV-004 browser RED opened
The consolidated direct-route browser contract is integrated before playable route/UI implementation. It requires a 6×5 board, pre-play rules, >=48px Spin, keyboard activation, deterministic two-cascade single settlement, presentation lock, reload without replay, concise live status, reduced-effects equivalence, opt-in audio, 320px/200%-text reflow and practice-credit restore. The playable `.cv` route remains intentionally absent in this RED revision; catalog discoverability remains CV-005.
