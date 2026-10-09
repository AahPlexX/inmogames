# Royal Palace Blackjack design

**Status:** Implementing — table experience/viewport/motion polish; live Firebase account services remain externally blocked by TASK-003  
**Last synchronized:** 2026-10-09  
**Route:** `#/games/royal-palace-blackjack`

## Product intent

Royal Palace Blackjack turns the supplied single-file prototype into an independent InMo Games title. The visual direction is an elegant green-felt casino table with restrained gold/wood detailing, but the production implementation is componentized, testable, accessible and local-first, with optional account-bound persistence through the shared Firebase platform.

This is simulated play with virtual chips only. It has no purchases, deposits, cash-out, real-money value, ads or telemetry. The frontend remains static on GitHub Pages; optional accounts and durable account saves use the approved Firebase Authentication/Cloud Firestore platform.

The 2026-10-08 table-experience pass preserves that product boundary and all rules while improving first-viewport action reachability, state hierarchy, active-wager clarity, purposeful motion, responsive use of available viewport height and the prominence/order of primary round actions. "Engaging" here means responsive tactile feedback and clear consequential state changes, never impaired control, autoplay pressure, deceptive urgency or gambling monetization.

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

A collapsed **Table rules & help** disclosure is available from the control console at all normal table phases. It summarizes the minimum wager, S17/3:2/DAS/split-Ace/surrender/insurance rules and the practice-only status of virtual credits without taking over the play surface. The felt also keeps a concise 3:2/S17 rule line visible during play. In the polished hierarchy, the disclosure follows the current round actions so reference material cannot visually or operationally interrupt the primary decision path.

## Bankroll and betting

The local practice bankroll starts at 1,000 virtual credits. Chip denominations are 5, 25, 100, 500 and 1,000. The minimum wager is 5 and the maximum wager is the available bankroll.

Bet controls: add chip, undo last chip, clear, re-bet, double current wager, and all-in. Bets become immutable after deal.

The visible **Bet** value represents the current table exposure rather than only the pre-deal chip-construction variable. During betting it shows the staged wager; after Deal it derives from hand wagers, so it remains accurate through active play, split, double-down and settlement. The settled exposure remains visible while the player reviews the result and clears only when **Next round** starts the next betting phase.

When the durable bankroll falls below the 5-credit table minimum, the betting screen offers **Restore 1,000 practice credits**. This changes only the bankroll to 1,000; W/L/P statistics, cumulative session net, preferences and last completed wager are retained. The restore is an explicit durable checkpoint and survives reload/account sync. It is described as restoring virtual practice credits, never as an advance, loan or real-money transaction.

## Session state

Visible session information includes bankroll, current table wager, shoe cards/percentage, wins, losses, pushes, and virtual-credit session net. Split-hand outcomes count independently in W/L/P statistics.

The console explicitly names the current phase and the next interaction context: **Betting / Build your wager**, **Your turn / Choose your play**, **Dealer turn / Dealer is drawing**, **Insurance / Decide on insurance**, or **Round complete / Review the result**. This prevents the enabled-control set from being the only signal for what is happening. The root table also exposes phase/outcome state to scoped CSS solely for visual treatment; game rules remain in deterministic state/engine logic.

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
- `RoyalPalaceBlackjackWorkspace.tsx`: round state machine, derived phase/outcome/current-wager presentation, phase guidance, action-first rule/help hierarchy and accessible presentation.
- `royal-palace-blackjack.css`: scoped felt/cards/controls responsive visual system, game-local route-shell compaction, stable small-viewport sizing and motion treatments; no external fonts/assets.
- `royal-palace-guide.css`: scoped phase/rules-help presentation plus narrow chip-target, single-action-frame, empty-betting-state viewport and narrow route-chrome overrides required by the responsive control contract.
- `royal-palace-blackjack.meta.ts`: catalog metadata.

## Interaction and accessibility

All actionable controls are native buttons. Primary controls target at least 48 CSS px in their compact dimension. Keyboard activation uses native Enter/Space behavior; documented single-key accelerators are additive, never required.

