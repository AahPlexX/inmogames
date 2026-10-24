# Decision log

## D-030 Shared save migration hook and downgrade protection (2026-10-24)

Implements the platform half of Mergrove MER-020 (F02, F03, F05): `GameSaveDefinition.migrate` and `priorStorageKeys`, prior-version local key reads kept until the new write succeeds, a Firestore transactional save that refuses to overwrite a newer stored `schemaVersion`, a `firestore.rules` update guard that refuses to lower `schemaVersion`, and an actionable "refresh the page" message. Contract and limits: `docs/FIREBASE_ARCHITECTURE.md` section "Schema versions, migration and downgrade protection".

Choices: migration runs on read and the migrated envelope is persisted by the next save. Account cache keys stay version-scoped so a stale older tab cannot overwrite a newer version's cache. The rules guard is the only protection against a stale older tab (it writes without a transaction) and takes effect only after the rules are published; live publishing is blocked by TASK-003, so the guard is verified in the emulator only. Platform unit tests no longer import game code, which keeps per-game documentation sync out of platform changes.

Consequence: any game may now raise its `schemaVersion` without making existing saves unreadable. First consumer: Cloudline Couriers (CLC-009, CLC-012). Mergrove v2 game-side items (MER-020-F01, F04) remain roadmap work.

## D-029 Pin patched transitive dependencies with scoped pnpm overrides (2026-10-24)

The GitHub dependency-graph SBOM for `main` (SPDX, 665 unique npm package names, version-identical to the pre-change `pnpm-lock.yaml`) carries no advisory data. `pnpm audit` against that lockfile reported 17 advisories (6 high, 8 moderate, 3 low), all in transitive packages reached through `firebase` and `firebase-tools`; every direct dependency was already the exact npm `latest` release, so a direct bump could not fix them. D-017's latest-stable gate governs direct dependencies only.

Decision: `package.json` carries a `pnpm.overrides` block. Every entry is a `name@vulnerable-range` selector mapped to one exact patched version, so only the vulnerable range is rewritten and other majors are untouched. A bare package name (a global pin) or a semver range as the target is rejected by `pnpm dependency:check`. The full table, with advisory IDs, lives in `docs/DEPENDENCY_POLICY.md` under "Transitive security overrides".

Maintenance rule: an override is a temporary patch, not a permanent pin. At each dependency refresh, run `pnpm audit`, delete every override the upstream package now satisfies natively, and keep the table in `docs/DEPENDENCY_POLICY.md` in step with `package.json`. This supersedes the "no transitive override was performed" clause of D-028 and resolves SECURITY-001. Overrides never relax D-017: they are additive and do not replace exact pins or the `dependency:current` gate.

## D-028 Close the release repair with exact evidence (2026-10-23)

Cloudline client fixes and Cascade CV-004/CV-005 are released in functional `2628ca27e8aa95778203f78848d30df31e60f25e`, CI/Pages run `40034775904`, with live Chromium smoke on 2026-10-23.
Cascade’s required refreshed 10M acceptance passed unchanged in run `40036114157`; the game-local approved scope is verified.
Cloudline’s expanded PRD remains implementing and human comprehension/art/motion approval awaits human testing.
Node-only Firebase gRPC advisories and the preserved Mergrove branch remained separate backlog work (`.tasks/BACKLOG.md`); no transitive override, shared-history rewrite or branch deletion was performed at that time. *(Superseded in part by D-029 on 2026-10-24: the advisories were resolved with scoped overrides. The Mergrove branch review, INTEGRATION-001, is still open.)*

## D-027 Preserve the prototype console gate by repairing its icon (2026-10-23)

The Hollowshift v2 public prototype reuses `public/icon.svg` through a relative icon link after the unchanged browser console gate reproduced `/favicon.ico` HTTP 404 (`tests/browser/hollowshift-prototype.mjs`).

## D-026 Resume the specified Cascade Vault screen to unblock Cloudline deployment (2026-10-23)

