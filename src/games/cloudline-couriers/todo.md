# TODO: Cloudline Couriers (cloudline-couriers)

**Status:** Implementing — expanded long-form game scope  
**Last synchronized:** 2026-10-07  
**Architecture & Engine:** Deterministic TypeScript rules + React presentation + shared versioned save platform. The target is now a five-region/twenty-district long-form campaign plus post-campaign mastery, not a ten-feature board-loop prototype.  
**Dependencies Used:** exact repository pins only; no game-local dependency is approved merely because it would speed implementation.

## Core Feature Execution Pipeline

> Every feature below maps 1:1 to the same ID in `PRD.md`. A feature is not Complete because source exists; verification and player-facing acceptance evidence must also be checked.

### CLC-001 — Flight Turn and Skyway Board
**Purpose:** Make every turn readable, tactile and satisfying.  
**Inputs:** boost, RNG, position, route options.  
**Dependencies Touched:** engine/workspace/tests.  
**Technical Notes & Edge Cases:** circuit crossing, route wrap, later junctions, no dead fuel state.  
**Implementation Details:** base 16-stop loop exists; later-route architecture remains open.  
**Verification & State Sign-off:** [x] base engine; [ ] complete browser loop; [ ] branch-ready design.

### CLC-002 — Original Stop and Event Matrix
**Purpose:** Make landings strategically distinct.  
**Inputs:** stop type, district variant, player state.  
**Dependencies Touched:** engine/content/UI/tests.  
**Technical Notes & Edge Cases:** explicit bounded outcomes; no proprietary imitation.  
**Implementation Details:** seven base families exist.  
**Verification & State Sign-off:** [x] base families; [ ] district variants; [ ] complete event matrix.

### CLC-003 — Credits, Fuel, and Boost Economy
**Purpose:** Reward effort and strategic spending without grind walls.  
**Inputs:** credits/fuel/boost/progression tier.  
**Dependencies Touched:** engine/tuning/tests.  
**Technical Notes & Edge Cases:** transparent scaling, emergency reserve, no purchase pressure.  
**Implementation Details:** base economy exists.  
**Verification & State Sign-off:** [x] base logic; [ ] long-form economy model; [ ] playtest balance evidence.

### CLC-004 — Landmark Upgrade Loop
**Purpose:** Turn earned resources into visible world improvement.  
**Inputs:** credits, district, landmark stage.  
**Dependencies Touched:** engine/UI/art/save.  
**Technical Notes & Edge Cases:** four landmarks × four stages per district; every stage needs visible transformation.  
**Implementation Details:** base progression persists.  
**Verification & State Sign-off:** [x] base logic/save; [ ] production transformations; [ ] campaign-scale data.

### CLC-005 — Cargo Cache Choice Encounters
**Purpose:** Break repetition with short agency-rich decisions.  
**Inputs:** seeded encounter table/choice.  
**Dependencies Touched:** engine/UI/save/content.  
**Technical Notes & Edge Cases:** deterministic, accessible, no paid randomness.  
**Implementation Details:** base three-choice cache exists.  
**Verification & State Sign-off:** [x] base implementation; [ ] region tables; [ ] focus/presentation evidence.

### CLC-006 — Delivery Streak, Shields, and Route Momentum
**Purpose:** Reward skillful momentum without punishing absence.  
**Inputs:** deliveries/shield/weather.  
**Dependencies Touched:** engine/HUD/save.  
**Technical Notes & Edge Cases:** bounded loss/recovery; no calendar streak.  
**Implementation Details:** base streak/shield logic exists.  
**Verification & State Sign-off:** [x] base implementation; [ ] expanded tuning; [ ] edge/browser evidence.

### CLC-007 — Professional Art, Sprite, VFX, and Motion System
**Purpose:** Deliver production-quality game presentation.  
**Inputs:** courier/tile/landmark/weather/reward/game state.  
**Dependencies Touched:** art components/assets/CSS/browser tests.  
**Technical Notes & Edge Cases:** prohibit emoji and placeholder-grade/crude primitive SVG art; layered stateful visuals; reduced-motion equivalents.  
**Implementation Details:** RED regression exists; production asset system not yet implemented.  
**Verification & State Sign-off:** [x] RED test authored; [ ] confirm intended RED; [ ] art bible; [ ] production asset bank; [ ] VFX/motion; [ ] rendered quality review; [ ] reduced-motion evidence.

