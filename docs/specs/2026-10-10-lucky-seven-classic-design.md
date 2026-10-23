# Lucky Seven Classic design

**Status:** Verified — 2026-10-11 production implementation, browser quality and release validation complete; live Firebase configured-project verification remains externally blocked by TASK-003  
**Last synchronized:** 2026-10-23
**Shared dependency refresh:** Firebase 13.1.0 and Vite 8.3.5 are the requested shared targets in `docs/DEPENDENCY_POLICY.md` and `.tasks/dependency-refresh-request.json`; local refreshed full validation passed on 2026-10-23; committed CI/Pages evidence remains pending. No game-local behavior, save schema, completion state, or prior verification evidence changed.
**Route:** `#/games/lucky-seven-classic`

## Product intent

Lucky Seven Classic is a standalone three-reel mechanical-style slot, intentionally distinct from Royal Fortune Slots and Cascade Vault. It uses virtual practice credits only: no deposits, purchases, cash-out, ads, telemetry, real-money value or gambling-account functionality. Rules and payout information are available before the first spin.

## Core rules

- 3 reels × 1 evaluated center payline; neighboring symbols are presentation only.
- Wagers: 1, 2, 5, 10 and 25 virtual credits.
- Symbols: Cherry, Lemon, Orange, Plum, Bell, BAR, Double BAR, Triple BAR, Red 7 and Gold 7.
- Cherry precedence: 1 Cherry = 1×, 2 = 3×, 3 = 10×.
- Without Cherries, three non-identical BAR-family symbols = Mixed BAR 5×.
- Otherwise only an exact three-symbol match pays: Lemons 10×, Oranges 16×, Plums 24×, BAR 30×, Double BAR 60×, Bells 80×, Triple BAR 120×, Red 7s 200×, Gold 7s 500×.
- Exactly one classification pays per spin.
- No Wild, Scatter, autoplay, cascading, bonus wheel, progressive jackpot, Hold/Nudge or adaptive odds in v1.

## Probability and reel model

Each reel is a source-controlled ordered 32-stop strip. Production uses `crypto.getRandomValues()` with rejection sampling; tests inject deterministic stops. Per-reel counts are Cherry 5, Lemon 5, Orange 5, Plum 4, Bell 3, BAR 3, Double BAR 2, Triple BAR 2, Red 7 2, Gold 7 1. Exhaustive enumeration of all 32³ states verifies 94.775390625% theoretical RTP, 42.047119140625% paying-result frequency and 1/32,768 three-Gold-7 probability. Random-source failure occurs before wager mutation.

## Bankroll and persistence

Initial bankroll is 500 virtual credits. Local key is `inmogames:lucky-seven-classic:v1`; cloud slug is `lucky-seven-classic`. Schema-v1 durable state contains only settled bankroll, selected wager, spin/wager/win/net statistics, largest win, boolean sound/motion preferences and last completed center-line result. In-flight reel/animation state is excluded.

`settleLuckySevenSpin` verifies sufficient bankroll, evaluates the configured center line, and returns a fully settled immutable next state. `decodeLuckySevenSave` rejects malformed/unsafe/inconsistent accounting, unsupported wagers, unknown symbols or invalid preferences/results. `restorePracticeCredits` restores only a below-minimum bankroll to 500 while preserving durable history/preferences. Generic guest/account save mechanics use the shared platform. Configured live Firebase remains the separate TASK-003 platform blocker.

## Mechanical cabinet interaction contract

The playable UI uses a scoped `.lsc` cabinet with exactly three `.lsc-reel` columns and three visible `.lsc-symbol` cells per reel (previous/center/next). The center row is visually marked and explicitly labelled **Center payline** in its own visible text element; decorative diamonds are separate `aria-hidden` siblings.

The canonical action is a native button labelled `Pull / Spin · N credit(s)`; any lever treatment is decorative and never drag-required. The five supported wagers are native buttons. A spin obtains the random reel windows and fully settles durable state before presentation motion. Rapid repeat activation is phase-guarded. RNG failure reports a nonblocking message and does not consume virtual credits.

A collapsed **Paytable & rules** disclosure is available before first spin. **Preferences & saved game** exposes sound, cabinet motion and a two-step game-local reset. Audio is opt-in; Web Audio is created only after sound is enabled and the player triggers a spin. Procedural pull/stop/win cues are finite and optional, with no ambient loop.

The completed-spin footer exposes spin count, cumulative wagered and returned virtual credits. The meter exposes bankroll, current wager, cumulative net and largest win. Reload reconstructs a stable visible reel window around the saved center symbols when a last result exists; exact reel-stop/animation state is intentionally not durable.

## Accessibility and responsive contract

- Native controls; primary spin target at least 48 CSS px tall.
- Keyboard Space/Enter operates the spin button; no action requires drag/hover/audio/color/motion.
- A polite `.lsc-status` region communicates result classification and payout in text.
- Browser result assertions read the live status region rather than globally matching paytable copy.
- The semantic `Center payline` label is independently discoverable as exact visible text.
- 320 CSS-px layout has no page-level horizontal overflow.
- At 200% browser text sizing, primary action and gameplay remain reachable without horizontal overflow.
- `prefers-reduced-motion: reduce` and the in-game motion preference suppress reel/lever travel while preserving immediate result updates.
- Safe-area-aware normal flow; no fixed action surface obscures content or focus.
- Visible focus treatment is mandatory for buttons and disclosures.

## Consolidated browser quality gate

