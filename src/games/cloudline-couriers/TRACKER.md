# Cloudline Couriers tracker

**Spec:** `docs/specs/2026-10-06-cloudline-couriers-design.md`  
**Last synchronized:** 2026-10-23

| Capability | Status | Verification |
| --- | --- | --- |
| Teleological long-form player journey | started | PRD expanded 2026-10-07 from 10 prototype-level capabilities to 30 release-level systems; 5-region/20-district and 20–40h campaign are tuning targets requiring playtest evidence |
| Deterministic flight/board/event/economy foundation | started | Revision `d7995308` adds consequence-specific landing copy plus deterministic visible route-step construction including Windgate carry; production revision `a26c22f7` retains that behavior and all 151 unit tests plus the Cloudline browser contract passed in maintenance run `39863962054`; expanded route/campaign/economy balance remains open |
| Landmark/district progression | started | Base engine/UI/save plus bounded upgrade feedback passed the Cloudline browser contract in `39863962054`; production transformations and 20-district authored content remain open |
| Cargo Cache + streak/shield strategy | started | Base engine/UI/save plus bounded cargo-pod interaction feedback are integrated; region depth/tuning and broader campaign evidence remain pending |
| Long-term rank/airship/campaign progression | planned | CLC-012 through CLC-014 binding; no implementation claim yet |
| Contracts/milestones/collections/mastery | started | CLC-015 starter-contract acceptance is now under test using the already-existing four-delivery route-bonus mechanic; broader contract generation plus CLC-016 through CLC-018 remain planned |
| Crew/blueprints/weather/branching routes | planned | CLC-019 through CLC-022 binding; fixed 16-stop UI coordinates are an intentional introductory-board limit until CLC-022 supplies route-graph coordinates |
| Expeditions/region finales/post-campaign | planned | CLC-023 through CLC-025 binding; no implementation claim yet |
| Objective clarity/reward cadence/audio/challenge options | started | CLC-026 current-job/district-progress/next-action guidance and CLC-027 routine event/cargo/upgrade feedback passed the Cloudline browser contract in `39863962054`; 2026-10-23 first-session acceptance now requires non-delivery → first delivery → first upgrade → starter-contract guidance without skipping ahead based only on starting credits |
| Ethical engagement guardrails | started | CLC-030 binding: progression derives engagement from mastery/progress/collection/fun; dark-pattern/punitive-absence/paid-random-reward mechanics excluded |
| Professional art/sprite/VFX/motion system | started | Original CLC-007 vector family remains integrated. RED `39822058558` isolated generic consequence copy; revision `d7995308` then passed its first Cloudline browser contract in `39862639992`. Focused reduced-motion RED `39863334636` proved the hidden `.cl-effect` lifecycle defect. Fix revision `a26c22f7` makes reduced-motion flight/cargo/upgrade actions commit durable state/status without creating animation-only feedback; maintenance run `39863962054` passed all 151 units and the Cloudline browser contract including no stale reduced-motion state. Normal-motion finite travel/impact/resource/cargo/upgrade effects remain intact. Broader campaign-quality VFX/art state breadth remains open. |
| Responsive accessible game surface | started | Run `39863962054` passed no-overflow/rendered checks at 390/1024/1440, stepwise flight, reduced-motion immediate resolution with no stale animation state, and guest reload persistence. 320px/200% text and complete input matrix remain open for the expanded game. |
| Durable guest/account career save | verified | Revision `232102f4`, workflow `37555538295` verified schema-v1; expanded systems require versioned migrations. Live configured Firebase remains TASK-003. |
| Catalog/governance/release integration | started | Canonical docs/routing are synchronized. Researched 2026-10-22 dependency targets are verified in maintenance runners but package/lock refresh cannot commit until the complete repository suite passes; expanded game cannot be Complete until all 30 feature contracts and final release evidence close. |

## Current handoff

**Implementation state:** implementing; Cloudline's prior first-session/turn interaction and reduced-motion lifecycle tranche is GREEN. A new CLC-011/CLC-015 first-win guidance acceptance test is being opened before production changes.  
**Last verified revision:** production revision `a26c22f7c1a9b889f40f1779355f5aea87adb7f4`, validated from main head `dec94fe5205e0ce65f4c1fa52cc2c35af8b64c08` in maintenance run `39863962054`. That run passed the researched dependency-current checks, design/type/document gates, all 151 unit tests, Firestore rules, account-browser checks and the Cloudline browser contract. It then failed only after Cloudline at the separate Cascade Vault CV-004 RED waiting for `.cv`; this is Cloudline-local GREEN evidence, not full-repository/deployment GREEN.  
**Current main development edge:** purpose/current-job/replayable help, consequence-specific engine messages, deterministic stepwise perimeter travel including Windgate carry, finite event/resource/cargo/upgrade effects, Skip flight and reduced-motion immediate resolution without stale animation-only state are integrated without save-schema or game-local dependency changes. The next acceptance contract must keep first-delivery guidance active after a non-delivery, point the first successful delivery to the first landmark upgrade, then introduce a starter contract backed by the existing four-delivery route bonus.  
**Open game-local work:** continue Cloudline only. Observe the new rendered first-win guidance RED, implement the smallest derived-state fix without a save-schema change, then continue CLC-007 production VFX/art breadth. CLC-007 campaign-quality art/VFX breadth and independent human rendered critique remain open.  
**External blockers:** TASK-003 blocks real configured-project Firebase verification. Current `package.json`/lockfile are stale versus the researched 2026-10-22 dependency targets because maintenance commits dependency refreshes only after the complete suite passes. The independent Cascade Vault CV-004 browser RED remains a later aggregate-suite blocker. The connected external browser service returned a provider-side 404, so independent screenshot critique is not yet verified.  
**Next action:** run the new Cloudline first-win browser acceptance on `main`; verify it fails only because the current job skips the intended delivery → upgrade → starter-contract sequence, then implement the minimal guidance logic while preserving all prior Cloudline assertions.

**Resume here:** Cloudline Couriers is the only active game-quality workstream. Do not start another game. Preserve the verified `39863962054` turn/reduced-motion contract, keep the new first-win acceptance test authoritative, and do not weaken the dependency or Cascade RED gates.

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