The Cloudline client-fix implementation tranche is closed on local functional revision `1d0c269`; its automated acceptance is GREEN, while the full game PRD, human comprehension and deployed sign-off remain open (`docs/specs/2026-10-06-cloudline-couriers-design.md`).
D-022 sequencing now resumes the already-specified Cascade Vault CV-004 screen and CV-005 route integration because its preserved missing-route RED blocks the shared full validator and Cloudline deployment (`tests/browser/cascade-vault.mjs`).
The existing Cascade engine, audited distribution/paytable and save schema remain unchanged; no validation or deployment gate is removed.

## D-025 Official npm registry metadata is the fallback for unavailable npmjs pages (2026-10-23)

The owner approved official npm registry package metadata as corroboration when a package's npmjs.com page is unavailable, including the reported HTTP 403 condition. The package/project's authoritative release source remains independently required; the official registry `latest` endpoint must return the exact same stable version, and its URL, returned version, check date and page-unavailability evidence must be recorded in `docs/DEPENDENCY_POLICY.md`. This resolves D-024's open question.

This decision changes only the evidence path. Exact pins, target-manifest/lockfile synchronization, `pnpm dependency:check`, `pnpm dependency:current`, frozen install, full validation and deployment requirements remain unchanged. It does not waive validation, authorize a dependency change without the required gates, or claim integration/deployment. The 2026-10-23 endpoint audit corroborated the existing target manifest; dependency refresh remains in progress.

## D-024 Dependency corroboration question (resolved by D-025, 2026-10-23)

Historical owner question resolved by D-025: may official npm registry metadata substitute for npmjs.com package-page corroboration while required pages return HTTP 403 (`docs/DEPENDENCY_POLICY.md`)? The target manifest matches current official registry metadata; dependency refresh was not integrated at the time this question was opened (`.tasks/dependency-refresh-request.json`, 2026-10-23 metadata check).

## D-023 Cloudline discloses account precedence before cached play (2026-10-23)

Cloudline shows an account-precedence warning during initial reads and keeps cached play available (`src/games/cloudline-couriers/CloudlineCouriersWorkspace.tsx`, `docs/FIREBASE_ARCHITECTURE.md`).
CLC-009-A2 initial-hydration blocking is excluded under the existing nonblocking platform contract; CLC-009-A3 owns the warning acceptance.
The route-atlas layout replaces the duplicate title hero and keeps flight controls below the map (`src/games/cloudline-couriers/cloudline-couriers.css`).
The attempted map-center text/control layout is excluded at 320px/200% text because it overlaps route tiles (`tests/browser/cloudline-couriers-design.mjs`).

## D-022 Game presentation quality proceeds one game at a time (2026-10-22)

Animation, effects, interaction and first-session presentation quality work is serialized by game. Cloudline Couriers is the active game-quality workstream until its active tranche is explicitly closed; other game quality workstreams remain preserved but paused rather than being developed in parallel. This changes work sequencing only and does not reduce any game's existing PRD, verification or completion requirements.

## D-021 Cascade Vault uses one proportional D6 correction before payout-attribution instrumentation (2026-10-20)

The D5 10,000,000-spin audit is the calibration authority and rejected RTP `0.87157806` with zero corruption-guard hits. D6 preserves the frozen distribution and changes only integer-centi paytable values by the midpoint ratio `0.955 / 0.87157806`. Bounded payout-contribution diagnostics are deferred unless D6 fails the >=10M acceptance gate, because the current award function is linear in paytable values and a direct proportional correction is the smaller complete change.

## D-020 Cascade Vault balance freezes board distribution before final paytable calibration (2026-10-20)

Cascade Vault keeps the guard-safe D3 distribution with blank weight 30 fixed while CV-002 completes paytable-only calibration. D4 audit `39461954213` had zero corruption-guard hits and unchanged cascade/feature metrics but RTP `1.1440064`; D5 therefore changes only integer-centi paytable values toward the 0.955 midpoint. The 50-cascade limit remains a fault guard, not a normal settlement rule.

## D-001 Games-only sibling of InMo Tools (2026-10-03)

InMo Games reuses the InMo Tools concept (static, local-first, GitHub Pages, spec plus tracker per item) but contains games only. Tools stay in `inmotools`.

## D-002 Stack (2026-10-03)

React, TypeScript, Vite, pnpm, Vitest. Chosen to match InMo Tools so patterns transfer.

## D-003 Hash routing (2026-10-03)

