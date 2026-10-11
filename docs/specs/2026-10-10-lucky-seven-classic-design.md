# Lucky Seven Classic design

**Status:** Implementing — engine TDD started 2026-10-10  
**Last synchronized:** 2026-10-10  
**Route:** `#/games/lucky-seven-classic`

## Product intent

Lucky Seven Classic is a standalone three-reel mechanical-style slot game with a tactile, simple ruleset and a presentation intentionally distinct from both Royal Fortune Slots and Cascade Vault. It uses virtual credits only: no purchases, deposits, cash-out, ads, telemetry, or real-money value.

The core appeal is immediacy and physical-machine character: three large reels, recognizable classic symbols, a clear paytable, one payline, a pull-lever-inspired primary action that remains fully accessible as a normal button, finite reel-stop motion, and transparent deterministic payout evaluation.

## Core rules

- 3 reels × 1 evaluated center payline.
- Visible cabinet may show neighboring symbols above/below for mechanical context, but only the center row pays.
- Wager steps: 1, 2, 5, 10, 25 virtual credits.
- Symbols: Cherry, Lemon, Orange, Plum, Bell, BAR, Double BAR, Triple BAR, Red 7, Gold 7.
- Cherry awards have first precedence: one Cherry anywhere pays 1× wager, two Cherries pay 3×, and three Cherries pay 10×.
- Three BAR-family symbols that are not all identical pay the Mixed BAR award of 5× wager.
- All remaining awards require an exact three-symbol center-line match.
- No Wild, Scatter, bonus wheel, autoplay, cascading, expanding symbols, progressive jackpot, or adaptive probability.
- Optional **Hold** and **Nudge** are excluded from v1 because they materially change probability and require a separately approved rules model.
- Every spin is independently random from explicit reel strips. Recent results, bankroll, or session behavior never alter the strips or stop selection.

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

Cherry precedence prevents an overlapping exact-symbol rule from double-paying. Exact BAR-family matches take precedence over Mixed BAR. Every spin returns one payout classification only.

## Probability and reel model

Each of the three reels is an explicit ordered 32-stop strip. Production chooses one stop per reel using an unbiased browser `crypto.getRandomValues()` adapter; tests inject deterministic integer stops. Visible neighboring symbols derive from the ordered strip with wraparound, but only the selected center stop participates in scoring.

Each reel has the same source-controlled symbol frequency while using a different order:

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

The complete three-reel state space is `32³ = 32,768` equally likely stop combinations. Exhaustive enumeration of this configuration yields:

- theoretical RTP: **94.775390625%**,
- probability of any credit-paying result: **42.047119140625%**,
- probability of three Gold 7s: **1 / 32,768 = 0.0030517578125%**.

The engine audit must derive these values from the actual source-controlled strips/paytable rather than hard-code them as assertions detached from configuration. Outcome probabilities never adapt to bankroll, recent results, session duration, or player behavior.

## Bankroll and persistence

Initial practice bankroll: 500 virtual credits.

Local storage key: `inmogames:lucky-seven-classic:v1`.
Cloud game slug: `lucky-seven-classic`.

Persist:
- settled bankroll,
- selected wager,
- lifetime spins,
- total wagered/won/net,
- largest win,
- sound preference,
- cabinet-motion preference if explicitly selected,
- last completed result summary.

Never persist an in-flight spin. Reload restores the last completed durable checkpoint. If bankroll is below the 1-credit minimum, expose **Restore 500 practice credits** while retaining statistics/preferences.

Authenticated saves use the shared repository at `users/{uid}/games/lucky-seven-classic`; external Firebase provisioning remains a platform blocker rather than game-local work.

## Architecture

- `engine.ts`: center-line classification, payout math and exhaustive probability audit entrypoint.
- `reels.ts`: three source-controlled ordered strips, cryptographic random-stop adapter, injected deterministic stop source, visible-window projection.
- `paytable.ts`: supported wagers and exact payout multipliers/labels.
- `storage.ts`: durable schema/decoder.
- `persistence.ts`: shared-platform checkpoint definition and practice-credit restore.
- `audio.ts`: opt-in procedural mechanical reel/click/win cues.
- `LuckySevenClassicWorkspace.tsx`: spin state machine and accessible cabinet UI.
- `lucky-seven-classic.css`: scoped mechanical cabinet presentation.
- `lucky-seven-classic.meta.ts`: catalog metadata.
- `PRD.md`, `TRACKER.md`, `todo.md`: game-local living governance.

