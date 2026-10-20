# Cascade Vault Implementation Plan

> **For agentic workers:** Use the host's available task-by-task implementation workflow. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a production-quality six-reel, five-row cascading ways slot with transparent weighted symbols, Wild/Scatter rules, persistent feature multiplier, bounded Vault Run upgrades, durable checkpoints, accessibility, and reproducible probability evidence.

**Architecture:** The game is isolated under `src/games/cascade-vault/`. Pure board/ways/cascade/feature logic is separated from React, persistence, simulation tooling, and audio. It integrates through existing catalog/workspace/save contracts and shares no gameplay logic with the other slot titles.

**Tech Stack:** React 19.3.0, TypeScript 7.0.2, Vite 8.3.4, Vitest 5.0.3, Playwright 1.64.0, Firebase 13.0.0 shared save platform, CSS.

## Global Constraints

- Virtual credits only; no purchases, cash-out, ads, telemetry, autoplay, adaptive odds, loss-chasing, or stake-escalation prompts.
- 6×5 board. Ways start on reel 1 and require at least three consecutive reels. Ways count is the product of participating occurrences. Wild substitutes only normal symbols; Scatter never substitutes.
- Normal winning symbols are removed simultaneously, gravity compacts, and refill continues until no win. Base multiplier starts ×1 and increments for each subsequent winning cascade to ×10.
- Scatters appear only on initial boards, never cascade refills. 4/5/6+ Scatters trigger 8/10/12 Vault Run free spins.
- Vault Run persistent multiplier starts ×2 and rises with winning cascades to ×20. Meter advances once per free spin when at least three winning cascades resolve: step 1 adds exactly one Wild to each later refill, step 2 applies ×1.5 to normal-symbol ways awards, step 3 adds exactly three free spins once. Retrigger adds four, remaining spins cap at 20.
- Hard 50-cascade corruption guard. Durable state checkpoints only after a full paid/free spin including all cascades resolves.
- Approved fractional payouts use integer centi-credit accounting (`CREDIT_SCALE = 100`); no whole-credit rounding is permitted.
- Final weighted distribution must produce reproducible 10,000,000-spin Monte Carlo evidence whose 95% confidence interval intersects 94–97% RTP target; implementation remains incomplete otherwise.
- Responsive at 320 CSS px, 200% text resilient, keyboard/touch accessible, 48px important targets, visible focus, reduced-motion equivalent, aggregate textual cascade announcements, no horizontal overflow.
- Synchronize spec, PRD, tracker, todo, GAME_INDEX, `.tasks`; TASK-003 remains external Firebase provisioning only.

---

### Task 1: Ways evaluation, gravity, and deterministic cascade engine

**Files:**
- Create: `src/games/cascade-vault/symbols.ts`
- Create: `src/games/cascade-vault/paytable.ts`
- Create: `src/games/cascade-vault/engine.ts`
- Test: `tests/unit/cascade-vault-engine.test.ts`

**Interfaces:**
- Consumes: injected random integer/symbol source and immutable 6×5 board.
- Produces: `createInitialBoard(random)`, `evaluateWays(board, wager, modifiers)`, `collapseAndRefill(board, removals, random, modifiers)`, `resolveSpin(...)`, feature transition types.

**Evidence:** RED exact revision `a52d99774c9384ad6a0b4c0ccfbf1c5e7cb51e9a`, run `38122640264`; TypeScript reached the intentional missing-module failure after dependency/design gates. The fixed unit contract remains unchanged. Production modules are integrated for GREEN verification; no GREEN is claimed yet.

- [x] **Step 1: Add focused failing tests**

The contract covers ways count multiplication; three-to-six-reel awards; Wild substitution without double-paying one concrete way; simultaneous removal; gravity order; refill count/position; multiplier progression/caps; Scatter initial-board-only generation; 4/5/6 Scatter trigger counts; Vault Run persistent multiplier; meter once-per-free-spin progression; step-1 forced Wild; step-2 ×1.5 modifier; one-time step-3 +3; +4 retrigger with 20-spin cap; 50-cascade guard.

