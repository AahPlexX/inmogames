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

## Platform boundary

The deployable application remains a static GitHub Pages frontend. Firebase Authentication and Cloud Firestore are the only approved managed backend services for account identity and account-bound save data unless a later decision explicitly expands this boundary.

Game code must use the shared platform abstraction rather than introducing independent backend clients.

## Secrets and client configuration

No secrets, privileged keys or tokens belong in the repository or client bundle. Service-account JSON, private keys, Firebase Admin credentials and equivalent privileged material are forbidden.

Firebase Web configuration is public client configuration and may be supplied to the static frontend. It must never be treated as authorization. Authorization and per-user data isolation must be enforced by Firebase Authentication plus Firestore Security Rules.

## Completion

A workstream is complete only when:

1. The validation job is green on the exact integrated `main` revision.
2. GitHub Pages deployment for that revision succeeded when the deployed app changed.
3. `.tasks/` and `docs/GAME_INDEX.md` reflect the final state.

## Governance history

- 2026-10-03 - Repository established, modeled on the InMo Tools governance concepts.
- 2026-10-04 - Platform boundary updated: static GitHub Pages frontend retained; Firebase Authentication and Cloud Firestore approved for optional accounts and account-bound game saves; privileged credentials remain prohibited.
