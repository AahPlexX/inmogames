# Mergrove design

**Status:** v1.0 verified; v1.1 (balance harness, next-draw preview, Escape-to-cancel compost) is reopened work awaiting CI-verified evidence; live Firebase account services remain external TASK-003 work  
**Last synchronized:** 2026-10-07  
**Route:** `#/games/mergrove`

## Product documents

The continuation-safe product contract is split deliberately: this authoritative design spec defines behavior and completion gates; `src/games/mergrove/PRD.md` defines the feature inventory and `src/games/mergrove/todo.md` records execution/sign-off state. `src/games/mergrove/TRACKER.md` is the concise live handoff. These documents must be reconciled whenever implementation or verification state changes.

## Purpose

Mergrove is an original single-player placement-and-cascade merge puzzle for the InMo Game Cabinet. It expands the catalog beyond arithmetic and cards without adding a runtime engine, server, external asset request or proprietary art dependency. The player grows increasingly elaborate woodland spirits on a compact 5 × 5 board, balancing immediate fusions against future space.

The game must feel tactile and visually rich while remaining fully usable with pointer, touch and keyboard. Its artwork is repository-authored SVG sprite art rendered from a shared in-document symbol bank, so the same asset stays crisp at phone and desktop pixel densities without downloading a third-party sprite sheet.

## Core loop

A run owns a 25-cell board and a three-piece queue. Each queued piece is a tier-one Seed until the run has discovered tier three; after that, deterministic generation may also supply tier-two Sprouts with a 22% draw probability.

1. The player chooses any queue slot.
2. The player places that spirit into any empty board cell.
3. If the placed cell is part of an orthogonally connected group of at least three matching tiers, the entire group clears and one next-tier spirit remains in the placed cell.
4. The newly-created spirit is immediately checked again. If it creates another matching group, the run resolves another merge stage at the same anchor. This repeats until no new group exists.
5. The used queue slot is replenished from the deterministic run RNG.
6. The run ends only when all 25 cells are occupied and the player has fewer than four sunlight, meaning there is no legal placement and no recovery action.

Diagonal contact never joins a merge group. The placement cell is always the surviving anchor so results are spatially predictable.

Tier eight is **Groveheart**. A group of three or more Grovehearts becomes an **ancient bloom**: the group clears completely, including the placement cell, instead of creating an undefined ninth tier. This high-tier event reopens board space and increments the run's ancient-bloom count.

## Tiers and sprite identity

The eight sprite tiers are: Seed, Sprout, Bud, Bloom, Sapling, Lantern Tree, Elder Tree and Groveheart.

`sprites.tsx` owns an original SVG symbol bank and the reusable sprite renderer. Symbols use repository-authored vector paths, gradients and filters only. They are decorative inside controls; the control's accessible name carries the tier and action semantics. No remote art, font, CDN, image API or runtime generation request is allowed.

## Scoring and cascades

Each merge stage scores:

`group size × 10 × 2^(source tier - 1) × chain depth`

Chain depth starts at 1 for the first merge caused by a placement and increases for every immediate cascade at the same anchor. This makes larger groups, higher tiers and deliberate cascade construction independently valuable while keeping the formula inspectable.

Every merge stage also grants `max(1, group size - 2)` sunlight. Four sunlight may be spent on **Compost**, which removes one occupied cell without consuming a queued piece or changing score. Compost is the only recovery tool; there are no paid boosters, ads, currencies or hidden random rescues.

## Controls and interaction

Mergrove intentionally does not require drag-and-drop. WCAG 2.2 requires a simple pointer alternative for functionality that uses dragging; using one shared button-based interaction path avoids creating a second-class fallback.

- Pointer/touch: choose one queue button, then choose an empty board-cell button. When Compost is armed, choose one occupied board-cell button instead.
- Keyboard: Tab and Shift+Tab traverse native controls; Enter/Space activate the focused control.
- Queue selection uses `aria-pressed` and a non-color border/background state.
- Board cells have explicit row/column and state/action names.
- Merge/result text is announced through a polite status region.
- Important controls use the repository's 44 CSS-pixel target baseline, exceeding WCAG 2.2 AA's 24 × 24 minimum.
- Focus indicators remain visible through the shared product focus treatment.
- No essential action uses a timer or reaction window.
- Merge-pop motion is decorative and disabled under `prefers-reduced-motion: reduce`.
- Layout must not horizontally overflow at 320 CSS px or at 200% text sizing.

## Determinism and engine boundary

`engine.ts` is pure TypeScript with no React, DOM, Firebase, storage, audio or sprite dependency; its only import is the equally pure `layout.ts`. A run stores its normalized seed and current RNG state. Tests may provide fixed seeds and receive byte-for-byte-equivalent run creation and deterministic replacement draws.

