# Lucky Seven Classic tracker

**Last synchronized:** 2026-10-10  
**Spec:** `docs/specs/2026-10-10-lucky-seven-classic-design.md`  
**Plan:** `docs/plans/2026-10-10-lucky-seven-classic.md`

| Capability | Status | Verification |
| --- | --- | --- |
| Exact 3-reel / 1-payline engine | verified | RED `1085f461f474f9d5ac1976a991d4f6079a9aae75` / run `38098884217`; GREEN `de1136d18390b1044eab16475fab5aee31b2c6f6` / run `38099279607`. |
| Exhaustive RTP / hit-frequency audit | verified | GREEN unit step on `de1136d18390b1044eab16475fab5aee31b2c6f6` derives 94.775390625% RTP, 42.047119140625% paying-result frequency and 1/32,768 three-Gold-7 probability. |
| Schema-v1 settled persistence | verified | RED `eb89b259c60a3a12c9a832db94ea21602035d1eb` / run `38099468454` failed only on intentionally absent persistence modules. GREEN functional revision `a72d095e3569b056b211803335e6b6d401e048bb` / run `38099724416` passed typecheck, game-check, the full unit suite, rules/account browser checks, existing design-browser suites and both builds. |
| Mechanical cabinet UI / audio | started | One consolidated browser RED is being introduced before catalog/workspace routing and the playable cabinet exist. Contract covers actual machine geometry, deterministic/RNG-failure spin behavior, keyboard, opt-in audio, reload/restore and reduced motion. |
| Responsive / keyboard / reduced-motion browser regression | started | Same consolidated browser RED requires 320px no-overflow, 200% text reflow, >=48px primary action and reduced-motion suppression. |
| Catalog / route / Pages release | started | Browser RED is wired into `test:design-browser`; current catalog/workspace registry intentionally still omits Lucky Seven so the new test proves the missing playable integration before production UI work. |
| Authenticated live-project persistence | blocked externally | Shared account-save architecture is reused; real configured-project verification remains under TASK-003. |

## Current handoff

**Implementation state:** implementing — engine/probability and settled persistence verified; consolidated UI/browser TDD opening  
**Last verified revision:** persistence capability `a72d095e3569b056b211803335e6b6d401e048bb` / run `38099724416`; whole game is not verified  
**Open game-local work:** observe UI/browser RED; implement cabinet/audio/catalog/workspace integration; make browser contract green; run exact-revision full validation/Pages; close out docs/tasks  
**External blockers:** TASK-003 for real configured-project Firebase services only; it does not block game-local completion  
**Next action:** run the new `tests/browser/lucky-seven-classic.mjs` from the repository design-browser chain while the route is still absent, record that deliberate RED, then implement only the production UI/integration required by the consolidated contract.

## Evidence ledger

- Engine RED: `1085f461f474f9d5ac1976a991d4f6079a9aae75` / `38098884217`.
- Engine GREEN: `de1136d18390b1044eab16475fab5aee31b2c6f6` / `38099279607`.
- Persistence RED: `eb89b259c60a3a12c9a832db94ea21602035d1eb` / `38099468454`.
- Persistence GREEN: `a72d095e3569b056b211803335e6b6d401e048bb` / `38099724416`; full build job green, Pages deploy was still completing when UI RED was opened.

## Continuity notes

- Work on `main`; preserve unrelated concurrent work using lease-protected fast-forwards.
- Gameplay code stays independent from Royal Fortune Slots and Cascade Vault; shared platform/test seams may be reused.
- Use lean full-coverage TDD: one consolidated browser suite rather than duplicate accessibility/audio/mobile suites.
- Keep spec, tracker, PRD, todo, GAME_INDEX and `.tasks` synchronized at each material integration.
- Whole-game completion requires exact functional revision validation plus successful Pages deployment; TASK-003 may remain externally blocked.
