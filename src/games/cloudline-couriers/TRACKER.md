# Cloudline Couriers tracker

**Spec:** `docs/specs/2026-10-06-cloudline-couriers-design.md`  
**Last synchronized:** 2026-10-22

| Capability | Status | Verification |
| --- | --- | --- |
| Teleological long-form player journey | started | PRD expanded 2026-10-07 from 10 prototype-level capabilities to 30 release-level systems; 5-region/20-district and 20–40h campaign are tuning targets requiring playtest evidence |
| Deterministic flight/board/event/economy foundation | started | Revision `d7995308` adds consequence-specific landing copy plus deterministic visible route-step construction including Windgate carry; all 151 unit tests and the Cloudline browser contract passed in maintenance run `39862639992`; expanded route/campaign/economy balance remains open |
| Landmark/district progression | started | Base engine/UI/save plus bounded upgrade feedback passed the Cloudline browser contract in `39862639992`; production transformations and 20-district authored content remain open |
| Cargo Cache + streak/shield strategy | started | Base engine/UI/save plus bounded cargo-pod interaction feedback are integrated; region depth/tuning and broader campaign evidence remain pending |
| Long-term rank/airship/campaign progression | planned | CLC-012 through CLC-014 binding; no implementation claim yet |
| Contracts/milestones/collections/mastery | planned | CLC-015 through CLC-018 binding; no implementation claim yet |
| Crew/blueprints/weather/branching routes | planned | CLC-019 through CLC-022 binding; fixed 16-stop UI coordinates are an intentional introductory-board limit until CLC-022 supplies route-graph coordinates |
| Expeditions/region finales/post-campaign | planned | CLC-023 through CLC-025 binding; no implementation claim yet |
| Objective clarity/reward cadence/audio/challenge options | started | CLC-026 current-job/district-progress/next-action guidance and CLC-027 routine event/cargo/upgrade feedback passed the Cloudline browser contract in `39862639992`; return recap, milestone celebration tiers, audio and challenge options remain open |
| Ethical engagement guardrails | started | CLC-030 binding: progression derives engagement from mastery/progress/collection/fun; dark-pattern/punitive-absence/paid-random-reward mechanics excluded |
| Professional art/sprite/VFX/motion system | started | Original CLC-007 vector family remains integrated. RED `39822058558` isolated generic consequence copy; revision `d7995308` then passed its Cloudline browser contract in `39862639992`. Focused reduced-motion RED `39863334636` subsequently proved the hidden `.cl-effect` lifecycle defect after 151/151 unit tests and earlier browser gates passed. Current GREEN candidate makes reduced-motion flight/cargo/upgrade actions commit durable state/status without creating animation-only feedback. Normal-motion finite travel/impact/resource/cargo/upgrade effects are unchanged. Browser GREEN and broader campaign-quality VFX/art state breadth remain open. |
| Responsive accessible game surface | started | Run `39862639992` passed no-overflow/rendered checks at 390/1024/1440 and reduced-motion immediate resolution. RED `39863334636` exposed retained hidden animation state under reduced motion; synchronous cleanup is now implemented as a GREEN candidate. 320px/200% text and complete input matrix remain open. |
| Durable guest/account career save | verified | Revision `232102f4`, workflow `37555538295` verified schema-v1; expanded systems require versioned migrations. Live configured Firebase remains TASK-003. |
| Catalog/governance/release integration | started | Canonical docs/routing are synchronized. Researched 2026-10-22 dependency targets are recorded but package/lock refresh cannot commit until full maintenance validation passes; expanded game cannot be Complete until all 30 feature contracts and final release evidence close. |

## Current handoff

**Implementation state:** implementing; revision `d7995308` is GREEN for the first-session/turn interaction contract in `39862639992`; reduced-motion stale-state RED is independently observed in `39863334636`; its synchronous cleanup is implemented and awaits fresh GREEN verification.  
**Last verified revision:** `d7995308` passed all 151 unit tests and the Cloudline browser contract inside run `39862639992`; that run then failed only after Cloudline at the separate Cascade Vault CV-004 RED. Run `39863334636` is RED evidence for the follow-up reduced-motion lifecycle defect, not a production GREEN.  
**Current main development edge:** reduced-motion flight, cargo and landmark upgrades now use the same durable game state/status result while clearing/avoiding decorative feedback state that otherwise depends on `animationend`. Normal-motion purpose/help, consequence messages, stepwise perimeter travel, Windgate carry, finite event/resource/cargo/upgrade effects and Skip flight remain unchanged.  
**Open game-local work:** rerun the focused Cloudline browser contract to verify zero retained `.cl-effect` and no retained `data-upgraded=true` marker under reduced motion; then continue Cloudline-only CLC-007 VFX/interaction quality and CLC-011 first-win guidance before starting another game. CLC-007 campaign-quality art/VFX breadth and CLC-011 reward→upgrade→contract comprehension remain open.  
**External blockers:** TASK-003 blocks real configured-project Firebase verification. Current `package.json`/lockfile are stale versus the researched 2026-10-22 dependency targets because maintenance commits dependency refreshes only after the complete suite passes. The independent Cascade Vault CV-004 browser RED remains a later aggregate-suite blocker. The connected real-browser Playwright service returned a provider-side 404, so independent screenshot critique is not yet verified.  
**Next action:** run the dependency-maintenance target set against the reduced-motion cleanup; if Cloudline is GREEN, record exact run/revision evidence without claiming the later Cascade failure is a Cloudline failure.

**Resume here:** Cloudline Couriers remains the only active game workstream. Verify the reduced-motion cleanup first. Do not start another game, do not weaken the dependency or Cascade RED gates, and do not mark the broader CLC-007/011/026/027 release features complete from this tranche alone.

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
