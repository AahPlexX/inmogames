# Mergrove design

**Status:** v1 game implementation verified; v2 progression expansion design approved and awaiting written-spec review before implementation  
**Last synchronized:** 2026-10-07  
**Route:** `#/games/mergrove`

## Product documents

The continuation-safe product contract is split deliberately: this authoritative design spec defines behavior and completion gates; `src/games/mergrove/PRD.md` defines the feature inventory and long-term roadmap, and `src/games/mergrove/todo.md` records execution/sign-off state. `src/games/mergrove/TRACKER.md` is the concise live handoff. These documents must be reconciled whenever implementation or verification state changes.

The shipped v1 contract remains verified below. The **Approved v2 progression expansion** section is the approved design for the next Mergrove release. It is planning scope only until the written-spec review and implementation-plan gates are complete. The first production implementation integration must atomically reopen the Completion contract, tracker and game-index state from verified to implementing.

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

Every merge stage also grants `max(1, group size - 2)` sunlight. Four sunlight may be spent on **Compost**, which removes one occupied cell without consuming a queued piece or changing score. Compost is the only v1 recovery tool; there are no paid boosters, ads, currencies or hidden random rescues.

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

## Approved v2 progression expansion

**Design state:** approved by product owner on 2026-10-07; written specification awaiting review.  
**Implementation state:** not started. No production source/test/save-schema behavior is changed by this documentation integration.  
**Relationship to PRD roadmap:** this section selects and concretizes the next release from the broader MER-008…MER-022 roadmap. Where an older roadmap draft conflicts with this section, this approved section controls the v2 launch scope. Unselected roadmap items remain future work.

### Product objective and engagement guardrails

The next release turns Mergrove from one endless run into a replayable progression game with clear short-, medium- and long-term goals. Engagement should come from mastery, visible progress, deterministic rewards, collection and varied authored challenges—not from coercive retention.

The release must not add energy/lives, paid currency, purchases, ads, loot boxes, random reward chests, push-notification pressure, forced waiting, loss-aversion streak penalties, hidden difficulty manipulation or analytics. Every campaign level must be provably clearable at one star without consuming an inventory booster. Retry is unlimited and immediate.

Official-current design evidence used for this direction is limited to primary sources: Dream Games' official Royal Match material documents levels, game elements, power-ups/boosters and unlockable areas as complementary progression layers; Apple documents achievements as a mechanism for motivating players and tracking progress; W3C WCAG 2.2 remains the accessibility baseline; Firebase's official transaction guidance remains the basis for atomic cloud migration/write behavior.

### Mode hierarchy

Mergrove opens on a mode hub rather than dropping directly into a new endless board.

1. **Continue** — one action resumes the most recently active Campaign or Endless session.
2. **Campaign** — primary experience; 40 authored levels grouped into five groves.
3. **Endless Grove** — preserves the shipped v1 rules and balance. Inventory boosters do not alter Endless Grove; sunlight-powered Compost remains its only recovery tool.
4. **Challenge Grove** — deterministic daily challenge unlocked after Campaign level 8. No inventory boosters. One scored attempt per local calendar date; subsequent same-day attempts are practice and do not replace the scored result.
5. **Achievements & Almanac** — permanent progress surfaces; never required to start or continue play.

A future Weekly Expedition from the PRD roadmap is not part of this v2 launch contract.

### Campaign structure: 40 levels / five groves

Campaign ships with exactly 40 repository-authored level definitions, eight per grove:

- **Levels 1–8 — Seedling Trail:** placement, trio merging, cascades, sunlight and Compost; level 8 completion unlocks Challenge Grove.
- **Levels 9–16 — Fern Hollow:** introduces Sunbeam and Gust, score/efficiency goals and authored starting boards.
- **Levels 17–24 — Lantern Marsh:** introduces Rewind Leaf and increasingly tight move budgets/mixed goals.
- **Levels 25–32 — Elder Canopy:** advanced cascade construction, high-tier goals and multi-condition objectives.
- **Levels 33–40 — Groveheart Vale:** Groveheart/Ancient Bloom mastery and a final sequence combining the campaign's learned skills.

The launch campaign intentionally stays on the verified 5 × 5 board and existing eight-tier spirit line. Alternate board geometries, new species, Briars, Stones and Wildseed remain later-roadmap scope so level/progression work does not silently become an engine rewrite.

