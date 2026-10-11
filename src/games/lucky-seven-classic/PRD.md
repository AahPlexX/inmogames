# Lucky Seven Classic PRD

Planned Functional Features Specification:
  game_identity:
    name: "Lucky Seven Classic"
    slug: "lucky-seven-classic"
    development_status: "Implementing — engine TDD active"

  technical_foundation:
    architecture_and_engine: Pure three-reel center-line engine with source-controlled 32-stop strips, exhaustive probability audit, React cabinet presentation, and shared versioned save platform.
    dependencies_used: ["React 19.3.0", "TypeScript 7.0.2", "Vitest 5.0.3", "Playwright 1.64.0", "Firebase 13.0.0"]

  core_feature_specifications:
    - name: "Exact classic reel engine"
      id: "LSC-001"
      details: "Three independent 32-stop reels; only the center row scores; explicit Cherry, Mixed BAR and exact-match precedence; 1/2/5/10/25 wagers; exhaustive 32^3 probability audit; production stop selection uses unbiased browser cryptographic randomness."
      feature_development_status: "started"

    - name: "Durable practice-credit save"
      id: "LSC-002"
      details: "Schema-v1 settled bankroll, selected wager, spin/wager/win/net statistics, largest win, last completed result and sound/motion preferences; no in-flight reel state; guest local save plus shared account-save seam."
      feature_development_status: "planned"

    - name: "Mechanical cabinet experience"
      id: "LSC-003"
      details: "Distinct vintage three-reel cabinet, native Pull / Spin button, visible/textual center payline, finite reel/lever motion, procedural opt-in audio, pre-spin paytable and accessible result announcements."
      feature_development_status: "planned"

    - name: "Responsive and accessible production validation"
      id: "LSC-004"
      details: "320 CSS-px and 200%-text reflow, keyboard/touch operation, >=48px important targets, reduced-motion behavior, persistence/reload checks, full repository validation and exact-revision Pages deployment evidence."
      feature_development_status: "planned"

## Current evidence

The authoritative rules and math contract are `docs/specs/2026-10-10-lucky-seven-classic-design.md`; the implementation plan is `docs/plans/2026-10-10-lucky-seven-classic.md`. Red TDD revision `1085f461f474f9d5ac1976a991d4f6079a9aae75` failed at TypeScript because the engine/reel modules did not exist, exactly as intended. Engine source revision `cec193e955e73834fcf5144703b35a8b411d8591` is awaiting green integration evidence. No UI, persistence or final completion claim is made yet.
