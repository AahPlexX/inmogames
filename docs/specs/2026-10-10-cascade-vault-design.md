# Cascade Vault design

**Status:** Approved design — implementation pending  
**Last synchronized:** 2026-10-10  
**Proposed route:** `#/games/cascade-vault`

## Product intent

Cascade Vault is the modern high-feature member of the three-game slot family. It is mechanically and visually independent from Royal Fortune Slots and Lucky Seven Classic. It uses virtual credits only: no purchases, deposits, cash-out, ads, telemetry, or real-money value.

The game is a six-reel cascading-symbol game built around ways wins, symbol removal/refill, escalating cascade multipliers, a bounded bonus meter, and a feature round that changes the board rules without autoplay or adaptive outcomes.

The game should feel energetic and contemporary, but clarity wins over spectacle. Outcome logic remains inspectable and deterministic once the spin random source is created, and all significant state changes have textual equivalents.

## Core rules

- 6 reels × 5 rows.
- Symbols are drawn from source-controlled weighted distributions.
- Wins use an adjacent-reel **ways** model: a paying symbol must appear on at least three consecutive reels starting from reel 1, with one or more occurrences on each participating reel.
- For one qualifying symbol, `ways = count(reel1) × count(reel2) × ... × count(last qualifying reel)`. Award = `baseWager × paytableMultiplier[symbol][reelCount] × ways`.
- Wild substitutes for normal paying symbols but never for Scatter.
- For an ambiguous Wild assignment, each symbol is evaluated independently from the immutable board and the engine chooses the highest valid award for that Wild-containing way; the same concrete symbol position cannot be paid twice for two interpretations of one way.
- Winning normal symbols are removed simultaneously after all wins on the immutable board are evaluated; remaining symbols fall downward; new symbols refill from the top.
- The cascade repeats while at least one paying result remains.
- Base-spin cascade multiplier starts at ×1. After each winning cascade, the multiplier used by the next cascade increases by +1, capped at ×10. It resets at the start of every paid spin.
- Scatters are generated only on the initial board of each paid/free spin, never in cascade refills. This keeps feature triggering auditable and prevents one unresolved board from accumulating persistent Scatters.
- Four or more Scatters anywhere on that initial board trigger **Vault Run**: 8 free spins for 4 Scatters, 10 for 5, and 12 for 6 or more.
- Vault Run begins at a persistent feature multiplier of ×2. Each winning cascade increases it by +1 up to ×20, and the highest reached value carries into the next free spin rather than resetting.
- A visible three-step vault meter advances by one step when a free spin resolves at least 3 winning cascades. It can advance at most once per free spin.
- Meter step 1: every cascade refill during remaining free spins receives exactly one additional Wild, replacing one randomly selected non-Scatter refill symbol through the same spin random source.
- Meter step 2: all normal-symbol ways awards during remaining free spins receive an additional ×1.5 feature modifier after the persistent feature multiplier.
- Meter step 3: award exactly 3 additional free spins once; the meter then remains full and cannot award them again.
- Four or more Scatters on the initial board of a Vault Run free spin add 4 free spins. Remaining free spins are capped at 20 after any award, preventing unbounded feature extension.
- No autoplay, turbo autoplay, infinite cascading loop, loss-chasing prompt, adaptive probability, or stake-escalation prompt.

### Base paytable multipliers

Multipliers are applied per way before the cascade/feature multiplier:

| Symbol | 3 reels | 4 reels | 5 reels | 6 reels |
| --- | ---: | ---: | ---: | ---: |
| Quartz | 0.10× | 0.20× | 0.50× | 1.00× |
| Copper | 0.15× | 0.30× | 0.75× | 1.50× |
| Silver | 0.20× | 0.50× | 1.00× | 2.50× |
| Gold | 0.30× | 0.75× | 1.50× | 4.00× |
| Sapphire | 0.50× | 1.25× | 3.00× | 8.00× |
| Emerald | 0.75× | 2.00× | 5.00× | 12.00× |
| Ruby | 1.00× | 3.00× | 8.00× | 20.00× |
| Vault Crown | 1.50× | 5.00× | 15.00× | 40.00× |

The Wild has no standalone paytable entry. Scatter feature awards do not pay a separate credit prize in v1.

## Outcome and randomness model

A paid spin obtains a production random source from browser cryptographic randomness. Initial-board generation and every refill draw for that spin consume that source through a pure engine adapter. Tests inject deterministic seeded sources.

Weighted symbol tables, feature thresholds, multiplier caps, and paytable values are source-controlled constants. Outcomes never adapt to bankroll, recent results, session length, or user behavior.

