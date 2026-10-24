# Cloudline Couriers tracker

**Spec:** `docs/specs/2026-10-06-cloudline-couriers-design.md`  
**Last synchronized:** 2026-10-24

| Capability | Status | Verification |
| --- | --- | --- |
| Teleological long-form player journey | started | PRD expanded 2026-10-07 from 10 prototype-level capabilities to 30 release-level systems; 5-region/20-district and 20–40h campaign are tuning targets requiring playtest evidence |
| Deterministic flight/board/event/economy foundation | started | Revision `d7995308` adds consequence-specific landing copy plus deterministic visible route-step construction including Windgate carry; first-win production revision `8e744317` retains that behavior and run `39960131577` passed all 151 unit tests plus the expanded Cloudline browser contract; expanded route/campaign/economy balance remains open. 2026-10-24: 18 characterization tests in `tests/unit/cloudline-couriers-engine-characterization.test.ts` now pin every previously unasserted v1 rule (stop effects, circuit/route/district rewards, emergency reserve, cargo, upgrade errors); ten engine mutations were all detected |
| Landmark/district progression | started | Base engine/UI/save plus bounded upgrade feedback passed the Cloudline browser contract in `39960131577`. CLC-004/CLC-007 RED `39961820090` exposed `[0,0,0,0]` authored stage layers; the current local candidate adds cumulative subject-native structure for all four landmarks and passes the `[1,2,3,4]` acceptance. Payout/cost formulas and save schema are unchanged; local acceptance is recorded in the spec. |
| Cargo Cache + streak/shield strategy | started | Local client-triage browser acceptance confirms cargo reward settles once with animation disabled, next flight remains usable, and reload retains the reward; current streak guidance uses the storm-reset value. CLC-005-A2 engine/UI guards now prevent district advancement before cargo settles and pass local unit/browser acceptance. Region depth/tuning and broader campaign evidence remain pending |
| Long-term rank/airship/campaign progression | started | CLC-012 rank and XP implemented 2026-10-24 (XP awards, eight rank titles, schema-v2 save with v1 migration, Courier rank panel; spec CLC-012-A1..A6): mutation-checked unit suites, design browser and account emulator pass locally. Mechanic/cosmetic rank unlocks await CLC-013/017/019/020 and an owner decision (OQ-CLC-012-1); CLC-013 and CLC-014 remain planned |
| Contracts/milestones/collections/mastery | started | CLC-015 starter-contract RED is confirmed in `39959280821`; revision `8e744317` derives the starter objective from the existing four-delivery route-bonus mechanic and the browser contract passed in `39960131577`. Broader contract generation plus CLC-016 through CLC-018 remain planned |
| Crew/blueprints/weather/branching routes | planned | CLC-019 through CLC-022 binding; fixed 16-stop UI coordinates are an intentional introductory-board limit until CLC-022 supplies route-graph coordinates |
| Expeditions/region finales/post-campaign | planned | CLC-023 through CLC-025 binding; no implementation claim yet |
| Objective clarity/reward cadence/audio/challenge options | started | CLC-026 contextual first-session guidance and CLC-027 routine event/cargo/upgrade feedback passed the Cloudline browser contract in `39960131577`; return recap, generalized contracts, milestone tiers, audio and challenge options remain open |
| Ethical engagement guardrails | started | CLC-030 binding: progression derives engagement from mastery/progress/collection/fun; dark-pattern/punitive-absence/paid-random-reward mechanics excluded |
| Professional art/sprite/VFX/motion system | started | Original CLC-007 vector family remains integrated. RED `39822058558` isolated generic consequence copy; revision `d7995308` passed its first Cloudline browser contract in `39862639992`. Reduced-motion RED `39863334636` and fix revision `a26c22f7` closed stale animation-only state in `39863962054`. Historical run `39960131577` verified finite effects; landmark-stage RED `39961820090` preceded the cumulative structures now passing local acceptance in the spec. Broader campaign-quality VFX/art state breadth remains open. |
| Responsive accessible game surface | started | Run `39960131577` passed 390/1024/1440, stepwise flight, reduced-motion resolution and guest reload. The current local client-triage contract additionally passes 320 CSS px at 100%/200% text with controls outside the route tiles, >=44px targets and no horizontal overflow. Full input/device matrix remains open. |
| Durable guest/account career save | verified | Revision `232102f4`, workflow `37555538295` verified schema-v1; current local acceptance confirms reset cancellation preserves progress and targeted account-emulator reset accepts confirmation. No save-schema field was added; initial account loading now warns before cached play (CLC-009-A3). Expanded systems require versioned migrations. 2026-10-24: schema v2 adds `career.xp` with a v1-to-v2 migration (D-030, CLC-012-A3). Live configured Firebase remains TASK-003. |
| Catalog/governance/release integration | started | Canonical docs/routing are synchronized. Researched 2026-10-23 dependency targets passed current-version validation in `39961820090`; package/lock refresh did not commit because the intentional Cloudline landmark RED stopped the suite. Expanded game cannot be Complete until all 30 feature contracts and final release evidence close. |

## Current handoff

**Implementation state:** implementing — the automated client-fix tranche from `1d0c269` is released in functional `2628ca2`; the expanded PRD remains open.
**Last verified revision:** `2628ca27e8aa95778203f78848d30df31e60f25e`, CI/Pages run `40034775904`, live Cloudline smoke 2026-10-23; targeted account-emulator acceptance also passed locally under the refreshed SDK.
**Open game-local work:** the CLC-001..CLC-030 campaign/feature scope, long-campaign evidence, human comprehension, production-art review and TASK-003 live Firebase verification remain open. Initial-hydration blocking CLC-009-A2 is excluded under the shared platform contract; CLC-009-A3 preserves cached play with an upfront authority warning.
**External blockers:** TASK-003 blocks live configured-project Firebase verification. Human comprehension and art/motion approval await human testing. The former dependency/Cascade release blockers are resolved.
**Next action:** CLC-012 is started (titles-only unlocks, see OQ-CLC-012-1 in the spec). Next implement CLC-016 (milestone reward track) on the schema-v2 migration hook (`migrate` in `persistence.ts`, bump to v3), then CLC-013; obtain human first-session comprehension and art/motion testing before closing those criteria.

## Resume here

**Current state:** the client-fix tranche is deployed and browser-smoked; all 30 PRD features are not complete.
**Next action:** CLC-012 is started (titles-only unlocks, see OQ-CLC-012-1 in the spec). Next implement CLC-016 (milestone reward track) on the schema-v2 migration hook (`migrate` in `persistence.ts`, bump to v3), then CLC-013; obtain human first-session comprehension and art/motion testing before closing those criteria.
**Blockers:** TASK-003 and human comprehension/art/motion testing; expanded campaign implementation remains open.

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

## Refreshed local release evidence

Local release evidence (2026-10-23): frozen pnpm 10.0.0 install, exact/current dependency gates, design lint, TypeScript, game/document governance, 161 unit tests, four Firestore rules tests, shared account browser checks, all game/design browser checks including Hollowshift, and both builds passed. Cloudline account-emulator checks also passed with Firebase 13.1.0. Final paytable reflow/keyboard/skip browser checks and both builds passed after the last presentation change. Runtime/test/config SHA-256 `0df0e1be6c4e09a35067136ba18ed0dbee9ced6681917145b7b1cae30c1d46df` uses sorted tracked and new non-Markdown files, excluding `.tasks/` except the dependency request, with each path and file bytes delimited by NUL. Exact The refreshed functional revision `2628ca2` passed CI/Pages run `40034775904` on 2026-10-23.
