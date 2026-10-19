# Cascade Vault PRD

Planned Functional Features Specification:
  game_identity:
    name: "Cascade Vault"
    slug: "cascade-vault"
    development_status: "Implementing — Task 1 RED evidenced; engine GREEN implementation pending verification"

  technical_foundation:
    architecture_and_engine: Pure six-reel/five-row adjacent-ways and cascade engine with immutable-board evaluation, exact centi-credit accounting, deterministic random-source injection, bounded base/feature multipliers, Vault Run state transitions, reproducible simulation tooling, settled persistence, React presentation and shared save platform.
    dependencies_used: ["React 19.3.0", "TypeScript 7.0.2", "Vitest 5.0.3", "Playwright 1.64.0", "Firebase 13.0.0", "Vite 8.3.4"]

  core_feature_specifications:
    - name: "Exact ways/cascade/Vault Run engine"
      id: "CV-001"
      details: "6x5 immutable-board ways evaluation from reel 1, Wild substitution with duplicate-interpretation protection, simultaneous removals, gravity/refill, base multiplier x1..x10, Vault Run persistent x2..x20, three-step meter, retrigger/free-spin cap and 50-cascade corruption guard. User-visible virtual-credit payouts follow the approved fractional paytable exactly; runtime accounting uses integer centi-credit units (100 units = 1 credit) so x1.5 feature awards remain exact without binary floating-point drift."
      feature_development_status: "started — implementation integrated; GREEN pending"

    - name: "Reproducible probability and balance audit"
      id: "CV-002"
      details: "Source-controlled symbol weights plus deterministic seeded simulation. Final 10,000,000-paid-spin audit reports RTP, standard error, 95% confidence interval, Vault Run entry frequency and average cascade depth; the interval must intersect the approved 94%-97% RTP range before verification. Current engine weights are provisional until this gate."
      feature_development_status: "planned"

    - name: "Settled durable practice progression"
      id: "CV-003"
      details: "Schema-v1 bankroll/statistics/preferences plus post-free-spin Vault Run checkpoints only. No in-flight paid spin or partial cascade state is durable; restore-to-5,000 preserves history and preferences."
      feature_development_status: "planned"

    - name: "Accessible cascading board and feature presentation"
      id: "CV-004"
      details: "Responsive 6x5 board, aggregate textual cascade status, Vault Run meter/free-spin/multiplier panel, native controls, finite/reduced-motion sequence presentation, opt-in procedural audio, pre-spin rules/paytable and 320px/200%-text keyboard/touch quality gates."
      feature_development_status: "planned"

    - name: "Catalog, governance and exact-revision release"
      id: "CV-005"
      details: "Discoverable catalog/lazy route, synchronized spec/tracker/PRD/todo/GAME_INDEX/.tasks, exact dependency checks, full repository validation, both production builds and GitHub Pages deployment."
      feature_development_status: "planned"

## Current evidence

Task CV-001 RED is evidenced on exact revision `a52d99774c9384ad6a0b4c0ccfbf1c5e7cb51e9a`, GitHub Actions run `38122640264`: dependency freshness and design lint passed, then TypeScript failed on the intentionally absent `symbols.ts`, `paytable.ts`, and `engine.ts`; the remaining implicit-any diagnostics were downstream of those missing imports. The fixed test contract was not weakened. The three pure production modules are now integrated for GREEN verification, but no gameplay capability is marked verified until the unchanged focused contract and repository gates pass. TASK-003 remains the separate external live-Firebase blocker only.
