# Royal Fortune Slots PRD

Planned Functional Features Specification:
  game_identity:
    name: "Royal Fortune Slots"
    slug: "royal-fortune-slots"
    development_status: "Implementing — initial production integration under validation"

  technical_foundation:
    architecture_and_engine: "React/TypeScript presentation over pure five-reel payline engine, explicit source-controlled reel strips/paytable, versioned shared save repository, procedural Web Audio, responsive game-scoped CSS."
    dependencies_used: ["react 19.3.0", "react-dom 19.3.0", "firebase 13.0.0", "vitest 5.0.3", "playwright 1.64.0"]

  core_feature_specifications:
    - name: "Fixed five-reel slot engine"
      id: "RFS-001"
      details: "5x3 visible reel window; 20 immutable paylines; explicit 32-stop reel strips; production crypto.getRandomValues stop selection; deterministic injected random source for tests; no adaptive odds."
      feature_development_status: "Implemented — validation pending"

    - name: "Wild, Scatter and free-spin rules"
      id: "RFS-002"
      details: "Wild substitutes for normal symbols only; Scatter pays independently; 3/4/5 Scatters trigger 8/12/20 free spins; free-spin retriggers add five; winning free spins advance line multiplier to a maximum of x5."
      feature_development_status: "Implemented — validation pending"

    - name: "Practice bankroll and durable checkpoints"
      id: "RFS-003"
      details: "2,500 initial virtual credits; wagers 5/10/20/40/100; settled bankroll/statistics/preferences plus fully settled free-spin checkpoints persist locally and through the shared optional account-save platform. In-flight reel animation is excluded from durable state."
      feature_development_status: "Implemented — validation pending"

    - name: "Responsive accessible machine"
      id: "RFS-004"
      details: "Native button controls; rules/paytable disclosure; polite aggregate result announcements; >=48px primary targets; 320px and 200%-text reflow target; reduced-motion support; player-paced free spins; no autoplay."
      feature_development_status: "Implemented — browser validation pending"

    - name: "Probability transparency and audit"
      id: "RFS-005"
      details: "Source-controlled strip composition/paytable support exact base-game probability analysis and feature-return audit. Tracker must record final probability evidence before verified status."
      feature_development_status: "Started — final analytical/audit evidence pending"

    - name: "Catalog, account-save and Pages integration"
      id: "RFS-006"
      details: "Dedicated catalog route and lazy workspace registration; game-local schema v1 account path users/{uid}/games/royal-fortune-slots. Live Firebase provisioning remains external TASK-003; emulator/account infrastructure is shared."
      feature_development_status: "Started — repository validation/deployment pending"

## Product boundary

Royal Fortune Slots is simulated play only. Credits cannot be bought, sold, transferred, deposited, withdrawn or redeemed. The game has no ads, telemetry, autoplay, stake-escalation prompts, losses-disguised-as-wins treatment, or behavior-adaptive probability.

## Source of truth

Authoritative design: `docs/specs/2026-10-10-royal-fortune-slots-design.md`. Live implementation status is maintained in `TRACKER.md`; executable remaining work is maintained in `todo.md`.