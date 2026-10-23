# Cascade Vault design

**Status:** Verified game-local implementation; configured-project Firebase remains TASK-003
**Last synchronized:** 2026-10-23
**Shared dependency refresh:** Functional revision `2628ca27e8aa95778203f78848d30df31e60f25e` passed full CI/Pages `40034775904` on 2026-10-23; exact targets and registry evidence are owned by `docs/DEPENDENCY_POLICY.md` and `.tasks/dependency-refresh-request.json`.
**Proposed route:** `#/games/cascade-vault`

## Product intent

Cascade Vault is the modern high-feature member of the slot family and is mechanically/visually independent from Royal Fortune Slots and Lucky Seven Classic. It uses virtual practice credits only: no purchases, deposits, cash-out, ads, telemetry, real-money value, autoplay, adaptive odds, loss-chasing, or stake-escalation prompts.

## CV-004 presentation design plan (2026-10-23)

Three directions were considered: assay bench, vault door, and specimen map. Use the assay bench because it keeps rules, results, and the spin sequence readable. Wireframe A stacks bankroll → board → actions → rules for narrow reflow; wireframe B places the board beside actions/status. Choose A as the narrow-screen order. Left-align copy/results and center the reel artwork. Use mineral-cut symbols, steel vault controls, and assay-style result presentation. Palette: ink `#202A34`, chalk `#F4F7FA`, steel `#BCC8D2`, blue `#255784`, copper `#B97644`, emerald `#2B7661`. Use the shared rounded display face and system body face, with 16/20/28/40px type roles. Do not repeat the shared page heading as a hero and do not add external assets.

```text
A: Bankroll       B: Bankroll
   Board             Board | Actions
   Actions           Rules | History
   Rules
```

## Core rules

- Board: 6 reels × 5 rows.
- Initial and refill symbols come from source-controlled weighted distributions. Scatters may appear only on an initial paid/free-spin board, never on cascade refills.
- `blank` is an inert nonpaying board symbol. It never forms a way, Wild never substitutes for it, and it is never removed by a win; it remains a normal survivor subject to gravity when other cells clear.
- A normal symbol wins when it appears, directly or through Wild substitution, on at least 3 consecutive reels starting at reel 1. `ways = count(reel1) × ... × count(last qualifying reel)`.
- Wild substitutes for normal paying symbols only; it never substitutes for Scatter and has no standalone paytable entry.
- Each paying symbol is evaluated from one immutable board snapshot. A concrete all-Wild way that could represent multiple symbols is paid once using the highest valid award interpretation; it is never double-paid.
- All accepted winning normal/Wild coordinates are removed simultaneously. Survivors fall downward and new symbols refill from the top. The cascade repeats until no paying ways remain.
- Base-spin cascade multiplier starts ×1, increases by +1 after each winning cascade, caps ×10, and resets for every paid spin.
- Four/five/six-or-more initial Scatters trigger 8/10/12 **Vault Run** free spins.
- Vault Run starts with persistent multiplier ×2. Every winning cascade increases the carried multiplier by +1, capped ×20.
- Vault meter advances at most once per free spin, and only when that free spin resolves at least 3 winning cascades:
  1. Step 1: every later cascade refill during the feature receives exactly one extra Wild, replacing one randomly selected non-Scatter refill symbol using the same random source.
  2. Step 2: all normal-symbol ways awards during later feature cascades receive an additional ×1.5 modifier after the persistent feature multiplier.
  3. Step 3: award exactly +3 free spins once; the meter stays full afterward.
- Four or more initial Scatters during a Vault Run free spin retrigger +4 free spins. Remaining feature spins are capped at 20 after all awards.
- **Feature termination:** after a free spin completely resolves, apply cascade multiplier growth, meter progress, step-3 award and Scatter retrigger. If the resulting `remainingSpins` is zero, the feature is complete and `resolveSpin.nextVaultState` is `null`; a zero-spin active feature object is invalid.
- Hard corruption guard: a 51st winning cascade throws; unresolved settlement must not be fabricated.

## Paytable and exact accounting

The following D6 multipliers match `src/games/cascade-vault/paytable.ts` and the accepted 10M-spin audit `39491663232`; probability evidence is recorded below.

