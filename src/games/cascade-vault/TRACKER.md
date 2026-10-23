# Cascade Vault tracker

**Last synchronized:** 2026-10-23
**Shared dependency refresh:** Firebase 13.1.0 and Vite 8.3.5 are the requested shared targets in `docs/DEPENDENCY_POLICY.md` and `.tasks/dependency-refresh-request.json`; local refreshed full validation passed on 2026-10-23; committed CI/Pages evidence remains pending. CV-004 presentation is implementing; CV-001/CV-002/CV-003 evidence and the schema-v1 save contract remain unchanged.
**Spec:** `docs/specs/2026-10-10-cascade-vault-design.md`
**Plan:** `docs/plans/2026-10-10-cascade-vault.md`

| Capability | Status | Verification |
| --- | --- | --- |
| Exact adjacent-ways / cascade engine | verified | CV-001 passed the exact refreshed full validation/deploy chain on revision `08c3506773d17eee3fed7554f211531141856386`, run `39296638285`: dependency freshness, TypeScript, history-aware governance, unit/rules/browser suites, both builds, artifact upload and Pages deployment all succeeded. |
| Exact payout precision | verified | Integer centi-credit accounting (`CREDIT_SCALE = 100`), rational ×1.5 feature boost, fractional paytable awards and multiplier progression are covered by the CV-001 focused/full unit suite in run `39296638285`. D6 balance is accepted under CV-002, but accounting precision is verified. |
| Reproducible 10M-spin probability audit | verified | D6 `f9893506…`; run `39491663232` passed 10M paid spins at RTP `0.950268466`, 95% CI `0.943437..0.957100`, Vault entry frequency `0.0188731`, average cascade depth `0.7492685`, zero guard hits. |
| Settled durable checkpoints | verified | CV-003 RED `40442255…` / run `39458077585`; exact GREEN revision `343ca3fcaccd8efb09ebc0200e6608ca1ed74b74` / run `39459146356` passed full validation and Pages deployment with schema-v1 settled state, exact centi-credit accounting, compact results, validated active/null Vault checkpoints and restore below 10 credits. |
| Accessible board / Vault Run UI / audio | started | The initial browser RED was observed when `.cv` was missing; that remains baseline evidence. The current candidate passes local A1–A6 browser acceptance and nine secure-random unit cases (2026-10-23). CV-004-A1–A6 cover secure RNG failure/rejection with unchanged bankroll; exactly-once resolve/settle and reload; active eight-spin Vault checkpoint recovery; audio only after Spin, not preference toggle; 6×5/48px/320px/200%/reduced-effects/single-live status; and pre-play rules/paytable plus stats-preserving restore. Full exact-revision release evidence remains pending. |
| Catalog / route / production release | started | Base catalog/workspace entry is present in the current candidate but unverified; exact-revision full validation, both builds and Pages deployment remain required before release. |
| Authenticated live-project persistence | blocked externally | Shared account-save architecture will be reused; real configured-project Firebase verification remains TASK-003. |

## Current handoff

**Implementation state:** implementing — CV-001/CV-002/CV-003 verified; CV-004 presentation candidate in progress; CV-005 release integration pending.
**Last verified revision:** CV-002 exact revision `f989350673c2166eea688836e73ce250bbff0d02` / Pages `39491636082` plus 10M acceptance run `39491663232`; CV-003 exact revision `343ca3fcaccd8efb09ebc0200e6608ca1ed74b74` / full validation and Pages `39459146356`. These historical game gates remain verified; they do not verify the current CV-004 candidate.
**Open game-local work:** CV-004-A1–A6 pass locally; finish the CV-005 catalog/workspace entry and exact-revision release evidence. Preserve D6 balance and the verified schema-v1 save contract.
**External blockers:** TASK-003 is the only external service blocker for live configured-project Firebase verification. The shared Firebase 13.1.0/Vite 8.3.5 dependency refresh and exact-revision full validation are pending repository gates; Pages deployment is also required after the functional revision.
**Next action:** local CV-004 acceptance is GREEN; validate the current CV-005 base route with full exact-revision validation/build/deployment. Do not claim CV-004 or whole-game GREEN before evidence lands.

## Canonical verification recovery — 2026-10-19

