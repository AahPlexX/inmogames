# Cascade Vault tracker

**Last synchronized:** 2026-10-19  
**Spec:** `docs/specs/2026-10-10-cascade-vault-design.md`  
**Plan:** `docs/plans/2026-10-10-cascade-vault.md`

| Capability | Status | Verification |
| --- | --- | --- |
| Exact adjacent-ways / cascade engine | started | RED: revision `a52d99774c9384ad6a0b4c0ccfbf1c5e7cb51e9a`, run `38122640264`. Implementation revision `f71588d2ca0c96e685f54631c0afb6ded56ade84` passed independent strict TypeScript and reconstructed focused assertions after the fixture-only correction in `ae5a7e3630964d13efb23bb06c57dc582dbb2455`. A final-free-spin regression now requires completed Vault Runs to expose `nextVaultState: null`; canonical repository GREEN remains pending. |
| Exact payout precision | started | Fractional paytable is represented with integer centi-credit accounting (`CREDIT_SCALE = 100`) and exact rational ×1.5 feature boost; no whole-credit or binary floating-point rounding. |
| Reproducible 10M-spin probability audit | planned | Current symbol weights are provisional. CV-002 must report RTP, standard error, 95% CI, Vault Run entry frequency and average cascade depth; CI must intersect 94%-97%. |
| Settled durable checkpoints | planned | Schema-v1 post-spin/post-free-spin state only; `feature: null` after a completed final free spin; no partial cascade checkpoint; restore 5,000 preserves history/preferences. |
| Accessible board / Vault Run UI / audio | planned | Consolidated browser contract: deterministic cascade/feature presentation, aggregate live status, 320px/200%-text reflow, >=48px important targets, keyboard/touch, reduced motion, opt-in audio. |
| Catalog / route / production release | planned | Governance-only metadata/workspace shell exists; playable catalog/lazy route remains intentionally unregistered until browser RED. Exact-revision full validation and Pages deployment are required. |
| Authenticated live-project persistence | blocked externally | Shared account-save architecture will be reused; real configured-project Firebase verification remains TASK-003. |

## Current handoff

**Implementation state:** implementing — Task 1 engine hardened; canonical GREEN pending  
**Last verified revision:** none — no Cascade Vault capability has yet passed the canonical full repository chain  
**Open game-local work:** obtain canonical Task 1 GREEN; complete probability/balance audit; settled persistence; browser UI/audio; catalog/release validation  
**External blockers:** TASK-003 for real configured-project Firebase services only; it does not block game-local implementation or verification  
**Next action:** validate the terminal-feature-hardened Task 1 tree through TypeScript, game/document governance and unchanged focused/full unit tests. Then open CV-002 and CV-003 with independent REDs.

## Task 1 contract and evidence

- `symbols.ts`: symbol types, injected random-source adapter, initial/refill source tables. Refill excludes Scatter. Current weights are provisional until CV-002.
- `paytable.ts`: approved multipliers as integer hundredths, wager steps, exact centi-credit award calculation.
- `engine.ts`: immutable ways evaluation; combinatorial all-Wild interpretation deduplication; simultaneous removals; gravity/top refill; base ×1..×10; persistent Vault Run ×2..×20; meter once/free spin; one-time step-3 +3; +4 retrigger; remaining-spins cap 20; 50-cascade corruption guard.
- Completed Vault Run semantics: after all cascade/meter/retrigger awards for a free spin are applied, a resulting zero remaining spins is terminal. `resolveSpin.nextVaultState` is `null`, never an active object with `remainingSpins: 0`.
- Task 1 RED is exact revision `a52d99774c9384ad6a0b4c0ccfbf1c5e7cb51e9a` / run `38122640264`.
- The first independent GREEN reproduction found a fixture collision, not a production defect: pre-existing Copper on reel 4 extended the intended 3-reel second cascade to 4 reels. Revision `ae5a7e3630964d13efb23bb06c57dc582dbb2455` changes only that unrelated fixture cell to Silver, preserving the intended 400-unit/two-cascade assertions.
- A no-win final-free-spin regression now protects terminal `null` feature state so persistence/UI cannot serialize or render a pseudo-active zero-spin feature.

## Precision reconciliation

The approved design permits fractional virtual-credit awards. Runtime/accounting therefore uses integer centi-credit units (`100 = 1 displayed credit`); the ×1.5 feature modifier is an exact 3/2 factor. Simulation, persistence and UI must use the same contract.

## Continuity notes

- Work on `main`; use lease-protected fast-forwards and preserve unrelated work.
- Cascade Vault shares no gameplay engine/presentation with Royal Fortune or Lucky Seven; reuse only platform/test seams.
- Keep spec, plan, tracker, PRD, todo, GAME_INDEX and `.tasks` synchronized at every material integration.
- Do not register the playable route before its browser RED.
- Whole-game completion requires the 10M-spin acceptance gate, settled persistence, responsive/accessibility/audio browser evidence, exact full validation, both builds and successful Pages deployment.