- [x] **Step 2: Verify relevant failure**

Revision `a52d9977…` / run `38122640264` failed because `symbols.ts`, `paytable.ts`, and `engine.ts` were absent; downstream implicit-any diagnostics came from those missing imports.

- [x] **Step 3: Implement minimum behavior**

Board is six reel arrays of five symbols. Ways are evaluated from one immutable snapshot. Duplicate Wild interpretation is handled combinatorially: only all-Wild concrete ways overlap between symbol interpretations, so those ways are awarded once to the highest valid paytable interpretation rather than enumerating every concrete path. Collapse keeps survivor order, refills top vacancies only, and the step-1 feature Wild uses the same random source. Exact awards remain centi-credit integers. Current symbol weights are provisional until Task 2.

- [ ] **Step 4: Verify focused pass**

Run `pnpm vitest run tests/unit/cascade-vault-engine.test.ts`; expected zero exit.

- [ ] **Step 5: Integration check**

Run `pnpm typecheck && pnpm game:check && pnpm test:unit`; expected zero exit.

- [ ] **Step 6: Commit passing deliverable**

Record the exact GREEN revision/run and then open Task 2.

### Task 2: Simulation/probability audit and balance gate

**Current evidence:** TDD RED recorded on exact revision `82b7bb2fa9d2e5aafa2cd7d2b080052127240c5e` / run `39297705487`: dependency/design gates passed, then TypeScript failed only because `simulation.ts` was intentionally absent. GREEN implementation must satisfy the unchanged `tests/unit/cascade-vault-simulation.test.ts` contract and reuse the production engine/random-source adapter.

**Audit harness:** routine `vitest run` keeps the heavy audit skipped. `pnpm audit:cascade-vault` explicitly enables `tests/audit/cascade-vault-audit.test.ts`; `.github/workflows/cascade-vault-audit.yml` supplies reproducible paid-spin/seed/wager inputs, emits one `CASCADE_VAULT_AUDIT_RESULT` JSON record, and optionally enforces the >=10M / zero-guard / 94%-97% CI-intersection acceptance gate.

**Files:**
- Create: `src/games/cascade-vault/simulation.ts`
- Test: `tests/unit/cascade-vault-simulation.test.ts`

**Interfaces:**
- Consumes: source-controlled symbol distributions and `resolveSpin` engine.
- Produces: deterministic seeded PRNG adapter for audit only, `simulatePaidSpins(count, seed)`, observed RTP, standard error, 95% confidence interval, feature frequency, average cascade depth.

- [ ] **Step 1: Add focused failing tests** — weight normalization/counts, same-seed reproducibility, known confidence calculation, finite/non-negative counters.
- [ ] **Step 2: Verify failure** — focused simulation test must fail because module is absent.
- [ ] **Step 3: Implement minimum behavior** — seeded PRNG remains audit/test-only; stream statistics; production remains cryptographic.
- [ ] **Step 4: Verify focused pass** — focused simulation tests zero exit.
- [ ] **Step 5: Run balance audit** — reproducible >=10,000,000 paid spins; 95% RTP CI must intersect 94–97%; rebalance weights/paytable and rerun if not.
- [ ] **Step 6: Commit balance evidence source** — record seed/count/RTP/SE/95% CI/feature frequency/cascade depth only after final constants are fixed.

### Task 3: Durable save/checkpoint contract

**Files:**
- Create: `src/games/cascade-vault/storage.ts`
- Create: `src/games/cascade-vault/persistence.ts`
- Test: `tests/unit/cascade-vault-persistence.test.ts`

**Interfaces:**
- Produces: `CascadeVaultSave`, `cascadeVaultSaveDefinition`, fully settled paid/free-spin checkpoint helpers.