- Pages run `39280095530` targeted exact revision `206f2a6aa0ab4a3b0c31aeb4f450b7bc2d83b820`; frozen install and `dependency:check` passed, then `dependency:current` failed before game checks due newer stable patch releases.
- Dependency maintenance run `39293588043` showed request revision 7 was stale; request revision 8 corrected current targets.
- Maintenance run `39294812001` verified all request-revision-8 versions as npm latest. Its `pnpm validate` passed dependency-current, design lint and TypeScript, then `game:check` rejected two handoff-document schema regressions.
- Commit `af5a10b6ba4551a7b940382a5d36b67a2b9aaf75` restored the exact PRD/todo schemas. Maintenance run `39295604436` proved `game-check: 7 game(s) OK`, then history-aware `game-doc-sync` correctly rejected that commit because tracker changed without the authoritative spec in the same comparison range.
- This integration updates spec and tracker together and carries the same dependency/governance and balance evidence. No gameplay source is changed by the recovery commits.
- No package/lockfile bot commit has landed yet; the maintenance workflow must complete the full validator first.

## CV-002 RED evidence

Exact test-only revision `82b7bb2fa9d2e5aafa2cd7d2b080052127240c5e`, run `39297705487`: install/current dependency checks and design lint passed; TypeScript failed only at `tests/unit/cascade-vault-simulation.test.ts` import resolution because `simulation.ts` did not exist. No production simulation code was present in the RED revision.

## CV-001 canonical verification

Exact refreshed revision `08c3506773d17eee3fed7554f211531141856386` passed the complete Pages workflow in run `39296638285`. The build job passed frozen install, direct dependency freshness, design lint, TypeScript, history-aware documentation governance, the full unit suite including Cascade Vault engine tests, Firestore rules, shared account/persistence browser checks, all design/game browser regressions, both production builds and Pages artifact upload. The deploy job passed `configure-pages` and `deploy-pages`. CV-001 is verified; this does not imply CV-002 balance, persistence, playable UI/audio, or whole-game completion.

## Task 1 contract and evidence

- `symbols.ts`: symbol types, injected random-source adapter, initial/refill source tables. Refill excludes Scatter. Current weights are provisional until CV-002.
- `paytable.ts`: current provisional multipliers, wager steps, exact centi-credit award calculation.
- `engine.ts`: immutable ways evaluation; combinatorial all-Wild interpretation deduplication; simultaneous removals; gravity/top refill; base ×1..×10; persistent Vault Run ×2..×20; meter once/free spin; one-time step-3 +3; +4 retrigger; remaining-spins cap 20; 50-cascade corruption guard.
- Completed Vault Run semantics: after all cascade/meter/retrigger awards for a free spin are applied, a resulting zero remaining spins is terminal. `resolveSpin.nextVaultState` is `null`, never an active object with `remainingSpins: 0`.
- Task 1 RED is exact revision `a52d99774c9384ad6a0b4c0ccfbf1c5e7cb51e9a` / run `38122640264`.
- The first independent GREEN reproduction found a fixture collision, not a production defect: pre-existing Copper on reel 4 extended the intended 3-reel second cascade to 4 reels. Revision `ae5a7e3630964d13efb23bb06c57dc582dbb2455` changes only that unrelated fixture cell to Silver, preserving the intended 400-unit/two-cascade assertions.

## CV-002 controller rulings from subagent review + central validation

- Simulation must call the real `createWeightedVaultRandomSource` and `resolveSpin`; it must not duplicate symbol selection, ways, cascade or Vault logic.
- Audit seed/randomness is tooling-only. Production randomness remains cryptographic.
- One statistical observation is one **paid spin plus its complete triggered Vault Run value**. Free spins add wins/cascades but no additional wager denominator.
- Primary average cascade depth is total winning cascades across base+attached feature divided by paid-spin count; engine-spin count remains a diagnostic.
- Any 50-cascade corruption-guard hit invalidates the candidate/audit; it may not be silently dropped from RTP statistics.
- The authoritative spec permits rebalancing distributions **and paytable**. Supporting scratch/mathematical evidence rules out treating the current paytable as fixed during CV-002.

## CV-003 controller rulings from subagent review + central validation

