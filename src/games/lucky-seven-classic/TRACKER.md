# Lucky Seven Classic tracker

**Last synchronized:** 2026-10-10  
**Spec:** `docs/specs/2026-10-10-lucky-seven-classic-design.md`  
**Plan:** `docs/plans/2026-10-10-lucky-seven-classic.md`

| Capability | Status | Verification |
| --- | --- | --- |
| Exact 3-reel / 1-payline engine | verified | RED revision `1085f461f474f9d5ac1976a991d4f6079a9aae75` / run `38098884217`; GREEN revision `de1136d18390b1044eab16475fab5aee31b2c6f6` / run `38099279607`. |
| Exhaustive RTP / hit-frequency audit | verified | GREEN unit step on `de1136d18390b1044eab16475fab5aee31b2c6f6` derives 94.775390625% RTP, 42.047119140625% paying-result frequency and 1/32,768 three-Gold-7 probability from source-controlled strips/paytable. |
| Schema-v1 settled persistence | started | RED revision `eb89b259c60a3a12c9a832db94ea21602035d1eb` / run `38099468454` passed dependency/current/design gates then failed TypeScript only because `storage.ts` and `persistence.ts` were intentionally absent. Production decoder/save-definition/atomic-settlement/restore implementation is now present and awaits GREEN evidence. |
| Mechanical cabinet UI / audio | planned | Placeholder workspace remains non-playable and is not routed; no cabinet/audio claim yet. |
| Responsive / keyboard / reduced-motion browser regression | planned | Not implemented yet. |
| Catalog / route / Pages release | planned | GAME_INDEX implementing row exists; playable catalog/workspace routing and final release evidence remain open. |
| Authenticated live-project persistence | blocked externally | Shared account-save architecture will be reused; real configured-project verification remains under TASK-003. |

## Current handoff

**Implementation state:** implementing — engine/probability verified; persistence production implementation awaiting GREEN  
**Last verified revision:** engine capability `de1136d18390b1044eab16475fab5aee31b2c6f6` / run `38099279607`; whole game is not verified  
**Open game-local work:** obtain persistence GREEN; build cabinet UI/audio; add dedicated browser/responsive regression; catalog/routing; full validation; exact-revision Pages evidence  
**External blockers:** TASK-003 for real configured-project Firebase services only; it does not block guest/local game completion  
**Next action:** run the unchanged persistence assertions against the newly added `storage.ts`/`persistence.ts`; fix production only if a contract assertion fails, then record exact GREEN evidence before opening UI work.

## Evidence ledger

- `1085f461f474f9d5ac1976a991d4f6079a9aae75` / run `38098884217`: engine RED on intentionally missing modules.
- `cec193e955e73834fcf5144703b35a8b411d8591`: pure reel/paytable/engine implementation.
- `47ec333f5d32c4d801b6e74b048aa09faf36b258` / run `38099168522`: source compiled/static game structure passed; history sync correctly detected split evidence.
- `de1136d18390b1044eab16475fab5aee31b2c6f6` / run `38099279607`: synchronized game-check, full unit suite, builds and Pages succeeded; engine/probability GREEN.
- `eb89b259c60a3a12c9a832db94ea21602035d1eb` / run `38099468454`: persistence RED; exact missing `persistence.ts` and `storage.ts` TypeScript errors after dependency/current/design passed.

## Continuity notes

- Work on `main`; preserve unrelated concurrent work with lease-protected fast-forwards.
- Do not share gameplay logic with Royal Fortune Slots or Cascade Vault.
- The v1 paytable/reel frequencies/precedence/theoretical math and schema-v1 persistence contract in the authoritative spec are binding.
- Use lean behavior-focused TDD: prove each distinct contract once and reuse existing shared-platform tests rather than cloning them.
- Keep tracker, PRD, todo, GAME_INDEX, authoritative spec and `.tasks` synchronized whenever implementation state materially changes.
- Do not claim whole-game completion until the exact functional revision passes full repository validation and Pages deployment. TASK-003 may remain explicitly external.
