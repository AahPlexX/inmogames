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
- Consumes: injected random integer source and immutable 6×5 board.
- Produces: `createInitialBoard(random, mode)`, `evaluateWays(board, wager, modifiers)`, `collapseAndRefill(board, removals, random, modifiers)`, `resolveSpin(...)`, feature transition types.

- [ ] **Step 1: Add focused failing tests**

Assert ways count multiplication; three-to-six-reel awards; Wild substitution without double-paying one concrete way; simultaneous removal; gravity order; refill count/position; multiplier progression/caps; Scatter initial-board-only generation; 4/5/6 Scatter trigger counts; Vault Run persistent multiplier; meter once-per-free-spin progression; step-1 forced Wild; step-2 ×1.5 modifier; one-time step-3 +3; +4 retrigger with 20-spin cap; 50-cascade guard throws explicit engine error.

- [ ] **Step 2: Verify relevant failure**

Run: `pnpm vitest run tests/unit/cascade-vault-engine.test.ts`
Expected: non-zero because engine modules are absent.

- [ ] **Step 3: Implement minimum behavior**

Represent board as six reel arrays of five symbols. Evaluate each payable symbol independently from the immutable board, selecting valid Wild assignments without duplicate interpretation payout. Return exact winning coordinates/removal set and integer-credit award. Collapse each reel downward, refill only vacated cells, apply feature Wild replacement through the same random source, and resolve cascades iteratively with corruption guard.

- [ ] **Step 4: Verify focused pass**

Run same focused test; expected zero exit.

- [ ] **Step 5: Integration check**

Run `pnpm typecheck && pnpm test:unit`; expected zero exit.

- [ ] **Step 6: Commit passing deliverable**

Commit engine/symbols/paytable/tests.

### Task 2: Simulation/probability audit and balance gate

**Files:**
- Create: `src/games/cascade-vault/simulation.ts`
- Test: `tests/unit/cascade-vault-simulation.test.ts`

**Interfaces:**
- Consumes: source-controlled symbol distributions and `resolveSpin` engine.
- Produces: deterministic seeded PRNG adapter for audit only, `simulatePaidSpins(count, seed)`, observed RTP, standard error, 95% confidence interval, feature frequency, average cascade depth.

- [ ] **Step 1: Add focused failing tests**

Assert weight normalization/counts, deterministic identical result for same seed/count, confidence-bound calculation on a known synthetic sample, and output counters staying finite/non-negative.

- [ ] **Step 2: Verify failure**

Run focused simulation tests; expected module-missing failure.

- [ ] **Step 3: Implement minimum behavior**

Keep seeded PRNG test/audit-only; production still uses cryptographic randomness. Stream simulation statistics without retaining all outcomes. Provide a scriptable function capable of 10,000,000 spins within CI/tooling limits or a separate explicitly invoked audit command if full count is too slow for every normal validation run.

- [ ] **Step 4: Verify focused pass**

Run focused test; expected zero exit.

- [ ] **Step 5: Run balance audit**

Run the reproducible 10,000,000-spin audit outside the default unit hot path. Expected: 95% RTP confidence interval intersects 94–97%. If not, rebalance source-controlled symbol weights/paytable and rerun tests/audit before UI work is considered complete.

- [ ] **Step 6: Commit balance evidence source**

Commit simulation code/tests and record audit output in tracker only after final gameplay constants are fixed.

### Task 3: Durable save/checkpoint contract

**Files:**
- Create: `src/games/cascade-vault/storage.ts`
- Create: `src/games/cascade-vault/persistence.ts`
- Test: `tests/unit/cascade-vault-persistence.test.ts`

**Interfaces:**
- Produces: `CascadeVaultSave`, `cascadeVaultSaveDefinition`, fully settled paid/free-spin checkpoint helpers.

- [ ] **Step 1: Add focused failing tests**

Assert 5,000 initial bankroll and valid default wager; supported wager enumeration; malformed/non-finite/negative rejection; stats; settled Vault Run checkpoint decode; no partial cascade representation; restore-to-5,000 preserving stats/preferences.

- [ ] **Step 2: Verify failure**

Run focused persistence test; expected missing module failure.

- [ ] **Step 3: Implement minimum behavior**

