# Done

## GAME-ROYAL-FORTUNE-001: Royal Fortune Slots

Completed game-locally on 2026-10-10. Royal Fortune Slots ships a standalone 5 × 3 video-slot engine with five explicit 32-stop reels, twenty fixed paylines, Wild and Scatter rules, 8/12/20 player-paced free spins, +5 retriggers, a winning-free-spin multiplier capped at ×5, schema-v1 durable checkpoints, practice-credit restore, procedural opt-in Web Audio, transparent paid-spin net wording, responsive/reduced-motion presentation and catalog integration. Exact source-derived probability analysis binds the configured long-run theoretical return to 99.4307658688%, including the free-spin recurrence. Exact functional revision `e89b9c64eada44a4a5953c17072d57b7d940b4d2` passed dependency freshness, design lint, TypeScript, game/document governance, unit tests including the complete probability audit, Firestore rules, account/persistence browser checks, the full shared design suite, Royal Fortune RNG-failure/reload/restore/320px/200%-text/audio regressions, both production builds and GitHub Pages deployment in run `38090041520`. TASK-003 remains the separate external blocker for real configured-project Firebase verification and is not part of this game-local completion claim.

## GAME-003: Mergrove

Completed game-locally on 2026-10-06. Mergrove ships an original deterministic 5 × 5 placement/cascade merge loop, eight repository-authored SVG spirit tiers, orthogonal merges and cascades, chain scoring, sunlight/Compost recovery, bounded Groveheart ancient blooms, guest active-run persistence and shared account-save integration. Exact revision `965c91a5b9090da321ae3eb0d11f9383678b02c6` passed dependency freshness, design lint, TypeScript, game/document integrity, unit tests, Firestore rules, Mergrove Auth/Firestore emulator cross-browser/reset checks, rendered Mergrove responsive/keyboard/reduced-motion checks, both builds and GitHub Pages deployment in run `37553471015`. A fresh uncached production render of `#/games/mergrove` returned HTTP 200 with the expected three-Seed queue and empty 25-cell board. TASK-003 remains the shared external blocker for real configured-project Firebase verification and is not part of this game-local completion claim.

## TASK-000: Repository foundation
Docs, governance, task tracking, Pages workflow and an empty-catalog app shell. See `.tasks/WORK_LOG.md`.

## TASK-002: Commit the lockfile
Committed `pnpm-lock.yaml`, restored pnpm caching, and switched CI to `pnpm install --frozen-lockfile`. Verified on main commit `1cef80a`: frozen install, typecheck, game check, unit tests and build all passed.

## PLATFORM-001 repository implementation

Shared optional Auth/Firestore account-save code and game migrations are implemented and emulator-verified. Live Firebase platform completion remains tracked in `.tasks/IN_PROGRESS.md` and blocked on TASK-003 only. See `docs/FIREBASE_SETUP.md` and the additive work-log entry for validation scope.

## TASK-001: Enable GitHub Pages

Completed 2026-10-04. Pages source is GitHub Actions; re-running the previously failed deployment produced successful `actions/configure-pages` and `actions/deploy-pages` steps. Ordinary validated pushes to `main` deploy automatically.

## GAME-002: Royal Palace Blackjack

Completed as an independent production game on 2026-10-05. The six-deck S17/3:2 table, betting modifiers, insurance, surrender, one split/DAS/split-Ace behavior, strategy coaching, durable guest/shared-platform checkpoints, procedural WebAudio, responsive/accessibility behavior and catalog integration are implemented and covered by unit, emulator and deterministic Chromium regressions. A browser regression exposed stale shoe reuse during immediate Double/split-Ace transitions and verified the fix. Game Studio/live mobile review exposed a lone-action two-column layout defect; the TDD red run `37255355764` was resolved by the minimal `:only-child` grid-span fix, and run `37255447688` passed the full validation chain and Pages deployment. Live Firebase account services remain the shared external TASK-003 blocker and are not part of this game-completion claim.

## GAME-ROYAL-PALACE-002: Table experience and responsive motion polish

Completed game-locally on 2026-10-09. The presentation pass compacted Royal-only route chrome and empty pre-deal table geometry without changing blackjack rules, payouts, shoe logic, save schema, Firebase semantics, strategy logic or the audio contract. It preserves >=48px primary controls, keeps committed wagers visible through round review, places secondary rules/help behind primary actions, and adds finite tactile/card/result/dialog feedback with complete reduced-motion suppression. Exact revision `4814d85f375ccd90514252b07692c3c570ca410d` passed the full repository validation and GitHub Pages deployment chain in run `37994433846`. The dedicated Royal mobile-layout suite explicitly passed first-viewport Deal reachability, persistent wager state, card motion and compact multi-action play; shared 320px/200%-text, keyboard/touch, accessibility and reduced-motion regressions also passed. TASK-003 remains the separate external blocker for real configured-project Firebase verification and is not part of this game-local completion claim.

## GAME-001: Threefold

Completed as an independent production game on 2026-10-05. Deterministic solvable rounds, five-round scoring, alternate-solution acceptance, responsive native-button gameplay, keyboard/touch parity, non-color selection state, live round/result feedback, reduced motion, defensive guest persistence, best-score reset and shared-platform account checkpoints are covered by unit, emulator and Chromium browser evidence. Independent Game Studio/Firecrawl phone QA found no remaining game-local clipping, overlap, target-size or accessible-name defect. Real Firebase account services remain the shared external TASK-003 blocker and are not part of this game-completion claim.

## DESIGN-001: Global and per-game design refinement

Completed 2026-10-05. The InMo Game Cabinet shell, account/save surfaces, Threefold puzzle-board identity and Royal Palace private-table identity are implemented and protected by `DESIGN.md`, design lint and rendered browser regressions. Live Game Studio/Firecrawl QA across the catalog, Threefold and Royal Palace found and drove fixes for the shared 44px brand target, semantic H2 game-card titles and Royal Palace's compact lone-action layout. Catalog H1/H2 hierarchy, phone stacking, shared target sizing, 320px/200% reflow, light/dark and local contrast, keyboard focus/activation, reduced motion and game-specific interaction/a11y flows are now gated in CI. Live Firebase project verification remains a separate PLATFORM-001/TASK-003 concern.

## DOCS-001: Per-game completion and continuation contract

Completed 2026-10-05. Every game requires exactly one authoritative dated spec sheet with a machine-checked Completion contract and one live `TRACKER.md` handoff containing implementation state, last verified revision, open game-local work, external blockers and next action. Structural checks reject missing specs/handoffs and inconsistent verified claims. The history-aware `scripts/game-doc-sync.mjs` layer additionally rejects game source/test/index changes unless the authoritative spec and tracker are updated together in the same integrated commit, including generic evidence files that reference the game route/source. CI evaluates every commit in a pushed range, so later cleanup cannot retroactively repair a stale game checkpoint. `AGENTS.md`, `GOVERNANCE.md`, `README.md`, `docs/DOCUMENTATION_STANDARD.md` and D-019 make this non-staleness rule provider-independent and mandatory.

## DOCS-002: Verified-game contract integrity

Completed 2026-10-05. The structural game checker now parses tracker capability rows instead of relying on loose status text. It rejects unsupported states, missing terminal verification/rationale, vague verified completion evidence, spec/tracker state disagreement, verified handoffs that still name game-local work, and externally blocked capabilities without a named blocker. Regression fixtures cover each failure mode while keeping the implementation inside the existing checker with no new dependency or abstraction.
