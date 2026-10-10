# Royal Fortune Slots PRD

Planned Functional Features Specification:
  game_identity:
    name: "Royal Fortune Slots"
    slug: "royal-fortune-slots"
    development_status: "Verified — 2026-10-10 game-local production scope complete"

  technical_foundation:
    architecture_and_engine: "React/TypeScript presentation over pure five-reel payline engine, explicit source-controlled reel strips/paytable, exact analytical probability audit, versioned shared save repository, procedural Web Audio, responsive game-scoped CSS."
    dependencies_used: ["react 19.3.0", "react-dom 19.3.0", "firebase 13.0.0", "vitest 5.0.3", "playwright 1.64.0"]

  core_feature_specifications:
    - name: "Fixed five-reel slot engine"
      id: "RFS-001"
      details: "5x3 visible reel window; 20 immutable paylines; explicit 32-stop reel strips; unbiased crypto.getRandomValues stop selection; deterministic injected random source for tests; no adaptive odds."
      feature_development_status: "Verified"

    - name: "Wild, Scatter and free-spin rules"
      id: "RFS-002"
      details: "Wild substitutes for normal symbols only; Scatter pays independently; 3/4/5 Scatters trigger 8/12/20 player-paced free spins; retriggers add five; winning free spins advance line multiplier to maximum x5."
      feature_development_status: "Verified"

    - name: "Practice bankroll and durable checkpoints"
      id: "RFS-003"
      details: "2,500 initial virtual credits; wagers 5/10/20/40/100; settled bankroll/statistics/preferences plus fully settled free-spin checkpoints persist locally and through the shared optional account-save platform. In-flight reel presentation is excluded from durable state."
      feature_development_status: "Verified"

    - name: "Responsive accessible machine"
      id: "RFS-004"
      details: "Native controls and disclosures; transparent paid-spin return/net wording; >=48px primary target; 320px and 200%-text no-overflow/reflow gates; reduced-motion/effects support; RNG failure without credit deduction; player-paced free spins; no autoplay."
      feature_development_status: "Verified"

    - name: "Probability transparency and audit"
      id: "RFS-005"
      details: "Exact source-derived base and full free-feature expected-value audit binds the configured theoretical return to 99.4307658688%, with exact feature-entry and paying-result probabilities."
      feature_development_status: "Verified"

    - name: "Catalog, account-save and Pages integration"
      id: "RFS-006"
      details: "Dedicated catalog route and lazy workspace registration; game-local schema v1 account path users/{uid}/games/royal-fortune-slots; shared account/persistence emulator checks and Pages deployment verified. Real configured-project Firebase provisioning remains external TASK-003."
      feature_development_status: "Verified game-locally — TASK-003 external"

## Product boundary

Royal Fortune Slots is simulated play only. Credits cannot be bought, sold, transferred, deposited, withdrawn or redeemed. The game has no ads, telemetry, autoplay, stake-escalation prompts, losses-disguised-as-wins treatment, or behavior-adaptive probability.

## Verification evidence

Exact functional revision `e89b9c64eada44a4a5953c17072d57b7d940b4d2` passed GitHub Actions run `38090041520`: dependency exactness/current checks, design lint, TypeScript, game/document governance, unit tests including exact probability recurrence, Firestore rules, shared account/persistence browser checks, catalog/design regressions, the expanded Royal Fortune deterministic browser suite, both production builds, Pages artifact upload and Pages deployment.

The dedicated Royal Fortune flow verified RNG-failure no-deduction behavior, deterministic feature entry, settled free-spin reload, player-paced progression, depleted-bankroll restore retaining statistics, 320px no-horizontal-overflow, 200% text reflow, >=48px primary Spin target, reduced-effects behavior and sound opt-in/no-autoplay.

TASK-003 remains the separate external blocker for live configured Firebase Authentication/Firestore and is not part of this game-local completion claim.

## Source of truth

Authoritative design: `docs/specs/2026-10-10-royal-fortune-slots-design.md`. Verified handoff/evidence is maintained in `TRACKER.md`; the completed execution checklist is `todo.md`.