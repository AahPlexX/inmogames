# Threefold Execution Todo

**Status:** Verified; no open game-local implementation work.  
**Architecture / engine:** React/Vite workspace over a pure deterministic TypeScript engine.  
**Dependencies:**
- [x] Uses repository exact-pinned dependency set; no game-local package dependency.
- [x] Runtime network is restricted to the shared optional Firebase account/save platform.
- [x] No third-party visual/audio/font/gameplay asset dependency.

## Core Feature Execution Pipeline

### THR-001 — Deterministic Solvable Round Engine
**Purpose:** Guarantee playable nine-tile arithmetic rounds and accept every valid three-tile solution.  
**Inputs:** deterministic generation state; tile values; player selection.  
**Dependencies Touched:** TypeScript engine and unit tests only.  
**Technical Notes & Edge Cases:** round generation must remain guaranteed-solvable; correctness belongs in the engine, not React.  
**Implementation Details:** pure deterministic engine with generation/property-style coverage.  
**Verification & State Sign-off:**
- [x] Deterministic engine verified.
- [x] Guaranteed-solvable generation verified.
- [x] Alternate valid solutions accepted.

### THR-002 — Five-Round Run and Scoring
**Purpose:** Deliver the complete run, score progression, result feedback, and completion state.  
**Inputs:** round outcomes and misses.  
**Dependencies Touched:** engine, workspace, unit/browser tests.  
**Technical Notes & Edge Cases:** preserve 100-point round basis, 20-point miss penalty, and 20-point floor.  
**Implementation Details:** five-round progression with per-round and final feedback.  
**Verification & State Sign-off:**
- [x] Five-round progression verified.
- [x] Score floor/penalty semantics verified.
- [x] Completion/results behavior verified.

### THR-003 — Accessible Responsive Board
**Purpose:** Keep the complete game usable across device classes and input modes.  
**Inputs:** pointer, touch, keyboard, viewport/text scaling, reduced-motion preference.  
**Dependencies Touched:** React workspace, CSS, design-browser tests.  
**Technical Notes & Edge Cases:** native buttons, visible focus, non-color selection, no 320px horizontal overflow.  
**Implementation Details:** responsive 3×3 board with `aria-pressed`, visible check state, 44px targets, and reduced-motion handling.  
**Verification & State Sign-off:**
- [x] Pointer/touch/keyboard parity verified.
- [x] 320 CSS-px and 200% text reflow verified.
- [x] Focus, target sizing, non-color state, and reduced motion verified.

### THR-004 — Durable Best Score
**Purpose:** Preserve best completed score without making persistence a gameplay dependency.  
**Inputs:** completed score; guest/account save state; reset request.  
**Dependencies Touched:** shared save contracts/repositories and browser/emulator tests.  
**Technical Notes & Edge Cases:** malformed/legacy/blocked storage must fail defensively; live configured Firebase remains TASK-003.  
**Implementation Details:** schema-v1 guest best-score save plus shared account synchronization/reset.  
**Verification & State Sign-off:**
- [x] Guest persistence and reset verified.
- [x] Shared account path verified in emulator.
- [ ] Real deployed Firebase project verification — externally blocked by TASK-003.

### THR-005 — Catalog and Production Integration
**Purpose:** Keep Threefold discoverable, lazy-loaded, documented, regression-protected, and deployable.  
**Inputs:** metadata, registry, catalog, documentation, CI/deployment.  
**Dependencies Touched:** catalog, lazy workspace registry, GAME_INDEX, spec/tracker/task docs, repository checks.  
**Technical Notes & Edge Cases:** future implementation changes must reopen synchronized completion state before code changes are called complete.  
**Implementation Details:** integrated catalog/registry and production verification chain.  
**Verification & State Sign-off:**
- [x] Catalog and lazy workspace verified.
- [x] Full validation and Pages deployment evidence recorded in TRACKER.md.
- [x] Spec/tracker/index/task state synchronized for verified implementation.

## Final Game Assembly & Verification Checklist

- [x] Zero known uncaught game-local console failures; current MDN/W3C/WCAG-oriented interaction requirements covered by repository browser/design gates.
- [x] Responsive behavior verified at mobile, tablet/laptop/desktop catalog/game surfaces, including 320 CSS px and 200% text.
- [x] Guest persistence is deterministic across restart/reload for the defined best-score schema.
- [x] Exact dependency policy is repository-enforced; future dependency integration must re-verify current stable releases and retain exact pins without `^` or `~`.
- [x] TRACKER, authoritative spec, GAME_INDEX, and task state agree on verified game-local status.
- [x] Full repository validation and Pages deployment evidence are recorded in TRACKER.md.
- [x] Overall game-local state is Complete/Verified; TASK-003 remains an explicitly external live-Firebase platform blocker.

**Continuation rule:** a new feature, material UI/rule/persistence change, or discovered defect immediately reopens the applicable item above and the matching PRD/spec/TRACKER state before implementation is considered complete.
