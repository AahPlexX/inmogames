# Lucky Seven Classic execution

**Status:** Implementing — complete gameplay/browser evidence green; production CSS selector repair awaiting build/Pages verification  
**Architecture / Engine:** Pure center-line engine → settled durable persistence → React mechanical cabinet/audio → one consolidated browser regression → both production builds → exact-revision Pages evidence.  
**Dependencies Used:** React 19.3.0; TypeScript 7.0.2; Vitest 5.0.3; Playwright 1.64.0; Firebase 13.0.0; Vite 8.3.4.

## Core Feature Execution Pipeline

### LSC-001 — Exact reel engine
- [x] Exact scoring and deterministic stop projection verified.
- [x] 94.775390625% RTP / 42.047119140625% hit-frequency audit derived from source configuration.
- RED `1085f461f474f9d5ac1976a991d4f6079a9aae75` / `38098884217`; GREEN `de1136d18390b1044eab16475fab5aee31b2c6f6` / `38099279607`.

### LSC-002 — Settled durable persistence
- [x] Schema-v1 decode/settlement/restore focused tests pass.
- [x] Shared save platform is reused rather than reimplemented.
- RED `eb89b259c60a3a12c9a832db94ea21602035d1eb` / `38099468454`; GREEN `a72d095e3569b056b211803335e6b6d401e048bb` / `38099724416`, including Pages deployment.

### LSC-003 — Mechanical cabinet UI / UX
- [x] Consolidated browser RED recorded on missing route/cabinet: `66f0f7a54c7fad33f6ee4953ee6b5220e4e40f58` / `38100222862`.
- [x] Standalone `Center payline` semantics repaired after descendant run `38100732011` exposed the exact defect.
- [x] RNG failure, deterministic keyboard Gold/Red outcomes, reload, restore, opt-in audio, reduced motion and visible status all pass in one unchanged consolidated browser suite.
- Browser GREEN evidence: `3b3faa1a95a04752c813acbcb9e09b3112945ec6` / run `38121283719`.

### LSC-004 — Responsive / integration / release
- [x] 320px, 200%-text, reduced-motion and >=48px target assertions pass in run `38121283719`.
- [x] Catalog/workspace route is live and included in catalog/shared-browser validation.
- [x] All remaining design-browser suites (Mergrove, Cloudline, Hollowshift) pass after Lucky in the same run.
- [ ] `build:firebase` passes with corrected scoped CSS selector.
- [ ] Standard production `build` passes on the same exact revision.
- [ ] Pages artifact upload/deployment succeeds on that exact revision.

## Active production-build defect and repair

Run `38121283719` proved the complete browser contract, then failed at the first production build. Vite 8.3.4 / LightningCSS reported `Unexpected token Delim('*')` at `.lsc*,.lsc*::before,.lsc*::after`. The root cause is malformed selector syntax: the intended scoped descendants were missing the descendant combinator spaces. The repository's working Royal Fortune pattern is `.rf *,.rf *::before,.rf *::after`.

The current repair changes **only** the malformed selector to `.lsc *,.lsc *::before,.lsc *::after`. The production build failure itself is the exact red test for this parser seam; no duplicate test or unrelated refactor is justified.

## Final Game Assembly & Verification Checklist

- [x] Console/runtime gameplay browser quality gate passes.
- [x] Responsive viewport/reflow contract passes at 320px and 200% text.
- [x] Persistence/reload/restore behavior is verified through the playable workspace.
- [x] Dependency exact pins/current-version checks remain green through run `38121283719`.
- [x] TRACKER, PRD, GAME_INDEX, authoritative spec, todo and `.tasks` are synchronized for the active build repair.
- [ ] Full canonical validation passes on the exact final functional revision.
- [ ] GitHub Pages deploy succeeds for that exact revision.
- [ ] Mark Complete / Verified only after all game-local release gates are evidenced; TASK-003 may remain externally blocked.
