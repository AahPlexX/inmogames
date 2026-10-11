# Lucky Seven Classic PRD

Planned Functional Features Specification:
  game_identity:
    name: "Lucky Seven Classic"
    slug: "lucky-seven-classic"
    development_status: "Implementing — engine verified; persistence implementation awaiting GREEN"

  technical_foundation:
    architecture_and_engine: Pure three-reel center-line engine with source-controlled 32-stop strips, exhaustive probability audit, schema-v1 settled persistence, React cabinet presentation, and shared versioned save platform.
    dependencies_used: ["React 19.3.0", "TypeScript 7.0.2", "Vitest 5.0.3", "Playwright 1.64.0", "Firebase 13.0.0"]

  core_feature_specifications:
    - name: "Exact classic reel engine"
      id: "LSC-001"
      details: "Three independent 32-stop reels; center row only; Cherry, Mixed BAR and exact-match precedence; wagers 1/2/5/10/25; unbiased crypto stop selection; exhaustive 32^3 audit yielding 94.775390625% RTP and 42.047119140625% paying-result frequency."
      feature_development_status: "verified"

    - name: "Durable practice-credit save"
      id: "LSC-002"
      details: "Schema-v1 settled bankroll, selected wager, spin/wager/win/net statistics, largest win, last completed center-line result and sound/motion preferences. Atomic settlement derives payout from engine rules, rejects insufficient bankroll, excludes in-flight reel state, and restore-to-500 preserves history/preferences."
      feature_development_status: "started"

    - name: "Mechanical cabinet experience"
      id: "LSC-003"
      details: "Distinct vintage three-reel cabinet, native Pull / Spin button, visible/textual center payline, finite reel/lever motion, procedural opt-in audio, pre-spin paytable and accessible result announcements."
      feature_development_status: "planned"

    - name: "Responsive and accessible production validation"
      id: "LSC-004"
      details: "320 CSS-px and 200%-text reflow, keyboard/touch operation, >=48px important targets, reduced-motion behavior, persistence/reload checks, full repository validation and exact-revision Pages deployment evidence."
      feature_development_status: "planned"

## Current evidence

- Engine RED: `1085f461f474f9d5ac1976a991d4f6079a9aae75` / run `38098884217`.
- Engine GREEN: `de1136d18390b1044eab16475fab5aee31b2c6f6` / run `38099279607`; `game:check`, unit tests, builds and Pages passed.
- Persistence RED: `eb89b259c60a3a12c9a832db94ea21602035d1eb` / run `38099468454`; dependency/current/design passed, then TypeScript failed only because the intentionally absent `storage.ts` and `persistence.ts` imports could not resolve.
- The two production persistence modules are now implemented against the unchanged RED assertions; GREEN evidence is pending and no cabinet/browser/whole-game completion claim is made.

Authoritative requirements: `docs/specs/2026-10-10-lucky-seven-classic-design.md`. Execution plan: `docs/plans/2026-10-10-lucky-seven-classic.md`. Live configured Firebase remains the separate TASK-003 blocker.
