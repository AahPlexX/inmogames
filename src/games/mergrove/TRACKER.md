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
| Ruleset registry, replay and golden fingerprints (MER-025) | started | `ruleset.ts` and `mergrove-ruleset.test.ts` pass locally; goldens mutation-checked (scoring and RNG changes fail). Library only, not wired to UI or saves. No CI-verified revision yet. |
| Data-driven layouts + layout-aware engine (MER-026) | started | `layout.ts`, `mergrove-layout.test.ts`, `mergrove-engine-layouts.test.ts` pass locally; classic-5 equivalence proven by unchanged v1 and golden tests; two mutations confirmed to fail. Library/simulator only, no UI or save change. No CI-verified revision yet. |
| Ruleset v2 large-group bonus (MER-027) | started | `mergrove-bonus.test.ts` passes locally; threshold mutation fails it; v1 goldens untouched. Not yet selectable by players. No CI-verified revision yet. |
| Play-state layer: Storehouse, undo, wishes (MER-028) | started | `mergrove-play.test.ts` (25 tests) passes locally. Logic only; not yet in the UI or the save. No CI-verified revision yet. |
| Quality tooling + accessibility gates (MER-029) | started | oxlint, fast-check, Testing Library, coverage ratchet, knip and axe-core with a validated contrast checker pass locally; wired into pages.yml. Not yet run in CI. |
| Journey of Biomes logic (MER-030) | started | `mergrove-journey.test.ts` (33 tests) passes locally; 8 mutations detected; all 15 levels cleared by the bot on 11 of 11 runs. No UI or persistence yet. |
| Stats, Herbarium, achievements logic (MER-031) | started | `mergrove-progress.test.ts` (18 tests) passes locally; 9 mutations detected. No UI or persistence yet. |
| Journey, Herbarium, achievements, hold/undo/wish UI and final save shape | planned | Not started. The save stays at schema version 1 (first release, no migration). |
| Presentation: animation, micro-interactions, procedural sound, sprite refinement | planned | Not started. Audit of the current UI (2026-10-07) found the board below the fold on phones, no merge preview, minimal feedback, and no controls for hold/undo/wishes. |
| Catalog/registry/index integration | verified | Catalog, lazy workspace and documentation checks passed on revision `965c91a5b9090da321ae3eb0d11f9383678b02c6`. |
| Production deployment | verified | Pages deploy job succeeded in run `37553471015`; a fresh uncached live render returned HTTP 200 and the expected 25-cell Mergrove initial state. |

## Asset and network record

All Mergrove art is original repository-authored SVG in `src/games/mergrove/sprites.tsx`; no third-party licence or attribution is required. Mergrove adds no runtime network request. Optional account saves use only the repository's shared Firebase platform.

## v1.1 balance baseline (classic 5 × 5, ruleset v1)

Measured 2026-10-07 with the dev-only harness; policy-specific, not a claim about human play. Greedy (200 seeds): median 52 turns, median score 350, never past Sprout. Two-ply (30 seeds): median 283 turns, median score 5670, Bud 100%, Bloom 97%, Sapling 37%, Lantern Tree 0%, no ancient blooms, about 36 composts per run. The drift-gate ranges in `tests/unit/mergrove-balance.test.ts` are set around these figures.

## v1.1 layout comparison

Same seeds, two-ply bot, n=24 (2026-10-07): classic-5 median 286 turns, Sapling 38%; crossroads-6 median 399, Sapling 67%; standard-6 median 433, Sapling 54%. No layout reached Lantern Tree or an ancient bloom. Bigger boards lengthen runs but are not shown to be sufficient on their own. See PRD MER-026-F05.

## v1.1 ruleset v2 effect

Two-ply bot, 24 seeds, v1 to v2 Sapling reach: classic-5 38% to 50%, crossroads-6 67% to 83%, standard-6 54% to 96%. Lantern Tree and above are still 0% everywhere for this bot, so the late game is an open balance question (bot weakness vs rules not separated).

## Scope decisions (owner, 2026-10-07)

- Mergrove has never had players: this is the first release. There is no v1 data to migrate, so the save stays at schema version 1 and takes its final shape directly. The shared-platform migration work was reverted.
- No daily puzzle, weekly event, date-keyed seed or calendar streak (roadmap MER-014 rejected). Progression is linear through the Journey of Biomes; Endless is free play.

## Quality tooling notes

Nine dev-only packages were added with exact pins and recorded evidence. oxlint replaces ESLint because typescript-eslint does not support TypeScript 7. axe-core cannot resolve this game's gradient backgrounds, so `tests/browser/mergrove-axe.mjs` carries its own contrast checker; if the board markup changes, re-validate that checker with a known-bad element. Not run in the authoring sandbox: Firestore rules tests and the Auth/Firestore emulator browser tests (the emulator did not start there).

## Journey calibration (2026-10-07, two-ply bot, 11 runs per level)

All 15 levels won on 11 of 11 runs. Star spread (1/2/3): hollow-1 0/0/11, hollow-2 0/5/6, hollow-3 1/2/8, fen-1 0/3/8, fen-2 1/4/6, fen-3 1/4/6, stone-1 0/11/0, stone-2 2/7/2, stone-3 3/4/4, ember-1 0/10/1, ember-2 2/5/4, ember-3 0/4/7, moon-1 7/4/0, moon-2 5/6/0, moon-3 2/8/1. A Sapling goal (old moon-2) was won on only 8 of 10 runs and was replaced by a score goal.

## Current handoff

**Implementation state:** implementing  
**Last verified revision:** `965c91a5b9090da321ae3eb0d11f9383678b02c6` in GitHub Actions run `37553471015` (v1.0 only). v1.1 has no CI-verified revision yet.  
**Open game-local work:** v1.1 awaits the full CI validation chain and a Pages deployment with a fresh render check. Locally verified (Node 24.21.0): typecheck, `pnpm test:unit`, `pnpm game:check` and `tests/browser/mergrove-design.mjs`. Not run in the authoring sandbox: Firestore rules tests, Auth/Firestore emulator browser tests, `design:check`, dependency gates and production builds.  
**External blockers:** TASK-003 still blocks real configured-project Firebase account-save verification only; it does not block v1.1.  
**Next action:** In order: (1) define the final save shape at schema version 1 and wire play state, Journey progress, stats, Herbarium and achievements through it; (2) rebuild the workspace with a mode switch, Journey map, hold/undo/wish controls and a merge preview, with the board first on phones; (3) animation, micro-interactions and opt-in procedural sound; (4) sprite refinement. Then: CI (`pages.yml`) only runs on pushes to `main` or manual dispatch, so merge branch `mergrove-v1.1-balance-and-presentation` to `main` (the repo rule is direct commits to `main`), let CI run, and fix any failure it reports. When every gate is green, record the revision and run id, tick the two open spec gates, set every started row to verified, set Implementation state to verified, and change the GAME_INDEX row back to `verified game`. Do not start schema-v2 features (hold, undo, modes, stats, codex) until roadmap MER-020 has its shared-platform change. Next, in order: define the final save shape at schema version 1 (no migration), then the linear Journey of Biomes (MER-015), Herbarium and achievements (MER-017/019), then presentation, animation and procedural audio (MER-029). Earlier candidates, now mostly done: MER-012 large-group bonus as a NEW ruleset id (then re-simulate; it is the main lever for the late tiers), and a stronger bot. Everything that persists new data (layoutId, rulesetId, hold, undo, modes, stats, codex) needs roadmap MER-020 first.

Product scope and final feature state are mirrored in `src/games/mergrove/PRD.md` and `src/games/mergrove/todo.md`; chat history is not required to resume this game.
