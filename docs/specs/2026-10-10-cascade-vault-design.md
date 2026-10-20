# Cascade Vault design

**Status:** Implementing — CV-001 verified; CV-002 simulation/balance TDD RED opening  
**Last synchronized:** 2026-10-19  
**Proposed route:** `#/games/cascade-vault`

## Product intent

Cascade Vault is the modern high-feature member of the slot family and is mechanically/visually independent from Royal Fortune Slots and Lucky Seven Classic. It uses virtual practice credits only: no purchases, deposits, cash-out, ads, telemetry, real-money value, autoplay, adaptive odds, loss-chasing, or stake-escalation prompts.

## Core rules

- Board: 6 reels × 5 rows.
- Initial and refill symbols come from source-controlled weighted distributions. Scatters may appear only on an initial paid/free-spin board, never on cascade refills.
- A normal symbol wins when it appears, directly or through Wild substitution, on at least 3 consecutive reels starting at reel 1. `ways = count(reel1) × ... × count(last qualifying reel)`.
- Wild substitutes for normal paying symbols only; it never substitutes for Scatter and has no standalone paytable entry.
- Each paying symbol is evaluated from one immutable board snapshot. A concrete all-Wild way that could represent multiple symbols is paid once using the highest valid award interpretation; it is never double-paid.
- All accepted winning normal/Wild coordinates are removed simultaneously. Survivors fall downward and new symbols refill from the top. The cascade repeats until no paying ways remain.
- Base-spin cascade multiplier starts ×1, increases by +1 after each winning cascade, caps ×10, and resets for every paid spin.
- Four/five/six-or-more initial Scatters trigger 8/10/12 **Vault Run** free spins.
- Vault Run starts with persistent multiplier ×2. Every winning cascade increases the carried multiplier by +1, capped ×20.
- Vault meter advances at most once per free spin, and only when that free spin resolves at least 3 winning cascades:
  1. Step 1: every later cascade refill during the feature receives exactly one extra Wild, replacing one randomly selected non-Scatter refill symbol using the same random source.
  2. Step 2: all normal-symbol ways awards during later feature cascades receive an additional ×1.5 modifier after the persistent feature multiplier.
  3. Step 3: award exactly +3 free spins once; the meter stays full afterward.
- Four or more initial Scatters during a Vault Run free spin retrigger +4 free spins. Remaining feature spins are capped at 20 after all awards.
- **Feature termination:** after a free spin completely resolves, apply cascade multiplier growth, meter progress, step-3 award and Scatter retrigger. If the resulting `remainingSpins` is zero, the feature is complete and `resolveSpin.nextVaultState` is `null`; a zero-spin active feature object is invalid.
- Hard corruption guard: a 51st winning cascade throws; unresolved settlement must not be fabricated.

## Paytable and exact accounting

The following v1 multipliers are **provisional balance inputs**, not verified final probabilities. CV-002 may rebalance these values together with source weights while preserving symbol-value ordering, exact accounting, and the approved feature rules.

| Symbol | 3 reels | 4 reels | 5 reels | 6 reels |
| --- | ---: | ---: | ---: | ---: |
| Quartz | 0.10× | 0.20× | 0.50× | 1.00× |
| Copper | 0.15× | 0.30× | 0.75× | 1.50× |
| Silver | 0.20× | 0.50× | 1.00× | 2.50× |
| Gold | 0.30× | 0.75× | 1.50× | 4.00× |
| Sapphire | 0.50× | 1.25× | 3.00× | 8.00× |
| Emerald | 0.75× | 2.00× | 5.00× | 12.00× |
| Ruby | 1.00× | 3.00× | 8.00× | 20.00× |
| Vault Crown | 1.50× | 5.00× | 15.00× | 40.00× |

Scatter does not pay a separate credit prize in v1.

Fractional virtual-credit awards are intentional. Runtime, simulation and persistence use integer **centi-credit units**, `CREDIT_SCALE = 100`, so 100 internal units equal 1 displayed credit. Paytable multipliers are integer hundredths and the ×1.5 feature boost is exact 3/2 arithmetic. No rule rounds to whole credits. Any accepted rebalance must remain exactly representable under this contract or explicitly revise the precision contract across engine, persistence and UI before acceptance.

## Randomness and probability evidence

Production spins use browser cryptographic randomness through an injected engine adapter. Tests/audits may inject deterministic seeded sources. Outcomes never depend on bankroll, prior outcomes, session length or user behavior.

