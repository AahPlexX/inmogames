# Hollowshift Product Requirements & Design Specification

**Last synchronized:** 2026-10-09  
**Status:** pre-implementation product design; approved direction, implementation intentionally not started in this integration  
**Provisional display name:** Hollowshift  
**Provisional slug:** `hollowshift`  
**Destination:** A full-length, replayable, single-player browser game whose minute-to-minute decisions remain satisfying while long-term play visibly expands the player's capability, options, mastery and world state.  
**Repository boundary:** static React/Vite, GitHub Pages canonical deployment, guest-local saves plus optional shared Firebase account saves, no custom server, no runtime third-party APIs/assets, no ads or telemetry.  
**Parallel-work boundary:** do not modify `src/games/royal-palace-blackjack/**` while the concurrent blackjack agent owns that game.

> This document is intentionally much deeper than a launch checklist. It is the design contract implementation must satisfy. A future agent must not collapse Hollowshift into a short score-chaser, one-screen prototype, or shallow roguelite and still call the game complete.

## 1. Product thesis

Hollowshift is a turn-based expedition roguelite about entering a living underground labyrinth, manipulating its shifting tunnel geometry, extracting resources and relics, and returning to a surface workshop that grows meaningfully stronger and more capable over dozens of hours.

The player should feel three things repeatedly:

1. **I understood something I did not understand before.** Mechanical knowledge compounds.
2. **I earned something that changes what I can do next.** Progress is visible and functional, not only numeric.
3. **I chose how far to push my luck.** Risk and autonomy create stories instead of arbitrary punishment.

The game is designed around earned competence and autonomy rather than coercive retention. Progress comes from play, better decisions, higher-difficulty contracts and mastery. There are no purchases, loot boxes, fake scarcity, streak-loss punishment, energy timers, wait gates, advertisements, pay-to-skip grind, or currencies whose purpose is to obscure value.

## 2. Player promise

A player should be able to open Hollowshift for five minutes and make meaningful progress, or stay for an hour and complete a multi-depth expedition without the interface or reward model forcing either behavior.

Every successful session must advance at least one durable vector:

- workshop capability;
- equipment breadth;
- explorer rank;
- biome knowledge;
- relic/codex discovery;
- mastery objectives;
- challenge-contract clearance;
- player skill and strategic understanding.

Failure may reduce the resources carried out of the current expedition, but it never erases permanent unlocks, previously banked resources, accessibility settings, completed mastery records, or the player's accumulated knowledge.

## 3. Audience and play pattern

- **Primary audience:** players who enjoy tactical puzzle-solving, exploration, gradual optimization and roguelite progression without twitch execution requirements.
- **Secondary audience:** players who enjoy short browser sessions but want a game with a real long-term arc.
- **Players:** single-player.
- **Expected first-run session:** 10–20 minutes.
- **Typical mature session:** 15–35 minutes.
- **Micro-session:** 3–8 minutes, one short contract or a partial expedition with safe suspend/resume.
- **Long session:** 45–75 minutes, multi-depth push plus workshop planning.
- **Target meaningful progression horizon:** at least 25–40 hours before all baseline permanent systems can reasonably be exhausted by an ordinary player; mastery/challenge play remains open-ended through deterministic seeds and escalating contracts.

The target horizon is a design capacity goal, not a timer requirement. The game must never inflate hours with mandatory waiting or repetitive low-value chores.

## 4. Ethical engagement contract

The phrase “long-term playable” means compelling, not manipulative.

Hollowshift must:

- reward voluntary play rather than punish absence;
- show upgrade costs and effects before purchase;
- keep RNG outcomes inspectable and bounded;
- never sell or simulate selling power;
- never use real-money-adjacent currency framing;
- never use streak loss, expiring rewards or false urgency;
- never make a player repeat solved tutorial content to recover from failure;
- never hide the probability or rule behind a material random outcome;
- allow immediate pause/suspend in all non-animated decision states;
- let the player stop after a completed turn without losing progress;
- make higher difficulty optional and reward it with faster/broader progression, not exclusive base-game essentials.

## 5. Design pillars

### P1 — Every turn is a decision
Movement, scanning, mining, tunnel shifting, tool use and retreat all consume a clear action economy. There should be no filler click whose only purpose is animation or delay.

### P2 — The cave is a machine the player learns
The labyrinth is not merely random rooms. Its segments can shift according to visible rules. Mastery comes from predicting geometry, creating routes, trapping threats, exposing seams and preserving extraction paths.

### P3 — Risk is player-authored
The player chooses whether to extract with guaranteed gains or descend for rarer rewards. The game should create “one more depth?” tension without secretly changing odds or forcing the push.

### P4 — Progress unlocks options before raw power
Permanent upgrades should first widen strategy: new tools, loadout slots, alternate actions, map information, resource conversions and contract choices. Numeric power exists, but horizontal capability is the main long-term reward.

