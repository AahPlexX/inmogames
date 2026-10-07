# Threefold Product Requirements Document

Planned Functional Features Specification:
  game_identity:
    name: "Threefold"
    slug: "threefold"
    development_status: "Verified"

  technical_foundation:
    architecture_and_engine: "Static React/Vite presentation over a pure deterministic TypeScript game engine, with shared repository persistence and optional account synchronization. The authoritative behavioral contract is docs/specs/2026-10-03-threefold-design.md; TRACKER.md is the live handoff."
    dependencies_used:
      - "react@19.3.0"
      - "react-dom@19.3.0"
      - "firebase@12.19.0 (shared optional account saves only)"
      - "vite@8.3.3"
      - "typescript@7.0.2"
      - "vitest@5.0.3"
      - "@playwright/test@1.63.0"

  core_feature_specifications:
    - name: "Deterministic Solvable Round Engine"
      id: "THR-001"
      details: "Generate guaranteed-solvable nine-tile rounds and accept any mathematically valid three-tile solution through the pure engine boundary."
      feature_development_status: "Verified"
    - name: "Five-Round Run and Scoring"
      id: "THR-002"
      details: "Run five rounds with a 100-point round basis, 20-point miss penalty, 20-point floor, per-round result feedback, and final completion state."
      feature_development_status: "Verified"
    - name: "Accessible Responsive Board"
      id: "THR-003"
      details: "Provide a responsive 3×3 native-button board with pointer/touch/keyboard parity, visible focus, non-color selection state, 44px targets, reduced-motion behavior, 320px reflow, and 200% text support."
      feature_development_status: "Verified"
    - name: "Durable Best Score"
      id: "THR-004"
      details: "Persist the best completed score defensively for guests and through the shared account-save layer when configured; support game-scoped reset."
      feature_development_status: "Verified with live Firebase externally blocked by TASK-003"
    - name: "Catalog and Production Integration"
      id: "THR-005"
      details: "Register metadata and lazy workspace loading, keep spec/tracker/index/task state synchronized, and protect behavior with unit, browser, design-browser, build, and deployment evidence."
      feature_development_status: "Verified"

## Continuation contract

This PRD is an inventory, not a replacement for the authoritative design spec. Any future feature or defect reopens the matching feature here, the authoritative spec completion contract, `TRACKER.md`, and `todo.md` in the same implementation cycle. Current verified evidence and external blockers are recorded in `TRACKER.md`.