The current initial/refill weights and paytable are provisional engineering values only. CV-002 must run a reproducible Monte Carlo audit of at least **10,000,000 paid spins**, including all value from every Vault Run triggered by those paid spins, and report:
- observed RTP,
- standard error,
- 95% confidence interval,
- Vault Run entry frequency,
- average winning-cascade depth per paid spin, with engine-spin diagnostics,
- corruption-guard incidence.

One statistical observation is one paid spin plus the complete value of its attached feature. Free spins do not add a wager denominator. Simulation must call the real `createWeightedVaultRandomSource` and `resolveSpin`; it must not duplicate symbol selection, ways, cascade or Vault rules. A 50-cascade corruption-guard hit invalidates a candidate/audit and may not be omitted from statistics.

The final 95% RTP interval must intersect **94%–97%**, with zero observed corruption-guard hits in the accepted audit. Otherwise distributions/paytable must be rebalanced and rerun before completion.

Supporting pre-audit reconnaissance is deliberately non-authoritative but rules out a weights-only assumption: the current configuration produced returns many multiples above target in scratch modeling, and even a favorable no-Wild/no-Scatter first-board optimization remained above 400% expected return before cascades. The final source configuration therefore requires evidence-led paytable + distribution tuning. Only the production-engine CV-002 audit can establish acceptance.

## Bankroll and persistence

- Initial bankroll: 5,000 displayed credits = 500,000 centi-credit units.
- Base wager steps: 10, 20, 50, 100, 250 displayed credits, bounded by settled bankroll.
- Local key: `inmogames:cascade-vault:v1`; cloud slug: `cascade-vault`.
- Persist only settled state: bankroll, wager, paid/free spin counters, wagered/won/net totals, largest completed spin win, highest cascade chain, completed Vault Run count, sound/reduced-effects preferences, last completed result, and fully resolved post-free-spin feature checkpoint.
- Never persist an in-flight paid spin, board animation state, unresolved cascade or partially settled free spin.
- A completed Vault Run persists `feature: null`; only a feature with at least 1 remaining spin is durable.
- `largestSpinWin` is the payout from one fully resolved engine spin, not an aggregate Vault Run total. `highestCascadeChain` is the maximum `result.cascades.length` from one resolved engine spin.
- Reload must neither duplicate nor lose a completed award.
- If bankroll drops below the 10-credit minimum and no feature is active, expose **Restore 5,000 practice credits** while retaining statistics/preferences.
- Authenticated saves use `users/{uid}/games/cascade-vault`; real configured-project verification remains external TASK-003.

## Architecture

Game-local modules:
- `symbols.ts`: symbols, source-controlled weights, injected weighted draw adapter.
- `paytable.ts`: centi-credit payout math and wager contract.
- `engine.ts`: immutable ways evaluation, Wild dedup, simultaneous removal, gravity/refill, cascade/feature transitions and guard.
- `simulation.ts`: deterministic audit tooling using the production engine, not a second gameplay model.
- `storage.ts` / `persistence.ts`: defensive schema-v1 settled-state decoding and shared platform save definition.
- `audio.ts`: opt-in procedural cues.
- `CascadeVaultWorkspace.tsx` / `cascade-vault.css`: accessible sequence presentation. The current unregistered placeholder is governance-only until browser RED.
- `cascade-vault.meta.ts`, `PRD.md`, `TRACKER.md`, `todo.md`: metadata/living governance.

No gameplay engine or presentation is shared with the other slot titles.

## Interaction, accessibility, responsive and motion contract

Primary hierarchy: bankroll/wager → 6×5 board → current cascade result/multiplier → Vault Run status/meter when active → wager/Spin controls → rules/paytable/preferences.

- Resolve the complete logical spin before presentation; animation may not alter scoring.
- Native buttons for actions; important targets >=48×48 CSS px; visible `:focus-visible`; no required drag, hover, color-only state, sound or animation.
- Aggregate polite live announcements describe cascade number, payout/multiplier and remaining feature spins rather than announcing every moving cell.
- Rules/paytable/feature explanation is available before first spin.
- 320 CSS px: board remains within viewport width with no page-level horizontal overflow.
- 200% text: controls/status reflow in normal flow and do not overlay cells.
- No sticky action surface may cover board/status content; safe-area padding is honored.
- Desktop/landscape may place status beside board; narrow layouts stack.
- `prefers-reduced-motion: reduce` and explicit reduced-effects preference replace travel/zoom/sweeps with immediate/minimal transitions while preserving sequence and final state.
- Audio is opt-in and initialized only from user gesture; cues may cover spin/cascade/multiplier/feature/meter/completion, with silent continuation if unavailable.