### P5 — Failure teaches and feeds the next plan
A failed expedition should present a concise debrief: what was lost, what was banked, what caused failure, which mastery objective advanced, and what the player can change next time.

### P6 — The game belongs on every viewport
A 320 CSS-pixel phone, tablet, laptop and large desktop receive the same complete game. Composition changes; capabilities do not.

## 6. Core fantasy

The surface settlement of Lantern Reach sits above a newly active subterranean structure called the Hollow. The Hollow reconfigures itself whenever pressure builds. The player is a licensed delver whose job is to map routes, recover materials and stabilize deep anchors before collapses spread upward.

The story is intentionally light and system-forward. Narrative supports progression through short discoveries, workshop characters, relic descriptions and biome milestones rather than unskippable exposition.

## 7. Core verbs

The implementation must preserve these verbs as distinct decisions:

- **Survey** — reveal nearby hidden information.
- **Move** — enter an adjacent connected cell.
- **Shift** — rotate or translate a legal tunnel segment to change connectivity.
- **Mine** — harvest a visible seam.
- **Salvage** — recover a relic/cache/objective.
- **Brace** — reduce the next instability effect or protect one tile/connection.
- **Use tool** — spend a limited expedition resource for a tactical effect.
- **Interact** — operate anchors, lifts, gates and biome devices.
- **Extract** — bank carried resources and end the expedition safely.
- **Descend** — commit to the next depth with increased reward and danger.

No core verb may exist only as cosmetic flavor. Each must have a rules effect and testable engine representation.

## 8. Three nested gameplay loops

### 8.1 Turn loop — seconds
1. Read the local board state and upcoming instability forecast.
2. Choose one legal action.
3. Resolve deterministic movement/shift/tool effects.
4. Resolve bounded threat and instability reactions.
5. Update visible objectives, carried resources and extraction state.
6. Present the next decision immediately.

Goal: “I can see why the state changed.”

### 8.2 Expedition loop — 5 to 35 minutes
1. Choose a contract, loadout and entry depth.
2. Explore a seeded board.
3. Complete optional objectives while managing lamp charge, integrity and carried value.
4. Reach an extraction lift or descend deeper.
5. Choose risk versus guaranteed banking repeatedly.
6. Extract or fail.
7. Receive a debrief and earned progression.

Goal: “That run had a story caused by my decisions.”

### 8.3 Career loop — hours to months
1. Spend banked materials on workshop upgrades.
2. Unlock and specialize tools.
3. Increase Delver Rank by completing meaningful objectives, not raw time alone.
4. Unlock new biomes and contract modifiers.
5. Fill the Field Guide through discovery and demonstrated mastery.
6. Pursue biome mastery and higher-tier contracts.
7. Revisit old biomes with new capabilities and harder voluntary conditions.

Goal: “My account/save reflects what I have learned and earned.”

## 9. Expedition board model

### 9.1 Geometry
- Baseline board: 7 × 7 cells for ordinary depths.
- Special depths may use 6 × 8 or 8 × 8 layouts only if responsive rendering remains legible and engine tests treat geometry as data rather than hard-coding visual assumptions.
- Each cell contains a tunnel tile with openings on north/east/south/west edges.
- Tile shapes: dead-end, straight, corner, T-junction, cross, chamber.
- Connections are valid only when adjacent tile openings agree.
- The player occupies exactly one traversable cell.

### 9.2 Hidden information
- The player's current cell and surveyed radius are fully known.
- Unsurveyed tiles show existence but not exact seam/cache/threat contents.
- Geometry itself should be mostly knowable; the game is about route manipulation, not memory-testing fog.

### 9.3 Shifting
Two shift families create the signature mechanic:

1. **Rotate tile** — rotate one legal non-anchored tile 90 degrees.
2. **Shift lane** — translate an eligible row/column segment one cell, with the ejected tile wrapping to the opposite end unless an anchor blocks the lane.

Rules:
- The move preview must show resulting connectivity before confirmation.
- A shift may not strand the player in an invalid cell state.
- Critical extraction anchors are immovable.
- Certain hazards can temporarily lock a tile or lane.
- Shift legality is deterministic and explained on disabled controls.
- Touch users never need to drag; tap/select + explicit directional controls provide complete operation.

### 9.4 Instability forecast
Every depth has an instability meter. Actions increase pressure by known amounts. Crossing a threshold triggers a forecasted cave reaction from a small deterministic set, e.g.:
- rotate one marked unstable tile;
- lock one marked seam;
- advance a roaming threat;
- collapse a depleted optional chamber;
- increase hazard intensity.

The next reaction is previewed at least one turn before it can occur. Difficulty modifiers may shorten the forecast window, but baseline play never relies on invisible state changes.

## 10. Player resources during an expedition

### Lamp charge
Acts as the soft expedition clock. Movement and surveying consume small amounts; some tools consume more. Lamp reaching zero does not instantly kill the player. Instead, information range contracts and extraction urgency rises, preserving agency.

