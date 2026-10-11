# Lucky Seven Classic design

**Status:** Implementing — engine and settled persistence verified; cabinet semantic-label repair awaiting GREEN  
**Last synchronized:** 2026-10-10  
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

`settleLuckySevenSpin` verifies sufficient bankroll, evaluates the configured center line, and returns a fully settled immutable next state. `decodeLuckySevenSave` rejects malformed/unsafe/inconsistent accounting, unsupported wagers, unknown symbols or invalid preferences/results. `restorePracticeCredits` restores only a below-minimum bankroll to 500 while preserving durable history/preferences. Generic guest/account save mechanics use the already-tested shared platform; configured live Firebase remains TASK-003.

## Mechanical cabinet interaction contract

The playable UI uses a scoped `.lsc` cabinet with exactly three `.lsc-reel` columns and three visible `.lsc-symbol` cells per reel (previous/center/next). The center row is visually marked and explicitly labelled **Center payline** in its own visible text element; decorative diamonds remain separate `aria-hidden` siblings. Vintage enamel/metal framing, warm reel paper, restrained red/black/gold accents and large symbols distinguish the machine from Royal Fortune.

The canonical action is a native button labelled `Pull / Spin · N credit(s)`; any lever treatment is decorative and never drag-required. The five supported wagers are native buttons. A spin obtains the random reel windows and fully settles the durable state before presentation motion. Rapid repeat activation is phase-guarded. RNG failure reports a nonblocking message and does not consume virtual credits.

A collapsed **Paytable & rules** disclosure is available before first spin. **Preferences & saved game** exposes sound, cabinet motion and a two-step game-local reset. Audio is opt-in; Web Audio is created only after sound is enabled and the player triggers a spin. Procedural pull/stop/win cues are finite and optional, with no ambient loop.

The completed-spin footer exposes spin count, cumulative wagered and returned virtual credits. The meter exposes bankroll, current wager, cumulative net and largest win. Reload reconstructs a stable visible reel window around the saved center symbols when a last result exists; exact reel-stop/animation state is intentionally not durable.

## Accessibility and responsive contract

- Native controls; primary spin target at least 48 CSS px tall.
- Keyboard Space/Enter operates the spin button; no action requires drag/hover/audio/color/motion.
- A polite status region communicates result classification and payout in text.
- The semantic `Center payline` label is independently discoverable as exact visible text; decorative symbols do not alter its text identity.
- 320 CSS-px layout has no page-level horizontal overflow.
- At 200% browser text sizing, primary action and all gameplay remain reachable without horizontal overflow.
- `prefers-reduced-motion: reduce` and the in-game motion preference suppress reel/lever travel while preserving immediate state/result updates.
- Safe-area-aware normal flow; no fixed action surface may obscure content or focus.
- Visible focus treatment is mandatory for buttons and disclosures.

## Consolidated browser quality gate

`tests/browser/lucky-seven-classic.mjs` is the single game-specific browser suite. It verifies:

1. exactly 3 reels × 3 visible symbols plus textual rules/payline;
2. primary action ≥48px and 320px no horizontal overflow;
3. injected RNG failure preserves bankroll 500;
4. injected Gold-7 stops `[20,18,17]`, triggered with keyboard Space, settle a one-credit wager to bankroll 999 and report `3 Gold 7s`;
5. sound-off play creates no AudioContext while explicit sound opt-in plus user-triggered play does;
6. reduced-motion context suppresses reel animation;
7. settled bankroll and spin count survive reload;
8. 200% text retains no horizontal overflow and primary-action access;
9. a valid depleted saved fixture restores bankroll to 500 while retaining nine completed spins.

The Red-7 sound fixture is `[0,9,14]`, the actual Red-7 positions for the three source-controlled reels. The original `[0,0,0]` fixture was identified before GREEN implementation as incorrect because reel 2/3 position 0 are not Red 7. The test assertion remains `3 Red 7s`; this is a deterministic fixture correction, not weaker coverage.

