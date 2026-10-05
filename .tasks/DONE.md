# Done

## TASK-000: Repository foundation
Docs, governance, task tracking, Pages workflow and an empty-catalog app shell. See `.tasks/WORK_LOG.md`.

## TASK-002: Commit the lockfile
Committed `pnpm-lock.yaml`, restored pnpm caching, and switched CI to `pnpm install --frozen-lockfile`. Verified on main commit `1cef80a`: frozen install, typecheck, game check, unit tests and build all passed.

## PLATFORM-001 repository implementation

Shared optional Auth/Firestore account-save code and both game migrations are implemented and emulator-verified. Live Firebase platform completion remains tracked in `.tasks/IN_PROGRESS.md` and blocked on TASK-003 only. See `docs/FIREBASE_SETUP.md` and the additive work-log entry for validation scope.

## TASK-001: Enable GitHub Pages

Completed 2026-10-04. Pages source is GitHub Actions; re-running the previously failed deployment produced successful `actions/configure-pages` and `actions/deploy-pages` steps. Ordinary validated pushes to `main` deploy automatically.

## GAME-002: Royal Palace Blackjack

Completed as an independent production game on 2026-10-05. The six-deck S17/3:2 table, betting modifiers, insurance, surrender, one split/DAS/split-Ace behavior, strategy coaching, durable guest/shared-platform checkpoints, procedural WebAudio, responsive/accessibility behavior and catalog integration are implemented and covered by unit, emulator and deterministic Chromium regressions. A browser regression exposed stale shoe reuse during immediate Double/split-Ace transitions and verified the fix. Game Studio/live mobile review exposed a lone-action two-column layout defect; the TDD red run `37255355764` was resolved by the minimal `:only-child` grid-span fix, and run `37255447688` passed the full validation chain and Pages deployment. Live Firebase account services remain the shared external TASK-003 blocker and are not part of this game-completion claim.

## GAME-001: Threefold

Completed as an independent production game on 2026-10-05. Deterministic solvable rounds, five-round scoring, alternate-solution acceptance, responsive native-button gameplay, keyboard/touch parity, non-color selection state, live round/result feedback, reduced motion, defensive guest persistence, best-score reset and shared-platform account checkpoints are covered by unit, emulator and Chromium browser evidence. Independent Game Studio/Firecrawl phone QA found no remaining game-local clipping, overlap, target-size or accessible-name defect. Real Firebase account services remain the shared external TASK-003 blocker and are not part of this game-completion claim.

## DESIGN-001: Global and per-game design refinement

Completed 2026-10-05. The InMo Game Cabinet shell, account/save surfaces, Threefold puzzle-board identity and Royal Palace private-table identity are implemented and protected by `DESIGN.md`, design lint and rendered browser regressions. Live Game Studio/Firecrawl QA across the catalog, Threefold and Royal Palace found and drove fixes for the shared 44px brand target, semantic H2 game-card titles and Royal Palace's compact lone-action layout. Catalog H1/H2 hierarchy, phone stacking, shared target sizing, 320px/200% reflow, light/dark and local contrast, keyboard focus/activation, reduced motion and game-specific interaction/a11y flows are now gated in CI. Live Firebase project verification remains a separate PLATFORM-001/TASK-003 concern.

## DOCS-001: Per-game completion and continuation contract

Completed 2026-10-05. Every game requires exactly one authoritative dated spec sheet with a machine-checked Completion contract and one live `TRACKER.md` handoff containing implementation state, last verified revision, open game-local work, external blockers and next action. Structural checks reject missing specs/handoffs and inconsistent verified claims. The history-aware `scripts/game-doc-sync.mjs` layer additionally rejects game source/test/index changes unless the authoritative spec and tracker are updated together in the same integrated commit, including generic evidence files that reference the game route/source. CI evaluates every commit in a pushed range, so later cleanup cannot retroactively repair a stale game checkpoint. `AGENTS.md`, `GOVERNANCE.md`, `README.md`, `docs/DOCUMENTATION_STANDARD.md` and D-019 make this non-staleness rule provider-independent and mandatory.