Each `LevelDefinition` has a permanent append-only id and contains at minimum:

`{ id, groveId, ordinal, rulesetId, seed, startingBoard, objectives[], moveBudget, starThresholds, allowedPowerUps, firstClearReward }`

Definitions are static same-origin content and are strictly decoded/validated. A level id can never be renumbered or reused after release.

### Seven objective patterns

The launch objective vocabulary is bounded to seven deterministic patterns:

1. reach at least a target spirit tier;
2. reach a target score;
3. earn a target amount of Sunlight during the level;
4. create a cascade of at least a target depth;
5. complete at least a target number of merge stages;
6. trigger at least a target number of Ancient Blooms;
7. satisfy two compatible objectives from the preceding set in one level.

Objectives expose numeric progress in text and programmatically; color or animation is never the sole progress signal. Objective evaluation is pure and occurs after every placement and power-up action.

### Move budget and 1–3 star mastery

Campaign levels use a placement move budget. Normal placements consume one move. Compost, Sunbeam, Gust and Rewind Leaf do not consume a move; they consume their own resource/inventory semantics instead.

- **1 star:** complete every required objective before failure.
- **2 stars:** complete the level while meeting the authored two-star efficiency threshold.
- **3 stars:** complete the level while meeting the stricter authored three-star threshold.

Launch star thresholds are expressed as minimum remaining moves, not opaque score multipliers. A completed level can be replayed indefinitely to improve from one/two stars to three. Best stars never decrease. The campaign therefore exposes 120 total stars.

The campaign unlock path is clear-gated rather than energy-gated: clearing level N unlocks level N+1. Star milestones grant fixed rewards but never block the next ordinary level.

### Power-up system

Campaign exposes four tactical powers with explicit, deterministic behavior. None is purchasable.

**Compost — sunlight power (existing).** Spend four earned Sunlight to remove one occupied cell. It is not an inventory item and retains the shipped rules.

**Sunbeam — earned inventory booster.** Target one occupied tier-1 through tier-7 spirit. It upgrades exactly one tier at that cell, then invokes the same anchor cascade-resolution logic used after a normal placement. It draws no queue piece and consumes no move. Groveheart is not a legal target. A successful use consumes exactly one Sunbeam.

**Gust — earned inventory booster.** Replace all three queue slots using three deterministic queue draws in slot order. Board, score, sunlight and move count are unchanged. A successful use consumes exactly one Gust. Because the RNG state advances predictably, reload/replay cannot reroll for a different result.

**Rewind Leaf — earned inventory booster.** Restore the complete run/level state immediately before the most recent ordinary placement, including board, queue, RNG state, score, sunlight, move count, objective progress and run counters. It cannot rewind another power-up, cannot cross level start/completion, and cannot be chained without making another placement. A successful rewind consumes exactly one Rewind Leaf after restoration; the booster itself is therefore never duplicated by its snapshot.

Campaign level definitions may disable a booster when its mechanic would invalidate the teaching goal. Challenge Grove disables all three inventory boosters. Endless Grove remains v1-pure and does not consume inventory boosters.

Power-up buttons are ordinary native controls with text names, visible inventory counts, `aria-pressed` only when an action is armed, Escape/cancel support where applicable, and the same 44 CSS-pixel target baseline as the board.

### Booster unlocks and deterministic rewards

Boosters are introduced through the campaign, not exposed all at once. The implementation plan must preserve this onboarding order: Compost first, Sunbeam before Gust, and Rewind Leaf last.

Rewards are fixed and disclosed in content data. First clears, selected three-star mastery milestones, achievement milestones and grove completions may award booster inventory, but there is no random reward roll. A permanent reward id is recorded when a reward is claimed so reload, rewind, retry, account migration and replay can never grant the same reward twice.

Exact launch quantities and move/star thresholds are not guessed in this design document. They must be chosen from the balance-simulation harness and committed as versioned level/reward content before v2 can be marked verified. Changing a released reward id's meaning is prohibited.

### Cascade feedback and completion flow

The existing cascade score multiplier remains the underlying scoring model. Campaign presentation makes chain depth more legible with a text-backed Cascade Meter (for example `Cascade ×2`, `Cascade ×3`, `Cascade ×4+`) and corresponding nonessential visual emphasis. Reduced-motion users receive the same numeric/text information without motion.

