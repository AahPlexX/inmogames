# Lucky Seven Classic Implementation Plan

> **For agentic workers:** Use the host's available task-by-task implementation workflow. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a production-quality three-reel, one-payline mechanical-style virtual-credit slot with transparent classic rules, exact reel-strip probability, persistence, accessibility, tactile motion/audio, and regression coverage.

**Architecture:** The game is isolated under `src/games/lucky-seven-classic/` with pure reel/engine/paytable modules separated from React, storage, and audio. It integrates through the existing catalog/workspace registries and shared save repository while sharing no gameplay logic with Royal Fortune Slots or Cascade Vault.

**Tech Stack:** React 19.3.0, TypeScript 7.0.2, Vite 8.3.4, Vitest 5.0.3, Playwright 1.64.0, Firebase 13.0.0 shared save platform, CSS.

## Global Constraints

- Virtual credits only; no purchases, deposits, withdrawals, cash value, ads, telemetry, autoplay, adaptive odds, loss-chasing, or stake-escalation prompts.
- 3 reels, one evaluated center payline; visible neighbor symbols are decorative/mechanical context only.
- Wagers: 1, 2, 5, 10, 25 credits. Explicit source-controlled reel strips and paytable. Production randomness uses browser cryptographic randomness; tests inject deterministic stops.
- Symbols: Cherry, Lemon, Orange, Plum, Bell, BAR, Double BAR, Triple BAR, Red 7, Gold 7. Cherries can pay on one/two/three center-line appearances; mixed BAR may pay a fixed award; all other normal awards are exact combinations.
- Hold/Nudge are excluded from v1.
- Durable state contains only settled results/statistics/preferences; in-flight reel state is never persisted.
- Responsive at 320 CSS px, usable at 200% text, keyboard/touch accessible, important targets at least 48 CSS px, reduced-motion support, visible focus, no page-level horizontal overflow.
- Synchronize spec, PRD, tracker, todo, GAME_INDEX, and `.tasks`; TASK-003 remains external Firebase provisioning only.

---

### Task 1: Exact classic reel and payout engine

**Files:**
- Create: `src/games/lucky-seven-classic/reels.ts`
- Create: `src/games/lucky-seven-classic/paytable.ts`
- Create: `src/games/lucky-seven-classic/engine.ts`
- Test: `tests/unit/lucky-seven-classic-engine.test.ts`

**Interfaces:**
- Consumes: injected integer-stop random source.
- Produces: `spinClassicReels(random)`, `evaluateCenterLine(symbols, wager)`, source-controlled reel strips/paytable, exact combination probability helpers.

- [ ] **Step 1: Add the focused failing test**

Assert deterministic stops/windows; only center row scores; 1/2/3 Cherry cases; mixed BAR award; exact Bell/7/BAR families; nonpaying near combinations; wager scaling; invalid wagers rejected; exact probability sum equals 1 and expected return helper matches enumerated combinations.

- [ ] **Step 2: Verify the relevant failure**

Run: `pnpm vitest run tests/unit/lucky-seven-classic-engine.test.ts`
Expected: non-zero because the game modules do not yet exist.

- [ ] **Step 3: Implement the minimum behavior**

Use three explicit ordered strips. Choose exactly one stop per reel. Expose above/center/below window projection but score only center symbols. Classify Cherry and BAR-family rules before exact-match awards; return one deterministic award/result label. Probability helpers enumerate all reel stop combinations without Monte Carlo.

- [ ] **Step 4: Verify the focused pass**

Run the same focused command; expected zero exit.

- [ ] **Step 5: Run affected integration checks**

Run: `pnpm typecheck && pnpm test:unit`; expected zero exit.

- [ ] **Step 6: Commit the passing deliverable**

Commit engine/reels/paytable/tests together.

### Task 2: Durable save contract

**Files:**
- Create: `src/games/lucky-seven-classic/storage.ts`
- Create: `src/games/lucky-seven-classic/persistence.ts`
- Test: `tests/unit/lucky-seven-classic-persistence.test.ts`

**Interfaces:**
- Produces: `LuckySevenSave`, `luckySevenSaveDefinition`, settled-spin checkpoint/update helpers.

- [ ] **Step 1: Add focused failing tests**

Assert 500-credit initial bankroll, default wager, schema validation, malformed-state rejection, settled statistics, restore-to-500 preserving stats/preferences, and absence of transient reel positions.

