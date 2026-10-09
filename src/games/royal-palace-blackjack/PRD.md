# Royal Palace Blackjack Product Requirements Document

Planned Functional Features Specification:
  game_identity:
    name: "Royal Palace Blackjack"
    slug: "royal-palace-blackjack"
    development_status: "Verified — 2026-10-09 table experience polish"

  technical_foundation:
    architecture_and_engine: "Static React/Vite casino-table presentation over deterministic TypeScript blackjack rules and persistence boundaries. The authoritative behavioral contract is docs/specs/2026-10-03-royal-palace-blackjack-design.md; TRACKER.md is the live handoff."
    dependencies_used:
      - "react@19.3.0"
      - "react-dom@19.3.0"
      - "firebase@13.0.0 (shared optional account saves only)"
      - "vite@8.3.4"
      - "typescript@7.0.2"
      - "vitest@5.0.3"
      - "playwright@1.64.0"

  core_feature_specifications:
    - name: "Blackjack Rules Engine"
      id: "RPB-001"
      details: "Implement six-deck shoe/cut-card lifecycle, hand scoring, natural blackjack, S17 dealer play, 3:2 blackjack payout, independent split settlement, and deterministic legality/settlement rules."
      feature_development_status: "Verified"
    - name: "Complete Player Action Set"
      id: "RPB-002"
      details: "Support Hit, Stand, Double, one Split with DAS and split-Ace restrictions, late Surrender after dealer check, and Insurance with verified payout semantics."
      feature_development_status: "Verified"
    - name: "Practice Bankroll and Betting"
      id: "RPB-003"
      details: "Provide virtual practice credits, chip controls, re-bet, 2×, all-in, undo, clear, below-minimum restore, and W/L/P plus session-net statistics without real-money wagering. The active round wager remains visible after Deal and reflects split/double exposure rather than displaying a staged-bet zero."
      feature_development_status: "Verified"
    - name: "Durable Save and Reset"
      id: "RPB-004"
      details: "Defensively persist versioned guest state, seed first account save without overwriting existing cloud state, and support game-scoped reset through shared repositories."
      feature_development_status: "Verified with live Firebase externally blocked by TASK-003"
    - name: "Strategy, Audio, Help and Guidance"
      id: "RPB-005"
      details: "Offer optional exact-table strategy hints, opt-in local procedural audio, fixed-rule disclosure, and phase/action guidance without autoplay or external runtime assets. Secondary rules/help must follow the primary round actions in reading/tab order so the decision loop stays visually and operationally primary."
      feature_development_status: "Verified"
    - name: "Accessible Responsive Casino Surface"
      id: "RPB-006"
      details: "Maintain pointer/touch/keyboard parity, visible focus, accessible cards/status/dialogs, 320px and 200% text reflow, touch targets, reduced motion, responsive table/action presentation, first-viewport primary-action reachability on representative narrow phones, and purposeful one-shot deal/reveal/turn/result/dialog feedback with a complete reduced-motion path."
      feature_development_status: "Verified"
    - name: "Catalog and Production Integration"
      id: "RPB-007"
      details: "Register metadata/lazy workspace loading and keep tests, spec, tracker, index, task state, builds, browser evidence, and deployment state synchronized."
      feature_development_status: "Verified"

## Verification evidence

Exact revision `4814d85f375ccd90514252b07692c3c570ca410d` passed the complete repository validation and deployment chain in GitHub Actions run `37994433846` on 2026-10-09. The run passed exact dependency freshness, design lint, TypeScript, game/document governance, 80 unit tests, Firestore rules, account/persistence browser checks, catalog accessibility, shared 320px/200%-text/keyboard/touch/reduced-motion regressions, Royal accessibility/gameplay/audio, the dedicated Royal mobile-layout suite, Mergrove and Cloudline design regressions, both production builds, Pages artifact upload, and automatic GitHub Pages deployment. The Royal mobile-layout suite explicitly passed first-viewport Deal reachability, persistent wager state, card motion, and compact multi-action play.

## Continuation contract

This PRD is the feature inventory. `docs/specs/2026-10-03-royal-palace-blackjack-design.md` remains authoritative for detailed rules and completion gates, while `TRACKER.md` remains the operational resume point. Any future rule, feature, persistence behavior, material UI change, or discovered defect must reopen the matching PRD feature, spec completion gate, tracker capability, and `todo.md` sign-off before implementation is called complete.