- No action depends on hover, color, animation, drag, right-click or audio.
- Hover-only embellishment is gated to hover-capable pointers; touch interaction does not require or retain hover state.
- Visible `:focus-visible` treatment is mandatory.
- Shared route chrome exposes a keyboard-visible **Skip to game** control that transfers focus to the main game region.
- Disabled actions remain understandable through nearby phase/rule/status text.
- Player/dealer totals and outcome changes have restrained atomic live-region announcements.
- Cards expose readable rank/suit text to assistive technology; decorative suit duplication is hidden.
- Hidden dealer card is announced as hidden, not exposed through accessible text.
- Modals use a real dialog surface with labelled heading, focus entry, Escape handling where cancellation is valid, and focus restoration.
- The rules/help disclosure uses native `details`/`summary`, stays collapsed by default, and remains keyboard-operable without custom widget scripting.
- Strategy hints are opt-in and state the recommended action in text.
- Sound is opt-in preference-controlled, synthesized locally with Web Audio, and never required for feedback.
- Motion is cosmetic and finite: card deal/reveal, active-hand emphasis, current-wager settling, result feedback, dialog entry and help disclosure use one-shot transitions/animations rather than continuous attention loops.
- `prefers-reduced-motion: reduce` removes those cosmetic animations/transitions and preserves equivalent textual/state feedback.
- Layout must not create page-level horizontal overflow at 320 CSS px. Controls reflow instead of shrinking below usable targets.
- The game must remain usable at 200% browser text sizing without overlapping essential controls.
- No sticky/fixed round-action dock is introduced; this avoids obscuring keyboard focus or content when zoomed. The only fixed surface remains the modal overlay while a modal is actively open.

## Responsive layout

The table uses normal document flow rather than locking `html/body` to one viewport. On wide screens the felt presents dealer, status, player hands and betting/actions as a coherent table. On narrow/short screens the control dock remains part of scroll flow; nothing essential is clipped behind a fixed footer. Safe-area padding is applied on supported mobile browsers.

Cards scale with `clamp()`; split hands wrap when needed. Statistics collapse to concise labels rather than disappearing entirely. The phase/action heading remains compact on narrow screens instead of forcing a minimum inline width. When a phase presents only one round action, that action spans the compact action grid and the frame has no inner inset so the button fills the framed row; multi-action player phases retain compact grouped padding and the multi-column arrangement.

The 2026-10-08 pass additionally compacts shared game-route chrome only while the Royal Palace table is mounted using a progressively enhanced `:has()` selector, leaving the shared shell untouched for every other route and providing the existing layout as fallback when relational selectors are unavailable. The general felt uses a normal absolute-unit fallback plus `svh`-aware clamped sizing so mobile browser UI does not force the table to assume the larger hidden-chrome viewport. On a representative 320×900 phone, the initial **Deal** action must be reachable in the first viewport without scrolling; smaller/shorter combinations remain allowed to scroll naturally rather than clipping controls.

The pre-deal phone state is intentionally denser than an active round because neither hand contains cards yet. At widths ≤520 CSS px, only `data-phase="betting"` uses a 17rem fallback / `clamp(17rem,30svh,21rem)` felt minimum, empty card lanes reduce to 2.5rem, and empty hand padding contracts. Once cards are dealt, all active-round card lanes and felt sizing return to the full presentation. Run `37945661859` verified this reduced the 320×900 Deal bottom edge from 1030.47px to 941.25px but left 41.25px unresolved.

At widths ≤350 CSS px, Royal now prioritizes the playable table by omitting only the nonessential route-description paragraph and tightening Royal-only shell/header/save-status spacing. The route title and eyebrow remain, save-state feedback remains, and no table content, wager information, game control or touch target is removed. This specifically recovers the remaining first-viewport space without introducing sticky controls or shrinking the game interaction contract. The five chips remain explicitly held at 48×48 and prevented from flex-shrinking below that baseline.

At narrow widths the wager modifiers use a compact five-column control row when space permits. The preferences remain lower-priority and follow rules/help. Short landscape viewports reduce felt minimum height while retaining cards, status and actions in normal document flow.

## Sound and motion

Web Audio is created only after a user gesture and only while sound is enabled. Sounds are short procedural cues for card, chip, win, push and loss events. There are no downloaded audio files.

