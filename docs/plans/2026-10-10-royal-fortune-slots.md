# Royal Fortune Slots Implementation Plan

> **For agentic workers:** Use the host's available task-by-task implementation workflow. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a production-quality five-reel, three-row, twenty-payline virtual-credit slot game with transparent fixed rules, Wild/Scatter behavior, free spins, persistence, accessibility, and regression coverage.

**Architecture:** The game lives entirely under `src/games/royal-fortune-slots/` with pure engine/reel/paytable modules separated from React presentation, storage, and audio. It integrates through the existing catalog/workspace registries and shared versioned save repository; gameplay logic is not shared with the other slot games.

**Tech Stack:** React 19.3.0, TypeScript 7.0.2, Vite 8.3.4, Vitest 5.0.3, Playwright 1.64.0, Firebase 13.0.0 shared save platform, CSS.

## Global Constraints

- Virtual credits only: no purchase, deposit, withdrawal, cash value, ads, telemetry, autoplay, loss-chasing prompts, stake-escalation prompts, or adaptive outcome behavior.
- 5 reels × 3 rows, 20 always-active fixed paylines, source-controlled reel strips/paytable, browser cryptographic randomness in production and deterministic injected randomness in tests.
- Wild substitutes for normal symbols but not Scatter. Three/four/five Scatters trigger 8/12/20 free spins; retriggers add 5. Free-spin line-win multiplier increases after each winning free spin to ×5.
- Durable checkpoints may only represent fully settled outcomes. Live reel animation/partial evaluation is never persisted.
- Responsive from 320 CSS px upward, usable at 200% text, native keyboard/touch controls, 48 CSS px important targets, visible focus, reduced-motion support, textual outcome equivalents, no horizontal page overflow.
- Game documentation must remain synchronized with `docs/specs/2026-10-10-royal-fortune-slots-design.md`, `PRD.md`, `TRACKER.md`, `todo.md`, `docs/GAME_INDEX.md`, and `.tasks/` state.
- TASK-003 remains the external live-Firebase blocker and must not be misreported as game-local completion work.

---

### Task 1: Deterministic reel, payline, and payout engine

**Files:**
- Create: `src/games/royal-fortune-slots/reels.ts`
- Create: `src/games/royal-fortune-slots/paytable.ts`
- Create: `src/games/royal-fortune-slots/engine.ts`
- Test: `tests/unit/royal-fortune-slots-engine.test.ts`

**Interfaces:**
- Consumes: injected `RandomSource` returning integer stops within a requested exclusive upper bound.
- Produces: `spinReels(random): ReelWindow`, `evaluateSpin(window, wager, featureState): SpinEvaluation`, `advanceFreeSpins(...)`, and source-controlled `PAYLINES`, `REEL_STRIPS`, `PAYTABLE`.

- [ ] **Step 1: Add the focused failing test**

Assert exact deterministic windows from injected stops; left-to-right fixed-payline evaluation; Wild substitution without Scatter substitution; additive multiple-line awards; independent Scatter award/trigger counts; free-spin trigger/retrigger counts; multiplier increment only after a winning free spin and cap at ×5; rejection of invalid wager/window dimensions.

- [ ] **Step 2: Verify the relevant failure**

Run: `pnpm vitest run tests/unit/royal-fortune-slots-engine.test.ts`
Expected: non-zero because the Royal Fortune engine modules do not yet exist.

- [ ] **Step 3: Implement the minimum behavior**

Use explicit ordered reel strips and immutable windows. Evaluate each of 20 source-controlled paylines left-to-right, determining the best payable normal symbol when Wilds are present. Calculate integer-credit awards from wager-scaled paytable multipliers chosen so every supported wager produces integral payouts. Evaluate Scatters independently anywhere on the 15-cell window. Keep feature transitions pure and independent of React/storage.

- [ ] **Step 4: Verify the focused pass**

Run: `pnpm vitest run tests/unit/royal-fortune-slots-engine.test.ts`
Expected: zero exit and all Royal Fortune engine assertions pass.

- [ ] **Step 5: Run the affected integration check**

Run: `pnpm typecheck && pnpm test:unit`
Expected: zero exit with no regression in existing unit suites.

- [ ] **Step 6: Commit the passing deliverable**

Commit engine, reel/paytable constants, and focused unit tests together.

### Task 2: Durable save contract and settlement checkpoints

**Files:**
- Create: `src/games/royal-fortune-slots/storage.ts`
- Create: `src/games/royal-fortune-slots/persistence.ts`
- Test: `tests/unit/royal-fortune-slots-persistence.test.ts`

**Interfaces:**
- Consumes: `GameSaveDefinition<T>` from `src/platform/saves/contracts.ts`.
- Produces: `RoyalFortuneSave`, `royalFortuneSaveDefinition`, decode/initial helpers, and settled-spin checkpoint creation.

- [ ] **Step 1: Add the focused failing test**

Assert defaults (2,500 bankroll and valid default wager), valid round-trip decoding, rejection of malformed/non-finite/negative state, settled-stat arithmetic, restore-practice-credit behavior preserving statistics/preferences, and that no in-flight reel state exists in the durable schema.

