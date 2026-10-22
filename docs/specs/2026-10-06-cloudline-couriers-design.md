# Cloudline Couriers design

**Status:** Implementing — expanded long-form scope  
**Last synchronized:** 2026-10-22  
**Route:** `#/games/cloudline-couriers`

## Product documents
`src/games/cloudline-couriers/PRD.md` is the exhaustive feature/player-journey inventory, `todo.md` is 1:1 execution/sign-off state, and `TRACKER.md` is the live resume point. `GOVERNANCE.md` defines the mandatory structure. Reconcile all whenever behavior, scope or verification changes.

## Purpose and originality boundary
Cloudline Couriers is an original single-player skyway strategy/progression game. The early loop is boost/roll → move → resolve → earn → improve. That loop is only the foundation: release scope includes onboarding, rank, permanent airship progression, a five-region/twenty-district campaign target, contracts, milestone rewards, collections, mastery, specialists, crafting, weather, branching routes, expeditions, region finales, post-campaign charter play, objective clarity, professional reward presentation, audio and explicit challenge/assist options. Names, fiction, geometry, events, economy, art, content and progression remain original.

## Teleological experience contract
The player begins as a modest courier and repeatedly sees evidence that effort changed the world and their capabilities. The first session teaches through play and reaches a meaningful reward/upgrade quickly. Midgame broadens strategic agency through ship/crew/route systems. Campaign progression transforms districts/regions and culminates in authored finale challenges. Post-campaign play preserves earned progress while adding mastery modifiers and personal-best goals. The target first-campaign duration is 20–40 hours, but this remains a tuning hypothesis until playtesting measures it.

Engagement is not impaired control. No paid loot boxes, real-money gambling, deceptive scarcity, forced login streak loss, punitive absence, hidden rubber-banding, disguised costs or monetized frustration. Long-term motivation comes from mastery, visible improvement, strategic choice, collection, discovery, authored content and proportional celebration.

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

Expanded engine design remains deterministic/testable. Content definitions belong outside React. React renders state/actions and never becomes the source of gameplay truth. New campaign systems require schema-versioned persistence/migration and explicit unit/browser evidence.

## Professional presentation contract
CLC-007 is not satisfied merely by rendering SVG elements. Release art must be cohesive, production-quality and stateful: courier airships, landmarks across upgrade stages, stop scenes, weather, cargo, crew, environmental layers, particles/VFX and UI iconography. Emoji-as-game-art, crude primitive SVG stand-ins, generic placeholder icons and visually unfinished assets are prohibited. Motion communicates anticipation, travel, arrival, impact, reward and transformation; significance determines celebration intensity. Reduced-motion users receive equivalent state/consequence clarity.

The first in-engine art tranche provides a coherent illustrated brass/canvas/sky visual family: detailed courier airship, seven event scene families, four landmark identities, cargo pods, atmospheric board treatment, landmark stage pips and responsive/reduced-motion CSS. The 2026-10-22 interaction tranche removes the perpetual courier hover, adds deterministic stop-by-stop perimeter travel including Windgate carry, exposes a user Skip flight action, adds event-specific landing/board feedback, affected-resource pulses, bounded cargo-pod selection and landmark-upgrade feedback, and resolves the same turn immediately for `prefers-reduced-motion`. Motion is implemented with bounded transform/opacity-focused CSS; no infinite Cloudline animation is permitted. This remains an implementing CLC-007 tranche: campaign-region state variants, crew/weather/VFX breadth, milestone celebration tiers and rendered production-quality review remain required.

Audio is a release system, not optional polish: original/license-safe music and SFX support actions and milestones, with independent controls and no audio-only critical information.

## Accessibility/responsiveness
Complete gameplay remains equivalent across phone/tablet/laptop/desktop/large displays, 320 CSS px, 200% text, keyboard/touch/pointer and reduced-motion. Important controls use >=44 CSS-pixel baseline; state is not color-only; objectives/rewards/risks remain readable; no drag/timing-only requirement is permitted. Player-controlled challenge/assist settings are explicit and may not hide rubber-banding.

The 2026-10-22 browser contract checks no horizontal overflow at 390/1024/1440 CSS px, captures screenshots at those widths when the test runs, confirms visible stepwise flight rather than teleporting, verifies a dedicated upgrade-feedback state, and verifies reduced-motion turn resolution without a traveling courier element. The connected external Playwright browser service returned a provider-side 404 during pre-integration screenshot review, so independent human visual critique remains unverified until that service or an equivalent rendered review path is available.

