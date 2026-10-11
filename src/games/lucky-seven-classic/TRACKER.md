# Lucky Seven Classic tracker

**Last synchronized:** 2026-10-11  
**Spec:** `docs/specs/2026-10-10-lucky-seven-classic-design.md`  
**Plan:** `docs/plans/2026-10-10-lucky-seven-classic.md`

| Capability | Status | Verification |
| --- | --- | --- |
| Exact 3-reel / 1-payline engine | verified | RED `1085f461f474f9d5ac1976a991d4f6079a9aae75` / run `38098884217`; GREEN `de1136d18390b1044eab16475fab5aee31b2c6f6` / run `38099279607`. |
| Exhaustive RTP / hit-frequency audit | verified | GREEN unit evidence derives 94.775390625% RTP, 42.047119140625% paying-result frequency and 1/32,768 three-Gold-7 probability. |
| Schema-v1 settled persistence | verified | RED `eb89b259c60a3a12c9a832db94ea21602035d1eb` / run `38099468454`; GREEN `a72d095e3569b056b211803335e6b6d401e048bb` / run `38099724416`, including Pages deployment. |
| Mechanical cabinet UI / audio | verified | UI RED `66f0f7a54c7fad33f6ee4953ee6b5220e4e40f58` / run `38100222862`; payline semantic defect exposed in `38100732011` and repaired by `3e662d79645151e7e7fbc7eb666dd2fd273fbe9e`; selector-only harness ambiguity exposed by `38120980679`; corrected contract passed fully on `3b3faa1a95a04752c813acbcb9e09b3112945ec6` / run `38121283719`, including RNG safety, deterministic keyboard settlement/reload, restore and opt-in audio. |
| Responsive / keyboard / reduced-motion browser regression | verified | Run `38121283719` passed the complete Lucky browser contract: 320px/200%-text no-overflow, >=48px primary action, keyboard spin, reduced motion, reload/restore and audio. |
| Catalog / route / production release | started | Catalog/lazy route and browser validation are green. Run `38121283719` then failed at `build:firebase` because `lucky-seven-classic.css` used invalid `.lsc*` selectors. LightningCSS reported `Unexpected token Delim('*')`. Working repo pattern uses scoped descendants such as `.rf *`; current repair changes only `.lsc*,.lsc*::before,.lsc*::after` to `.lsc *,.lsc *::before,.lsc *::after`. Production builds and Pages remain to be reverified. |
| Authenticated live-project persistence | blocked externally | Shared account-save architecture is reused; real configured-project verification remains TASK-003. |

## Current handoff

**Implementation state:** implementing — all game behavior/browser gates verified; one production CSS selector syntax repair awaiting full build/Pages GREEN  
**Last verified revision:** behavior/browser capability `3b3faa1a95a04752c813acbcb9e09b3112945ec6` / run `38121283719`; whole game is not yet release-verified because `build:firebase` failed afterward  
**Open game-local work:** validate the scoped descendant CSS repair through both production builds and Pages; then atomically close docs/tasks as verified  
**External blockers:** TASK-003 for real configured-project Firebase services only; it does not block game-local completion  
**Next action:** run the canonical workflow against the one-line CSS-selector correction. Do not alter browser assertions or unrelated production code unless fresh evidence identifies another defect.

## Evidence ledger

- Engine RED: `1085f461f474f9d5ac1976a991d4f6079a9aae75` / `38098884217`.
- Engine GREEN: `de1136d18390b1044eab16475fab5aee31b2c6f6` / `38099279607`.
- Persistence RED: `eb89b259c60a3a12c9a832db94ea21602035d1eb` / `38099468454`.
- Persistence GREEN: `a72d095e3569b056b211803335e6b6d401e048bb` / `38099724416`.
- Early history-sync diagnostics: `a8da91b63a5e43fc049def1ab869659fbeb4f57f` / `38099964934`; `1074ad595271b5c60c0e83632dd9bde86726bead` / `38100085348`.
- UI/browser RED: `66f0f7a54c7fad33f6ee4953ee6b5220e4e40f58` / `38100222862` — failed exactly on missing `.lsc` after all preceding layers passed.
- First cabinet candidate source `ab6651d6788371b15b0164fe5c3f04c65095ea41`; descendant run `38100732011` exposed standalone payline-label semantics and drove production repair `3e662d79645151e7e7fbc7eb666dd2fd273fbe9e`.
- Tree-identical `8cf51f00d14fdf0e2902600719017aff095837a3` / `38120980679` proved the payline repair, RNG safety and Gold-7 settlement, then exposed harness-only duplicate-text ambiguity.
- Selector-scope correction `3b3faa1a95a04752c813acbcb9e09b3112945ec6` / `38121283719`: dependency/current/design/typecheck/governance, 117 units, Firestore rules, shared account browser, **the complete Lucky browser suite**, Mergrove, Cloudline and Hollowshift all passed. The run stopped afterward at `build:firebase` because LightningCSS rejected `.lsc*` at line 2 of `lucky-seven-classic.css`.

## Continuity notes

- Work on `main`; preserve unrelated concurrent work with lease-protected fast-forwards.
- Gameplay stays independent from Royal Fortune Slots and Cascade Vault; reuse shared platform/test seams only.
- Lean full-coverage TDD: production build failure itself is the exact red test for the CSS syntax seam; do not add a duplicate test solely to restate the compiler error.
- Keep spec, tracker, PRD, todo, GAME_INDEX and `.tasks` synchronized at each material integration.
- Whole-game completion requires one exact functional revision with full workflow + Pages success; TASK-003 may remain externally blocked.
