# Cloudline Couriers tracker

**Spec:** `docs/specs/2026-10-06-cloudline-couriers-design.md`  
**Last synchronized:** 2026-10-22

| Capability | Status | Verification |
| --- | --- | --- |
| Teleological long-form player journey | started | PRD expanded 2026-10-07 from 10 prototype-level capabilities to 30 release-level systems; 5-region/20-district and 20–40h campaign are tuning targets requiring playtest evidence |
| Deterministic flight/board/event/economy foundation | started | Base source + unit coverage integrated; current GREEN candidate adds consequence-specific landing copy plus deterministic visible route-step construction including Windgate carry; expanded route/campaign/economy balance remains open |
| Landmark/district progression | started | Base engine/UI/save integrated; bounded upgrade feedback added in the current candidate; production transformations and 20-district authored content remain open |
| Cargo Cache + streak/shield strategy | started | Base engine/UI/save integrated; current candidate adds bounded cargo-pod interaction feedback; region depth/tuning/browser evidence pending |
| Long-term rank/airship/campaign progression | planned | CLC-012 through CLC-014 binding; no implementation claim yet |
| Contracts/milestones/collections/mastery | planned | CLC-015 through CLC-018 binding; no implementation claim yet |
| Crew/blueprints/weather/branching routes | planned | CLC-019 through CLC-022 binding; fixed 16-stop UI coordinates are an intentional introductory-board limit until CLC-022 supplies route-graph coordinates |
| Expeditions/region finales/post-campaign | planned | CLC-023 through CLC-025 binding; no implementation claim yet |
| Objective clarity/reward cadence/audio/challenge options | started | CLC-026 current-job/district-progress/next-action guidance and CLC-027 routine event/cargo/upgrade feedback are implemented as a GREEN candidate; return recap, milestone celebration tiers, audio and challenge options remain open |
| Ethical engagement guardrails | started | CLC-030 binding: progression derives engagement from mastery/progress/collection/fun; dark-pattern/punitive-absence/paid-random-reward mechanics excluded |
| Professional art/sprite/VFX/motion system | started | Original CLC-007 vector family remains integrated. Owner playtesting on 2026-10-22 exposed perpetual hover/teleport-quality motion. RED run `39822058558` confirmed the consequence-copy defect with 149 existing tests passing and one new Cloudline failure. Current GREEN candidate removes sustained hover, adds finite stop-by-stop transform travel, Skip flight, event-specific impact/resource feedback, cargo/upgrade feedback and reduced-motion immediate resolution. Browser GREEN and broader campaign-quality VFX/art state breadth remain open. |
| Responsive accessible game surface | started | Current candidate preserves >=44px actions/focus treatment, stages no-overflow checks and screenshots at 390/1024/1440, and gives reduced-motion users equivalent immediate state/consequence feedback. Fresh rendered GREEN, 320px/200% text and complete input matrix remain open. |
| Durable guest/account career save | verified | Revision `232102f4`, workflow `37555538295` verified schema-v1; expanded systems require versioned migrations. Live configured Firebase remains TASK-003. |
| Catalog/governance/release integration | started | Canonical docs/routing are synchronized. Researched 2026-10-22 dependency targets are recorded but package/lock refresh cannot commit until full maintenance validation passes; expanded game cannot be Complete until all 30 feature contracts and final release evidence close. |

## Current handoff

**Implementation state:** implementing; first-session clarity/motion GREEN candidate is integrated in this work unit, with fresh workflow/browser verification still pending.  
**Last verified revision:** `232102f4` verifies CLC-009 schema-v1 persistence. The prior vector/browser-regression baseline passed full repository validation in dependency-maintenance workflow `37859097164`. The new clarity/motion RED was independently observed in dependency-maintenance run `39822058558`; it is RED evidence, not a verified production revision.  
**Current main development edge:** purpose/current-job/replayable help, consequence-specific engine messages, deterministic stepwise perimeter travel including Windgate carry, finite event/resource/cargo/upgrade effects, a Skip flight action and reduced-motion immediate resolution are implemented without changing the save schema or adding a dependency. The browser contract now tests visible multi-step flight, upgrade feedback, no horizontal overflow and screenshot capture at 390/1024/1440.  
**Open game-local work:** obtain focused unit and Cloudline browser GREEN on the integrated revision, visually review the generated screenshots when a usable browser/artifact path is available, then continue Cloudline-only CLC-007 VFX/interaction quality and CLC-011 first-win guidance before starting another game. CLC-007 campaign-quality art/VFX breadth and CLC-011 reward→upgrade→contract comprehension remain open.  
**External blockers:** TASK-003 blocks real configured-project Firebase verification. Current `package.json`/lockfile are stale versus the already researched 2026-10-22 dependency targets because maintenance commits dependency refreshes only after the complete suite passes. The independent Cascade Vault CV-004 browser RED remains a later aggregate-suite blocker. The connected real-browser Playwright service returned a provider-side 404 during this tranche, so independent screenshot critique is not yet verified.  
**Next action:** run the current dependency-maintenance target set plus unit/Cloudline browser validation against this candidate; if Cloudline is GREEN, record exact run/revision evidence without claiming the later Cascade failure is a Cloudline failure.

**Resume here:** Validate this Cloudline candidate first. Do not start another game, do not weaken the dependency or Cascade RED gates, and do not mark CLC-007/011/026/027 verified from source inspection alone.

## Development-tooling review (2026-10-07)

The repo currently has TypeScript, Vitest, Playwright and dependency-current enforcement but no static ESLint pass or unit coverage gate. Before the next broad gameplay tranche, evaluate and integrate only tools that produce a concrete quality signal without duplicating existing checks. Current candidates, verified against official/current package documentation, are ESLint flat config + `@eslint/js` + `typescript-eslint` for typed linting, official `eslint-plugin-react-hooks`, Vite-oriented React Refresh linting, and `@vitest/coverage-v8` matching the installed Vitest major. Playwright already supports ARIA snapshots and visual comparisons, so do not add a duplicate browser/a11y snapshot dependency merely to recreate those capabilities. Exact versions must be verified by the repository's dependency-current gate at integration time.

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