## Persistence evidence
Workflow `37554746482` is CLC-009 RED evidence. Revision `232102f4` / workflow `37555538295` is schema-v1 GREEN: decoder unit coverage, guest reload, Auth/Firestore emulator cross-browser restoration/reset, design-browser checks, builds and Pages deployment succeeded. Real configured Firebase remains external TASK-003. Expanded systems must migrate this schema without silently discarding earned state.

## Validation evidence and current CI edge
The CLC-007 illustrated integration reached repository CI but its first run exposed an account-persistence browser script that still assumed the destructive reset action was always visible. Revision `fab7e07a` corrected the test to open the disclosed Route options first. Workflow `37666102825` then stopped earlier at `pnpm game:check`, not at browser persistence: governance correctly reported that a Cloudline implementation/test change must update both this authoritative spec and `TRACKER.md` in the same integration. That synchronization closed the governance failure but did not itself prove CLC-007 production completion.

On 2026-10-08 the repository's latest-stable dependency refresh reached the Cloudline rendered regression twice in workflow `37857535143` and reproduced the same deterministic failure: the test awaited the shared shell H1 `Cloudline Couriers`, which exists before the lazy Cloudline workspace, then counted workspace sprites before `#cl-title` had mounted. Repository inspection also showed that its exact-one `airship` selector was unscoped even though the decorative hero and active courier intentionally share `AirshipSprite`. Revision `c7f7098b` repaired those two evidence selectors without changing Cloudline game behavior.

The next dependency-refresh run `37858522731` then reached the same regression and exposed one additional descendant-selector defect: `.cl-tile [data-cl-sprite]` correctly saw the 16 tile sprites plus the active courier airship nested inside its current tile, returning 17. Revision `6d1a356d` scopes tile identities to direct child `data-cl-sprite^="tile-"` markers and landmark identities to `data-cl-sprite^="landmark-"`, preserving exact 16/4 authored-identity requirements while excluding unrelated nested sprites.

Fresh dependency-maintenance workflow `37859097164` subsequently passed the complete repository validation chain, including the corrected Cloudline rendered regression, and committed current exact stable dependencies at `853c87b0`. The selector/test edge is therefore closed. This is evidence-selector correctness, not a new CLC-007 completion claim: later campaign-quality art/VFX/state breadth and the expanded long-form systems remain open regardless.

On 2026-10-22 owner playtesting identified a first-session usability failure: the purpose and controls were not understandable, landing copy was generic, and the perpetual courier animation degraded presentation. This maps to existing CLC-007, CLC-011 and CLC-026 scope rather than creating a new feature. The test-first acceptance contract requires a direct first-screen purpose statement, visible current job, replayable `How to play` disclosure, bounded non-infinite courier motion, an observable user-triggered flight state, and consequence-specific landing feedback.

Dependency-maintenance run `39822058558` applied the researched current dependency targets in its isolated runner and passed exact/latest dependency checks, design lint, TypeScript and game-document checks before executing unit tests. It recorded the intended Cloudline RED cleanly: 149 existing tests passed and only `describes a delivery result instead of reporting a generic resolution` failed because production returned `Sunspoke Market resolved.` instead of `Delivered at Sunspoke Market. +45 credits.`.

Revision `d7995308` implemented the first clarity/motion tranche. Dependency-maintenance run `39862639992` applied the researched 2026-10-22 dependency targets in isolation, then passed design lint, TypeScript, game-document checks, all 151 unit tests, Firestore rules, account browser checks and the Cloudline browser regression. Cloudline specifically passed first-screen purpose/help, stepwise bounded flight, event/upgrade feedback, 390/1024/1440 reflow, reduced motion and guest reload persistence. The aggregate chain then reached the separate Cascade Vault CV-004 RED and timed out waiting for `.cv`; no Cloudline failure occurred. The dependency refresh therefore remained uncommitted because the maintenance workflow correctly requires the complete repository suite.

Post-GREEN inspection found one reduced-motion-only state-lifecycle defect: normal-motion decorative feedback clears from `animationend`, but with animation disabled the hidden `.cl-effect` and landmark-upgrade marker can remain mounted after a synchronous reduced-motion action. A focused browser regression is now staged to require zero retained animation-only landing effect and no retained `data-upgraded=true` marker under reduced motion. Production is intentionally unchanged until that RED is observed.

