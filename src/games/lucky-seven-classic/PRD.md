# Lucky Seven Classic PRD

Planned Functional Features Specification:
  game_identity:
    name: "Lucky Seven Classic"
    slug: "lucky-seven-classic"
    development_status: "Implementing — engine/persistence verified; consolidated cabinet browser TDD active"

  technical_foundation:
    architecture_and_engine: Pure three-reel center-line engine with source-controlled 32-stop strips, exhaustive probability audit, schema-v1 settled persistence, React mechanical-cabinet presentation, procedural Web Audio, and shared versioned save platform.
    dependencies_used: ["React 19.3.0", "TypeScript 7.0.2", "Vitest 5.0.3", "Playwright 1.64.0", "Firebase 13.0.0"]

  core_feature_specifications:
    - name: "Exact classic reel engine"
      id: "LSC-001"
      details: "Three independent 32-stop reels; center row only; explicit Cherry/Mixed-BAR/exact-match precedence; wagers 1/2/5/10/25; unbiased crypto stop selection; exhaustive audit yields 94.775390625% RTP and 42.047119140625% paying-result frequency."
      feature_development_status: "verified"

    - name: "Durable practice-credit save"
      id: "LSC-002"
      details: "Schema-v1 settled bankroll, wager/statistics/largest-win/last-result/preferences state. Atomic settlement derives payout from engine rules and excludes in-flight reel state; restore-to-500 preserves history/preferences."
      feature_development_status: "verified"

    - name: "Mechanical cabinet experience"
      id: "LSC-003"
      details: "Distinct vintage 3x3 visible cabinet with one textual center payline, native Pull / Spin action, five wager choices, finite reel/lever motion, opt-in procedural audio, paytable/rules and saved-game controls. One consolidated Playwright suite proves gameplay, persistence, accessibility, audio and responsive behavior."
      feature_development_status: "started"

    - name: "Responsive and accessible production validation"
      id: "LSC-004"
      details: "320px and 200%-text no-horizontal-overflow contract, >=48px primary action, keyboard/touch operation, reduced-motion suppression, reload/restore verification, catalog/workspace route integration, full validation and exact-revision Pages evidence."
      feature_development_status: "started"

## Current evidence

Engine GREEN: `de1136d18390b1044eab16475fab5aee31b2c6f6` / run `38099279607`. Persistence RED: `eb89b259c60a3a12c9a832db94ea21602035d1eb` / run `38099468454`. Persistence GREEN functional revision: `a72d095e3569b056b211803335e6b6d401e048bb` / run `38099724416`, whose full build job passed through both builds. The next integration adds `tests/browser/lucky-seven-classic.mjs` to `test:design-browser` before the playable route/cabinet exists, creating the required consolidated UI RED. No whole-game completion claim is made.
