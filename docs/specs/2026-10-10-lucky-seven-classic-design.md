# Lucky Seven Classic design

**Status:** Implementing — engine TDD active  
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
- One spin produces one payout classification; outcomes never double-pay through overlapping classifications.
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

The full state space is `32³ = 32,768` equally likely stop combinations. Exhaustive enumeration of the source-controlled configuration must derive, not merely restate:

- theoretical RTP **94.775390625%**,
- credit-paying result frequency **42.047119140625%**,
- three-Gold-7 probability **1 / 32,768 = 0.0030517578125%**.

Production probability never changes according to player state. Random-source failure aborts the spin before any wager is consumed.

## Bankroll and persistence

Initial practice bankroll: 500 virtual credits. Local key: `inmogames:lucky-seven-classic:v1`. Cloud slug: `lucky-seven-classic`.

Durable schema-v1 state contains only settled bankroll, selected wager, lifetime spins, cumulative wagered/won/net totals, largest completed win, last completed result summary, sound preference and cabinet-motion preference. An in-flight spin, animation frame, temporary stop sequence or partially resolved result is never persisted.

Logical result determination and settlement complete before presentation motion begins, so animation cannot alter payout and reload cannot duplicate or erase a settled award. A malformed/unsupported save decodes safely without inventing historical winnings. When bankroll is below the one-credit minimum, **Restore 500 practice credits** changes bankroll only and retains statistics/preferences. Authenticated saves use the existing shared save repository at `users/{uid}/games/lucky-seven-classic`; real configured-project verification remains the external TASK-003 platform concern.

## Architecture

- `reels.ts`: symbol type, three ordered strips, visible-window projection and unbiased browser cryptographic stop adapter.
- `paytable.ts`: supported wagers, labels, BAR-family classification and exact multipliers.
- `engine.ts`: one-result center-line evaluation, deterministic spin projection and exhaustive probability audit. No React, DOM, persistence or audio.
- `storage.ts`: versioned durable-state schema/decoder.
- `persistence.ts`: shared-platform save definition, settled checkpoint helpers and practice-credit restore.
- `audio.ts`: optional procedural mechanical cues initialized only after user interaction.
- `LuckySevenClassicWorkspace.tsx`: accessible spin state machine and mechanical cabinet presentation.
- `lucky-seven-classic.css`: game-scoped responsive cabinet visual system.
- `lucky-seven-classic.meta.ts`: catalog metadata.
- `PRD.md`, `TRACKER.md`, `todo.md`: game-local living handoff/governance.

Gameplay logic is not shared with Royal Fortune Slots or Cascade Vault. Existing repo-level save, accessibility and test infrastructure is reused where its established contract fits.

## Interaction and visual design

The visual identity is a vintage mechanical cabinet rather than a modern video-slot surface: enamel/metal framing, warm reel paper, restrained red/black/gold accents, large readable symbols and a coin-meter-like status panel. The primary hierarchy is bankroll/wager → three reels/center payline → result → wager controls → Pull / Spin → rules/paytable/preferences.

The lever is visual feedback only. The canonical control is a native button supporting normal Enter/Space activation and touch/pointer input. Rapid repeat activation while spinning is rejected by the phase guard. Result text is authoritative even when motion or audio is unavailable.

## Accessibility and responsive contract

- Native controls; important action targets at least 48×48 CSS px.
- No action depends on drag, hover, color, audio or animation.
- Reel result is announced once through a polite live region using readable symbol names and payout.
- Center-payline meaning is textual/structural as well as visual.
- Visible `:focus-visible` treatment is required.
- Rules/paytable are accessible before first spin.
- No page-level horizontal overflow at 320 CSS px.
- All gameplay remains usable at 200% browser text sizing.
- Cabinet framing compresses before labels/controls; three reel windows remain individually distinguishable.
- Safe-area padding and normal document flow are preserved; no fixed action footer obscures content/focus.
- `prefers-reduced-motion: reduce` removes lever/reel/bounce/celebration travel while preserving immediate result/state feedback.

## Sound and motion

