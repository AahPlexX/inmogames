# Threefold design

**Status:** Game implementation verified; live Firebase account services externally blocked by TASK-003  
**Last synchronized:** 2026-10-05  
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

The active-round UI exposes the current round value so the scoring consequence of a miss is visible before another check. Correct/missed feedback states the points banked or the new remaining round value. The completion view reports total score, best score and per-round earned points. Best completed score is durable progress and is eligible for account sync when the player is authenticated.

## Controls and interaction

The primary board is nine native buttons in a responsive 3 × 3 grid. Native controls are used rather than custom ARIA widgets.

- Pointer/touch: activate a tile to toggle it; use **Check three** to submit.
- Keyboard: Tab/Shift+Tab move through ordinary controls; Enter/Space activate the focused control.
- Controls remain comfortably larger than WCAG 2.2 AA's 24 × 24 CSS-pixel minimum target. The intended minimum game control block size is 48 CSS px.
- Focus indicators remain clearly visible and are never removed.
- Selection is not communicated by color alone: selected tiles use `aria-pressed`, a rendered checkmark, positional treatment and a visible **Selected** expression strip that lists the current values.
- The active-round header reports round number, current point value and selected-tile count without requiring the user to infer state from the board.
- Round, score and result changes use restrained live-region announcements; ordinary tile focus is not announced redundantly.
- The completion state retains the final total as the dominant value and adds a compact per-round earned-point breakdown so the result is explainable rather than just a single number.
- The layout has no horizontal page overflow at 320 CSS px and reflows at 200% text sizing without hiding or overlapping gameplay controls.
- Essential gameplay has no countdown or reaction-time requirement.
- Motion is nonessential and suppressed under `prefers-reduced-motion: reduce`.

## Persistence and privacy

Storage key: `inmogames:threefold:v1`.

Only the best completed score is durable. Guests use localStorage. Authenticated players sync that best score to `users/{uid}/games/threefold` through the shared save repository. Schema version is 1 with state `{ bestScore }`. Legacy numeric scores are migrated by the local adapter. Active runs remain intentionally ephemeral: reload starts a fresh run. On the first authenticated load, a transaction seeds an eligible guest score only if no cloud save exists; otherwise cloud wins. Reset removes the guest key or writes account defaults and clears the account mirror for Threefold only.

Storage/network failure never prevents play. Threefold does not make game-specific third-party requests; Firebase account/save traffic is owned by the shared platform layer.

## Engine boundary

`engine.ts` owns deterministic game rules and contains no DOM, React or storage access. Its public behavior covers seeded round generation, solution validation, score calculation and run progression. UI state is a consumer of the engine rather than an alternate rules implementation.

Round generation derives the target from a selected solution trio and shuffles all nine tiles deterministically. Tests prove generated rounds are solvable and deterministic for fixed seeds.

## Failure handling

Impossible UI states are prevented by engine contracts. If local persistence fails, the game continues and labels the best score as unavailable for persistence. If a route is loaded before the workspace chunk is ready, the shared Suspense status remains available.

## Quality gates

Threefold's game implementation is verified because:

1. Engine tests cover deterministic generation, guaranteed solvability, alternate valid solutions, scoring floor and five-round completion.
2. Storage tests cover valid, missing, malformed and write-failure behavior through the shared persistence seams.
3. The catalog and lazy workspace registry expose the game.
4. Keyboard and pointer behavior use the same native control path.
5. Rendered-browser tests cover 320 CSS-px and 200% text reflow, visible/non-color selection state, minimum tile target sizing, keyboard activation, reduced motion and representative contrast.
6. `pnpm validate` passes, including `pnpm design:check` and `pnpm test:design-browser`.
7. The tracker has no game-local capability left `planned` or `started`.
8. The game index, tracker, spec and task records match shipped behavior.
9. Guest persistence and the shared authenticated save path are repository/emulator verified. Real Firebase project provisioning and deployed account-save verification remain the external TASK-003 platform blocker and do not represent unfinished Threefold gameplay.
10. GitHub Pages deployment succeeds through the repository's automatic validated-main workflow.
11. Independent deployed phone QA confirms coherent heading/status/score semantics, meaningful accessible names, 44px+ visible controls, and no game-local clipping or painted overlap.

Exact revision `9ee0f93d` passed dependency freshness, warning-free design lint, TypeScript, structural checks, 44 unit tests, Firestore rules, account/persistence browser checks, the full rendered design/game browser suite including the catalog accessibility contract, both production builds, artifact upload and automatic Pages deployment in run `37256390159`.

## Completion contract

**Completion state:** verified  
**Completion evidence:** exact game-and-shell verification revision `9ee0f93d`; GitHub Actions run `37256390159` completed validation and Pages deployment.

- [x] The complete five-round core loop is playable start to finish and accepts every valid three-tile solution.
- [x] Deterministic engine, solvability, scoring-floor and run-completion rules are covered by automated tests.
- [x] Desktop, touch and keyboard interaction plus 320 CSS-px, 200% text, focus, non-color state and reduced-motion behavior have rendered-browser evidence.
- [x] Guest persistence, reset and shared account-save checkpoints are defined and repository/emulator verified; the remaining live Firebase dependency is explicitly external as TASK-003.
- [x] Assets, runtime-network behavior and platform boundaries comply with repository rules and introduce no game-specific third-party runtime dependency.
- [x] `pnpm validate`-equivalent CI gates and automatic GitHub Pages deployment are green on the cited exact revision.
- [x] `docs/GAME_INDEX.md`, this spec sheet, `src/games/threefold/TRACKER.md` and `.tasks/` agree on the verified game-local state and external blocker.
- [x] Independent deployed phone QA found no unresolved game-local clipping, overlap, target-size or accessible-name defect.

This section is authoritative for the word **complete**. Any new game-local feature, rule, persistence behavior, material UI change or unresolved defect automatically reopens Threefold: change `Completion state` to `implementing`, add or reopen the relevant checklist gate and tracker capability, update the handoff, and do not restore `verified` until fresh evidence satisfies every applicable gate.

## Explicit exclusions for v1

No timer, hints, undo history, sound, online leaderboard, daily challenge, sharing, multiplayer, external assets or analytics. Shared helpers are extracted only when cross-game reuse is demonstrated.

Threefold's game-local implementation is therefore verified. Shared account-save code is repository- and emulator-verified, but live Firebase project provisioning and real-site account/save verification remain externally blocked by TASK-003. See `docs/FIREBASE_SETUP.md`.
