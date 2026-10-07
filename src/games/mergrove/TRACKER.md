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
| Balance simulation harness + drift gate (MER-023) | started | Implemented and passing locally (`tests/unit/support/mergrove-sim.ts`, `mergrove-balance.test.ts`); no CI-verified revision yet. |
| Engine/decoder edge-case unit coverage | started | `mergrove-engine-edges.test.ts` and `mergrove-persistence-edges.test.ts` pass locally; selected engine mutations were confirmed to fail them. No CI-verified revision yet. |
| Next-draw preview + Escape-to-cancel compost (MER-024) | started | Unit tests and the extended `mergrove-design.mjs` pass locally against system Chrome; the Escape handler was mutation-checked. No CI-verified revision yet. |
| Catalog/registry/index integration | verified | Catalog, lazy workspace and documentation checks passed on revision `965c91a5b9090da321ae3eb0d11f9383678b02c6`. |
| Production deployment | verified | Pages deploy job succeeded in run `37553471015`; a fresh uncached live render returned HTTP 200 and the expected 25-cell Mergrove initial state. |

## Asset and network record

All Mergrove art is original repository-authored SVG in `src/games/mergrove/sprites.tsx`; no third-party licence or attribution is required. Mergrove adds no runtime network request. Optional account saves use only the repository's shared Firebase platform.

## v1.1 balance baseline (classic 5 × 5, ruleset v1)

Measured 2026-10-07 with the dev-only harness; policy-specific, not a claim about human play. Greedy (200 seeds): median 52 turns, median score 350, never past Sprout. Two-ply (30 seeds): median 283 turns, median score 5670, Bud 100%, Bloom 97%, Sapling 37%, Lantern Tree 0%, no ancient blooms, about 36 composts per run. The drift-gate ranges in `tests/unit/mergrove-balance.test.ts` are set around these figures.

## Current handoff

**Implementation state:** implementing  
**Last verified revision:** `965c91a5b9090da321ae3eb0d11f9383678b02c6` in GitHub Actions run `37553471015` (v1.0 only). v1.1 has no CI-verified revision yet.  
**Open game-local work:** v1.1 awaits the full CI validation chain and a Pages deployment with a fresh render check. Locally verified (Node 24.21.0): typecheck, `pnpm test:unit`, `pnpm game:check` and `tests/browser/mergrove-design.mjs`. Not run in the authoring sandbox: Firestore rules tests, Auth/Firestore emulator browser tests, `design:check`, dependency gates and production builds.  
**External blockers:** TASK-003 still blocks real configured-project Firebase account-save verification only; it does not block v1.1.  
**Next action:** Push to `main`, let CI run, and fix any failure it reports. When every gate is green, record the revision and run id, tick the two open spec gates, set every started row to verified, set Implementation state to verified, and change the GAME_INDEX row back to `verified game`. Do not start schema-v2 features (hold, undo, modes, stats, codex) until roadmap MER-020 has its shared-platform change. Next roadmap candidates in order: MER-009 ruleset/replay, then MER-008 layouts, using the MER-023 baseline to choose the default board.

Product scope and final feature state are mirrored in `src/games/mergrove/PRD.md` and `src/games/mergrove/todo.md`; chat history is not required to resume this game.