Schema v1, slug `cascade-vault`, storage key `inmogames:cascade-vault:v1`; persist fully settled bankroll/statistics/preferences plus post-free-spin feature state only. Never serialize board/cascade animation state.

- [ ] **Step 4: Verify focused pass**

Run focused test; expected zero exit.

- [ ] **Step 5: Integration check**

Run `pnpm test:unit && pnpm typecheck`; expected zero exit.

- [ ] **Step 6: Commit passing deliverable**

Commit persistence modules/tests.

### Task 4: Accessible cascading board UI, finite sequence presentation, and audio

**Files:**
- Create: `src/games/cascade-vault/CascadeVaultWorkspace.tsx`
- Create: `src/games/cascade-vault/cascade-vault.css`
- Create: `src/games/cascade-vault/audio.ts`
- Create: `src/games/cascade-vault/cascade-vault.meta.ts`
- Test: `tests/browser/cascade-vault.mjs`

**Interfaces:**
- Consumes: pre-resolved engine event sequence and save contract.
- Produces: responsive board/feature UI, metadata, opt-in procedural cues.

- [ ] **Step 1: Add focused failing browser test**

Assert initial route/rules; Spin native keyboard/touch operation; deterministic known multi-cascade sequence; textual aggregate cascade announcements; feature multiplier/meter/free-spin counts; wager disabled during resolution; reduced-motion immediate board replacement; sound opt-in; 320px and 200%-text no horizontal overflow; 48px important controls.

- [ ] **Step 2: Verify failure**

Run browser test; expected missing route/workspace.

- [ ] **Step 3: Implement minimum behavior**

Resolve full logical sequence before presentation. Present board states in order with finite CSS transitions only; reduced-motion skips travel. Use concise accessible labels rather than announcing every moving cell. Keep rules/paytable in native disclosure and status/control flow in normal document layout.

- [ ] **Step 4: Verify focused pass**

Run browser test; expected zero exit.

- [ ] **Step 5: Integration check**

Run `pnpm typecheck && pnpm test:unit && pnpm build`; expected zero exit.

- [ ] **Step 6: Commit passing deliverable**

Commit UI/audio/meta/browser test.

### Task 5: Catalog/governance integration and exact-revision verification

**Files:**
- Modify: `src/catalog.ts`
- Modify: `src/games/workspaces.tsx`
- Modify: `package.json`
- Create: `src/games/cascade-vault/PRD.md`
- Create: `src/games/cascade-vault/TRACKER.md`
- Create: `src/games/cascade-vault/todo.md`
- Modify: `docs/GAME_INDEX.md`
- Modify: `.tasks/IN_PROGRESS.md`
- Test: `tests/unit/catalog.test.ts`

**Interfaces:**
- Produces discoverable `#/games/cascade-vault` and synchronized handoff/evidence.

- [ ] **Step 1: Add/update integration assertions**

Assert catalog slug uniqueness/workspace route and add browser suite to `test:design-browser`.

- [ ] **Step 2: Verify governance failure before completion**

Run `pnpm game:check` while required game docs/index link are absent; expected targeted failure.

- [ ] **Step 3: Complete integration/governance**

Register metadata/workspace. Add PRD/tracker/todo in implementing state; synchronize Completion contract, GAME_INDEX, task ledger. Record final 10M-spin audit seed/count/RTP/SE/95% CI/feature frequency/average cascade depth and exact tested constants.

- [ ] **Step 4: Verify integration**

Run `pnpm game:check && pnpm typecheck && pnpm test:unit`; expected zero exit.

- [ ] **Step 5: Full validation**

Run `pnpm validate`; expected zero exit. Confirm GitHub Actions build and Pages deployment for exact revision.

- [ ] **Step 6: Synchronize verification evidence**

Update tracker/spec/todo/GAME_INDEX/.tasks atomically with exact revision/workflow evidence. Keep TASK-003 external where live authenticated saves remain blocked.

## Unresolved externally observable decisions

None. The approved design resolves feature thresholds, paytable multipliers, meter semantics, retrigger/cascade caps, and RTP acceptance range. Symbol distribution weights remain an engineering tuning parameter constrained by the documented probability acceptance gate.