- [ ] **Step 1: Add focused failing tests** — 5,000 initial bankroll, supported wager, malformed/non-finite/negative rejection, stats, settled Vault Run decode, no partial cascade representation, restore preserving stats/preferences.
- [ ] **Step 2: Verify failure** — missing module.
- [ ] **Step 3: Implement minimum behavior** — schema v1, slug `cascade-vault`, storage key `inmogames:cascade-vault:v1`; persist settled bankroll/statistics/preferences plus post-free-spin feature state only.
- [ ] **Step 4: Verify focused pass**.
- [ ] **Step 5: Integration check** — `pnpm test:unit && pnpm typecheck`.
- [ ] **Step 6: Commit passing deliverable**.

### Task 4: Accessible cascading board UI, finite sequence presentation, and audio

**Files:**
- Implement: `src/games/cascade-vault/CascadeVaultWorkspace.tsx`
- Create: `src/games/cascade-vault/cascade-vault.css`
- Create: `src/games/cascade-vault/audio.ts`
- Test: `tests/browser/cascade-vault.mjs`

**Interfaces:**
- Consumes: pre-resolved engine event sequence and save contract.
- Produces: responsive board/feature UI and opt-in procedural cues.

- [ ] **Step 1: Add focused failing browser test** — route/rules; Spin keyboard/touch; deterministic multi-cascade; aggregate announcements; feature multiplier/meter/free-spin counts; wager lock during resolution; reduced-motion replacement; sound opt-in; 320px/200%-text no overflow; 48px important controls.
- [ ] **Step 2: Verify failure** — expected missing playable route/workspace integration.
- [ ] **Step 3: Implement minimum behavior** — resolve logic before presentation; finite CSS transitions only; reduced motion skips travel; concise accessible labels; native disclosure for rules/paytable.
- [ ] **Step 4: Verify focused pass**.
- [ ] **Step 5: Integration check** — `pnpm typecheck && pnpm test:unit && pnpm build`.
- [ ] **Step 6: Commit passing deliverable**.

### Task 5: Catalog/governance integration and exact-revision verification

**Files:**
- Modify: `src/catalog.ts`
- Modify: `src/games/workspaces.tsx`
- Modify: `package.json`
- Maintain: `src/games/cascade-vault/PRD.md`, `TRACKER.md`, `todo.md`, authoritative spec/plan, `docs/GAME_INDEX.md`, `.tasks/IN_PROGRESS.md`
- Test: `tests/unit/catalog.test.ts`

- [ ] **Step 1: Add/update integration assertions** — catalog slug uniqueness/workspace route and browser suite registration.
- [ ] **Step 2: Verify governance failure before completion** where applicable.
- [ ] **Step 3: Complete integration/governance** — register metadata/workspace and record final 10M audit evidence.
- [ ] **Step 4: Verify integration** — `pnpm game:check && pnpm typecheck && pnpm test:unit`.
- [ ] **Step 5: Full validation** — `pnpm validate`; confirm Actions build and Pages deployment for exact revision.
- [ ] **Step 6: Synchronize verification evidence** — update tracker/spec/todo/GAME_INDEX/.tasks atomically with exact revision/workflow evidence; keep TASK-003 external where live account saves remain blocked.

## Unresolved externally observable decisions

None. The approved design resolves feature thresholds, paytable multipliers, meter semantics, retrigger/cascade caps, payout precision, and RTP acceptance range. Symbol distribution weights remain an engineering tuning parameter constrained by the documented probability acceptance gate.

### 2026-10-20 — Audit runner discovery repair
Audit workflow run `39300303052` on `7696b76668cd984a5a9e10ccbcc3c39250c37cff` passed dependency freshness, TypeScript, and all 25 focused engine/simulation tests, then failed before simulation because the repository Vitest configuration only discovered `tests/unit/**/*.test.ts`; `tests/audit/cascade-vault-audit.test.ts` was filtered out. The audit runner itself and production simulator were not implicated. `vite.config.ts` now conditionally includes `tests/audit/**/*.test.ts` only when `CASCADE_VAULT_AUDIT=1`, leaving routine `pnpm test:unit` discovery unchanged. Next evidence: routine full validation plus an explicit 25,000-paid-spin audit run on the repaired harness.

