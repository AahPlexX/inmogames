# Done

## TASK-000: Repository foundation
Docs, governance, task tracking, Pages workflow and an empty-catalog app shell. See `.tasks/WORK_LOG.md`.

## TASK-002: Commit the lockfile
Committed `pnpm-lock.yaml`, restored pnpm caching, and switched CI to `pnpm install --frozen-lockfile`. Verified on main commit `1cef80a`: frozen install, typecheck, game check, unit tests and build all passed.

## PLATFORM-001 repository implementation

Shared optional Auth/Firestore account-save code and both game migrations are implemented and emulator-verified. Live platform completion remains tracked in `.tasks/IN_PROGRESS.md` and blocked on TASK-003/TASK-001. See `docs/FIREBASE_SETUP.md` and the additive work-log entry for validation scope.