### Suit integrity
Represents damage tolerance. Hazards and threats can reduce it. At zero, the expedition fails and emergency recovery triggers.

### Pack capacity
Carried materials/relics occupy slots or weight. The player decides what to keep before descending.

### Tool charges
Limited tactical actions refreshed between expeditions, with some in-run refill opportunities.

### Stability pins
A scarce resource used to anchor tiles/lanes against future shifts. Pins create strategic commitment and are recoverable only under specific conditions.

## 11. Threat model

Hollowshift avoids reflex combat. Threats are tactical actors with simple, readable behaviors.

Baseline threat archetypes:

- **Crawler:** advances one connected step toward the player after every N actions.
- **Scree Mite:** consumes exposed resource seams if not diverted.
- **Echo:** copies the player's previous movement direction when possible.
- **Burrower:** ignores one disconnected edge per reaction but telegraphs destination.
- **Warden:** stationary zone-control threat protecting high-value objectives.

The player handles threats by rerouting tunnels, using tools, bracing, timing movement, trapping, stunning or bypassing. Direct “attack” is not the universal answer.

Threat behavior must be:
- deterministic given seed and state;
- previewable enough to plan around;
- encoded with shape/icon/text as well as color;
- able to resolve without animation timing dependence.

## 12. Objective system

Every expedition has one primary objective and zero to three optional objectives.

Primary objective examples:
- recover a survey core;
- stabilize two anchor nodes;
- extract a named relic;
- reach a rescue beacon and return;
- map a percentage of the depth;
- collect a material quota;
- survive a forecasted instability cycle and extract.

Optional objectives provide bonus XP/material multipliers and mastery progress, never mandatory access to base systems.

Objective quality rule: an objective must change how the player routes or allocates resources. “Click three glowing things already on the path” is not enough.

## 13. Extraction and push-your-luck structure

At the end of a depth, the player chooses:

- **Extract:** bank 100% of secured materials, relic discoveries and completion rewards.
- **Descend:** carry value forward, gain a visible depth multiplier, enter a harder board and risk losing the unsecured portion on failure.

Failure recovery baseline:
- contract completion reward: lost if primary objective was not completed;
- secured quest/relic discoveries: kept once physically secured;
- ordinary carried materials: recover 40% baseline on emergency extraction;
- banked pre-expedition resources: never touched;
- mastery counters based on genuine actions: kept;
- equipped permanent tools/upgrades: never lost.

Workshop upgrades may improve emergency recovery modestly, but no upgrade should eliminate the core risk decision.

## 14. Difficulty architecture

Difficulty is separated into **accessibility assists** and **challenge contracts** so players never have to trade access needs for progression legitimacy.

### Accessibility/gameplay assists
Examples:
- extended threat forecast;
- reduced lamp drain;
- reduced hazard damage;
- undo last shift before reactions resolve (limited or unlimited by assist setting);
- pause after every reaction;
- larger interaction targets/labels;
- slower or instant motion presentation.

Assists do not disable story, core upgrades or ordinary achievements. Challenge-specific badges may require standard rules, but those badges are cosmetic/status goals, not power gates.

### Challenge contracts
Voluntary modifiers unlocked through rank:
- +1 threat tier;
- shorter instability forecast;
- reduced pack capacity;
- no mid-depth refill;
- extra objective requirement;
- unstable extraction route;
- elite Warden;
- reduced emergency material recovery.

Each modifier has a visible reward multiplier. Stacking modifiers increases both challenge score and progression efficiency.

## 15. Long-term progression system

Progression is intentionally layered so one number cannot carry the entire game.

### Layer A — Delver Rank
- Represents career progression.
- Earned from primary objectives, optional objectives, new discoveries and challenge-contract completion.
- Rank XP from repeating a trivial solved contract has diminishing value; higher-depth/new-objective play remains more efficient.
- Rank unlocks systems and contract breadth, not giant raw stat jumps.

Milestone cadence:
- Rank 1: basic survey, shift and extract.
- Rank 2: first workshop upgrade slot.
- Rank 3: second tool family.
- Rank 4: challenge contracts.
- Rank 5: second biome.
- Rank 7: tool specialization.
- Rank 10: third biome and mastery board.
- Rank 14: deep contracts.
- Rank 18: fourth biome.
- Rank 25: Apex contract layer/endgame loop.

Exact XP curve is balancing data, not UI hard-code.

### Layer B — Workshop
The workshop is the persistent home screen and visual record of progress.

Stations:
1. **Cartography Desk** — starting survey radius, map annotations, biome forecast information.
2. **Tool Bench** — tool unlocks, charges, alternate tool modules.
3. **Lamp Rig** — charge efficiency and emergency reserve choices.
4. **Pack Frame** — capacity versus movement tradeoffs.
5. **Recovery Bay** — emergency recovery percentage and post-failure information.
6. **Archive** — relic/codex display and discovery bonuses.
7. **Contract Board** — challenge modifiers, biome targets and mastery tasks.

