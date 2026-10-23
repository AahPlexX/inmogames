# Cascade Vault PRD

Planned Functional Features Specification:
  game_identity:
    name: "Cascade Vault"
    slug: "cascade-vault"
    development_status: "Verified game-local scope on 2628ca27e8aa95778203f78848d30df31e60f25e / run 40034775904; live Firebase TASK-003 remains external"

  technical_foundation:
    architecture_and_engine: Pure six-reel/five-row adjacent-ways cascade engine with immutable evaluation, exact centi-credit accounting, injected randomness, bounded base/Vault multipliers, explicit final-feature termination, reproducible production-engine simulation, settled persistence, React presentation and shared save platform.
    dependencies_used: ["React 19.3.1", "React DOM 19.3.1", "TypeScript 7.0.2", "Vitest 5.0.5", "Playwright 1.64.1", "Firebase 13.1.0", "Vite 8.3.5"]
    dependency_refresh: "Current exact targets are installed with frozen lockfile; see docs/DEPENDENCY_POLICY.md. Refreshed CI/Pages passed on 2628ca2 / run 40034775904."

  core_feature_specifications:
    - name: "Exact ways/cascade/Vault Run engine"
      id: "CV-001"
      details: "6x5 immutable ways from reel 1; Wild substitution with concrete all-Wild interpretation dedup; simultaneous removals; gravity/top refill; base x1..x10; persistent Vault Run x2..x20; three-step meter; +4 retrigger; 20-spin cap; 50-cascade guard; exact centi-credit payout math; completed final free spin returns nextVaultState null after all awards are applied."
      feature_development_status: "verified — exact refreshed revision 08c3506773d17eee3fed7554f211531141856386 / run 39296638285"

    - name: "Reproducible probability and balance audit"
      id: "CV-002"
      details: "Deterministic seeded audit reuses production createWeightedVaultRandomSource and resolveSpin. Each observation is one paid spin plus all value/cascades from its complete triggered Vault Run, with no extra free-spin wager denominator. Final >=10,000,000 paid spins report RTP, standard error, 95% CI, Vault Run entry frequency, defined average cascade depth and corruption-guard incidence. D6 distributions and paytable passed acceptance run 39491663232; the authoritative design permits rebalancing both, and the accepted interval must intersect 94%-97% with zero corruption-guard hits."
      feature_development_status: "verified — D6 f9893506 / Pages 39491636082 / 10M acceptance 39491663232"

    - name: "Settled durable practice progression"
      id: "CV-003"
      details: "Schema-v1 integer centi-credit bankroll/statistics/preferences plus post-free-spin Vault Run checkpoints only. Selected wager remains the engine denomination 10/20/50/100/250 credits. No board/partial cascade/in-flight spin state is durable. Active feature requires 1-20 remaining spins; completed feature is null; restore 5,000 preserves statistics/preferences."
      feature_development_status: "verified — RED 40442255 / run 39458077585; GREEN 343ca3fc / run 39459146356"

    - name: "Accessible cascading board and feature presentation"
      id: "CV-004"
      details: "Accessible 6x5 board, aggregate live cascade status, Vault Run meter and free-spin/multiplier panel, >=48px important controls, finite/reduced-effects presentation, lazy opt-in procedural audio, rules/paytable before play, 320px/200%-text keyboard/touch/overflow behavior, cryptographic rejection and failure handling, exactly-once pre-presentation settlement, reload-safe results and active eight-free-spin checkpoint recovery, and stats-preserving practice-credit restore."
      feature_development_status: "verified — A1–A6, full CI/Pages and live smoke on 2628ca2 / run 40034775904"

    - name: "Catalog, governance and exact-revision release"
      id: "CV-005"
      details: "Register the playable catalog/lazy route after browser RED; synchronize spec/plan/tracker/PRD/todo/GAME_INDEX/.tasks; pass exact dependency checks and full repository validation; produce both builds and deploy the exact functional revision to GitHub Pages."
      feature_development_status: "verified — route/catalog, full CI/Pages and live smoke on 2628ca2 / run 40034775904"

## Current evidence

