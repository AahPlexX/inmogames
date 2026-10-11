# Lucky Seven Classic tracker

**Last synchronized:** 2026-10-10  
**Spec:** `docs/specs/2026-10-10-lucky-seven-classic-design.md`  
**Plan:** `docs/plans/2026-10-10-lucky-seven-classic.md`

| Capability | Status | Verification |
| --- | --- | --- |
| Exact 3-reel / 1-payline engine | verified | RED revision `1085f461f474f9d5ac1976a991d4f6079a9aae75` / run `38098884217`; GREEN unit step on synchronized revision `de1136d18390b1044eab16475fab5aee31b2c6f6` / run `38099279607`. |
| Exhaustive RTP / hit-frequency audit | verified | Same GREEN unit step derives 94.775390625% RTP, 42.047119140625% paying-result frequency and 1/32,768 Gold-7 probability from source-controlled strips/paytable. |
| Schema-v1 settled persistence | started | Focused persistence RED is being introduced in the current synchronized integration before `storage.ts`/`persistence.ts` exist. Contract covers decode, atomic settlement, insufficient bankroll and restore-to-500 behavior without duplicating shared repository tests. |
| Mechanical cabinet UI / audio | planned | Only an explicitly implementing placeholder workspace exists for governance; playable cabinet/audio are not claimed. |
| Responsive / keyboard / reduced-motion browser regression | planned | Not implemented yet. |
| Catalog / route / Pages release | planned | GAME_INDEX implementing row exists; catalog/workspace routing and release evidence remain open. |
| Authenticated live-project persistence | blocked externally | Shared account-save architecture will be reused; real configured-project verification remains under TASK-003. |

## Current handoff

**Implementation state:** implementing — engine/probability green; persistence TDD opening  
**Last verified revision:** engine capability `de1136d18390b1044eab16475fab5aee31b2c6f6` / run `38099279607`; whole game is not verified  
**Open game-local work:** persistence RED→GREEN; cabinet UI/audio; browser regressions; catalog/routing; full validation; exact-revision Pages evidence  
**External blockers:** TASK-003 for real configured-project Firebase services only; it does not block guest/local game completion  
**Next action:** observe persistence RED from the current test-only integration, implement the minimum schema/settlement/restore behavior without weakening assertions, then synchronize the resulting GREEN evidence before opening UI work.

## Evidence ledger

- `1085f461f474f9d5ac1976a991d4f6079a9aae75` / `38098884217`: engine RED, missing production modules.
- `cec193e955e73834fcf5144703b35a8b411d8591`: pure engine/reel/paytable production implementation.
- `47ec333f5d32c4d801b6e74b048aa09faf36b258` / `38099168522`: source compiled/static game structure passed; history sync correctly detected split spec/tracker evidence.
- `de1136d18390b1044eab16475fab5aee31b2c6f6` / `38099279607`: synchronized `game:check` and unit-test step passed, establishing engine/probability GREEN.

## Continuity notes

- Work on `main`; preserve unrelated concurrent work with lease-protected fast-forwards.
- Do not share gameplay logic with Royal Fortune Slots or Cascade Vault.
- The v1 paytable/reel frequencies/precedence/theoretical math and schema-v1 persistence contract in the authoritative spec are binding.
- Use lean behavior-focused TDD: prove each distinct contract once; reuse existing platform tests instead of cloning them.
- Keep tracker, PRD, todo, GAME_INDEX, spec and `.tasks` synchronized whenever implementation state changes.
- Do not claim whole-game completion until the exact functional revision passes full repository validation and Pages deployment. TASK-003 may remain explicitly external.