Each station has 4–6 meaningful tiers. No tier may be only “+1%” unless attached to a larger qualitative unlock.

### Layer C — Tool families
Baseline tool families:
- Resonator: reveal/forecast information.
- Jack Brace: lock or reinforce geometry.
- Pulse Line: remote interaction across connected tunnels.
- Arc Lamp: trade charge for threat control.
- Survey Drone: reveal a route branch without moving.
- Cutter: open one sealed edge or shortcut.

Each family has mutually exclusive modules or loadout choices. The player cannot equip everything at once.

### Layer D — Biome mastery
Four baseline biomes, each adding a rule rather than just a palette:
1. **Slate Veins** — foundational geometry and Crawler pressure.
2. **Glasswater Caves** — flooded lanes and reflected survey information.
3. **Rootvault** — living roots that grow across unused connections.
4. **Ashworks** — heat vents, timed pressure releases and industrial remnants.

Each biome has a mastery track based on varied feats, not repetition count alone.

### Layer E — Field Guide / collection
Discover:
- threats;
- tunnel phenomena;
- materials;
- named relics;
- workshop notes;
- rare room archetypes.

Collection rewards are mostly knowledge, cosmetics and horizontal unlocks. The Guide should make the player feel smarter, not obliged to chase random 0.1% drops.

### Layer F — Apex contracts / endgame
After Rank 25:
- player chooses a biome, seed class and contract modifier stack;
- completion grants Apex Marks used for prestige cosmetics, alternate tool skins/themes and non-essential challenge loadout slots;
- each cleared modifier tier records a personal best;
- weekly server rotation is prohibited by the static/no-service boundary; instead the game can derive a **Calendar Seed** locally from ISO week for an optional common challenge, with no absence penalty and no online leaderboard dependency.

## 16. Reward cadence

The game must reward at multiple time scales.

### Every 10–60 seconds
- new information;
- route opened;
- seam found;
- threat avoided;
- satisfying shift resolution;
- resource pickup;
- objective progress.

### Every 2–5 minutes
- room/anchor completion;
- tool charge decision;
- depth milestone;
- optional objective completion;
- meaningful “extract vs descend” decision.

### Every 10–30 minutes
- expedition debrief;
- rank progress;
- workshop purchase opportunity;
- tool mastery progress;
- codex discoveries.

### Every 1–3 hours
- new tool family/module;
- station tier;
- biome rule;
- challenge contract category;
- loadout strategy shift.

### Every 5–10 hours
- new biome or major system;
- mastery tier;
- deeper contract class;
- new endgame decision layer.

A reward is not allowed to be only a modal, badge or confetti. At least half of medium/long cadence rewards must change available strategy, information or expression.

## 17. Economy design

Currencies/resources must remain few and legible.

### Common materials
Used for broad workshop upgrades. Earned reliably.

### Biome materials
Used for biome-linked tool modules and station specializations. Earned by playing the relevant biome, with no random-exclusive single-drop gate.

### Relic fragments
Earned from optional relic objectives; used for Archive unlocks and cosmetics.

### Apex Marks
Post-Rank-25 mastery currency. Never required for the baseline campaign.

Economy rules:
- show current balance, cost and resulting effect together;
- no currency conversion chains longer than one step;
- no random shop reroll tax;
- no consumable purchase that can accidentally spend a rare progression currency without confirmation;
- no irreversible choice without a preview and clear confirmation;
- respec for tool modules is free outside expeditions, preserving experimentation.

## 18. First-hour onboarding

### First 3 minutes
- player begins directly on a tiny 5 × 5 training depth;
- teach move, rotate, connected paths and extraction through action;
- no lore wall;
- first reward is immediate workshop access.

### Minutes 3–10
- first normal 7 × 7 expedition;
- introduce lamp charge and one Crawler;
- give the player a safe extraction choice after the primary objective;
- explicitly show what would be gained by descending.

### Minutes 10–25
- first workshop upgrade choice from 3 visible options;
- player unlocks Resonator or Jack Brace as first tool preference;
- second expedition adds instability forecast.

### Minutes 25–60
- optional objectives appear;
- first biome mastery task appears;
- first failure, if it happens, demonstrates recovery without deleting permanent progress;
- rank-up teases Challenge Contracts without opening an overwhelming menu.

Tutorial rules:
- every tutorial step can be skipped once understood;
- no repeated mandatory tutorial on reset;
- help remains available contextually;
- input prompts reflect current input method without hiding alternatives.

## 19. Session return experience

When returning, the game should answer three questions in under five seconds:
1. Where was I?
2. What was I working toward?
3. What is the next useful action?

