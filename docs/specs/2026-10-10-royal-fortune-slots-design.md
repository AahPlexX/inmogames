# Royal Fortune Slots design

**Status:** Verified — 2026-10-10 game-local production scope complete; live Firebase account services remain externally blocked by TASK-003  
**Last synchronized:** 2026-10-10  
**Route:** `#/games/royal-fortune-slots`

## Product intent

Royal Fortune Slots is the polished casino-floor member of a three-game slot family. It is a standalone InMo Games title rather than a skin over another slot engine. The game uses virtual credits only: no deposits, purchases, cash-out, ads, telemetry, real-money value, or gambling account functionality.

The experience is a five-reel, three-row video slot with twenty fixed paylines, a readable paytable, Wild and Scatter symbols, free-spin rounds, exact probability evidence, finite audiovisual feedback, and optional local/account-bound persistence through the shared platform used by other InMo Games titles.

Rules, payline behavior, symbol values, feature triggers, the configured theoretical return, and the simulated-credit boundary are available before play without interrupting the machine.

## Core rules

- 5 reels × 3 visible rows.
- 20 fixed paylines; all paylines are always active.
- Total wager steps: 5, 10, 20, 40, 100 virtual credits, bounded by available bankroll.
- Symbols: Crown, Ruby, Emerald, Chalice, Bell, A, K, Q, J, Wild, Scatter.
- Wild substitutes for all normal paying symbols except Scatter.
- Scatter pays independently of paylines.
- 3 / 4 / 5 Scatters anywhere award 8 / 12 / 20 free spins.
- Free spins retain the triggering wager and are always player-paced; no free spin starts automatically.
- Each completed winning free spin advances the line-win multiplier by +1, capped at ×5.
- Three or more Scatters during free spins add 5 spins without resetting the multiplier.
- Multiple line wins add together; Scatter return is added separately.
- A spin settles atomically in durable state only after the logical outcome is complete.
- A paid spin that returns less than its wager is described as a net loss; celebratory win treatment is reserved for positive-net paid outcomes, free-spin credit awards, or feature awards.
- No autoplay, turbo autoplay, near-miss manipulation, losses-disguised-as-wins treatment, stake pressure, or behavior-adaptive probability.

## Probability and reel model

The game uses five explicit ordered 32-stop virtual reel strips. Production chooses one independent stop per reel with an unbiased browser `crypto.getRandomValues()` adapter; tests inject deterministic integer stops. The visible three-symbol column is the selected stop plus its immediate neighbors with wraparound.

The paytable and all reel strips are source-controlled. Outcome probabilities never vary with bankroll, history, session duration, recent wins/losses, or player choices.

`audit.ts` verifies the configuration analytically:

- normal-payline expected value is calculated from exact symbol frequencies on each reel,
- Scatter count and trigger frequency come from exact visible-window stop distributions,
- any-paying-result probability exhausts every 32³ first-three-reel stop combination (the minimum fixed-payline paying prefix) and combines non-paying prefixes with exact fourth/fifth-reel Scatter counts,
- the free-spin feature uses those exact event probabilities in a finite multiplier-state recurrence,
- after multiplier ×5 is reached, the retrigger queue has a closed-form expectation because each free spin adds five more spins only with the fixed retrigger probability.

At the 5-credit normalization wager, the verified configuration is:

- normal-payline return: 85.0368022919%,
- Scatter-credit return: 0.8312165737%,
- paid-spin return before free-spin feature value: 85.8680188656%,
- probability of any credit-paying result: 43.4817314148%,
- base feature-entry / free-spin retrigger probability: 0.7124483585%,
- free-feature return contribution: 13.5627470032%,
- configured total theoretical return: **99.4307658688%**.

The rules UI describes that figure as a long-run simulated-game probability statistic, not a prediction for a spin or session.

## Bankroll and persistence

Initial practice bankroll: 2,500 virtual credits.

Local storage key: `inmogames:royal-fortune-slots:v1`.  
Cloud game slug: `royal-fortune-slots`.

