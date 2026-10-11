# Lucky Seven Classic design

**Status:** Implementing — engine verified; settled persistence TDD opening  
**Last synchronized:** 2026-10-10  
**Route:** `#/games/lucky-seven-classic`

## Product intent

Lucky Seven Classic is a standalone three-reel mechanical-style slot, intentionally distinct from Royal Fortune Slots and Cascade Vault. It uses virtual practice credits only: no deposits, purchases, cash-out, ads, telemetry, real-money value or gambling-account functionality.

The experience is deliberately direct: three large reels, one clearly identified center payline, a readable paytable, a native Pull / Spin control with optional lever-like visual feedback, finite reel-stop motion and transparent deterministic payout evaluation after random stops have been selected. Rules and payout information are available before the first spin.

## Core rules

- 3 reels × 1 evaluated center payline. Neighboring symbols may be visible above/below for mechanical context but never score.
- Supported wagers: 1, 2, 5, 10 and 25 virtual credits.
- Symbols: Cherry, Lemon, Orange, Plum, Bell, BAR, Double BAR, Triple BAR, Red 7 and Gold 7.
- Cherry precedence is first: any one Cherry pays 1× wager; any two Cherries pay 3×; three Cherries pay 10×.
- If no Cherry is present, three BAR-family symbols that are not identical pay Mixed BAR at 5×.
- Otherwise, only an exact three-symbol match can pay.
- Exact BAR-family matches take precedence over Mixed BAR by definition because Mixed BAR requires non-identical BAR-family symbols.
- One spin produces one payout classification; overlapping classifications never double-pay.
- No Wild, Scatter, autoplay, cascading, expanding symbols, bonus wheel, progressive jackpot or adaptive/compensated probability.
- Hold and Nudge are excluded from v1 because they materially alter probability and require a separately approved rules model.
- Recent outcomes, bankroll and session behavior never influence reel strips or stop selection.

### Paytable

All values multiply the selected wager.

| Center-line result | Multiplier |
| --- | ---: |
| Any 1 Cherry | 1× |
| Any 2 Cherries | 3× |
| 3 Cherries | 10× |
| Mixed BAR / Double BAR / Triple BAR | 5× |
| 3 Lemons | 10× |
| 3 Oranges | 16× |
| 3 Plums | 24× |
| 3 BAR | 30× |
| 3 Double BAR | 60× |
| 3 Bells | 80× |
| 3 Triple BAR | 120× |
| 3 Red 7s | 200× |
| 3 Gold 7s | 500× |

## Probability and reel model

Each reel is a source-controlled ordered 32-stop strip. Production selects one stop per reel through an unbiased `crypto.getRandomValues()` adapter using rejection sampling so modulo bias is not introduced. Tests inject deterministic integer stops. Visible reel windows are the previous, selected and next strip symbols with wraparound.

Each reel has the same symbol frequency but a different order:

| Symbol | Stops per reel |
| --- | ---: |
| Cherry | 5 |
| Lemon | 5 |
| Orange | 5 |
| Plum | 4 |
| Bell | 3 |
| BAR | 3 |
| Double BAR | 2 |
| Triple BAR | 2 |
| Red 7 | 2 |
| Gold 7 | 1 |
| **Total** | **32** |

The full state space is `32³ = 32,768` equally likely stop combinations. Exhaustive enumeration of the actual source-controlled configuration derives:

- theoretical RTP **94.775390625%**,
- credit-paying result frequency **42.047119140625%**,
- three-Gold-7 probability **1 / 32,768 = 0.0030517578125%**.

Production probability never changes according to player state. Random-source failure aborts the spin before any wager is consumed.

## Bankroll and persistence

Initial practice bankroll: 500 virtual credits. Local key: `inmogames:lucky-seven-classic:v1`. Cloud slug: `lucky-seven-classic`.

