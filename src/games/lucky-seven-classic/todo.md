# Lucky Seven Classic execution

**Status:** Implementing — complete gameplay/browser evidence green; production CSS selector repair awaiting build/Pages verification  
**Architecture / Engine:** Pure center-line engine → settled durable persistence → React mechanical cabinet/audio → one consolidated browser regression → both production builds → exact-revision Pages evidence.  
**Dependencies Used:** React 19.3.0; TypeScript 7.0.2; Vitest 5.0.3; Playwright 1.64.0; Firebase 13.0.0; Vite 8.3.4.

## Core Feature Execution Pipeline

### LSC-001 — Exact reel engine
**Purpose:** Transparent deterministic scoring and exact long-run math.  
**Inputs / Parameters:** three 32-stop strips, injected/crypto stop source, center line, wager 1/2/5/10/25.  
**Dependencies Touched:** `reels.ts`, `paytable.ts`, `engine.ts`, focused unit test.  
**Technical Notes & Edge Cases:** precedence prevents double awards; invalid inputs reject; random-source failure occurs before bankroll mutation.  
**Implementation Details:** RED `1085f461f474f9d5ac1976a991d4f6079a9aae75` / `38098884217`; GREEN `de1136d18390b1044eab16475fab5aee31b2c6f6` / `38099279607`.  
**Verification & State Sign-off:** exact scoring, deterministic stop projection, 94.775390625% RTP and 42.047119140625% paying-result frequency are verified.

- [x] Exact scoring and deterministic stop projection verified.
- [x] Exhaustive probability audit derived from source configuration.

### LSC-002 — Settled durable persistence
**Purpose:** Persist completed practice progress only.  
**Inputs / Parameters:** bankroll, selected wager, spins, totals/net/largest win, last result, sound/motion preferences.  
**Dependencies Touched:** `storage.ts`, `persistence.ts`, shared `GameSaveDefinition`.  
**Technical Notes & Edge Cases:** safe-integer/net-consistency validation; unknown symbols/unsupported wagers reject; settlement derives engine award; insufficient bankroll rejects; restore-to-500 preserves history/preferences.  
**Implementation Details:** RED `eb89b259c60a3a12c9a832db94ea21602035d1eb` / `38099468454`; GREEN `a72d095e3569b056b211803335e6b6d401e048bb` / `38099724416`.  
**Verification & State Sign-off:** schema-v1 decode/settlement/restore tests pass and the GREEN revision completed both builds plus Pages deployment.

- [x] Schema-v1 decode/settlement/restore focused tests pass.
- [x] Shared save platform is reused rather than reimplemented.

### LSC-003 — Mechanical cabinet UI / UX
**Purpose:** Deliver the distinct accessible classic cabinet with one consolidated browser quality gate.  
**Inputs / Parameters:** save state, reel windows/result, spin phase, paytable, sound/motion preferences.  
**Dependencies Touched:** `LuckySevenClassicWorkspace.tsx`, `lucky-seven-classic.css`, `audio.ts`, catalog/workspace registries, `tests/browser/lucky-seven-classic.mjs`.  
**Technical Notes & Edge Cases:** 3 reels × 3 visible cells; center row text-labelled; native Pull / Spin button; RNG failure no deduction; phase guard; settlement before finite motion; Web Audio only after opt-in/user spin; game-local two-step reset; live-result selectors are scoped to `.lsc-status` because paytable copy intentionally repeats result labels.  
**Implementation Details:** UI RED `66f0f7a54c7fad33f6ee4953ee6b5220e4e40f58` / `38100222862`; payline semantic repair `3e662d79645151e7e7fbc7eb666dd2fd273fbe9e`; selector-scope correction `3b3faa1a95a04752c813acbcb9e09b3112945ec6`.  
**Verification & State Sign-off:** run `38121283719` passed the complete Lucky browser contract including route/cabinet, RNG safety, deterministic keyboard settlement/reload, restore, 320px/200%-text reflow, >=48px primary action, reduced motion and opt-in audio.

- [x] Consolidated browser test records the expected missing playable route/cabinet RED.
- [x] Deterministic Gold/Red outcomes, RNG failure safety, reload/restore and opt-in audio pass.
- [x] 320px, 200%-text, reduced-motion and target-size checks pass.

### LSC-004 — Responsive / integration / production release
**Purpose:** Make the game discoverable, production-buildable and Pages-deployable across supported environments.  
**Inputs / Parameters:** catalog metadata, lazy workspace route, scoped CSS, consolidated browser suite, Vite Firebase/root-base builds, synchronized docs.  
**Dependencies Touched:** `src/catalog.ts`, `src/games/workspaces.tsx`, `lucky-seven-classic.css`, browser suite, GAME_INDEX/spec/tracker/PRD/todo/`.tasks`.  
**Technical Notes & Edge Cases:** production CSS must parse under Vite 8.3.4/LightningCSS; scoped descendant selectors require a combinator space (`.lsc *`) rather than invalid `.lsc*`; final verified state requires both builds and Pages success on one exact revision. TASK-003 remains external only.  
**Implementation Details:** run `38121283719` passed all behavior/browser gates, then `build:firebase` failed on `Unexpected token Delim('*')` at `.lsc*,.lsc*::before,.lsc*::after`. Commit `bd5b1cf1c12bc218eca17557caaa9cc0ff92fc0a` changes only that malformed production selector to `.lsc *,.lsc *::before,.lsc *::after`. Its first workflow run `38121621987` stopped at `game:check` before builds because this todo file had been over-compressed and lost the required structured fields; production source was therefore not exercised in that run.  
**Verification & State Sign-off:** browser behavior is verified; corrected CSS build/Pages evidence remains open and must be obtained without weakening prior gates.

- [x] Catalog/workspace route is live.
- [x] Complete game-specific browser contract is green.
- [ ] Corrected CSS passes `build:firebase`.
- [ ] Corrected CSS passes standard production `build`.
- [ ] Pages artifact upload/deployment succeeds on the same exact functional revision.

## Final Game Assembly & Verification Checklist

- [x] Console/runtime gameplay browser quality gate passes without uncaught game-local errors.
- [x] Responsive viewport/reflow contract passes at 320px and 200% text.
- [x] Persistence/reload/restore behavior is verified through the playable workspace.
- [x] Dependency exact pins/current-version checks remain green through run `38121283719`.
- [x] TRACKER, PRD, GAME_INDEX, authoritative spec, todo and `.tasks` are synchronized for the active build repair.
- [ ] Full canonical validation passes on the exact final functional revision.
- [ ] GitHub Pages deploy succeeds for that exact revision.
- [ ] Mark Complete / Verified only after all game-local release gates are evidenced; TASK-003 may remain externally blocked.
