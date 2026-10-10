# Cascade Vault design

**Status:** Approved design — implementation pending  
**Last synchronized:** 2026-10-10  
**Proposed route:** `#/games/cascade-vault`

## Product intent

Cascade Vault is the modern high-feature member of the three-game slot family. It is mechanically and visually independent from Royal Fortune Slots and Lucky Seven Classic. It uses virtual credits only: no purchases, deposits, cash-out, ads, telemetry, or real-money value.

The game is a six-reel cascading-symbol game built around cluster/ways-style wins, symbol removal/refill, escalating cascade multipliers, a clearly bounded bonus meter, and a feature round that changes the board rules without introducing autoplay or adaptive outcomes.

The game should feel energetic and contemporary, but clarity wins over spectacle. Outcome logic must remain inspectable and deterministic once a spin seed/result is generated, and all significant state changes must have textual equivalents.

## Core rules

- 6 reels × 5 rows.
- Symbols fall into each reel from source-controlled weighted symbol distributions.
- Wins use an adjacent-reel **ways** model rather than fixed paylines: a paying symbol must appear on at least three consecutive reels starting from reel 1, with one or more occurrences on each participating reel.
- Each qualifying symbol awards `paytable[symbol][reelCount] × wager × waysCountFactor` according to source-controlled rules.
- Wild substitutes for normal symbols but not Scatter/Bonus symbols.
- Winning normal symbols are removed simultaneously after payout; remaining symbols fall downward; new symbols refill from the top.
- The cascade repeats while at least one paying result remains.
- Base-spin cascade multiplier starts at ×1 and increases by +1 after each winning cascade up to ×10; it resets at the start of every paid spin.
- Scatter symbols do not disappear as normal wins and are evaluated only on the initial board of a spin and on newly generated refill positions according to explicit engine rules.
- Four or more Scatters across the board trigger **Vault Run**, a bounded feature round of 8 free spins.
- Vault Run begins each free spin with the feature multiplier at ×2 and preserves the highest multiplier reached across the feature, capped at ×20.
- During Vault Run, a visible three-step vault meter advances only when a cascade reaches at least the configured threshold of consecutive winning collapses. Filling the meter upgrades a deterministic feature modifier for remaining free spins: first upgrade adds one extra Wild to each refill sequence, second upgrade increases qualifying symbol payouts by a documented multiplier, third upgrade awards 3 additional free spins once. The meter does not create random hidden jackpots.
- Additional four-Scatter triggers during Vault Run add 4 free spins, subject to a documented feature cap.
- No autoplay, turbo autoplay, infinite cascading loop, loss-chasing prompt, adaptive probability, or stake escalation prompt.

## Outcome and randomness model

A paid spin first obtains a production random seed/source from browser cryptographic randomness. Board generation and every refill draw for that spin consume that source through a pure engine adapter. Tests inject deterministic seeded sources.

Weighted symbol tables, feature thresholds, multiplier caps, and paytable values are source-controlled constants. Outcomes never adapt to bankroll, recent results, session length, or user behavior.

The engine enforces a hard maximum cascade count per spin as a corruption guard; reaching it is treated as an engine error rather than silently awarding or removing value. The configured distributions must make the guard unreachable in valid normal play except at vanishingly improbable or injected-test states.

Exact/analytical RTP calculation may be impractical for the full cascading state space. The implementation must therefore provide: exact validation of each primitive symbol distribution and payout function, deterministic exhaustive checks for bounded subspaces, and a large reproducible Monte Carlo audit with confidence bounds recorded in the tracker. The audit is evidence, not a claim that individual sessions converge quickly to theoretical expectation.

## Bankroll and persistence

Initial practice bankroll: 5,000 virtual credits.

Base wager steps: 10, 20, 50, 100, 250 virtual credits, bounded by available bankroll.

Local storage key: `inmogames:cascade-vault:v1`.
Cloud game slug: `cascade-vault`.

Persist:
- settled bankroll,
- selected base wager,
- lifetime paid spins,
- total wagered/won/net,
- largest completed spin win,
- highest cascade chain,
- completed Vault Run count,
- sound preference,
- reduced-effects preference if explicitly selected,
- last completed result summary.

Do not persist an in-flight paid spin or partially resolved cascade. Vault Run may checkpoint only after a free spin fully resolves, including all cascades and awards. Reload restores the last fully settled feature checkpoint so a completed award cannot duplicate or disappear.

If bankroll falls below the 10-credit minimum, expose **Restore 5,000 practice credits** while retaining statistics/preferences.

Authenticated saves use `users/{uid}/games/cascade-vault`; external Firebase provisioning remains platform-level rather than game-local.

## Architecture

Proposed game-local modules:

- `engine.ts`: board generation contract, ways evaluation, Wild substitution, simultaneous removal, gravity/refill cascade loop, multiplier state, Scatter/feature transitions, corruption guards.
- `symbols.ts`: weighted symbol distributions, symbol metadata, deterministic draw adapter.
- `paytable.ts`: payout functions, multiplier/feature modifiers, audit helpers.
- `simulation.ts`: deterministic reproducible probability/RTP simulation utilities used by tests/tooling, not runtime UI.
- `storage.ts`: durable schema/decoder.
- `persistence.ts`: shared-platform checkpoint definition.
- `audio.ts`: opt-in procedural cues.
- `CascadeVaultWorkspace.tsx`: accessible paid-spin/cascade/feature state machine and presentation.
- `cascade-vault.css`: scoped responsive board/feature presentation.
- `cascade-vault.meta.ts`: catalog metadata.
- `PRD.md`, `TRACKER.md`, `todo.md`: game-local living governance.

