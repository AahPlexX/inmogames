# Cascade Vault PRD

Planned Functional Features Specification:
  game_identity:
    name: "Cascade Vault"
    slug: "cascade-vault"
    development_status: "Implementing — CV-001 source hardened; canonical GREEN dependency/governance-gated"

  technical_foundation:
    architecture_and_engine: Pure six-reel/five-row adjacent-ways cascade engine with immutable evaluation, exact centi-credit accounting, injected randomness, bounded base/Vault multipliers, explicit final-feature termination, reproducible production-engine simulation, settled persistence, React presentation and shared save platform.
    dependencies_used: ["React 19.3.0", "React DOM 19.3.0", "TypeScript 7.0.2", "Vitest 5.0.3", "Playwright 1.64.0", "Firebase 13.0.0", "Vite 8.3.4"]
    dependency_refresh: "Request revision 8 targets React/React DOM 19.3.1, Firebase CLI 15.34.0, Playwright 1.64.1 and Vitest 5.0.5. Maintenance run 39294812001 verified those target versions as npm latest, then reached repository validation and exposed two Cascade governance-schema regressions before package/lockfile commit."

  core_feature_specifications:
    - name: "Exact ways/cascade/Vault Run engine"
      id: "CV-001"
      details: "6x5 immutable ways from reel 1; Wild substitution with concrete all-Wild interpretation dedup; simultaneous removals; gravity/top refill; base x1..x10; persistent Vault Run x2..x20; three-step meter; +4 retrigger; 20-spin cap; 50-cascade guard; exact centi-credit payout math; completed final free spin returns nextVaultState null after all awards are applied."
      feature_development_status: "started — source/test hardening integrated; canonical GREEN pending refreshed dependency validation and repaired governance schema"

    - name: "Reproducible probability and balance audit"
      id: "CV-002"
      details: "Deterministic seeded audit reuses production createWeightedVaultRandomSource and resolveSpin. Each observation is one paid spin plus all value/cascades from its complete triggered Vault Run, with no extra free-spin wager denominator. Final >=10,000,000 paid spins report RTP, standard error, 95% CI, Vault Run entry frequency, defined average cascade depth and corruption-guard incidence. Current distributions and paytable are provisional for balance; the authoritative design permits rebalancing both, and the accepted interval must intersect 94%-97% with zero corruption-guard hits."
      feature_development_status: "planned — supporting reconnaissance rules out a weights-only tuning assumption"

    - name: "Settled durable practice progression"
      id: "CV-003"
      details: "Schema-v1 integer centi-credit bankroll/statistics/preferences plus post-free-spin Vault Run checkpoints only. Selected wager remains the engine denomination 10/20/50/100/250 credits. No board/partial cascade/in-flight spin state is durable. Active feature requires 1-20 remaining spins; completed feature is null; restore 5,000 preserves statistics/preferences."
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
- Terminal-feature hardening: `206f2a6aa0ab4a3b0c31aeb4f450b7bc2d83b820`; final fully settled free spin returns feature null when no spins remain.
- Canonical run `39280095530` on that exact revision passed frozen install/exact-pin checks, then stopped at `dependency:current` before TypeScript/game/unit/browser/build because several direct packages had newer stable patches. This is repository freshness blocking, not CV-001 failure evidence.
- Dependency-maintenance run `39293588043` exposed stale request revision 7. Request revision 8 corrected the target versions.
- Dependency-maintenance run `39294812001` verified every revision-8 direct dependency as npm latest and reached `pnpm validate`; design lint and TypeScript passed. `game:check` then correctly rejected the Cascade PRD/todo because the previous handoff rewrite renamed the required `technical_foundation.dependencies_used` field and the required `Dependencies` todo heading. These governance structures are restored without changing gameplay source.
- Two isolated advisory implementation reviews were centrally reconciled with source. Supporting pre-audit analysis indicates current balance is far above the target and that weights-only tuning is not credible; CV-002 therefore exercises the spec-authorized paytable + distribution rebalance rather than treating the current paytable as final.
- No gameplay capability is marked verified until canonical repository validation passes. TASK-003 remains the separate external live-Firebase blocker only.