| Symbol | 3 reels | 4 reels | 5 reels | 6 reels |
| --- | ---: | ---: | ---: | ---: |
| Quartz | 0.01× | 0.02× | 0.07× | 0.16× |
| Copper | 0.01× | 0.04× | 0.10× | 0.24× |
| Silver | 0.03× | 0.07× | 0.14× | 0.38× |
| Gold | 0.03× | 0.09× | 0.21× | 0.62× |
| Sapphire | 0.04× | 0.16× | 0.43× | 1.25× |
| Emerald | 0.08× | 0.25× | 0.70× | 1.86× |
| Ruby | 0.11× | 0.38× | 1.12× | 3.11× |
| Vault Crown | 0.15× | 0.64× | 2.10× | 6.23× |

Scatter does not pay a separate credit prize in v1.

Fractional virtual-credit awards are intentional. Runtime, simulation and persistence use integer **centi-credit units**, `CREDIT_SCALE = 100`, so 100 internal units equal 1 displayed credit. Paytable multipliers are integer hundredths and the ×1.5 feature boost is exact 3/2 arithmetic. No rule rounds to whole credits. Any accepted rebalance must remain exactly representable under this contract or explicitly revise the precision contract across engine, persistence and UI before acceptance.

## Randomness and probability evidence

Production spins use browser cryptographic randomness through an injected engine adapter. Tests/audits may inject deterministic seeded sources. Outcomes never depend on bankroll, prior outcomes, session length or user behavior.

The accepted D6 initial/refill weights and paytable passed reproducible audit `39491663232` over **10,000,000 paid spins**, including all attached Vault Run value. Any future rebalance requires the same audit and reports:
- observed RTP,
- standard error,
- 95% confidence interval,
- Vault Run entry frequency,
- average winning-cascade depth per paid spin, with engine-spin diagnostics,
- corruption-guard incidence.

One statistical observation is one paid spin plus the complete value of its attached feature. Free spins do not add a wager denominator. Simulation must call the real `createWeightedVaultRandomSource` and `resolveSpin`; it must not duplicate symbol selection, ways, cascade or Vault rules. A 50-cascade corruption-guard hit invalidates a candidate/audit and may not be omitted from statistics.

The final 95% RTP interval must intersect **94%–97%**, with zero observed corruption-guard hits in the accepted audit. Otherwise distributions/paytable must be rebalanced and rerun before completion.

Supporting pre-audit reconnaissance is deliberately non-authoritative but rules out a weights-only assumption: the current configuration produced returns many multiples above target in scratch modeling, and even a favorable no-Wild/no-Scatter first-board optimization remained above 400% expected return before cascades. The final source configuration therefore requires evidence-led paytable + distribution tuning. Only the production-engine CV-002 audit can establish acceptance.

## Bankroll and persistence

- Initial bankroll: 5,000 displayed credits = 500,000 centi-credit units.
- Base wager steps: 10, 20, 50, 100, 250 displayed credits, bounded by settled bankroll.
- Local key: `inmogames:cascade-vault:v1`; cloud slug: `cascade-vault`.
- Persist only settled state: bankroll, wager, paid/free spin counters, wagered/won/net totals, largest completed spin win, highest cascade chain, completed Vault Run count, sound/reduced-effects preferences, last completed result, and fully resolved post-free-spin feature checkpoint.
- Never persist an in-flight paid spin, board animation state, unresolved cascade or partially settled free spin.
- A completed Vault Run persists `feature: null`; only a feature with at least 1 remaining spin is durable.
- `largestSpinWin` is the payout from one fully resolved engine spin, not an aggregate Vault Run total. `highestCascadeChain` is the maximum `result.cascades.length` from one resolved engine spin.
- Reload must neither duplicate nor lose a completed award.
- If bankroll drops below the 10-credit minimum and no feature is active, expose **Restore 5,000 practice credits** while retaining statistics/preferences.
- Authenticated saves use `users/{uid}/games/cascade-vault`; real configured-project verification remains external TASK-003.

## Architecture

