# Cloudline Couriers design

**Status:** Implementing  
**Last synchronized:** 2026-10-06  
**Route:** `#/games/cloudline-couriers`

## Product documents
`src/games/cloudline-couriers/PRD.md` is the feature inventory, `src/games/cloudline-couriers/todo.md` is execution/sign-off state, and `src/games/cloudline-couriers/TRACKER.md` is the live resume point. `GOVERNANCE.md` defines the mandatory structure used by every game. Reconcile these documents whenever behavior, scope or verification state changes.

## Purpose and originality boundary
Cloudline Couriers is an original single-player skyway strategy game. The high-level loop is roll, move, resolve, earn, upgrade, advance. Names, fiction, 16-stop geometry, event taxonomy, economy, Cargo Cache encounter, landmarks, visual treatment and progression are original and must not reproduce proprietary Monopoly/Monopoly GO presentation or content.

## Rules
A deterministic d6 moves the courier clockwise around 16 stops. A selected 1×/2×/3× flight boost consumes that many fuel units and multiplies eligible earnings. Crossing Dispatch Dock grants a district-scaled circuit reward. Markets and Dispatch Dock progress deliveries; every fourth qualifying delivery pays a route bonus. Workshops restore fuel, Beacons grant one shield, Storms consume a shield or apply a bounded credit setback and break the streak, Windgates advance two additional stops without recursive event resolution, and Cargo Cache pauses flight until one of three seeded pods is selected. Zero fuel triggers a three-fuel emergency reserve so a durable save cannot dead-end.

Four landmarks—Aerie Post, Cloud Garden, Signal Spire and Skyforge Hangar—each have four stages. Upgrade cost is `120 × district × (stage + 1)`. Completing all four advances the district, resets landmark stages, pays a completion reward and restores fuel.

## Accessibility/responsiveness
The board is a 5×5 CSS grid perimeter, yielding exactly 16 stops while reserving the center for roll/boost controls. Important controls use a 44 CSS-pixel baseline, native buttons preserve keyboard/touch parity, active position and boost are non-color states, status feedback uses a live region, no drag/timing is required, and nonessential motion must honor reduced motion. Rendered evidence at 320 CSS px and 200% text is mandatory before verification.

## Architecture
`engine.ts` is pure deterministic TypeScript and owns movement/events/economy/progression. React does not reimplement rules. CLC-009 uses the shared versioned `GameSaveDefinition`/`useGameSave` platform; game code never imports Firebase directly. Schema v1 stores the active deterministic run under `inmogames:cloudline-couriers:v1` for guests and the shared account repository for authenticated players. Invalid position, fuel, landmark, streak, cargo, roll, RNG or message state is rejected rather than partially trusted. A game-scoped reset clears only Cloudline career state.

CLC-007 must use only repository-authored SVG/React/CSS. The visual family includes an airship courier, all seven stop/event families plus cloud atmosphere, four landmark identities and cargo pod treatment. Vector presentation is decorative inside already-named controls/regions. Courier arrival/bobbing motion is nonessential and must compute to no animation under `prefers-reduced-motion: reduce`; no remote art, font, CDN, image-generation or sprite-sheet request is allowed at runtime.

## Persistence evidence
Workflow `37554746482` is the RED evidence: all earlier gates passed, then guest reload failed because Aerie Post returned to Stage 0 instead of Stage 1. Revision `232102f4` / workflow `37555538295` is GREEN: schema decoder unit coverage, guest reload, Auth/Firestore emulator cross-browser restoration/reset, design-browser checks, both builds and Pages deployment succeeded. Real configured Firebase remains explicitly external under TASK-003.

## Completion contract
**Completion state:** implementing  
**Completion evidence:** governance is green in run `37554297029`; CLC-009 persistence is verified by revision `232102f4` / run `37555538295`; CLC-007 has now entered TDD RED with an authored-vector/reduced-motion browser regression and implementation pending.
- [ ] Complete roll → move → event → earn → upgrade → district loop is playable and verified.
- [ ] Deterministic engine covers movement, boost, circuit, event, Cargo Cache, streak/shield, fuel recovery and progression edge cases.
- [x] Versioned durable guest save and shared account-save/reset path have unit/browser/emulator evidence in run `37555538295`; real Firebase remains TASK-003.
- [ ] Original repository-authored SVG sprite/animation system is integrated with no remote runtime asset dependency.
- [ ] Keyboard/touch, focus, non-color state, 44px targets, 320px/200% reflow and reduced motion have rendered-browser evidence.
- [ ] Catalog, lazy registry, GAME_INDEX, PRD, todo, tracker and this spec agree on final shipped state.
- [ ] Full exact-revision repository validation is green for the completed game.
- [ ] GitHub Pages deployment and deployed route smoke are green without game-local console/page errors for the completed game.

Only after every applicable gate is evidenced may Completion state become verified.
