# PRD: Mergrove (`mergrove`)

**Last synchronized:** 2026-10-06  
**Authoritative design:** `docs/specs/2026-10-06-mergrove-design.md`  
**Execution checklist:** `src/games/mergrove/todo.md`  
**Tracker:** `src/games/mergrove/TRACKER.md`

```yaml
Planned Functional Features Specification:
  game_identity:
    name: "Mergrove"
    slug: "mergrove"
    development_status: "Complete"

  technical_foundation:
    architecture_and_engine: "Static React/Vite client. Pure deterministic TypeScript 5x5 merge engine; React presentation; repository-authored inline SVG sprite bank; versioned shared save contract using localStorage for guests and the shared optional Firebase account-save platform for authenticated players. No game-specific runtime network or external asset dependency."
    dependencies_used:
      - "react@19.3.0"
      - "react-dom@19.3.0"
      - "firebase@12.19.0 (shared optional account/save platform only)"
      - "vite@8.3.3 (build/dev)"
      - "typescript@7.0.2 (development/type safety)"
      - "vitest@5.0.3 (unit verification)"
      - "playwright@1.63.0 (rendered browser verification)"

  core_feature_specifications:
    - name: "Deterministic Placement Board"
      id: "MER-001"
      details: "Own the 5x5 board, deterministic three-piece queue, seeded RNG state, legal empty-cell placement, turn progression, invalid-action rejection, and terminal-state calculation in pure engine.ts. No DOM, React, persistence, Firebase, or sprite concerns may enter the rules engine."
      feature_development_status: "Complete — unit/CI verified on revision 965c91a5b9090da321ae3eb0d11f9383678b02c6 / run 37553471015"

    - name: "Orthogonal Merge and Cascade Resolution"
      id: "MER-002"
      details: "Merge orthogonally connected groups of at least three equal tiers at the placement anchor; resolve immediate cascades at that anchor; calculate inspectable group/tier/chain scoring; never merge diagonally."
      feature_development_status: "Complete — engine regressions green in run 37553471015"

    - name: "Eight-Tier Grove Progression and Ancient Bloom"
      id: "MER-003"
      details: "Progress Seed, Sprout, Bud, Bloom, Sapling, Lantern Tree, Elder Tree, Groveheart. A qualifying Groveheart group resolves as an ancient bloom that clears the group rather than inventing a ninth tier. Track highest tier and ancient-bloom count."
      feature_development_status: "Complete — unit and rendered-browser evidence green in run 37553471015"

    - name: "Sunlight and Compost Recovery"
      id: "MER-004"
      details: "Award sunlight from merges. Spending four sunlight arms Compost and removes one occupied cell without consuming a queue piece or changing score. A full board is terminal only when sunlight is below the recovery cost."
      feature_development_status: "Complete — recovery/terminal regressions green in run 37553471015"

    - name: "Original Responsive SVG Presentation"
      id: "MER-005"
      details: "Render all eight tiers from repository-authored SVG symbols. Use native buttons for queue and board interaction; support pointer, touch, keyboard, visible focus, non-color selection, >=44 CSS-pixel primary targets, 320px reflow, 200% text, and prefers-reduced-motion. No remote art/font/CDN dependency."
      feature_development_status: "Complete — Mergrove design-browser checks green in run 37553471015"

    - name: "Durable Guest and Optional Account Progress"
      id: "MER-006"
      details: "Persist bestScore, bestTier, and a structurally validated active deterministic run under schema v1. Guests use local storage through the shared repository; authenticated users use the shared Firebase account-save path. Reset is game-scoped. Live Firebase verification remains external TASK-003."
      feature_development_status: "Complete for game-local/repository scope — guest reload and Auth/Firestore emulator cross-browser/reset evidence green in run 37553471015; real configured-project verification remains TASK-003"

    - name: "Catalog and Production Integration"
      id: "MER-007"
      details: "Expose #/games/mergrove through catalog metadata and lazy workspace registration, keep GAME_INDEX/spec/tracker/PRD/todo synchronized, pass the complete pnpm validate chain, deploy through the existing GitHub Pages workflow, and smoke-test the deployed route before Complete status."
      feature_development_status: "Complete — exact revision 965c91a5b9090da321ae3eb0d11f9383678b02c6 passed run 37553471015 and Pages deployment; fresh live render returned HTTP 200 with expected initial state"

  quality_and_completion_contract:
    accessibility: "WCAG 2.2 AA-oriented native-control interaction; no drag-only or timing requirement; visible focus; reduced-motion path; responsive 320px/200% reflow evidence verified."
    originality_and_assets: "Original Mergrove rules/presentation and repository-authored SVG art. No third-party visual/audio/font assets and no runtime asset service."
    dependency_policy: "All direct dependencies and devDependencies are exact pinned stable versions; revision 965c91a5b9090da321ae3eb0d11f9383678b02c6 passed pnpm dependency:check and pnpm dependency:current in run 37553471015."
    documentation_policy: "PRD.md, todo.md, TRACKER.md, authoritative design spec, GAME_INDEX, and task ledgers are synchronized with the final game-local verification state."
    branch_policy: "Integrated directly to origin/main with concurrency-safe refresh behavior; no feature branch or PR is part of Mergrove delivery."
    complete_definition: "Satisfied game-locally by the authoritative verified Completion contract and run 37553471015. TASK-003 remains a separate shared live-Firebase platform blocker and is not represented as completed."
```

## Final evidence

- Exact verified game-inclusive revision: `965c91a5b9090da321ae3eb0d11f9383678b02c6`.
- Validation + Pages workflow: `37553471015`, build and deploy both successful.
- Mergrove rendered browser test: 25 cells, three queue pieces, trio merge, guest reload, keyboard input, 44px targets, 320px/200% reflow and reduced motion.
- Mergrove Auth/Firestore emulator test: authenticated save, second-browser restoration and game-scoped reset.
- Fresh production render: HTTP 200 at `#/games/mergrove` with expected three-Seed queue and empty 25-cell board.
- Live configured-project Firebase matrix: not yet complete; owned by TASK-003.

## Continuation rule

A future agent must read this PRD, `todo.md`, `TRACKER.md`, and the authoritative design before changing Mergrove. Chat history is not authoritative. New game-local behavior, a material UI change or a discovered unresolved defect reopens the authoritative completion contract and must update these documents together.
