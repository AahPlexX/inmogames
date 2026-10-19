# Cascade Vault tracker

**Last synchronized:** 2026-10-19  
**Spec:** `docs/specs/2026-10-10-cascade-vault-design.md`  
**Plan:** `docs/plans/2026-10-10-cascade-vault.md`

| Capability | Status | Verification |
| --- | --- | --- |
| Exact adjacent-ways / cascade engine | verified | CV-001 passed the exact refreshed full validation/deploy chain on revision `08c3506773d17eee3fed7554f211531141856386`, run `39296638285`: dependency freshness, TypeScript, history-aware governance, unit/rules/browser suites, both builds, artifact upload and Pages deployment all succeeded. |
| Exact payout precision | verified | Integer centi-credit accounting (`CREDIT_SCALE = 100`), rational ×1.5 feature boost, fractional paytable awards and multiplier progression are covered by the CV-001 focused/full unit suite in run `39296638285`. Balance values remain provisional under CV-002, but accounting precision is verified. |
| Reproducible 10M-spin probability audit | started | RED `82b7bb2f…` / run `39297705487`; simulator implementation `cf8f6e37…` passed full validation and Pages deployment in run `39298014858`. Independent review then required stronger evidence before tuning: nonzero feature aggregation, fixed seeded-vector stability and explicit guard-abort regression are now added; >=10M acceptance audit remains open. |
| Settled durable checkpoints | planned | Schema-v1 settled state only; active Vault state requires 1-20 remaining spins and completed feature is null. Monetary state persists centi-credit integers; selected wager remains the engine denomination 10/20/50/100/250 credits. Restore 5,000 preserves history/preferences. |
| Accessible board / Vault Run UI / audio | planned | Consolidated browser contract: deterministic cascade/feature presentation, aggregate live status, 320px/200%-text reflow, >=48px important targets, keyboard/touch, reduced motion, opt-in audio. |
| Catalog / route / production release | planned | Governance-only metadata/workspace shell exists; playable catalog/lazy route remains intentionally unregistered until browser RED. Exact-revision full validation and Pages deployment are required. |
| Authenticated live-project persistence | blocked externally | Shared account-save architecture will be reused; real configured-project Firebase verification remains TASK-003. |

## Current handoff

**Implementation state:** implementing — CV-001 verified; CV-002 simulation/balance TDD RED opening  
**Last verified revision:** `08c3506773d17eee3fed7554f211531141856386` / GitHub Actions run `39296638285` — CV-001 exact engine/accounting scope plus full repository validation and Pages deployment  
**Open game-local work:** CV-002 production-engine simulation/paytable+weight balance and >=10M audit; CV-003 settled persistence; CV-004 playable UI/audio/browser quality; CV-005 catalog/release closeout  
**External blockers:** TASK-003 for real configured-project Firebase services only; it does not block game-local implementation or verification  
**Next action:** validate the strengthened CV-002 simulation evidence, then add a dedicated non-routine audit harness and use it to screen the unchanged current configuration before selecting an exact paytable/weight candidate for the >=10M acceptance run.  

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
