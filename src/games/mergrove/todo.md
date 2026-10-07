# TODO: Mergrove (mergrove)

**Status:** Implementing  
**Last synchronized:** 2026-10-06  
**Architecture & Engine:** Static React/Vite game with a pure deterministic TypeScript 5 × 5 merge engine, repository-authored SVG sprites, and the shared versioned save platform.  
**Dependencies Used:**
- [x] `react@19.3.0`
- [x] `react-dom@19.3.0`
- [x] `firebase@12.19.0` — shared optional account/save platform only
- [x] `vite@8.3.3` — build/dev
- [x] `typescript@7.0.2` — development/type safety
- [x] `vitest@5.0.3` — unit verification
- [x] `playwright@1.63.0` — rendered browser verification

> Dependency rule: direct dependency and devDependency declarations remain exact pinned stable versions only; `^` and `~` are prohibited. Re-verify stable versions against authoritative project sources plus npmjs.com immediately before dependency-changing integration, then require `pnpm dependency:check` and `pnpm dependency:current` to pass.

---

## Core Feature Execution Pipeline

- [ ] **Deterministic Placement Board** `{id: 'MER-001'}` — `[feature development status: = 'Implemented; repository CI evidence pending']`
  - [x] **Purpose:** Own deterministic board, queue, RNG, placement, turn, and terminal rules outside React.
  - [x] **Inputs / Parameters:** Seed/RNG state, queue slot, board cell, current run state.
  - [x] **Dependencies Touched:** `engine.ts`; no third-party runtime dependency.
  - [x] **Technical Notes & Edge Cases:** Reject occupied/out-of-range placement; deterministic replacement draw; full-board recovery distinction.
  - [x] **Implementation Details:** Pure engine state transition with no DOM/storage/Firebase access.
  - [ ] **Verification & State Sign-off:** Repository unit/CI evidence must pass before setting `{feature development status: = 'Complete'}`.

- [ ] **Orthogonal Merge and Cascade Resolution** `{id: 'MER-002'}` — `[feature development status: = 'Implemented; repository CI evidence pending']`
  - [x] **Purpose:** Resolve connected equal-tier groups and deliberate chain reactions.
  - [x] **Inputs / Parameters:** Placement anchor, board, source tier, chain depth.
  - [x] **Dependencies Touched:** `engine.ts` only.
  - [x] **Technical Notes & Edge Cases:** Orthogonal only; placement anchor survives ordinary merge; repeat until stable.
  - [x] **Implementation Details:** Flood-fill group resolution and inspectable score formula.
  - [ ] **Verification & State Sign-off:** Basic merge/cascade/scoring repository tests must be green before Complete.

- [ ] **Eight-Tier Grove Progression and Ancient Bloom** `{id: 'MER-003'}` — `[feature development status: = 'Implemented; rendered verification pending']`
  - [x] **Purpose:** Supply the complete progression arc and a bounded terminal-tier event.
  - [x] **Inputs / Parameters:** Source tier/group size and highest-tier progress.
  - [x] **Dependencies Touched:** `engine.ts`, `sprites.tsx`, workspace presentation.
  - [x] **Technical Notes & Edge Cases:** Groveheart groups clear as ancient blooms; never overflow into undefined tier nine.
  - [x] **Implementation Details:** Eight authored SVG symbols plus engine highest-tier/ancient-bloom state.
  - [ ] **Verification & State Sign-off:** Engine + rendered sprite evidence required before Complete.

- [ ] **Sunlight and Compost Recovery** `{id: 'MER-004'}` — `[feature development status: = 'Implemented; repository CI evidence pending']`
  - [x] **Purpose:** Add earned strategic recovery without purchases, ads, or hidden rescues.
  - [x] **Inputs / Parameters:** Sunlight balance and occupied target cell.
  - [x] **Dependencies Touched:** Engine and workspace controls.
  - [x] **Technical Notes & Edge Cases:** Cost is four sunlight; removal consumes no queue piece and changes no score; full board with >=4 sunlight is recoverable.
  - [x] **Implementation Details:** Explicit Compost arm/cancel/target path using native controls.
  - [ ] **Verification & State Sign-off:** Compost and terminal/recoverable-board tests required before Complete.