## Architecture

- `reels.ts`: symbols, ordered strips, visible windows and unbiased production stop source.
- `paytable.ts`: supported wagers and multipliers.
- `engine.ts`: center-line classification, spin projection and exhaustive audit.
- `storage.ts`: schema-v1 durable state and decoder.
- `persistence.ts`: shared save definition, atomic settlement and restore.
- `audio.ts`: opt-in procedural cues; failure never affects gameplay.
- `LuckySevenClassicWorkspace.tsx`: shared-save adapter plus accessible cabinet state machine, rules/preferences, reset, and standalone semantic payline label.
- `lucky-seven-classic.css`: scoped responsive cabinet, finite normal motion, reduced-motion override and 320px/200%-text reflow.
- `lucky-seven-classic.meta.ts`: catalog metadata.
- `src/catalog.ts` / `src/games/workspaces.tsx`: discoverable catalog entry and lazy route registration.

## Implementation evidence

- Engine RED: `1085f461f474f9d5ac1976a991d4f6079a9aae75` / run `38098884217`.
- Engine GREEN: `de1136d18390b1044eab16475fab5aee31b2c6f6` / run `38099279607`.
- Persistence RED: `eb89b259c60a3a12c9a832db94ea21602035d1eb` / run `38099468454`.
- Persistence GREEN: `a72d095e3569b056b211803335e6b6d401e048bb` / run `38099724416`; full build and Pages deployment succeeded.
- History-sync diagnostics: `a8da91b63a5e43fc049def1ab869659fbeb4f57f` / `38099964934` and `1074ad595271b5c60c0e83632dd9bde86726bead` / `38100085348` stopped before Playwright and are not UI RED evidence.
- UI/browser RED: `66f0f7a54c7fad33f6ee4953ee6b5220e4e40f58` / run `38100222862`. Dependency freshness, design lint, typecheck, game governance, 117 unit tests, rules, shared account browser, catalog/shared design regressions, all Royal Palace suites and Royal Fortune browser checks passed. Lucky Seven then failed exactly on `locator('.lsc')` timeout because the playable route/cabinet did not yet exist.
- First cabinet candidate source revision `ab6651d6788371b15b0164fe5c3f04c65095ea41` was exercised unchanged by descendant run `38100732011`. All pre-browser gates and earlier browser suites again passed. Lucky Seven advanced into its own assertions and failed only because `getByText('Center payline', { exact: true })` could not match the container text `◆ Center payline ◆`. This is a production semantic-markup defect. The repair makes `Center payline` a standalone visible span while decorative diamonds remain `aria-hidden`; no assertion is weakened.

## Completion contract

**Completion state:** implementing  
**Completion evidence:** Engine/probability and persistence are green through `a72d095e3569b056b211803335e6b6d401e048bb` / run `38099724416`; the exact UI/browser RED is `66f0f7a54c7fad33f6ee4953ee6b5220e4e40f58` / run `38100222862`; run `38100732011` exposed the first real cabinet semantic-label defect and the production repair is awaiting GREEN.

- [x] Pure reel/paytable/engine behavior is implemented and exhaustively probability-audited.
- [x] Game-local schema-v1 decoder/save-definition/settlement/restore behavior passes unchanged focused tests.
- [ ] Mechanical cabinet UI, keyboard/touch behavior, paytable/help, audio preference and finite motion pass the fixed browser contract.
- [ ] 320px, 200%-text and reduced-motion browser regressions pass without horizontal overflow or obscured controls.
- [ ] Catalog/workspace routing, PRD, TRACKER, todo, GAME_INDEX and `.tasks` remain synchronized through the completed implementation history.
- [ ] `pnpm validate` passes on the exact final functional revision.
- [ ] GitHub Pages deployment succeeds for that exact final functional revision.
- [ ] Tracker/completion state become verified only after exact revision/run evidence exists; TASK-003 may remain externally blocked.