No gameplay engine or presentation is shared with the other slot titles.

## Interaction and visual design

Visual direction: contemporary vault/energy chamber rather than casino cabinet. Use dark mineral/metal surfaces, luminous but restrained symbol frames, strong grid readability, a visible cascade multiplier, and a progress-oriented Vault Run panel. Avoid Royal Fortune's traditional luxury-casino styling and Lucky Seven's mechanical framing.

Primary hierarchy:
1. bankroll and base wager,
2. 6×5 symbol board,
3. current cascade result and multiplier,
4. Vault Run status/meter when active,
5. wager controls and large **Spin** action,
6. rules/paytable/preferences.

The board never becomes a drag target. All play is button-driven. Once a paid spin begins, the engine resolves the complete logical result; animation merely presents the already-determined sequence. Users cannot interrupt a spin to change its payout path.

## Accessibility and responsive contract

- Native buttons for all actions; important targets at least 48×48 CSS px.
- Board symbols expose concise accessible names and coordinates only when needed; decorative repetitions remain hidden to avoid flooding assistive output.
- A polite live region announces aggregate cascade results—e.g. cascade number, payout, multiplier, remaining free spins—rather than every symbol movement.
- Visual removal/fall/refill is never the sole explanation of a win; textual result summaries identify winning symbols and award.
- Rules/paytable/feature explanation available before first spin.
- Visible `:focus-visible` treatment.
- No required drag, hover, color-only state, animation, or audio.
- At 320 CSS px, the board remains fully within the viewport width without page-level horizontal overflow. Cells may scale with CSS grid/minmax/clamp while maintaining legible symbol labels and distinct boundaries.
- At 200% text, controls/status reflow outside the board rather than overlaying cells.
- No sticky action surface may cover board/status content.
- On landscape/desktop, status and feature panel may sit beside the board; narrow layouts stack them in normal flow.
- `prefers-reduced-motion: reduce` replaces falling/traveling symbols, multiplier zooms, and meter sweeps with immediate board replacement or short opacity changes while preserving the sequence and final state.
- Safe-area padding is honored.

## Sound and motion

Audio is opt-in and user-gesture initialized. Procedural cues may cover spin start, cascade resolve, multiplier increase, Scatter/feature trigger, Vault meter upgrade, and feature completion. No background music or continuous attention loop is required.

Normal mode may animate simultaneous winning-symbol fade, downward gravity, refill entry, finite multiplier emphasis, and short feature transitions. The engine exposes an ordered event sequence to presentation so animation cannot alter scoring. Reduced motion renders the same event sequence with minimal/no spatial movement.

## Error and edge handling

- Insufficient bankroll: Spin disabled with explanation.
- Random-source failure before spin resolution: no wager deduction; durable state unchanged.
- Engine corruption guard reached: abort unresolved spin, restore pre-spin bankroll checkpoint, record/display a nonblocking technical error in development/test contexts, and never fabricate a payout.
- Persistence failure: preserve settled local/in-memory state and surface nonblocking status.
- Audio unavailable: silent continuation.
- Repeated input during active resolution: ignored by phase guard.
- Malformed saves: sanitize to defaults without inventing wins or feature state.
- Multiple simultaneous ways wins are evaluated from one immutable board snapshot before removal.
- Wild-only and ambiguous substitution outcomes resolve to the highest valid configured award under deterministic precedence rules.
- Free-spin cap prevents unbounded feature extension.

## Quality gates

Unit tests must cover ways counting, consecutive-reel qualification, Wild substitution, simultaneous multi-symbol wins, immutable-board evaluation, removal set correctness, gravity, refill, cascade termination, multiplier progression/caps/reset, Scatter triggers/retriggers, Vault meter upgrades, free-spin cap, bankroll accounting, deterministic random-source injection, storage decoding, and checkpoint semantics.

Simulation tests must verify weighted source tables, deterministic reproducibility, no adaptive state inputs, expected feature-frequency bounds, and Monte Carlo RTP confidence bounds from a fixed large sample size documented in the tracker.

Browser tests must cover catalog routing, first paid spin, multi-cascade rendering, aggregate result announcements, wager changes, Vault Run entry/progression/exit, reload from a settled feature checkpoint, restore credits, keyboard/touch use, 320px layout, 200% text, reduced motion, audio opt-in, and horizontal-overflow absence.

Production completion requires the same complete repository validation/deployment chain used by Royal Palace Blackjack and the other two slot titles.

## Research basis

Although Cascade Vault is free-play software, its design adopts conservative principles from current authoritative gambling-technology guidance: rules and likelihood information should be understandable before play, random outcomes should be demonstrably random/non-adaptive, and product mechanics should not push loss chasing, stake escalation, or continued play. Accessibility follows WCAG 2.2 resize/reflow/target principles and honors `prefers-reduced-motion`.