- [ ] **Original Responsive SVG Presentation** `{id: 'MER-005'}` — `[feature development status: = 'Implemented; rendered browser evidence pending']`
  - [x] **Purpose:** Deliver crisp original game art and equivalent pointer/touch/keyboard play on device-agnostic layouts.
  - [x] **Inputs / Parameters:** Run state, queue selection, board cell actions, compost mode, save status.
  - [x] **Dependencies Touched:** React, CSS, authored `sprites.tsx`; no remote asset dependency.
  - [x] **Technical Notes & Edge Cases:** 320px, 200% text, >=44px controls, visible focus, non-color selection, reduced motion, no drag-only action.
  - [x] **Implementation Details:** Native buttons, responsive grid, ARIA state/names, polite status output, SVG symbol bank.
  - [ ] **Verification & State Sign-off:** Playwright rendered checks must pass before Complete.

- [ ] **Durable Guest and Optional Account Progress** `{id: 'MER-006'}` — `[feature development status: = 'Implemented; emulator/live evidence pending']`
  - [x] **Purpose:** Preserve best progress and active deterministic runs across reload; optionally sync account progress.
  - [x] **Inputs / Parameters:** `bestScore`, `bestTier`, validated `activeRun`, schema version 1.
  - [x] **Dependencies Touched:** Shared save contracts/platform; Firebase only through shared optional platform.
  - [x] **Technical Notes & Edge Cases:** Reject malformed runs; game-scoped reset; cloud-existing state must not be overwritten by unrelated guest data.
  - [x] **Implementation Details:** Versioned decoder and shared `useGameSave` workspace integration.
  - [ ] **Verification & State Sign-off:** Guest reload + emulator account checkpoint/reset evidence required; live project remains TASK-003 until provisioned.

- [ ] **Catalog and Production Integration** `{id: 'MER-007'}` — `[feature development status: = 'Integrated; CI/deployment evidence pending']`
  - [x] **Purpose:** Make Mergrove discoverable and production-routable without breaking existing games.
  - [x] **Inputs / Parameters:** Catalog metadata, lazy registry, game index, game docs, shared validation.
  - [x] **Dependencies Touched:** Catalog/workspaces/styles/tests/docs; no new dependency.
  - [x] **Technical Notes & Edge Cases:** Preserve parallel-agent changes; no open feature PR; docs must remain self-sufficient.
  - [x] **Implementation Details:** `#/games/mergrove` catalog and lazy workspace wiring exists on `main`.
  - [ ] **Verification & State Sign-off:** Exact-revision full validation + Pages deployment + deployed smoke evidence required before Complete.

---

## Final Game Assembly & Verification Checklist

- [ ] Verify zero uncaught console warnings and strict current MDN/W3C/WCAG runtime compliance.
- [ ] Confirm viewport responsiveness across mobile, tablet, laptop, desktop, and large displays, including 320 CSS px and 200% text.
- [ ] Validate state persistence and deterministic restart/loop behavior.
- [ ] Confirm all direct dependencies/devDependencies are latest stable exact pins at integration time, with authoritative-source + npmjs.com corroboration and no `^`/`~`.
- [ ] Pass `pnpm validate` on the exact integrated revision.
- [ ] Pass GitHub Pages deployment and smoke-test `#/games/mergrove` without game-local console/page errors.
- [ ] Synchronize `PRD.md`, `todo.md`, `TRACKER.md`, authoritative design, `docs/GAME_INDEX.md`, and applicable `.tasks/` records with final evidence.
- [ ] Flip overall status: set `[Game development status: = 'Complete']` only when every authoritative completion gate is satisfied.
