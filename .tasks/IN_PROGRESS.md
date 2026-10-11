# In progress

## PLATFORM-001: Firebase authentication and account saves
**Priority:** P0 | **Tags:** firebase, auth, firestore, persistence

Shared optional email/password Auth, isolated guest/account repositories, transactional migration, secured/tested rules and durable game checkpoints are repository-verified. Live configured-project completion remains TASK-003. GitHub Pages is canonical; emulator/account-save evidence must not be represented as live-project completion.

Lucky Seven Classic is game-locally verified on exact functional revision `04ae049259232edf9ec5af4aa63d4786d8673ba4` / run `38121766726`; its remaining live-Firebase concern is only this shared external TASK-003 platform blocker.

## GAME-CASCADE-VAULT-001: Cascade Vault production implementation
**Priority:** P1 | **Tags:** arcade, ways, cascades, probability, accessibility, persistence | **Status:** implementing — Task 1 engine TDD RED opening

Authoritative design: `docs/specs/2026-10-10-cascade-vault-design.md`. Plan: `docs/plans/2026-10-10-cascade-vault.md`.

Current scope: establish one focused pure-engine RED before `symbols.ts`, `paytable.ts`, or `engine.ts` exist, then implement only the exact ways/Wild/simultaneous-removal/gravity/refill/cascade/Vault Run behavior required by that fixed contract. Runtime payout accounting uses integer centi-credit units (`100 = 1 virtual credit`) so the approved fractional paytable and ×1.5 feature modifier remain exact without whole-credit rounding or binary floating-point drift.

A minimal unregistered metadata/workspace shell exists only to satisfy repository governance when the game directory is introduced. The playable catalog/lazy route must remain absent until the later consolidated browser RED phase so route integration is still proved test-first rather than pre-satisfied.

Next: integrate Task 1 RED plus synchronized governance on `main`; require the first failure to be the absent engine modules after `game:check` passes. Then implement the three pure engine modules, keep symbol weights explicitly provisional until the reproducible 10,000,000-spin acceptance audit, and do not begin persistence/UI work before engine GREEN.

## GAME-MERGROVE-002: Progression expansion planning
**Priority:** P1 | **Tags:** mergrove, campaign, levels, power-ups, progression, achievements | **Status:** design approved; implementation separately gated

The approved v2 Mergrove scope remains documented and outside the active Cascade Vault workstream.

## QUALITY-001: Device- and viewport-agnostic game UX contract
**Priority:** P0 | **Tags:** responsive, device-agnostic, viewport, accessibility, design-browser, quality | **Status:** design approved; separately gated

Repository-wide quality direction remains governed by its own specification. Cascade Vault must ultimately meet the same concrete 320px/200%-text/keyboard/touch/reduced-motion quality bar through its game-local browser workflow.