- CV-001 RED: exact revision `a52d99774c9384ad6a0b4c0ccfbf1c5e7cb51e9a`, run `38122640264`.
- Pure engine implementation: `f71588d2ca0c96e685f54631c0afb6ded56ade84`.
- Fixture-only correction: `ae5a7e3630964d13efb23bb06c57dc582dbb2455`; it removes unrelated reel-4 Copper that legitimately extended the intended 3-reel second cascade, without weakening the 400-unit/multiplier/draw assertions.
- Terminal-feature hardening: `206f2a6aa0ab4a3b0c31aeb4f450b7bc2d83b820`; final fully settled free spin returns feature null when no spins remain.
- Canonical run `39280095530` on that exact revision passed frozen install/exact-pin checks, then stopped at `dependency:current` before TypeScript/game/unit/browser/build because several direct packages had newer stable patches. This is repository freshness blocking, not CV-001 failure evidence.
- Dependency-maintenance run `39293588043` exposed stale request revision 7. Request revision 8 corrected the target versions.
- Dependency-maintenance run `39294812001` verified every revision-8 direct dependency as npm latest and reached `pnpm validate`; design lint and TypeScript passed. `game:check` then correctly rejected the Cascade PRD/todo because the previous handoff rewrite renamed the required `technical_foundation.dependencies_used` field and the required `Dependencies` todo heading. These governance structures are restored without changing gameplay source.
- Two isolated advisory implementation reviews were centrally reconciled with source. Supporting pre-audit analysis indicates current balance is far above the target and that weights-only tuning is not credible; CV-002 therefore exercises the spec-authorized paytable + distribution rebalance rather than treating the current paytable as final.
- CV-004 A1–A6 pass local browser acceptance on 2026-10-23; initial missing-surface and exhausted-fixture REDs remain historical evidence. Exact-revision CI/Pages passed on `2628ca2` / run `40034775904`. CV-001/CV-002/CV-003 historical verification remains intact.
- The installed shared targets and CV-005 catalog/workspace entry passed full CI/Pages `40034775904` on `2628ca2`. TASK-003 is the only external service blocker.

## CV-001 verification and CV-002 opening — 2026-10-19

CV-001 is verified on exact refreshed revision `08c3506773d17eee3fed7554f211531141856386`, run `39296638285`, which passed the full repository validation, both builds, artifact upload and Pages deployment. CV-002 now opens test-first: `tests/unit/cascade-vault-simulation.test.ts` is added before `simulation.ts` exists, so the expected RED is the missing simulation module after governance reaches TypeScript. No simulation/balance result is claimed from the RED commit.

CV-002 RED evidence: exact revision `82b7bb2fa9d2e5aafa2cd7d2b080052127240c5e` / run `39297705487` fails only on the intentionally absent `simulation.ts` after dependency/design gates. The production module now being integrated must satisfy that unchanged contract.

CV-002 implementation evidence: `cf8f6e3723f483bc126b0f50b0f42161c14dff56` passed full validation and Pages deployment in run `39298014858`. Before balance screening, independent review required additional deterministic evidence; the current test hardening adds nonzero Vault Run award aggregation, a published seeded-PRNG vector and explicit corruption-guard propagation without changing production simulation logic.

Evidence-hardening note: run `39299103907` failed only the new nonzero feature fixture because its first refill choice created a second Sapphire cascade. Production simulation stayed unchanged; the corrected refill triplet is `vault_crown/copper/copper`, independently checked to terminate after one 200-unit quartz cascade.

CV-002 hardened simulation evidence is GREEN on `fac39b0744d2872ec05cab7b9e8f7c7aadb26cc6` / run `39299407841`. The next integration adds a deliberately non-routine audit command/workflow: ordinary unit validation skips the heavy audit; explicit screening/acceptance runs reuse the production simulator and emit one machine-readable JSON result.

### 2026-10-20 — Audit runner discovery repair
Audit workflow run `39300303052` on `7696b76668cd984a5a9e10ccbcc3c39250c37cff` passed dependency freshness, TypeScript, and all 25 focused engine/simulation tests, then failed before simulation because the repository Vitest configuration only discovered `tests/unit/**/*.test.ts`; `tests/audit/cascade-vault-audit.test.ts` was filtered out. The audit runner itself and production simulator were not implicated. `vite.config.ts` now conditionally includes `tests/audit/**/*.test.ts` only when `CASCADE_VAULT_AUDIT=1`, leaving routine `pnpm test:unit` discovery unchanged. Next evidence: routine full validation plus an explicit 25,000-paid-spin audit run on the repaired harness.

### 2026-10-20 — CV-003 persistence TDD opened in parallel
With the production simulator already GREEN and balance auditing isolated from save semantics, CV-003 opens independently with a test-only contract for schema-v1 settled persistence. The RED requires a 5,000-credit default represented as 500,000 centi-credit units, supported wager validation, malformed/non-finite/negative rejection, compact settled result summaries (no boards/animation frames), exact paid/free settlement accounting, validated active/null Vault checkpoints, one-time completed-run counting, insufficient-bankroll rejection, and practice-credit restore only below 10 credits with no active feature. Ruling: settlement helpers remain pure whole-state transforms and do not invent transaction IDs absent from the approved platform contract; duplicate invocation prevention belongs to the single-resolution workspace control path and will be browser-verified in CV-004. No persistence production module exists in this RED integration.

CV-003 candidate note (2026-10-20): storage/persistence modules implement the unchanged RED contract only; no route/UI or live-Firebase completion claim is made.

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

## Release closeout — 2026-10-23

Functional revision `2628ca27e8aa95778203f78848d30df31e60f25e` passed full validation, both builds and Pages deployment in run `40034775904`; required refreshed 10M-spin acceptance passed in run `40036114157`. Live Cloudline purpose/help/reduced-motion/reflow and Cascade board/paytable/spin/reload checks passed on 2026-10-23 without page errors. Authoritative acceptance and audit metrics: `docs/specs/2026-10-10-cascade-vault-design.md`.
