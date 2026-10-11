# Lucky Seven Classic execution

**Status:** Implementing — playable cabinet production integration awaiting GREEN  
**Architecture / Engine:** Pure center-line engine → settled durable persistence → React mechanical cabinet/audio → one consolidated browser regression → exact-revision release evidence.  
**Dependencies Used:** React 19.3.0; TypeScript 7.0.2; Vitest 5.0.3; Playwright 1.64.0; Firebase 13.0.0 shared platform.

## Core Feature Execution Pipeline

### LSC-001 — Exact reel engine
**Purpose:** Transparent deterministic scoring and exact long-run math.  
**Inputs / Parameters:** three 32-stop strips, injected/crypto stop source, center line, wager 1/2/5/10/25.  
**Dependencies Touched:** `reels.ts`, `paytable.ts`, `engine.ts`, focused unit test.  
**Technical Notes & Edge Cases:** precedence prevents double awards; invalid inputs reject; random failure precedes bankroll mutation.  
**Implementation Details:** RED `1085f461f474f9d5ac1976a991d4f6079a9aae75` / `38098884217`; GREEN `de1136d18390b1044eab16475fab5aee31b2c6f6` / `38099279607`.  
**Verification & State Sign-off:** game-check/unit/build/Pages evidence green.

- [x] Exact scoring and deterministic stop projection verified.
- [x] 94.775390625% RTP / 42.047119140625% hit-frequency audit derived from source configuration.

### LSC-002 — Settled durable persistence
**Purpose:** Persist completed practice progress only.  
**Inputs / Parameters:** bankroll, selected wager, spins, totals/net/largest win, last result, sound/motion preferences.  
**Dependencies Touched:** `storage.ts`, `persistence.ts`, shared `GameSaveDefinition`.  
**Technical Notes & Edge Cases:** safe-integer/net-consistency validation; unknown symbols/unsupported wagers reject; settlement derives engine award; insufficient bankroll rejects; restore-to-500 preserves history.  
**Implementation Details:** RED `eb89b259c60a3a12c9a832db94ea21602035d1eb` / `38099468454`; GREEN `a72d095e3569b056b211803335e6b6d401e048bb` / `38099724416`.  
**Verification & State Sign-off:** full build and Pages deployment passed on the GREEN revision.

- [x] Schema-v1 decode/settlement/restore focused tests pass unchanged.
- [x] Shared save platform is reused rather than reimplemented.

### LSC-003 — Mechanical cabinet UI / UX
**Purpose:** Deliver the distinct accessible classic cabinet.  
**Inputs / Parameters:** save state, reel windows/result, spin phase, paytable, sound/motion preferences.  
**Dependencies Touched:** `LuckySevenClassicWorkspace.tsx`, `lucky-seven-classic.css`, `audio.ts`, catalog/workspace registries, consolidated browser test.  
**Technical Notes & Edge Cases:** 3 reels × 3 visible cells; center row text-labelled; native Pull / Spin button; RNG failure no deduction; phase guard; settlement before finite motion; Web Audio only after opt-in/user spin; game-local two-step reset.  
**Implementation Details:** RED `66f0f7a54c7fad33f6ee4953ee6b5220e4e40f58` / run `38100222862` passed every prior gate and failed only waiting for missing `.lsc`. Current production integration implements the cabinet/audio/route. The Red-7 deterministic fixture changes from incorrect `[0,0,0]` to actual source-strip stops `[0,9,14]` while retaining the exact `3 Red 7s` assertion.  
**Verification & State Sign-off:** Awaiting GREEN; production assertions are not weakened.

- [x] Consolidated browser test records the expected missing playable route/cabinet RED.
- [ ] Deterministic Gold-7 keyboard spin, RNG failure safety, reload/restore and opt-in audio pass.

### LSC-004 — Responsive / integration / release
**Purpose:** Make the game discoverable and production-complete across devices.  
**Inputs / Parameters:** catalog metadata, lazy workspace route, scoped CSS, consolidated browser suite, synchronized docs.  
**Dependencies Touched:** `src/catalog.ts`, `src/games/workspaces.tsx`, browser test, GAME_INDEX/spec/tracker/PRD/todo/`.tasks`.  
**Technical Notes & Edge Cases:** 320px and 200% text cannot horizontally overflow; primary action >=48px; reduced-motion suppresses reel animation; final verified state requires exact functional revision and successful Pages deployment.  
**Implementation Details:** Catalog/workspace registration is included in the current GREEN candidate; browser GREEN must precede closeout. TASK-003 remains external only.  
**Verification & State Sign-off:** Open until CI evidence exists.

- [ ] 320px, 200%-text, reduced-motion and target-size assertions pass.
- [ ] Catalog/workspace route is live and final exact-revision validation/Pages evidence is recorded.

## Final Game Assembly & Verification Checklist

- [ ] Console/runtime quality gate passes without uncaught game-local errors.
- [ ] Responsive viewport/reflow contract passes at 320px and 200% text.
- [ ] Persistence/reload/restart/restore behavior is verified through the playable workspace.
- [ ] Dependency exact pins/current-version checks remain green.
- [ ] TRACKER, PRD, GAME_INDEX, authoritative spec, todo and `.tasks` are synchronized.
- [ ] Full `pnpm validate` passes on the exact final functional revision.
- [ ] GitHub Pages deploy succeeds for that exact revision.
- [ ] Mark Complete / Verified only after all game-local gates are evidenced; TASK-003 may remain externally blocked.