- [ ] **Step 2: Verify failure**

Run the focused persistence test; expected module-missing failure.

- [ ] **Step 3: Implement minimum behavior**

Schema v1, slug `lucky-seven-classic`, storage key `inmogames:lucky-seven-classic:v1`; finite integer fields only, supported wager enumeration, boolean sound/motion preference, last settled result summary only.

- [ ] **Step 4: Verify focused pass**

Run focused test; expected zero exit.

- [ ] **Step 5: Integration check**

Run `pnpm test:unit && pnpm typecheck`; expected zero exit.

- [ ] **Step 6: Commit passing deliverable**

Commit save contract and tests.

### Task 3: Mechanical cabinet UI, accessibility, audio, and responsive behavior

**Files:**
- Create: `src/games/lucky-seven-classic/LuckySevenClassicWorkspace.tsx`
- Create: `src/games/lucky-seven-classic/lucky-seven-classic.css`
- Create: `src/games/lucky-seven-classic/audio.ts`
- Create: `src/games/lucky-seven-classic/lucky-seven-classic.meta.ts`
- Test: `tests/browser/lucky-seven-classic.mjs`

**Interfaces:**
- Consumes: classic engine/save definition and existing platform save/session seam.
- Produces: accessible cabinet UI, metadata, opt-in procedural mechanical cues.

- [ ] **Step 1: Add focused failing browser test**

Assert route rendering; paytable discoverability before first spin; one clearly marked center payline; Pull / Spin native button keyboard operation; deterministic known result; wager bounds; no sound before opt-in gesture; reduced-motion immediate reel stop; 320px/200%-text no horizontal overflow; 48px primary controls.

- [ ] **Step 2: Verify relevant failure**

Run browser test; expected missing route/workspace failure.

- [ ] **Step 3: Implement minimum behavior**

Use large three-reel CSS cabinet, normal-flow controls, native buttons, `details/summary`, aggregate `aria-live` result text, finite staggered reel stop motion, and locally synthesized opt-in sounds. The lever visual is decorative; the accessible control remains a standard button.

- [ ] **Step 4: Verify focused pass**

Run browser test; expected zero exit.

- [ ] **Step 5: Integration check**

Run `pnpm typecheck && pnpm test:unit && pnpm build`; expected zero exit.

- [ ] **Step 6: Commit passing deliverable**

Commit UI/audio/meta/browser test.

### Task 4: Catalog, documentation governance, exact RTP evidence, and release verification

**Files:**
- Modify: `src/catalog.ts`
- Modify: `src/games/workspaces.tsx`
- Modify: `package.json`
- Create: `src/games/lucky-seven-classic/PRD.md`
- Create: `src/games/lucky-seven-classic/TRACKER.md`
- Create: `src/games/lucky-seven-classic/todo.md`
- Modify: `docs/GAME_INDEX.md`
- Modify: `.tasks/IN_PROGRESS.md`
- Test: `tests/unit/catalog.test.ts`

**Interfaces:**
- Produces discoverable route/catalog title and synchronized handoff.

- [ ] **Step 1: Add/update integration assertions**

Assert unique slug/catalog registration and workspace route; add browser suite to `test:design-browser`.

- [ ] **Step 2: Verify governance failure before completion**

Run `pnpm game:check` while any required doc/index linkage is missing; expected targeted non-zero result.

- [ ] **Step 3: Complete integration/governance**

Register workspace/meta, add PRD/tracker/todo in implementing state, add GAME_INDEX/task ledger entry, synchronize authoritative spec Completion contract. Record exact theoretical RTP, hit frequency, and key combination probabilities from exhaustive enumeration.

- [ ] **Step 4: Verify integration**

Run `pnpm game:check && pnpm typecheck && pnpm test:unit`; expected zero exit.

- [ ] **Step 5: Full validation**

Run `pnpm validate`; expected zero exit. Confirm exact-revision GitHub Actions build and Pages deployment before marking verified.

- [ ] **Step 6: Synchronize verification evidence**

Atomically update tracker/spec/todo/GAME_INDEX/.tasks with exact revision/run evidence; leave TASK-003 externally blocked only where account persistence requires it.

## Unresolved externally observable decisions

None. The approved design defines the v1 rule set and explicitly excludes Hold/Nudge.