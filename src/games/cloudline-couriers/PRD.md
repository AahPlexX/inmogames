# PRD: Cloudline Couriers (`cloudline-couriers`)

**Last synchronized:** 2026-10-06  
**Status:** Implementing  
**Authoritative design:** `docs/specs/2026-10-06-cloudline-couriers-design.md`  
**Execution checklist:** `src/games/cloudline-couriers/todo.md`  
**Tracker:** `src/games/cloudline-couriers/TRACKER.md`

```yaml
Planned Functional Features Specification:
  game_identity:
    name: "Cloudline Couriers"
    slug: "cloudline-couriers"
    development_status: "Implementing"

  technical_foundation:
    architecture_and_engine: "Original single-player 16-stop skyway strategy game for the static React/Vite InMo Games architecture. Pure deterministic TypeScript rules engine; React presentation; shared versioned save platform; repository-authored vector sprite system is in TDD. Genre-level roll/move/event/earn/upgrade/progress inspiration only; no Monopoly/Monopoly GO names, art, board, economy, maps, events, UI, text, trade dress, or proprietary content."
    dependencies_used:
      - "react@19.3.0"
      - "react-dom@19.3.0"
      - "firebase@12.19.0 (shared optional account/save platform only)"
      - "vite@8.3.3 (build/dev)"
      - "typescript@7.0.2 (development/type safety)"
      - "vitest@5.0.3 (unit verification)"
      - "playwright@1.63.0 (rendered browser verification)"

  core_feature_specifications:
    - name: "Skyway Board Loop"
      id: "CLC-001"
      details: "A 16-stop circular skyway with deterministic d6 movement. Player selects an affordable 1x/2x/3x flight boost, moves the courier, resolves the destination stop, and receives a district-scaled circuit bonus when crossing Dispatch Dock."
      feature_development_status: "Implemented in source with unit coverage; focused browser verification pending"

    - name: "Original Tile Event System"
      id: "CLC-002"
      details: "Resolve original Market, Workshop, Beacon, Storm, Windgate, Dispatch Dock, and Cargo Cache stops. Events alter credits, fuel, shield state, movement, delivery streak, or cargo encounter state through deterministic engine transitions."
      feature_development_status: "Implemented in source with deterministic unit coverage; browser event-matrix verification pending"

    - name: "Courier Economy and Flight Boost"
      id: "CLC-003"
      details: "Use earned sky credits and finite fuel only; no purchases, ads, gambling, real-money value, or dark patterns. Boost consumes additional fuel to multiply eligible earnings. A no-dead-end emergency reserve prevents an unwinnable zero-fuel save."
      feature_development_status: "Implemented in source; focused economy/browser verification pending"

    - name: "Landmark and District Progression"
      id: "CLC-004"
      details: "Four original landmarks each have four upgrade stages. Credits purchase upgrades; completing all four advances the district, resets landmark stages, awards a completion bonus, and restores fuel."
      feature_development_status: "Implemented in engine/UI and durably persisted; broader progression/browser verification pending"

    - name: "Cargo Cache Encounter"
      id: "CLC-005"
      details: "Landing on Cargo Cache pauses flight and opens a three-pod choice encounter with deterministic seeded rewards. All choices remain keyboard/touch accessible and do not imitate opponent attack/heist systems."
      feature_development_status: "Implemented in engine/UI/save schema; deterministic focus/reduced-motion browser evidence pending"

    - name: "Delivery Streak and Shield Strategy"
      id: "CLC-006"
      details: "Successful delivery stops advance a four-step streak that pays an original route bonus; Storm stops consume an active shield or impose a bounded setback and reset the streak; Beacons grant shields."
      feature_development_status: "Implemented in engine/save schema; focused edge/browser verification pending"

    - name: "Original Vector Sprite and Animation System"
      id: "CLC-007"
      details: "Repository-authored SVG airship, clouds, cargo, landmarks, beacon, market, workshop, storm, windgate and dispatch art. CSS/SVG motion covers courier arrival/bobbing and visual feedback while prefers-reduced-motion removes nonessential animation. No remote sprite/CDN/font dependency. A browser regression requires >=21 rendered sprite instances, the airship courier, every tile and all four landmarks plus reduced-motion suppression."
      feature_development_status: "TDD RED regression integrated; sprite implementation pending"

    - name: "Responsive Accessible Game Surface"
      id: "CLC-008"
      details: "Device-agnostic 5x5 perimeter layout with native buttons, keyboard parity, visible focus, non-color state, >=44 CSS-pixel important targets, 320 CSS-pixel reflow, 200% text support, touch/pointer equivalence, restrained live regions, no drag-only action, and no essential timing."
      feature_development_status: "Base surface implemented; rendered responsive/accessibility verification pending"

    - name: "Durable Career Save"
      id: "CLC-009"
      details: "Schema-v1 save preserves the deterministic active career: credits, fuel, position, district, landmark stages, shield/streak, career counters, RNG, pending Cargo Cache and last roll. Guests use the shared local repository; authenticated users use the shared account-save platform. Workflow 37554746482 proves RED. Revision 232102f4 / workflow 37555538295 verifies defensive decoding, guest reload, cross-browser emulator restoration and game-scoped reset. Live configured Firebase remains TASK-003."
      feature_development_status: "Verified in revision 232102f4 / workflow 37555538295; live Firebase externally blocked by TASK-003"

    - name: "Catalog, Documentation, and Production Integration"
      id: "CLC-010"
      details: "Integrate metadata, lazy workspace, catalog, tests, authoritative design spec, TRACKER.md, PRD.md, todo.md, GAME_INDEX and task state. Pass dependency freshness, TypeScript, unit, browser, responsive/accessibility, builds, Pages deployment and deployed smoke checks before Complete."
      feature_development_status: "Source/catalog/document integration present; final exact-revision validation/deployment evidence pending"

  quality_and_completion_contract:
    originality_boundary: "Genre-level inspiration only. Do not copy Monopoly GO or Monopoly trademarks, character/property names, board geometry, art, sound, event names, currency presentation, UI/trade dress, text, map structure, or proprietary event/minigame implementation."
    dependency_policy: "All direct dependencies and devDependencies are exact pinned stable versions. No ^ or ~. At dependency-changing integration time, verify current stable versions against authoritative project sources and corroborate with npmjs.com, then require repository dependency checks to pass."
    documentation_policy: "Canonical PRD.md and todo.md live in src/games/cloudline-couriers and remain synchronized with TRACKER.md, the authoritative design spec, GAME_INDEX and applicable task state. Repository state, not chat history, must be sufficient for another provider to continue."
    branch_policy: "Refresh origin/main immediately before integration, preserve parallel-agent work, commit directly to main using concurrency-safe behavior, and leave no feature PR open."
    complete_definition: "Complete only after every PRD/todo feature is implemented or explicitly excluded, all authoritative completion gates are checked, exact-revision validation is green, Pages deployment succeeds, and the deployed route passes smoke/accessibility/responsive checks."
```

## Product intent

Cloudline Couriers is the dedicated original board-loop title requested for the Monopoly GO-like category. The similarity target is the high-level satisfaction loop—roll, move, resolve a board stop, earn resources, upgrade a visible world, and advance—while the fiction, systems, events, economy, art, progression and interaction language remain InMo-original.

## Continuation rule

Any provider resuming this game must begin with this PRD, `todo.md`, `TRACKER.md`, and the authoritative design spec. Any represented scope, implementation, verification, dependency, or completion change must reconcile those documents during the same development cycle. Never infer completion from chat history; exact evidence belongs in-repo.