No confetti DOM storm, infinite pulse, autoplay celebration or continuous glow loop is used. Significance controls finite visual feedback: cards enter/reveal with short transform/opacity motion, the active hand receives a one-shot emphasis, wager changes settle once, and round outcomes use restrained win/loss/push state treatments. Reduced-motion users receive the same labels, totals, status and result text with cosmetic motion disabled.

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

Rendered browser gates cover 320 CSS-px and 200% text reflow, table-help discoverability, touch targets, native keyboard behavior, reduced motion, card/dialog accessibility, deterministic betting/gameplay accounting, WebAudio opt-in/no-autoplay behavior, and the compact lone-action layout. The 2026-10-08 mobile-layout regression additionally requires first-viewport Deal reachability at 320×900, accurate staged and post-Deal wager display, authored card-entry animation in normal-motion context, and a lone action that fills its framed action row while the existing reduced-motion suite remains binding.

Historical verified baseline: run `37255447688` passed exact dependency freshness, design lint, TypeScript, structural checks, 44 unit tests, Firestore rules, account/persistence browser checks, all Royal Palace browser suites, both production builds, artifact upload and automatic Pages deployment. Repository-wide revision `9ee0f93d` later passed the complete validation/deployment chain in run `37256390159`. Independent live desktop inspection was clean; live mobile inspection exposed the former lone-action defect, and an isolated live-browser selector discrimination confirmed that correction before the unchanged 320px regression and Pages deployment passed. A later post-deploy live-browser retry timed out, so no unsupported post-fix live-mobile claim is recorded.

Current dependency baseline: maintenance workflow `37859097164` passed the complete repository validation chain and committed `853c87b0` with exact current stable pins before this UI/UX integration: React/React DOM 19.3.0, Firebase 13.0.0, Vite 8.3.4, TypeScript 7.0.2, Vitest 5.0.3 and Playwright 1.64.0. Fresh exact-revision validation/deployment evidence for the Royal Palace polish remains pending until the final chain is green.

Governance evidence for the polish is explicit. Initial integration `5dbe580c` triggered Pages run `37860044626`, which stopped at `game:check` before unit/browser execution because the reopened tracker used unsupported capability-state vocabulary and omitted the exact required `Last verified revision` field. Tracker-schema repair `5bc8d6fc` triggered run `37941713765`; that run reached `game-check: 4 game(s) OK` and then correctly stopped because the repository requires this authoritative spec and tracker to be synchronized in the same change. Sequential evidence commits `1fb1f328`/`0116ae6b` later produced the same push-level guard in run `37943885380`; atomic sync is therefore mandatory for these game-local evidence changes.

Synchronized revision `8f839ef6` triggered run `37942073809` and cleared exact dependency freshness, design lint, TypeScript, documentation governance, 80 unit tests, Firestore rules and the account/persistence browser suite. Its first design-browser assertion exposed a real 47×47 chip regression. Repair `fe6e632e` restored a non-shrinking 48×48 target. Run `37943038650` then passed the shared design regression and Royal accessibility before exposing stale post-settlement `Bet 0` gameplay expectations. Test revision `f78cf425` aligned those assertions to the intentional committed-wager presentation.

Atomic evidence revision `c00bfd99` enabled run `37944290232` to pass governance, 80 unit tests, Firestore rules, account/persistence browser, catalog accessibility, the full shared design regression, Royal accessibility, the corrected Royal gameplay suite and Royal audio. The next dedicated mobile-layout assertion exposed one geometry defect: at 320px the lone Deal button measured 267.06px inside a 281.22px action frame because the frame retained 0.48rem padding. Source repair `aacd73fd` removed that inset only in betting and settled phases so Deal/Next round fill the framed row; multi-action player controls retain grouped padding.

Run `37944928586` on synchronized revision `8fa1c2c0` proved the lone-action width repair and again passed all earlier gates through Royal gameplay/audio. The next dedicated mobile assertion exposed the remaining first-viewport problem: at 320×900 the initial Deal button's bottom edge was 1030.47px, about 130px below the viewport. The failure occurs before any card is dealt, so source repair `93a9d051` compressed only the empty betting felt/card lanes at ≤520px using stable small-viewport sizing; active-round cards and felt remain unchanged.

