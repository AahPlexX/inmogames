# In progress

## PLATFORM-001: Firebase authentication and account saves
**Priority:** P0 | **Tags:** firebase, auth, firestore, persistence

Shared optional email/password Auth, isolated guest/account repositories, transactional migration, secured/tested rules and durable game checkpoints are repository-verified. Live configured-project completion remains TASK-003. GitHub Pages is canonical; emulator/account-save evidence must not be represented as live-project completion.

Lucky Seven Classic is game-locally verified on exact functional revision `04ae049259232edf9ec5af4aa63d4786d8673ba4` / run `38121766726`; its remaining live-Firebase concern is only this shared external TASK-003 platform blocker.

## DEPENDENCY-REFRESH-008: Refresh current exact stable pins
**Priority:** P0 | **Tags:** dependencies, validation, maintenance | **Status:** requested

Canonical Cascade Vault run `39280095530` on exact revision `206f2a6aa0ab4a3b0c31aeb4f450b7bc2d83b820` passed frozen install and exact-version policy, then stopped at `dependency:current` before TypeScript/game/unit/browser/build validation because npm stable had advanced to React/React DOM `19.3.1`, Firebase CLI `15.34.0`, Playwright `1.64.1`, and Vitest `5.0.5`.

Dependency-maintenance run `39293588043` proved the maintenance workflow itself is operational but `.tasks/dependency-refresh-request.json` was stale at request revision 7 and simply reapplied the October 8 versions before failing the same current-version gate. Request revision 8 now pins the newly verified npm-latest patch versions while retaining still-current Firebase `13.0.0`, rules testing `6.0.0`, React types `19.3.0`, Vite React plugin `6.1.2`, TypeScript `7.0.2`, and Vite `8.3.4`.

Next: execute the repository maintenance workflow from request revision 8, require its complete validation before its bot commit, then rerun Pages validation on the refreshed `main`. Do not represent the earlier dependency-gated run as Cascade Vault engine evidence.

## GAME-CASCADE-VAULT-001: Cascade Vault production implementation
**Priority:** P1 | **Tags:** arcade, ways, cascades, probability, accessibility, persistence | **Status:** implementing — CV-001 engine hardened; canonical GREEN dependency-gated

Authoritative design: `docs/specs/2026-10-10-cascade-vault-design.md`. Plan: `docs/plans/2026-10-10-cascade-vault.md`.

CV-001 RED is exact revision `a52d99774c9384ad6a0b4c0ccfbf1c5e7cb51e9a`, run `38122640264`. Engine implementation landed in `f71588d2ca0c96e685f54631c0afb6ded56ade84`; fixture-only correction `ae5a7e3630964d13efb23bb06c57dc582dbb2455` preserves the intended 400-unit deterministic second cascade. Independent strict TypeScript and a reconstructed focused behavior harness pass after that correction.

Revision `206f2a6aa0ab4a3b0c31aeb4f450b7bc2d83b820` closes the final-feature boundary: after a fully settled final Vault Run spin, meter/retrigger awards are applied first and a resulting zero remaining spins yields `nextVaultState: null`. Canonical run `39280095530` did not reach any Cascade Vault checks because the repository-wide dependency freshness gate failed first; CV-001 therefore remains unverified rather than failed.

Two isolated advisory workstreams reviewed the next slices. Central validation corrected their assumptions against source: engine wager parameters stay in displayed-credit denominations `10/20/50/100/250`, while awards/bankroll/totals use centi-credit integers; the existing weighted random-source adapter remains the single source of symbol distributions. Pre-audit balance reconnaissance (supporting evidence only) also shows the present paytable/distribution combination is far above the 94%-97% target, and even a favorable no-Wild/no-Scatter first-board optimization remains above 400% before cascades. CV-002 must therefore treat **paytable plus weights** as tunable, exactly as the authoritative spec permits, rather than pursuing a weights-only tune.

The governance-only workspace shell remains non-playable; catalog/lazy route stays unregistered until browser RED. TASK-003 remains the separate real-Firebase blocker and does not block game-local work.

Next after dependency GREEN: rerun CV-001 canonical verification, then open CV-002 simulation/balance and CV-003 persistence independently with fixed RED contracts and central integration review.

## GAME-MERGROVE-002: Progression expansion planning
**Priority:** P1 | **Tags:** mergrove, campaign, levels, power-ups, progression, achievements | **Status:** design approved; implementation separately gated

The approved v2 Mergrove scope remains documented and outside the active Cascade Vault workstream.

## QUALITY-001: Device- and viewport-agnostic game UX contract
**Priority:** P0 | **Tags:** responsive, device-agnostic, viewport, accessibility, design-browser, quality | **Status:** design approved; separately gated

Repository-wide quality direction remains governed by its own specification. Cascade Vault must ultimately meet the same 320px/200%-text/keyboard/touch/reduced-motion quality bar through game-local browser evidence.
