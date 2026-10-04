# Royal Palace Blackjack design

**Status:** Approved concept; production implementation in progress  
**Last synchronized:** 2026-10-04  
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

## Bankroll and betting

The local practice bankroll starts at 1,000 virtual credits. Chip denominations are 5, 25, 100, 500 and 1,000. The minimum wager is 5 and the maximum wager is the available bankroll.

Bet controls: add chip, undo last chip, clear, re-bet, double current wager, and all-in. Bets become immutable after deal.

When the bankroll reaches zero after settlement, the player may reset the practice bankroll to 1,000. This is explicitly described as resetting virtual practice credits, not as an advance, loan or real-money transaction.

## Session state

Visible session information includes bankroll, current wager, shoe cards/percentage, wins, losses, pushes, and virtual-credit session net. Split-hand outcomes count independently in W/L/P statistics.

Local storage key: `inmogames:royal-palace-blackjack:v1`.
Cloud game slug: `royal-palace-blackjack`.

Durable state is limited to bankroll, last completed wager, W/L/P statistics, sound preference, strategy-hint preference and cumulative virtual-credit session net. Never persist a live hand, shoe, current wager construction or unfinished round.

Guests use defensive local persistence. Once the shared Firebase platform is implemented, authenticated players sync the same committed durable state to `users/{uid}/games/royal-palace-blackjack` through the shared save repository. If no account save exists at first sign-in, eligible local progress may seed it; an existing account save must not be silently overwritten by unrelated guest data.

A dedicated **Reset saved game** control restores the initial bankroll/statistics/preferences state for this game only and, when authenticated, must keep the account save and local mirror consistent.

## Architecture

- `engine.ts`: card/hand scoring, legal actions, settlement, blackjack/split semantics and payout math. No React, DOM, storage or audio.
- `shoe.ts`: six-deck construction, cryptographically seeded browser shuffle adapter plus deterministic seeded shuffle for tests, cut-card/penetration helpers.
- `storage.ts`: game-state serialization/local compatibility seam; integration must migrate behind the shared platform save repository without putting Firebase calls in the game engine.
- `strategy.ts`: optional basic-strategy recommendation for this exact S17/DAS table; advisory only and never auto-plays.
- `RoyalPalaceBlackjackWorkspace.tsx`: round state machine and accessible presentation.
- `royal-palace-blackjack.css`: scoped responsive visual system; no external fonts/assets.
- `royal-palace-blackjack.meta.ts`: catalog metadata.

## Interaction and accessibility

All actionable controls are native buttons. Primary controls target at least 48 CSS px in their compact dimension. Keyboard activation uses native Enter/Space behavior; documented single-key accelerators are additive, never required.

- No action depends on hover, color, animation, drag, right-click or audio.
- Visible `:focus-visible` treatment is mandatory.
- Disabled actions remain understandable through nearby rules/status text.
- Player/dealer totals and outcome changes have restrained live-region announcements.
- Cards expose readable rank/suit text to assistive technology; decorative suit duplication is hidden.
- Hidden dealer card is announced as hidden, not exposed through accessible text.
- Modals use a real dialog surface with labelled heading, focus entry, Escape handling where cancellation is valid, and focus restoration.
- Strategy hints are opt-in and state the recommended action in text.
- Sound is opt-in preference-controlled, synthesized locally with Web Audio, and never required for feedback.
- Motion is cosmetic. `prefers-reduced-motion: reduce` removes dealing, chip, glow and celebration motion.
- Layout must not create page-level horizontal overflow at 320 CSS px. Controls reflow instead of shrinking below usable targets.
- The game must remain usable at 200% browser zoom without overlapping essential controls.

## Responsive layout

The table uses normal document flow rather than locking `html/body` to one viewport. On wide screens the felt presents dealer, status, player hands and betting/actions as a coherent table. On narrow/short screens the control dock becomes part of the scroll flow; nothing essential is clipped behind a fixed footer. Safe-area padding is applied on supported mobile browsers.

Cards scale with `clamp()`; split hands wrap when needed. Statistics collapse to concise labels rather than disappearing entirely.

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

Engine tests must cover Ace scoring, natural blackjack, dealer S17 behavior, payout math, push/bust, insurance, late surrender, double, split eligibility, split-Ace restrictions and split-21 semantics. Shoe tests cover 312-card composition, deterministic test shuffle and cut threshold. Storage tests cover valid/missing/malformed/write-failure states. Strategy tests cover representative hard/soft/pair decisions and legal fallbacks.

The game is not `verified` until typecheck, structural check, all unit tests and production build pass; responsive/accessibility review is complete; guest persistence and authenticated account-save behavior are verified; tracker/spec/index/task docs match shipped behavior; and Pages deployment succeeds after repository TASK-001 is resolved.
