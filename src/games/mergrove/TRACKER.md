# Mergrove tracker

**Spec:** `docs/specs/2026-10-06-mergrove-design.md`  
**Last synchronized:** 2026-10-07

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

## Approved v2 expansion planning

Product owner approved the next-release direction on 2026-10-07. The authoritative spec now contains the written **Approved v2 progression expansion** covering a 40-level/five-grove Campaign, 1–3 star mastery, Sunbeam/Gust/Rewind Leaf plus existing Compost, deterministic rewards, 20 achievements, the launch Spirit Almanac, deterministic Challenge Grove, v2 migration, optional procedural audio and the required verification matrix.

This is planning state only. No v2 source, tests, save schema or production behavior has been changed yet, so the shipped v1 Completion contract remains verified. The broader PRD roadmap remains valid future inventory; the approved spec controls the next release where it is more specific or intentionally excludes a roadmap item.

The first implementation integration must atomically reopen Mergrove to `implementing` in the authoritative Completion contract, this tracker, PRD/todo, GAME_INDEX and task records before any new production behavior is merged.

## Asset and network record

All shipped Mergrove art is original repository-authored SVG in `src/games/mergrove/sprites.tsx`; no third-party licence or attribution is required. Mergrove adds no game-specific runtime network request. Optional account saves use only the repository's shared Firebase platform. The approved v2 design keeps assets repository-authored/same-origin and requires no new runtime dependency; optional procedural WebAudio must be local and opt-in.

## Current handoff

**Implementation state:** verified v1; v2 progression expansion design approved, implementation not started.  
**Last verified revision:** `965c91a5b9090da321ae3eb0d11f9383678b02c6` in GitHub Actions run `37553471015`.  
**Open game-local work:** none in shipped v1; v2 is planning-only until the written-spec review and implementation-plan gates are complete, so no production source/test mutation is permitted yet.  
**External blockers:** TASK-003 blocks real configured-project Firebase account-save verification only; repository/emulator account-save behavior is verified. V2 schema migration may be designed/tested with emulator evidence without pretending TASK-003 live verification is complete.  
**Next action:** product owner reviews the written `Approved v2 progression expansion` section in the authoritative spec. After explicit written-spec approval, invoke the implementation-planning workflow; only after that plan is approved may production implementation begin. At the first implementation integration, reopen all Mergrove completion/status documents together.

Product scope and feature inventory remain in `src/games/mergrove/PRD.md`; execution/sign-off state is in `src/games/mergrove/todo.md`. Chat history is not required to resume this game.