Level completion shows objective results, stars earned, prior-best comparison, deterministic rewards and a prominent **Next level** control. Failure shows the unmet objective(s) and immediate **Try again**. There is no lives system or wait state.

### Achievements: 20 permanent launch ids

The launch set contains exactly 20 append-only achievement ids. Achievement progress is local/account durable and can never be earned repeatedly for duplicate rewards.

1. `first_merge` — complete the first merge.
2. `first_cascade` — complete a cascade of depth 2+.
3. `cascade_three` — reach cascade depth 3.
4. `cascade_four` — reach cascade depth 4.
5. `first_bloom` — grow a Bloom.
6. `first_lantern_tree` — grow a Lantern Tree.
7. `first_groveheart` — grow a Groveheart.
8. `first_ancient_bloom` — trigger an Ancient Bloom.
9. `sunlight_25` — hold at least 25 Sunlight in one session.
10. `compost_ten` — use Compost ten times across completed play.
11. `campaign_begin` — clear Campaign level 1.
12. `campaign_ten` — clear ten distinct Campaign levels.
13. `campaign_complete` — clear all 40 Campaign levels.
14. `first_three_star` — earn three stars on any level.
15. `ten_three_star` — earn three stars on ten levels.
16. `perfect_campaign` — earn all 120 Campaign stars.
17. `pure_clear` — clear a Campaign level without an inventory booster.
18. `challenge_first` — complete a scored Challenge Grove run.
19. `challenge_streak_seven` — complete seven consecutive scored daily challenges, honoring the grace rule below.
20. `almanac_complete` — discover all eight launch spirit entries.

Achievement UI has locked/in-progress/earned states, exposes progress as text, uses repository-authored vector badge art, and announces new unlocks through a non-modal status surface. Achievement rewards, if any, use permanent one-time reward ids.

### Spirit Almanac

The launch Almanac contains the existing eight spirit tiers. Growing a tier for the first time permanently discovers its entry. Migrated v1 saves discover every tier from Seed through the provable historical `bestTier`; no unproven higher tier is invented.

Each entry shows the existing high-quality SVG artwork, name, short original botanical note and growth position. Undiscovered entries use a distinct silhouette plus `Undiscovered` text. The Almanac architecture may later accept new species from the broader content-pack roadmap, but v2 launch does not add new species.

### Challenge Grove

Challenge Grove unlocks after Campaign level 8. `dailySeed(localDate, rulesetId)` derives a stable non-zero 32-bit seed from the player's local `YYYY-MM-DD` date and frozen ruleset id. The same inputs always produce the same challenge.

The first completed attempt for the date is the scored result. Replays are explicitly marked practice. Inventory boosters are disabled. The result records score, highest tier, Ancient Blooms and completion date. Spoiler-free share text may be copied through a native button; copying is optional and no network/social SDK is required.

Streaks are descriptive, not punitive. A player earns one grace day after each seven completed scored challenges; one missed date may consume one available grace day without breaking the streak. Missing play never removes stars, inventory, achievements or campaign access.

### Sound and sensory feedback

V2 may add a repository-authored procedural WebAudio layer for merge, cascade, booster and level-result cues. It must follow the existing Royal Palace safety pattern: sound is opt-in, no `AudioContext` or sound cue starts before a user gesture, the preference persists, mute is always visible, and disabling sound suppresses later cues. No remote audio files are required.

All essential state is simultaneously conveyed in text/visual UI. Sound is never required for timing or gameplay. Reduced-motion continues to suppress decorative motion independently of the sound preference.

### V2 persistence and migration

V2 requires a real schema migration; new progression fields must not be hidden inside the v1 envelope because an older client could decode/drop unknown fields and overwrite them.

The v2 durable state must include, at minimum:

- preserved `bestScore`, `bestTier` and v1 Endless active run;
- last/active mode;
- Campaign level progress (best stars, best score, best moves/remaining moves as applicable);
- active Campaign session and deterministic level state;
- inventory counts for Sunbeam, Gust and Rewind Leaf;
- claimed permanent reward ids;
- lifetime stats needed by the 20 achievements;
- earned achievement ids/progress;
- Almanac discoveries;
- compact Challenge Grove history (last scored date, current/max streak, grace state and last/best result).

