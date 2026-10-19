# In progress

## PLATFORM-001: Firebase authentication and account saves
**Priority:** P0 | **Tags:** firebase, auth, firestore, persistence

Shared optional email/password Auth, isolated guest/account repositories, transactional migration, secured/tested rules and durable game checkpoints are repository-verified. Live configured-project completion remains TASK-003. GitHub Pages is canonical; emulator/account-save evidence must not be represented as live-project completion.

Lucky Seven Classic is game-locally verified on exact functional revision `04ae049259232edf9ec5af4aa63d4786d8673ba4` / run `38121766726`; its remaining live-Firebase concern is only this shared external TASK-003 platform blocker.

## GAME-CASCADE-VAULT-001: Cascade Vault production implementation
**Priority:** P1 | **Tags:** arcade, ways, cascades, probability, accessibility, persistence | **Status:** implementing — CV-001 engine hardened; canonical GREEN pending

Authoritative design: `docs/specs/2026-10-10-cascade-vault-design.md`. Plan: `docs/plans/2026-10-10-cascade-vault.md`.

CV-001 RED is exact revision `a52d99774c9384ad6a0b4c0ccfbf1c5e7cb51e9a`, run `38122640264`. Engine implementation landed in `f71588d2ca0c96e685f54631c0afb6ded56ade84`; fixture-only correction `ae5a7e3630964d13efb23bb06c57dc582dbb2455` preserves the intended 400-unit deterministic second cascade. Independent strict TypeScript and a reconstructed focused behavior harness pass after that correction.

The current hardening closes the remaining feature-boundary ambiguity: after a fully settled final Vault Run spin, all meter/retrigger awards are applied first and a resulting zero remaining spins yields `nextVaultState: null`. Persistence/UI must never receive an active zero-spin feature. This regression is integrated with engine/spec/tracker/PRD/todo/index updates and still requires canonical repository GREEN.

Source-controlled initial/refill weights remain provisional until CV-002's reproducible >=10,000,000-paid-spin RTP audit passes its documented 94%-97% confidence-interval gate. The governance-only workspace shell remains non-playable; catalog/lazy route stays unregistered until browser RED.

Next: canonical Task 1 verification. Then CV-002 simulation/balance and CV-003 persistence can proceed independently, each with its own RED/GREEN evidence and central integration review. Neither is verified from source inspection alone.

## GAME-MERGROVE-002: Progression expansion planning
**Priority:** P1 | **Tags:** mergrove, campaign, levels, power-ups, progression, achievements | **Status:** design approved; implementation separately gated

The approved v2 Mergrove scope remains documented and outside the active Cascade Vault workstream.

## QUALITY-001: Device- and viewport-agnostic game UX contract
**Priority:** P0 | **Tags:** responsive, device-agnostic, viewport, accessibility, design-browser, quality | **Status:** design approved; separately gated

Repository-wide quality direction remains governed by its own specification. Cascade Vault must ultimately meet the same 320px/200%-text/keyboard/touch/reduced-motion quality bar through game-local browser evidence.
