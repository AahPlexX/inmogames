# GOVERNANCE.md

Binding repository-mutation rules for InMo Games.

## Integration

1. `origin/main` is the only integrated branch. Commit directly to it.
2. Do not create long-lived branches. Do not leave pull requests open.
3. Before every mutation, compare your last known `main` tip with the live remote ref. If another agent advanced it, refresh and reconcile before writing.
4. No force-pushes and no destructive history edits.
5. Commit messages use `type: summary` (`feat`, `fix`, `docs`, `test`, `chore`).

## Plan checks

Before a change is final, test it for syntax errors, semantic errors, dependency or ordering failures, conflicts with existing content, regressions, edge cases, secret exposure and unverifiable assumptions. Unresolvable issues become named blockers in `.tasks/`; do not improvise past them.

## Per-game documentary continuity

Per-game documentation is a release-control surface, not optional prose.

1. Every `src/games/<slug>/` game must have exactly one authoritative spec sheet at `docs/specs/YYYY-MM-DD-<slug>-design.md` and one `TRACKER.md` live handoff.
2. The spec owns the individual game's Completion contract. The tracker owns the current resume point. `docs/GAME_INDEX.md` and `.tasks/` must agree with them.
3. Any material game behavior/scope/rule/persistence/UI change or discovered unresolved defect reopens a verified game before or with implementation: spec `Completion state` becomes `implementing`, the applicable checklist/tracker capability is reopened, and the handoff names the next action.
4. A game may be marked `verified` only when every applicable Completion-contract checkbox is checked, no game-local tracker capability remains `planned`, `started` or `blocked`, exact evidence is recorded, and required validation/deployment is green.
5. A shared external dependency may remain `blocked externally` only when it is explicitly named and does not conceal unfinished game-local work. Emulator/repository verification must not be described as live verification.
6. Before any provider stops, the affected game's tracker must be accurate enough that a different provider with no prior chat context can continue without guessing.
7. `pnpm game:check` is a mandatory enforcement gate. Do not disable, bypass, weaken or special-case the checker to preserve a stale or unsupported completion claim.

A stale spec or tracker is itself incomplete work. Chat history, provider memory or an old completion statement never overrides the current spec/tracker pair on `main`.

## Dependency integration

Every direct runtime/development dependency must be the latest stable release at the moment a change reaches `main`, pinned to an exact version. Dependency research must use the package/project's authoritative release source and be corroborated against npmjs.com. The researched target set is recorded in `.tasks/dependency-refresh-request.json` and the evidence record in `docs/DEPENDENCY_POLICY.md`.

CI must run both `pnpm dependency:check` and `pnpm dependency:current`. The first rejects non-exact specifications; the second rejects a package/manifest mismatch or a direct dependency that no longer equals npm's stable `latest` tag. A new upstream stable release therefore blocks a later integration until the repository is deliberately refreshed and fully revalidated.

## Platform boundary

The application remains a static frontend, with GitHub Pages as the canonical deployment target. Optional Firebase Hosting compatibility may remain as a secondary static host and is not required for account/save functionality. Firebase Authentication and Cloud Firestore are the only approved managed backend services for account identity and account-bound save data unless a later decision explicitly expands this boundary.

Game code must use the shared platform abstraction rather than introducing independent backend clients.

## Secrets and client configuration

No secrets, privileged keys or tokens belong in the repository or client bundle. Service-account JSON, private keys, Firebase Admin credentials and equivalent privileged material are forbidden.

Firebase Web configuration is public client configuration and may be supplied to the static frontend. It must never be treated as authorization. Authorization and per-user data isolation must be enforced by Firebase Authentication plus Firestore Security Rules.

## Completion

A workstream is complete only when:

1. The validation checks (including Auth/save behavior, Firestore rules, per-game documentation contract and browser emulator tests) are green on the exact integrated `main` revision.
2. GitHub Pages deployment for that revision succeeded when the deployed app changed.
3. `.tasks/` and `docs/GAME_INDEX.md` reflect the final state.
4. Every affected game's authoritative spec sheet and tracker are synchronized with shipped behavior, verification evidence, blockers and next action.
5. A game marked verified satisfies its own Completion contract; a provider may not substitute a generic completion opinion for that checklist.
6. Firebase account/save work distinguishes repository/emulator verification from real project and deployed-site verification. Missing real Firebase project configuration remains an explicit external blocker.

## Governance history

- 2026-10-03 - Repository established, modeled on the InMo Tools governance concepts.
- 2026-10-04 - Platform boundary updated: static GitHub Pages frontend retained; Firebase Authentication and Cloud Firestore approved for optional accounts and account-bound game saves; privileged credentials remain prohibited.
- 2026-10-04 - GitHub Pages bootstrap completed and deployment verified. Normal pushes to `main` run validation and deploy automatically; maintenance commits created with `GITHUB_TOKEN` explicitly dispatch the Pages workflow because GitHub suppresses recursive push-workflow triggers from that token.
- 2026-10-04 - Dependency integration strengthened: all direct dependencies/devDependencies must be current stable npm `latest`, exact-pinned, researched against authoritative release documentation plus npmjs.com, and gated by both static pin checks and live npm freshness checks.
- 2026-10-05 - Per-game completion and continuation became a binding repository invariant: each game requires one authoritative spec Completion contract plus a live tracker handoff, and `pnpm game:check` rejects missing/stale documentary structure or inconsistent verified claims.
