# Backlog

- Shared game helpers (seeded random, local best-score storage, pause on tab hidden): add only when a second game needs them.
- Tool-route search indexing: hash routes are not reliably indexed (see D-003).

- INTEGRATION-001: selectively review and reconcile remote branch `mergrove-v1.1-balance-and-presentation` (`1a5cc149c817c59ce83e2a2eda791a2c258c834e`) against main before any deletion. Eleven commits are not reachable from main; the comparison spans 41 files / 4,348 insertions. Do not wholesale merge or delete it. Required audit points: (1) shared-save migration/downgrade protection was introduced in `8e12b8f` then reverted in `9c4c30e`; inspect the final tree and transaction/version invariants against the current shared-save contract before selectively adopting anything; (2) its package snapshot is stale against the current target set (`firebase@12.19.0`, `firebase-tools@15.32.1`, `@firebase/rules-unit-testing@5.0.2`, `vite@8.3.3`, `playwright@1.63.0`) and it adds lint/coverage/Knip scripts and dependencies that need separate policy/currentness review; (3) its `vite.config.ts` replacement drops the existing conditional `CASCADE_VAULT_AUDIT=1` test discovery, risking omission of the opt-in Cascade acceptance harness. Preserve conditional audit discovery when reconciling. Work remains deferred outside the completed client-triage/release-repair scope; no merge/deletion was performed. Sources: `git log origin/main..origin/mergrove-v1.1-balance-and-presentation`, `git diff --stat origin/main...origin/mergrove-v1.1-balance-and-presentation`, and branch diffs for `package.json`, `vite.config.ts`, `.github/workflows/pages.yml`, 2026-10-23.

- SECURITY-001: **resolved 2026-10-24** by D-029 (scoped `pnpm.overrides`; full record in `.tasks/DONE.md` and `docs/DEPENDENCY_POLICY.md` → "Transitive security overrides"). `pnpm audit` on the patched lockfile reports no known vulnerabilities.

- SECURITY-002: confirm GitHub's own alert state after the SECURITY-001 fix is on `main`. The agent environment that applied the fix cannot read the Dependabot alerts API (HTTP 403 on 2026-10-23), so "GitHub shows zero open alerts" is unverified; only `pnpm audit` and the SBOM/lockfile cross-check are. Action: after the integrating commit is on `main` and the dependency graph refreshes, open the repository's Security → Dependabot page; for any alert still open, compare its GHSA to the table in `docs/DEPENDENCY_POLICY.md` and either add a scoped override (D-029) or record why it is accepted. Also remove an override whenever `firebase`/`firebase-tools` natively resolves the patched version.

## Resume here

**Current state:** SECURITY-001 is resolved (D-029). INTEGRATION-001 still preserves the pre-existing Mergrove branch. SECURITY-002 is the only open dependency-security item and is a verification step, not a known vulnerability.
**Next action:** SECURITY-002 once the fix is on `main` and CI/Pages is green; INTEGRATION-001 review before any branch adoption/deletion.
**Blockers:** GitHub Dependabot alert detail is not readable from the agent environment (HTTP 403); a human or a token with `security_events` access must confirm the alert count.