The engine owns board dimensions, valid placement, orthogonal flood-fill grouping, merge/cascade resolution, scoring, sunlight, ancient blooms, compost and game-over determination. React renders engine state but does not reimplement merge rules.

## Persistence

Storage key: `inmogames:mergrove:v1`. Cloud game slug/document identity: `mergrove`. Schema version: 1.

Durable state is `{ bestScore, bestTier, activeRun }`. `activeRun` includes the deterministic board, queue, RNG state, score, sunlight, highest tier, ancient-bloom count, turn count and game-over flag. A long merge session therefore survives reload and may follow an authenticated player across browsers/devices through the shared account-save layer.

- Guests use the shared local repository.
- Authenticated players use the shared Firestore repository at `users/{uid}/games/mergrove`; game code never calls Firebase directly.
- A valid guest save may seed a first account save only through the shared transaction/migration behavior.
- Cloud state wins when an account save already exists.
- Reset affects only Mergrove's save and returns durable progress to best score 0, best tier Seed and no saved active run.
- Invalid or structurally inconsistent saved runs are rejected by the v1 decoder rather than partially trusted.
- Save/network failure never blocks local gameplay; the shared status/retry surface owns recovery.

Repository/emulator evidence is distinct from the live Firebase project. TASK-003 remains the external blocker for real-project account-save verification until Authentication, Firestore, rules and the deployed live matrix are complete.

## Visual direction

Mergrove uses a dark, earthy game-local shell with moss, bark, brass-sunlight and luminous-green accents. The 5 × 5 board is the dominant artifact; queue, score and recovery controls remain secondary. Vector spirits become progressively larger and more ornate while sharing one visual family.

Global navigation, account UI, save status, focus behavior and product shell remain unchanged. The catalog face gets a game-scoped grove illustration treatment without redefining shared design tokens.

## Failure handling

Invalid queue/cell indexes, occupied placements, insufficient-sunlight compost attempts and malformed saves fail explicitly at the engine/decoder boundary. The UI prevents those actions through native disabled controls and never depends on exceptions for normal interaction.

A full board with at least four sunlight is not game over because Compost is still a legal recovery. A full board below the compost cost is terminal. A tier-eight merge clears instead of overflowing the tier model.

## Verification evidence

Exact revision `965c91a5b9090da321ae3eb0d11f9383678b02c6` passed the complete Validate and deploy Pages workflow in run `37553471015` on 2026-10-06 local time. The run passed frozen install, exact/current dependency gates, DESIGN.md lint, TypeScript, the structural/history-aware game documentation gate, unit tests, Firestore rules tests, Auth/Firestore emulator browser tests including `mergrove-account-persistence.mjs`, rendered design/browser tests including `mergrove-design.mjs`, both production builds, Pages artifact upload and deployment.

Mergrove-specific browser evidence verifies the 25-cell board, three-piece queue, deterministic first trio merge, guest active-run reload, native keyboard play, 44px targets, 320 CSS-px reflow, 200% text reflow and reduced-motion suppression. The account emulator evidence verifies authenticated checkpointing, restoration in a separate browser context and game-scoped reset propagation.

A fresh uncached post-deployment render of `https://aahplexx.github.io/inmogames/#/games/mergrove` returned HTTP 200 and rendered the expected Mergrove initial state: three Seeds, 0/25 occupied cells and the 25-cell placement board. The external production Playwright connector was unavailable because its upstream MCP endpoint returned 404, so no claim is made that a second independent production console inspector was available; the green CI browser suites separately assert no uncaught Mergrove page errors.

## v1.1 scope (reopened 2026-10-07)

New game-local work reopens the game under the continuity contract. The save schema is **unchanged** (schema version 1, key `inmogames:mergrove:v1`, no new persisted fields), so no migration is needed and existing guest and account saves load exactly as before. Roadmap items that need new persisted state (hold slot, undo snapshot, modes, stats, codex) are deliberately not in this scope; they depend on the schema v2 migration (roadmap MER-020, blocked on a shared-platform change).

