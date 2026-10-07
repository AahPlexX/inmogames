# PRD: Cloudline Couriers (`cloudline-couriers`)

**Last synchronized:** 2026-10-07  
**Status:** Implementing — scope deliberately reopened/expanded after teleological player-experience review  
**Authoritative design:** `docs/specs/2026-10-06-cloudline-couriers-design.md`  
**Execution checklist:** `src/games/cloudline-couriers/todo.md`  
**Tracker:** `src/games/cloudline-couriers/TRACKER.md`

## Product thesis

Cloudline Couriers must feel like a complete game a player can live with for weeks, not a board-loop demo. The player fantasy is: **start as a small courier, learn the skyways, earn every improvement through play, visibly rebuild the world, master harder routes, complete a substantial campaign, then continue into mastery/endgame play without losing earned progress.**

The design target is compelling long-term engagement through competence, agency, visible progress, collection, strategic choice, discovery and satisfying feedback. It explicitly rejects manipulative compulsion: no paid loot boxes, real-money gambling, deceptive scarcity, forced login streak loss, punitive absence mechanics, disguised costs, purchase pressure, or progression that exists primarily to create frustration.

## Teleological player journey

These are **design/tuning targets, not verified playtime claims**. They must be measured and adjusted through playtesting.

| Player horizon | Intended experience | Required payoff |
| --- | --- | --- |
| First 90 seconds | Start playing immediately; learn by rolling/flying rather than reading a wall of instructions. | First successful delivery, clear reward, obvious next action. |
| First 5–10 minutes | Understand roll → move → event → earn → improve; encounter at least one meaningful choice. | First upgrade and first contract/milestone progress. |
| First 20–30 minutes | Feel ownership of the district and understand streak/shield/fuel strategy. | First major landmark transformation or district completion target in sight. |
| 1–3 hours | Move beyond tutorial systems into rank, ship upgrades, specialists, contracts and collections. | Player can point to permanent improvements earned through play. |
| 5–15 hours | Campaign opens into distinct regions, route modifiers, branching paths and mastery goals. | Strategy/loadout identity emerges; earlier districts feel meaningfully mastered. |
| 20–40 hour target campaign | Complete five-region/twenty-district authored campaign, subject to playtest tuning. | Region finales, major world transformation, campaign culmination and Sky Charter unlock. |
| Post-campaign | Continue because play itself remains interesting, not because progress is held hostage. | New-Game-Plus/charter modifiers, mastery tiers, collections, achievements and personal-best goals. |

## Research basis — authoritative sources reviewed 2026-10-07

- Apple Human Interface Guidelines — Designing for games: jump into gameplay, teach through play, support default interactions and accessibility personalization. https://developer.apple.com/design/human-interface-guidelines/designing-for-games
- Apple HIG — Onboarding: interactive, fast, optional/replayable onboarding. https://developer.apple.com/design/human-interface-guidelines/onboarding
- Apple HIG — Game controls and Feedback: intuitive controls, >=44pt frequent touch controls, visible/tactile feedback, clear consequence/status communication. https://developer.apple.com/design/human-interface-guidelines/game-controls and https://developer.apple.com/design/human-interface-guidelines/feedback
- Apple Game Center: achievements motivate and track progress; leaderboards/challenges support replayability and friendly competition. https://developer.apple.com/game-center/
- Google Play Games Services — Achievements: milestone/challenge rewards support personal progression beyond competitive leaderboards. https://developer.android.com/games/pgs/achievements
- Android quality guidance: high-quality games use differentiated visual identity and integrate animation, art, audio, story and controls into an immersive experience. https://developer.android.com/quality/user-experience
- Microsoft Xbox Accessibility Guidelines 108/109 and accessibility metadata: player-selectable difficulty, objective clarity/progress review, and robust progress saving reduce unnecessary barriers and loss of work. https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/108 ; https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/109 ; https://learn.microsoft.com/en-us/gaming/game-publishing/concepts/metadata-accessibility
- MONOPOLY GO official product/news: contemporary long-form board-loop games layer world/board progression, collections, minigames, events and rewards over the core movement loop. This is genre research only; Cloudline must not copy proprietary content or trade dress. https://www.monopolygo.com/
- Supercell Clash of Clans official Hero Journey: cumulative upgrades can feed a visible long-term reward track with resources, equipment and cosmetics. https://support.supercell.com/clash-of-clans/en/articles/about-heroes-pets-9.html
- FTC enforcement on Epic/HoYoverse and Apple loot-box rules: deceptive purchase flows and obscured randomized-purchase odds create material consumer-protection risk. Cloudline therefore keeps its engagement/progression non-predatory. https://www.ftc.gov/news-events/news/press-releases/2024/12/ftc-sends-refund-payments-consumers-impacted-epic-games-unlawful-billing-practices ; https://www.ftc.gov/news-events/news/press-releases/2025/01/genshin-impact-game-developer-will-be-banned-selling-lootboxes-teens-under-16-without-parental ; https://developer.apple.com/app-store/review/guidelines/
- WHO ICD-11 gaming-disorder guidance recognizes impaired control and gaming taking precedence over daily activities as potential harm. The product goal is sustained enjoyment, not impaired control. https://www.who.int/standards/classifications/frequently-asked-questions/gaming-disorder

