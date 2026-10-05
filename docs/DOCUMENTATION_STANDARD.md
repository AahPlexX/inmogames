# Documentation standard

## Platform rules (apply to every game and every spec)

- **Static frontend.** React/Vite uses GitHub Pages as the canonical deployment target. Optional Firebase Hosting compatibility may exist as a secondary static host, but auth/save features must not depend on it. No custom application server is part of the application architecture.
- **Optional accounts are supported.** Firebase Authentication is the approved identity provider.
- **Account-bound persistence is supported.** Cloud Firestore is the approved cloud save store.
- **Guest play remains local-first.** Browser-local storage remains the guest/offline cache path where the game has persistent data.
- **Shared platform layer.** Games do not embed ad hoc Firebase calls. Authentication and account saves go through shared `src/platform/` modules.
- **Restricted runtime network.** Runtime calls may reach the site's static assets and the approved Firebase authentication/save services only unless a later repository decision says otherwise.
- **No privileged client credentials.** Service accounts, Admin credentials, private keys and secret tokens are forbidden in browser code or the repository.

The canonical account/save contract is `docs/FIREBASE_ARCHITECTURE.md`.

## Design system evidence

`DESIGN.md` is the durable visual contract. `src/styles.css` remains the canonical runtime token owner; DESIGN.md mirrors accepted shared values and explains intent. Game-specific visual systems stay scoped inside their game folder and must preserve shared shell/account/save/focus behavior. A substantial UI change must update DESIGN.md when it changes a durable visual rule, update the runtime owner in the same changeset, pass `pnpm design:check`, and pass `pnpm test:design-browser` for rendered browser evidence. The design-browser gate covers catalog recomposition, skip/focus behavior, 320 CSS-px and 200% text reflow, representative keyboard selection, touch target sizing and reduced motion. Source inspection alone is not sufficient evidence for those behaviors.

## Dependency evidence

All direct `dependencies` and `devDependencies` must be exact-pinned latest stable releases at integration time. Any dependency change requires current authoritative release evidence plus npmjs.com corroboration recorded in `docs/DEPENDENCY_POLICY.md`, an updated `.tasks/dependency-refresh-request.json`, a regenerated frozen lockfile, and successful `pnpm dependency:check`, `pnpm dependency:current`, and full validation. Prerelease channels are excluded unless separately approved by a repository decision.

## Naming convention

- Slug: lowercase kebab-case, unique, stable once published (`^[a-z0-9]+(-[a-z0-9]+)*$`).
- Display name: short, plain, title case.
- Folder: `src/games/<slug>/`. Meta file: `<slug>.meta.ts`. Workspace: `<PascalName>Workspace.tsx`.
- Route: `#/games/<slug>`.

## Required documents per game

Every game has exactly one authoritative spec sheet and one live tracker/handoff. These are not optional project notes; together they are the durable continuation contract for any future provider or agent.

### Authoritative spec sheet

Path: `docs/specs/YYYY-MM-DD-<slug>-design.md`.

It defines the game's product scope, rules, controls, scoring/progression, persistence/schema behavior, accessibility/responsive expectations, failure handling, exclusions and verification requirements. It must contain:

- `**Last synchronized:**`;
- `## Completion contract`;
- `**Completion state:** implementing` or `**Completion state:** verified`;
- `**Completion evidence:**` naming the best exact revision/run evidence available;
- at least six explicit Markdown checklist gates (`- [ ]` / `- [x]`) sufficient to determine whether the individual game is complete.

The Completion contract is authoritative for the word **complete**. A verified game must have every applicable checklist item checked. Any new game-local feature, rule, persistent state, material UI/UX change or newly discovered unresolved defect automatically reopens the game: set the completion state to `implementing`, add/reopen the corresponding checklist gate, update the tracker and index/task state, and do not restore `verified` until fresh evidence satisfies every applicable gate.

A game-specific contract may be stricter than the repository minimum and should add gates needed by that game's mechanics, data or interaction model. It may not weaken the repository-wide requirements below.

### Live tracker and resume handoff

Path: `src/games/<slug>/TRACKER.md`.

The tracker must link the exact authoritative spec path and keep the capability table current with status `planned`, `started`, `verified`, `blocked`, `blocked externally`, or `excluded` as appropriate. It must contain:

- `**Last synchronized:**`;
- `## Current handoff`;
- `**Implementation state:**`;
- `**Last verified revision:**`;
- `**Open game-local work:**`;
- `**External blockers:**`;
- `**Next action:**`.

The handoff must be accurate enough for a provider with no prior chat context to resume without guessing. Before ending a work session, update it if any implementation state, blocker, evidence, next action or scope changed.

### Same-integration freshness requirement

Game documentation is not allowed to trail implementation by even one integration.

- Any changed file under `src/games/<slug>/` other than `TRACKER.md` requires that game's authoritative spec **and** tracker in the same commit/integration.
- Any game-specific test/evidence change requires both documents in the same commit/integration. A generic test filename is still game-specific when its content references `src/games/<slug>` or `#/games/<slug>`.
- A spec edit and tracker edit are paired. Updating only one is invalid even when game source did not change.
- Changing that game's row/status in `docs/GAME_INDEX.md` requires both documents in the same integration.
- A later “documentation cleanup” commit does not cure a stale earlier game commit. CI evaluates each commit in the pushed range so every integrated checkpoint is resumable on its own.
- Game-specific tests should include the game slug in their path/name or reference the game source path/route so the freshness checker can map evidence deterministically.

The history-aware checker is `scripts/game-doc-sync.mjs`; it runs as part of `pnpm game:check`. GitHub Actions fetches full push history and supplies the pre-push base so all commits in a multi-commit push are evaluated individually. Local/maintenance validation falls back to the previous commit and also checks staged/working-tree changes.

### Index and task state

Each game also requires a row in `docs/GAME_INDEX.md` and matching `.tasks/` state. A game whose spec says `verified` must have an index row that says `verified game`; an implementing game must not be represented as verified. External shared-platform blockers must be named rather than silently folded into the game-local completion state.

`pnpm game:check` enforces both documentary structure/verified-state consistency and same-integration freshness. Do not bypass or weaken either check to obtain a green build.

## Persistence requirements per game

If a game has persistent data, its spec must state:

- local storage key/cache behavior;
- cloud game slug/document identity;
- save schema version;
- which state is durable versus intentionally transient;
- reset behavior;
- guest-to-account migration behavior;
- behavior when Firebase is unavailable or the user is signed out.

## Definition of done for a game

The individual game's own Completion contract is the deciding checklist, and at minimum it must cover all applicable items below:

- Playable start to finish on desktop and touch.
- Engine/rules tests pass for the game's material mechanics and edge cases.
- No horizontal overflow at 320 CSS px; keyboard operable; reduced motion respected.
- Material UI has rendered browser evidence for responsive/reflow/focus/target behavior rather than source-only claims.
- Any persistent game data has verified guest-local behavior and the shared account-save path has repository/emulator evidence when applicable.
- Save/reset/migration behavior is described in the spec and does not bypass the shared repository abstraction.
- Asset licences/runtime-network boundaries are documented and compliant.
- Tracker has no game-local capability left `planned`, `started` or `blocked` when the completion state is `verified`; `blocked externally` is allowed only for a clearly named dependency outside the finished game implementation.
- Spec, tracker, game index and `.tasks/` agree on state, evidence, blockers and continuation point.
- `pnpm validate` is green, including exact/current dependency gates, DESIGN.md validation, account/rules browser checks, design-browser checks, production builds, and successful Pages deployment when the deployed app changed.
- Firebase-enabled features distinguish repository/emulator verification from real configured-project/deployed-site verification; missing real Firebase configuration remains an explicit external blocker and must never be described as live-verified.

A game is not complete because an agent says it is, because the UI looks finished, or because a previous conversation called it finished. It is complete only when its authoritative spec sheet says `verified`, every applicable completion gate is checked, its tracker/index/task state agrees, and the recorded evidence supports those claims.

## Anti-staleness rule

Documentation changes are part of implementation, never follow-up cleanup. Any game source/test/index change and the corresponding authoritative spec+tracker changes must land together in the same commit/integration. If a provider must stop mid-change, that integrated commit must itself leave the tracker accurate, the spec completion contract truthful, and the exact next action recorded. Older chat context never overrides the current spec/tracker pair on `main`, and a later provider must be able to resume from any individual integrated game commit without relying on hidden conversation history.