### CLC-008 — Responsive, Accessible, Device-Agnostic Play Surface
**Purpose:** Preserve complete play quality on every supported form factor/input.  
**Inputs:** viewport/zoom/input/accessibility preferences.  
**Dependencies Touched:** React/CSS/browser tests.  
**Technical Notes & Edge Cases:** >=44px important targets, 320px, 200% text, focus, non-color state, no drag-only/timing dependency.  
**Implementation Details:** base responsive surface exists.  
**Verification & State Sign-off:** [x] base surface; [ ] full device matrix; [ ] keyboard/touch/pointer; [ ] zoom/reduced motion.

### CLC-009 — Durable Career Save and Recovery
**Purpose:** Preserve earned career progress safely.  
**Inputs:** complete deterministic career state.  
**Dependencies Touched:** shared save platform/tests.  
**Technical Notes & Edge Cases:** migrations required as expanded systems land; corruption must not silently destroy progress.  
**Implementation Details:** schema-v1 verified in `232102f4` / `37555538295`.  
**Verification & State Sign-off:** [x] v1 guest/account emulator; [ ] migration coverage for expanded schema; [ ] live Firebase TASK-003.

### CLC-010 — Catalog, Governance, Verification, and Release Integration
**Purpose:** Ship as a maintainable first-class game.  
**Inputs:** docs/catalog/CI/deploy.  
**Dependencies Touched:** repository shared surfaces.  
**Technical Notes & Edge Cases:** PRD/todo/spec/tracker must remain synchronized.  
**Implementation Details:** base integration exists.  
**Verification & State Sign-off:** [x] base routing/docs; [ ] final expanded-game exact-revision validation/deploy/smoke.

### CLC-011 — Playable Onboarding and First-Session Journey
**Purpose:** Teach through play and produce a meaningful first win quickly.  
**Inputs:** first-run state/tutorial progress.  
**Dependencies Touched:** engine/UI/save/help/tests.  
**Technical Notes & Edge Cases:** optional/replayable; no instruction wall.  
**Implementation Details:** planned guided first roll → event → reward → upgrade → contract.  
**Verification & State Sign-off:** [ ] implement; [ ] skip/replay; [ ] first-session browser test; [ ] playtest comprehension.

### CLC-012 — Courier Rank and Experience Progression
**Purpose:** Make cumulative effort permanently legible.  
**Inputs:** completed gameplay actions/XP/rank.  
**Dependencies Touched:** engine/save/HUD/content.  
**Technical Notes & Edge Cases:** transparent XP; no arbitrary grind-only gates.  
**Implementation Details:** planned.  
**Verification & State Sign-off:** [ ] rank curve; [ ] unlock table; [ ] persistence; [ ] progression tests.

### CLC-013 — Airship Permanent Upgrade Tree
**Purpose:** Let the player feel their vehicle becoming more capable.  
**Inputs:** earned upgrade currency/blueprints/branch choices.  
**Dependencies Touched:** engine/save/art/UI.  
**Technical Notes & Edge Cases:** capped effects; no mandatory single build; visible ship changes.  
**Implementation Details:** planned.  
**Verification & State Sign-off:** [ ] tree; [ ] respec policy; [ ] visual states; [ ] balance tests.

### CLC-014 — Long-Form Region and District Campaign
**Purpose:** Provide a genuinely full-length authored game.  
**Inputs:** region/district progression/content definitions.  
**Dependencies Touched:** content/engine/art/save/navigation.  
**Technical Notes & Edge Cases:** target 5 regions/20 districts and 20–40h first campaign, subject to playtest validation.  
**Implementation Details:** planned content architecture and authored district matrix.  
**Verification & State Sign-off:** [ ] content schema; [ ] 20 districts; [ ] 5 region identities; [ ] progression pacing; [ ] playtime telemetry/playtest evidence.

### CLC-015 — Route Contracts and Optional Objectives
**Purpose:** Give every session clear goals beyond rolling.  
**Inputs:** career state/contract pool/progress.  
**Dependencies Touched:** engine/content/save/HUD.  
**Technical Notes & Edge Cases:** preview requirements/rewards; no punishment for missed/expired contracts.  
**Implementation Details:** planned.  
**Verification & State Sign-off:** [ ] contract generator; [ ] variety rules; [ ] persistence; [ ] objective clarity tests.

### CLC-016 — Career Milestone Reward Track
**Purpose:** Convert lifetime effort into visible non-expiring progress.  
**Inputs:** cumulative career counters.  
**Dependencies Touched:** engine/save/UI/content.  
**Technical Notes & Edge Cases:** guaranteed earned rewards; no paid skips.  
**Implementation Details:** planned.  
**Verification & State Sign-off:** [ ] milestone table; [ ] claim flow; [ ] persistence/idempotency; [ ] celebration.

