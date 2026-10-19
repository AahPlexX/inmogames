# Cascade Vault tracker

**Last synchronized:** 2026-10-19  
**Spec:** `docs/specs/2026-10-10-cascade-vault-design.md`  
**Plan:** `docs/plans/2026-10-10-cascade-vault.md`

| Capability | Status | Verification |
| --- | --- | --- |
| Exact adjacent-ways / cascade engine | started | RED is recorded on revision `a52d99774c9384ad6a0b4c0ccfbf1c5e7cb51e9a`, run `38122640264`: TypeScript failed only because `symbols.ts`, `paytable.ts`, and `engine.ts` did not exist. The three pure modules now implement the fixed contract; GREEN is pending on the integration revision and is not yet claimed. |
| Exact payout precision | started | Approved fractional paytable is implemented with integer centi-credit accounting (`CREDIT_SCALE = 100`) and rational ×1.5 feature boost, avoiding floating-point payout drift. Focused GREEN remains pending. |
| Reproducible 10M-spin probability audit | planned | Source weights are explicitly provisional until Task CV-002 reports RTP, standard error, 95% CI, Vault Run entry frequency and average cascade depth; verification requires the CI to intersect 94%-97%. |
| Settled durable checkpoints | planned | Schema-v1 post-spin/post-free-spin state only; no partial cascade checkpoint; restore 5,000 preserves history/preferences. |
| Accessible board / Vault Run UI / audio | planned | One consolidated browser contract will cover deterministic cascade/feature presentation, aggregate live status, 320px/200%-text reflow, >=48px important targets, keyboard/touch, reduced motion and opt-in audio. |
| Catalog / route / production release | planned | Metadata shell exists for governance only; playable catalog/lazy route intentionally remains unregistered until its browser RED phase. Final exact-revision full validation and Pages deployment are required. |
| Authenticated live-project persistence | blocked externally | Shared account-save architecture will be reused; real configured-project Firebase verification remains TASK-003. |

## Current handoff

**Implementation state:** implementing — Task 1 RED evidenced; pure engine GREEN implementation integrated for verification  
**Last verified revision:** none — Task 1 GREEN has not yet been evidenced on the implementation revision  
**Open game-local work:** verify Task 1 focused/full unit GREEN; complete probability/balance audit; settled persistence; consolidated browser UI/audio; catalog/release validation  
**External blockers:** TASK-003 for real configured-project Firebase services only; it does not block game-local implementation or verification  
**Next action:** run the canonical workflow on the integration revision. Require TypeScript, governance and the unchanged `tests/unit/cascade-vault-engine.test.ts` contract to pass before opening Task CV-002. If Task 1 fails, fix only the evidenced engine defect and keep downstream work closed.

## Task 1 implementation notes

- `symbols.ts` owns symbol types plus source-controlled initial/refill weight tables and an injected weighted draw adapter. Current weights are provisional and explicitly non-verified until CV-002.
- `paytable.ts` stores all approved multipliers as integer hundredths, supported wager steps, and exact centi-credit award calculation.
- `engine.ts` keeps immutable-board evaluation separate from removal/refill mutation, deduplicates only genuinely duplicate all-Wild interpretations combinatorially instead of enumerating every concrete way, and enforces the 50-cascade guard.
- Scatter generation is legal only on the initial board; a refill source returning Scatter is rejected rather than silently mutating the documented probability model.
- Base multipliers reset to ×1 and cap ×10. Vault Run consumes the incoming persistent multiplier, carries winning-cascade growth up to ×20, advances the meter at most once/free spin, awards step 3 once, and caps post-award remaining spins at 20.

## Precision reconciliation

The approved design formula and paytable permit fractional virtual-credit awards; for example wager 10 × Copper 0.15 = 1.5 credits, and Vault Run step 2 can produce quarter-credit values after ×1.5. Runtime engine/accounting therefore uses centi-credit integers, with `CREDIT_SCALE = 100`; user-visible values are units ÷ 100. This preserves the approved math exactly and is authoritative for downstream simulation/persistence/UI work.

## Continuity notes

- Work on `main`; preserve unrelated concurrent work with lease-protected fast-forwards.
- Cascade Vault shares no gameplay engine or presentation with Royal Fortune Slots or Lucky Seven Classic; reuse only repository platform/test seams.
- Keep spec, plan, tracker, PRD, todo, GAME_INDEX and `.tasks` synchronized at every material integration.
- Do not register the playable route merely to satisfy structure; the browser RED must still prove route/workspace integration when Task 4/5 opens.
- Whole-game completion requires exact functional revision validation, the 10M-spin probability acceptance gate, both production builds and successful Pages deployment.