Schema-v1 durable state is exactly:
- settled `bankroll`,
- `selectedWager` constrained to 1/2/5/10/25,
- `spins`, `totalWagered`, `totalWon`, derived-consistent `net`, and `largestWin`,
- `preferences.sound` and `preferences.motion`,
- `lastResult` or `null`; a completed result records the three center symbols, wager, payout and human-readable classification label.

An in-flight spin, animation frame, temporary reel stops/window or partially resolved result is never part of the durable schema. `settleLuckySevenSpin(state, center)` is pure and atomic: it verifies bankroll can fund the selected wager, derives the award from the engine using that wager and center line, then returns a completely settled next durable state. The caller therefore does not pass payout math back into persistence. Logical settlement completes before presentation motion begins, so animation cannot alter payout and reload cannot duplicate or erase a settled award.

Decoder requirements: all counters/bankroll/payouts are non-negative safe integers; `net` is a safe integer and equals `totalWon - totalWagered`; selected/result wagers are supported; all saved center symbols are recognized; preferences are booleans. Malformed or unsupported state decodes to failure through the shared save contract without inventing historical winnings.

When bankroll is below the one-credit minimum, `restorePracticeCredits` returns a copy with bankroll restored to 500 while retaining wager selection, statistics, last result and preferences. At bankroll ≥1 it returns `null`. Authenticated saves use the existing shared repository at `users/{uid}/games/lucky-seven-classic`; live configured-project verification remains external TASK-003.

## Architecture

- `reels.ts`: symbol type, three ordered strips, visible-window projection and unbiased browser cryptographic stop adapter.
- `paytable.ts`: supported wagers, labels, BAR-family classification and exact multipliers.
- `engine.ts`: one-result center-line evaluation, deterministic spin projection and exhaustive probability audit. No React, DOM, persistence or audio.
- `storage.ts`: versioned durable-state type/constants/decoder.
- `persistence.ts`: shared-platform save definition, pure atomic settlement helper and practice-credit restore.
- `audio.ts`: optional procedural mechanical cues initialized only after user interaction.
- `LuckySevenClassicWorkspace.tsx`: accessible spin state machine and mechanical cabinet presentation.
- `lucky-seven-classic.css`: game-scoped responsive cabinet visual system.
- `lucky-seven-classic.meta.ts`: catalog metadata.
- `PRD.md`, `TRACKER.md`, `todo.md`: game-local living governance.

Gameplay logic is not shared with Royal Fortune Slots or Cascade Vault. Existing repo-level save, accessibility and test infrastructure is reused where its established contract fits.

## Interaction and visual design

The visual identity is a vintage mechanical cabinet rather than a modern video-slot surface: enamel/metal framing, warm reel paper, restrained red/black/gold accents, large readable symbols and a coin-meter-like status panel. Primary hierarchy: bankroll/wager → three reels/center payline → result → wager controls → Pull / Spin → rules/paytable/preferences.

The lever is visual feedback only. The canonical control is a native button supporting Enter/Space and touch/pointer input. Rapid repeat activation while spinning is rejected by the phase guard. Result text is authoritative even when motion/audio is unavailable.

## Accessibility and responsive contract

- Native controls; important action targets at least 48×48 CSS px.
- No action depends on drag, hover, color, audio or animation.
- Reel result is announced once through a polite live region using readable symbol names and payout.
- Center-payline meaning is textual/structural as well as visual.
- Visible `:focus-visible` treatment is required.
- Rules/paytable are accessible before first spin.
- No page-level horizontal overflow at 320 CSS px; all gameplay remains usable at 200% text.
- Cabinet framing compresses before labels/controls; three reel windows remain distinguishable.
- Safe-area padding and normal document flow are preserved; no fixed action footer obscures content/focus.
- `prefers-reduced-motion: reduce` removes lever/reel/bounce/celebration travel while preserving immediate state/result feedback.

## Sound and motion

