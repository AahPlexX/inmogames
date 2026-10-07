# Cloudline Couriers design

**Status:** Implementing — expanded long-form scope  
**Last synchronized:** 2026-10-07  
**Route:** `#/games/cloudline-couriers`

## Product documents
`src/games/cloudline-couriers/PRD.md` is the exhaustive feature/player-journey inventory, `todo.md` is 1:1 execution/sign-off state, and `TRACKER.md` is the live resume point. `GOVERNANCE.md` defines the mandatory structure. Reconcile all whenever behavior, scope or verification changes.

## Purpose and originality boundary
Cloudline Couriers is an original single-player skyway strategy/progression game. The early loop is boost/roll → move → resolve → earn → improve. That loop is only the foundation: release scope now includes onboarding, rank, permanent airship progression, a five-region/twenty-district campaign target, contracts, milestone rewards, collections, mastery, specialists, crafting, weather, branching routes, expeditions, region finales, post-campaign charter play, objective clarity, professional reward presentation, audio and explicit challenge/assist options. Names, fiction, geometry, events, economy, art, content and progression remain original and must not reproduce proprietary Monopoly/Monopoly GO presentation/content.

## Teleological experience contract
The player begins as a modest courier and should repeatedly see evidence that effort changed the world and their capabilities. The first session teaches through play and reaches a meaningful reward/upgrade quickly. Midgame broadens strategic agency through ship/crew/route systems. Campaign progression transforms districts/regions and culminates in authored finale challenges. Post-campaign play preserves earned progress while adding mastery modifiers and personal-best goals. The target first-campaign duration is 20–40 hours, but this is a tuning hypothesis until playtesting measures it.

Engagement is not defined as impaired control. No paid loot boxes, real-money gambling, deceptive scarcity, forced login streak loss, punitive absence, hidden rubber-banding, disguised costs or monetized frustration. Long-term motivation comes from mastery, visible improvement, strategic choice, collection, discovery, authored content and proportional celebration.

## Base rules already implemented
A deterministic d6 moves the courier around 16 introductory stops. A selected 1×/2×/3× boost consumes fuel and multiplies eligible earnings. Dispatch crossing grants a circuit reward. Markets/Dispatch progress deliveries; every fourth qualifying delivery pays a route bonus. Workshops restore fuel, Beacons grant shield, Storms consume shield or apply bounded setback, Windgates advance without recursive event resolution, and Cargo Cache pauses flight for one of three seeded choices. Zero fuel triggers emergency reserve.

Four introductory landmarks each have four stages. Upgrade cost is currently `120 × district × (stage + 1)`. Completing all four advances the district, resets stages, pays a reward and restores fuel. Expanded campaign/economy tuning may revise data/rules through explicit versioned design changes; save migrations are required whenever persisted shape changes.

## Long-form architecture
- **Turn:** boost → roll → travel → landing → consequence → next action.
- **Session:** deliveries/contracts → fuel/shield decisions → cache/route choices → visible upgrade.
- **District:** four landmarks + district modifier/objective → transformation/completion.
- **Region:** several distinct districts + ship/crew/loadout growth → bespoke finale.
- **Campaign:** target five regions/twenty districts → collection/mastery arcs → Sky Charter unlock.
- **Endgame:** charter routes + chosen modifiers + mastery/personal bests + remaining collections/achievements; no destructive prestige reset.

Expanded engine design must remain deterministic/testable. Content definitions belong outside React. React renders state/actions and never becomes the source of gameplay truth. New campaign systems require schema-versioned persistence/migration and explicit unit/browser evidence.

## Professional presentation contract
CLC-007 is no longer satisfied by merely rendering SVG elements. Release art must be cohesive, production-quality and stateful: courier airships, landmarks across upgrade stages, stop scenes, weather, cargo, crew, environmental layers, particles/VFX and UI iconography. Emoji-as-game-art, crude primitive SVG stand-ins, generic placeholder icons and visually unfinished assets are prohibited. Motion communicates anticipation, travel, arrival, impact, reward and transformation; significance determines celebration intensity. Reduced-motion users receive equivalent state/consequence clarity.

Audio is a release system, not optional polish: original/license-safe music and SFX support actions and milestones, with independent controls and no audio-only critical information.

## Accessibility/responsiveness
Complete gameplay must remain equivalent across phone/tablet/laptop/desktop/large displays, 320 CSS px, 200% text, keyboard/touch/pointer and reduced-motion. Important controls use >=44 CSS-pixel baseline; state is not color-only; objectives/rewards/risks remain readable; no drag/timing-only requirement is permitted. Player-controlled challenge/assist settings are explicit and may not hide rubber-banding.

## Persistence evidence
Workflow `37554746482` is CLC-009 RED evidence. Revision `232102f4` / workflow `37555538295` is schema-v1 GREEN: decoder unit coverage, guest reload, Auth/Firestore emulator cross-browser restoration/reset, design-browser checks, builds and Pages deployment succeeded. Real configured Firebase remains external TASK-003. Expanded systems must migrate this schema without silently discarding earned state.

## Research basis
The expanded PRD records authoritative sources reviewed 2026-10-07: Apple HIG game/onboarding/control/feedback guidance, Apple Game Center, Google Play Games achievements, Android quality guidance, Microsoft Xbox Accessibility Guidelines/objective/save guidance, current official MONOPOLY GO genre research, official Supercell Hero Journey progression, FTC enforcement concerning deceptive game purchase patterns, Apple randomized-purchase disclosure rules and WHO ICD-11 gaming-disorder guidance. These sources inform principles only; they do not license copying another game's proprietary implementation.

## Completion contract
**Completion state:** implementing  
**Completion evidence:** CLC-009 only is verified at `232102f4` / `37555538295`; CLC-007 is in RED on `b202378e`; the 2026-10-07 teleological review expands the release contract to CLC-001..CLC-030 and intentionally invalidates any near-complete interpretation based on the former ten-feature scope.
- [ ] All 30 PRD/todo feature IDs are implemented or explicitly excluded with evidence/rationale.
- [ ] First-session onboarding is playable, optional/replayable and comprehension-tested.
- [ ] Full five-region/twenty-district campaign target is authored and pacing/playtime measured; 20–40h target adjusted from evidence if needed.
- [ ] Rank, permanent airship upgrades, contracts, milestones, collections, achievements/mastery and strategic loadouts produce durable earned progression.
- [ ] Branching routes, weather/modifiers, expeditions, five region finales and post-campaign Sky Charter are implemented and verified.
- [x] Schema-v1 durable guest/account-emulator save is verified; expanded schema migrations remain open and real Firebase remains TASK-003.
- [ ] Professional production art/VFX/motion and audio systems pass rendered quality review; no emoji/crude placeholder art remains.
- [ ] Keyboard/touch/pointer, focus, non-color state, >=44px targets, 320px/200% reflow, reduced motion and challenge/assist behavior have rendered evidence.
- [ ] Economy/progression playtest finds no dead progression, excessive grind wall, punitive absence or hidden difficulty manipulation.
- [ ] PRD/todo/TRACKER/spec/GAME_INDEX agree on final shipped state.
- [ ] Full exact-revision repository validation and Pages deployment/deployed smoke are green for completed game.

Only after every applicable gate is evidenced may Completion state become verified.
