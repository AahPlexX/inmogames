# Lucky Seven Classic PRD

Planned Functional Features Specification:
  game_identity:
    name: "Lucky Seven Classic"
    slug: "lucky-seven-classic"
    development_status: "Verified — 2026-10-11 production implementation and release validation complete"

  technical_foundation:
    architecture_and_engine: Pure three-reel center-line engine with source-controlled 32-stop strips, exhaustive probability audit, schema-v1 settled persistence, React mechanical-cabinet presentation, procedural Web Audio, shared versioned save platform, scoped responsive CSS, and production-valid Vite builds.
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
      details: "320px and 200%-text no-horizontal-overflow contract, >=48px primary action, keyboard/touch operation, reduced-motion suppression, reload/restore verification, catalog/workspace integration, production-valid scoped CSS, both Vite builds and exact-revision Pages deployment."
      feature_development_status: "verified"

## Verification evidence

Engine GREEN: `de1136d18390b1044eab16475fab5aee31b2c6f6` / run `38099279607`. Persistence GREEN: `a72d095e3569b056b211803335e6b6d401e048bb` / run `38099724416`. UI/browser RED: `66f0f7a54c7fad33f6ee4953ee6b5220e4e40f58` / run `38100222862`. Payline semantic repair: `3e662d79645151e7e7fbc7eb666dd2fd273fbe9e`. Selector-scope correction: `3b3faa1a95a04752c813acbcb9e09b3112945ec6` / run `38121283719`, which passed the full browser contract and exposed the malformed `.lsc*` production CSS selector at `build:firebase`. CSS repair `bd5b1cf1c12bc218eca17557caaa9cc0ff92fc0a` changed only the selector to valid `.lsc *` descendants; run `38121621987` then exposed a documentation-structure regression before builds. Exact final functional revision `04ae049259232edf9ec5af4aa63d4786d8673ba4` passed dependency/current checks, design lint, TypeScript, history-aware governance, 117 units, Firestore rules, shared account/browser coverage, the entire design-browser chain including Lucky Seven, both production builds, artifact upload and GitHub Pages deployment in run `38121766726`.

Configured live Firebase verification remains externally blocked by TASK-003 and is not part of this game-local completion claim.
