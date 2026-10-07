# TODO: Mergrove (mergrove)

**Status:** Complete v1; approved v2 progression design awaiting written-spec review; implementation not started  
**Last synchronized:** 2026-10-07  
**Architecture & Engine:** Shipped v1 is a static React/Vite game with a pure deterministic TypeScript 5 × 5 merge engine, repository-authored SVG sprites, and the shared versioned save platform. Approved v2 preserves that core while adding Campaign/progression modules around it; no production v2 code has started.  
**Verified v1 evidence:** revision `965c91a5b9090da321ae3eb0d11f9383678b02c6`, GitHub Actions run `37553471015`, plus fresh HTTP-200 deployed-route render.  
**Dependencies Used:**
- [x] `react@19.3.0`
- [x] `react-dom@19.3.0`
- [x] `firebase@12.19.0` — shared optional account/save platform only
- [x] `vite@8.3.3` — build/dev
- [x] `typescript@7.0.2` — development/type safety
- [x] `vitest@5.0.3` — unit verification
- [x] `playwright@1.63.0` — rendered browser verification

> Dependency rule: direct dependency and devDependency declarations remain exact pinned stable versions only; `^` and `~` are prohibited. Revision `965c91a5b9090da321ae3eb0d11f9383678b02c6` passed both dependency gates in run `37553471015`. The approved v2 design requires no new runtime dependency unless the implementation plan proves one necessary against current official documentation.

---

## Core Feature Execution Pipeline — shipped v1

- [x] **Deterministic Placement Board** `{id: 'MER-001'}` — `[feature development status: = 'Complete']`
  - [x] **Purpose:** Own deterministic board, queue, RNG, placement, turn, and terminal rules outside React.
  - [x] **Inputs / Parameters:** Seed/RNG state, queue slot, board cell, current run state.
  - [x] **Dependencies Touched:** `engine.ts`; no third-party runtime dependency.
  - [x] **Technical Notes & Edge Cases:** Reject occupied/out-of-range placement; deterministic replacement draw; full-board recovery distinction.
  - [x] **Implementation Details:** Pure engine state transition with no DOM/storage/Firebase access.
  - [x] **Verification & State Sign-off:** Unit/CI coverage passed in run `37553471015`.

- [x] **Orthogonal Merge and Cascade Resolution** `{id: 'MER-002'}` — `[feature development status: = 'Complete']`
  - [x] **Purpose:** Resolve connected equal-tier groups and deliberate chain reactions.
  - [x] **Inputs / Parameters:** Placement anchor, board, source tier, chain depth.
  - [x] **Dependencies Touched:** `engine.ts` only.
  - [x] **Technical Notes & Edge Cases:** Orthogonal only; placement anchor survives ordinary merge; repeat until stable.
  - [x] **Implementation Details:** Flood-fill group resolution and inspectable score formula.
  - [x] **Verification & State Sign-off:** Basic merge/cascade/scoring tests passed in run `37553471015`.

- [x] **Eight-Tier Grove Progression and Ancient Bloom** `{id: 'MER-003'}` — `[feature development status: = 'Complete']`
  - [x] **Purpose:** Supply the complete progression arc and a bounded terminal-tier event.
  - [x] **Inputs / Parameters:** Source tier/group size and highest-tier progress.
  - [x] **Dependencies Touched:** `engine.ts`, `sprites.tsx`, workspace presentation.
  - [x] **Technical Notes & Edge Cases:** Groveheart groups clear as ancient blooms; never overflow into undefined tier nine.
  - [x] **Implementation Details:** Eight authored SVG symbols plus engine highest-tier/ancient-bloom state.
  - [x] **Verification & State Sign-off:** Engine and rendered browser evidence passed in run `37553471015`.

- [x] **Sunlight and Compost Recovery** `{id: 'MER-004'}` — `[feature development status: = 'Complete']`
  - [x] **Purpose:** Add earned strategic recovery without purchases, ads, or hidden rescues.
  - [x] **Inputs / Parameters:** Sunlight balance and occupied target cell.
  - [x] **Dependencies Touched:** Engine and workspace controls.
  - [x] **Technical Notes & Edge Cases:** Cost is four sunlight; removal consumes no queue piece and changes no score; full board with >=4 sunlight is recoverable.
  - [x] **Implementation Details:** Explicit Compost arm/cancel/target path using native controls.
  - [x] **Verification & State Sign-off:** Compost and terminal/recoverable-board tests passed in run `37553471015`.

- [x] **Original Responsive SVG Presentation** `{id: 'MER-005'}` — `[feature development status: = 'Complete']`
  - [x] **Purpose:** Deliver crisp original game art and equivalent pointer/touch/keyboard play on device-agnostic layouts.
  - [x] **Inputs / Parameters:** Run state, queue selection, board cell actions, compost mode, save status.
  - [x] **Dependencies Touched:** React, CSS, authored `sprites.tsx`; no remote asset dependency.
  - [x] **Technical Notes & Edge Cases:** 320px, 200% text, >=44px controls, visible focus, non-color selection, reduced motion, no drag-only action.
  - [x] **Implementation Details:** Native buttons, responsive grid, ARIA state/names, polite status output, SVG symbol bank.
  - [x] **Verification & State Sign-off:** Mergrove Playwright rendered checks passed in run `37553471015`.

