# PRD: Cloudline Couriers (`cloudline-couriers`)

**Last synchronized:** 2026-10-06  
**Status:** Implementing  
**Planned route:** `#/games/cloudline-couriers`  
**Execution checklist:** `docs/games/cloudline-couriers/todo.md`

```yaml
Planned Functional Features Specification:
  game_identity:
    name: "Cloudline Couriers"
    slug: "cloudline-couriers"
    development_status: "Implementing"

  technical_foundation:
    architecture_and_engine: "Original single-player board-loop strategy game for the existing static React/Vite InMo Games architecture. Pure deterministic TypeScript rules engine; React presentation; original repository-authored vector sprite system; optional shared save platform. The design uses the broad roll/move/event/earn/upgrade/progress genre loop but does not copy Monopoly GO names, art, board, economy, maps, events, UI, text, trade dress, or proprietary content."
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
      details: "A 16-stop circular skyway with deterministic movement. Player rolls locally, applies 1x/2x/3x flight boost where affordable, moves a courier airship, resolves the destination tile, and receives a full-circuit delivery bonus when crossing Dispatch Dock. Board layout, tile names, economy, visuals, and progression are original."
      feature_development_status: "Engine implementation prepared; integration pending"

    - name: "Original Tile Event System"
      id: "CLC-002"
      details: "Resolve original Market, Workshop, Beacon, Storm, Windgate, Dispatch Dock, and Cargo Cache stops. Events alter credits, fuel/roll supply, shield state, movement, delivery streak, or cargo encounter state through deterministic engine transitions."
      feature_development_status: "Engine implementation prepared; integration pending"

    - name: "Courier Economy and Flight Boost"
      id: "CLC-003"
      details: "Use earned sky credits and finite fuel rolls only; no purchases, ads, gambling, real-money value, or dark patterns. Flight boost consumes additional fuel to multiply eligible tile rewards and introduces explicit risk/reward. A no-dead-end refuel rule prevents an unwinnable zero-fuel save."
      feature_development_status: "Engine implementation prepared; integration pending"

    - name: "Landmark and District Progression"
      id: "CLC-004"
      details: "Four original landmarks each have four upgrade stages. Credits purchase upgrades; completing all four landmarks advances the district, raises progression rewards, and resets landmark stages for the next district while preserving durable career progress."
      feature_development_status: "Engine implementation prepared; integration pending"

    - name: "Cargo Cache Encounter"
      id: "CLC-005"
      details: "Landing on Cargo Cache opens a short choice-based cache encounter rather than a copied heist/attack system. Player chooses among distinct sealed cargo pods with deterministic seeded contents and clear accessible feedback. No opponent simulation or copied proprietary minigame."
      feature_development_status: "Designed; implementation/integration pending"

    - name: "Delivery Streak and Shield Strategy"
      id: "CLC-006"
      details: "Successful delivery-oriented stops advance a four-step streak that pays an original route bonus; Storm stops consume an active shield or impose a bounded setback. Beacon stops grant shields. State is textual as well as visual."
      feature_development_status: "Engine implementation prepared; integration pending"

    - name: "Original Vector Sprite and Animation System"
      id: "CLC-007"
      details: "Repository-authored SVG airship, clouds, cargo, landmarks, beacon, market, workshop, storm, windgate and token art. CSS/SVG transforms provide movement, dice/fuel-roll, landing, reward, upgrade and celebration motion while prefers-reduced-motion removes nonessential motion. No remote sprite/CDN/font dependency."
      feature_development_status: "Art direction prepared; integration/rendered verification pending"

    - name: "Responsive Accessible Game Surface"
      id: "CLC-008"
      details: "Device-agnostic normal-flow layout with native buttons, keyboard parity, visible focus, non-color state, >=44 CSS-pixel targets, 320 CSS-pixel reflow, 200% text support, touch/pointer equivalence, restrained live regions, no drag-only action, and no essential timing."
      feature_development_status: "UI architecture prepared; rendered verification pending"

    - name: "Durable Career Save"
      id: "CLC-009"
      details: "Versioned save stores credits, fuel, position, district, landmark stages, shield/streak and durable career counters. Guests use shared local persistence; authenticated users use the shared optional Firebase account-save platform. Live Firebase verification remains separate under TASK-003."
      feature_development_status: "Designed; implementation/integration pending"

    - name: "Catalog, Documentation, and Production Integration"
      id: "CLC-010"
      details: "Integrate metadata, lazy workspace, catalog art, tests, authoritative design spec, TRACKER.md, PRD.md, todo.md, GAME_INDEX and task state in concurrency-safe origin/main commits. Pass dependency freshness, TypeScript, unit, browser, responsive/accessibility, builds, Pages deployment and deployed smoke checks before Complete."
      feature_development_status: "Planning documents integrated; game integration pending"

  quality_and_completion_contract:
    originality_boundary: "Genre-level inspiration only. Do not copy Monopoly GO or Monopoly trademarks, character/property names, board geometry, art, sound, event names, currency presentation, UI/trade dress, text, map structure, or proprietary event/minigame implementation."
    dependency_policy: "All direct dependencies and devDependencies are exact pinned stable versions. No ^ or ~. At dependency-changing integration time, verify current stable versions against authoritative project sources and corroborate with npmjs.com, then require repository dependency checks to pass."
    documentation_policy: "PRD.md and todo.md are mandatory per game. Once source integration begins, add and continuously synchronize the game-local TRACKER.md, authoritative design spec, GAME_INDEX row and applicable task ledger. Repository state, not chat history, must be sufficient for another provider to continue."
    branch_policy: "Refresh origin/main immediately before integration, preserve parallel-agent work, commit directly to main using concurrency-safe behavior, and leave no feature PR open."
    complete_definition: "Complete only after every PRD/todo feature is implemented or explicitly excluded, all authoritative completion gates are checked, exact-revision validation is green, Pages deployment succeeds, and the deployed route passes smoke/accessibility/responsive checks."
```

## Product intent

Cloudline Couriers is the dedicated original board-loop title requested for the Monopoly GO-like category. The similarity target is the high-level satisfaction loop—roll, move, resolve a board stop, earn resources, upgrade a visible world, and advance—while the actual fiction, systems, events, economy, art, progression and interaction language remain InMo-original.

## Continuation rule

Any agent resuming this game must begin with this PRD and `todo.md`. When source files are integrated, the same commit must establish the authoritative design spec and game-local tracker required by repository policy. Never infer completion from chat history; record exact verification evidence in-repo.