Game-local modules:
- `symbols.ts`: symbols, source-controlled weights, injected weighted draw adapter.
- `paytable.ts`: centi-credit payout math and wager contract.
- `engine.ts`: immutable ways evaluation, Wild dedup, simultaneous removal, gravity/refill, cascade/feature transitions and guard.
- `simulation.ts`: deterministic audit tooling using the production engine, not a second gameplay model.
- `storage.ts` / `persistence.ts`: defensive schema-v1 settled-state decoding and shared platform save definition.
- `audio.ts`: opt-in procedural cues.
- `CascadeVaultWorkspace.tsx` / `cascade-vault.css`: accessible sequence presentation. The current unregistered placeholder is governance-only until browser RED.
- `cascade-vault.meta.ts`, `PRD.md`, `TRACKER.md`, `todo.md`: metadata/living governance.

No gameplay engine or presentation is shared with the other slot titles.

## Interaction, accessibility, responsive and motion contract

Primary hierarchy: bankroll/wager → 6×5 board → current cascade result/multiplier → Vault Run status/meter when active → wager/Spin controls → rules/paytable/preferences.

- Resolve the complete logical spin before presentation; animation may not alter scoring.
- Native buttons for actions; important targets >=48×48 CSS px; visible `:focus-visible`; no required drag, hover, color-only state, sound or animation.
- Aggregate polite live announcements describe cascade number, payout/multiplier and remaining feature spins rather than announcing every moving cell.
- Rules/paytable/feature explanation is available before first spin.
- 320 CSS px: board remains within viewport width with no page-level horizontal overflow.
- 200% text: controls/status reflow in normal flow and do not overlay cells.
- No sticky action surface may cover board/status content; safe-area padding is honored.
- Desktop/landscape may place status beside board; narrow layouts stack.
- `prefers-reduced-motion: reduce` and explicit reduced-effects preference replace travel/zoom/sweeps with immediate/minimal transitions while preserving sequence and final state.
- Audio is opt-in and initialized only from user gesture; cues may cover spin/cascade/multiplier/feature/meter/completion, with silent continuation if unavailable.

## Error handling

- Insufficient bankroll: disable Spin with explanation.
- Random-source failure before resolution: no wager deduction; durable state unchanged.
- Corruption guard: abort unresolved settlement and restore pre-spin checkpoint.
- Persistence failure: preserve settled local/in-memory state and surface nonblocking status.
- Repeated input during resolution: phase-guarded.
- Malformed saves: reject/sanitize to safe defaults without inventing wins/feature state.

## CV-004 client acceptance

The initial browser RED was the missing `.cv` surface. Local validation on 2026-10-23 passed all nine cryptographic-source unit cases and `tests/browser/cascade-vault.mjs`, including all six acceptance slices below. A later fixture RED exhausted its random queue and reached the unchanged 50-cascade safety guard; the finite two-Quartz-cascade fixture now asserts an exact 4,990.3-credit bankroll. Full exact-revision release and refreshed audit evidence are recorded in the Completion contract.

| Acceptance | Required behavior | Evidence surface |
| --- | --- | --- |
| CV-004-A1 | Cryptographic draws reject out-of-range/invalid inputs and propagate secure-source failure without fallback; an RNG failure leaves bankroll unchanged. | `tests/unit/cascade-vault-random.test.ts`, `tests/browser/cascade-vault.mjs` |
| CV-004-A2 | Resolve and settle each paid/free spin exactly once before presentation; presentation locks inputs; reload retains the settled result without replay or duplicate payout. | `tests/browser/cascade-vault.mjs`, `src/games/cascade-vault/persistence.ts` |
| CV-004-A3 | An active Vault checkpoint with eight remaining free spins restores and resumes with the same checkpoint and bankroll after reload. | `tests/browser/cascade-vault.mjs`, `src/games/cascade-vault/persistence.ts` |
| CV-004-A4 | Audio is lazy and opt-in: no audio context on load or when toggling preferences; initialize/play cues only after the Spin user gesture. | `src/games/cascade-vault/audio.ts`, `tests/browser/cascade-vault.mjs` |
| CV-004-A5 | Render a 6×5 board; important controls are at least 48×48 CSS px; at 320px and 200% text the layout has no horizontal overflow; reduced effects preserve final state; use one aggregate live announcement. | `src/games/cascade-vault/cascade-vault.css`, `tests/browser/cascade-vault.mjs` |
| CV-004-A6 | Rules and full paytable are available before play and open disclosures survive URL reload; restoring 5,000 practice credits preserves prior play statistics/preferences. | `tests/browser/cascade-vault.mjs`, `src/games/cascade-vault/persistence.ts` |