```yaml
Planned Functional Features Specification:
  game_identity:
    name: "Cloudline Couriers"
    slug: "cloudline-couriers"
    development_status: "Implementing"

  technical_foundation:
    architecture_and_engine: "Original long-form single-player skyway strategy/progression game in static React/Vite. Pure deterministic TypeScript rules engine; React presentation; shared versioned save platform; professional repository-owned visual/audio assets. Genre-level roll/move/event/earn/upgrade/progress inspiration only; no copied Monopoly/Monopoly GO names, art, board, economy, maps, events, UI, text, trade dress or proprietary content."
    dependencies_used:
      - "react@19.3.0"
      - "react-dom@19.3.0"
      - "firebase@12.19.0 (shared optional account/save platform only)"
      - "vite@8.3.3 (build/dev)"
      - "typescript@7.0.2 (development/type safety)"
      - "vitest@5.0.3 (unit verification)"
      - "playwright@1.63.0 (rendered browser verification)"

  core_feature_specifications:
    - name: "Flight Turn and Skyway Board"
      id: "CLC-001"
      details: "Choose boost, roll, animate travel, resolve destination, communicate consequence and expose the next meaningful action. The base 16-stop loop remains the early-game foundation and later supports unlocked route branches."
      feature_development_status: "Base implementation present; expanded campaign/browser verification pending"
    - name: "Original Stop and Event Matrix"
      id: "CLC-002"
      details: "Market, Workshop, Beacon, Storm, Windgate, Dispatch Dock and Cargo Cache each have readable risk/reward identities; later districts add authored variants/modifiers without proprietary imitation."
      feature_development_status: "Base seven-event engine implemented; campaign variants and complete matrix verification pending"
    - name: "Credits, Fuel, and Boost Economy"
      id: "CLC-003"
      details: "Credits fund progression; fuel constrains boost intensity; rewards/costs scale transparently; emergency reserve prevents dead saves. Economy tuning must reward sustained play without grind walls or purchase pressure."
      feature_development_status: "Base economy implemented; long-form balance/tuning pending"
    - name: "Landmark Upgrade Loop"
      id: "CLC-004"
      details: "Four landmarks per district visibly transform through four stages. Earned credits produce immediate visual world improvement; district completion changes the environment and advances the campaign."
      feature_development_status: "Base engine/UI/persistence implemented; production art and campaign scale pending"
    - name: "Cargo Cache Choice Encounters"
      id: "CLC-005"
      details: "Short deterministic three-choice encounters create agency and anticipation with readable outcomes; no paid/randomized monetization. Later regions can introduce new authored cache tables and trade-offs."
      feature_development_status: "Base encounter implemented; depth/presentation verification pending"
    - name: "Delivery Streak, Shields, and Route Momentum"
      id: "CLC-006"
      details: "Deliveries build momentum; Beacons protect it; Storms create bounded setbacks; skilled planning preserves value. Streaks reward active play but never punish time away from the game."
      feature_development_status: "Base engine implemented; expanded strategy/tuning pending"
    - name: "Professional Art, Sprite, VFX, and Motion System"
      id: "CLC-007"
      details: "Professional-quality cohesive airships, landmarks, stop scenes, weather, cargo, characters/crew, environmental layers, particles/VFX and UI iconography. Assets must have production-level silhouette, depth, material, lighting and state variation; emoji, crude primitive SVGs and placeholder-grade art are prohibited. Motion includes anticipation, travel, arrival, impact, reward, upgrade transformation and milestone celebration with reduced-motion equivalents."
      feature_development_status: "TDD RED visual regression integrated; production art system pending"
    - name: "Responsive, Accessible, Device-Agnostic Play Surface"
      id: "CLC-008"
      details: "Equivalent complete play across phone/tablet/laptop/desktop/large displays, keyboard/touch/pointer, zoom and reduced-motion. Important targets >=44 CSS px, clear focus/non-color state, no drag-only action, objective clarity and accessible feedback."
      feature_development_status: "Base surface implemented; complete rendered evidence pending"
    - name: "Durable Career Save and Recovery"
      id: "CLC-009"
      details: "Schema-v1 deterministic career persistence, guest/account restoration, game-scoped reset and corruption rejection. Future campaign systems require versioned migration rather than save loss."
      feature_development_status: "Verified in revision 232102f4 / workflow 37555538295; live Firebase externally blocked by TASK-003"
    - name: "Catalog, Governance, Verification, and Release Integration"
      id: "CLC-010"
      details: "First-class catalog/lazy route, synchronized PRD/todo/spec/tracker, exact dependency policy, automated unit/browser/design checks, deployment and deployed smoke evidence before Complete."
      feature_development_status: "Base integration present; final expanded-game evidence pending"
    - name: "Playable Onboarding and First-Session Journey"
      id: "CLC-011"
      details: "Teach by doing. First roll, event, reward, upgrade and contract are introduced contextually; help is replayable and guidance can be skipped. Avoid front-loaded instruction walls."
      feature_development_status: "Planned"
    - name: "Courier Rank and Experience Progression"
      id: "CLC-012"
      details: "Meaningful completed play grants transparent career XP. Ranks unlock mechanics, cosmetics, titles and options at a paced cadence; rank never exists solely as an arbitrary grind gate."
      feature_development_status: "Planned"
    - name: "Airship Permanent Upgrade Tree"
      id: "CLC-013"
      details: "Earn permanent ship improvements through play: fuel capacity, cargo efficiency, storm resilience, boost control and utility branches with capped legible effects and visible ship-state changes."
      feature_development_status: "Planned"
    - name: "Long-Form Region and District Campaign"
      id: "CLC-014"
      details: "Target five authored regions and twenty districts. Every district needs distinct art direction, landmark set, stop/event mix, environmental modifier and completion objective. Target 20–40 hours for first campaign completion, explicitly subject to instrumented playtest tuning rather than assumed duration."
      feature_development_status: "Planned"
    - name: "Route Contracts and Optional Objectives"
      id: "CLC-015"
      details: "Short/medium contracts create concrete goals—deliveries, efficient fuel use, safe storms, cache recovery, landmark work and region-specific challenges. Contracts are optional, refresh without punishing absence, and clearly preview requirements/rewards."
      feature_development_status: "Planned"
    - name: "Career Milestone Reward Track"
      id: "CLC-016"
      details: "Lifetime accomplishments fill a non-expiring reward path. Milestones award earned credits, fuel-capacity tokens, cosmetics, blueprints and collection items so cumulative effort remains visible and valuable."
      feature_development_status: "Planned"
    - name: "Courier Logbook and Collectible Discovery"
      id: "CLC-017"
      details: "District discoveries, cargo curios, postcards and lore form inspectable sets with deterministic acquisition paths, duplicate protection where applicable, completion rewards and world-building context."
      feature_development_status: "Planned"
    - name: "Achievements and Mastery Goals"
      id: "CLC-018"
      details: "Layered one-time and repeatable goals reward experimentation, efficiency, recovery, collection and high-skill route play. Progress and exact requirements are always visible."
      feature_development_status: "Planned"
    - name: "Crew Specialists and Strategic Loadouts"
      id: "CLC-019"
      details: "Unlock specialists through campaign/mastery play. Equip a deliberately limited pre-route loadout of transparent passive trade-offs so players can build strategies without a single mandatory meta or paid advantage."
      feature_development_status: "Planned"
    - name: "Workshop Blueprints and Crafted Improvements"
      id: "CLC-020"
      details: "Defined gameplay goals award blueprint/material progress. Workshops craft permanent or loadout improvements using explicit recipes; avoid opaque multi-currency conversion chains."
      feature_development_status: "Planned"
    - name: "Weather Fronts and District Modifiers"
      id: "CLC-021"
      details: "Forecasted weather changes route conditions in understandable ways. Players can prepare using shields, specialists, upgrades and boost choices; no hidden difficulty manipulation."
      feature_development_status: "Planned"
    - name: "Branching Skyways and Unlockable Route Decisions"
      id: "CLC-022"
      details: "Later districts unlock optional junctions/alternate lanes, destination previews and route trade-offs so navigation gains strategic depth beyond the introductory loop while remaining deterministic/testable."
      feature_development_status: "Planned"
    - name: "Risk-Reward Expeditions"
      id: "CLC-023"
      details: "Optional multi-leg expeditions add escalating disclosed modifiers and stronger earned rewards. Players can bank progress at defined safe harbors and never risk permanent career progression."
      feature_development_status: "Planned"
    - name: "Region Finale Challenges"
      id: "CLC-024"
      details: "Each region culminates in a bespoke multi-step courier challenge combining learned mechanics, checkpoints, clear objectives and a major celebratory world transformation."
      feature_development_status: "Planned"
    - name: "Post-Campaign Sky Charter / New-Game-Plus"
      id: "CLC-025"
      details: "Campaign completion unlocks replayable higher-complexity charter routes with selectable modifiers, mastery tiers, personal-best scoring and cosmetic prestige while retaining permanent earned progression."
      feature_development_status: "Planned"
    - name: "Session Goals, Objective Clarity, and Return Resume"
      id: "CLC-026"
      details: "At all times the player can answer: what am I doing, why, what will I earn, and what can I do next? Returning players get a concise recap of district, contract, upgrades and next recommended actions."
      feature_development_status: "Planned"
    - name: "Reward Presentation and Celebration Cadence"
      id: "CLC-027"
      details: "Feedback scales with significance: routine rewards resolve quickly; streaks/upgrades receive stronger response; landmark/rank/district/region milestones get premium celebration. Animations can be accelerated/skipped and reduced-motion has equivalent clarity."
      feature_development_status: "Planned"
    - name: "Audio, Music, and Multimodal Feedback"
      id: "CLC-028"
      details: "Original or license-safe music/SFX support roll, flight, landing, hazards, cargo, upgrades and milestones. Independent music/SFX mute/volume controls; no essential gameplay information is audio-only."
      feature_development_status: "Planned"
    - name: "Player-Controlled Challenge and Assist Options"
      id: "CLC-029"
      details: "Explicit challenge/assist settings and disclosed modifiers let players tune barriers without hidden rubber-banding. Core campaign remains completable across supported settings."
      feature_development_status: "Planned"
    - name: "Ethical Engagement and Economy Guardrails"
      id: "CLC-030"
      details: "No paid loot boxes, real-money gambling, deceptive scarcity, forced streak loss, punitive absence, disguised costs, one-click accidental purchases, or progression pressure engineered around spending. Long-term engagement must come from mastery, progress, collection, discovery and fun."
      feature_development_status: "Planned; binding product constraint"

  quality_and_completion_contract:
    originality_boundary: "Genre-level inspiration only. Do not copy Monopoly GO or Monopoly trademarks, character/property names, board geometry, art, sound, event names, currency presentation, UI/trade dress, text, map structure or proprietary event/minigame implementation."
    dependency_policy: "All direct dependencies/devDependencies exact pinned stable versions; no ^ or ~. At dependency-changing integration time verify authoritative project sources plus npmjs.com and require repository dependency checks."
    documentation_policy: "PRD/todo/TRACKER/spec/GAME_INDEX remain synchronized and sufficient for a new provider to resume without chat history. Every CLC feature ID has a matching todo execution section."
    art_quality_policy: "No emoji-as-game-art, crude primitive SVG stand-ins, generic icon-only world art or placeholder-grade production assets. Visual acceptance requires rendered review at gameplay scale and state variation."
    engagement_policy: "Optimize for voluntary long-term enjoyment, competence, agency, collection and earned progression—not impaired control, dark patterns or monetized frustration."
    complete_definition: "Complete only after the expanded 30-feature contract is implemented or explicitly excluded with rationale, campaign/content targets are playtested, every applicable todo gate is evidenced, exact-revision validation is green, Pages deployment succeeds and deployed route smoke/accessibility/responsive checks pass."
```

