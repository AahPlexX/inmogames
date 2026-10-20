# Cascade Vault PRD

Planned Functional Features Specification:
  game_identity:
    name: "Cascade Vault"
    slug: "cascade-vault"
    development_status: "Implementing — CV-001 verified; CV-002 audit active; CV-003 persistence GREEN candidate integrated"

  technical_foundation:
    architecture_and_engine: Pure six-reel/five-row adjacent-ways cascade engine with immutable evaluation, exact centi-credit accounting, injected randomness, bounded base/Vault multipliers, explicit final-feature termination, reproducible production-engine simulation, settled persistence, React presentation and shared save platform.
    dependencies_used: ["React 19.3.1", "React DOM 19.3.1", "TypeScript 7.0.2", "Vitest 5.0.5", "Playwright 1.64.1", "Firebase 13.0.0", "Vite 8.3.4"]
    dependency_refresh: "Completed through maintenance run 39296252148 and dependency-only bot commit 08c3506773d17eee3fed7554f211531141856386; exact refreshed Pages run 39296638285 passed full validation and deployment."

  core_feature_specifications:
    - name: "Exact ways/cascade/Vault Run engine"
      id: "CV-001"
      details: "6x5 immutable ways from reel 1; Wild substitution with concrete all-Wild interpretation dedup; simultaneous removals; gravity/top refill; base x1..x10; persistent Vault Run x2..x20; three-step meter; +4 retrigger; 20-spin cap; 50-cascade guard; exact centi-credit payout math; completed final free spin returns nextVaultState null after all awards are applied."
      feature_development_status: "verified — exact refreshed revision 08c3506773d17eee3fed7554f211531141856386 / run 39296638285"

    - name: "Reproducible probability and balance audit"
      id: "CV-002"
      details: "Deterministic seeded audit reuses production createWeightedVaultRandomSource and resolveSpin. Each observation is one paid spin plus all value/cascades from its complete triggered Vault Run, with no extra free-spin wager denominator. Final >=10,000,000 paid spins report RTP, standard error, 95% CI, Vault Run entry frequency, defined average cascade depth and corruption-guard incidence. Current distributions and paytable are provisional for balance; the authoritative design permits rebalancing both, and the accepted interval must intersect 94%-97% with zero corruption-guard hits."
      feature_development_status: "started — simulator GREEN on cf8f6e37 / run 39298014858; hardened evidence GREEN on fac39b07 / run 39299407841; 25k screen and >=10M acceptance audit outstanding"

    - name: "Settled durable practice progression"
      id: "CV-003"
      details: "Schema-v1 integer centi-credit bankroll/statistics/preferences plus post-free-spin Vault Run checkpoints only. Selected wager remains the engine denomination 10/20/50/100/250 credits. No board/partial cascade/in-flight spin state is durable. Active feature requires 1-20 remaining spins; completed feature is null; restore 5,000 preserves statistics/preferences."
      feature_development_status: "verified — RED 40442255 / run 39458077585; GREEN 343ca3fc / run 39459146356"

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

## CV-001 verification and CV-002 opening — 2026-10-19

CV-001 is verified on exact refreshed revision `08c3506773d17eee3fed7554f211531141856386`, run `39296638285`, which passed the full repository validation, both builds, artifact upload and Pages deployment. CV-002 now opens test-first: `tests/unit/cascade-vault-simulation.test.ts` is added before `simulation.ts` exists, so the expected RED is the missing simulation module after governance reaches TypeScript. No simulation/balance result is claimed from the RED commit.

CV-002 RED evidence: exact revision `82b7bb2fa9d2e5aafa2cd7d2b080052127240c5e` / run `39297705487` fails only on the intentionally absent `simulation.ts` after dependency/design gates. The production module now being integrated must satisfy that unchanged contract.

CV-002 implementation evidence: `cf8f6e3723f483bc126b0f50b0f42161c14dff56` passed full validation and Pages deployment in run `39298014858`. Before balance screening, independent review required additional deterministic evidence; the current test hardening adds nonzero Vault Run award aggregation, a published seeded-PRNG vector and explicit corruption-guard propagation without changing production simulation logic.

Evidence-hardening note: run `39299103907` failed only the new nonzero feature fixture because its first refill choice created a second Sapphire cascade. Production simulation stayed unchanged; the corrected refill triplet is `vault_crown/copper/copper`, independently checked to terminate after one 200-unit quartz cascade.

CV-002 hardened simulation evidence is GREEN on `fac39b0744d2872ec05cab7b9e8f7c7aadb26cc6` / run `39299407841`. The next integration adds a deliberately non-routine audit command/workflow: ordinary unit validation skips the heavy audit; explicit screening/acceptance runs reuse the production simulator and emit one machine-readable JSON result.

### 2026-10-20 — Audit runner discovery repair
Audit workflow run `39300303052` on `7696b76668cd984a5a9e10ccbcc3c39250c37cff` passed dependency freshness, TypeScript, and all 25 focused engine/simulation tests, then failed before simulation because the repository Vitest configuration only discovered `tests/unit/**/*.test.ts`; `tests/audit/cascade-vault-audit.test.ts` was filtered out. The audit runner itself and production simulator were not implicated. `vite.config.ts` now conditionally includes `tests/audit/**/*.test.ts` only when `CASCADE_VAULT_AUDIT=1`, leaving routine `pnpm test:unit` discovery unchanged. Next evidence: routine full validation plus an explicit 25,000-paid-spin audit run on the repaired harness.

### 2026-10-20 — CV-003 persistence TDD opened in parallel
With the production simulator already GREEN and balance auditing isolated from save semantics, CV-003 opens independently with a test-only contract for schema-v1 settled persistence. The RED requires a 5,000-credit default represented as 500,000 centi-credit units, supported wager validation, malformed/non-finite/negative rejection, compact settled result summaries (no boards/animation frames), exact paid/free settlement accounting, validated active/null Vault checkpoints, one-time completed-run counting, insufficient-bankroll rejection, and practice-credit restore only below 10 credits with no active feature. Ruling: settlement helpers remain pure whole-state transforms and do not invent transaction IDs absent from the approved platform contract; duplicate invocation prevention belongs to the single-resolution workspace control path and will be browser-verified in CV-004. No persistence production module exists in this RED integration.

CV-003 candidate note (2026-10-20): storage/persistence modules implement the unchanged RED contract only; no route/UI or live-Firebase completion claim is made.

### 2026-10-20 — CV-002 first distribution tuning candidate
Production audit run `39459206136` on persistence-GREEN revision `343ca3fcaccd8efb09ebc0200e6608ca1ed74b74` passed dependency freshness, TypeScript and all focused engine/simulation tests, then the 25,000-paid-spin screen aborted with `corruptionGuardHits: 1` at the hard 50-cascade limit. This rejects the provisional distribution for acceptance and proves paytable-only scaling cannot solve the evolution risk. Candidate D1 therefore flattens paying-symbol concentration and reduces Wild weight: initial/refill paying weights `13/12/12/11/11/11/10/1` with Wild `1`; initial Scatter remains `4` and refill Scatter remains forbidden. Paytable is unchanged for this screen so the next audit isolates distribution effects. CV-003 persistence is verified independently on `343ca3fc…` / run `39459146356`.