## Quality gates

Unit coverage: ways/reel qualification, Wild/dedup, simultaneous wins/removals, gravity/refill, cascade termination/50 guard, multipliers/caps/reset, Scatter triggers/retriggers, all meter steps, final-feature termination, free-spin cap, exact accounting, deterministic random injection, storage decoding and settled checkpoint semantics.

Simulation coverage: source-weight integrity, seeded reproducibility, no adaptive inputs, paid-spin-plus-feature aggregation, correct streaming confidence statistics, feature/cascade metrics, corruption-guard reporting, and final >=10M acceptance audit.

Browser coverage: route, first paid spin, deterministic multi-cascade sequence, aggregate announcements, wager changes/locking, Vault Run entry/progression/exit, settled reload/restore, keyboard/touch, 320px, 200% text, >=48px important targets, reduced motion, opt-in audio and no horizontal overflow.

Production completion requires exact dependency freshness, TypeScript, game/document governance, full unit/rules/shared browser/game browser coverage, both production builds, Pages artifact upload and successful GitHub Pages deployment on the exact functional revision.

## Implementation evidence

- RED: `a52d99774c9384ad6a0b4c0ccfbf1c5e7cb51e9a` / run `38122640264`; dependency/design gates passed, TypeScript failed because the three intended engine modules did not exist.
- Engine implementation: `f71588d2ca0c96e685f54631c0afb6ded56ade84`.
- Fixture correction: `ae5a7e3630964d13efb23bb06c57dc582dbb2455`. The original deterministic fixture had unrelated Copper on reel 4, legitimately extending the intended 3-reel second cascade to 4 reels (700 total). Replacing only that cell with Silver preserves the intended two-cascade, 400-unit contract. Independent strict TypeScript + reconstructed focused assertions then pass.
- Terminal feature hardening: `206f2a6aa0ab4a3b0c31aeb4f450b7bc2d83b820` adds a no-win final-free-spin regression requiring `nextVaultState === null` after remaining spins reach zero.
- Canonical run `39280095530` on `206f2a6a…` passed frozen install/exact-pin checks, then stopped at dependency-current because newer stable patches had appeared before any game checks.
- Dependency request revision 8 corrected those targets. Maintenance run `39294812001` verified every target as npm latest, passed design lint and TypeScript, and then exposed two handoff-document schema regressions. The PRD/todo schema repair in `af5a10b6ba4551a7b940382a5d36b67a2b9aaf75` passed `game-check` in maintenance run `39295604436`; history-aware `game-doc-sync` then correctly required this authoritative spec and tracker to move together. This integration satisfies that atomic-pair rule before maintenance is rerun.
- No CV-001 GREEN claim is made until the refreshed-dependency full validator reaches and passes the unchanged focused/full unit suite.
- **CV-001 canonical GREEN:** refreshed exact revision `08c3506773d17eee3fed7554f211531141856386` passed frozen install, dependency freshness, design lint, TypeScript, history-aware game/document governance, the full unit suite, Firestore rules, shared account/persistence browser checks, the complete design/game browser suite, both production builds, Pages artifact upload and GitHub Pages deployment in run `39296638285`. CV-001 is therefore verified; the game remains implementing because CV-002 through CV-005 are open.
- **CV-002 TDD RED:** exact test-only revision `82b7bb2fa9d2e5aafa2cd7d2b080052127240c5e` / run `39297705487` passed frozen install, dependency freshness and design lint, then TypeScript failed only with `TS2307` because `src/games/cascade-vault/simulation.ts` did not exist. All downstream checks were skipped. The fixed test contract remains unchanged for GREEN.
- **CV-002 simulator GREEN:** implementation revision `cf8f6e3723f483bc126b0f50b0f42161c14dff56` passed the full push validation and Pages deployment chain in run `39298014858`, including the simulation-focused unit contract. Independent review then identified three evidence-strengthening gaps—nonzero feature aggregation, a fixed PRNG vector, and explicit corruption-guard propagation—which are added in the current test-only hardening commit before balance screening.
- **Evidence-hardening fixture correction:** run `39299103907` on `6fa7b570622c3faabe1942d7f2dad7a4d5ba1f99` passed dependency freshness, TypeScript and governance, then failed one new unit fixture because the chosen refill symbols accidentally formed a second Sapphire way and exhausted the queued fixture. Production simulation code did not fail. The corrected refill triplet `vault_crown/copper/copper` has been independently checked to end the free spin after the intended single 200-unit quartz cascade.
- **Evidence-hardening GREEN:** fixture-only correction `fac39b0744d2872ec05cab7b9e8f7c7aadb26cc6` passed the complete repository validation, both builds, artifact upload and Pages deployment in run `39299407841`; the simulation contract now covers nonzero feature aggregation, a fixed seeded-PRNG vector and explicit corruption-guard propagation. A separate opt-in audit harness/workflow is being added so >=10M Monte Carlo evidence is never run accidentally by the routine unit suite.