## Error handling

- Insufficient bankroll: disable Spin with explanation.
- Random-source failure before resolution: no wager deduction; durable state unchanged.
- Corruption guard: abort unresolved settlement and restore pre-spin checkpoint.
- Persistence failure: preserve settled local/in-memory state and surface nonblocking status.
- Repeated input during resolution: phase-guarded.
- Malformed saves: reject/sanitize to safe defaults without inventing wins/feature state.

## Quality gates

Unit coverage: ways/reel qualification, Wild/dedup, simultaneous wins/removals, gravity/refill, cascade termination/50 guard, multipliers/caps/reset, Scatter triggers/retriggers, all meter steps, final-feature termination, free-spin cap, exact accounting, deterministic random injection, storage decoding and settled checkpoint semantics.

Simulation coverage: source-weight integrity, seeded reproducibility, no adaptive inputs, paid-spin-plus-feature aggregation, correct streaming confidence statistics, feature/cascade metrics, corruption-guard reporting, and final >=10M acceptance audit.

Browser coverage: route, first paid spin, deterministic multi-cascade sequence, aggregate announcements, wager changes/locking, Vault Run entry/progression/exit, settled reload/restore, keyboard/touch, 320px, 200% text, >=48px important targets, reduced motion, opt-in audio and no horizontal overflow.

Production completion requires exact dependency freshness, TypeScript, game/document governance, full unit/rules/shared browser/game browser coverage, both production builds, Pages artifact upload and successful GitHub Pages deployment on the exact functional revision.

## Implementation evidence

- RED: `a52d99774c9384ad6a0b4c0ccfbf1c5e7cb51e9a` / run `38122640264`; dependency/design gates passed, TypeScript failed because the three intended engine modules did not exist.
- Engine implementation: `f71588d2ca0c96e685f54631c0afb6ded56ade84`.
- Fixture correction: `ae5a7e3630964d13efb23bb06c57dc582dbb2455`. The original deterministic fixture had unrelated Copper on reel 4, legitimately extending the intended 3-reel second cascade to 4 reels (700 total). Replacing only that cell with Silver preserves the intended two-cascade, 400-unit contract. Independent strict TypeScript + reconstructed focused assertions then pass.
- Terminal feature hardening: `206f2a6aa0ab4a3b0c31aeb4f450b7bc2d83b820` adds a no-win final-free-spin regression requiring `nextVaultState === null` after remaining spins reach zero.
- Canonical run `39280095530` on `206f2a6a…` passed frozen install/exact-pin checks, then stopped at dependency-current because newer stable patches had appeared before any game checks.
- Dependency request revision 8 corrected those targets. Maintenance run `39294812001` verified every target as npm latest, passed design lint and TypeScript, and then exposed two handoff-document schema regressions. The PRD/todo schema repair in `af5a10b6ba4551a7b940382a5d36b67a2b9aaf75` passed `game-check` in maintenance run `39295604436`; history-aware `game-doc-sync` then correctly required this authoritative spec and tracker to move together. This integration satisfies that atomic-pair rule before maintenance is rerun.
- No CV-001 GREEN claim is made until the refreshed-dependency full validator reaches and passes the unchanged focused/full unit suite.
- **CV-001 canonical GREEN:** refreshed exact revision `08c3506773d17eee3fed7554f211531141856386` passed frozen install, dependency freshness, design lint, TypeScript, history-aware game/document governance, the full unit suite, Firestore rules, shared account/persistence browser checks, the complete design/game browser suite, both production builds, Pages artifact upload and GitHub Pages deployment in run `39296638285`. CV-001 is therefore verified; the game remains implementing because CV-002 through CV-005 are open.
- **CV-002 TDD RED:** exact test-only revision `82b7bb2fa9d2e5aafa2cd7d2b080052127240c5e` / run `39297705487` passed frozen install, dependency freshness and design lint, then TypeScript failed only with `TS2307` because `src/games/cascade-vault/simulation.ts` did not exist. All downstream checks were skipped. The fixed test contract remains unchanged for GREEN.
- **CV-002 simulator GREEN:** implementation revision `cf8f6e3723f483bc126b0f50b0f42161c14dff56` passed the full push validation and Pages deployment chain in run `39298014858`, including the simulation-focused unit contract. Independent review then identified three evidence-strengthening gaps—nonzero feature aggregation, a fixed PRNG vector, and explicit corruption-guard propagation—which are added in the current test-only hardening commit before balance screening.
- **Evidence-hardening fixture correction:** run `39299103907` on `6fa7b570622c3faabe1942d7f2dad7a4d5ba1f99` passed dependency freshness, TypeScript and governance, then failed one new unit fixture because the chosen refill symbols accidentally formed a second Sapphire way and exhausted the queued fixture. Production simulation code did not fail. The corrected refill triplet `vault_crown/copper/copper` has been independently checked to end the free spin after the intended single 200-unit quartz cascade.
- **Evidence-hardening GREEN:** fixture-only correction `fac39b0744d2872ec05cab7b9e8f7c7aadb26cc6` passed the complete repository validation, both builds, artifact upload and Pages deployment in run `39299407841`; the simulation contract now covers nonzero feature aggregation, a fixed seeded-PRNG vector and explicit corruption-guard propagation. A separate opt-in audit harness/workflow is being added so >=10M Monte Carlo evidence is never run accidentally by the routine unit suite.

