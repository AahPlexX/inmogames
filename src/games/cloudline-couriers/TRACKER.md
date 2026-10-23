# Cloudline Couriers tracker

**Spec:** `docs/specs/2026-10-06-cloudline-couriers-design.md`  
**Last synchronized:** 2026-10-23

| Capability | Status | Verification |
| --- | --- | --- |
| Teleological long-form player journey | started | PRD expanded 2026-10-07 from 10 prototype-level capabilities to 30 release-level systems; 5-region/20-district and 20–40h campaign are tuning targets requiring playtest evidence |
| Deterministic flight/board/event/economy foundation | started | Revision `d7995308` adds consequence-specific landing copy plus deterministic visible route-step construction including Windgate carry; first-win production revision `8e744317` retains that behavior and run `39960131577` passed all 151 unit tests plus the expanded Cloudline browser contract; expanded route/campaign/economy balance remains open |
| Landmark/district progression | started | Base engine/UI/save plus bounded upgrade feedback passed the Cloudline browser contract in `39960131577`. CLC-004/CLC-007 RED `39961820090` proves current landmark illustrations expose `[0,0,0,0]` authored stage layers versus required `[1,2,3,4]`; the production candidate adds cumulative subject-native structure for all four landmarks while leaving progression/economy/save rules unchanged. GREEN pending. |
| Cargo Cache + streak/shield strategy | started | Base engine/UI/save plus bounded cargo-pod interaction feedback are integrated; region depth/tuning and broader campaign evidence remain pending |
| Long-term rank/airship/campaign progression | planned | CLC-012 through CLC-014 binding; no implementation claim yet |
| Contracts/milestones/collections/mastery | started | CLC-015 starter-contract RED is confirmed in `39959280821`; revision `8e744317` derives the starter objective from the existing four-delivery route-bonus mechanic and the browser contract passed in `39960131577`. Broader contract generation plus CLC-016 through CLC-018 remain planned |
| Crew/blueprints/weather/branching routes | planned | CLC-019 through CLC-022 binding; fixed 16-stop UI coordinates are an intentional introductory-board limit until CLC-022 supplies route-graph coordinates |
| Expeditions/region finales/post-campaign | planned | CLC-023 through CLC-025 binding; no implementation claim yet |
| Objective clarity/reward cadence/audio/challenge options | started | CLC-026 contextual first-session guidance and CLC-027 routine event/cargo/upgrade feedback passed the Cloudline browser contract in `39960131577`; return recap, generalized contracts, milestone tiers, audio and challenge options remain open |
| Ethical engagement guardrails | started | CLC-030 binding: progression derives engagement from mastery/progress/collection/fun; dark-pattern/punitive-absence/paid-random-reward mechanics excluded |
| Professional art/sprite/VFX/motion system | started | Original CLC-007 vector family remains integrated. RED `39822058558` isolated generic consequence copy; revision `d7995308` passed its first Cloudline browser contract in `39862639992`. Reduced-motion RED `39863334636` and fix revision `a26c22f7` closed stale animation-only state in `39863962054`. Run `39960131577` re-verified finite travel/impact/resource/cargo/upgrade effects. Landmark-stage RED `39961820090` now proves the illustrations themselves were stage-invariant apart from pips; the production candidate adds cumulative modular brass/courier infrastructure inside each landmark SVG. Broader campaign-quality VFX/art state breadth remains open. |
| Responsive accessible game surface | started | Run `39960131577` passed no-overflow/rendered checks at 390/1024/1440, stepwise flight, reduced-motion immediate resolution with no stale animation state, and guest reload persistence. 320px/200% text and complete input matrix remain open for the expanded game. |
| Durable guest/account career save | verified | Revision `232102f4`, workflow `37555538295` verified schema-v1; first-win guidance derives entirely from existing run state and adds no save-schema field. Landmark visual-stage work consumes the existing stage values only. Expanded systems require versioned migrations. Live configured Firebase remains TASK-003. |
| Catalog/governance/release integration | started | Canonical docs/routing are synchronized. Researched 2026-10-23 dependency targets passed current-version validation in `39961820090`; package/lock refresh did not commit because the intentional Cloudline landmark RED stopped the suite. Expanded game cannot be Complete until all 30 feature contracts and final release evidence close. |

## Current handoff

