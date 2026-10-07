# Cloudline Couriers tracker

**Spec:** `docs/specs/2026-10-06-cloudline-couriers-design.md`  
**Last synchronized:** 2026-10-06

| Capability | Status | Verification |
| --- | --- | --- |
| Deterministic 16-stop skyway engine | started | Source + unit coverage integrated; focused browser edge evidence still pending |
| Tile event/economy/boost loop | started | Source + deterministic unit coverage integrated; browser event matrix pending |
| Cargo Cache choice encounter | started | Engine/UI integrated; deterministic and focus browser evidence pending |
| Landmark/district progression | started | Engine/UI + unit coverage integrated; broader progression browser evidence pending |
| Shield and four-delivery streak | started | Engine integrated; focused edge coverage pending |
| Original vector sprite/animation system | started | TDD RED browser regression now requires >=21 authored vectors, one airship courier, all 16 tile identities, all four landmark identities and reduced-motion suppression; production sprite implementation intentionally absent until RED is observed |
| Responsive accessible board surface | started | 5×5 perimeter layout/native controls integrated; 320px/200% rendered evidence still pending |
| Durable guest/account career save | verified | Revision `232102f4`, workflow run `37555538295`: decoder/unit, guest reload, account-emulator cross-browser restoration/reset, design-browser, builds and Pages deployment all green. Live configured Firebase remains external TASK-003. |
| Catalog/lazy route integration | started | Registry/index changes integrated; final completion-state reconciliation pending |
| Production deployment | started | Run `37555538295` deployed the persistence revision; final game deployment/smoke remains pending after remaining features |

## Current handoff

**Implementation state:** implementing  
**Last verified revision:** `232102f4` verifies CLC-009 persistence only; overall Cloudline remains implementing.  
**Open game-local work:** observe the CLC-007 sprite-family regression fail for the intended missing-vector reason, implement repository-authored SVG sprites/motion, then expand remaining engine/browser and responsive/accessibility evidence before final completion/deployed smoke.  
**External blockers:** TASK-003 blocks real configured-project Firebase verification only; guest persistence and Auth/Firestore emulator account behavior are verified in run `37555538295`.  
**Next action:** run the new CLC-007 browser regression and confirm RED is caused by the current typographic/no-sprite presentation. Then implement the authored SVG sprite bank and reduced-motion-safe arrival motion without new runtime dependencies.

## Continuation map

- Product inventory: `src/games/cloudline-couriers/PRD.md`
- Execution checklist: `src/games/cloudline-couriers/todo.md`
- Pure rules: `src/games/cloudline-couriers/engine.ts`
- Versioned save contract: `src/games/cloudline-couriers/persistence.ts`
- React surface: `src/games/cloudline-couriers/CloudlineCouriersWorkspace.tsx`
- Scoped responsive styling: `src/games/cloudline-couriers/cloudline-couriers.css`
- Engine unit evidence: `tests/unit/cloudline-couriers-engine.test.ts`
- Save decoder unit evidence: `tests/unit/cloudline-couriers-persistence.test.ts`
- Design/reload/sprite regression: `tests/browser/cloudline-couriers-design.mjs`
- Account-emulator evidence: `tests/browser/cloudline-couriers-account-persistence.mjs`

Do not infer completion from chat history. The authoritative spec, this tracker, PRD and todo are the current repository resume contract.
