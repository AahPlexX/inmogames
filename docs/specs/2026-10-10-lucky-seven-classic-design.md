# Lucky Seven Classic design

**Status:** Implementing — engine verified; settled persistence implementation awaiting GREEN  
**Last synchronized:** 2026-10-10  
**Route:** `#/games/lucky-seven-classic`

## Product intent

Lucky Seven Classic is a standalone three-reel mechanical-style slot, intentionally distinct from Royal Fortune Slots and Cascade Vault. It uses virtual practice credits only: no deposits, purchases, cash-out, ads, telemetry, real-money value or gambling-account functionality.

The experience is deliberately direct: three large reels, one clearly identified center payline, a readable paytable, a native Pull / Spin control with optional lever-like visual feedback, finite reel-stop motion and transparent deterministic payout evaluation after random stops have been selected. Rules and payout information are available before the first spin.

## Core rules

- 3 reels × 1 evaluated center payline; neighboring symbols are presentation only.
- Supported wagers: 1, 2, 5, 10 and 25 virtual credits.
- Symbols: Cherry, Lemon, Orange, Plum, Bell, BAR, Double BAR, Triple BAR, Red 7 and Gold 7.
- Cherry precedence: any 1 Cherry pays 1×; any 2 pay 3×; 3 pay 10×.
- Without Cherries, three non-identical BAR-family symbols pay Mixed BAR at 5×.
- Otherwise, only an exact three-symbol match pays.
- One spin receives exactly one classification; no overlapping double payment.
- No Wild, Scatter, autoplay, cascading, expanding symbols, bonus wheel, progressive jackpot or adaptive/compensated probability.
- Hold/Nudge are excluded from v1 because they require a separately approved probability model.
- Recent outcomes, bankroll and session behavior never influence reel strips or stop selection.

### Paytable

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

All values multiply the selected wager.

## Probability and reel model

Each reel is an ordered 32-stop source-controlled strip. Production selects one stop per reel with `crypto.getRandomValues()` plus rejection sampling; tests inject deterministic stops. Visible windows show previous/selected/next symbols with wraparound.

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

The `32³ = 32,768` complete state space is exhaustively enumerated by production audit code. Verified configured values are 94.775390625% theoretical RTP, 42.047119140625% credit-paying-result frequency and 1/32,768 probability of three Gold 7s. Random-source failure aborts before bankroll mutation.

## Bankroll and persistence

Initial bankroll: 500 virtual credits. Local storage key: `inmogames:lucky-seven-classic:v1`. Cloud slug: `lucky-seven-classic`.

Schema-v1 durable state consists only of settled `bankroll`, `selectedWager`, `spins`, `totalWagered`, `totalWon`, consistent `net`, `largestWin`, boolean `preferences.sound`/`preferences.motion`, and `lastResult` or null. A completed result stores the three center symbols, wager, payout and human-readable classification.

In-flight reel stops/windows, presentation animation and partially settled spins are excluded. `settleLuckySevenSpin(state, center)` verifies sufficient bankroll, derives the award from the engine, and returns one fully settled immutable next state. `decodeLuckySevenSave` rejects unsupported wagers, unknown symbols, invalid/non-safe accounting, inconsistent net or malformed preferences/result data. `restorePracticeCredits` restores only bankrolls below the 1-credit minimum to 500 while preserving history, selected wager, result and preferences; otherwise it returns null.

Authenticated saves use the existing shared save repository at `users/{uid}/games/lucky-seven-classic`; live configured-project verification is the external TASK-003 platform concern.

## Architecture

- `reels.ts`: symbols, ordered strips, visible-window projection, unbiased browser stop adapter.
- `paytable.ts`: supported wagers, labels and payout constants.
- `engine.ts`: payout classification, deterministic spin projection and exhaustive probability audit.
- `storage.ts`: schema-v1 durable state constants/types/decoder.
- `persistence.ts`: `GameSaveDefinition`, pure atomic settlement and practice-credit restore.
- `audio.ts`: future opt-in procedural mechanical cues after user interaction.
- `LuckySevenClassicWorkspace.tsx`: future accessible spin state machine/cabinet.
- `lucky-seven-classic.css`: future game-scoped responsive cabinet presentation.
- `lucky-seven-classic.meta.ts`: catalog metadata.
- `PRD.md`, `TRACKER.md`, `todo.md`: living game continuity.