Synchronized revision `f12e3b14` triggered run `37945661859`, which passed dependency freshness, design lint, TypeScript, documentation governance, 80 unit tests, Firestore rules, account/persistence browser, catalog accessibility, shared design regression, Royal accessibility, Royal gameplay and Royal audio. Its dedicated 320×900 assertion measured Deal at 941.25px, improving the prior 1030.47px result by about 89px but still missing the viewport by 41.25px. Source repair `c8debf71` therefore compacts only Royal route chrome at ≤350px: it removes the nonessential descriptive route paragraph and tightens shell/header/save-status spacing while preserving the title, persistence status and all game information/actions. Source-only run `37993852710` correctly stopped at `game:check` because the repository requires this spec and tracker to be synchronized atomically with the repair; no later browser result is inferred from that governance failure.

## Standards/research basis for the 2026-10-08 experience pass

Current official guidance was rechecked before implementation. MDN's viewport-unit documentation distinguishes the stable small viewport (`svh`) from the larger dynamic-browser-chrome viewport behavior, informing the mobile felt sizing. MDN's `prefers-reduced-motion` guidance informs removal/replacement of nonessential motion. WCAG 2.2 focus-not-obscured and target-size requirements reinforce normal-flow actions, visible focus and the repository's stricter 44–48px control baseline. Current React documentation reinforces stable list identity and avoiding unnecessary effect-driven visual state; phase, outcome and wager presentation therefore remain derived declaratively from existing table state rather than adding animation timers or synchronization effects.

## Completion contract

**Completion state:** implementing  
**Completion evidence:** the prior verified baseline remains valid for unchanged engine/rules/persistence behavior, but the material UI/UX change reopens responsive/presentation and production-integration gates. Run `37945661859` is green through Royal gameplay/audio and proves the first viewport improved from 1030.47px to 941.25px; it is not a completion run because Deal remained 41.25px below the 320×900 viewport and the dedicated normal-motion card assertion, remaining game regressions, builds and deployment were not reached.

- [x] A complete betting-to-settlement blackjack round is implemented, including Hit, Stand, Double, one Split/DAS, split-Ace handling, late Surrender and Insurance; current runs freshly reconfirm deterministic gameplay/accounting.
- [x] Six-deck shoe behavior, S17, natural/split-21 semantics, payouts, action legality, cut-card behavior and representative strategy decisions remain covered by automated tests.
- [x] Current gameplay evidence freshly verifies staged and settled wager clarity alongside re-bet/2×/all-in/undo/clear and settlement accounting; durable recovery/reload remains covered by the account browser suite.
- [x] Shared rendered evidence confirms 320 CSS-px/200%-text reflow, Royal >=48px chip targets, keyboard/touch behavior, reduced-motion behavior, desktop layout, accessible card/dialog focus behavior and lone-action row fill; first-viewport Deal reachability still requires a green rerun after `c8debf71`.
- [ ] Purposeful normal-motion deal/reveal/turn/result/dialog feedback and complete reduced-motion suppression must pass all dedicated fresh rendered evidence; shared reduced-motion is green, but the dedicated normal-motion mobile card assertion was not reached after the first-viewport failure.
- [x] Procedural WebAudio is freshly green in run `37945661859`: opt-in, AudioContext resume, no autoplay, persisted preference and cue suppression.
- [x] Guest persistence, reset, migration and shared account-save checkpoints remain green in current browser/emulator evidence; TASK-003 is an external live Firebase blocker rather than unfinished game code.
- [x] Runtime assets/network use still add no third-party font, visual, audio, telemetry or game-specific network dependency.
- [ ] Full exact-revision CI gates and automatic GitHub Pages deployment must be green after the narrow-route-chrome repair.
- [ ] `docs/GAME_INDEX.md`, this spec, `src/games/royal-palace-blackjack/TRACKER.md`, PRD/todo and `.tasks/` must agree on final shipped state.

This section is authoritative for the word **complete**. Any new game-local feature, rule, persistence behavior, material UI change or unresolved defect automatically reopens Royal Palace Blackjack: keep `Completion state` at `implementing`, add or reopen the relevant checklist gate and tracker capability, and do not restore `verified` until fresh evidence satisfies every applicable gate.

Shared account-save code is repository- and emulator-verified, but live Firebase project provisioning and real-site account/save verification remain externally blocked by TASK-003; that platform dependency is not represented as a game implementation defect and is not claimed as live-verified. See `docs/FIREBASE_SETUP.md`.
