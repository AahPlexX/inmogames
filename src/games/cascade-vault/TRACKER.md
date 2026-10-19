# Cascade Vault tracker

**Last synchronized:** 2026-10-19  
**Spec:** `docs/specs/2026-10-10-cascade-vault-design.md`  
**Plan:** `docs/plans/2026-10-10-cascade-vault.md`

| Capability | Status | Verification |
| --- | --- | --- |
| Exact adjacent-ways / cascade engine | started | RED is recorded on revision `a52d99774c9384ad6a0b4c0ccfbf1c5e7cb51e9a`, run `38122640264`: TypeScript failed only because `symbols.ts`, `paytable.ts`, and `engine.ts` did not exist. Engine implementation revision `f71588d2ca0c96e685f54631c0afb6ded56ade84` then passed an independent strict TypeScript check plus a no-framework reproduction of the focused assertions after correcting one fixture-only collision; canonical repository GREEN remains pending. |
| Exact payout precision | started | Approved fractional paytable is implemented with integer centi-credit accounting (`CREDIT_SCALE = 100`) and rational ×1.5 feature boost. Independent harness assertions for Quartz, Copper, Vault Crown and boosted awards pass; canonical GREEN remains pending. |
| Reproducible 10M-spin probability audit | planned | Source weights are explicitly provisional until Task CV-002 reports RTP, standard error, 95% CI, Vault Run entry frequency and average cascade depth; verification requires the CI to intersect 94%-97%. |
| Settled durable checkpoints | planned | Schema-v1 post-spin/post-free-spin state only; no partial cascade checkpoint; restore 5,000 preserves history/preferences. |
| Accessible board / Vault Run UI / audio | planned | One consolidated browser contract will cover deterministic cascade/feature presentation, aggregate live status, 320px/200%-text reflow, >=48px important targets, keyboard/touch, reduced motion and opt-in audio. |
| Catalog / route / production release | planned | Metadata shell exists for governance only; playable catalog/lazy route intentionally remains unregistered until its browser RED phase. Final exact-revision full validation and Pages deployment are required. |
| Authenticated live-project persistence | blocked externally | Shared account-save architecture will be reused; real configured-project Firebase verification remains TASK-003. |

## Current handoff

**Implementation state:** implementing — Task 1 RED evidenced; engine implementation locally reproduced; canonical GREEN pending  
**Last verified revision:** none — no Cascade Vault capability has yet passed the repository's canonical full verification chain  
**Open game-local work:** obtain canonical Task 1 GREEN; complete probability/balance audit; settled persistence; consolidated browser UI/audio; catalog/release validation  
**External blockers:** TASK-003 for real configured-project Firebase services only; it does not block game-local implementation or verification  
**Next action:** validate the fixture-corrected Task 1 tree with repository TypeScript/governance/unit checks when canonical Actions execution is available. Do not weaken the deterministic 400-unit two-cascade assertion. After Task 1 GREEN, open CV-002 and CV-003 with separate TDD REDs.

## Task 1 implementation notes

- `symbols.ts` owns symbol types plus source-controlled initial/refill weight tables and an injected weighted draw adapter. Current weights are provisional and explicitly non-verified until CV-002.
- `paytable.ts` stores all approved multipliers as integer hundredths, supported wager steps, and exact centi-credit award calculation.
- `engine.ts` keeps immutable-board evaluation separate from removal/refill mutation, deduplicates only genuinely duplicate all-Wild interpretations combinatorially instead of enumerating every concrete way, and enforces the 50-cascade guard.
- Scatter generation is legal only on the initial board; a refill source returning Scatter is rejected rather than silently mutating the documented probability model.
- Base multipliers reset to ×1 and cap ×10. Vault Run consumes the incoming persistent multiplier, carries winning-cascade growth up to ×20, advances the meter at most once/free spin, awards step 3 once, and caps post-award remaining spins at 20.

## Fixture correction evidence

The first independent GREEN reproduction exposed a fixture defect rather than a production defect. `singleQuartzBoard` contained Copper on reel 4 while the queued first refill places Copper on reels 1-3. The engine correctly evaluated that as a 4-reel Copper way: first cascade 100 units + second cascade 600 units = 700, with seven refill draws. The test's documented intent is a 3-reel second cascade totaling 400 units with six refill draws. The unrelated reel-4 fixture cell is therefore changed from Copper to Silver; the payout, multiplier, symbol and draw-count assertions remain unchanged. With that fixture-only correction, strict TypeScript and the independently reconstructed Task 1 behavior harness pass.

## Precision reconciliation

The approved design formula and paytable permit fractional virtual-credit awards; for example wager 10 × Copper 0.15 = 1.5 credits, and Vault Run step 2 can produce quarter-credit values after ×1.5. Runtime engine/accounting therefore uses centi-credit integers, with `CREDIT_SCALE = 100`; user-visible values are units ÷ 100. This preserves the approved math exactly and is authoritative for downstream simulation/persistence/UI work.

## Continuity notes

- Work on `main`; preserve unrelated concurrent work with lease-protected fast-forwards.
- Cascade Vault shares no gameplay engine or presentation with Royal Fortune Slots or Lucky Seven Classic; reuse only repository platform/test seams.
- Keep spec, plan, tracker, PRD, todo, GAME_INDEX and `.tasks` synchronized at every material integration.
- Do not register the playable route merely to satisfy structure; the browser RED must still prove route/workspace integration when Task 4/5 opens.
- Whole-game completion requires exact functional revision validation, the 10M-spin probability acceptance gate, both production builds and successful Pages deployment.