Gameplay logic is not shared with Royal Fortune Slots or Cascade Vault. Existing repo-level save/accessibility/test infrastructure is reused where its established contract fits.

## Interaction and visual design

The final cabinet is vintage mechanical rather than video-slot styled: enamel/metal framing, warm reel paper, restrained red/black/gold accents, large readable symbols and coin-meter-like status. Primary hierarchy is bankroll/wager → reels/center payline → result → wager controls → Pull / Spin → rules/paytable/preferences. The lever is visual only; a native button is canonical and rapid repeated activation is phase-guarded.

## Accessibility and responsive contract

- Native controls and at least 48×48 CSS px important targets.
- No required drag, hover, color, audio or animation.
- One polite result announcement with readable symbol names and payout.
- Text/structure communicates center-payline meaning.
- Visible focus treatment and pre-spin rules/paytable.
- No page-level horizontal overflow at 320 CSS px; all functionality at 200% text.
- Safe-area-aware normal flow; no obscuring fixed action footer.
- Reduced-motion preference removes lever/reel/travel effects without removing state feedback.

## Sound and motion

Audio is opt-in after user interaction and procedural only; no ambient loop. Normal motion is finite presentation after logical settlement. Reduced motion uses immediate or minimal-opacity state replacement.

## Error and edge handling

Insufficient bankroll rejects settlement; unsupported wager/stop rejects; random-source failure leaves state unchanged; shared persistence failures remain nonblocking; audio failure is silent; duplicate spin activation is guarded; malformed save decoding fails safely; payout precedence prevents double payment.

## Quality gates

Lean full-coverage TDD proves distinct behavioral seams rather than reproducing implementation algorithms. Engine tests cover classifications, losses, precedence, wagers, reel projection/composition, deterministic input and exhaustive math. Persistence tests cover only game-local schema, settlement and restore, relying on already-green shared repository tests for generic save mechanics. The later dedicated browser suite will cover actual catalog/route gameplay, paytable, wager/spin/reload/restore, keyboard/touch/audio and the 320px/200%-text/reduced-motion contract.

## Implementation evidence

- Engine RED: `1085f461f474f9d5ac1976a991d4f6079a9aae75` / run `38098884217`, expected missing engine/reel modules.
- Engine implementation: `cec193e955e73834fcf5144703b35a8b411d8591`.
- Governance diagnostic: `47ec333f5d32c4d801b6e74b048aa09faf36b258` / run `38099168522`; static structure passed and history sync correctly caught non-atomic evidence.
- Engine GREEN: `de1136d18390b1044eab16475fab5aee31b2c6f6` / run `38099279607`; game-check, unit suite, builds and Pages succeeded.
- Persistence RED: `eb89b259c60a3a12c9a832db94ea21602035d1eb` / run `38099468454`; dependency/current/design checks passed, then TypeScript failed only on the intentionally absent `persistence.ts` and `storage.ts` imports.
- Persistence production implementation now adds only those two game-local modules against the unchanged RED assertions; GREEN evidence is not claimed until CI passes.

## Completion contract

**Completion state:** implementing  
**Completion evidence:** Engine/probability is green at `de1136d18390b1044eab16475fab5aee31b2c6f6` / run `38099279607`; persistence RED is `eb89b259c60a3a12c9a832db94ea21602035d1eb` / run `38099468454`; whole-game validation/deployment is not yet claimed.

- [x] Pure reel/paytable/engine behavior is implemented and exhaustively probability-audited from source-controlled configuration.
- [ ] Schema-v1 local/account save definition persists only settled durable state and handles restore/reset safely.
- [ ] Mechanical cabinet UI, keyboard/touch behavior, paytable/help, audio preference and finite motion meet the approved interaction contract.
- [ ] 320px, 200%-text and reduced-motion browser regressions pass without page-level horizontal overflow or obscured controls.
- [ ] Catalog/workspace routing, PRD, TRACKER, todo, GAME_INDEX and `.tasks` are synchronized through the completed implementation history.
- [ ] `pnpm validate` passes on the exact functional revision.
- [ ] GitHub Pages deployment succeeds for that exact functional revision.
- [ ] Tracker and completion state become verified only after exact revision/run evidence exists; TASK-003 remains external while live Firebase is unavailable.

## Research basis

This free-play design keeps rules/paytable available before play, uses non-adaptive inspectable randomness, avoids stake/continuation pressure, and follows WCAG 2.2 reflow/text/target/reduced-motion principles.