Routes are `#/games/<slug>`. This works on GitHub Pages without fallback files. Trade-off: fragment routes are not reliably indexed by search engines as separate pages. InMo Tools records the same limitation.

## D-004 Direct commits to main (2026-10-03)

No branches or pull requests. Validation runs on every push to `main` and deployment is gated on it.

## D-005 Lockfile bootstrap (2026-10-03)

The first commit has no `pnpm-lock.yaml`, so CI installs with `--no-frozen-lockfile`. After the first local `pnpm install`, commit the lockfile and switch CI to `--frozen-lockfile`.

## D-006 Dependency maintenance follows the direct-main rule (2026-10-03)

Automated version-update pull requests are disabled because this repository does not use pull requests. Dependency updates are researched against authoritative release documentation, corroborated with npmjs.com, expressed as explicit exact targets, fully validated, and committed directly to `main`. The maintenance workflow may apply an explicit researched target set and commit it only after full validation; it never chooses a prerelease or blindly upgrades to an unreviewed target.

## D-007 Exact direct dependencies (2026-10-03)

Direct runtime and development dependencies are pinned to exact versions and must equal npm's stable `latest` tag at integration time. The lockfile remains authoritative for the full transitive graph. `dependency:check` enforces exact syntax; `dependency:current` compares the researched target manifest to `package.json` and npm's live stable tag. Dependency upgrades are deliberate main-branch changes that must pass frozen install and the full validation workflow.

## D-008 Pages bootstrap remains a one-time repository setting (2026-10-03)

The deployment workflow uses the default `GITHUB_TOKEN` only. Current `actions/configure-pages` documentation requires a different token with elevated repository permissions when `enablement: true` is used. InMo Games will not add a privileged token just to automate a one-time setting, so Pages must be enabled once in Settings > Pages with GitHub Actions as the source.

## D-009 Vite Pages base path (2026-10-03)

The production base is `/inmogames/`, matching Vite's current GitHub Pages guidance for a project site hosted at `<owner>.github.io/<repo>/`. Hash routing remains under that static project path. If the site later moves to a custom domain or an owner-level Pages repository, this base decision must be revisited.

## D-010 Firebase account and save platform (2026-10-04)

InMo Games retains a static React/Vite frontend on GitHub Pages but now supports optional user accounts and cross-device persistent game data through Firebase Authentication and Cloud Firestore. This supersedes the original no-auth/no-database/no-runtime-network platform restriction.

No custom application server is introduced. Runtime network access is restricted to the site's static assets and the Firebase services required by the shared authentication/save layer unless a later decision explicitly expands the platform boundary.

## D-011 Guest-first hybrid persistence (2026-10-04)

Account creation is optional. Guests continue to play with browser-local persistence. Authenticated players use Cloud Firestore as the authoritative account save with a browser-local mirror/cache.

Games must not call Firestore directly from their workspaces or engines. Shared platform repositories own cloud/local selection, serialization, migration and error handling. Each persistent game owns a versioned game-state schema.

When a user signs in and no cloud save exists for a game, eligible local progress may seed the account save. When a cloud save already exists, it is authoritative; implementations must not silently overwrite it with unrelated guest progress.

## D-012 Firebase security boundary (2026-10-04)

Firebase Web configuration is public browser configuration and is not an authorization secret. Privileged credentials—including service-account JSON, private keys and Firebase Admin credentials—must never enter the repository or client bundle.

Firestore Security Rules must deny access by default and permit a signed-in user to read/write only their own account-save documents. Initial account saves use the path `users/{uid}/games/{gameSlug}`. Security enforcement belongs in Firestore rules, not merely in React route/UI checks.

## D-013 Firebase Hosting is optional and separate from account persistence (2026-10-04)

The repository already contains a secondary Firebase Hosting build/configuration path. It is retained as optional static-host compatibility only. GitHub Pages remains the canonical deployment target.

Firebase Authentication and Cloud Firestore must work from the GitHub Pages build and must not require Firebase Hosting. Hosting project selection/deployment is a separate lower-priority task and must not block account/save implementation.

## D-014 Shared account-save implementation (2026-10-04)