Audio is opt-in and begins only after interaction. Procedural cues may include handle click, staggered reel-stop ticks, a short bell-style win cue and a neutral non-winning stop; no ambient loop. Normal motion may use a short lever dip and finite independently decelerating reel presentation after the logical result already exists. Reduced motion uses immediate replacement or minimal opacity treatment.

## Error and edge handling

- Insufficient bankroll: Spin disabled; pure settlement also rejects if called anyway.
- Unsupported wager/invalid deterministic stop: engine or decoder rejects it.
- Production random-source failure: state/wager unchanged.
- Persistence unavailable: shared platform falls back safely and surfaces nonblocking status.
- Audio unavailable: gameplay continues silently.
- Repeated activation during spin: ignored/rejected by phase guard.
- Malformed save: decoder failure; no invented winnings.
- Payout precedence prevents Cherry/Mixed-BAR/exact-match double payment.

## Quality gates

Lean full-coverage TDD uses one decisive red/green cycle per independent contract rather than duplicating production algorithms in tests. Engine coverage includes all paying classifications, representative losses, precedence, wager scaling, reel composition/window projection, invalid inputs, deterministic stops and exhaustive configured math. Persistence coverage is limited to game-local schema/settlement/restore semantics and deliberately does not duplicate already-green shared save-repository behavior. Browser coverage targets catalog/route, paytable, wager change, settlement, keyboard/touch, reload, restore, audio opt-in, 320px, 200% text, reduced motion, target sizes and overflow.

Production completion requires the full repository validation/build/Pages chain used by Royal Palace Blackjack and Royal Fortune Slots.

## Implementation evidence

- RED engine revision `1085f461f474f9d5ac1976a991d4f6079a9aae75`, run `38098884217`: dependency freshness/design lint passed; TypeScript failed on intentionally absent engine/reel modules.
- Engine source revision `cec193e955e73834fcf5144703b35a8b411d8591`: added explicit strips, paytable, evaluator, unbiased stop source and exhaustive audit.
- Governance diagnostic revision `47ec333f5d32c4d801b6e74b048aa09faf36b258`, run `38099168522`: dependency/design/typecheck and static game structure passed; history-sync correctly caught non-atomic spec/tracker evidence.
- Synchronized engine evidence revision `de1136d18390b1044eab16475fab5aee31b2c6f6`, run `38099279607`: `game:check` passed and the full unit-test step passed, establishing GREEN for the engine/probability contract without weakening assertions.
- The next TDD integration introduces the focused persistence test while `storage.ts` and `persistence.ts` remain intentionally absent, establishing a distinct persistence RED before production persistence code is written.

## Completion contract

**Completion state:** implementing  
**Completion evidence:** Engine/probability behavior is green at revision `de1136d18390b1044eab16475fab5aee31b2c6f6` / run `38099279607`; whole-game validation/deployment is not yet claimed.

- [x] Pure reel/paytable/engine behavior is implemented and exhaustively probability-audited from source-controlled configuration.
- [ ] Schema-v1 local/account save definition persists only settled durable state and handles restore/reset safely.
- [ ] Mechanical cabinet UI, keyboard/touch behavior, paytable/help, audio preference and finite motion meet the approved interaction contract.
- [ ] 320px, 200%-text and reduced-motion browser regressions pass without page-level horizontal overflow or obscured controls.
- [ ] Catalog/workspace routing, PRD, TRACKER, todo, GAME_INDEX and `.tasks` are synchronized through the completed implementation history.
- [ ] `pnpm validate` passes on the exact functional revision.
- [ ] GitHub Pages deployment succeeds for that exact functional revision.
- [ ] Tracker and completion state become verified only after exact revision/run evidence exists; TASK-003 remains external while live Firebase is unavailable.

## Research basis

This free-play design adopts conservative authoritative principles: payout/rules information is available before play; outcomes are random, inspectable and non-adaptive; and UX does not pressure stake escalation or continued play. Accessibility follows WCAG 2.2 text-resize/reflow/target principles and respects `prefers-reduced-motion`.
