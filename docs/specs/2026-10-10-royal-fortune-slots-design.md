# Royal Fortune Slots design

**Status:** Implementing — final probability and edge-case evidence under validation  
**Last synchronized:** 2026-10-10  
**Route:** `#/games/royal-fortune-slots`

## Product intent

Royal Fortune Slots is the polished casino-floor member of a three-game slot family. It is a standalone InMo Games title rather than a skin over another slot engine. The game uses virtual credits only: no deposits, purchases, cash-out, ads, telemetry, real-money value, or gambling account functionality.

The experience is a five-reel, three-row video slot with twenty fixed paylines, a readable paytable, Wild and Scatter symbols, free-spin rounds, deterministic payout evaluation, finite audiovisual feedback, and optional local/account-bound persistence through the same shared platform used by other InMo Games titles.

The game must be understandable before the first spin. Rules, payline behavior, symbol values, feature triggers, long-run configured return, and the fact that all credits are simulated practice credits remain available from the primary play surface without interrupting play.

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
- A paid spin that returns less than its wager is described as a net loss even when one or more paylines return credits; celebratory win treatment is reserved for positive-net paid results, free-spin awards, or feature awards.
- No autoplay, turbo autoplay, losses-disguised-as-wins, near-miss manipulation, stake prompting, or adaptive/compensated outcome behavior.

## Probability and reel model

The engine uses explicit virtual reel strips rather than outcome tables hidden inside React state. Each reel owns an ordered 32-stop symbol strip. A spin chooses one stop independently per reel using browser cryptographic randomness in production and an injected deterministic source in tests. Visible rows derive from neighboring strip positions with wraparound.

Reel strips and the paytable are source-controlled constants. Outcome probabilities never change in response to bankroll, recent wins/losses, session duration, or player behavior.

`audit.ts` performs source-derived analytical verification rather than relying on sampled play. Normal-payline expected return is calculated from exact reel symbol frequencies. Scatter count/feature-entry probability is derived from exact visible-window stop distributions. A paying-spin probability is derived by exhaustively evaluating all 32³ first-three-reel stop combinations—the minimum paying prefix for every fixed payline—and combining non-paying prefixes with exact tail-reel Scatter counts. The free-spin feature then uses those exact event probabilities in a multiplier-state recurrence. Because every retrigger is a winning spin, the multiplier advances toward ×5; once ×5 is reached, the expected retrigger queue has the closed-form denominator `1 - 5p(retrigger)`. The configured retrigger probability is well below the divergence threshold.

At the 5-credit normalization wager the committed configuration derives:

- normal-payline return: 85.0368022919%,
- Scatter-credit return: 0.8312165737%,
- paid-spin return before free-spin feature value: 85.8680188656%,
- any-paying-result probability: 43.4817314148%,
- feature-entry / free-spin retrigger probability: 0.7124483585%,
- free-feature return contribution: 13.5627470032%,
- total configured theoretical return: 99.4307658688%.

The UI identifies the total as a simulated-game long-run probability statistic, never a prediction of a particular spin or session. The implementation-stage values remain subject to exact-revision test verification before this design can be marked verified.

## Bankroll and persistence

Initial practice bankroll: 2,500 virtual credits.

Local storage key: `inmogames:royal-fortune-slots:v1`.
Cloud game slug: `royal-fortune-slots`.

Persist only durable state:
- bankroll after a settled spin,
- selected base wager,
- lifetime spin count,
- free spins played,
- cumulative virtual-credit wagered/won/net,
- largest single-spin win,
- sound preference,
- reduced-effects preference when explicitly chosen in-game,
- last completed result summary,
- fully settled free-spin feature checkpoint when active.

Do not persist an in-flight reel animation or partially evaluated spin. Free-spin state may be checkpointed only after each free spin has fully settled so reload cannot duplicate or erase a settled award. If reload occurs during presentation motion, restore the last completed logical checkpoint.

If bankroll falls below the minimum 5-credit wager, expose **Restore 2,500 practice credits**. This changes bankroll only and preserves statistics/preferences.

Authenticated persistence follows the shared versioned save repository at `users/{uid}/games/royal-fortune-slots`; the existing external Firebase provisioning blocker remains platform-level rather than game-local.

## Architecture

- `engine.ts`: payline symbol matching, Wild substitution, Scatter evaluation, free-spin state transitions, multiplier rules and payout math. No React, DOM, storage or audio.
- `reels.ts`: source-controlled reel strips, symbol definitions, random-stop adapter, deterministic injected test seam, visible-window projection and paylines.
- `paytable.ts`: symbol payouts, wager set and feature constants.
- `audit.ts`: exact base return, paying-spin/Scatter probabilities and full free-feature expected-value recurrence; exports the bound configured return displayed by the rules UI.
- `storage.ts`: versioned durable-state schema/decoder.
- `persistence.ts`: shared-platform checkpoint definition and settled-spin accounting.
- `audio.ts`: opt-in procedural Web Audio cues.
- `RoyalFortuneSlotsWorkspace.tsx`: accessible spin state machine, transparent net-result language, RNG failure handling and presentation.
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

Spin is always a deliberate single activation. The game never begins another paid or free spin automatically. During finite reel motion, duplicate spin inputs are ignored. The result is predetermined before presentation begins; animation reveals rather than determines the outcome.

## Accessibility and responsive contract

