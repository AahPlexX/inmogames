# In progress

## PLATFORM-001: Firebase authentication and account saves
**Priority:** P0 | **Tags:** firebase, auth, firestore, persistence

Shared optional email/password Auth, isolated guest/account repositories, transactional migration, secured/tested rules and durable game checkpoints are repository-verified. Live configured-project completion remains TASK-003. GitHub Pages is canonical; emulator/account-save evidence must not be represented as live-project completion.

## GAME-MERGROVE-002: Progression expansion planning
**Priority:** P1 | **Tags:** mergrove, campaign, levels, power-ups, progression, achievements | **Status:** design approved; implementation separately gated

The approved v2 Mergrove scope remains documented and outside this Lucky Seven workstream.

## QUALITY-001: Device- and viewport-agnostic game UX contract
**Priority:** P0 | **Tags:** responsive, device-agnostic, viewport, accessibility, design-browser, quality | **Status:** design approved; separately gated

Repository-wide quality direction remains governed by its own specification. Lucky Seven meets the concrete browser quality bar; only its production release build remains open.

## GAME-LUCKY-SEVEN-001: Lucky Seven Classic production implementation
**Priority:** P1 | **Tags:** slots, classic, arcade, accessibility, persistence, probability, responsive | **Status:** implementing release verification

Authoritative design: `docs/specs/2026-10-10-lucky-seven-classic-design.md`. Plan: `docs/plans/2026-10-10-lucky-seven-classic.md`.

Verified layers:
- Engine/probability RED `1085f461f474f9d5ac1976a991d4f6079a9aae75` / run `38098884217`; GREEN `de1136d18390b1044eab16475fab5aee31b2c6f6` / run `38099279607`.
- Settled persistence RED `eb89b259c60a3a12c9a832db94ea21602035d1eb` / run `38099468454`; GREEN `a72d095e3569b056b211803335e6b6d401e048bb` / run `38099724416`, including Pages deployment.
- Consolidated UI/browser RED `66f0f7a54c7fad33f6ee4953ee6b5220e4e40f58` / run `38100222862`.
- Payline semantics repaired by `3e662d79645151e7e7fbc7eb666dd2fd273fbe9e` after run `38100732011` exposed the exact issue.
- Tree-identical run `38120980679` proved that repair and deterministic Gold-7 behavior, then exposed a test-locator ambiguity because valid paytable text duplicated the live result label.
- Selector-scope correction `3b3faa1a95a04752c813acbcb9e09b3112945ec6` / run `38121283719` passed dependency/current/design/typecheck/governance, 117 units, Firestore rules, shared account browser, the **entire Lucky Seven browser suite**, Mergrove, Cloudline and Hollowshift. Lucky's browser log confirms route/cabinet, RNG safety, deterministic settlement/reload, restore, 320px/200%-text reflow, 48px action, reduced motion and opt-in audio all passed.

Active release defect: the same run failed only after browser validation at `build:firebase`. LightningCSS reported `Unexpected token Delim('*')` for `.lsc*,.lsc*::before,.lsc*::after` in `lucky-seven-classic.css`. Root cause is the missing descendant combinator spaces; the verified repo pattern is `.rf *,.rf *::before,.rf *::after`. Current repair changes only the Lucky selectors to `.lsc *,.lsc *::before,.lsc *::after`.

Next: validate that one-line production CSS repair through the unchanged complete browser chain, `build:firebase`, standard build, artifact upload and Pages deployment. If green, perform one atomic verified-state closeout, move this task to DONE, validate the closeout commit, then proceed to Cascade Vault. TASK-003 remains solely the external live-Firebase blocker.