`migrateV1toV2` must preserve best score, best tier and an active v1 run exactly as Endless Grove state. Tier discoveries are derived only up to `bestTier`. Other progression starts from neutral values unless it can be proven from v1 state; migration must not fabricate historical clears, boosters or achievements.

The shared save platform needs an explicit version-migration/legacy-read path and a downgrade guard before account v2 writes are enabled. Cloud migration/write operations that depend on current stored state must use Firestore transaction semantics so concurrent edits cannot partially apply or silently downgrade newer data. V1 storage/cloud data must remain recoverable until the first validated v2 write succeeds.

TASK-003 live-project verification remains separate. Emulator/repository migration evidence can complete game-local implementation; real configured-project verification is never inferred from emulator results.

### Architecture boundaries

The v1 engine remains the stable merge-rules core. The implementation plan should prefer focused pure modules instead of growing `MergroveWorkspace.tsx` into an orchestration monolith:

- `engine.ts` — existing placement/merge rules; changes only where a new power calls a shared transition primitive.
- `campaign.ts` — level definitions, objective progress, move/star evaluation and unlocks.
- `powerups.ts` — Sunbeam, Gust and Rewind Leaf state transitions.
- `achievements.ts` — lifetime-stat accumulation, achievement progress and append-only unlocks.
- `challenge.ts` — date seed, scored/practice distinction, streak/grace and share formatting.
- `persistence.ts` — v2 decoder/migration contract, delegating shared-platform migration concerns rather than calling Firebase directly.
- React presentation — mode hub, campaign map, results, Almanac/Achievements and board orchestration; never reimplement pure rules.

No new game runtime dependency is required by this design. Existing React/TypeScript/CSS/SVG/Playwright/Vitest/Firebase surfaces are sufficient unless the implementation plan proves otherwise with current official documentation.

### Accessibility and responsive requirements

All shipped v1 guarantees remain mandatory. New level nodes, reward controls and power-ups use native controls; no required drag gesture is introduced. The campaign map uses a vertical responsive path instead of a fixed-width horizontal world map. Locked levels explain the requirement in text. Power-up state is not color-only. Achievement/progress state is text-backed. Dialogs, if used, follow the repository's existing focus-entry/confinement/Escape/focus-restoration expectations.

At 320 CSS px and 200% text, the board and primary actions must not horizontally overflow. The board remains the visual priority during play. `prefers-reduced-motion: reduce` removes nonessential cascade/reward/map motion without hiding state changes.

### Evidence-driven balance requirement

Before level content is accepted, a headless deterministic simulation harness must exercise the pure rules across authored seeds/starting boards. At minimum it must verify:

- every one of the 40 levels is solvable for one star with **zero inventory boosters**;
- no level definition begins in an invalid or already-terminal state unless intentionally completed by definition;
- move budgets and 2/3-star thresholds are achievable and ordered correctly;
- reward progression cannot produce negative inventory or duplicate permanent reward claims;
- Challenge Grove seeds replay identically for the same date/ruleset;
- power-up actions preserve deterministic reload/replay behavior.

Quantitative difficulty targets and reward quantities may be tuned from simulation before launch, but the simulation result and final constants must be committed and covered by CI. Post-release balance changes require a new ruleset/content version rather than silently changing old deterministic levels.

### V2 verification matrix

Implementation is not complete until all of the following have exact-revision evidence:

- pure unit/property tests for level objectives, move/star evaluation, each booster, reward idempotency, achievements, Almanac, challenge seed/streak and migration;
- golden deterministic tests ensuring v1 Endless behavior does not change unintentionally;
- v1→v2 guest migration with no data loss;
- Auth/Firestore emulator migration, cross-browser Campaign restore, inventory/achievement persistence and game-scoped reset;
- browser Campaign flow covering level select → play → success/failure → stars/reward → next level → replay mastery;
- browser booster flow for Sunbeam/Gust/Rewind and disabled/invalid targets;
- Challenge scored-vs-practice behavior;
- keyboard/touch parity, focus, 44px targets, 320px/200% reflow and reduced motion across hub/map/game/results surfaces;
- no uncaught Mergrove page errors;
- complete repository validation, Pages deployment and fresh production smoke.

### V2 launch exclusions