Audio is opt-in and begins only after interaction. Procedural cues may include handle click, staggered reel-stop ticks, a short bell-style win cue and a neutral non-winning stop; there is no ambient loop. Normal motion may use a short lever dip and finite independently decelerating reel presentation after the logical result already exists. Reduced motion uses immediate replacement or minimal opacity treatment.

## Error and edge handling

- Insufficient bankroll: Spin disabled with explanatory text.
- Unsupported wager/invalid deterministic stop: engine rejects the input.
- Production random-source failure: state/wager unchanged.
- Persistence unavailable: shared platform falls back safely and surfaces nonblocking status.
- Audio unavailable: gameplay continues silently.
- Repeated activation during spin: ignored/rejected by phase guard.
- Malformed save: safe decoder behavior; no invented winnings.
- Payout precedence guarantees Cherry/Mixed-BAR/exact-match interpretations cannot double-pay.

## Quality gates

Lean full-coverage TDD uses one decisive red/green cycle per independent contract rather than duplicating implementation algorithms in tests. Engine coverage includes all paying classifications, representative losing near-combinations, precedence, wager scaling, reel composition/window projection, invalid inputs, deterministic stops and exhaustive configured math. Persistence coverage targets decoder/checkpoint/restore boundaries without duplicating the shared save repository’s already-tested behavior. Browser coverage targets actual user seams: catalog/route, pre-spin paytable, wager change, settlement, keyboard/touch, reload, restore credits, audio opt-in, 320px, 200% text, reduced motion, target sizes and overflow.

Production completion requires the full repository validation/build/Pages chain used by Royal Palace Blackjack and Royal Fortune Slots.

## Implementation evidence

- Red revision `1085f461f474f9d5ac1976a991d4f6079a9aae75`, run `38098884217`: dependency freshness and design lint passed; TypeScript failed because the intentionally missing Lucky Seven engine/reel modules could not resolve. This is the recorded RED state.
- Engine implementation revision `cec193e955e73834fcf5144703b35a8b411d8591`: adds the source-controlled reel strips, paytable, evaluator, unbiased stop adapter and exhaustive audit.
- Governance integration revision `47ec333f5d32c4d801b6e74b048aa09faf36b258`, run `38099168522`: dependency freshness, design lint, TypeScript and static `game-check: 6 game(s) OK` passed. The history-aware synchronization gate then correctly stopped because the authoritative spec and tracker had not both changed inside that push integration. Unit tests therefore did not run and no green engine claim is made from this run.

## Completion contract

**Completion state:** implementing  
**Completion evidence:** RED is recorded at revision `1085f461f474f9d5ac1976a991d4f6079a9aae75` / run `38098884217`; governance diagnostic evidence is revision `47ec333f5d32c4d801b6e74b048aa09faf36b258` / run `38099168522`. Final exact-revision validation/deployment evidence is not yet claimed.

- [ ] Pure reel/paytable/engine behavior is implemented and exhaustively probability-audited from source-controlled configuration.
- [ ] Schema-v1 local/account save definition persists only settled durable state and handles restore/reset safely.
- [ ] Mechanical cabinet UI, keyboard/touch behavior, paytable/help, audio preference and finite motion meet the approved interaction contract.
- [ ] 320px, 200%-text and reduced-motion browser regressions pass without page-level horizontal overflow or obscured controls.
- [ ] Catalog/workspace routing, PRD, TRACKER, todo, GAME_INDEX and `.tasks` are synchronized in the same implementation history.
- [ ] `pnpm validate` passes on the exact functional revision.
- [ ] GitHub Pages deployment succeeds for that exact functional revision.
- [ ] Tracker and completion state become verified only after exact revision/run evidence exists; TASK-003 remains external while live Firebase is unavailable.

## Research basis

This free-play design adopts conservative authoritative principles: payout/rules information is available before play; outcomes are random, inspectable and non-adaptive; and UX does not pressure stake escalation or continued play. Accessibility follows WCAG 2.2 text-resize/reflow/target principles and respects `prefers-reduced-motion`.