### CLC-017 — Courier Logbook and Collectible Discovery
**Purpose:** Add discovery, completion goals and world texture.  
**Inputs:** district discoveries/curios/postcards/lore.  
**Dependencies Touched:** content/save/UI/art.  
**Technical Notes & Edge Cases:** deterministic completion paths; duplicate protection where needed.  
**Implementation Details:** planned.  
**Verification & State Sign-off:** [ ] collection taxonomy; [ ] acquisition paths; [ ] set rewards; [ ] completion UI.

### CLC-018 — Achievements and Mastery Goals
**Purpose:** Reward experimentation and skill over the entire career.  
**Inputs:** gameplay counters/mastery conditions.  
**Dependencies Touched:** engine/save/UI.  
**Technical Notes & Edge Cases:** visible exact requirements; avoid impossible/contradictory goals.  
**Implementation Details:** planned.  
**Verification & State Sign-off:** [ ] achievement catalog; [ ] incremental progress; [ ] mastery tiers; [ ] persistence/tests.

### CLC-019 — Crew Specialists and Strategic Loadouts
**Purpose:** Create player-authored strategy identities.  
**Inputs:** unlocked crew/loadout slots/route context.  
**Dependencies Touched:** engine/save/UI/art/content.  
**Technical Notes & Edge Cases:** limited slots and explicit trade-offs; no mandatory meta.  
**Implementation Details:** planned.  
**Verification & State Sign-off:** [ ] specialist roster; [ ] loadout UI; [ ] balance matrix; [ ] persistence.

### CLC-020 — Workshop Blueprints and Crafted Improvements
**Purpose:** Give Workshops a long-term progression role.  
**Inputs:** blueprints/materials/recipes.  
**Dependencies Touched:** engine/save/UI/content.  
**Technical Notes & Edge Cases:** explicit recipes; avoid currency-chain bloat.  
**Implementation Details:** planned.  
**Verification & State Sign-off:** [ ] recipe model; [ ] acquisition guarantees; [ ] crafting UI; [ ] economy tests.

### CLC-021 — Weather Fronts and District Modifiers
**Purpose:** Make route planning evolve without hidden difficulty manipulation.  
**Inputs:** forecast/district/modifiers/player preparation.  
**Dependencies Touched:** engine/HUD/art/save.  
**Technical Notes & Edge Cases:** forecast before commitment; accessible non-color cues.  
**Implementation Details:** planned.  
**Verification & State Sign-off:** [ ] weather model; [ ] forecast UI; [ ] modifier matrix; [ ] accessibility tests.

### CLC-022 — Branching Skyways and Unlockable Route Decisions
**Purpose:** Evolve navigation beyond the introductory loop.  
**Inputs:** unlocked junctions/destination preview/player route choice.  
**Dependencies Touched:** engine/board UI/content/save.  
**Technical Notes & Edge Cases:** deterministic/testable route graph; no inaccessible dead branch.  
**Implementation Details:** planned.  
**Verification & State Sign-off:** [ ] route graph; [ ] preview/choice UI; [ ] path tests; [ ] responsive rendering.

### CLC-023 — Risk-Reward Expeditions
**Purpose:** Provide optional high-engagement mastery runs.  
**Inputs:** expedition tier/modifiers/banked progress.  
**Dependencies Touched:** engine/save/UI/content.  
**Technical Notes & Edge Cases:** disclosed risk; safe harbors; never destroy permanent career progress.  
**Implementation Details:** planned.  
**Verification & State Sign-off:** [ ] expedition rules; [ ] banking; [ ] reward curve; [ ] failure/recovery tests.

### CLC-024 — Region Finale Challenges
**Purpose:** Give each major campaign chapter a memorable climax.  
**Inputs:** region mechanics/objectives/checkpoints.  
**Dependencies Touched:** engine/content/art/audio/save.  
**Technical Notes & Edge Cases:** checkpoints and clear objectives; combine learned systems rather than introduce unexplained rules.  
**Implementation Details:** planned.  
**Verification & State Sign-off:** [ ] five finales; [ ] checkpoints; [ ] completion transformations; [ ] browser/playtest evidence.

### CLC-025 — Post-Campaign Sky Charter / New-Game-Plus
**Purpose:** Preserve meaningful play after campaign completion.  
**Inputs:** completed campaign/selectable modifiers/mastery tier.  
**Dependencies Touched:** engine/save/content/UI.  
**Technical Notes & Edge Cases:** retain permanent progression; no forced destructive prestige reset.  
**Implementation Details:** planned.  
**Verification & State Sign-off:** [ ] charter generation; [ ] modifier selection; [ ] mastery scoring; [ ] retention of earned state.