If a run is suspended:
- open with a compact expedition resume card;
- show biome, depth, primary objective, lamp/integrity and carried value;
- Resume is primary; Abandon is secondary/destructive and requires confirmation.

If between runs:
- show most relevant near-term progression: next rank unlock, affordable workshop upgrade and current contract objective;
- do not show a wall of red notification dots.

## 20. UI information architecture

### Game shell
Shared InMo header/account/save behavior remains unchanged.

### Hollowshift workspace regions
- **Primary board:** visually dominant.
- **Expedition HUD:** lamp, integrity, pack, depth, instability forecast.
- **Action tray:** context-sensitive legal actions with keyboard hints.
- **Objective card:** primary + optional objectives, collapsible but never inaccessible.
- **Tool belt:** equipped tools/charges.
- **Decision panel:** descend/extract, upgrade or debrief states.

### Wide layout
Board centered; HUD/action tray adjacent; objective/tool panels use side column with sensible max width.

### Narrow portrait
Board remains full-width within safe measure; HUD becomes two-row compact strip; actions become bottom flow section, not a fixed overlay that hides focus; objectives/tools use disclosure panels below board.

### Short landscape
Board and action tray can use two-column composition; vertical reachability remains intact; no forced device rotation.

### Large desktop
Do not scale the board infinitely. Cap useful board size and use extra space for hierarchy, not oversized controls/text.

## 21. Input model

Keyboard baseline:
- Arrow keys or WASD: move focus/cursor through board.
- Enter/Space: select/confirm.
- R / Shift+R only if exposed and remappable-equivalent controls exist for rotate direction; never character-key-only with no alternative.
- Escape: close non-destructive overlay / pause.
- Number keys: optional tool shortcuts, never sole access.

Pointer/touch:
- tap tile to select;
- tap explicit action to rotate/shift/move;
- no required drag;
- no action fires on pointer-down where cancellation would be impossible;
- ordinary repeated targets target 44 × 44 CSS px or larger.

Gamepad support is a future optional enhancement, not a v1 completion blocker unless added to scope later.

## 22. Motion and feel

Motion should make cause-and-effect legible, not delay play.

Baseline timing targets:
- selection/focus response: near-immediate;
- tile rotation: 120–180 ms;
- lane shift: 160–240 ms;
- pickup/score transfer: 180–300 ms;
- major depth transition: 350–600 ms, always skippable by state completion rather than timer dependence.

Rules:
- input lock lasts only for the state transition that would otherwise create ambiguity;
- queued animation may never make engine state depend on frame timing;
- `prefers-reduced-motion: reduce` replaces spatial motion with instantaneous state changes plus opacity/border/status cues;
- important information is never conveyed by motion alone.

## 23. Audio

Audio must be optional and supplementary.

Suggested authored sound categories:
- tile rotate/shift;
- path connect/disconnect;
- survey pulse;
- seam harvest;
- instability warning;
- threat advance;
- extraction bank;
- workshop unlock.

Requirements:
- master mute;
- effects volume; music only if original/licensed and genuinely useful;
- no autoplay that blocks the first interaction;
- every critical audio cue has a visual/status equivalent;
- repeated UI sounds must avoid fatigue through short duration and restrained frequency.

## 24. Accessibility requirements

Hollowshift must meet repository WCAG 2.2 AA expectations and use the stronger existing game target baseline.

Required:
- complete keyboard operation;
- persistent visible focus;
- focus never hidden behind sticky/fixed game UI;
- non-color cues for selection, threat intent, objective and status;
- no required dragging;
- 44 × 44 CSS-pixel ordinary game targets where practical, never below WCAG 2.5.8 minimum without a qualifying exception;
- 200% text reflow at required matrices;
- no document horizontal overflow at 320 CSS px;
- reduced-motion equivalent presentation;
- live-region/status semantics for important non-focus state updates without announcing every decorative event;
- board tile accessible names include coordinates, tile shape/state, contents and key legality where relevant;
- help contains plain-language rules for shift behavior;
- accessibility assists are separate from challenge legitimacy.

### Verified prototype evidence (2026-10-10)

The disposable decision-loop prototype at `public/prototypes/hollowshift-core-loop-v2.html` is now covered by `tests/browser/hollowshift-prototype.mjs` and the shared `pnpm test:hollowshift` command. That command is also included in `pnpm test:design-browser`; `.github/workflows/hollowshift-prototype.yml` provides the same check as a fast manually dispatchable/game-local gate with overlapping runs cancelled.

Verified automated browser evidence covers 320×568, 390×844, 844×390, 768×1024, 1024×768, 1440×900 and 1920×1080 CSS-pixel viewports, plus 320×568 with 200% root text. The prototype preserves 44×44 CSS-pixel board/action targets without document horizontal overflow. The validated narrow composition uses a 2×2 HUD, stacked terminal actions and wrapping action labels with reduced inline padding rather than shrinking type or targets.

