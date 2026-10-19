# In progress

## PLATFORM-001: Firebase authentication and account saves
**Priority:** P0 | **Tags:** firebase, auth, firestore, persistence

Shared optional email/password Auth, isolated guest/account repositories, transactional migration, secured/tested rules and durable game checkpoints are repository-verified. Live configured-project completion remains TASK-003. GitHub Pages is canonical; emulator/account-save evidence must not be represented as live-project completion.

Lucky Seven Classic is game-locally verified on exact functional revision `04ae049259232edf9ec5af4aa63d4786d8673ba4` / run `38121766726`; its remaining live-Firebase concern is only this shared external TASK-003 platform blocker.

## GAME-CASCADE-VAULT-001: Cascade Vault production implementation
**Priority:** P1 | **Tags:** arcade, ways, cascades, probability, accessibility, persistence | **Status:** implementing — Task 1 RED evidenced; engine GREEN pending

Authoritative design: `docs/specs/2026-10-10-cascade-vault-design.md`. Plan: `docs/plans/2026-10-10-cascade-vault.md`.

Task CV-001 RED is recorded on exact revision `a52d99774c9384ad6a0b4c0ccfbf1c5e7cb51e9a`, run `38122640264`: dependency freshness and design lint passed; TypeScript then failed only because the intended `symbols.ts`, `paytable.ts`, and `engine.ts` modules were absent. The fixed focused test contract remains unchanged.

The three pure engine modules are now integrated for GREEN verification: source-controlled symbol types/provisional weights, exact centi-credit paytable math, immutable adjacent-ways evaluation, all-Wild interpretation deduplication, simultaneous removal, gravity/top refill, initial-only Scatter handling, bounded base/Vault multipliers, meter/retrigger transitions, and the 50-cascade corruption guard. Provisional symbol weights are explicitly not balanced/final until the reproducible >=10,000,000-spin CV-002 acceptance audit passes.

The unregistered metadata/workspace shell remains intentionally non-playable. Catalog/lazy-route registration must wait for the later consolidated browser RED phase so route integration is still demonstrated test-first.

Next: require the Task CV-001 integration revision to pass TypeScript, history-aware governance, the unchanged focused engine suite and full unit suite. Only then open CV-002 simulation/balance work and CV-003 persistence work; neither may be marked verified from source inspection alone.

## GAME-MERGROVE-002: Progression expansion planning
**Priority:** P1 | **Tags:** mergrove, campaign, levels, power-ups, progression, achievements | **Status:** design approved; implementation separately gated

The approved v2 Mergrove scope remains documented and outside the active Cascade Vault workstream.

## QUALITY-001: Device- and viewport-agnostic game UX contract
**Priority:** P0 | **Tags:** responsive, device-agnostic, viewport, accessibility, design-browser, quality | **Status:** design approved; separately gated

Repository-wide quality direction remains governed by its own specification. Cascade Vault must ultimately meet the same concrete 320px/200%-text/keyboard/touch/reduced-motion quality bar through its game-local browser workflow.