- **Balance harness (PRD MER-023).** A dev-only bot and simulator live under `tests/unit/support/` and are never imported by the shipped bundle. A unit-test drift gate fails when the released configuration leaves its measured target ranges. The recorded baseline shows two-ply play reaching Bloom about 97% and Sapling about 37% of the time, and never Lantern Tree or an ancient bloom, which is evidence for the roadmap decision on board size. No released rule is changed by this finding.
- **Next-draw preview (PRD MER-024).** `previewNextDraw(run)` in `engine.ts` peeks the next replacement tier without advancing the RNG. The UI states it in text ("Next to arrive: Seed"). Before Bud it also says when a Sprout would arrive if the placement itself reaches Bud, because the replacement is drawn after merge resolution.
- **Ruleset registry and replay (PRD MER-025).** `src/games/mergrove/ruleset.ts` freezes the released ruleset `v1`, replays a seed plus action list without throwing, and fingerprints runs. Golden-replay tests fail if released scoring, RNG or draw behavior changes; such a change must ship as a new ruleset id. It is library-only for now: runs do not yet record a `rulesetId`, because that needs the schema v2 migration.
- **Board layouts (PRD MER-026).** `src/games/mergrove/layout.ts` makes geometry data: validated, frozen layouts `classic-5`, `standard-6` and a cut-corner `crossroads-6`, and the engine takes an optional layout defaulting to `classic-5`. Existing behavior is unchanged and proven so by the unmodified v1 and golden-replay tests. The player-visible board is still 5 × 5 and saves record no layout; both wait on the schema v2 migration. Simulation shows larger boards lengthen runs but do not alone make the late tiers reachable, so no default-board change is made.
- **Escape cancels Compost (PRD MER-024).** Escape disarms an armed Compost with the same announcement as the Cancel button and spends nothing. It is never the only path and is documented in "How merging works".

The explicit v1 exclusions are unchanged: no timer, undo, daily challenge, audio, leaderboard, or ninth tier. The preview reveals information the deterministic engine already fixes; it does not create a reroll or any new randomness.

## Verification requirements

- Pure-engine tests cover deterministic creation, orthogonal grouping, basic merge, cascade scoring, ancient bloom, terminal/recoverable full boards, compost and invalid actions.
- Persistence tests cover the v1 contract plus malformed board, queue, best-tier and game-over consistency.
- Rendered browser evidence covers the 25-cell board, initial queue, first deterministic trio merge, reload checkpoint, keyboard operation, 320px/200% reflow, 44px targets, non-color queue selection and reduced motion.
- Shared Auth/Firestore emulator evidence exercises an authenticated Mergrove checkpoint across browser contexts and game-scoped reset.
- Catalog/index/registry and per-game documents remain synchronized in the same integration.
- Unit tests cover the engine edge cases, decoder edge cases and balance drift gate listed in PRD `verification_traceability`; the rendered browser suite also covers the next-draw line and Escape-to-cancel compost.
- Full repository validation and GitHub Pages deployment pass before the game is marked verified.

## Completion contract

**Completion state:** implementing  
**Completion evidence:** v1.0 was verified at revision `965c91a5b9090da321ae3eb0d11f9383678b02c6` in GitHub Actions run `37553471015` (fresh HTTP-200 deployed render). v1.1 is reopened on 2026-10-07: unit tests (all passing locally under Node 24.21.0 / Vitest 5.0.3) and the rendered Mergrove design-browser suite (passing locally against system Chrome) are green, but no CI run or deployment exists for v1.1 yet, so the game is not re-verified.

- [x] Complete placement → merge → cascade → ancient-bloom → game-over/restart loop is integrated and playable.
- [x] Deterministic engine and v1 save decoder are covered by repository unit tests for material edge cases.
- [x] Original eight-tier SVG sprite artwork is integrated with no external runtime asset/licence dependency.
- [x] Pointer/touch/keyboard interaction, 320 CSS-px and 200% text reflow, focus/selection, touch targets and reduced motion have rendered-browser evidence.
- [x] Guest reload checkpoint and shared account-save/reset path have repository/emulator evidence; live Firebase remains separately identified under TASK-003.
- [x] Catalog, lazy registry, game index, task state, this spec and `src/games/mergrove/TRACKER.md` agree on shipped state.
- [x] `pnpm validate`-equivalent CI gates were green on the v1.0 revision.
- [x] GitHub Pages deployment was green for v1.0; the deployed route independently rendered the expected game state.
- [x] v1.1: balance harness, edge-case unit tests and drift gate exist and pass locally (PRD MER-023).
- [x] v1.1: ruleset registry, replay and mutation-checked golden fingerprints exist and pass locally (PRD MER-025).
- [x] v1.1: layout module and layout-aware engine exist, classic-5 is proven byte-identical, and the layout comparison is recorded (PRD MER-026).
- [x] v1.1: next-draw preview and Escape-to-cancel compost are implemented with unit and rendered-browser assertions that were mutation-checked to fail when the behavior is removed (PRD MER-024).
- [ ] v1.1: the full `pnpm validate`-equivalent CI chain, including Auth/Firestore emulator browser tests and the Firebase rules tests that could not run in the authoring sandbox, is green on the exact integrated revision.
- [ ] v1.1: GitHub Pages deployment is green and a fresh deployed render of `#/games/mergrove` shows the "Next to arrive" line.

This section is authoritative for the word **complete**. New game-local scope or a discovered unresolved defect reopens the applicable gate before further implementation.

## Explicit exclusions for v1

No drag-only controls, timer, leaderboard, multiplayer, ads, purchases, analytics, remote sprite service, external font, audio, undo stack, daily challenge or ninth merge tier. A richer animation/audio layer may be proposed later only as new scope with fresh completion evidence.