The board exposes `grid → row → gridcell` ownership with one roving tab stop, visible focus and Arrow/Home/End navigation. Preview/cancel spends no turn while committed geometry does; touch uses explicit actions with no required drag; reduced-motion presentation preserves state transitions; and the test rejects browser console/page errors.

Evidence runs: candidate full-matrix green `38100932047`; post-commit permanent focused green `38101017710`; shared package-entry focused green `38101154123`. Repository-wide run `38101154026` reached `test:design-browser` but stopped earlier in the chain on an unrelated Lucky Seven Classic strict-locator ambiguity before Hollowshift executed; this is not a Hollowshift failure.

Human gates remain authoritative: issue #11 still requires qualitative core-loop play judgment, and issue #14 still requires HITL visual/experiential sign-off even though its objective browser evidence is complete.

## 25. Persistence and save contract

Implementation must use the shared `useGameSave`/repository abstraction. No direct game-specific Firebase calls.

Proposed durable schema: `HollowshiftSaveV1`.

Durable fields:
- schema version;
- Delver Rank + XP;
- banked resources;
- workshop station levels/choices;
- unlocked tool families/modules;
- equipped default loadout;
- unlocked biomes/contracts/modifiers;
- Field Guide discoveries;
- biome mastery progress;
- challenge/Apex records;
- settings specific to Hollowshift that are not shared shell settings;
- optional suspended expedition snapshot.

Suspended expedition snapshot:
- deterministic seed;
- board geometry/content state;
- player position;
- threat states;
- lamp/integrity/pack/tool charges;
- objective state;
- depth;
- instability state + forecast;
- carried resources;
- turn counter;
- rules version if needed for migration safety.

Save behavior:
- autosave after each completed turn and all durable progression mutations;
- never save half-resolved animation state;
- guest uses versioned local storage via shared save layer;
- signed-in account uses shared Firestore path plus local cache;
- guest-to-account migration follows repository shared semantics;
- invalid/corrupt snapshot must not destroy the last valid durable career save;
- reset career is destructive, explicit and confirmed;
- abandon suspended expedition leaves career progression intact and applies documented emergency-recovery rules.

## 26. Determinism and engine architecture

The rules engine must be pure TypeScript and independent of React, DOM, storage, audio, timers and Firebase.

Recommended minimal modules when implementation begins:
- `engine.ts` — state transitions and legal actions;
- `generation.ts` — seeded board/content generation;
- `progression.ts` — XP, rank, rewards, upgrade legality and costs;
- `persistence.ts` — schema decoder + save definition;
- `HollowshiftWorkspace.tsx` — UI orchestration only;
- `hollowshift.css` — game-scoped presentation.

Do not split further until real complexity requires it.

Determinism requirements:
- one explicit seeded PRNG state;
- generation consumes RNG in documented order;
- threat decisions deterministic;
- instability event selection deterministic;
- replay/debug tests can reproduce a state transition from seed + action sequence;
- cryptographic randomness is unnecessary.

## 27. Content minimum for full release

A “complete” Hollowshift may not ship with one biome and promises.

Minimum baseline content:
- 4 biomes with materially distinct rules;
- 5 threat archetypes + at least 2 biome variants;
- 6 tool families;
- 7 workshop stations;
- at least 24 workshop upgrade nodes/tiers total;
- at least 12 tool modules/specializations;
- at least 30 primary contract templates/parameterized objective combinations across biomes;
- at least 24 optional objective variants;
- at least 40 Field Guide discoveries;
- at least 16 named relic discoveries;
- at least 20 challenge modifiers/combinations available through the contract system (individual modifiers may combine rather than requiring 20 unique mechanics);
- Apex contract loop unlocked after baseline career progression.

Content may be data-driven; do not create bespoke React components for each contract or relic.

## 28. Pacing targets

These are playtest targets, not guarantees:

- first successful extraction: within 10 minutes;
- first permanent upgrade: within 15 minutes;
- first meaningful tool choice: within 25 minutes;
- first visible biome unlock goal: within 45 minutes;
- second biome: approximately 1.5–3 hours for ordinary play;
- third biome: approximately 6–10 hours;
- fourth biome: approximately 14–20 hours;
- Rank 25/Apex access: approximately 25–40 hours.

If testing shows players repeat solved content to fill a bar, adjust costs/rewards before adding more grind.

## 29. Failure-state UX

Failure debrief must answer:
- what ended the expedition;
- what resources were carried;
- what was recovered versus lost;
- what permanent progress still advanced;
- which objective/mastery item was closest;
- one contextual suggestion, not a scolding message.

No “You failed” full-screen delay that blocks immediate retry/return.

## 30. Upgrade UX

Every upgrade card shows:
- current effect;
- next effect;
- cost;
- prerequisites;
- what new decision/capability it introduces;
- whether it is reversible/respeccable.

Upgrade purchases should animate briefly and then immediately surface the newly available action or next goal.