- [x] **Durable Guest and Optional Account Progress** `{id: 'MER-006'}` — `[feature development status: = 'Complete']`
  - [x] **Purpose:** Preserve best progress and active deterministic runs across reload; optionally sync account progress.
  - [x] **Inputs / Parameters:** `bestScore`, `bestTier`, validated `activeRun`, schema version 1.
  - [x] **Dependencies Touched:** Shared save contracts/platform; Firebase only through shared optional platform.
  - [x] **Technical Notes & Edge Cases:** Reject malformed runs; game-scoped reset; cloud-existing state must not be overwritten by unrelated guest data.
  - [x] **Implementation Details:** Versioned decoder and shared `useGameSave` workspace integration.
  - [x] **Verification & State Sign-off:** Guest reload and Auth/Firestore emulator checkpoint/restoration/reset evidence passed in run `37553471015`; real configured-project Firebase remains TASK-003.

- [x] **Catalog and Production Integration** `{id: 'MER-007'}` — `[feature development status: = 'Complete']`
  - [x] **Purpose:** Make Mergrove discoverable and production-routable without breaking existing games.
  - [x] **Inputs / Parameters:** Catalog metadata, lazy registry, game index, game docs, shared validation.
  - [x] **Dependencies Touched:** Catalog/workspaces/styles/tests/docs; no new dependency.
  - [x] **Technical Notes & Edge Cases:** Preserve parallel-agent changes; no open feature PR; docs remain self-sufficient.
  - [x] **Implementation Details:** `#/games/mergrove` catalog and lazy workspace wiring exists on `main`.
  - [x] **Verification & State Sign-off:** Exact revision `965c91a5b9090da321ae3eb0d11f9383678b02c6` passed complete validation and Pages deployment in run `37553471015`; fresh live render returned HTTP 200 with the expected board/queue state.

---

## Approved v2 progression expansion — planning gate only

The authoritative spec's `Approved v2 progression expansion` is product-owner approved. This checklist records the design/plan gates only; production implementation must not begin until the written spec is explicitly reviewed and the implementation plan is then written and approved.

- [x] Product direction approved: Campaign-first progression while preserving Endless Grove.
- [x] Launch scope fixed at 40 levels across five named groves, seven objective patterns and 120 possible stars.
- [x] Power-up semantics specified: existing sunlight Compost plus earned Sunbeam, Gust and Rewind Leaf; no purchases/random loot.
- [x] Engagement guardrails specified: no lives/energy, forced waiting, ads, paid currency, push pressure, analytics or punitive streak loss.
- [x] 20 permanent launch achievement ids specified.
- [x] Eight-entry launch Spirit Almanac specified.
- [x] Deterministic Challenge Grove specified; unlock after level 8; one scored daily attempt plus practice replays; no inventory boosters.
- [x] V2 persistence/migration requirements specified with preservation of v1 Endless progress and explicit cloud downgrade protection.
- [x] Evidence-driven balance gate specified: every campaign level must be solver/simulation-clearable for one star without inventory boosters.
- [x] Accessibility/responsive, procedural-audio and full v2 verification requirements specified.
- [ ] Product owner reviews the written authoritative v2 specification after this documentation integration.
- [ ] After written-spec approval, create the detailed implementation plan; do not write production code before that plan is reviewed.
- [ ] First production integration atomically changes Mergrove completion/index/tracker/PRD/todo state from verified-v1/planning to `implementing`.

The existing PRD's MER-008…MER-022 roadmap remains the broader inventory. The approved v2 launch intentionally selects Campaign, Challenge, achievements/Almanac, v2 migration and focused presentation/power-up work while deferring alternate board sizes, hazards, new species, Storehouse and weekly events. Where the roadmap is less specific than the approved authoritative spec, the spec controls this release.

---

## Final Game Assembly & Verification Checklist — shipped v1 evidence

- [x] Verify no uncaught Mergrove page errors in browser regressions; source has no game runtime console logging. Independent production-console inspection was unavailable because the external Playwright MCP endpoint returned 404, and this limitation is recorded rather than hidden.
- [x] Confirm viewport responsiveness at 320 CSS px and 200% text, with broader fluid layouts protected by the same CSS grid/flex constraints.
- [x] Validate state persistence and deterministic restart/loop behavior through unit, guest reload and account-emulator browser evidence.
- [x] Confirm all direct dependencies/devDependencies are current stable exact pins through the successful `dependency:check` and `dependency:current` gates in run `37553471015`.
- [x] Pass `pnpm validate`-equivalent CI on exact revision `965c91a5b9090da321ae3eb0d11f9383678b02c6`.
- [x] Pass GitHub Pages deployment and independently render `#/games/mergrove` from production at HTTP 200 with expected initial game state.
- [x] Synchronize `PRD.md`, `todo.md`, `TRACKER.md`, authoritative design, `docs/GAME_INDEX.md`, and applicable `.tasks/` records with final evidence.
- [x] Flip overall v1 status: `[Game development status: = 'Complete']` because every authoritative game-local v1 completion gate is satisfied.

## External continuation

TASK-003 still owns real Firebase Authentication/Firestore/rules/password-reset/live cross-browser verification. That shared platform task must remain distinct from Mergrove game-local evidence. The v2 migration can be implemented and emulator-tested without misrepresenting live Firebase completion; if later live verification exposes a Mergrove-specific defect, reopen the applicable Mergrove gate before changing implementation.
