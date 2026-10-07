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

1. Every `src/games/<slug>/` game must have all four canonical game-local documents/surfaces:
   - exactly one authoritative spec at `docs/specs/YYYY-MM-DD-<slug>-design.md`;
   - `src/games/<slug>/TRACKER.md` as the live operational handoff;
   - `src/games/<slug>/PRD.md` as the complete feature inventory/product requirements document;
   - `src/games/<slug>/todo.md` as the execution and verification checklist.
2. The spec owns the individual game's Completion contract. The tracker owns the current resume point. The PRD owns the planned/implemented feature inventory. The todo owns feature-by-feature execution/sign-off state. `docs/GAME_INDEX.md` and `.tasks/` must agree with them.
3. `PRD.md` and `todo.md` are mandatory from the moment a game enters development. They are not optional planning notes and must never be replaced by chat history, provider memory, an issue, or an external document.
4. Every game implementation change and every game-specific test/evidence change must update both that game's spec and tracker in the same pushed integration. A game-index row/status change likewise requires both documents in the same integration. PRD/todo feature state must be reconciled in that integration whenever represented scope, implementation state, verification state, dependency use, or completion state changed.
5. Generic tests count as game-specific when their content references `src/games/<slug>` or `#/games/<slug>`. Evidence cannot be moved to a generic filename to bypass documentary synchronization.
6. Any material game behavior/scope/rule/persistence/UI change or discovered unresolved defect reopens a verified game before or with implementation: spec `Completion state` becomes `implementing`, the applicable PRD feature/todo item and tracker capability are reopened, and the handoff names the next action.
7. A game may be marked `verified` only when every applicable Completion-contract checkbox is checked, every applicable todo verification/sign-off item is checked, no game-local tracker capability remains `planned`, `started` or `blocked`, PRD feature states agree, exact evidence is recorded, and required validation/deployment is green.
8. A shared external dependency may remain `blocked externally` only when it is explicitly named and does not conceal unfinished game-local work. Emulator/repository verification must not be described as live verification.
9. Before any provider stops, the affected game's spec, tracker, PRD, and todo must be accurate enough that a different provider with no prior chat context can continue without guessing.
10. `pnpm game:check` is a mandatory enforcement gate. It checks structural/completion consistency, mandatory PRD/todo structure, the game-doc synchronization regression, and history-aware same-pushed-integration freshness. CI fetches sufficient history and evaluates the aggregate pushed integration from `GAME_DOC_SYNC_BASE` through `HEAD`. Do not disable, bypass, weaken or special-case the checker to preserve stale or unsupported state.

A stale spec, tracker, PRD, or todo is itself incomplete work. Chat history, provider memory or an old completion statement never overrides the current repository documents on `main`.

### Mandatory `PRD.md` structure

Every game PRD uses the following core structure exactly. Additional sections/fields are allowed when useful, but none of the required fields may be removed, renamed, or replaced:

```yaml
Planned Functional Features Specification:
  game_identity:
    name: "[Game Name]"
    slug: "[game-slug]"
    development_status: "''"

  technical_foundation:
    architecture_and_engine: "[Notes here (if applicable)]"
    dependencies_used: []

  core_feature_specifications:
    - name: "[Feature Name]"
      id: "''"
      details: "[Purpose, input parameters, behavior, boundaries, edge cases, and other implementation-significant requirements]"
      feature_development_status: "''"
```

Rules for this PRD structure:

- `game_identity.slug` must exactly match the `src/games/<slug>/` directory and catalog slug.
- Every separately implementable game capability belongs in `core_feature_specifications` with a stable non-empty `id`.
- `details` must be sufficient for another provider to understand intended behavior without relying on chat context; terse labels are insufficient.
- `feature_development_status` and top-level `development_status` must reflect repository reality, not aspiration.
- `dependencies_used` lists the direct/shared dependencies actually relevant to the game and must never imply a game-local dependency that does not exist.
- Additional quality/completion/originality/accessibility fields may be added after the required core structure but cannot substitute for it.

### Mandatory `todo.md` structure

Every game todo uses this structure. Wording may be game-specific, but the listed sections and per-feature fields are mandatory:

