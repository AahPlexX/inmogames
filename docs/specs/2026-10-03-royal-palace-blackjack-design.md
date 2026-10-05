# Royal Palace Blackjack design

**Status:** Game implementation verified; live Firebase account services externally blocked by TASK-003  
**Last synchronized:** 2026-10-05  
**Route:** `#/games/royal-palace-blackjack`

## Product intent

Royal Palace Blackjack turns the supplied single-file prototype into an independent InMo Games title. The visual direction is an elegant green-felt casino table with restrained gold/wood detailing, but the production implementation is componentized, testable, accessible and local-first, with optional account-bound persistence through the shared Firebase platform.

This is simulated play with virtual chips only. It has no purchases, deposits, cash-out, real-money value, ads or telemetry. The frontend remains static on GitHub Pages; optional accounts and durable account saves use the approved Firebase Authentication/Cloud Firestore platform.

## Table rules

The v1 table is fixed and visibly disclosed:

- Six standard 52-card decks (312 cards), shuffled locally.
- Dealer stands on all 17, including soft 17 (S17).
- Blackjack pays 3:2.
- Ordinary wins pay 1:1; pushes return the wager.
- Insurance is offered when the dealer up-card is an Ace, costs up to one-half of the original wager, and pays 2:1 profit when the dealer has blackjack.
- Double down is allowed on any first two cards and after a non-Ace split; exactly one additional card is dealt.
- One split is allowed, creating at most two player hands. Equal-value cards may split.
- Split Aces receive exactly one additional card per hand and cannot hit or double.
- A two-card 21 after a split is 21, not a natural blackjack.
- Late surrender is available only on the original unsplit two-card hand after the dealer blackjack check; half the wager is returned.
- Dealer hole-card check occurs with Ace or ten-value up-card before player actions.
- The shoe is reshuffled between rounds after at least 75% penetration; never during an active round unless the shoe is unexpectedly exhausted.
- No side bets other than insurance.

The rule model follows recognized blackjack configurations documented by the Nevada Gaming Control Board and casino rules references researched on 2026-10-03.

A collapsed **Table rules & help** disclosure is available from the control console at all normal table phases. It summarizes the minimum wager, S17/3:2/DAS/split-Ace/surrender/insurance rules and the practice-only status of virtual credits without taking over the play surface. The felt also keeps a concise 3:2/S17 rule line visible during play.

## Bankroll and betting

The local practice bankroll starts at 1,000 virtual credits. Chip denominations are 5, 25, 100, 500 and 1,000. The minimum wager is 5 and the maximum wager is the available bankroll.

Bet controls: add chip, undo last chip, clear, re-bet, double current wager, and all-in. Bets become immutable after deal.

When the durable bankroll falls below the 5-credit table minimum, the betting screen offers **Restore 1,000 practice credits**. This changes only the bankroll to 1,000; W/L/P statistics, cumulative session net, preferences and last completed wager are retained. The restore is an explicit durable checkpoint and survives reload/account sync. It is described as restoring virtual practice credits, never as an advance, loan or real-money transaction.

## Session state

Visible session information includes bankroll, current wager, shoe cards/percentage, wins, losses, pushes, and virtual-credit session net. Split-hand outcomes count independently in W/L/P statistics.

The console explicitly names the current phase and the next interaction context: **Betting / Build your wager**, **Your turn / Choose your play**, **Dealer turn / Dealer is drawing**, **Insurance / Decide on insurance**, or **Round complete / Review the result**. This prevents the enabled-control set from being the only signal for what is happening.

Local storage key: `inmogames:royal-palace-blackjack:v1`.
Cloud game slug: `royal-palace-blackjack`.

Durable state is limited to bankroll, last completed wager, W/L/P statistics, sound preference, strategy-hint preference and cumulative virtual-credit session net. Never persist a live hand, shoe, current wager construction or unfinished round. Settlement commits bankroll, last completed wager and statistics. Preference changes merge into the last committed durable balance even during chip construction or a round. Reloading abandons staged wagers/unfinished rounds without consuming durable credits. Historical legacy balances cannot be repaired by guessing unrecorded staged chips.

Guests use defensive local persistence. Authenticated players sync the same committed durable state to `users/{uid}/games/royal-palace-blackjack` through the shared save repository. Schema version is 1. At the first authenticated game load, a transaction seeds eligible local progress only when no account save exists; an existing account save must not be silently overwritten by unrelated guest data.

A dedicated **Reset saved game** control restores the initial bankroll/statistics/preferences state for this game only and, when authenticated, clears the local mirror and writes a default-state account document so old guest data cannot reseed it. It never deletes the account or another game.

## Architecture

- `engine.ts`: card/hand scoring, legal actions, settlement, blackjack/split semantics and payout math. No React, DOM, storage or audio.
- `shoe.ts`: six-deck construction, cryptographically seeded browser shuffle adapter plus deterministic seeded shuffle for tests, cut-card/penetration helpers.
- `storage.ts`: game-state schema/decoder and legacy-local compatibility seam.
- `persistence.ts`: versioned shared-platform definition and completed-round/preference checkpoint selection.
- `strategy.ts`: optional basic-strategy recommendation for this exact S17/DAS table; advisory only and never auto-plays.
- `RoyalPalaceBlackjackWorkspace.tsx`: round state machine, phase guidance, rules/help disclosure and accessible presentation.
- `royal-palace-blackjack.css`: scoped felt/cards/controls responsive visual system; no external fonts/assets.
- `royal-palace-guide.css`: scoped phase/rules-help presentation kept separate from the core table treatment.
- `royal-palace-blackjack.meta.ts`: catalog metadata.