- Engine/controller wager remains `CascadeVaultWager` in displayed credits; do not invent a second wager-unit type. Durable monetary balances/totals/results use integer centi-credit units.
- Active feature checkpoints require `remainingSpins` 1-20. Completed feature is `null`.
- `largestSpinWin` means one fully resolved engine spin award, not aggregate Vault Run value. `highestCascadeChain` is the maximum `result.cascades.length` of one resolved engine spin.
- Restore-to-5,000 changes only bankroll and is allowed only below the 10-credit minimum with no active feature; statistics/preferences/history remain unchanged.

## Precision reconciliation

Runtime/accounting uses integer centi-credit units (`100 = 1 displayed credit`). Any CV-002 paytable revision must keep every supported wager/cascade/feature award exactly representable in this accounting model or explicitly revise the precision contract across engine, persistence and UI before acceptance.

## Continuity notes

- Work on `main`; use lease-protected ref updates and preserve unrelated work.
- Cascade Vault shares no gameplay engine/presentation with Royal Fortune or Lucky Seven; reuse only platform/test seams.
- Keep spec, plan, tracker, PRD, todo, GAME_INDEX and `.tasks` synchronized at every material integration.
- Do not register the playable route before its browser RED.
- Whole-game completion requires the >=10M paid-spin acceptance gate, settled persistence, responsive/accessibility/audio browser evidence, exact full validation, both builds and successful Pages deployment.

### 2026-10-20 — Audit runner discovery repair
Audit workflow run `39300303052` on `7696b76668cd984a5a9e10ccbcc3c39250c37cff` passed dependency freshness, TypeScript, and all 25 focused engine/simulation tests, then failed before simulation because the repository Vitest configuration only discovered `tests/unit/**/*.test.ts`; `tests/audit/cascade-vault-audit.test.ts` was filtered out. The audit runner itself and production simulator were not implicated. `vite.config.ts` now conditionally includes `tests/audit/**/*.test.ts` only when `CASCADE_VAULT_AUDIT=1`, leaving routine `pnpm test:unit` discovery unchanged. Next evidence: routine full validation plus an explicit 25,000-paid-spin audit run on the repaired harness.

### 2026-10-20 — CV-003 persistence TDD opened in parallel
With the production simulator already GREEN and balance auditing isolated from save semantics, CV-003 opens independently with a test-only contract for schema-v1 settled persistence. The RED requires a 5,000-credit default represented as 500,000 centi-credit units, supported wager validation, malformed/non-finite/negative rejection, compact settled result summaries (no boards/animation frames), exact paid/free settlement accounting, validated active/null Vault checkpoints, one-time completed-run counting, insufficient-bankroll rejection, and practice-credit restore only below 10 credits with no active feature. Ruling: settlement helpers remain pure whole-state transforms and do not invent transaction IDs absent from the approved platform contract; duplicate invocation prevention belongs to the single-resolution workspace control path and will be browser-verified in CV-004. No persistence production module exists in this RED integration.

## CV-003 TDD evidence — 2026-10-20
RED `40442255b2bb143fa4afb4bc5b86a8c072476fcf` / run `39458077585`: dependency freshness and design lint passed; TypeScript failed only with TS2307 for the intentionally absent persistence/storage modules. Current candidate adds only those modules plus synchronized handoff docs; GREEN is not yet claimed. Audit discovery fix `4808b129…` / run `39457748530` is fully green/deployed.

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

## Resume here

**Current state:** all six CV-004 acceptance slices pass locally on 2026-10-23; D6 engine/distributions/paytable and schema-v1 settlement are unchanged.
**Next action:** finish full validation and both builds, integrate the functional revision on main, then verify CI/Pages and close CV-005 with exact evidence.
**Blockers:** Pages/CI evidence pending; TASK-003 remains external live Firebase work.

## Refreshed local release evidence

Local release evidence (2026-10-23): frozen pnpm 10.0.0 install, exact/current dependency gates, design lint, TypeScript, game/document governance, 161 unit tests, four Firestore rules tests, shared account browser checks, all game/design browser checks including Hollowshift, and both builds passed. Cloudline account-emulator checks also passed with Firebase 13.1.0. Final paytable reflow/keyboard/skip browser checks and both builds passed after the last presentation change. Runtime/test/config SHA-256 `0df0e1be6c4e09a35067136ba18ed0dbee9ced6681917145b7b1cae30c1d46df` uses sorted tracked and new non-Markdown files, excluding `.tasks/` except the dependency request, with each path and file bytes delimited by NUL. Exact committed CI/Pages evidence remains pending.