### CLC-026 — Session Goals, Objective Clarity, and Return Resume
**Purpose:** Ensure the player always knows what to do and why.  
**Inputs:** active district/contracts/upgrades/recent history.  
**Dependencies Touched:** HUD/help/save.  
**Technical Notes & Edge Cases:** concise return recap; never require memorizing old session context.  
**Implementation Details:** planned.  
**Verification & State Sign-off:** [ ] objective panel; [ ] resume summary; [ ] next-action hints; [ ] clarity playtest.

### CLC-027 — Reward Presentation and Celebration Cadence
**Purpose:** Make earned progress feel valuable without slowing routine play.  
**Inputs:** reward significance/player motion preference.  
**Dependencies Touched:** UI/art/VFX/audio.  
**Technical Notes & Edge Cases:** proportional celebration; skippable/accelerable; reduced-motion equivalent.  
**Implementation Details:** planned.  
**Verification & State Sign-off:** [ ] reward tiers; [ ] animation/VFX; [ ] skip/reduce; [ ] timing playtest.

### CLC-028 — Audio, Music, and Multimodal Feedback
**Purpose:** Add professional sonic identity and stronger action feedback.  
**Inputs:** gameplay event/music state/settings.  
**Dependencies Touched:** audio assets/runtime/settings/save.  
**Technical Notes & Edge Cases:** license-safe/original; independent controls; no audio-only critical information.  
**Implementation Details:** planned.  
**Verification & State Sign-off:** [ ] audio bible/assets; [ ] mixer/settings; [ ] event mapping; [ ] accessibility/browser evidence.

### CLC-029 — Player-Controlled Challenge and Assist Options
**Purpose:** Let more players find an enjoyable challenge level.  
**Inputs:** explicit player settings.  
**Dependencies Touched:** engine/settings/save/UI.  
**Technical Notes & Edge Cases:** disclose effects; no hidden rubber-banding.  
**Implementation Details:** planned.  
**Verification & State Sign-off:** [ ] presets/modifiers; [ ] persistence; [ ] campaign completion compatibility; [ ] accessibility review.

### CLC-030 — Ethical Engagement and Economy Guardrails
**Purpose:** Keep long-term engagement player-respecting.  
**Inputs:** every progression/reward/monetization-adjacent design decision.  
**Dependencies Touched:** product governance/tests where enforceable.  
**Technical Notes & Edge Cases:** no paid loot boxes, gambling, deceptive scarcity, punitive absence, forced streak loss, disguised costs or purchase pressure.  
**Implementation Details:** binding constraint; no monetization system is currently planned.  
**Verification & State Sign-off:** [ ] audit all systems before release; [ ] document deterministic critical-progression paths; [ ] verify no dark-pattern purchase/absence mechanics.

## Final Game Assembly & Verification Checklist

- [ ] All 30 PRD features are implemented or explicitly excluded with evidence/rationale.
- [ ] Five-region/twenty-district campaign content exists and has pacing/playtime playtest evidence; 20–40h remains a target until measured.
- [ ] A new player can reach first meaningful reward/upgrade through playable onboarding without instruction overload.
- [ ] Long-term progression visibly rewards effort through rank, ship, landmarks, campaign, collections, achievements and mastery.
- [ ] Professional art review confirms no emoji, crude placeholder SVGs or generic stand-ins remain in gameplay presentation.
- [ ] Animation/VFX/audio feedback is proportional, responsive, accessible and reducible/skippable where appropriate.
- [ ] Zero known uncaught game-local console errors/warnings; current applicable MDN/W3C/WCAG requirements pass.
- [ ] Mobile/tablet/laptop/desktop/large-display, 320 CSS px, 200% text, keyboard/touch/pointer and reduced-motion evidence passes.
- [ ] Versioned save migrations preserve expanded career progression; deterministic reload/recovery is verified.
- [ ] Economy/playtest audit finds no dead progression, excessive grind wall, hidden difficulty manipulation or punitive absence mechanic.
- [ ] Exact dependency policy passes; dependency changes require current authoritative-source + npmjs.com verification.
- [ ] PRD/todo/TRACKER/spec/GAME_INDEX are synchronized and sufficient for a new provider to continue without chat history.
- [ ] Full exact-revision validation, Pages deployment and deployed smoke/accessibility checks pass.
- [ ] Overall state becomes Complete/Verified only after every applicable gate has repository evidence.

**Continuation rule:** do not reduce this game back to the original ten-feature prototype. Any new feature, rule, content, persistence behavior, material UI/art/audio change, dependency change, defect or verification evidence updates the matching PRD feature, todo item, tracker and authoritative spec before completion is claimed.
