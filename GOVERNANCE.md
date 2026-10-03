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

## Secrets

No secrets, keys or tokens in the repository. The platform has no use for them.

## Completion

A workstream is complete only when:

1. The validation job is green on the exact integrated `main` revision.
2. GitHub Pages deployment for that revision succeeded when the deployed app changed.
3. `.tasks/` and `docs/GAME_INDEX.md` reflect the final state.

## Governance history

- 2026-10-03 - Repository established, modeled on the InMo Tools governance concepts.