- Native buttons for all actions.
- Important controls target at least 48×48 CSS px although WCAG 2.2 AA minimum target-size requirements are less strict.
- Keyboard activation uses native Enter/Space; optional shortcuts are additive only.
- No required drag, hover, color-only cue, animation, or audio.
- Visible `:focus-visible` treatment.
- Reel symbols expose concise text equivalents; decorative duplication is hidden from assistive tech.
- A polite live region announces the settled return/net result, payout context, remaining free spins and multiplier changes—not every animation frame.
- Paytable/rules and preferences use native disclosure patterns.
- At 200% text size, all content and functionality remain available.
- No page-level horizontal overflow at 320 CSS px.
- The primary Spin/free-spin action remains available without sticky controls obscuring content.
- Wide layouts may place controls beside the cabinet; narrow layouts stack machine, status, controls and rules in normal flow.
- `prefers-reduced-motion: reduce` removes reel blur/travel, win-line sweeps, cabinet flashes and feature transitions while preserving immediate symbol/result changes and textual feedback.
- An explicit in-game reduced-effects preference provides the same cosmetic suppression independently of OS preference.
- Touch behavior never depends on hover and honors safe-area insets.

## Sound and motion

Audio is opt-in and initialized only after user interaction. Procedural cues represent spin start, stop/non-positive-net settlement, positive result and feature award. Audio failure never blocks play.

Motion is finite. Normal mode may use staggered reel deceleration and restrained positive-result emphasis. A paid spin that remains net-negative does not receive celebratory payline animation merely because some credits were returned. Reduced-motion mode replaces reel travel with immediate or near-immediate state presentation.

## Error and edge handling

- Insufficient bankroll: Spin is disabled; the player can choose a supported lower wager or restore practice credits when below the table minimum.
- Random-source failure: no wager is deducted, no result is persisted, and a nonblocking retry message is shown.
- Persistence failure: settled play continues locally/in memory and exposes shared save status.
- Audio failure: silent continuation.
- Rapid repeated input: phase guard prevents duplicate paid/free spins.
- Malformed saved state: decoder rejects it so the repository falls back safely rather than inventing credits/statistics.
- Feature reload: resume only from the last fully settled free-spin checkpoint.
- Wild-only ambiguous lines: payout evaluator uses the highest valid configured normal-symbol win for that line.
- Practice-credit restore: available only outside an active feature when bankroll is below 5; restores bankroll to 2,500 while retaining statistics/preferences.

## Quality gates

Unit tests cover deterministic reel stops, left-to-right Wild matching, Scatter independence, base/free trigger counts, multiplier progression/cap, invalid inputs, bankroll settlement, schema decoding and restore behavior.

Probability tests bind reel composition, exact base return, paying-spin probability, feature-entry/retrigger probability, initial-feature expected values, feature return contribution and configured total theoretical return to the source-controlled constants.

The dedicated browser suite covers catalog route rendering, five-reel geometry, pre-spin rules discoverability, native keyboard Spin activation, RNG-failure no-deduction behavior, deterministic Scatter feature entry, free-feature checkpoint reload, player-paced free-spin decrement, reduced-effects preference, sound opt-in/no-autoplay, 320px no-overflow geometry, 200% text reflow, >=48px primary control, depleted-save restore and preservation of statistics.

Production completion requires repository-wide exact dependency checks, design lint, TypeScript, game/document governance, unit tests, Firestore rules, account/persistence browser checks, catalog/design regressions, dedicated Royal Fortune browser checks, both production builds, artifact upload and Pages deployment.

## Research basis

The product is not real-money gambling software, but the design intentionally adopts conservative principles from current authoritative sources: rules and likelihood information should be understandable before play; random outcomes should be demonstrably random and non-adaptive; and product design should not pressure stake escalation, loss chasing or continued play. Accessibility follows WCAG 2.2 reflow/text-resize/target-size principles, with the repository's stronger 48px control baseline, and motion honors the platform `prefers-reduced-motion` preference.

## Validation history

Revision `8c3e2fa474dab14f10b5853becac9ad17e434df1` passed GitHub Actions run `38089533535`: dependency exactness/current checks, design lint, TypeScript, game/document governance, unit tests, Firestore rules, account/persistence browser tests, the complete design-browser chain including the then-current Royal Fortune suite, both production builds, Pages artifact upload and Pages deployment. That run establishes a green baseline, but it predates the full feature recurrence and final RNG/reload/restore/net-result polish, so it is not the final verified revision.

## Completion contract

**Completion state:** implementing  
**Completion evidence:** The production game, exact base/full-feature probability model, and expanded edge-case browser coverage are present. Baseline production CI is green at `8c3e2fa` / run `38089533535`; the current final evidence integration still requires its own exact-revision run.

- [x] Pure reel/payline/Wild/Scatter/free-spin engine exists with deterministic injection seam.
- [x] Schema-v1 durable state excludes in-flight animation and checkpoints settled free-spin state only.
- [x] Responsive machine UI, rules/paytable, native controls, transparent net wording, reduced-motion handling and opt-in audio are implemented.
- [x] Exact base-game and full free-feature theoretical-return audit is implemented and bound to source constants.
- [ ] Current focused engine/persistence/probability tests pass on the final exact revision.
- [ ] Current dedicated browser safety/gameplay/persistence/audio/mobile gates pass, including 320px and 200% text.
- [ ] `pnpm validate` passes with game/document governance synchronized on the final exact revision.
- [ ] That exact revision builds and deploys successfully to GitHub Pages before the state changes to verified.
