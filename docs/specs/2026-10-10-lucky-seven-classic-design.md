# Lucky Seven Classic design

**Status:** Approved design — implementation pending  
**Last synchronized:** 2026-10-10  
**Proposed route:** `#/games/lucky-seven-classic`

## Product intent

Lucky Seven Classic is a standalone three-reel mechanical-style slot game with a tactile, simple ruleset and a presentation intentionally distinct from both Royal Fortune Slots and Cascade Vault. It uses virtual credits only: no purchases, deposits, cash-out, ads, telemetry, or real-money value.

The core appeal is immediacy and physical-machine character: three large reels, recognizable classic symbols, a clear paytable, one payline, a pull-lever-inspired primary action that remains fully accessible as a normal button, finite reel-stop motion, and transparent deterministic payout evaluation.

## Core rules

- 3 reels × 1 evaluated center payline.
- Visible cabinet may show neighboring symbols above/below for mechanical context, but only the center row pays.
- Wager steps: 1, 2, 5, 10, 25 virtual credits.
- Symbols: Cherry, Lemon, Orange, Plum, Bell, BAR, Double BAR, Triple BAR, Red 7, Gold 7.
- Payouts require the exact center-line combination defined by the paytable.
- Mixed BAR combinations may have their own fixed award; all other wins use exact matching combinations.
- Cherries may award on one, two, or three appearances according to the source-controlled paytable.
- No Wild, Scatter, bonus wheel, autoplay, cascading, expanding symbols, progressive jackpot, or adaptive probability.
- Optional **Hold** and **Nudge** features are not part of v1 because they materially change classic probability and require a separate probability model; the design preserves them as future expansion only if explicitly reopened.
- Every spin is independently random from explicit reel strips. Recent results, bankroll, or session behavior never alter the strips or stop selection.

## Probability and reel model

Each physical-style reel has an explicit ordered strip. Production uses browser cryptographic randomness to select one stop per reel; tests inject a deterministic seeded source. Visible neighboring symbols derive from the ordered strip with wraparound.

The paytable and strips are source-controlled and separately testable. The implementation calculates the exact probability of each paying combination and the theoretical RTP from strip frequencies. Those values are documented in the live tracker once the final strip lengths/paytable are implemented.

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

Proposed game-local modules:

- `engine.ts`: center-line combination classification and payout math.
- `reels.ts`: three source-controlled reel strips, random-stop adapter, visible-window projection.
- `paytable.ts`: exact combination awards and probability/RTP helpers.
- `storage.ts`: durable schema/decoder.
- `persistence.ts`: shared-platform checkpoint definition.
- `audio.ts`: opt-in procedural mechanical reel/click/win cues.
- `LuckySevenClassicWorkspace.tsx`: spin state machine and accessible cabinet UI.
- `lucky-seven-classic.css`: scoped mechanical cabinet presentation.
- `lucky-seven-classic.meta.ts`: catalog metadata.
- `PRD.md`, `TRACKER.md`, `todo.md`: game-local living governance.

No gameplay code is shared with the other slot games.

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

The lever is a visual affordance only and must never require dragging. The canonical action is a native button that can visually animate like a lever pull. Enter/Space activates it normally.

## Accessibility and responsive contract

- Native button controls with at least 48×48 CSS px important targets.
- No action requires drag, hover, color, animation, or sound.
- Reel result announced once through a polite live region using symbol names and payout.
- Center payline is conveyed with text/structure in addition to a visual line.
- `:focus-visible` styling is mandatory.
- Rules/paytable available before first spin.
- 320 CSS-px viewport must not horizontally overflow.
- 200% text resizing must preserve all functionality.
- At narrow widths, cabinet framing compresses before reel labels or controls do; the three reel windows may scale with `clamp()` but remain individually distinguishable.
- Safe-area padding and normal document flow are preserved; no fixed action footer.
- `prefers-reduced-motion: reduce` removes lever swing, reel travel, bounce, and celebratory cabinet motion while preserving immediate symbol/result updates.

## Sound and motion

Audio is opt-in and starts only after interaction. Procedural cues may include handle click, staggered reel stop ticks, a short bell-style win cue, and a neutral losing stop. No ambient loop.

Normal motion may include a short lever dip and independently decelerating reel windows. Result determination occurs before motion. Reduced-motion mode uses direct symbol replacement or a brief opacity transition.

## Error and edge handling

- Insufficient bankroll: Spin disabled with explanatory text.
- Random-source failure: no wager deduction; state unchanged.
- Persistence unavailable: continue in memory/local fallback and show nonblocking status.
- Audio unavailable: silent play.
- Repeated activation during spin: ignored by phase guard.
- Malformed save: sanitize to safe defaults; never invent historical winnings.
- Exact combination precedence is deterministic so mixed BAR and exact BAR-family results cannot double-pay accidentally.

## Quality gates

Unit tests must cover every paying combination, all non-winning near combinations, mixed BAR rules, cherry partial-match rules, wager scaling, bankroll accounting, reel strip composition, deterministic stop injection, probability/RTP calculation, storage decoding, restore credits, and phase guards.

Browser tests must cover route/catalog integration, accessible paytable, wager changes, spin settlement, keyboard activation, lever visual parity with button action, reload persistence, restore credits, 320px layout, 200% text, reduced motion, touch targets, audio opt-in, and no horizontal overflow.

Production completion requires the same repository-wide validation/deployment chain used by Royal Palace Blackjack and Royal Fortune Slots.

## Research basis

Although this is free-play software, the design adopts conservative authoritative principles: rules and payout information are available before play, random outcomes are non-adaptive and testable, and product design does not pressure stake escalation or continued play. Accessibility follows WCAG 2.2 text-resize/reflow/target principles and honors `prefers-reduced-motion`.