`tests/browser/lucky-seven-classic.mjs` is the single game-specific browser suite. It verifies:

1. exactly 3 reels × 3 visible symbols plus textual rules/payline;
2. primary action ≥48px and 320px no horizontal overflow;
3. injected RNG failure preserves bankroll 500;
4. injected Gold-7 stops `[20,18,17]`, triggered with keyboard Space, settle a one-credit wager to bankroll 999 and report `3 Gold 7s` in the live result status;
5. sound-off play creates no AudioContext while explicit sound opt-in plus user-triggered play does;
6. reduced-motion context suppresses reel animation;
7. settled bankroll and spin count survive reload;
8. 200% text retains no horizontal overflow and primary-action access;
9. a valid depleted saved fixture restores bankroll to 500 while retaining nine completed spins.

The Red-7 sound fixture is `[0,9,14]`, the actual Red-7 positions for the three source-controlled reels. The original `[0,0,0]` fixture was corrected before GREEN because reel 2/3 position 0 are not Red 7. The expected `3 Red 7s` behavior was never weakened.

## Production CSS/build contract

Lucky Seven styling is scoped to `.lsc`. Descendant box sizing uses valid `.lsc *`, `.lsc *::before`, `.lsc *::after` selectors. Run `38121283719` exposed the malformed predecessor `.lsc*` through Vite 8.3.4 / LightningCSS production minification with `Unexpected token Delim('*')`. Functional repair `bd5b1cf1c12bc218eca17557caaa9cc0ff92fc0a` changed only the missing descendant spaces. Run `38121621987` then exposed a documentation-structure regression before builds; the follow-up restored required todo structure without changing the source repair. Exact revision `04ae049259232edf9ec5af4aa63d4786d8673ba4` subsequently passed both production builds and Pages deployment.

## Architecture

- `reels.ts`: symbols, ordered strips, visible windows and unbiased production stop source.
- `paytable.ts`: supported wagers and multipliers.
- `engine.ts`: center-line classification, spin projection and exhaustive audit.
- `storage.ts`: schema-v1 durable state and decoder.
- `persistence.ts`: shared save definition, atomic settlement and restore.
- `audio.ts`: opt-in procedural cues; failure never affects gameplay.
- `LuckySevenClassicWorkspace.tsx`: shared-save adapter plus accessible cabinet state machine, rules/preferences, reset and semantic payline label.
- `lucky-seven-classic.css`: scoped responsive cabinet, finite normal motion, reduced-motion override, 320px/200%-text reflow and production-valid descendant box sizing.
- `lucky-seven-classic.meta.ts`: catalog metadata.
- `src/catalog.ts` / `src/games/workspaces.tsx`: discoverable catalog entry and lazy route registration.

## Implementation evidence

- Engine RED `1085f461f474f9d5ac1976a991d4f6079a9aae75` / `38098884217`; GREEN `de1136d18390b1044eab16475fab5aee31b2c6f6` / `38099279607`.
- Persistence RED `eb89b259c60a3a12c9a832db94ea21602035d1eb` / `38099468454`; GREEN `a72d095e3569b056b211803335e6b6d401e048bb` / `38099724416`.
- UI/browser RED `66f0f7a54c7fad33f6ee4953ee6b5220e4e40f58` / `38100222862`.
- Payline semantic repair `3e662d79645151e7e7fbc7eb666dd2fd273fbe9e` after run `38100732011`.
- Tree-identical `8cf51f00d14fdf0e2902600719017aff095837a3` / `38120980679` proved semantic repair and exposed harness-only duplicate-text ambiguity.
- `3b3faa1a95a04752c813acbcb9e09b3112945ec6` / `38121283719` passed the complete browser suite and exposed production CSS RED at `build:firebase`.
- CSS repair `bd5b1cf1c12bc218eca17557caaa9cc0ff92fc0a` / `38121621987` was stopped by task-document governance before builds; source repair remained unchanged.
- **Final functional GREEN:** `04ae049259232edf9ec5af4aa63d4786d8673ba4` / GitHub Actions run `38121766726`. Dependency exact/current checks, design lint, TypeScript, history-aware game governance, 117 unit tests, Firestore rules, shared account/persistence browser, the entire design-browser chain including Lucky Seven, Firebase-root production build, standard production build, Pages artifact upload and GitHub Pages deployment all succeeded.

## Completion contract

**Completion state:** verified  
**Completion evidence:** Exact functional revision `04ae049259232edf9ec5af4aa63d4786d8673ba4` passed the complete validation and GitHub Pages deployment chain in run `38121766726`. TASK-003 remains the named external live-Firebase blocker only.

- [x] Pure reel/paytable/engine behavior is implemented and exhaustively probability-audited.
- [x] Game-local schema-v1 decoder/save-definition/settlement/restore behavior passes focused tests.
- [x] Mechanical cabinet UI, keyboard/touch behavior, paytable/help, audio preference and finite motion pass the consolidated browser contract.
- [x] 320px, 200%-text and reduced-motion browser regressions pass without horizontal overflow or obscured controls.
- [x] Corrected scoped CSS passes both production builds.
- [x] Catalog/workspace routing, PRD, TRACKER, todo, GAME_INDEX and `.tasks` are synchronized through final verification.
- [x] Full canonical validation passes on the exact final functional revision.
- [x] GitHub Pages deployment succeeds for that exact final functional revision.
- [x] Tracker/completion state is verified with exact revision/run evidence; TASK-003 remains externally blocked.
