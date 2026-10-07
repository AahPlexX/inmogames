# Cloudline Couriers tracker

**Spec:** `docs/specs/2026-10-06-cloudline-couriers-design.md`  
**Last synchronized:** 2026-10-07

| Capability | Status | Verification |
| --- | --- | --- |
| Teleological long-form player journey | started | PRD expanded 2026-10-07 from 10 prototype-level capabilities to 30 release-level systems; 5-region/20-district and 20–40h campaign are tuning targets requiring playtest evidence |
| Deterministic flight/board/event/economy foundation | started | Base source + unit coverage integrated; expanded route/campaign/economy balance remains open |
| Landmark/district progression | started | Base engine/UI/save integrated; production transformations and 20-district authored content remain open |
| Cargo Cache + streak/shield strategy | started | Base engine/UI/save integrated; region depth/tuning/browser evidence pending |
| Long-term rank/airship/campaign progression | planned | CLC-012 through CLC-014 newly binding; no implementation claim yet |
| Contracts/milestones/collections/mastery | planned | CLC-015 through CLC-018 newly binding; no implementation claim yet |
| Crew/blueprints/weather/branching routes | planned | CLC-019 through CLC-022 newly binding; no implementation claim yet |
| Expeditions/region finales/post-campaign | planned | CLC-023 through CLC-025 newly binding; no implementation claim yet |
| Objective clarity/reward cadence/audio/challenge options | planned | CLC-026 through CLC-029 newly binding; no implementation claim yet |
| Ethical engagement guardrails | started | CLC-030 binding: progression must derive engagement from mastery/progress/collection/fun; dark-pattern/punitive-absence/paid-random-reward mechanics excluded |
| Professional art/sprite/VFX/motion system | started | CLC-007 RED regression on `b202378e`; production-quality asset system still absent and emoji/placeholder-grade art is explicitly unacceptable |
| Responsive accessible game surface | started | Base native-control surface exists; expanded full-game responsive/accessibility evidence pending |
| Durable guest/account career save | verified | Revision `232102f4`, workflow `37555538295` verified schema-v1; expanded systems will require versioned migrations. Live configured Firebase remains TASK-003. |
| Catalog/governance/release integration | started | Canonical docs/routing exist; expanded game cannot be Complete until all 30 feature contracts and final deployment evidence close |

## Current handoff

**Implementation state:** implementing; product scope intentionally reopened/expanded after teleological UX review.  
**Last verified revision:** `232102f4` verifies CLC-009 schema-v1 persistence only; overall Cloudline is not close to release-complete under the expanded PRD.  
**Current main development edge:** `b202378e` is the CLC-007 RED visual regression commit.  
**Open game-local work:** first confirm the CLC-007 RED failure is the intended missing-production-art failure, then implement the professional art/motion tranche. After that, development follows the expanded PRD/todo rather than declaring completion after the original ten systems.  
**External blockers:** TASK-003 blocks real configured-project Firebase verification only.  
**Next action:** finish CLC-007 RED→GREEN with production-quality authored visual assets (not emoji/crude SVG placeholders), then implement CLC-011 onboarding and the long-term progression architecture required by CLC-012–CLC-016 before content multiplication.

## Product direction now binding

- First play must reach meaningful action/reward quickly and teach through play.
- Effort must create durable visible improvement: landmarks, rank, airship, strategic options, campaign progress, collections and mastery.
- Target campaign structure is five regions / twenty districts with a 20–40 hour first-completion tuning target; neither duration nor pacing may be claimed verified until measured.
- Post-campaign Sky Charter provides replayable mastery without deleting permanent earned progression.
- Engagement must be player-respecting; no deceptive scarcity, punitive absence, forced login streak loss, paid loot boxes or monetized frustration.
- Professional presentation includes coherent art direction, stateful production assets, animation/VFX, audio and multimodal feedback.

## Continuation map

- Product inventory/research/player journey: `src/games/cloudline-couriers/PRD.md`
- Execution checklist: `src/games/cloudline-couriers/todo.md`
- Authoritative design/completion contract: `docs/specs/2026-10-06-cloudline-couriers-design.md`
- Pure rules: `src/games/cloudline-couriers/engine.ts`
- Versioned save contract: `src/games/cloudline-couriers/persistence.ts`
- React surface: `src/games/cloudline-couriers/CloudlineCouriersWorkspace.tsx`
- Scoped responsive styling: `src/games/cloudline-couriers/cloudline-couriers.css`
- Engine unit evidence: `tests/unit/cloudline-couriers-engine.test.ts`
- Save decoder evidence: `tests/unit/cloudline-couriers-persistence.test.ts`
- Design/reload/sprite regression: `tests/browser/cloudline-couriers-design.mjs`
- Account-emulator evidence: `tests/browser/cloudline-couriers-account-persistence.mjs`

Do not infer completion from chat history. The expanded PRD, todo, authoritative spec and this tracker are the current repository resume contract.
