# TODO: Cloudline Couriers (cloudline-couriers)

**Status:** Implementing  
**Last synchronized:** 2026-10-06  
**Architecture & Engine:** Original static React/Vite board-loop strategy game with pure deterministic TypeScript rules, repository-authored SVG sprites, and shared optional save platform.  
**Dependencies Used:**
- [x] `react@19.3.0`
- [x] `react-dom@19.3.0`
- [x] `firebase@12.19.0` — shared optional account/save platform only
- [x] `vite@8.3.3` — build/dev
- [x] `typescript@7.0.2` — type safety
- [x] `vitest@5.0.3` — unit verification
- [x] `playwright@1.63.0` — rendered browser verification

> Integration dependency rule: exact stable pins only; never `^` or `~`. Re-check authoritative project releases/documentation plus npmjs.com immediately before dependency-changing integration and require `pnpm dependency:check` + `pnpm dependency:current` to pass.

---

## Core Feature Execution Pipeline

- [ ] **Skyway Board Loop** `{id: 'CLC-001'}` — `[feature development status: = 'Engine prepared; integration pending']`
  - [x] **Purpose:** Roll, move around a 16-stop circular skyway, resolve landing, and reward completed circuits.
  - [x] **Inputs / Parameters:** Run state, deterministic roll value, selected 1x/2x/3x boost.
  - [x] **Dependencies Touched:** Pure TypeScript engine.
  - [x] **Technical Notes & Edge Cases:** Crossing Dispatch Dock grants circuit reward; movement wraps; zero-fuel state must recover.
  - [ ] **Implementation Details:** Integrate engine, React controls, movement presentation and status feedback.
  - [ ] **Verification & State Sign-off:** Engine/browser tests green; set status Complete.

- [ ] **Original Tile Event System** `{id: 'CLC-002'}` — `[feature development status: = 'Engine prepared; integration pending']`
  - [x] **Purpose:** Make every landing strategically meaningful without copying proprietary event systems.
  - [x] **Inputs / Parameters:** Destination tile, boost, shield, streak, credits/fuel.
  - [x] **Dependencies Touched:** Engine + board presentation.
  - [x] **Technical Notes & Edge Cases:** Market, Workshop, Beacon, Storm, Windgate, Dispatch Dock and Cargo Cache have bounded explicit outcomes.
  - [ ] **Implementation Details:** Wire all event types to textual/visual result feedback.
  - [ ] **Verification & State Sign-off:** Deterministic event matrix tests and browser flow green.

- [ ] **Courier Economy and Flight Boost** `{id: 'CLC-003'}` — `[feature development status: = 'Engine prepared; integration pending']`
  - [x] **Purpose:** Add meaningful resource choice without purchases, gambling or dark patterns.
  - [x] **Inputs / Parameters:** Credits, fuel rolls, 1x/2x/3x boost selection.
  - [x] **Dependencies Touched:** Engine and control panel.
  - [x] **Technical Notes & Edge Cases:** Boost may not exceed available fuel; eligible rewards scale; no-dead-end refuel protects resumability.
  - [ ] **Implementation Details:** Accessible boost selector and transparent reward math.
  - [ ] **Verification & State Sign-off:** Economy invariants + low-fuel cases tested.

- [ ] **Landmark and District Progression** `{id: 'CLC-004'}` — `[feature development status: = 'Engine prepared; integration pending']`
  - [x] **Purpose:** Convert board earnings into visible long-term world progression.
  - [x] **Inputs / Parameters:** Credits, selected landmark, current stage, district.
  - [x] **Dependencies Touched:** Engine, landmark UI, save schema.
  - [x] **Technical Notes & Edge Cases:** Four landmarks × four stages; upgrade only when affordable; district completion advances and resets landmark stages intentionally.
  - [ ] **Implementation Details:** Upgrade cards with authored vector stage presentation and explicit costs.
  - [ ] **Verification & State Sign-off:** Upgrade affordability and district-completion tests green.

- [ ] **Cargo Cache Encounter** `{id: 'CLC-005'}` — `[feature development status: = 'Designed; implementation pending']`
  - [x] **Purpose:** Add a short original choice encounter on Cargo Cache landings.
  - [x] **Inputs / Parameters:** Seeded cache contents and selected sealed pod.
  - [ ] **Dependencies Touched:** Engine encounter state + dialog/panel presentation.
  - [x] **Technical Notes & Edge Cases:** No opponent attack/heist imitation; deterministic seeded contents; all choices keyboard/touch accessible.
  - [ ] **Implementation Details:** Build three-pod choice surface, reveal animation, result application and reduced-motion path.
  - [ ] **Verification & State Sign-off:** Choice/result determinism, focus and reduced-motion browser evidence green.

