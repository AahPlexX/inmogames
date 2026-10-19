# Cascade Vault PRD

Planned Functional Features Specification:
  game_identity:
    name: "Cascade Vault"
    slug: "cascade-vault"
    development_status: "Implementing — CV-001 engine hardened; canonical GREEN pending"

  technical_foundation:
    architecture_and_engine: Pure six-reel/five-row adjacent-ways cascade engine with immutable evaluation, exact centi-credit accounting, injected randomness, bounded base/Vault multipliers, explicit final-feature termination, reproducible production-engine simulation, settled persistence, React presentation and shared save platform.
    dependencies_used: ["React 19.3.0", "TypeScript 7.0.2", "Vitest 5.0.3", "Playwright 1.64.0", "Firebase 13.0.0", "Vite 8.3.4"]

  core_feature_specifications:
    - name: "Exact ways/cascade/Vault Run engine"
      id: "CV-001"
      details: "6x5 immutable ways from reel 1; Wild substitution with concrete all-Wild interpretation dedup; simultaneous removals; gravity/top refill; base x1..x10; persistent Vault Run x2..x20; three-step meter; +4 retrigger; 20-spin cap; 50-cascade guard; exact centi-credit payout math; completed final free spin returns nextVaultState null after all awards are applied."
      feature_development_status: "started — source/test hardening integrated; canonical GREEN pending"

    - name: "Reproducible probability and balance audit"
      id: "CV-002"
      details: "Deterministic seeded audit reuses production resolveSpin. Final >=10,000,000 paid spins report RTP, standard error, 95% CI, Vault Run entry frequency and defined average cascade depth. Current weights are provisional; final interval must intersect 94%-97%."
      feature_development_status: "planned"

    - name: "Settled durable practice progression"
      id: "CV-003"
      details: "Schema-v1 centi-credit bankroll/statistics/preferences plus post-free-spin Vault Run checkpoints only. No board/partial cascade/in-flight spin state is durable. A completed feature is null; restore 5,000 preserves statistics/preferences."
      feature_development_status: "planned"

    - name: "Accessible cascading board and feature presentation"
      id: "CV-004"
      details: "Responsive 6x5 board, aggregate live cascade status, Vault Run meter/free-spin/multiplier panel, native >=48px important controls, finite/reduced-motion sequence presentation, opt-in procedural audio, rules/paytable, 320px/200%-text keyboard/touch/overflow gates."
      feature_development_status: "planned"

    - name: "Catalog, governance and exact-revision release"
      id: "CV-005"
      details: "Discoverable catalog/lazy route only after browser RED; synchronized spec/plan/tracker/PRD/todo/GAME_INDEX/.tasks; exact dependency checks; full repository validation; both builds; GitHub Pages deployment."
      feature_development_status: "planned"

## Current evidence

- CV-001 RED: exact revision `a52d99774c9384ad6a0b4c0ccfbf1c5e7cb51e9a`, run `38122640264`.
- Pure engine implementation: `f71588d2ca0c96e685f54631c0afb6ded56ade84`.
- Fixture-only correction: `ae5a7e3630964d13efb23bb06c57dc582dbb2455`; it removes unrelated reel-4 Copper that legitimately extended the intended 3-reel second cascade, without weakening the 400-unit/multiplier/draw assertions.
- Final-feature hardening adds a focused no-win last-free-spin regression so persistence/UI receive `null`, never `{remainingSpins: 0}`.
- No gameplay capability is marked verified until canonical repository validation passes. TASK-003 remains the separate external live-Firebase blocker only.