The engine enforces a hard maximum of 50 cascades per spin as a corruption guard. Reaching it is an engine error rather than a silently accepted result. The configured distributions must make that guard unreachable in ordinary play except through injected test states or corrupted logic.

The implementation targets a long-run simulated RTP between 94% and 97% for the final source-controlled distribution. Exact validation covers primitive symbol weights and payout functions; deterministic exhaustive tests cover bounded state spaces; and a reproducible Monte Carlo audit of at least 10,000,000 paid spins reports observed RTP, standard error, 95% confidence interval, feature-entry frequency and average cascade depth in the tracker. If the interval does not intersect the target range, implementation remains incomplete and the distributions/paytable must be rebalanced before verification.

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

The board is never a drag target. All play is button-driven. Once a paid spin begins, the engine resolves the complete logical result; animation presents the ordered event sequence and cannot alter scoring. Users cannot interrupt a spin to change its payout path.

## Accessibility and responsive contract

- Native buttons for all actions; important targets at least 48×48 CSS px.
- Board symbols expose concise accessible names and coordinates only when needed; decorative repetitions remain hidden to avoid flooding assistive output.
- A polite live region announces aggregate cascade results—cascade number, payout, multiplier, remaining free spins—rather than every symbol movement.
- Visual removal/fall/refill is never the sole explanation of a win; textual result summaries identify winning symbols and award.
- Rules/paytable/feature explanation is available before first spin.
- Visible `:focus-visible` treatment.
- No required drag, hover, color-only state, animation, or audio.
- At 320 CSS px, the board remains fully within viewport width without page-level horizontal overflow. Cells may scale with CSS Grid/minmax/clamp while maintaining legible symbol labels and distinct boundaries.
- At 200% text, controls/status reflow outside the board rather than overlaying cells.
- No sticky action surface may cover board/status content.
- On landscape/desktop, status and feature panel may sit beside the board; narrow layouts stack them in normal flow.
- `prefers-reduced-motion: reduce` replaces falling/traveling symbols, multiplier zooms, and meter sweeps with immediate board replacement or short opacity changes while preserving sequence and final state.
- Safe-area padding is honored.

## Sound and motion

Audio is opt-in and user-gesture initialized. Procedural cues may cover spin start, cascade resolve, multiplier increase, Scatter/feature trigger, Vault meter upgrade, and feature completion. No background music or continuous attention loop is required.

Normal mode may animate simultaneous winning-symbol fade, downward gravity, refill entry, finite multiplier emphasis, and short feature transitions. The engine exposes an ordered event sequence to presentation so animation cannot alter scoring. Reduced motion renders the same event sequence with minimal/no spatial movement.

## Error and edge handling

- Insufficient bankroll: Spin disabled with explanation.
- Random-source failure before spin resolution: no wager deduction; durable state unchanged.
- Engine corruption guard reached: abort unresolved spin, restore the pre-spin bankroll checkpoint, expose a technical failure status, and never fabricate a payout.
- Persistence failure: preserve settled local/in-memory state and surface nonblocking status.
- Audio unavailable: silent continuation.
- Repeated input during active resolution: ignored by phase guard.
- Malformed saves: sanitize to defaults without inventing wins or feature state.
- Multiple simultaneous ways wins are evaluated from one immutable board snapshot before removal.
- Free-spin cap prevents unbounded feature extension.

## Quality gates

Unit tests must cover ways counting, consecutive-reel qualification, Wild substitution, simultaneous multi-symbol wins, immutable-board evaluation, removal-set correctness, gravity, refill, cascade termination, 50-cascade guard, multiplier progression/caps/reset, Scatter triggers/retriggers, all three Vault meter upgrades, free-spin cap, bankroll accounting, deterministic random-source injection, storage decoding, and checkpoint semantics.

Simulation tests must verify weighted source tables, deterministic reproducibility, absence of adaptive state inputs, feature-frequency reporting, and the 10,000,000-spin RTP confidence audit.

Browser tests must cover catalog routing, first paid spin, multi-cascade rendering, aggregate result announcements, wager changes, Vault Run entry/progression/exit, reload from a settled feature checkpoint, restore credits, keyboard/touch use, 320px layout, 200% text, reduced motion, audio opt-in, and horizontal-overflow absence.

Production completion requires the same complete repository validation/deployment chain used by Royal Palace Blackjack and the other two slot titles.

## Research basis

Although Cascade Vault is free-play software, its design adopts conservative principles from current authoritative gambling-technology guidance: rules and likelihood information should be understandable before play, random outcomes should be demonstrably random/non-adaptive, and product mechanics should not push loss chasing, stake escalation, or continued play. Accessibility follows WCAG 2.2 resize/reflow/target principles and honors `prefers-reduced-motion`.