### 2026-10-20 — CV-003 persistence TDD opened in parallel
With the production simulator already GREEN and balance auditing isolated from save semantics, CV-003 opens independently with a test-only contract for schema-v1 settled persistence. The RED requires a 5,000-credit default represented as 500,000 centi-credit units, supported wager validation, malformed/non-finite/negative rejection, compact settled result summaries (no boards/animation frames), exact paid/free settlement accounting, validated active/null Vault checkpoints, one-time completed-run counting, insufficient-bankroll rejection, and practice-credit restore only below 10 credits with no active feature. Ruling: settlement helpers remain pure whole-state transforms and do not invent transaction IDs absent from the approved platform contract; duplicate invocation prevention belongs to the single-resolution workspace control path and will be browser-verified in CV-004. No persistence production module exists in this RED integration.

### 2026-10-20 — CV-003 implementation checkpoint
CV-003 RED `40442255…` / run `39458077585` is clean missing-module evidence. The current candidate implements only `storage.ts` and `persistence.ts`: schema-v1 settled checkpoints, compact result summaries, centi-credit accounting, engine-validated Vault transitions, affordability guard and restore below 10 credits. Focused/full GREEN remains pending.

### 2026-10-20 — CV-002 first distribution tuning candidate
Production audit run `39459206136` on persistence-GREEN revision `343ca3fcaccd8efb09ebc0200e6608ca1ed74b74` passed dependency freshness, TypeScript and all focused engine/simulation tests, then the 25,000-paid-spin screen aborted with `corruptionGuardHits: 1` at the hard 50-cascade limit. This rejects the provisional distribution for acceptance and proves paytable-only scaling cannot solve the evolution risk. Candidate D1 therefore flattens paying-symbol concentration and reduces Wild weight: initial/refill paying weights `13/12/12/11/11/11/10/1` with Wild `1`; initial Scatter remains `4` and refill Scatter remains forbidden. Paytable is unchanged for this screen so the next audit isolates distribution effects. CV-003 persistence is verified independently on `343ca3fc…` / run `39459146356`.

### 2026-10-20 — CV-002 structural candidate D2: inert blank
Distribution-only candidate D1 (`7d94703394ee570c76a44fafa98b3dd75032a5d1`) still hit the 50-cascade guard in 25k audit run `39459715477`, proving that flattening probabilities inside an all-paying 6×5 symbol set is insufficient. Ruling: add one explicit inert `blank` board symbol to initial/refill distributions at weight 24. Blank is not in `PAYING_SYMBOLS`, cannot be substituted by Wild, never wins or enters win removals, but otherwise occupies a board cell and follows normal survivor/gravity behavior. Existing D1 paying/Wild/Scatter weights are unchanged; Scatter stays initial-only. The hard 50-cascade guard remains a fault circuit breaker, never a normal truncation/settlement rule. Focused regression proves blank is nonpaying and refill still excludes Scatter. Paytable remains unchanged until D2 clears chain-risk screening.

### 2026-10-20 — CV-002 calibrated candidate D3
D2 exact revision `5c2062f876b267a8ef6751a49c1cb1c036680b27` passed the full repository chain and Pages deployment in run `39460176426`. Its same-seed 25,000-paid-spin audit `39460203286` completed with zero corruption-guard hits, proving the inert-blank structure materially stabilizes cascade tails, but measured RTP was `13.214587` (1321.4587%; 95% CI `11.514863..14.914311`). D3 therefore increases blank weight modestly from 24 to 30 and scales the paytable to approximately 8.5% of D2 using positive integer centi multipliers. Independent math review confirms the screening estimate `13.214587 × 0.85 × 0.085 ≈ 0.954754`; this is a hypothesis only, not acceptance evidence. D3 must pass the unchanged full validation and same-seed 25k audit before any confirmation run.

