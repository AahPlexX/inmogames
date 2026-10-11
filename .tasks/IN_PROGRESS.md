# In progress

## PLATFORM-001: Firebase authentication and account saves
**Priority:** P0 | **Tags:** firebase, auth, firestore, persistence

Shared optional email/password Auth, isolated guest/account repositories, transactional migration, secured/tested rules and durable game checkpoints are repository-verified. Live configured-project completion remains TASK-003. GitHub Pages is canonical; emulator/account-save evidence must not be represented as live-project completion.

## GAME-MERGROVE-002: Progression expansion planning
**Priority:** P1 | **Tags:** mergrove, campaign, levels, power-ups, progression, achievements | **Status:** design approved; implementation separately gated

The approved v2 Mergrove scope remains documented and outside this Lucky Seven workstream.

## QUALITY-001: Device- and viewport-agnostic game UX contract
**Priority:** P0 | **Tags:** responsive, device-agnostic, viewport, accessibility, design-browser, quality | **Status:** design approved; separately gated

Repository-wide quality direction remains governed by its own specification. Lucky Seven still must meet the same concrete 320px/200%-text/keyboard/touch/reduced-motion quality bar through its game-local workflow.

## GAME-LUCKY-SEVEN-001: Lucky Seven Classic production implementation
**Priority:** P1 | **Tags:** slots, classic, arcade, accessibility, persistence, probability, responsive | **Status:** implementing

Authoritative design: `docs/specs/2026-10-10-lucky-seven-classic-design.md`. Plan: `docs/plans/2026-10-10-lucky-seven-classic.md`.

Verified layers:
- Engine/probability RED `1085f461f474f9d5ac1976a991d4f6079a9aae75` / run `38098884217`; GREEN `de1136d18390b1044eab16475fab5aee31b2c6f6` / run `38099279607`.
- Settled persistence RED `eb89b259c60a3a12c9a832db94ea21602035d1eb` / run `38099468454`; GREEN `a72d095e3569b056b211803335e6b6d401e048bb` / run `38099724416`, including Pages deployment.
- Consolidated UI/browser RED `66f0f7a54c7fad33f6ee4953ee6b5220e4e40f58` / run `38100222862`: dependency/design/typecheck/governance, 117 units, rules/shared browser and all earlier design suites passed; Lucky Seven failed exactly waiting for missing `.lsc`.

Cabinet progression is evidence-backed rather than speculative:
- Descendant run `38100732011` exercised the first cabinet candidate and exposed one product semantic defect: the visible payline container text was `◆ Center payline ◆`. Production repair `3e662d79645151e7e7fbc7eb666dd2fd273fbe9e` makes `Center payline` its own visible span while keeping the decorative diamonds `aria-hidden`.
- Tree-identical revision `8cf51f00d14fdf0e2902600719017aff095837a3` / run `38120980679` proved that payline repair, RNG-failure safety, 48px/320px entry checks and the deterministic keyboard Gold-7 settlement. The live status correctly rendered `3 Gold 7s · Returned 500 virtual credits...`. The run then stopped only because the broad Playwright text locator also matched the intentionally visible paytable's `3 Gold 7s` row. That is a harness selector defect, not a product behavior defect.

Current correction scopes Gold-7 and Red-7 outcome waits to the existing `.lsc-status` live-result region. Expected strings, bankroll math, keyboard operation, paytable visibility, audio checks, persistence/reload, reduced-motion and responsive assertions are unchanged.

Next: rerun the consolidated browser contract. If it exposes another genuine behavior defect, repair production at that exact seam. When the suite, both builds and Pages deployment are green on one exact revision, record that evidence atomically, move Lucky Seven to DONE/verified, and proceed to Cascade Vault. TASK-003 remains solely the external live-Firebase blocker.
