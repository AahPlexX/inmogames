# Mergrove tracker

**Spec:** `docs/specs/2026-10-06-mergrove-design.md`  
**Last synchronized:** 2026-10-06

## Capability state

| Capability | Status | Verification |
| --- | --- | --- |
| Deterministic 5 × 5 engine and queue | verified | Unit suite passed on revision `965c91a5b9090da321ae3eb0d11f9383678b02c6` in run `37553471015`. |
| Orthogonal merge + cascade resolution | verified | Unit coverage for trio merge, cascade scoring, grouping and invalid actions passed in run `37553471015`. |
| Sunlight + compost recovery | verified | Unit coverage for compost spend plus terminal/recoverable full-board behavior passed in run `37553471015`. |
| Tier-eight ancient bloom | verified | Unit coverage verifies Groveheart group clearing and ancient-bloom accounting; run `37553471015` green. |
| Eight-tier original SVG sprite bank | verified | Repository-authored inline SVG symbols shipped; Mergrove rendered-browser suite passed in run `37553471015`. |
| Responsive pointer/touch/keyboard UI | verified | `mergrove-design.mjs` passed 320px, 200% text, keyboard, 44px targets and reduced-motion checks in run `37553471015`. |
| Guest active-run persistence | verified | Browser reload checkpoint plus v1 decoder unit coverage passed in run `37553471015`. |
| Shared account checkpoint/reset | verified | Auth/Firestore emulator test verifies authenticated checkpoint, second-browser restoration and scoped reset in run `37553471015`. |
| Live Firebase account verification | blocked externally | TASK-003 owns real configured-project Auth/Firestore/rules/password-reset/cross-browser verification; emulator evidence is not represented as live verification. |
| Catalog/registry/index integration | verified | Catalog, lazy workspace and documentation checks passed on revision `965c91a5b9090da321ae3eb0d11f9383678b02c6`. |
| Production deployment | verified | Pages deploy job succeeded in run `37553471015`; a fresh uncached live render returned HTTP 200 and the expected 25-cell Mergrove initial state. |

## Asset and network record

All Mergrove art is original repository-authored SVG in `src/games/mergrove/sprites.tsx`; no third-party licence or attribution is required. Mergrove adds no runtime network request. Optional account saves use only the repository's shared Firebase platform.

## Current handoff

**Implementation state:** verified  
**Last verified revision:** `965c91a5b9090da321ae3eb0d11f9383678b02c6` in GitHub Actions run `37553471015`.  
**Open game-local work:** none; Mergrove satisfies its authoritative completion contract.  
**External blockers:** TASK-003 blocks real configured-project Firebase account-save verification only; repository/emulator account-save behavior is verified and this external platform task does not reopen Mergrove.  
**Next action:** none for game-local v1. Do not reopen Mergrove unless a reproducible defect is discovered or new scope is explicitly added. If TASK-003 is later completed, record the shared live-Firebase evidence without changing Mergrove gameplay unless that verification exposes a Mergrove-specific defect.

Product scope and final feature state are mirrored in `src/games/mergrove/PRD.md` and `src/games/mergrove/todo.md`; chat history is not required to resume this game.
