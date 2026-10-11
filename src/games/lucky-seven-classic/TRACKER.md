# Lucky Seven Classic tracker

**Last synchronized:** 2026-10-10  
**Spec:** `docs/specs/2026-10-10-lucky-seven-classic-design.md`  
**Plan:** `docs/plans/2026-10-10-lucky-seven-classic.md`

| Capability | Status | Verification |
| --- | --- | --- |
| Exact 3-reel / 1-payline engine | started | RED: revision `1085f461f474f9d5ac1976a991d4f6079a9aae75`, run `38098884217`, failed because engine/reel modules were absent. Source implementation: `cec193e955e73834fcf5144703b35a8b411d8591`. Revision `47ec333f5d32c4d801b6e74b048aa09faf36b258` compiled successfully before history-sync correctly stopped the run. Focused unit green is still pending. |
| Exhaustive RTP / hit-frequency audit | started | Exact configured target is 94.775390625% RTP, 42.047119140625% paying-result frequency and 1/32,768 three-Gold-7 probability; source audit exists but unit green has not yet executed. |
| Schema-v1 settled persistence | planned | Not implemented yet. |
| Mechanical cabinet UI / audio | planned | Only an explicitly implementing placeholder workspace exists for governance; playable cabinet/audio are not claimed. |
| Responsive / keyboard / reduced-motion browser regression | planned | Not implemented yet. |
| Catalog / route / Pages release | planned | GAME_INDEX implementing row exists; catalog/workspace routing and release evidence remain open. |
| Authenticated live-project persistence | blocked externally | Shared account-save architecture will be reused; real configured-project verification remains under TASK-003. |

## Current handoff

**Implementation state:** implementing — engine TDD in progress; source compiles but focused unit green is not yet recorded  
**Last verified revision:** none — Lucky Seven Classic is not yet a verified game  
**Open game-local work:** complete paired spec/tracker sync and obtain engine unit green; then persistence; cabinet UI/audio; browser regressions; catalog/routing; full validation; exact-revision Pages evidence  
**External blockers:** TASK-003 for real configured-project Firebase services only; it does not block guest/local game completion  
**Next action:** run the synchronized history integration so `game:check` can pass and the existing focused engine test reaches Vitest; fix production only if an engine assertion fails, then record green evidence before opening persistence TDD.

## Evidence ledger

- `1085f461f474f9d5ac1976a991d4f6079a9aae75` / run `38098884217`: recorded RED. Dependency freshness/design lint passed; TypeScript failed on intentionally absent Lucky Seven engine/reel imports.
- `cec193e955e73834fcf5144703b35a8b411d8591`: pure engine/reel/paytable implementation.
- `47ec333f5d32c4d801b6e74b048aa09faf36b258` / run `38099168522`: dependency freshness, design lint, TypeScript and static `game-check: 6 game(s) OK` passed. History-aware doc sync correctly failed because spec and tracker were not both updated inside that push. Unit tests were skipped, so this is not engine-green evidence.

## Continuity notes

- Work on `main`; preserve unrelated concurrent work and use lease-protected fast-forwards.
- Do not share gameplay logic with Royal Fortune Slots or Cascade Vault.
- The v1 paytable, reel frequencies, precedence and theoretical math in the authoritative spec are binding and cannot drift silently.
- Use lean behavior-focused TDD: prove distinct contracts without duplicating shared platform tests or reimplementing production algorithms inside tests.
- Keep this tracker, PRD, todo, GAME_INDEX, authoritative spec and `.tasks` synchronized whenever implementation status materially changes.
- Do not claim completion until the exact functional revision passes the full repository validation chain and GitHub Pages deployment. TASK-003 may remain explicitly external.
