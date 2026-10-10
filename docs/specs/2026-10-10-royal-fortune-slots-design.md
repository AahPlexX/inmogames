# Royal Fortune Slots design

**Status:** Implementing — initial production integration under validation  
**Last synchronized:** 2026-10-10  
**Proposed route:** `#/games/royal-fortune-slots`

## Product intent

Royal Fortune Slots is the polished casino-floor member of a three-game slot family. It is a standalone InMo Games title rather than a skin over another slot engine. The game uses virtual credits only: no deposits, purchases, cash-out, ads, telemetry, real-money value, or gambling account functionality.

The experience is a five-reel, three-row video slot with twenty fixed paylines, a readable paytable, Wild and Scatter symbols, free-spin rounds, deterministic payout evaluation, finite audiovisual feedback, and optional local/account-bound persistence through the same shared platform used by other InMo Games titles.

The game must be understandable before the first spin. Rules, payline behavior, symbol values, feature triggers, and the fact that all credits are simulated practice credits remain available from the primary play surface without interrupting play.

## Core rules

- 5 reels × 3 visible rows.
- 20 fixed paylines; all paylines are always active.
- One configurable total wager per spin rather than per-line enable/disable complexity.
- Base wager steps: 5, 10, 20, 40, 100 virtual credits, bounded by available bankroll.
- Symbols: Crown, Ruby, Emerald, Chalice, Bell, A, K, Q, J, Wild, Scatter.
- Wild substitutes for all normal paying symbols except Scatter.
- Scatter pays independently of paylines and triggers free spins.
- Three or more Scatters anywhere trigger 8 free spins; four trigger 12; five trigger 20.
- Free spins use the triggering wager and cannot be manually increased mid-feature.
- During free spins, each completed winning spin advances a visible feature multiplier by +1 up to ×5; the multiplier applies to line wins only and resets when the free-spin feature ends.
- Additional Scatter triggers during free spins add 5 spins without resetting the multiplier.
- Multiple line wins on one spin add together. Scatter win is then added separately.
- A spin settles atomically: wager deduction and final payout are one durable logical transaction.
- No autoplay, turbo autoplay, losses-disguised-as-wins, near-miss manipulation, stake prompting, or adaptive/compensated outcome behavior.

## Probability and reel model

The engine uses explicit virtual reel strips rather than outcome tables hidden inside React state. Each reel owns an ordered symbol strip. A spin chooses one stop independently per reel using browser cryptographic randomness in production and an injected seeded source in tests. Visible rows derive from neighboring strip positions with wraparound.

Reel strips and the paytable are source-controlled constants so expected return and feature frequency can be calculated and regression-tested. Outcome probabilities never change in response to bankroll, recent wins/losses, session duration, or player behavior.

The implementation must include a probability audit test that exhaustively or analytically verifies the configured paytable/reel-strip combination and records the resulting theoretical RTP in the game tracker. The UI describes this as a simulated-game probability statistic, not a promise of future results.

## Bankroll and persistence

Initial practice bankroll: 2,500 virtual credits.

Local storage key: `inmogames:royal-fortune-slots:v1`.
Cloud game slug: `royal-fortune-slots`.

Persist only durable state:
- bankroll after a settled spin,
- selected base wager,
- lifetime spin count,
- cumulative virtual-credit wagered/won/net,
- largest single-spin win,
- sound preference,
- reduced-effects preference when explicitly chosen in-game,
- last completed base-game result summary.

Do not persist an in-flight reel animation or partially evaluated spin. Free-spin state may be checkpointed only after each free spin has fully settled so reload cannot duplicate or erase a settled award. If reload occurs during animation, restore the last completed checkpoint.

If bankroll falls below the minimum 5-credit wager, expose **Restore 2,500 practice credits**. This changes bankroll only and preserves statistics/preferences.

Authenticated persistence follows the shared versioned save repository at `users/{uid}/games/royal-fortune-slots`; the existing external Firebase provisioning blocker remains platform-level rather than game-local.

## Architecture

Proposed game-local modules:

- `engine.ts`: payline definitions, symbol matching, Wild substitution, Scatter evaluation, free-spin state transitions, multiplier rules, payout math. No React/DOM/storage/audio.
- `reels.ts`: source-controlled reel strips, symbol definitions, random-stop adapter, deterministic seeded test source, visible-window projection.
- `paytable.ts`: symbol payouts, feature awards, theoretical-return helpers.
- `storage.ts`: versioned durable-state schema/decoder.
- `persistence.ts`: shared-platform checkpoint definition.
- `audio.ts`: opt-in procedural Web Audio cues.
- `RoyalFortuneSlotsWorkspace.tsx`: accessible spin state machine and presentation.
- `royal-fortune-slots.css`: game-scoped responsive machine presentation.
- `royal-fortune-slots.meta.ts`: catalog metadata.
- `PRD.md`, `TRACKER.md`, `todo.md`: game-local living governance.

No gameplay code is shared with Lucky Seven Classic or Cascade Vault. Repo-level persistence/accessibility/test utilities may be reused where their contracts already fit.

## Interaction and visual design

