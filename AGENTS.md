# AGENTS.md

Rules for every contributor and agent working in InMo Games.

## Platform rules

These are binding defaults. Change them only through an explicit repository decision recorded in `docs/DECISIONS.md`.

- The frontend remains a static React/Vite application. GitHub Pages is the canonical deployment target. Optional Firebase Hosting compatibility may remain as a secondary static target, but it must not become a prerequisite for authentication, saves or ordinary development. Do not add a custom application server.
- Firebase Authentication and Cloud Firestore are the approved managed backend services for optional user accounts and account-bound game persistence.
- Guest play remains supported. Guest saves use browser-local storage; authenticated saves use the shared Firebase save layer and may keep a browser-local cache.
- Runtime network access is limited to the site's own static files plus the Firebase endpoints required by the shared authentication/save platform. Games must not add arbitrary third-party APIs, telemetry, ads or runtime assets without a new explicit decision.
- No privileged Firebase credential may enter client code or the repository. Service-account JSON, private keys, Admin SDK credentials and secret tokens are forbidden. Firebase Web configuration is public client configuration, not an authorization secret; Firestore Security Rules enforce data ownership.
- Every asset (art, audio, fonts, word lists) must be original or have a redistribution-compatible licence recorded in the game's `TRACKER.md`.

Game-specific consequences:

- A game must not call Firebase directly from scattered UI code. Account/save behavior goes through shared platform modules.
- Persistent game data must have a documented schema version and migration behavior.
- Active/transient game state is persisted only when the game spec explicitly requires it.
- Online leaderboards and server-authoritative multiplayer remain out of scope unless separately designed and approved.

Default integration rule: if a feature fits these rules, build it and document it (spec, tracker, `.tasks/`). Exclude a feature only when it conflicts with these rules, a source's terms/licence, security requirements, or the static-client/Firebase platform boundary.

## Branch rule

Work on `origin/main` only. Commit directly to `main`; do not leave branches or open pull requests. See `GOVERNANCE.md`.

## Per-game continuity contract

This is mandatory for every game, regardless of provider, model or implementation stage.

- Each game has exactly one authoritative spec sheet at `docs/specs/YYYY-MM-DD-<slug>-design.md`. That spec defines rules/scope and contains the authoritative `## Completion contract` with `**Completion state:**`, `**Completion evidence:**` and at least six explicit checklist gates.
- Each game has `src/games/<slug>/TRACKER.md`. It is the live operational handoff and must contain `## Current handoff` with `Implementation state`, `Last verified revision`, `Open game-local work`, `External blockers` and `Next action`.
- A game implementation change or game-specific test/evidence change is invalid unless the authoritative spec **and** tracker are updated in the same commit/integration. Do not defer either document to a later response, turn, provider or cleanup commit.
- Spec and tracker edits are paired: changing one without the other is invalid. A `docs/GAME_INDEX.md` row/status change for a game also requires both game documents in the same integration.
- Generic browser/evidence files still count as game-specific when they reference that game's `src/games/<slug>` path or `#/games/<slug>` route.
- Starting new game-local work on a verified game automatically reopens it. Change the spec's `Completion state` to `implementing`, reopen/add the applicable checklist gate and tracker capability, update the current handoff, and keep `docs/GAME_INDEX.md` consistent before or with the implementation change.
- A game may return to `verified` only when every applicable spec checklist item is checked, the tracker has no `planned`, `started` or game-local `blocked` capability, evidence is recorded, task/index state agrees, and required validation/deployment has passed.
- External platform blockers may remain explicitly `blocked externally` without making otherwise complete game-local implementation incomplete, but the spec and handoff must identify the exact blocker and must never imply live verification that did not occur.
- Before stopping work for any reason, leave the tracker handoff accurate enough that a different provider with no chat context can continue without guessing.
- `pnpm game:check` runs both structural/completion validation and the history-aware same-integration freshness check. Bypassing, weakening or special-casing either check is not an acceptable way to make CI pass.

Older chat messages, summaries or provider memory never override the current per-game spec/tracker pair on `main`.

