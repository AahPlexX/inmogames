# Cascade Vault tracker

**Last synchronized:** 2026-10-20  
**Spec:** `docs/specs/2026-10-10-cascade-vault-design.md`  
**Plan:** `docs/plans/2026-10-10-cascade-vault.md`

| Capability | Status | Verification |
| --- | --- | --- |
| Exact adjacent-ways / cascade engine | verified | CV-001 passed the exact refreshed full validation/deploy chain on revision `08c3506773d17eee3fed7554f211531141856386`, run `39296638285`: dependency freshness, TypeScript, history-aware governance, unit/rules/browser suites, both builds, artifact upload and Pages deployment all succeeded. |
| Exact payout precision | verified | Integer centi-credit accounting (`CREDIT_SCALE = 100`), rational ×1.5 feature boost, fractional paytable awards and multiplier progression are covered by the CV-001 focused/full unit suite in run `39296638285`. Balance values remain provisional under CV-002, but accounting precision is verified. |
| Reproducible 10M-spin probability audit | started | RED `82b7bb2f…`; simulator GREEN `cf8f6e37…` / run `39298014858`; hardened simulation evidence GREEN `fac39b07…` / run `39299407841`. The opt-in audit test/runner/workflow now provide reproducible screening and >=10M acceptance execution without burdening routine unit validation. Current paytable/weights remain provisional pending screening. |
| Settled durable checkpoints | verified | CV-003 RED `40442255…` / run `39458077585`; exact GREEN revision `343ca3fcaccd8efb09ebc0200e6608ca1ed74b74` / run `39459146356` passed full validation and Pages deployment with schema-v1 settled state, exact centi-credit accounting, compact results, validated active/null Vault checkpoints and restore below 10 credits. |
| Accessible board / Vault Run UI / audio | planned | Consolidated browser contract: deterministic cascade/feature presentation, aggregate live status, 320px/200%-text reflow, >=48px important targets, keyboard/touch, reduced motion, opt-in audio. |
| Catalog / route / production release | planned | Governance-only metadata/workspace shell exists; playable catalog/lazy route remains intentionally unregistered until browser RED. Exact-revision full validation and Pages deployment are required. |
| Authenticated live-project persistence | blocked externally | Shared account-save architecture will be reused; real configured-project Firebase verification remains TASK-003. |

## Current handoff

**Implementation state:** implementing — CV-001 verified; CV-002 audit active; CV-003 GREEN candidate integrated  
**Last verified revision:** `08c3506773d17eee3fed7554f211531141856386` / GitHub Actions run `39296638285` — CV-001 exact engine/accounting scope plus full repository validation and Pages deployment  
**Open game-local work:** CV-002 production-engine simulation/paytable+weight balance and >=10M audit; CV-003 settled persistence; CV-004 playable UI/audio/browser quality; CV-005 catalog/release closeout  
**External blockers:** TASK-003 for real configured-project Firebase services only; it does not block game-local implementation or verification  
**Next action:** verify the CV-003 persistence candidate on the unchanged RED contract; independently run the repaired 25,000-paid-spin audit screen before any balance tuning.  

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