```md
# [Game Name] Execution Todo

**Status:** ...
**Architecture / engine:** ...
**Dependencies:**
- [ ] or [x] dependency / dependency policy item

## Core Feature Execution Pipeline

### [FEATURE-ID] — [Feature Name]
**Purpose:** ...
**Inputs:** ...
**Dependencies Touched:** ...
**Technical Notes & Edge Cases:** ...
**Implementation Details:** ...
**Verification & State Sign-off:**
- [ ] or [x] evidence/sign-off item

## Final Game Assembly & Verification Checklist

- [ ] Zero known uncaught game-local console errors/warnings and current applicable MDN/W3C/WCAG requirements satisfied.
- [ ] Responsive behavior verified across mobile, tablet, laptop, desktop, and large displays, including required 320 CSS-px and 200% text/reflow evidence where applicable.
- [ ] Persistence/reload/restart behavior verified and deterministic for the defined game/save contract.
- [ ] Dependency/devDependency policy verified: latest stable exact pins at integration time, authoritative-source + npmjs.com corroboration when dependency state changes, and no `^` or `~`.
- [ ] PRD, todo, TRACKER, authoritative spec, GAME_INDEX, and applicable task state are synchronized.
- [ ] Full repository validation is green on the exact integrated revision.
- [ ] GitHub Pages deployment and deployed-route smoke verification are green when the deployed app changed.
- [ ] Overall game state is changed to Complete/Verified only after every applicable gate above has evidence.
```

Rules for this todo structure:

- The Core Feature Execution Pipeline must cover every PRD `core_feature_specifications` ID exactly once; do not maintain hidden/untracked feature work.
- Each feature must include Purpose, Inputs, Dependencies Touched, Technical Notes & Edge Cases, Implementation Details, and Verification & State Sign-off.
- Checkboxes record evidence-backed state only. Do not pre-check implementation or verification that has not actually occurred.
- Final assembly/verification items are binding release gates, not suggestions.
- A feature, dependency, rule, UI/persistence behavior, defect, or verification change immediately updates the applicable PRD/todo state in the same development cycle.

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

1. The validation checks (including Auth/save behavior, Firestore rules, per-game documentation contract/freshness and browser emulator tests) are green on the exact integrated `main` revision.
2. GitHub Pages deployment for that revision succeeded when the deployed app changed.
3. `.tasks/` and `docs/GAME_INDEX.md` reflect the final state.
4. Every affected game's authoritative spec, tracker, PRD, and todo are synchronized with shipped behavior, verification evidence, blockers and next action in the same pushed integration as the affected game change.
5. A game marked verified satisfies its own Completion contract and final todo checklist; a provider may not substitute a generic completion opinion for those gates.
6. Firebase account/save work distinguishes repository/emulator verification from real project and deployed-site verification. Missing real Firebase project configuration remains an explicit external blocker.

## Governance history

- 2026-10-03 - Repository established, modeled on the InMo Tools governance concepts.
- 2026-10-04 - Platform boundary updated: static GitHub Pages frontend retained; Firebase Authentication and Cloud Firestore approved for optional accounts and account-bound game saves; privileged credentials remain prohibited.
- 2026-10-04 - GitHub Pages bootstrap completed and deployment verified. Normal pushes to `main` run validation and deploy automatically; maintenance commits created with `GITHUB_TOKEN` explicitly dispatch the Pages workflow because GitHub suppresses recursive push-workflow triggers from that token.
- 2026-10-04 - Dependency integration strengthened: all direct dependencies/devDependencies must be current stable npm `latest`, exact-pinned, researched against authoritative release documentation plus npmjs.com, and gated by both static pin checks and live npm freshness checks.
- 2026-10-05 - Per-game completion and continuation became a binding repository invariant: each game requires one authoritative spec Completion contract plus a live tracker handoff, and `pnpm game:check` rejects missing/stale documentary structure or inconsistent verified claims.
- 2026-10-05 - Per-game anti-staleness enforcement became history-aware: a game source/test/index change and its spec+tracker updates must land in the same pushed integration; CI validates the aggregate pushed range so multiple commits in one intentional integration do not produce false failures while deferred/one-sided documentation still fails.
- 2026-10-06 - Per-game PRD/todo governance standardized: every developing game requires canonical `src/games/<slug>/PRD.md` and `todo.md`, the required structures above are binding for all current/future games, and `pnpm game:check` enforces their presence and core schema.
