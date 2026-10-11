# Lucky Seven Classic design

**Status:** Implementing — engine and settled persistence verified; consolidated UI/browser TDD opening  
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

Each reel is a source-controlled ordered 32-stop strip. Production uses `crypto.getRandomValues()` with rejection sampling; tests inject deterministic stops. Per-reel counts are Cherry 5, Lemon 5, Orange 5, Plum 4, Bell 3, BAR 3, Double BAR 2, Triple BAR 2, Red 7 2, Gold 7 1. Exhaustive enumeration of all 32³ states verifies 94.775390625% theoretical RTP, 42.047119140625% paying-result frequency and 1/32,768 three-Gold-7 probability. Random-source failure must occur before wager mutation.

## Bankroll and persistence

Initial bankroll is 500 virtual credits. Local key is `inmogames:lucky-seven-classic:v1`; cloud slug is `lucky-seven-classic`. Schema-v1 durable state contains only settled bankroll, selected wager, spin/wager/win/net statistics, largest win, boolean sound/motion preferences and last completed center-line result. In-flight reel/animation state is excluded.

`settleLuckySevenSpin` is pure: it verifies sufficient bankroll, evaluates the configured center line, and returns a fully settled immutable next state. `decodeLuckySevenSave` rejects malformed/unsafe/inconsistent accounting, unsupported wagers, unknown symbols or invalid preferences/results. `restorePracticeCredits` restores only a below-minimum bankroll to 500 while preserving durable history/preferences. Generic guest/account save mechanics use the already-tested shared platform; configured live Firebase remains TASK-003.

## Mechanical cabinet interaction contract

The playable UI uses a scoped `.lsc` cabinet with exactly three `.lsc-reel` columns and three visible `.lsc-symbol` cells per reel (previous/center/next). The center row is visually marked and also explicitly labelled **Center payline** in text. Vintage enamel/metal framing, warm reel paper, restrained red/black/gold accents and large symbols differentiate the cabinet from Royal Fortune.

The canonical action is a native button labelled `Pull / Spin · N credit(s)`; any lever treatment is decorative and never drag-required. Wager controls expose the five supported wagers. The logical result is generated and settled before finite presentation motion. Rapid repeat activation is phase-guarded. RNG failure displays a nonblocking explanation and leaves bankroll unchanged.

A collapsed **Paytable & rules** disclosure is available before first spin. **Preferences & saved game** exposes sound and cabinet-motion controls plus game-local reset when implemented. Audio is opt-in and Web Audio is created only after a user enables sound and triggers play. Procedural cues may represent pull/reel-stop/win/non-win; no ambient loop.

## Accessibility and responsive contract

- Native controls; primary spin target at least 48 CSS px tall.
- Keyboard Space/Enter operates the spin button; no action requires drag/hover/audio/color/motion.
- A polite result/status region communicates classification and payout in text.
- 320 CSS-px layout has no page-level horizontal overflow.
- At 200% browser text sizing, primary action and all gameplay remain reachable without horizontal overflow.
- `prefers-reduced-motion: reduce` suppresses reel/lever travel while preserving immediate result/state updates.
- Safe-area-aware normal flow; no fixed control surface may obscure content or focus.

## Consolidated browser quality gate

`tests/browser/lucky-seven-classic.mjs` is the single game-specific browser suite to avoid duplicate harness cost. It verifies:

1. route/cabinet renders exactly 3 reels × 3 visible symbols and exposes rules/payline text;
2. primary action is ≥48px and 320px has no horizontal overflow;
3. injected RNG failure does not deduct from the 500-credit bankroll;
4. injected Gold-7 stops `[20,18,17]`, triggered through keyboard Space, settle a one-credit wager to bankroll 999 and report `3 Gold 7s`;
5. sound-off play creates no AudioContext, while explicit sound opt-in plus a user spin does;
6. reduced-motion context suppresses reel animation;
7. settled bankroll/spin count survive reload;
8. 200% text retains no horizontal overflow and leaves the primary action available;
9. a valid depleted persisted fixture restores only bankroll to 500 while preserving nine completed spins.

The RED integration deliberately wires this browser suite into `test:design-browser` before Lucky Seven is added to `src/catalog.ts`/`src/games/workspaces.tsx` or the placeholder workspace is replaced. Therefore the expected RED is the missing `.lsc` playable route/cabinet, not a test-setup failure.

## Architecture

- `reels.ts`: symbols, ordered strips, visible windows and unbiased production stop source.
- `paytable.ts`: supported wagers and multipliers.
- `engine.ts`: center-line classification, spin projection and exhaustive audit.
- `storage.ts`: schema-v1 durable state and decoder.
- `persistence.ts`: shared save definition, atomic settlement and restore.
- `audio.ts`: planned opt-in procedural cues.
- `LuckySevenClassicWorkspace.tsx`: currently placeholder; next GREEN implementation becomes the accessible cabinet/state machine.
- `lucky-seven-classic.css`: planned scoped cabinet/responsive system.
- `lucky-seven-classic.meta.ts`: metadata; catalog registration remains intentionally absent for browser RED.

## Implementation evidence

- Engine RED: `1085f461f474f9d5ac1976a991d4f6079a9aae75` / run `38098884217`.
- Engine GREEN: `de1136d18390b1044eab16475fab5aee31b2c6f6` / run `38099279607`.
- Persistence RED: `eb89b259c60a3a12c9a832db94ea21602035d1eb` / run `38099468454`.
- Persistence GREEN functional revision: `a72d095e3569b056b211803335e6b6d401e048bb` / run `38099724416`; typecheck, game-check, full unit/rules/account/browser/design-browser steps and both builds passed before the consolidated UI RED was opened. Pages deployment was still completing at that moment.

## Completion contract

**Completion state:** implementing  
**Completion evidence:** Engine/probability and game-local persistence contracts are green through revision `a72d095e3569b056b211803335e6b6d401e048bb` / run `38099724416`; playable cabinet/release verification remains open.

- [x] Pure reel/paytable/engine behavior is implemented and exhaustively probability-audited.
- [x] Game-local schema-v1 decoder/save-definition/settlement/restore behavior passes unchanged focused tests.
- [ ] Mechanical cabinet UI, keyboard/touch behavior, paytable/help, audio preference and finite motion meet the approved interaction contract.
- [ ] 320px, 200%-text and reduced-motion browser regressions pass without page-level horizontal overflow or obscured controls.
- [ ] Catalog/workspace routing, PRD, TRACKER, todo, GAME_INDEX and `.tasks` are synchronized through the completed implementation history.
- [ ] `pnpm validate` passes on the exact final functional revision.
- [ ] GitHub Pages deployment succeeds for that exact final functional revision.
- [ ] Tracker/completion state become verified only after exact revision/run evidence exists; TASK-003 may remain externally blocked.
