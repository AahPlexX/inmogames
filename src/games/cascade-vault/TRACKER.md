# Cascade Vault tracker

**Last synchronized:** 2026-10-11  
**Spec:** `docs/specs/2026-10-10-cascade-vault-design.md`  
**Plan:** `docs/plans/2026-10-10-cascade-vault.md`

| Capability | Status | Verification |
| --- | --- | --- |
| Exact adjacent-ways / cascade engine | started | Task 1 focused unit contract is being added before engine modules exist. Intended RED: missing `symbols.ts` / `paytable.ts` / `engine.ts` after governance passes. |
| Exact payout precision | started | Approved fractional paytable is reconciled to integer centi-credit runtime accounting: 100 internal units = 1 virtual credit; the ×1.5 feature modifier therefore remains exact without floating-point rounding drift. Focused engine tests bind this contract. |
| Reproducible 10M-spin probability audit | planned | Must report RTP, standard error, 95% CI, Vault Run entry frequency and average cascade depth; verification requires the CI to intersect 94%-97%. |
| Settled durable checkpoints | planned | Schema-v1 post-spin/post-free-spin state only; no partial cascade checkpoint; restore 5,000 preserves history/preferences. |
| Accessible board / Vault Run UI / audio | planned | One consolidated browser contract will cover deterministic cascade/feature presentation, aggregate live status, 320px/200%-text reflow, >=48px important targets, keyboard/touch, reduced motion and opt-in audio. |
| Catalog / route / production release | planned | Metadata shell exists for governance only; playable catalog/lazy route intentionally remains unregistered until its browser RED phase. Final exact-revision full validation and Pages deployment are required. |
| Authenticated live-project persistence | blocked externally | Shared account-save architecture will be reused; real configured-project Firebase verification remains TASK-003. |

## Current handoff

**Implementation state:** implementing — approved design/plan; Task 1 ways/cascade engine TDD RED opening  
**Last verified revision:** none — no Cascade Vault gameplay capability has reached GREEN yet  
**Open game-local work:** establish Task 1 RED; implement exact ways/gravity/refill/cascade/Vault Run engine; then probability audit, persistence, consolidated browser UI/audio, catalog/release validation  
**External blockers:** TASK-003 for real configured-project Firebase services only; it does not block game-local implementation or verification  
**Next action:** integrate the focused Task 1 engine test plus this implementing governance shell on `main`, verify the intended missing-module RED, then add only `symbols.ts`, `paytable.ts`, and `engine.ts` required to satisfy that fixed contract.

## Precision reconciliation

The approved design formula and paytable permit fractional virtual-credit awards; for example wager 10 × Copper 0.15 = 1.5 credits, and Vault Run step 2 can produce quarter-credit results after ×1.5. The implementation plan's earlier phrase "integer-credit award" is therefore interpreted as **integer accounting units**, not whole displayed credits. Runtime engine/accounting uses centi-credit integers, with `CREDIT_SCALE = 100`; user-visible values are units ÷ 100. This preserves the approved math exactly and is authoritative for downstream simulation/persistence/UI work.

## Continuity notes

- Work on `main`; preserve unrelated concurrent work with lease-protected fast-forwards.
- Cascade Vault shares no gameplay engine or presentation with Royal Fortune Slots or Lucky Seven Classic; reuse only repository platform/test seams.
- Keep spec, plan, tracker, PRD, todo, GAME_INDEX and `.tasks` synchronized at every material integration.
- Do not register the playable route merely to satisfy structure; the browser RED must still prove the route/workspace integration when Task 4/5 opens.
- Whole-game completion requires exact functional revision validation, the 10M-spin probability acceptance gate, both production builds and successful Pages deployment.