Durable state is limited to:
- settled bankroll,
- selected base wager,
- paid/free spin counters,
- total wagered/won/net,
- largest single-spin return,
- sound and reduced-effects preferences,
- last completed result summary,
- fully settled free-spin feature checkpoint when active.

In-flight reel animation and partially resolved outcomes are never serialized. Reloading during presentation restores the last completed logical checkpoint, so a completed award cannot duplicate or disappear. When bankroll is below the 5-credit minimum and no free-spin feature is active, **Restore 2,500 practice credits** changes only bankroll and preserves statistics/preferences.

Guest saves use defensive local persistence. Authenticated players use the shared save repository at `users/{uid}/games/royal-fortune-slots`. Shared account-save behavior is emulator-tested; real configured-project Firebase provisioning remains external TASK-003.

## Architecture

- `reels.ts`: symbols, five source-controlled reel strips, 20 fixed paylines, unbiased production RNG adapter and deterministic injected seam.
- `paytable.ts`: supported wagers, normal-symbol awards, Scatter awards and free-spin constants.
- `engine.ts`: pure payline/Wild/Scatter evaluation, payout math and free-spin multiplier/retrigger transitions.
- `audit.ts`: exact base/paying-spin/feature probability and full-feature expected-value evidence.
- `storage.ts`: schema-v1 durable-state decoder/defaults.
- `persistence.ts`: shared save definition, atomic settlement and practice-credit restoration.
- `audio.ts`: optional procedural Web Audio cues.
- `RoyalFortuneSlotsWorkspace.tsx`: accessible spin state/presentation, transparent paid-spin net wording and RNG failure recovery.
- `royal-fortune-slots.css`: scoped premium cabinet, responsive/reduced-motion visual system.
- `royal-fortune-slots.meta.ts`: catalog metadata.
- `PRD.md`, `TRACKER.md`, `todo.md`: living game governance.

No gameplay engine is shared with Lucky Seven Classic or Cascade Vault. Only repository-level platform/save/test infrastructure is reused.

## Interaction and visual design

The machine uses a restrained luxury-casino identity: deep jewel tones, gold/brushed-metal accents, large reel symbols, a compact bank/wager/net/best meter, strong result hierarchy and a large Spin/free-spin action. It does not reuse Royal Palace Blackjack's felt-table presentation.

Primary interaction order is bankroll/wager → reels → result/feature status → wager controls → Spin → rules/preferences. Spin is always a deliberate single activation. The logical outcome is determined before finite presentation motion; animation reveals the result rather than deciding it.

## Accessibility and responsive contract

- All actions are native buttons; rules/preferences use native disclosure surfaces.
- Important controls meet the game-local 48 CSS-pixel target baseline.
- Keyboard activation uses normal Enter/Space behavior.
- Nothing requires drag, hover, color, animation, or sound.
- Visible `:focus-visible` treatment is present.
- Reel symbols expose readable names to assistive technology.
- Aggregate result/free-spin state is announced through a polite atomic live region.
- Paid-spin return and net result are both explicit so a partial return cannot masquerade as a win.
- 320 CSS-pixel layout has no page-level horizontal overflow.
- 200% text preserves controls/content and reflows without horizontal page overflow.
- Narrow layouts preserve normal document flow; no sticky action dock obscures content.
- `prefers-reduced-motion: reduce` and the explicit Reduced effects preference suppress cosmetic reel/result motion while preserving state feedback.
- Safe-area padding is respected on supported mobile browsers.

## Sound and motion

Sound is off by default and Web Audio is created only after the user enables sound and triggers play. Cues are short and procedural. Audio failure never blocks gameplay.

Normal motion is finite: one reel-settle sequence and restrained positive-result feedback. Paid outcomes that remain net-negative do not receive celebratory payline motion merely because some credits were returned. Reduced-motion/effects mode presents outcomes immediately or near-immediately.

## Error and edge handling

