# Cloudline Couriers tracker

**Spec:** `docs/specs/2026-10-06-cloudline-couriers-design.md`  
**Last synchronized:** 2026-10-08

| Capability | Status | Verification |
| --- | --- | --- |
| Teleological long-form player journey | started | PRD expanded 2026-10-07 from 10 prototype-level capabilities to 30 release-level systems; 5-region/20-district and 20–40h campaign are tuning targets requiring playtest evidence |
| Deterministic flight/board/event/economy foundation | started | Base source + unit coverage integrated; expanded route/campaign/economy balance remains open |
| Landmark/district progression | started | Base engine/UI/save integrated; production transformations and 20-district authored content remain open |
| Cargo Cache + streak/shield strategy | started | Base engine/UI/save integrated; region depth/tuning/browser evidence pending |
| Long-term rank/airship/campaign progression | planned | CLC-012 through CLC-014 binding; no implementation claim yet |
| Contracts/milestones/collections/mastery | planned | CLC-015 through CLC-018 binding; no implementation claim yet |
| Crew/blueprints/weather/branching routes | planned | CLC-019 through CLC-022 binding; no implementation claim yet |
| Expeditions/region finales/post-campaign | planned | CLC-023 through CLC-025 binding; no implementation claim yet |
| Objective clarity/reward cadence/audio/challenge options | planned | CLC-026 through CLC-029 binding; no implementation claim yet |
| Ethical engagement guardrails | started | CLC-030 binding: progression derives engagement from mastery/progress/collection/fun; dark-pattern/punitive-absence/paid-random-reward mechanics excluded |
| Professional art/sprite/VFX/motion system | started | CLC-007 RED was established on `b202378e`; first cohesive illustrated vector family, tile scenes, landmark art, cargo pods and reduced-motion-safe courier arrival are integrated. Dependency-refresh workflows `37857535143` and `37858522731` exposed rendered-test selector defects only; revisions `c7f7098b` and `6d1a356d` corrected lazy workspace synchronization and scoped courier/tile/landmark authored-sprite identity without changing game behavior. Full dependency-maintenance validation `37859097164` then passed these rendered checks and all repository gates. This closes the selector/test edge, but broader campaign-quality art/VFX/state breadth remains open and CLC-007 is not final production sign-off. |
| Responsive accessible game surface | started | Current visual tranche passes the repository's existing rendered checks including reduced motion; expanded full-game responsive/accessibility evidence remains open with long-form scope. |
| Durable guest/account career save | verified | Revision `232102f4`, workflow `37555538295` verified schema-v1; expanded systems require versioned migrations. Live configured Firebase remains TASK-003. |
| Catalog/governance/release integration | started | Canonical docs/routing and current repository validation are green; expanded game cannot be Complete until all 30 feature contracts and final release evidence close |

## Current handoff

**Implementation state:** implementing; product scope intentionally reopened/expanded after teleological UX review.  
**Last verified revision:** `232102f4` verifies CLC-009 schema-v1 persistence. The current vector/browser-regression baseline additionally passed full repository validation in dependency-maintenance workflow `37859097164`, after selector-only repairs `c7f7098b` and `6d1a356d`; bot commit `853c87b0` refreshed the latest stable dependency baseline.  
**Current main development edge:** the first cohesive CLC-007 vector/art tranche is integrated and its present browser regression is green. The prior failures were evidence-selector defects: shared-shell heading synchronization, unscoped duplicate airship identity, and a descendant tile selector that also counted the courier nested inside its current tile. Exact authored selectors now preserve the 16 tile + 4 landmark + 1 active-courier requirements and passed the full validation chain. No game rule, art or progression behavior changed during those repairs.  
**Open game-local work:** CLC-007 still requires campaign-quality art/VFX/state breadth before final production sign-off. Then implement CLC-011 onboarding and CLC-012–CLC-016 progression architecture before multiplying content.  
**External blockers:** TASK-003 blocks real configured-project Firebase verification only.  
**Next action:** continue the Cloudline long-form implementation from CLC-011/CLC-012 only when that game is the active workstream; the temporary dependency/selector blocker is resolved and should not be rediscovered by a future agent.

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
