# In progress

## PLATFORM-001: Firebase authentication and account saves
**Priority:** P0 | **Tags:** firebase, auth, firestore, persistence

Shared optional email/password Auth, isolated guest/account repositories, transactional migration, secured/tested rules and durable game checkpoints are repository-verified. Live configured-project completion remains TASK-003. GitHub Pages is canonical; emulator/account-save evidence must not be represented as live-project completion.

Lucky Seven Classic is game-locally verified on exact functional revision `04ae049259232edf9ec5af4aa63d4786d8673ba4` / run `38121766726`; its remaining live-Firebase concern is only this shared external TASK-003 platform blocker.


## GAME-CASCADE-VAULT-001: Cascade Vault production implementation
**Priority:** P1 | **Tags:** arcade, ways, cascades, probability, accessibility, persistence | **Status:** implementing — CV-001 verified; CV-002 TDD RED opening

Authoritative design: `docs/specs/2026-10-10-cascade-vault-design.md`. Plan: `docs/plans/2026-10-10-cascade-vault.md`.

CV-001 is verified on exact refreshed revision `08c3506773d17eee3fed7554f211531141856386` / run `39296638285`: dependency freshness, design lint, TypeScript, history-aware governance, the full unit/rules/browser chain, both production builds, Pages artifact upload and deployment all passed. The earlier RED/fixture/terminal-feature evidence remains preserved in the game spec/tracker.

CV-002 opens test-first with a focused simulation contract before `simulation.ts` exists. It must reuse production `createWeightedVaultRandomSource` + `resolveSpin`, treat one paid spin plus its complete attached Vault Run as one RTP observation, stream confidence statistics, report Vault entry/cascade metrics, and reject any corruption-guard hit. Current paytable and weights remain provisional; supporting reconnaissance rules out a weights-only tune, so the spec-authorized paytable + distribution rebalance remains in scope.

The governance-only workspace shell remains non-playable; route registration waits for browser RED. TASK-003 remains the external real-Firebase blocker only.

CV-002 RED is now recorded on exact revision `82b7bb2fa9d2e5aafa2cd7d2b080052127240c5e` / run `39297705487`; TypeScript failed only because `simulation.ts` was absent after dependency/design gates. Next: validate the minimal production-engine simulation/statistics implementation against that unchanged contract, then screen balance candidates and run the required >=10M paid-spin acceptance audit before CV-003 integration claims.

## GAME-MERGROVE-002: Progression expansion planning
**Priority:** P1 | **Tags:** mergrove, campaign, levels, power-ups, progression, achievements | **Status:** design approved; implementation separately gated

The approved v2 Mergrove scope remains documented and outside the active Cascade Vault workstream.

## QUALITY-001: Device- and viewport-agnostic game UX contract
**Priority:** P0 | **Tags:** responsive, device-agnostic, viewport, accessibility, design-browser, quality | **Status:** design approved; separately gated

Repository-wide quality direction remains governed by its own specification. Cascade Vault must ultimately meet the same 320px/200%-text/keyboard/touch/reduced-motion quality bar through game-local browser evidence.