Repository `package.json` still contains the prior exact pins because the maintenance workflow may commit dependency/lockfile changes only after the complete validation suite passes. `.tasks/dependency-refresh-request.json` and `docs/DEPENDENCY_POLICY.md` record the 2026-10-22 researched targets. The Cloudline browser check remains ordered before the separately opened Cascade Vault CV-004 browser RED so Cloudline can produce independent evidence without removing or weakening Cascade coverage.

## Development quality tooling
Current repository gates already cover exact/latest dependency versions, TypeScript compilation, game documentation synchronization, Vitest unit tests, Firestore rules, Playwright browser/design regressions and both Firebase/Pages builds. A 2026-10-07 tooling review identified two non-duplicative gaps worth evaluating before broad progression implementation: static typed linting and unit-test coverage measurement. Official/current candidates are ESLint flat config with `@eslint/js` and `typescript-eslint` for typed linting, official `eslint-plugin-react-hooks`, Vite-oriented React Refresh linting, and `@vitest/coverage-v8` matching the installed Vitest major. Playwright itself already supplies ARIA snapshots and visual comparisons, so a separate browser snapshot/a11y assertion dependency is not justified solely to duplicate those capabilities. Any added package must remain an exact pin and pass `dependency:current` at the revision where it is introduced.

## Research basis
Authoritative sources reviewed 2026-10-07 include Apple game/onboarding/feedback guidance and Game Center, Google Play Games achievements, Microsoft achievement/accessibility guidance, FTC enforcement on deceptive game purchase patterns and WHO gaming-disorder guidance. Google explicitly recommends achievements spread across the lifetime of a game and incremental progress that is measurable and visible; Microsoft describes achievements as a way to direct/reward in-game actions and extend a game's lifetime. These principles inform CLC-016/018 and do not license copying proprietary implementations.

Motion-specific sources rechecked 2026-10-22: Apple HIG Motion requires purposeful, brief, precise and cancellable feedback motion and warns against sustained oscillation; MDN performance guidance recommends minimizing unnecessary animation and favoring compositor-friendly `transform`/`opacity`; W3C WCAG 2.2 SC 2.3.3/Technique C39 support suppressing interaction-triggered nonessential motion through `prefers-reduced-motion`.

## Completion contract
**Completion state:** implementing  
**Completion evidence:** CLC-009 remains verified at `232102f4` / `37555538295`; the prior vector presentation baseline passed full repository validation in `37859097164`; the 2026-10-22 clarity/motion RED is observed in `39822058558`; revision `d7995308` then passed all Cloudline-targeted unit/browser gates inside maintenance run `39862639992` before the independent Cascade Vault RED stopped the aggregate chain. The reduced-motion stale-animation-state regression is staged RED and is not yet a GREEN claim. The expanded release contract remains CLC-001..CLC-030.
- [ ] All 30 PRD/todo feature IDs are implemented or explicitly excluded with evidence/rationale.
- [ ] First-session onboarding is playable, optional/replayable and comprehension-tested.
- [ ] Full five-region/twenty-district campaign target is authored and pacing/playtime measured; 20–40h target adjusted from evidence if needed.
- [ ] Rank, permanent airship upgrades, contracts, milestones, collections, achievements/mastery and strategic loadouts produce durable earned progression.
- [ ] Branching routes, weather/modifiers, expeditions, five region finales and post-campaign Sky Charter are implemented and verified.
- [x] Schema-v1 durable guest/account-emulator save is verified; expanded schema migrations remain open and real Firebase remains TASK-003.
- [ ] Professional production art/VFX/motion and audio systems pass rendered quality review; no emoji/crude placeholder art remains.
- [ ] Keyboard/touch/pointer, focus, non-color state, >=44px targets, 320px/200% reflow, reduced motion and challenge/assist behavior have rendered evidence for the completed expanded game.
- [ ] Economy/progression playtest finds no dead progression, excessive grind wall, punitive absence or hidden difficulty manipulation.
- [ ] PRD/todo/TRACKER/spec/GAME_INDEX agree on final shipped state.
- [ ] Full exact-revision repository validation and Pages deployment/deployed smoke are green for the completed expanded game.

Only after every applicable gate is evidenced may Completion state become verified.