## 31. Local-only challenge sharing

Because online leaderboards/server authority are out of scope, social comparison is intentionally lightweight:
- copyable seed code;
- copyable contract/modifier summary;
- local personal bests;
- optional Calendar Seed derived client-side from week identifier;
- no account requirement to play or complete challenges.

Future online leaderboards require a separate repository decision and anti-cheat/server-authority design; do not quietly add them.

## 32. Visual direction

Hollowshift should feel like tactile cartography and mechanical geology rather than generic neon sci-fi.

Materials:
- dark slate/charcoal cave ground;
- warm lantern/amber focus accents;
- pale chalk/engraving lines for tunnel connectivity;
- restrained biome accent colors;
- copper/brass workshop machinery;
- paper/board-inspired map overlays.

Important rule: color is aesthetic reinforcement, never the sole carrier of connection type, hazard class, rarity or selection.

Art should be repository-authored CSS/SVG where practical. Do not add a third-party art dependency simply to achieve texture.

## 33. Performance budget

Target ordinary modern mobile hardware as first-class.

- avoid per-frame React state updates for purely decorative motion;
- turn-based rules resolve synchronously and quickly;
- board DOM remains bounded (roughly tens, not thousands, of interactive nodes);
- prefer CSS transforms/opacity for motion;
- suspend decorative animation when document hidden;
- no runtime image/font CDN dependency;
- no need for Canvas/WebGL unless profiling proves DOM/SVG insufficient.

## 34. Testing strategy

### Unit tests
Must cover at least:
- seeded generation determinism;
- legal/illegal movement;
- tile rotation connectivity;
- lane shift wrap/anchor rules;
- player cannot be invalidly stranded;
- survey visibility;
- instability threshold/forecast resolution;
- threat movement/intent;
- extraction recovery math;
- descend multiplier;
- objective completion;
- XP/rank unlocks;
- upgrade cost/prerequisite legality;
- persistence decoder rejects malformed/cross-version data.

### Browser tests
Must prove:
- new game → first action → extraction → workshop upgrade flow;
- suspend/reload/resume exact expedition state;
- guest reset behavior;
- account-save integration through shared platform when configured/emulated;
- keyboard complete flow;
- touch complete flow without drag;
- 320 × 568 no horizontal overflow;
- 390 × 844 touch target quality;
- 844 × 390 short landscape reachability;
- 768 × 1024 tablet composition;
- 1024 × 768 200% text;
- 1440 × 900 reduced motion;
- 1920 × 1080 intentional max-width composition;
- no uncaught console/page errors.

### Balance tests
Pure tests should also assert economic invariants such as:
- no negative balances;
- no upgrade purchased without prerequisite/cost;
- recovery never exceeds carried unsecured value;
- reward multipliers are monotonic with challenge weight;
- no rank unlock becomes impossible because of mutually exclusive upgrade choices.

## 35. Development phases

### Phase 0 — Design validation
No gameplay code beyond throwaway prototype if needed.
- validate shifting-tunnel mechanic feels understandable;
- validate 7 × 7 board legibility on 320px viewport;
- validate turn loop in 3–5 minute paper/prototype scenario;
- lock first-hour progression curve.

### Phase 1 — Vertical slice
- one biome;
- move/survey/rotate/shift/extract;
- one threat;
- lamp/integrity;
- one tool;
- deterministic generation;
- local persistence;
- full responsive/accessibility baseline.

The vertical slice is **not** the game release.

### Phase 2 — Career foundation
- Delver Rank;
- workshop stations;
- three tool families;
- optional objectives;
- challenge contracts;
- save migrations;
- debrief/progression UX.

### Phase 3 — Content breadth
- four biomes;
- five threats;
- six tools;
- Field Guide/relics;
- mastery tracks;
- complete contract content floor.

### Phase 4 — Endgame and polish
- Apex contracts;
- Calendar Seed;
- personal bests;
- complete audio/motion polish;
- accessibility assist matrix;
- balance/pacing validation;
- production evidence across viewport matrix.

## 36. Explicit non-goals for initial release

- real-time multiplayer;
- online leaderboards;
- chat/social graph;
- paid currency or monetization;
- ads;
- battle pass;
- streak rewards;
- energy system;
- procedural narrative generated by remote AI;
- third-party runtime APIs;
- giant open world;
- physics-heavy real-time combat;
- account-required play.

## 37. Open decisions deliberately left for prototype/playtest

These are not permission to improvise silently. Resolve and record them before their implementation phase:

1. Whether lane shifts wrap or expose an empty boundary in advanced biomes.
2. Exact lamp-drain curve and whether survey always costs charge.
3. Emergency-recovery baseline (40% proposed) after first balance prototype.
4. Whether pack uses discrete slots or weight; choose the clearer mobile UI after prototype.
5. Exact XP/rank curve and station costs from playtest, preserving pacing targets.
6. Whether Calendar Seed uses UTC ISO week or local-week semantics; prefer deterministic global ISO week unless UX testing shows confusion.

