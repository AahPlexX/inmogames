# Mergrove design

**Status:** Implementing; game-local verification pending integration CI/browser evidence  
**Last synchronized:** 2026-10-06  
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
- No essential action uses a timer or reaction window.
- Merge-pop motion is decorative and disabled under `prefers-reduced-motion: reduce`.
- Layout must not horizontally overflow at 320 CSS px or at 200% text sizing.

## Determinism and engine boundary

`engine.ts` is pure TypeScript with no React, DOM, Firebase, storage, audio or sprite dependency. A run stores its normalized seed and current RNG state. Tests may provide fixed seeds and receive byte-for-byte-equivalent run creation and deterministic replacement draws.

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

## Verification requirements

- Pure-engine tests cover deterministic creation, orthogonal grouping, basic merge, cascade scoring, ancient bloom, terminal/recoverable full boards, compost and invalid actions.
- Persistence tests cover the v1 contract plus malformed board, queue, best-tier and game-over consistency.
- Rendered browser evidence covers the 25-cell board, initial queue, first deterministic trio merge, reload checkpoint, keyboard operation, 320px/200% reflow, 44px targets, non-color queue selection and reduced motion.
- Shared Auth/Firestore emulator evidence exercises an authenticated Mergrove checkpoint across browser contexts and game-scoped reset.
- Catalog/index/registry and per-game documents remain synchronized in the same integration.
- Full repository validation and GitHub Pages deployment must pass before the game can be marked verified.

## Completion contract

**Completion state:** implementing  
**Completion evidence:** local RED→GREEN engine and persistence probes completed on 2026-10-06; integrated CI/browser/deployment evidence pending.

- [ ] Complete placement → merge → cascade → ancient-bloom → game-over/restart loop is integrated and playable.
- [ ] Deterministic engine and v1 save decoder are covered by repository unit tests for material edge cases.
- [ ] Original eight-tier SVG sprite artwork is integrated with no external runtime asset/licence dependency.
- [ ] Pointer/touch/keyboard interaction, 320 CSS-px and 200% text reflow, focus/selection, touch targets and reduced motion have rendered-browser evidence.
- [ ] Guest reload checkpoint and shared account-save/reset path have repository/emulator evidence; live Firebase remains separately identified under TASK-003.
- [ ] Catalog, lazy registry, game index, task state, this spec and `src/games/mergrove/TRACKER.md` agree on shipped state.
- [ ] `pnpm validate`-equivalent CI gates are green on the exact integrated revision.
- [ ] GitHub Pages deployment is green and the deployed route is smoke-tested without game-local console/page errors.

This section is authoritative for the word **complete**. New game-local scope or a discovered unresolved defect reopens the applicable gate before further implementation.

## Explicit exclusions for v1

No drag-only controls, timer, leaderboard, multiplayer, ads, purchases, analytics, remote sprite service, external font, audio, undo stack, daily challenge or ninth merge tier. A richer animation/audio layer may be proposed later only as new scope with fresh completion evidence.