The approved launch does **not** include alternate board sizes/shapes, new spirit species, Briar/Stone/Wildseed hazards, Storehouse, weekly events, leaderboards, multiplayer, purchases, ads, energy/lives, push notifications, analytics or remote assets. Those remain separate future roadmap items and require their own approved scope.

## Verification evidence

Exact revision `965c91a5b9090da321ae3eb0d11f9383678b02c6` passed the complete Validate and deploy Pages workflow in run `37553471015` on 2026-10-06 local time. The run passed frozen install, exact/current dependency gates, DESIGN.md lint, TypeScript, the structural/history-aware game documentation gate, unit tests, Firestore rules tests, Auth/Firestore emulator browser tests including `mergrove-account-persistence.mjs`, rendered design/browser tests including `mergrove-design.mjs`, both production builds, Pages artifact upload and deployment.

Mergrove-specific browser evidence verifies the 25-cell board, three-piece queue, deterministic first trio merge, guest active-run reload, native keyboard play, 44px targets, 320 CSS-px reflow, 200% text reflow and reduced-motion suppression. The account emulator evidence verifies authenticated checkpointing, restoration in a separate browser context and game-scoped reset propagation.

A fresh uncached post-deployment render of `https://aahplexx.github.io/inmogames/#/games/mergrove` returned HTTP 200 and rendered the expected Mergrove initial state: three Seeds, 0/25 occupied cells and the 25-cell placement board. The external production Playwright connector was unavailable because its upstream MCP endpoint returned 404, so no claim is made that a second independent production console inspector was available; the green CI browser suites separately assert no uncaught Mergrove page errors.

## Verification requirements

- Pure-engine tests cover deterministic creation, orthogonal grouping, basic merge, cascade scoring, ancient bloom, terminal/recoverable full boards, compost and invalid actions.
- Persistence tests cover the v1 contract plus malformed board, queue, best-tier and game-over consistency.
- Rendered browser evidence covers the 25-cell board, initial queue, first deterministic trio merge, reload checkpoint, keyboard operation, 320px/200% reflow, 44px targets, non-color queue selection and reduced motion.
- Shared Auth/Firestore emulator evidence exercises an authenticated Mergrove checkpoint across browser contexts and game-scoped reset.
- Catalog/index/registry and per-game documents remain synchronized in the same integration.
- Full repository validation and GitHub Pages deployment pass before the game is marked verified.

## Completion contract

**Completion state:** verified  
**Completion evidence:** exact revision `965c91a5b9090da321ae3eb0d11f9383678b02c6`; GitHub Actions run `37553471015` passed complete validation and Pages deployment, followed by a fresh HTTP-200 deployed-route render of `#/games/mergrove`.

- [x] Complete placement → merge → cascade → ancient-bloom → game-over/restart loop is integrated and playable.
- [x] Deterministic engine and v1 save decoder are covered by repository unit tests for material edge cases.
- [x] Original eight-tier SVG sprite artwork is integrated with no external runtime asset/licence dependency.
- [x] Pointer/touch/keyboard interaction, 320 CSS-px and 200% text reflow, focus/selection, touch targets and reduced motion have rendered-browser evidence.
- [x] Guest reload checkpoint and shared account-save/reset path have repository/emulator evidence; live Firebase remains separately identified under TASK-003.
- [x] Catalog, lazy registry, game index, task state, this spec and `src/games/mergrove/TRACKER.md` agree on shipped state.
- [x] `pnpm validate`-equivalent CI gates are green on the exact integrated revision.
- [x] GitHub Pages deployment is green; the deployed route independently renders the expected game state, while CI browser suites provide the zero-page-error regression evidence.

This section remains authoritative for the shipped v1 word **complete** until production implementation of the approved v2 scope begins. The first v2 source/test integration must change Completion state to `implementing`, reopen the applicable gates and synchronize tracker/PRD/todo/index/task state in the same integration. V2 may return to `verified` only after the complete V2 verification matrix above is satisfied.

## Explicit exclusions for v1

No drag-only controls, timer, leaderboard, multiplayer, ads, purchases, analytics, remote sprite service, external font, audio, undo stack, daily challenge or ninth merge tier. These are historical v1 exclusions; the approved v2 design above intentionally adds an opt-in procedural audio layer, Rewind Leaf and Challenge Grove while continuing to exclude the other listed items unless separately scoped.
