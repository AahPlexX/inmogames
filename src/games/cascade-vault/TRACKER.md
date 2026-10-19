# Cascade Vault tracker

**Last synchronized:** 2026-10-19  
**Spec:** `docs/specs/2026-10-10-cascade-vault-design.md`  
**Plan:** `docs/plans/2026-10-10-cascade-vault.md`

| Capability | Status | Verification |
| --- | --- | --- |
| Exact adjacent-ways / cascade engine | started | RED: revision `a52d99774c9384ad6a0b4c0ccfbf1c5e7cb51e9a`, run `38122640264`. Implementation `f71588d2ca0c96e685f54631c0afb6ded56ade84`, fixture correction `ae5a7e3630964d13efb23bb06c57dc582dbb2455`, and terminal-feature hardening `206f2a6aa0ab4a3b0c31aeb4f450b7bc2d83b820` are integrated. Canonical run `39280095530` stopped at dependency freshness; maintenance run `39294812001` reached design lint + TypeScript GREEN, then stopped at two now-repaired documentation-schema checks before unit execution. CV-001 therefore remains unverified rather than failed. |
| Exact payout precision | started | Runtime awards use integer centi-credit accounting (`CREDIT_SCALE = 100`) and exact rational ×1.5 feature boost. CV-002 may rebalance paytable multipliers, but must preserve exact integer-unit settlement for every supported wager/modifier combination. |
| Reproducible 10M-spin probability audit | planned | Current symbol weights **and paytable** remain provisional for balance. Supporting pre-audit reconnaissance shows a weights-only tune is not credible: even an optimized no-Wild/no-Scatter first-board distribution stays above 400% expected return before cascades. CV-002 must report RTP, SE, 95% CI, Vault Run entry frequency, average cascade depth and any corruption-guard incidence; final CI must intersect 94%-97%. |
| Settled durable checkpoints | planned | Schema-v1 settled state only; active Vault state requires 1-20 remaining spins and completed feature is null. Monetary state persists centi-credit integers; selected wager remains the engine denomination 10/20/50/100/250 credits. Restore 5,000 preserves history/preferences. |
| Accessible board / Vault Run UI / audio | planned | Consolidated browser contract: deterministic cascade/feature presentation, aggregate live status, 320px/200%-text reflow, >=48px important targets, keyboard/touch, reduced motion, opt-in audio. |
| Catalog / route / production release | planned | Governance-only metadata/workspace shell exists; playable catalog/lazy route remains intentionally unregistered until browser RED. Exact-revision full validation and Pages deployment are required. |
| Authenticated live-project persistence | blocked externally | Shared account-save architecture will be reused; real configured-project Firebase verification remains TASK-003. |

## Current handoff

**Implementation state:** implementing — CV-001 source hardened; canonical GREEN dependency/governance-gated  
**Last verified revision:** none — no Cascade Vault capability has yet passed the canonical full repository chain  
**Open game-local work:** repaired governance validation; refreshed dependency bot commit; CV-001 canonical GREEN; CV-002 paytable/weight audit and 10M acceptance run; CV-003 settled persistence; browser UI/audio; catalog/release validation  
**External blockers:** TASK-003 for real configured-project Firebase services only; it does not block game-local implementation or verification  
**Next action:** rerun dependency maintenance from request revision 8 after restoring the required PRD/todo schemas; require the remainder of `pnpm validate` plus the bot dependency commit, then rerun Pages validation before closing CV-001.

## Canonical verification blocker — 2026-10-19

- Pages run `39280095530` targeted exact revision `206f2a6aa0ab4a3b0c31aeb4f450b7bc2d83b820`; frozen install and `dependency:check` passed, then `dependency:current` failed before game checks due newer stable patches.
- Dependency maintenance run `39293588043` showed request revision 7 was stale.
- Request revision 8 carries React/React DOM `19.3.1`, Firebase CLI `15.34.0`, Playwright `1.64.1`, Vitest `5.0.5`, plus still-current direct pins.
- Maintenance run `39294812001` verified all request-revision-8 versions as npm latest. Its `pnpm validate` passed dependency-current, design lint and TypeScript, then `game:check` rejected only two Cascade governance structures introduced by the handoff rewrite: PRD `technical_foundation.dependencies_used` had been renamed, and todo lacked the exact top-level `Dependencies` label. Both required structures are restored with all evidence retained.
- No package/lockfile bot commit has yet landed because maintenance correctly requires the full validator to pass first.

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
- Average cascade depth must state its denominator; primary reporting will use total winning cascades across base+attached feature divided by paid-spin count, with engine-spin count available as a diagnostic.
- Any 50-cascade corruption-guard hit invalidates the candidate configuration/run; it may not be silently dropped from RTP statistics.
- The authoritative spec explicitly allows rebalancing distributions **and paytable**. Supporting mathematical/scratch evidence rules out treating the current paytable as fixed during CV-002.

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