## 38. Release-quality acceptance tests from the player's perspective

A release candidate fails if any of these statements are false:

- “I can explain what changed after every turn.”
- “I can stop after a turn and resume without losing progress.”
- “I earned at least one meaningful upgrade in my first session.”
- “After several hours, I have new strategic options, not merely larger numbers.”
- “Taking a harder contract gives me visibly better rewards.”
- “I can experiment with loadouts without irreversible punishment.”
- “Failure costs something but does not make the previous hour feel erased.”
- “The game remains complete on my phone.”
- “Keyboard and touch are both first-class.”
- “Reduced motion still communicates every important state change.”
- “There is always a clear next goal, but I am not punished for leaving.”
- “By the time I reach the final biome, earlier systems have developed rather than been discarded.”

## 39. Completion contract

**Completion state:** implementing  
**Completion evidence:** Design-only integration on 2026-10-09; no gameplay implementation is claimed complete by this document. Exact implementation revision/run evidence must replace this line when verification begins.

Hollowshift is complete only when every applicable gate below is checked on one exact integrated `main` revision:

- [ ] Core deterministic engine implements movement, survey, rotate, lane shift, instability, threats, objectives, extraction and descend rules with material edge-case unit coverage.
- [ ] Full baseline career exists: Delver Rank, workshop, six tool families, four biomes, Field Guide, mastery and challenge contracts meet the content floor in this specification.
- [ ] Long-term progression pacing has playtest evidence showing meaningful early rewards and no mandatory low-value grind to reach later systems.
- [ ] Failure/recovery, upgrade and challenge rewards are deterministic/inspectable enough that a player can understand costs, risks and outcomes before committing.
- [ ] Guest persistence and suspended-expedition resume/reset/migration behavior are verified through the shared save layer; account path has emulator/repository evidence where applicable and never bypasses platform abstractions.
- [ ] Complete keyboard and complete touch flows are verified; no required drag or timing-sensitive input exists.
- [ ] All repository viewport cases pass with no horizontal overflow, hidden required controls or second-class narrow/landscape layouts; ordinary gameplay targets meet the repository target-size policy.
- [ ] 200% text and reduced-motion modes preserve information, controls and state meaning.
- [ ] Critical status is not conveyed by color, motion or audio alone; board semantics/focus/status messaging are verified in rendered browser tests.
- [ ] Motion/audio polish improves causal readability without delaying rules or creating input races; master mute/equivalent cues work.
- [ ] Every asset is original or redistribution-compatible with licence provenance recorded; no unapproved runtime network dependency exists.
- [ ] PRD/spec/tracker/todo/GAME_INDEX and `.tasks/` agree on current scope, status, evidence, blockers and exact next action in the same integration.
- [ ] Full `pnpm validate` is green on the exact revision, including dependency/design/documentation/browser gates.
- [ ] GitHub Pages deploy for the exact release revision succeeds and production smoke checks cover a fresh game, one expedition action, save/reload and catalog routing.
- [ ] No game-local capability remains `planned`, `started` or `blocked` when completion state is changed to `verified`; only explicitly external blockers may remain.

## 40. Source basis checked 2026-10-09

Primary/current sources used to constrain this design:

- W3C WCAG 2.2 / WAI guidance: focus not obscured, visible focus, dragging alternatives, pointer target sizing, reflow and reduced-motion techniques.
- Microsoft Xbox Accessibility Guidelines: UI focus handling, narration/information access principles and pausable/alternative presentation guidance.
- MDN: Pointer Events, `touch-action`, and `prefers-reduced-motion` behavior and browser support.
- U.S. Federal Trade Commission, *Bringing Dark Patterns to Light* and 2025 HoYoverse/Genshin guidance: avoid manipulative grinding, confusing virtual currencies, deceptive odds and coercive purchase-oriented patterns.
- Peer-reviewed Frontiers literature on games and Self-Determination Theory: autonomy and competence are important motivational needs; challenge can support achievement when it remains player-manageable.

Research informs constraints; it does not substitute for Hollowshift playtesting. Exact balance numbers remain hypotheses until tested.

## 41. Handoff rule

Before any future agent writes Hollowshift gameplay code:

1. Re-read live `origin/main`; this repository is under parallel development.
2. Do not touch Royal Palace Blackjack files while another agent owns that game.
3. Resolve or consciously defer the Phase 0 open decisions above.
4. Create the required `src/games/hollowshift/PRD.md`, `TRACKER.md`, `todo.md`, meta/workspace files and GAME_INDEX/task state in one valid integration when implementation begins.
5. Keep this authoritative spec and the game tracker synchronized with every later Hollowshift implementation/test/index change.
6. Do not mark the game verified until the full content/progression contract—not merely the vertical slice—passes.