- Insufficient bankroll: selected wager cannot be spun; supported lower wagers remain available.
- Bankroll below 5 outside a feature: Restore practice credits is offered.
- Random-source failure: no wager deduction or result persistence; a retry message is shown.
- Persistence unavailable: shared save status surfaces the problem while play can continue with available local/in-memory fallback.
- Audio unavailable: silent continuation.
- Duplicate input during presentation: phase guard prevents a second spin.
- Malformed save: decoder rejects it rather than inventing historical values.
- Feature reload: resumes only the last fully settled feature checkpoint.
- Wild-only line: engine selects the highest configured normal-symbol award for that payable length.

## Quality gates

Unit coverage includes deterministic stops, line/Wild behavior, Scatter trigger counts, multiplier progression/cap, feature checkpoint transitions, invalid wagers/windows, schema decoding, paid/free settlement, restore semantics, exact reel composition, exact base return, paying-spin probability, trigger/retrigger frequency and full-feature theoretical return.

The dedicated Chromium suite verifies route rendering, five-reel geometry, pre-spin rules, 48px Spin target, keyboard Space activation, RNG-source failure without deduction, deterministic Scatter feature entry, settled feature reload, player-paced free-spin progression, explicit reduced effects, sound opt-in/no-autoplay, 320px no-overflow, 200% text reflow, depleted-save restore and statistics retention.

Repository-wide validation additionally covers dependency exactness/currentness, design lint, TypeScript, documentation governance, Firestore rules, shared account/persistence browser behavior, catalog/shared design regressions, both production builds, Pages artifact upload and Pages deployment.

## Research basis

Although the title is free-play software, it adopts conservative principles from current authoritative standards: rules and likelihood information are available before play; random outcomes are fixed/non-adaptive and testable; the interface avoids loss-chasing/stake-pressure mechanics; WCAG 2.2 reflow/text-resize/target principles inform the responsive contract; and reduced-motion preferences are honored.

## Verification evidence

Exact functional revision `e89b9c64eada44a4a5953c17072d57b7d940b4d2` passed GitHub Actions run `38090041520`. The build job passed frozen install, dependency exactness/current checks, design lint, TypeScript, game/document governance, all unit tests including the exact Royal Fortune RTP recurrence, Firestore rules, the shared account/persistence browser suite, catalog/shared design regressions, the expanded Royal Fortune browser suite, both production builds and Pages artifact upload. The deploy job then passed Pages configuration and deployment.

The expanded Royal Fortune browser gate explicitly verified RNG-failure no-deduction behavior, deterministic feature entry, free-spin checkpoint reload, player-paced feature progression, depleted-bankroll restore with statistics retained, 320px no-horizontal-overflow, 200% text reflow, >=48px primary target, reduced-effects behavior and sound opt-in/no-autoplay.

## Completion contract

**Completion state:** verified  
**Completion evidence:** Exact functional revision `e89b9c64eada44a4a5953c17072d57b7d940b4d2` passed the complete repository validation, dedicated Royal Fortune regression chain, both production builds and GitHub Pages deployment in run `38090041520`. Live configured Firebase account verification remains externally blocked by TASK-003 only.

- [x] Pure five-reel/payline/Wild/Scatter/free-spin engine and unbiased production RNG adapter are implemented and tested.
- [x] Schema-v1 durable state excludes in-flight presentation and safely checkpoints settled free-spin progress.
- [x] Responsive accessible cabinet, transparent net-result language, rules/RTP disclosure, reduced-effects handling and opt-in audio are implemented.
- [x] Exact base and full-feature theoretical-return audit is bound to source constants and passed on the verified revision.
- [x] Dedicated browser gameplay/persistence/accessibility/audio/mobile gates passed, including RNG-failure safety, 320px and 200% text.
- [x] Repository-wide dependency/type/governance/unit/rules/account/design validation passed on the exact verified revision.
- [x] Both production builds and Pages artifact upload passed on the exact verified revision.
- [x] GitHub Pages deployment passed for the exact verified revision.