The modular `firebase@12.19.0` SDK is pinned exactly after checking official Firebase documentation/release notes and the npm latest tag. Optional email/password Auth uses browser-local persistence and an explicit in-memory fallback when storage is blocked. Firestore Lite supplies direct server reads/writes; the shared platform owns per-user local mirrors, ordered checkpoint queues and nonblocking retry. Pure engines remain unchanged and Firebase-free.

Each game owns a version-1 schema. Atomic first-load migration seeds guest progress only if the account document is absent. Existing account saves take precedence. Account reset writes the game's default envelope instead of deleting its document, preventing old guest state from reseeding a reset game. Guest reset removes only the selected local key. Pending retry intent lives in the current page; a successful load after reload/sign-out gives cloud state precedence.

Blackjack persists only completed settlements and preferences merged into the last committed balance. Staged chips and unfinished rounds never alter durable credit totals. Threefold persists only a best completed five-round score. The Security Rules require ownership plus a versioned map/server-time envelope. Unit, Firebase-supported rules emulator and Chromium Auth/save emulator tests are required validation checks. Console provisioning, actual email delivery and deployed-site verification remain external requirements described in `docs/FIREBASE_SETUP.md`.

## D-015 Validation precedes Pages configuration (2026-10-04)

The build job validates both host builds plus unit/rules/browser tests and uploads the Pages artifact without requiring an enabled Pages site. The deployment job configures Pages immediately before deploying. This keeps exact-revision validation independent of the known external Pages-enable task while retaining deployment gating and the default GitHub token. No privileged enablement workaround is added.

## D-016 Automatic Pages deployment after validated main integration (2026-10-04)

GitHub Pages is enabled with GitHub Actions as its source. `.github/workflows/pages.yml` runs on every ordinary push to `main` and on manual dispatch; the deploy job depends on successful validation/build. A commit created by a workflow with `GITHUB_TOKEN` does not recursively emit another push workflow, so the dependency-maintenance workflow explicitly dispatches `pages.yml` after a successful bot commit. This preserves automatic deployment for every supported `main` integration path without adding a privileged external token.

## D-017 Latest-stable direct dependency gate (2026-10-04)

Every direct `dependencies` and `devDependencies` package must be the stable npm `latest` release when integrated, pinned exactly with no caret/range. Before integration, its target version is checked against the project's authoritative release source and npmjs.com and recorded in `docs/DEPENDENCY_POLICY.md` plus `.tasks/dependency-refresh-request.json`. CI additionally queries npm's live `latest` endpoint on each `main` validation. If a stable release appears before a later integration, validation blocks until the dependency set is deliberately refreshed and the full suite passes.

## D-018 Shared game-cabinet design system (2026-10-04)

InMo Games uses a shared product-shell visual system documented in `DESIGN.md`, with runtime shared tokens owned by `src/styles.css`. The shell uses a restrained blue-enamel/ivory/brick/brass language and system fonts only. Catalog, navigation, account/save surfaces, focus treatment and spacing remain shared.

Individual games may use scoped material identities when they support the game itself. Threefold uses a tactile paper/tile puzzle-board language; Royal Palace Blackjack uses a private felt/card-table language. Game-local styling must not redefine shared navigation, account, save, accessibility or responsive contracts.

`pnpm design:check` validates DESIGN.md on every normal Pages integration and through aggregate validation.

## D-019 Per-game documentation must be current at every integrated checkpoint (2026-10-05)

A game's authoritative spec sheet and live tracker are part of that game's implementation, not deferred documentation. Any change to `src/games/<slug>/`, game-specific tests/evidence, or the game's `docs/GAME_INDEX.md` row must update both the authoritative dated spec and `TRACKER.md` in the same commit/integration. Updating one without the other is invalid.

`scripts/game-doc-sync.mjs` is the history-aware enforcement layer behind `pnpm game:check`. Normal push validation fetches full history and supplies the pre-push base; each commit in the pushed range is evaluated separately, so a later documentation-only commit cannot retroactively repair an earlier stale game commit. Generic test files are mapped to games when they reference `src/games/<slug>` or `#/games/<slug>`. Local and maintenance validation also checks staged/working changes and a previous-commit fallback.

This rule exists so any provider or agent can resume from any integrated checkpoint using repository state alone. Hidden chat history, provider memory, or a promise to update docs later is never a valid continuation mechanism.