No gameplay code is shared with the other slot games. Existing platform save/session and repository-wide accessibility/test infrastructure may be reused where their existing contracts fit.

## Interaction and visual design

Visual direction: vintage mechanical cabinet rather than modern casino video slot. Use enamel/metal textures rendered with CSS, warm off-white reel paper, red/black/gold accents, large symbols, a coin-meter-inspired status panel, and restrained dimensional details. Do not reuse Royal Fortune's jewel-tone video-slot framing.

Primary layout:
1. bankroll and wager,
2. three oversized reels,
3. center payline indicator,
4. result text,
5. wager controls,
6. large **Pull / Spin** button,
7. paytable and preferences.

The lever is a visual affordance only and never requires dragging. The canonical action is a native button that can visually animate like a lever pull. Enter/Space activates it normally.

## Accessibility and responsive contract

- Native button controls with at least 48×48 CSS px important targets.
- No action requires drag, hover, color, animation, or sound.
- Reel result is announced once through a polite live region using symbol names and payout.
- Center payline is conveyed with text/structure in addition to a visual line.
- `:focus-visible` styling is mandatory.
- Rules/paytable are available before first spin.
- 320 CSS-px viewport must not horizontally overflow.
- 200% text resizing preserves all functionality.
- At narrow widths, cabinet framing compresses before reel labels or controls do; the three reel windows may scale with `clamp()` but remain individually distinguishable.
- Safe-area padding and normal document flow are preserved; no fixed action footer.
- `prefers-reduced-motion: reduce` removes lever swing, reel travel, bounce, and celebratory cabinet motion while preserving immediate symbol/result updates.

## Sound and motion

Audio is opt-in and starts only after interaction. Procedural cues may include handle click, staggered reel-stop ticks, a short bell-style win cue, and a neutral losing stop. No ambient loop.

Normal motion may include a short lever dip and independently decelerating reel windows. Result determination occurs before motion. Reduced-motion mode uses direct symbol replacement or a brief opacity transition.

## Error and edge handling

- Insufficient bankroll: Spin disabled with explanatory text.
- Random-source failure: no wager deduction; state unchanged.
- Persistence unavailable: continue with the platform's safe local/in-memory behavior and show nonblocking status.
- Audio unavailable: silent play.
- Repeated activation during spin: ignored by phase guard.
- Malformed save: decode to safe defaults through the existing save-session contract; never invent historical winnings.
- Exact combination precedence is deterministic so Cherry, Mixed BAR and exact BAR-family results cannot double-pay.

## Quality gates

Unit tests cover every paying classification, representative non-winning near combinations, exact precedence, wager scaling, bankroll accounting, reel composition, deterministic stop injection, exhaustive probability/RTP calculation, storage decoding, practice-credit restore and phase/checkpoint guards.

Browser tests cover route/catalog integration, accessible paytable, wager changes, spin settlement, keyboard activation, lever/button parity, reload persistence, restore credits, 320px layout, 200% text, reduced motion, touch targets, audio opt-in and no horizontal overflow.

Production completion requires the same repository-wide validation/deployment chain used by Royal Palace Blackjack and Royal Fortune Slots.

## Completion contract

**Completion state:** implementing  
**Completion evidence:** Engine TDD began on revision `1085f461f474f9d5ac1976a991d4f6079a9aae75`; final exact-revision validation/deployment evidence is not yet claimed.

- [ ] Pure reel/paytable/engine behavior is implemented and exhaustively probability-audited from source-controlled configuration.
- [ ] Schema-v1 local/account save definition persists only settled durable state and handles restore/reset safely.
- [ ] Mechanical cabinet UI, keyboard/touch behavior, paytable/help, audio preference and finite motion meet the approved interaction contract.
- [ ] 320px, 200%-text and reduced-motion browser regressions pass without page-level horizontal overflow or obscured controls.
- [ ] Catalog/workspace routing, PRD, TRACKER, todo, GAME_INDEX and `.tasks` are synchronized in the same implementation history.
- [ ] `pnpm validate` passes on the exact functional revision.
- [ ] GitHub Pages deployment succeeds for that exact functional revision.
- [ ] Tracker and completion state are changed to verified only after exact revision/run evidence exists; TASK-003 remains external if live Firebase is still unavailable.

## Research basis

Although this is free-play software, the design adopts conservative authoritative principles: rules and payout information are available before play, random outcomes are non-adaptive and testable, and product design does not pressure stake escalation or continued play. Accessibility follows WCAG 2.2 text-resize/reflow/target principles and honors `prefers-reduced-motion`.
