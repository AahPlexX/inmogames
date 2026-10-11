# Lucky Seven Classic PRD

Planned Functional Features Specification:
  game_identity:
    name: "Lucky Seven Classic"
    slug: "lucky-seven-classic"
    development_status: "Implementing — all gameplay/browser gates verified; production CSS selector repair awaiting build/Pages GREEN"

  technical_foundation:
    architecture_and_engine: Pure three-reel center-line engine with source-controlled 32-stop strips, exhaustive probability audit, schema-v1 settled persistence, React mechanical-cabinet presentation, procedural Web Audio, shared versioned save platform, and scoped responsive CSS.
    dependencies_used: ["React 19.3.0", "TypeScript 7.0.2", "Vitest 5.0.3", "Playwright 1.64.0", "Firebase 13.0.0", "Vite 8.3.4"]

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
      details: "Distinct vintage 3x3 visible cabinet with one textual center payline, native Pull / Spin action, five wager choices, finite reel/lever motion, opt-in procedural audio, paytable/rules and saved-game/reset controls. One consolidated Playwright suite proves gameplay, persistence, accessibility, audio and responsive behavior."
      feature_development_status: "verified"

    - name: "Responsive, accessible and production release validation"
      id: "LSC-004"
      details: "320px and 200%-text no-horizontal-overflow contract, >=48px primary action, keyboard/touch operation, reduced-motion suppression, reload/restore verification, catalog/workspace route integration, valid production CSS, both Vite builds and exact-revision Pages evidence."
      feature_development_status: "started"

## Current evidence

Engine GREEN: `de1136d18390b1044eab16475fab5aee31b2c6f6` / `38099279607`. Persistence GREEN: `a72d095e3569b056b211803335e6b6d401e048bb` / `38099724416`. UI/browser RED: `66f0f7a54c7fad33f6ee4953ee6b5220e4e40f58` / `38100222862`. Production payline semantic repair: `3e662d79645151e7e7fbc7eb666dd2fd273fbe9e`. Harness selector correction: `3b3faa1a95a04752c813acbcb9e09b3112945ec6` / run `38121283719`, which passed dependency/current/design/typecheck/governance, 117 units, Firestore rules, shared account persistence, the complete Lucky Seven browser contract, Mergrove, Cloudline and Hollowshift. The same run then failed at `build:firebase`: LightningCSS rejected `.lsc*` with `Unexpected token Delim('*')`. Current release repair changes only that malformed selector to valid scoped descendants `.lsc *`, `.lsc *::before`, `.lsc *::after`, matching the working repo pattern. Whole-game verification remains open until both builds and Pages are green on one exact revision.
