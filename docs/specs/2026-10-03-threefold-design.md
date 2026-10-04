# Threefold design

**Status:** Approved for implementation  
**Last synchronized:** 2026-10-04  
**Route:** `#/games/threefold`

## Purpose

Threefold is the first production game in InMo Games and a reference implementation for the repository's game contract. It remains static-client, local-first, deterministic, accessible and responsive on GitHub Pages while participating in the shared optional Firebase account/save platform.

## Core loop

A run contains five rounds. Each round presents nine distinct integer tiles and one target. The player selects exactly three tiles whose sum equals the target.

- Every generated round must have at least one valid three-tile solution.
- Any valid solution is accepted; the player is never required to find a specific hidden combination.
- A selection may contain at most three tiles.
- Selecting an already-selected tile deselects it.
- When three tiles are selected, the player explicitly checks the selection. This prevents accidental submission while navigating by touch, keyboard, switch or other pointer input.
- A correct check completes the round and exposes the next-round action.
- An incorrect check leaves the round playable, clears the current selection and applies the scoring penalty.
- Round generation is deterministic from a run seed. A new run receives a new browser-generated seed; tests may supply a fixed seed.

## Scoring

Each round starts at 100 available points. Each incorrect checked trio reduces that round's available score by 20, to a minimum of 20. A correct trio banks the remaining round score. A five-round run therefore ranges from 100 to 500 points.

The result view reports total score, best score and per-round earned points. Best completed score is durable progress and is eligible for account sync when the player is authenticated.

## Controls and interaction

The primary board is nine native buttons in a responsive 3 × 3 grid. Native controls are used rather than custom ARIA widgets.

- Pointer/touch: activate a tile to toggle it; use **Check three** to submit.
- Keyboard: Tab/Shift+Tab move through ordinary controls; Enter/Space activate the focused control.
- Controls must remain comfortably larger than WCAG 2.2 AA's 24 × 24 CSS-pixel minimum target. The intended minimum game control block size is 48 CSS px.
- Focus indicators remain clearly visible and are never removed.
- Selection cannot be communicated by color alone: selected tiles use text/state styling and `aria-pressed`.
- Round, score and result changes use restrained live-region announcements; ordinary tile focus is not announced redundantly.
- The layout must have no horizontal page overflow at 320 CSS px and must scale without typography collisions through large desktop widths.
- Essential gameplay has no countdown or reaction-time requirement.
- Motion is nonessential and suppressed under `prefers-reduced-motion: reduce`.

## Persistence and privacy

Storage key: `inmogames:threefold:v1`.

Storage key: `inmogames:threefold:v1`.

Only the best completed score is durable. Guests use localStorage. Once the shared Firebase save platform is implemented, authenticated players sync that best score to `users/{uid}/games/threefold` through the shared save repository. Active runs remain intentionally ephemeral: reload starts a fresh run.

Storage/network failure must never prevent play. Threefold must not make game-specific third-party requests; Firebase account/save traffic is owned by the shared platform layer.

## Engine boundary

`engine.ts` owns deterministic game rules and contains no DOM, React or storage access. Its public behavior covers seeded round generation, solution validation, score calculation and run progression. UI state is a consumer of the engine rather than an alternate rules implementation.

Round generation derives the target from a selected solution trio and shuffles all nine tiles deterministically. Tests must prove generated rounds are solvable and deterministic for fixed seeds.

## Failure handling

Impossible UI states are prevented by engine contracts. If local persistence fails, the game continues and labels the best score as unavailable for persistence. If a route is loaded before the workspace chunk is ready, the shared Suspense status remains available.

## Quality gates

Before Threefold can be marked verified:

1. Engine tests cover deterministic generation, guaranteed solvability, alternate valid solutions, scoring floor and five-round completion.
2. Storage tests cover valid, missing, malformed and write-failure behavior through an explicit storage seam.
3. The catalog and lazy workspace registry expose the game.
4. Keyboard and pointer behavior use the same native control path.
5. 320 CSS-px layout, large viewport layout, visible focus, target sizing, reduced motion and live status behavior are reviewed.
6. `pnpm validate` passes.
7. The tracker contains no `planned` or `started` capability.
8. The game index, tracker, spec and task records match shipped behavior.
9. Guest best-score persistence is verified and authenticated best-score sync is verified once the shared Firebase platform is available.
10. GitHub Pages deployment succeeds after the repository-level Pages bootstrap task is completed.

## Explicit exclusions for v1

No timer, hints, undo history, sound, online leaderboard, daily challenge, sharing, multiplayer, external assets or analytics. Shared helpers are not extracted until a second game proves reuse.