## Long-form progression model

1. **Turn loop:** boost → roll → travel → land → event → feedback.
2. **Session loop:** complete deliveries/contracts → manage fuel/shields → make cache/route choices → upgrade something visible.
3. **District loop:** improve four landmarks → master district modifier → complete district objective → transform district.
4. **Region loop:** develop ship/crew/loadout → complete several distinct districts → region finale → unlock next region/system.
5. **Campaign loop:** progress through five regions/twenty districts → complete major collection/mastery arcs → unlock Sky Charter.
6. **Endgame loop:** replay charter routes with chosen modifiers → improve mastery/personal bests → finish collections/achievements/cosmetics without deleting earned career progress.

## Reward philosophy

Every major reward must answer **what did the player do to earn this?** Permanent progress is favored over disposable noise. A healthy reward mix includes functional upgrades, visible world transformation, new strategic options, collection completion, cosmetics/titles, access to new authored content and mastery recognition. Randomness may create variety, but critical progression must have deterministic/guaranteed paths and must never be sold as a randomized purchase.

## Continuation rule

Any provider resuming this game begins with this PRD, `todo.md`, `TRACKER.md` and the authoritative design spec. Do not collapse this expanded scope back into the original ten-feature prototype. Any scope/implementation/verification/dependency/completion change must reconcile those documents in the same development cycle. Never infer completion from chat history; exact evidence belongs in-repo.