## Where things live

- `src/catalog.ts` - the list of games.
- `src/games/<slug>/` - one folder per game: `<slug>.meta.ts`, `<Name>Workspace.tsx`, engine modules, `TRACKER.md`.
- `src/games/workspaces.tsx` - lazy workspace registry keyed by slug.
- `src/platform/` - shared platform concerns such as Firebase bootstrap, authentication and game-save repositories.
- `DESIGN.md` - durable visual identity, semantic token intent and cross-game design rules.
- `docs/FIREBASE_ARCHITECTURE.md` - authoritative account/save platform contract.
- `docs/FIREBASE_SETUP.md` - Console/build configuration and live verification requirements.
- `docs/DOCUMENTATION_STANDARD.md` - naming, required docs, per-game continuity/completion contract and definition of done.
- `docs/DEPENDENCY_POLICY.md` - authoritative direct-dependency freshness and evidence requirements.
- `docs/DECISIONS.md` - decision log.
- `docs/GAME_INDEX.md` - one row per game.
- `.tasks/` - task state.

## Adding a game

1. Add the authoritative spec sheet at `docs/specs/YYYY-MM-DD-<slug>-design.md`, including an `implementing` Completion contract before implementation begins.
2. Add `src/games/<slug>/` with the files listed above, including a tracker whose Current handoff describes the actual first implementation step.
3. Register it in `src/catalog.ts` and `src/games/workspaces.tsx`.
4. Add a row to `docs/GAME_INDEX.md` and unit tests for the engine.
5. If the game persists data, define its save schema/version and guest/account behavior without bypassing the shared save repository.
6. Every later game-local source/test/index change must carry both spec and tracker updates in that same integration; keep task state synchronized whenever state/blockers change.
7. Run `pnpm validate`; mark the game verified only when its own Completion contract and the repository definition of done are satisfied.

## Dependency integration

- Every direct `dependencies` and `devDependencies` entry must be the latest stable npm `latest` release at the time it is integrated to `main`.
- Direct dependency specifications are exact semver only. Never use `^`, `~`, `*`, tags, URLs or ranges in `package.json`.
- Before changing a dependency, verify the stable release against the package/project's authoritative release documentation and corroborate the exact version on npmjs.com. Record the evidence in `docs/DEPENDENCY_POLICY.md` and update `.tasks/dependency-refresh-request.json`.
- `pnpm dependency:check` enforces exact pins. `pnpm dependency:current` verifies the manifest matches `package.json` and rechecks every direct package against npm's live `latest` tag. Both are mandatory integration gates.
- A prerelease (`alpha`, `beta`, `rc`, `next`, canary, experimental) is never substituted for stable `latest` unless a separate explicit repository decision changes this rule.

## Design integration

- Read `DESIGN.md` before creating or materially changing any product/game UI.
- `src/styles.css` is the canonical runtime owner for shared product tokens; `DESIGN.md` mirrors those accepted values and rationale. Change both in the same changeset for durable system decisions.
- Shared chrome (catalog, navigation, account/save UI, focus language) must remain consistent. Individual games may use scoped local palettes/material metaphors when they reinforce gameplay, but must not redefine shared account/navigation behavior.
- No runtime third-party fonts or decorative assets are required by the design system. Prefer system typography and repository-authored CSS/art.
- `pnpm design:check` is a mandatory integration gate and uses the pinned Google Labs DESIGN.md validator.
- Material UI changes must also pass `pnpm test:design-browser`. That rendered Chromium gate checks catalog recomposition, keyboard skip/focus behavior, 320 CSS-px and 200% text reflow, non-color selection state, game touch targets and reduced-motion behavior. Do not replace it with source inspection alone.

## Code standards

- Keep game rules in pure engine modules (no React, DOM, Firebase, storage or audio) so they can be unit tested.
- Responsive layout with flexbox/grid and CSS `clamp()` typography; no horizontal overflow at 320 CSS px.
- Keyboard and touch operable; respect `prefers-reduced-motion`.
- YAGNI, KISS, DRY.
