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