- [ ] **Delivery Streak and Shield Strategy** `{id: 'CLC-006'}` — `[feature development status: = 'Engine prepared; integration pending']`
  - [x] **Purpose:** Reward route momentum and provide bounded storm mitigation.
  - [x] **Inputs / Parameters:** Delivery streak 0-3, shield state, destination event.
  - [x] **Dependencies Touched:** Engine, HUD and board state.
  - [x] **Technical Notes & Edge Cases:** Fourth qualifying delivery pays route bonus; storm consumes shield before setback; state is never color-only.
  - [ ] **Implementation Details:** Streak meter, shield indicator, reward/status messaging.
  - [ ] **Verification & State Sign-off:** Streak reset/bonus and shield/storm tests green.

- [ ] **Original Vector Sprite and Animation System** `{id: 'CLC-007'}` — `[feature development status: = 'Art direction prepared; integration pending']`
  - [x] **Purpose:** High-DPI original art without third-party licensing/runtime asset risk.
  - [x] **Inputs / Parameters:** Tile/landmark/airship state and animation phase.
  - [x] **Dependencies Touched:** Repository-authored SVG/React + scoped CSS only.
  - [x] **Technical Notes & Edge Cases:** No remote fonts/images/CDNs; motion cosmetic; reduced-motion suppresses nonessential transforms.
  - [ ] **Implementation Details:** Airship, cloud, cargo, landmark and event sprite bank; movement/landing/reward/upgrade animation.
  - [ ] **Verification & State Sign-off:** Source asset audit + rendered browser evidence green.

- [ ] **Responsive Accessible Game Surface** `{id: 'CLC-008'}` — `[feature development status: = 'UI architecture prepared; verification pending']`
  - [x] **Purpose:** Equivalent high-quality play across phone, tablet, desktop, zoom and keyboard/touch input.
  - [x] **Inputs / Parameters:** Viewport, text scaling, pointer/keyboard input, reduced-motion preference.
  - [x] **Dependencies Touched:** React/native controls/scoped CSS.
  - [x] **Technical Notes & Edge Cases:** >=44px important controls; 320px; 200% text; visible focus; no drag-only/timing requirement; restrained live regions.
  - [ ] **Implementation Details:** Normal-flow responsive board/control layout with device-agnostic reflow.
  - [ ] **Verification & State Sign-off:** Playwright phone/tablet/desktop/zoom/reduced-motion/keyboard checks green.

- [ ] **Durable Career Save** `{id: 'CLC-009'}` — `[feature development status: = 'Designed; implementation pending']`
  - [x] **Purpose:** Preserve career and board progression across reload/account contexts.
  - [x] **Inputs / Parameters:** Credits, fuel, position, district, landmark stages, shield/streak and career counters.
  - [x] **Dependencies Touched:** Shared save contract; Firebase only through shared platform.
  - [x] **Technical Notes & Edge Cases:** Defensive decoder; game-scoped reset; failure cannot block play; live Firebase remains TASK-003.
  - [ ] **Implementation Details:** Versioned persistence definition and `useGameSave` integration.
  - [ ] **Verification & State Sign-off:** Guest reload + emulator account checkpoint/reset evidence green.

- [ ] **Catalog, Documentation, and Production Integration** `{id: 'CLC-010'}` — `[feature development status: = 'Planning docs integrated; source integration pending']`
  - [x] **Purpose:** Ship as a first-class InMo game without disrupting parallel work.
  - [x] **Inputs / Parameters:** Catalog metadata, workspace registry, tests, docs, task state and Pages workflow.
  - [x] **Dependencies Touched:** Shared catalog/registry/test/doc surfaces; no new dependency required by current design.
  - [x] **Technical Notes & Edge Cases:** Refresh main before each integration; no open feature PR; spec/tracker updates atomic with implementation/test changes.
  - [ ] **Implementation Details:** Add source, authoritative design spec, tracker, GAME_INDEX row and test coverage in concurrency-safe main commits.
  - [ ] **Verification & State Sign-off:** Exact-revision validation + Pages deploy + deployed smoke green.

---

## Final Game Assembly & Verification Checklist

- [ ] Verify zero uncaught console warnings and strict current MDN/W3C/WCAG runtime compliance.
- [ ] Confirm viewport responsiveness across mobile, tablet, laptop, desktop, and large displays, including 320 CSS px and 200% text.
- [ ] Validate state persistence and deterministic restart/loop behavior.
- [ ] Confirm every dependency/devDependency is a latest stable exact pin at integration time using authoritative sources + npmjs.com corroboration; no `^` or `~`.
- [ ] Establish/synchronize game-local `TRACKER.md`, authoritative design spec, `docs/GAME_INDEX.md`, PRD and todo in the source integration commit.
- [ ] Pass full `pnpm validate` on the exact integrated revision.
- [ ] Pass GitHub Pages deployment and deployed route smoke/accessibility checks.
- [ ] Confirm no feature pull request is left open and origin/main contains the canonical work.
- [ ] Flip overall status: set `[Game development status: = 'Complete']` only after every applicable gate above is satisfied.
