# TODO: Cloudline Couriers (cloudline-couriers)

**Status:** Implementing  
**Last synchronized:** 2026-10-06  
**Architecture & Engine:** Original static React/Vite 16-stop skyway strategy game with pure deterministic TypeScript rules, planned repository-authored SVG sprites, and planned shared versioned save integration.  
**Dependencies Used:**
- [x] `react@19.3.0`
- [x] `react-dom@19.3.0`
- [x] `firebase@12.19.0` — shared optional account/save platform only
- [x] `vite@8.3.3` — build/dev
- [x] `typescript@7.0.2` — type safety
- [x] `vitest@5.0.3` — unit verification
- [x] `playwright@1.63.0` — rendered browser verification

> Integration dependency rule: exact stable pins only; never `^` or `~`. Re-check authoritative project releases/documentation plus npmjs.com immediately before dependency-changing integration and require `pnpm dependency:check` + `pnpm dependency:current` to pass.

## Core Feature Execution Pipeline

### CLC-001 — Skyway Board Loop
**Purpose:** Roll, move around a 16-stop circular skyway, resolve landing, and reward completed circuits.  
**Inputs:** Run state, deterministic roll value, selected 1x/2x/3x boost.  
**Dependencies Touched:** Pure TypeScript engine plus React board controls.  
**Technical Notes & Edge Cases:** Crossing Dispatch Dock grants circuit reward; movement wraps; zero-fuel state must recover.  
**Implementation Details:** Deterministic movement engine and 5x5 perimeter React board are integrated on `main`.  
**Verification & State Sign-off:**
- [x] Source implementation and unit coverage integrated.
- [ ] Exact-revision CI and rendered board-loop evidence green.

### CLC-002 — Original Tile Event System
**Purpose:** Make every landing strategically meaningful without copying proprietary event systems.  
**Inputs:** Destination tile, boost, shield, streak, credits, fuel.  
**Dependencies Touched:** Engine and board presentation.  
**Technical Notes & Edge Cases:** Market, Workshop, Beacon, Storm, Windgate, Dispatch Dock and Cargo Cache have bounded explicit outcomes; Windgate does not recursively resolve another event.  
**Implementation Details:** All seven event kinds are implemented in the pure engine and surfaced through workspace status/state.  
**Verification & State Sign-off:**
- [x] Deterministic source/unit tranche integrated.
- [ ] Complete event-matrix/browser evidence green.

### CLC-003 — Courier Economy and Flight Boost
**Purpose:** Add meaningful resource choice without purchases, gambling or dark patterns.  
**Inputs:** Credits, fuel, selected 1x/2x/3x boost.  
**Dependencies Touched:** Engine and control panel.  
**Technical Notes & Edge Cases:** Boost may not exceed available fuel; eligible rewards scale; emergency reserve protects resumability.  
**Implementation Details:** Fuel spend, eligible reward multiplication, circuit reward and emergency reserve are implemented.  
**Verification & State Sign-off:**
- [x] Base economy/boost implementation integrated.
- [ ] Low-fuel, boost and reward invariants have exact repository/browser evidence.

### CLC-004 — Landmark and District Progression
**Purpose:** Convert board earnings into visible long-term world progression.  
**Inputs:** Credits, selected landmark, current stage, district.  
**Dependencies Touched:** Engine, landmark UI, future save schema.  
**Technical Notes & Edge Cases:** Four landmarks × four stages; upgrades require affordability; district completion advances and intentionally resets landmark stages.  
**Implementation Details:** Cost calculation, upgrades, completion reward/district advance, and landmark controls are integrated.  
**Verification & State Sign-off:**
- [x] Engine/UI progression implementation integrated.
- [ ] Affordability/district-completion and rendered upgrade evidence green.

### CLC-005 — Cargo Cache Encounter
**Purpose:** Add a short original choice encounter on Cargo Cache landings.  
**Inputs:** Seeded cache contents and selected sealed pod.  
**Dependencies Touched:** Engine encounter state and workspace choice surface.  
**Technical Notes & Edge Cases:** No opponent attack/heist imitation; deterministic seeded contents; flight is paused until resolution.  
**Implementation Details:** Three seeded options and a native-button three-pod resolution surface are integrated.  
**Verification & State Sign-off:**
- [x] Engine/UI encounter implementation integrated.
- [ ] Choice determinism, focus behavior and reduced-motion browser evidence green.