## Research basis

The free-play design follows conservative gambling-technology principles: understandable rules/likelihood information, demonstrably random non-adaptive outcomes, and no mechanics that encourage chasing losses or escalating stakes. Accessibility follows WCAG 2.2 resize/reflow/target principles and honors reduced-motion preferences.

## Completion contract

**Completion state:** verified
**Completion evidence:** Functional revision `2628ca27e8aa95778203f78848d30df31e60f25e` passed full validation, both builds and Pages deployment in run `40034775904`; required refreshed 10M-spin acceptance passed in run `40036114157`. Live Cloudline purpose/help/reduced-motion/reflow and Cascade board/paytable/spin/reload checks passed on 2026-10-23 without page errors. D6 paytable/distributions, engine rules and schema-v1 persistence are unchanged.

- [x] Exact ways/Wild/removal/gravity/refill/cascade/Vault Run/final-feature-termination engine passes focused/full tests (`08c35067…`, run `39296638285`).
- [x] Reproducible >=10,000,000-spin audit passed on `f9893506…` / run `39491663232`: RTP `0.950268466`, 95% CI `0.943437..0.957100`, zero guard hits.
- [x] Settled schema-v1 persistence, reload, feature termination/checkpoint and restore behavior passed on `343ca3fc…` / run `39459146356`.
- [x] Accessible playable board/Vault Run/audio browser contract passes deterministic gameplay, 320px, 200%-text, target-size, keyboard/touch and reduced-motion gates.
- [x] Catalog/workspace route and all living governance surfaces are synchronized.
- [x] Exact dependency freshness, TypeScript, governance, unit/rules/shared browser/game browser suites pass on the final functional revision.
- [x] Both production builds and Pages artifact upload succeed on that revision.
- [x] GitHub Pages deployment succeeds and tracker/PRD/todo/GAME_INDEX/.tasks close as verified; TASK-003 may remain externally blocked.

### 2026-10-20 — Audit runner discovery repair
Audit workflow run `39300303052` on `7696b76668cd984a5a9e10ccbcc3c39250c37cff` passed dependency freshness, TypeScript, and all 25 focused engine/simulation tests, then failed before simulation because the repository Vitest configuration only discovered `tests/unit/**/*.test.ts`; `tests/audit/cascade-vault-audit.test.ts` was filtered out. The audit runner itself and production simulator were not implicated. `vite.config.ts` now conditionally includes `tests/audit/**/*.test.ts` only when `CASCADE_VAULT_AUDIT=1`, leaving routine `pnpm test:unit` discovery unchanged. Next evidence: routine full validation plus an explicit 25,000-paid-spin audit run on the repaired harness.