## Interaction and accessibility

All actionable controls are native buttons. Primary controls target at least 48 CSS px in their compact dimension. Keyboard activation uses native Enter/Space behavior; documented single-key accelerators are additive, never required.

- No action depends on hover, color, animation, drag, right-click or audio.
- Visible `:focus-visible` treatment is mandatory.
- Shared route chrome exposes a keyboard-visible **Skip to game** control that transfers focus to the main game region.
- Disabled actions remain understandable through nearby phase/rule/status text.
- Player/dealer totals and outcome changes have restrained live-region announcements.
- Cards expose readable rank/suit text to assistive technology; decorative suit duplication is hidden.
- Hidden dealer card is announced as hidden, not exposed through accessible text.
- Modals use a real dialog surface with labelled heading, focus entry, Escape handling where cancellation is valid, and focus restoration.
- The rules/help disclosure uses native `details`/`summary`, stays collapsed by default, and remains keyboard-operable without custom widget scripting.
- Strategy hints are opt-in and state the recommended action in text.
- Sound is opt-in preference-controlled, synthesized locally with Web Audio, and never required for feedback.
- Motion is cosmetic. `prefers-reduced-motion: reduce` removes dealing, chip, glow and celebration motion.
- Layout must not create page-level horizontal overflow at 320 CSS px. Controls reflow instead of shrinking below usable targets.
- The game must remain usable at 200% browser text sizing without overlapping essential controls.

## Responsive layout

The table uses normal document flow rather than locking `html/body` to one viewport. On wide screens the felt presents dealer, status, player hands and betting/actions as a coherent table. On narrow/short screens the control dock becomes part of the scroll flow; nothing essential is clipped behind a fixed footer. Safe-area padding is applied on supported mobile browsers.

Cards scale with `clamp()`; split hands wrap when needed. Statistics collapse to concise labels rather than disappearing entirely. The phase/action heading and rule disclosure stack vertically on narrow screens instead of forcing a minimum inline width. When a phase presents only one round action, that action spans the compact action grid rather than leaving a misleading empty column; multi-action player phases retain the compact multi-column arrangement.

## Sound and motion

Web Audio is created only after a user gesture and only while sound is enabled. Sounds are short procedural cues for card, chip, win, push and loss events. There are no downloaded audio files.

No confetti DOM storm is used. Celebration is a lightweight scoped CSS treatment and is omitted under reduced motion.

## Strategy assistance

Hints are optional learning assistance for the fixed table rules. The strategy module returns a recommended legal action plus a concise rationale. It must distinguish hard totals, soft totals and pairs and degrade to a legal fallback when doubling/splitting/surrender is unavailable. Hints do not imply guaranteed outcomes.

## Error and edge handling

- Local storage unavailable/malformed: continue with in-memory defaults and surface a nonblocking persistence note.
- Firebase unavailable while authenticated: continue play, preserve committed local state for retry, and surface a nonblocking sync failure.
- Audio unavailable: gameplay continues silently.
- Unexpected empty shoe: replenish only through the shoe abstraction and record no impossible card.
- Rapid repeated input: round phase/state guards make actions idempotent or reject them.
- Insufficient bankroll disables double, split and insurance.
- A dealer natural prevents late surrender/action play.
- Split hands settle independently.
- Natural blackjack is distinct from split 21.

## Quality gates

Engine tests cover Ace scoring, natural blackjack, dealer S17 behavior, payout math, push/bust, insurance, late surrender, double, split eligibility, split-Ace restrictions and split-21 semantics. Shoe tests cover 312-card composition, deterministic test shuffle and cut threshold. Storage/checkpoint tests cover valid, missing, malformed, failure and staged-wager durability boundaries. Strategy tests cover representative hard/soft/pair decisions and legal fallbacks.

Rendered browser gates cover 320 CSS-px and 200% text reflow, table-help discoverability, touch targets, native keyboard behavior, reduced motion, card/dialog accessibility, deterministic betting/gameplay accounting, WebAudio opt-in/no-autoplay behavior, and the compact lone-action layout. Run `37255447688` passed exact dependency freshness, design lint, TypeScript, structural checks, 44 unit tests, Firestore rules, account/persistence browser checks, all Royal Palace browser suites, both production builds, artifact upload and automatic Pages deployment. Independent live desktop inspection was clean; live mobile inspection exposed the lone-action defect, and an isolated live-browser selector discrimination confirmed the exact correction before the unchanged 320px regression and Pages deployment passed. A later post-deploy live-browser retry timed out, so this document does not claim a successful post-fix live-mobile inspection.

The Royal Palace game implementation is therefore verified. Shared account-save code is repository- and emulator-verified, but live Firebase project provisioning and real-site account/save verification remain externally blocked by TASK-003; that platform dependency is not represented as a game implementation defect and is not claimed as live-verified. See `docs/FIREBASE_SETUP.md`.