**Implementation state:** implementing; Cloudline's first-session/turn/reduced-motion/first-win guidance tranche remains locally GREEN. CLC-004/CLC-007 visible landmark transformation RED is now observed in maintenance run `39961820090`; the production candidate adds cumulative authored vector structures at stages 1–4 and awaits fresh GREEN.  
**Last verified revision:** production revision `8e74431747cff945021b0c42689b64dbc086d99e`, validated from main head `397fc2d33b33e12cb61a7070b0752228ab328fd8` in maintenance run `39960131577`. That run applied and verified the researched current dependency targets, passed design lint, TypeScript, game-document checks, all 151 unit tests, Firestore rules, account-browser checks, every preceding design-browser suite, and the Cloudline browser contract. The exact Cloudline result was: `Cloudline design checks passed: first-screen purpose/help, first-session delivery→upgrade→starter-contract guidance, stepwise bounded flight, event/upgrade feedback, 390/1024/1440 reflow, reduced motion without stale animation state, and guest reload persistence.` The aggregate chain then failed only afterward at the separate Cascade Vault CV-004 RED waiting for `.cv`; this is Cloudline-local GREEN evidence, not full-repository/deployment GREEN.  
**Current main development edge:** landmark RED run `39961820090` applied/verified the researched current dependency set, passed design/type/document checks, all 151 unit tests, Firestore rules, account-browser checks and all design-browser suites before Cloudline, then failed exactly because seeded stages `[1,2,3,4]` exposed `[0,0,0,0]` `[data-cl-stage-layer]` elements. The production candidate preserves each base landmark and cumulatively adds subject-native infrastructure: dispatch fixtures to Aerie Post, cultivation/irrigation structures to Cloud Garden, signal platforms/antennae to Signal Spire, and service/gantry structures to Skyforge Hangar. Existing upgrade animation reveals the final art; reduced motion shows it immediately. No CSS, engine, economy, persistence or dependency change is required.  
**Open game-local work:** validate the landmark-stage candidate against the full existing Cloudline browser contract, then continue Cloudline only with CLC-007 campaign-quality VFX/art/state breadth and remaining CLC-011 comprehension evidence. Generalized CLC-015 contract generation/variety/persistence and independent human rendered critique remain open.  
**External blockers:** TASK-003 blocks real configured-project Firebase verification. Repository `package.json`/lockfile remain behind the researched 2026-10-23 dependency targets because maintenance commits dependency refreshes only after the complete suite passes. Once Cloudline passes, the independent Cascade Vault CV-004 browser RED remains the later aggregate-suite blocker. The connected external browser service returned a provider-side 404, so independent screenshot critique is not verified.  
**Next action:** run dependency-maintenance validation on the cumulative landmark-stage production candidate; require the new `[1,2,3,4]` rendered contract plus every prior Cloudline assertion to pass before recording GREEN.

**Resume here:** Cloudline Couriers is the only active game-quality workstream. Do not start another game. Preserve the verified `39960131577` onboarding/motion/browser contract and the `39961820090` landmark RED; do not weaken dependency or Cascade gates.

## Development-tooling review (2026-10-07)

The repo currently has TypeScript, Vitest, Playwright and dependency-current enforcement but no static ESLint pass or unit coverage gate. Before the next broad gameplay tranche, evaluate and integrate only tools that produce a concrete quality signal without duplicating existing checks. Current candidates, verified against official/current package documentation, are ESLint flat config + `@eslint/js` + `typescript-eslint` for typed linting, official `eslint-plugin-react-hooks`, Vite-oriented `eslint-plugin-react-refresh`, and `@vitest/coverage-v8` matching the installed Vitest major. Playwright already supports ARIA snapshots and visual comparisons, so do not add a duplicate browser/a11y snapshot dependency merely to recreate those capabilities. Exact versions must be verified by the repository's dependency-current gate at integration time.

## Product direction now binding

- First play reaches meaningful action/reward quickly and teaches through play.
- Effort creates durable visible improvement: landmarks, rank, airship, strategic options, campaign progress, collections and mastery.
- Target campaign is five regions / twenty districts with a 20–40 hour first-completion tuning target; neither duration nor pacing is verified until measured.
- Post-campaign Sky Charter provides replayable mastery without deleting permanent earned progression.
- Engagement is player-respecting; no deceptive scarcity, punitive absence, forced login streak loss, paid loot boxes or monetized frustration.
- Professional presentation includes coherent art direction, stateful production assets, animation/VFX, audio and multimodal feedback.

## Continuation map

- Product inventory/research/player journey: `src/games/cloudline-couriers/PRD.md`
- Execution checklist: `src/games/cloudline-couriers/todo.md`
- Authoritative design/completion contract: `docs/specs/2026-10-06-cloudline-couriers-design.md`
- Visual direction: `src/games/cloudline-couriers/visual-notes.md`
- Pure rules: `src/games/cloudline-couriers/engine.ts`
- Versioned save contract: `src/games/cloudline-couriers/persistence.ts`
- React surface: `src/games/cloudline-couriers/CloudlineCouriersWorkspace.tsx`
- Sprite family: `src/games/cloudline-couriers/sprites.tsx`
- Scoped responsive styling: `src/games/cloudline-couriers/cloudline-couriers.css`
- Engine unit evidence: `tests/unit/cloudline-couriers-engine.test.ts`
- Save decoder evidence: `tests/unit/cloudline-couriers-persistence.test.ts`
- Design/reload/sprite regression: `tests/browser/cloudline-couriers-design.mjs`
- Account-emulator evidence: `tests/browser/cloudline-couriers-account-persistence.mjs`

Do not infer completion from chat history. The expanded PRD, todo, authoritative spec and this tracker are the current repository resume contract.