### CLC-006 — Delivery Streak and Shield Strategy
**Purpose:** Reward route momentum and provide bounded storm mitigation.  
**Inputs:** Delivery streak 0-3, shield state, destination event.  
**Dependencies Touched:** Engine and HUD/state presentation.  
**Technical Notes & Edge Cases:** Fourth qualifying delivery pays route bonus; storm consumes shield before setback; state is textual as well as visual.  
**Implementation Details:** Streak, route bonus, beacon shield, storm shield-consumption and setback logic are integrated.  
**Verification & State Sign-off:**
- [x] Engine behavior integrated.
- [ ] Focused streak/shield/storm edge coverage and browser evidence green.

### CLC-007 — Original Vector Sprite and Animation System
**Purpose:** Supply high-DPI original art without third-party licensing/runtime asset risk.  
**Inputs:** Tile, landmark, airship state and animation phase.  
**Dependencies Touched:** Repository-authored SVG/React and scoped CSS only.  
**Technical Notes & Edge Cases:** No remote fonts/images/CDNs; motion is cosmetic; reduced motion suppresses nonessential transforms.  
**Implementation Details:** Build the airship, cloud, cargo, landmark and event sprite bank plus movement/landing/reward/upgrade animation.  
**Verification & State Sign-off:**
- [ ] Authored sprite system implemented.
- [ ] Source asset audit and rendered reduced-motion evidence green.

### CLC-008 — Responsive Accessible Game Surface
**Purpose:** Keep equivalent high-quality play across phone, tablet, desktop, zoom and keyboard/touch input.  
**Inputs:** Viewport, text scaling, pointer/keyboard input, reduced-motion preference.  
**Dependencies Touched:** React native controls and scoped CSS.  
**Technical Notes & Edge Cases:** >=44px important controls; 320px; 200% text; visible focus; no drag-only/timing requirement; restrained live regions.  
**Implementation Details:** Base 5x5 perimeter board, responsive two-column-to-single-column shell, native boost/fly/cache/upgrade buttons and status region are integrated.  
**Verification & State Sign-off:**
- [x] Base responsive/native-control implementation integrated.
- [ ] Phone/tablet/desktop/zoom/reduced-motion/keyboard rendered evidence green.

### CLC-009 — Durable Career Save
**Purpose:** Preserve career and board progression across reload/account contexts.  
**Inputs:** Credits, fuel, position, district, landmark stages, shield/streak and career counters.  
**Dependencies Touched:** Shared save contract; Firebase only through shared platform.  
**Technical Notes & Edge Cases:** Defensive decoder; game-scoped reset; failure cannot block play; live Firebase remains TASK-003.  
**Implementation Details:** Add versioned persistence definition and shared `useGameSave` integration without direct Firebase calls.  
**Verification & State Sign-off:**
- [ ] Guest reload persistence implemented and covered.
- [ ] Emulator account checkpoint/reset evidence green; real configured project remains TASK-003.

### CLC-010 — Catalog, Documentation, and Production Integration
**Purpose:** Ship as a first-class InMo game without disrupting parallel work.  
**Inputs:** Catalog metadata, workspace registry, tests, docs, task state and Pages workflow.  
**Dependencies Touched:** Shared catalog/registry/test/doc surfaces; no new dependency required by current design.  
**Technical Notes & Edge Cases:** Refresh main before integration; no open feature PR; documentation must remain sufficient for another provider to resume.  
**Implementation Details:** Catalog metadata, lazy workspace, GAME_INDEX row, authoritative spec, tracker, canonical PRD/todo and first unit tranche are integrated.  
**Verification & State Sign-off:**
- [x] Canonical product/continuation documents and source routing are integrated.
- [ ] Exact-revision full validation, Pages deployment and deployed smoke evidence green.

## Final Game Assembly & Verification Checklist

- [ ] Verify zero known uncaught game-local console errors/warnings and current applicable MDN/W3C/WCAG runtime requirements.
- [ ] Confirm viewport responsiveness across mobile, tablet, laptop, desktop and large displays, including 320 CSS px and 200% text/reflow evidence.
- [ ] Validate state persistence plus deterministic reload/restart/loop behavior.
- [ ] Confirm every direct dependency/devDependency remains a latest-stable exact pin; dependency-changing integrations require authoritative-source + npmjs.com corroboration and no `^` or `~`.
- [x] Canonical PRD, todo, TRACKER, authoritative spec, GAME_INDEX and current implementation state are structurally synchronized.
- [ ] Pass full `pnpm validate` on the exact integrated revision.
- [ ] Pass GitHub Pages deployment and deployed route smoke/accessibility checks.
- [ ] Confirm no feature pull request is left open and `origin/main` contains the canonical work.
- [ ] Set overall state to Complete/Verified only after every applicable gate above has evidence.

**Continuation rule:** any feature, rule, persistence behavior, material UI change, dependency change, defect, or new verification evidence updates the matching PRD feature, todo item, tracker capability and authoritative spec state before the game is considered complete.