### 2026-10-20 — CV-003 persistence TDD opened in parallel
With the production simulator already GREEN and balance auditing isolated from save semantics, CV-003 opens independently with a test-only contract for schema-v1 settled persistence. The RED requires a 5,000-credit default represented as 500,000 centi-credit units, supported wager validation, malformed/non-finite/negative rejection, compact settled result summaries (no boards/animation frames), exact paid/free settlement accounting, validated active/null Vault checkpoints, one-time completed-run counting, insufficient-bankroll rejection, and practice-credit restore only below 10 credits with no active feature. Ruling: settlement helpers remain pure whole-state transforms and do not invent transaction IDs absent from the approved platform contract; duplicate invocation prevention belongs to the single-resolution workspace control path and will be browser-verified in CV-004. No persistence production module exists in this RED integration.

### 2026-10-20 — CV-003 GREEN candidate
RED `40442255b2bb143fa4afb4bc5b86a8c072476fcf` / run `39458077585` passed dependency/design gates and failed only on missing `storage.ts` / `persistence.ts`. The GREEN candidate adds those two settled-only modules without altering the fixed test contract. Audit-discovery revision `4808b129679b949293ec9b71193572a5d89a8706` passed full validation and Pages deployment in run `39457748530`. Persistence verification is pending.

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

### 2026-10-23 — CV-004 presentation implementation resumed

Before validation, the implementation candidate was in progress. The initial browser RED was observed when the direct route lacked `.cv`; that RED remains valid as baseline evidence. That candidate registered and rendered the surface before validation. Acceptance is split into CV-004-A1–A6 above: secure RNG failure/rejection and unchanged bankroll; single resolve/settle with reload-safe results; active eight-spin Vault checkpoint restore; audio initialized only after a Spin gesture, never by preference toggle; 6×5/reflow/48px/reduced-effects/single-live status; and pre-play rules/paytable plus restore preserving stats. This pre-validation entry made no GREEN or deployment claim; current evidence is in the Completion contract. CV-001/CV-002/CV-003 verified evidence remains immutable. At that pre-validation point the shared refresh had not passed the full repository suite.

### 2026-10-20 — CV-004 browser RED opened
The consolidated direct-route browser contract is integrated before playable route/UI implementation. It requires a 6×5 board, pre-play rules, >=48px Spin, keyboard activation, deterministic two-cascade single settlement, presentation lock, reload without replay, concise live status, reduced-effects equivalence, opt-in audio, 320px/200%-text reflow and practice-credit restore. The playable `.cv` route remains intentionally absent in this RED revision; catalog discoverability remains CV-005.

## Refreshed local release evidence

Local release evidence (2026-10-23): frozen pnpm 10.0.0 install, exact/current dependency gates, design lint, TypeScript, game/document governance, 161 unit tests, four Firestore rules tests, shared account browser checks, all game/design browser checks including Hollowshift, and both builds passed. Cloudline account-emulator checks also passed with Firebase 13.1.0. Final paytable reflow/keyboard/skip browser checks and both builds passed after the last presentation change. Runtime/test/config SHA-256 `0df0e1be6c4e09a35067136ba18ed0dbee9ced6681917145b7b1cae30c1d46df` uses sorted tracked and new non-Markdown files, excluding `.tasks/` except the dependency request, with each path and file bytes delimited by NUL. Exact The refreshed functional revision `2628ca2` passed CI/Pages run `40034775904` on 2026-10-23.

## Current release evidence — 2026-10-23

Functional revision `2628ca27e8aa95778203f78848d30df31e60f25e` passed full validation, both builds and Pages deployment in run `40034775904`; required refreshed 10M-spin acceptance passed in run `40036114157`. Live Cloudline purpose/help/reduced-motion/reflow and Cascade board/paytable/spin/reload checks passed on 2026-10-23 without page errors.

Audit `40036114157` used 10,000,000 paid spins, seed 1592594996 and wager 10; RTP was 0.950268466, standard error 0.0034853147598822264, 95% interval 0.9434372490706309–0.9570996829293692, Vault entry frequency 0.0188731, average winning-cascade depth 0.7492685 and zero guard hits. The unchanged acceptance gate passed.

Expected load is one solo game per tab with a fixed 30-cell board, no autoplay, a 50-winning-cascade fault limit and at most 20 remaining feature spins. Source: `engine.ts`, `CascadeVaultWorkspace.tsx` and the core rules above.
