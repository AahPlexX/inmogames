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
    development_status: "Implementing"

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
      feature_development_status: "Implemented; repository CI evidence pending"

    - name: "Orthogonal Merge and Cascade Resolution"
      id: "MER-002"
      details: "Merge orthogonally connected groups of at least three equal tiers at the placement anchor; resolve immediate cascades at that anchor; calculate inspectable group/tier/chain scoring; never merge diagonally."
      feature_development_status: "Implemented; repository CI evidence pending"

    - name: "Eight-Tier Grove Progression and Ancient Bloom"
      id: "MER-003"
      details: "Progress Seed, Sprout, Bud, Bloom, Sapling, Lantern Tree, Elder Tree, Groveheart. A qualifying Groveheart group resolves as an ancient bloom that clears the group rather than inventing a ninth tier. Track highest tier and ancient-bloom count."
      feature_development_status: "Implemented; rendered verification pending"

    - name: "Sunlight and Compost Recovery"
      id: "MER-004"
      details: "Award sunlight from merges. Spending four sunlight arms Compost and removes one occupied cell without consuming a queue piece or changing score. A full board is terminal only when sunlight is below the recovery cost."
      feature_development_status: "Implemented; repository CI evidence pending"

    - name: "Original Responsive SVG Presentation"
      id: "MER-005"
      details: "Render all eight tiers from repository-authored SVG symbols. Use native buttons for queue and board interaction; support pointer, touch, keyboard, visible focus, non-color selection, >=44 CSS-pixel primary targets, 320px reflow, 200% text, and prefers-reduced-motion. No remote art/font/CDN dependency."
      feature_development_status: "Implemented; rendered browser evidence pending"

    - name: "Durable Guest and Optional Account Progress"
      id: "MER-006"
      details: "Persist bestScore, bestTier, and a structurally validated active deterministic run under schema v1. Guests use local storage through the shared repository; authenticated users use the shared Firebase account-save path. Reset is game-scoped. Live Firebase verification remains external TASK-003."
      feature_development_status: "Implemented; emulator/live evidence pending"

    - name: "Catalog and Production Integration"
      id: "MER-007"
      details: "Expose #/games/mergrove through catalog metadata and lazy workspace registration, keep GAME_INDEX/spec/tracker/PRD/todo synchronized, pass the complete pnpm validate chain, deploy through the existing GitHub Pages workflow, and smoke-test the deployed route before Complete status."
      feature_development_status: "Integrated; CI/deployment evidence pending"

  quality_and_completion_contract:
    accessibility: "WCAG 2.2 AA-oriented native-control interaction; no drag-only or timing requirement; visible focus; reduced-motion path; responsive 320px/200% reflow evidence required."
    originality_and_assets: "Original Mergrove rules/presentation and repository-authored SVG art. No third-party visual/audio/font assets and no runtime asset service."
    dependency_policy: "All direct dependencies and devDependencies must be exact pinned stable versions with no ^ or ~. Immediately before any integration that changes dependency state, verify current stable versions against authoritative project documentation/registries and corroborate with npmjs.com; pnpm dependency:check and pnpm dependency:current must pass."
    documentation_policy: "PRD.md, todo.md, TRACKER.md, authoritative design spec, GAME_INDEX, and task ledgers must be synchronized with implementation/evidence in the same integration whenever their represented state changes."
    branch_policy: "Integrate directly to origin/main with concurrency-safe refresh/lease behavior; do not leave feature PRs open."
    complete_definition: "Complete only when the authoritative design Completion contract is fully checked and exact-revision CI, rendered-browser, persistence/emulator, Pages deployment, and deployed smoke evidence are recorded."
```

## Continuation rule

A future agent must read this PRD, `todo.md`, `TRACKER.md`, and the authoritative design before changing Mergrove. Chat history is not authoritative. If implementation or evidence changes, update the affected documents together so the repository remains a sufficient handoff on its own.
