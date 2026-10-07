# TODO: Mergrove (mergrove)

**Status:** Complete  
**Last synchronized:** 2026-10-06  
**Architecture & Engine:** Static React/Vite game with a pure deterministic TypeScript 5 × 5 merge engine, repository-authored SVG sprites, and the shared versioned save platform.  
**Verified evidence:** revision `965c91a5b9090da321ae3eb0d11f9383678b02c6`, GitHub Actions run `37553471015`, plus fresh HTTP-200 deployed-route render.  
**Dependencies Used:**
- [x] `react@19.3.0`
- [x] `react-dom@19.3.0`
- [x] `firebase@12.19.0` — shared optional account/save platform only
- [x] `vite@8.3.3` — build/dev
- [x] `typescript@7.0.2` — development/type safety
- [x] `vitest@5.0.3` — unit verification
- [x] `playwright@1.63.0` — rendered browser verification

> Dependency rule: direct dependency and devDependency declarations remain exact pinned stable versions only; `^` and `~` are prohibited. Revision `965c91a5b9090da321ae3eb0d11f9383678b02c6` passed both dependency gates in run `37553471015`.

---

## Core Feature Execution Pipeline

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

## Final Game Assembly & Verification Checklist

- [x] Verify no uncaught Mergrove page errors in browser regressions; source has no game runtime console logging. Independent production-console inspection was unavailable because the external Playwright MCP endpoint returned 404, and this limitation is recorded rather than hidden.
- [x] Confirm viewport responsiveness at 320 CSS px and 200% text, with broader fluid layouts protected by the same CSS grid/flex constraints.
- [x] Validate state persistence and deterministic restart/loop behavior through unit, guest reload and account-emulator browser evidence.
- [x] Confirm all direct dependencies/devDependencies are current stable exact pins through the successful `dependency:check` and `dependency:current` gates in run `37553471015`.
- [x] Pass `pnpm validate`-equivalent CI on exact revision `965c91a5b9090da321ae3eb0d11f9383678b02c6`.
- [x] Pass GitHub Pages deployment and independently render `#/games/mergrove` from production at HTTP 200 with expected initial game state.
- [x] Synchronize `PRD.md`, `todo.md`, `TRACKER.md`, authoritative design, `docs/GAME_INDEX.md`, and applicable `.tasks/` records with final evidence.
- [x] Flip overall status: `[Game development status: = 'Complete']` because every authoritative game-local completion gate is satisfied.

## External continuation

TASK-003 still owns real Firebase Authentication/Firestore/rules/password-reset/live cross-browser verification. That shared platform task must remain distinct from this completed Mergrove game-local checklist. If later live verification exposes a Mergrove-specific defect, reopen MER-006 and the authoritative Completion contract before changing implementation.