Visual direction: restrained high-end casino cabinet—deep jewel tones, brushed-metal/gold accents, large readable reels, strong separation between bankroll/wager/results and decorative framing. The interface should feel premium without copying Royal Palace Blackjack's table aesthetic.

Primary interaction order:
1. bankroll and current wager,
2. reel window,
3. result/feature status,
4. wager controls,
5. large **Spin** action,
6. paytable/rules and preferences.

Spin is always a deliberate single activation. The game never begins another paid spin automatically. During finite reel motion, duplicate spin inputs are ignored. The result is predetermined before animation begins; animation reveals rather than determines the outcome.

## Accessibility and responsive contract

- Native buttons for all actions.
- Important controls target at least 48×48 CSS px although WCAG 2.2 AA minimum target-size requirements are less strict.
- Keyboard activation through native Enter/Space; optional shortcut keys are additive only.
- No required drag, hover, color-only cue, animation, or audio.
- Visible `:focus-visible` treatment.
- Reel symbols expose concise text equivalents; decorative duplication is hidden from assistive tech.
- A polite live region announces settled result, payout, remaining free spins, and multiplier changes—not every animation frame.
- Paytable/rules use native disclosure or accessible dialog patterns.
- At 200% text size, all content and functionality remain available.
- No page-level horizontal overflow at 320 CSS px.
- The primary Spin action remains reachable without sticky controls obscuring content.
- Wide layouts may place controls beside the cabinet; narrow layouts stack machine, status, controls, and rules in normal flow.
- `prefers-reduced-motion: reduce` removes reel blur/travel, win-line sweeps, cabinet flashes, and feature transitions while preserving immediate symbol/result changes and textual feedback.
- Touch behavior never depends on hover and honors safe-area insets.

## Sound and motion

Audio is opt-in and initialized only after user interaction. Procedural cues may represent spin start, reel stops, normal win, Scatter trigger, free-spin award, and feature completion. No continuous ambient loop is required.

Motion is finite. Normal mode may use staggered reel deceleration, a one-pass payline highlight, short multiplier emphasis, and restrained win feedback. Reduced-motion mode replaces reel travel with a short crossfade or immediate state swap and removes sweeping/scaling effects.

## Error and edge handling

- Insufficient bankroll: Spin disabled with nearby explanatory text.
- Random-source failure: do not deduct wager; surface nonblocking error and leave durable state unchanged.
- Persistence failure: settled play continues locally/in memory and exposes sync/storage status.
- Audio failure: silent continuation.
- Rapid repeated input: phase guard prevents duplicate paid spins.
- Malformed saved state: sanitize to defaults without inventing credits/statistics.
- Feature reload: resume only from last fully settled free-spin checkpoint.
- Wild-only ambiguous lines: payout evaluator uses the highest valid configured win for that line.

## Quality gates

Unit tests must cover every payline, left-to-right match rules, Wild substitution, Scatter independence, multiple simultaneous lines, free-spin trigger/retrigger, multiplier cap/reset, bankroll accounting, insufficient funds, deterministic RNG injection, storage decoding, and checkpoint semantics.

Probability tests must verify reel composition and theoretical RTP/feature frequency from source-controlled strips/paytable. A large deterministic simulation may supplement but not replace exact analytical checks where exact enumeration is practical.

Browser tests must cover catalog routing, first spin, wager changes, result settlement, free-spin flow, restore-practice-credits, persistence reload, keyboard operation, 320px layout, 200% text, touch targets, reduced motion, audio opt-in/no-autoplay, and no page-level horizontal overflow.

Production completion requires the same repository-wide gates used by Royal Palace Blackjack: exact dependency checks, design lint, TypeScript, game/document governance, unit tests, Firestore rules, account/persistence browser checks, catalog accessibility, dedicated game accessibility/gameplay/audio/mobile suites, production builds, artifact upload, and Pages deployment.

## Research basis

The product is not real-money gambling software, but the design intentionally adopts conservative principles from current authoritative sources: rules and likelihood information should be understandable before play; random outcomes should be demonstrably random and non-adaptive; and product design should not pressure stake escalation, loss chasing, or continued play. Accessibility follows WCAG 2.2 reflow/text-resize/target-size principles, with the repo's stronger 48px control baseline, and motion honors the platform `prefers-reduced-motion` preference.

## Completion contract

**Completion state:** implementing  
**Completion evidence:** Approved design and initial production source are present; exact-revision validation/deployment and final probability evidence are not yet complete.

- [x] Pure reel/payline/Wild/Scatter/free-spin engine exists with deterministic injection seam.
- [x] Schema-v1 durable state excludes in-flight animation and checkpoints settled free-spin state only.
- [x] Responsive machine UI, rules/paytable, native controls, reduced-motion handling and opt-in audio are implemented.
- [ ] Focused engine/persistence probability tests pass on an exact revision.
- [ ] Dedicated browser gameplay/accessibility/audio/mobile gates pass, including 320px and 200% text.
- [ ] Exact base-game and full feature probability/RTP evidence is recorded in `TRACKER.md`.
- [ ] `pnpm validate` passes with game/document governance synchronized.
- [ ] The exact revision builds and deploys successfully to GitHub Pages before the state changes to verified.