- [ ] **Step 2: Verify the relevant failure**

Run: `pnpm vitest run tests/unit/royal-fortune-slots-persistence.test.ts`
Expected: non-zero because persistence modules do not exist.

- [ ] **Step 3: Implement the minimum behavior**

Use schema version 1, slug `royal-fortune-slots`, storage key `inmogames:royal-fortune-slots:v1`. Decode only finite integers/booleans/enumerated wagers and bounded feature checkpoint fields. Save only settled bankroll/statistics/preferences and a fully settled free-spin checkpoint when applicable.

- [ ] **Step 4: Verify the focused pass**

Run: same focused command; expected zero exit.

- [ ] **Step 5: Run the affected integration check**

Run: `pnpm test:unit && pnpm typecheck`; expected zero exit.

- [ ] **Step 6: Commit the passing deliverable**

Commit storage/persistence plus tests.

### Task 3: Accessible responsive machine UI, motion, and audio

**Files:**
- Create: `src/games/royal-fortune-slots/RoyalFortuneSlotsWorkspace.tsx`
- Create: `src/games/royal-fortune-slots/royal-fortune-slots.css`
- Create: `src/games/royal-fortune-slots/audio.ts`
- Create: `src/games/royal-fortune-slots/royal-fortune-slots.meta.ts`
- Test: `tests/browser/royal-fortune-slots.mjs`

**Interfaces:**
- Consumes: pure engine and save definition; existing `usePlatform()`/save-session contract used by Royal Palace.
- Produces: default React workspace, catalog metadata, opt-in procedural sound cues, accessible spin/result UI.

- [ ] **Step 1: Add the focused failing browser test**

Assert route renders; rules/paytable are discoverable before first spin; Spin is keyboard/touch operable; wager changes are bounded by bankroll; deterministic test seam yields a known win; free-spin status is textual; sound does not autoplay; reduced motion removes reel travel; 320px and 200% text have no horizontal overflow; important targets are at least 48px.

- [ ] **Step 2: Verify the relevant failure**

Run the new browser test against the dev server; expected failure because route/workspace are absent.

- [ ] **Step 3: Implement the minimum behavior**

Build semantic machine UI in normal document flow. Use `aria-live` for aggregate spin/result announcements, native buttons, `details/summary` for rules/paytable, CSS-only finite reel/result motion disabled under reduced motion, and local Web Audio created only after an enabled user gesture. No visual-only outcome information.

- [ ] **Step 4: Verify the focused pass**

Run the browser test; expected zero exit.

- [ ] **Step 5: Run the affected integration check**

Run: `pnpm typecheck && pnpm test:unit && pnpm build`; expected zero exit.

- [ ] **Step 6: Commit the passing deliverable**

Commit UI/audio/meta/browser test.

### Task 4: Catalog integration, governance, and full verification

**Files:**
- Modify: `src/catalog.ts`
- Modify: `src/games/workspaces.tsx`
- Modify: `package.json`
- Create: `src/games/royal-fortune-slots/PRD.md`
- Create: `src/games/royal-fortune-slots/TRACKER.md`
- Create: `src/games/royal-fortune-slots/todo.md`
- Modify: `docs/GAME_INDEX.md`
- Modify: `.tasks/IN_PROGRESS.md`
- Test: `tests/unit/catalog.test.ts`

**Interfaces:**
- Consumes: `GameMeta`, `workspaces` registry, repo game-documentation contract.
- Produces: discoverable `#/games/royal-fortune-slots` title with synchronized implementation handoff.

- [ ] **Step 1: Add/update focused integration assertions**

Assert unique slug/catalog visibility and workspace resolution. Add browser suite to `test:design-browser`.

- [ ] **Step 2: Verify the relevant failure**

Run: `pnpm game:check` before governance files are complete; expected targeted failure if any required game document/index link is missing.

- [ ] **Step 3: Implement integration/governance**

Register metadata/workspace, add living PRD/tracker/todo in implementing state, synchronize authoritative spec Completion contract, GAME_INDEX and task ledger. Record calculated theoretical RTP and reel-strip audit evidence once engine constants are final. Do not mark verified until an exact revision CI run is green.

- [ ] **Step 4: Verify focused integration**

Run: `pnpm game:check && pnpm typecheck && pnpm test:unit`; expected zero exit.

- [ ] **Step 5: Run full repository validation**

Run: `pnpm validate`; expected zero exit including browser/design suites and both production builds. GitHub Actions must also deploy the exact revision successfully before tracker/spec move to verified.

- [ ] **Step 6: Commit synchronized verification evidence**

Update spec/tracker/todo/GAME_INDEX/.tasks atomically with exact revision/workflow evidence. Keep TASK-003 as an external blocker only if authenticated live Firebase remains unprovisioned.

## Unresolved externally observable decisions

None. The approved design spec fixes gameplay rules, persistence scope, accessibility contract, and non-monetized product boundaries. Engineering may tune source-controlled reel-strip symbol frequency/paytable values only to satisfy the documented probability audit without changing disclosed feature rules.