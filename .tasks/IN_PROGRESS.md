# In progress

## PLATFORM-001: Firebase authentication and account saves
**Priority:** P0 | **Tags:** firebase, auth, firestore, persistence

Shared optional email/password Auth, isolated guest/account repositories, transactional migration, secured/tested rules and durable game checkpoints are repository-verified. Live configured-project completion remains TASK-003. GitHub Pages is canonical; emulator/account-save evidence must not be represented as live-project completion.

Lucky Seven Classic is game-locally verified on exact functional revision `04ae049259232edf9ec5af4aa63d4786d8673ba4` / run `38121766726`; its remaining live-Firebase concern is only this shared external TASK-003 platform blocker.

## DEPENDENCY-REFRESH-008: Refresh current exact stable pins
**Priority:** P0 | **Tags:** dependencies, validation, maintenance | **Status:** requested — history-aware governance repair pending rerun

Canonical Cascade Vault run `39280095530` stopped at dependency freshness before game validation. Dependency-maintenance run `39293588043` proved request revision 7 was stale; revision 8 corrected the direct targets. Maintenance run `39294812001` verified every requested direct version as npm latest, then reached `pnpm validate`, where dependency checks, design lint and TypeScript passed before two Cascade PRD/todo schema regressions were reported.

Commit `af5a10b6ba4551a7b940382a5d36b67a2b9aaf75` restored those schema contracts. Maintenance run `39295604436` then proved `game-check: 7 game(s) OK`; the only failure was history-aware `game-doc-sync`, which correctly required the changed Cascade tracker and authoritative spec to be updated together. The current integration moves spec+tracker atomically and carries the same evidence.

Next: rerun dependency maintenance from request revision 8; require the complete validator, verified package/lockfile bot commit and automatic Pages dispatch. Do not represent dependency/governance-gated runs as Cascade engine failures.

## GAME-CASCADE-VAULT-001: Cascade Vault production implementation
**Priority:** P1 | **Tags:** arcade, ways, cascades, probability, accessibility, persistence | **Status:** implementing — CV-001 source hardened; canonical GREEN dependency/governance-gated

Authoritative design: `docs/specs/2026-10-10-cascade-vault-design.md`. Plan: `docs/plans/2026-10-10-cascade-vault.md`.

CV-001 RED is exact revision `a52d99774c9384ad6a0b4c0ccfbf1c5e7cb51e9a`, run `38122640264`. Engine implementation landed in `f71588d2ca0c96e685f54631c0afb6ded56ade84`; fixture-only correction `ae5a7e3630964d13efb23bb06c57dc582dbb2455` preserves the intended 400-unit deterministic second cascade. Revision `206f2a6aa0ab4a3b0c31aeb4f450b7bc2d83b820` closes the final-feature boundary so a fully settled feature with zero remaining spins returns `nextVaultState: null`.

The canonical recovery has now demonstrated current dependency candidates, design lint, TypeScript and `game-check` all pass; unit/browser/build validation has not yet run because history-aware documentation governance stopped first. CV-001 remains unverified rather than failed.

Two isolated advisory workstreams reviewed CV-002 and CV-003. Central validation corrected their assumptions against source: engine wager parameters remain displayed-credit denominations `10/20/50/100/250`, while awards/bankroll/totals use centi-credit integers; the existing weighted random-source adapter remains the single symbol-distribution source. Supporting pre-audit reconnaissance shows the current paytable/distribution combination is far above the 94%-97% target, including a >400% first-board lower-bound style result under a favorable no-Wild/no-Scatter optimization. CV-002 therefore treats **paytable plus weights** as provisional/tunable as the authoritative spec permits; only a production-engine >=10M audit can establish final acceptance.

The governance-only workspace shell remains non-playable; catalog/lazy route stays unregistered until browser RED. TASK-003 remains the separate real-Firebase blocker and does not block game-local work.

Next after repository gate recovery: obtain CV-001 canonical GREEN, then open CV-002 simulation/balance and CV-003 persistence independently with fixed RED contracts and central integration review.

## GAME-MERGROVE-002: Progression expansion planning
**Priority:** P1 | **Tags:** mergrove, campaign, levels, power-ups, progression, achievements | **Status:** design approved; implementation separately gated

The approved v2 Mergrove scope remains documented and outside the active Cascade Vault workstream.

## QUALITY-001: Device- and viewport-agnostic game UX contract
**Priority:** P0 | **Tags:** responsive, device-agnostic, viewport, accessibility, design-browser, quality | **Status:** design approved; separately gated

Repository-wide quality direction remains governed by its own specification. Cascade Vault must ultimately meet the same 320px/200%-text/keyboard/touch/reduced-motion quality bar through game-local browser evidence.