## Research basis

The free-play design follows conservative gambling-technology principles: understandable rules/likelihood information, demonstrably random non-adaptive outcomes, and no mechanics that encourage chasing losses or escalating stakes. Accessibility follows WCAG 2.2 resize/reflow/target principles and honors reduced-motion preferences.

## Completion contract

**Completion state:** implementing  
**Completion evidence:** CV-001 is verified on refreshed exact revision `08c3506773d17eee3fed7554f211531141856386` / run `39296638285`; CV-002 opens test-first with a focused missing-`simulation.ts` contract. Whole-game completion remains open for probability, persistence, playable UI/audio and release gates.

- [x] Exact ways/Wild/removal/gravity/refill/cascade/Vault Run/final-feature-termination engine passes focused/full tests (`08c35067…`, run `39296638285`).
- [ ] Reproducible >=10,000,000-spin audit records RTP/SE/95% CI/feature frequency/cascade depth/guard incidence and the interval intersects 94%–97% with zero guard hits.
- [ ] Settled schema-v1 persistence, reload, feature termination/checkpoint and restore behavior pass focused tests.
- [ ] Accessible playable board/Vault Run/audio browser contract passes deterministic gameplay, 320px, 200%-text, target-size, keyboard/touch and reduced-motion gates.
- [ ] Catalog/workspace route and all living governance surfaces are synchronized.
- [ ] Exact dependency freshness, TypeScript, governance, unit/rules/shared browser/game browser suites pass on the final functional revision.
- [ ] Both production builds and Pages artifact upload succeed on that revision.
- [ ] GitHub Pages deployment succeeds and tracker/PRD/todo/GAME_INDEX/.tasks close as verified; TASK-003 may remain externally blocked.

### 2026-10-20 — Audit runner discovery repair
Audit workflow run `39300303052` on `7696b76668cd984a5a9e10ccbcc3c39250c37cff` passed dependency freshness, TypeScript, and all 25 focused engine/simulation tests, then failed before simulation because the repository Vitest configuration only discovered `tests/unit/**/*.test.ts`; `tests/audit/cascade-vault-audit.test.ts` was filtered out. The audit runner itself and production simulator were not implicated. `vite.config.ts` now conditionally includes `tests/audit/**/*.test.ts` only when `CASCADE_VAULT_AUDIT=1`, leaving routine `pnpm test:unit` discovery unchanged. Next evidence: routine full validation plus an explicit 25,000-paid-spin audit run on the repaired harness.

### 2026-10-20 — CV-003 persistence TDD opened in parallel
With the production simulator already GREEN and balance auditing isolated from save semantics, CV-003 opens independently with a test-only contract for schema-v1 settled persistence. The RED requires a 5,000-credit default represented as 500,000 centi-credit units, supported wager validation, malformed/non-finite/negative rejection, compact settled result summaries (no boards/animation frames), exact paid/free settlement accounting, validated active/null Vault checkpoints, one-time completed-run counting, insufficient-bankroll rejection, and practice-credit restore only below 10 credits with no active feature. Ruling: settlement helpers remain pure whole-state transforms and do not invent transaction IDs absent from the approved platform contract; duplicate invocation prevention belongs to the single-resolution workspace control path and will be browser-verified in CV-004. No persistence production module exists in this RED integration.

