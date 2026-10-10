# Royal Fortune Slots tracker

**Last synchronized:** 2026-10-10  
**Spec:** `docs/specs/2026-10-10-royal-fortune-slots-design.md`

## Capability status

| Capability | Status | Verification |
| --- | --- | --- |
| Explicit five-reel strips and 20 fixed paylines | verified | Exact strip/payline engine and focused tests passed on revision `e89b9c64eada44a4a5953c17072d57b7d940b4d2` in run `38090041520`. |
| Wild/Scatter/free-spin payout engine | verified | Deterministic engine, trigger/retrigger and multiplier tests passed in run `38090041520`. |
| Durable local save/checkpoint contract | verified | Schema-v1 settlement tests, shared account/persistence emulator suite, feature reload checkpoint and restore-credit browser gates passed in run `38090041520`. |
| Responsive accessible machine UI | verified | Dedicated Royal Fortune Chromium flow passed RNG-failure safety, keyboard activation, 48px primary target, 320px layout, 200% text, reduced effects, opt-in audio, reload and restore checks in run `38090041520`. |
| Probability/RTP audit | verified | Exact source-derived base and feature recurrence tests passed in run `38090041520`; configured theoretical return is 99.4307658688%. |
| Authenticated account-bound durable save | blocked externally | Shared account-save implementation and emulator checks are green; real configured-project Firebase services remain blocked solely by repository TASK-003. |
| Production build and GitHub Pages deployment | verified | Both production builds, Pages artifact upload and Pages deployment succeeded for revision `e89b9c64eada44a4a5953c17072d57b7d940b4d2` in run `38090041520`. |

## Current handoff

**Implementation state:** verified — 2026-10-10 Royal Fortune Slots game-local production scope complete.  
**Last verified revision:** `e89b9c64eada44a4a5953c17072d57b7d940b4d2` / GitHub Actions run `38090041520`.  
**Open game-local work:** none.  
**External blockers:** TASK-003 blocks live configured-project Firebase account verification only; it is not game-local work and does not affect guest gameplay or the verified emulator-backed account-save contract.  
**Next action:** reopen this game only for a new feature, material rule/UI/persistence change, probability rebalance, or regression.

## Verified source boundary

- `reels.ts`: five explicit 32-stop strips, 20 fixed paylines, unbiased browser cryptographic random integer adapter and deterministic injected test seam.
- `paytable.ts`: supported wagers, normal-symbol units, Scatter awards and free-spin constants.
- `engine.ts`: pure line/Wild/Scatter evaluation plus free-spin multiplier/retrigger state transitions.
- `audit.ts`: exact weighted-symbol base return, exact paying-spin/Scatter probabilities and full free-feature expected-value recurrence.
- `storage.ts` / `persistence.ts`: schema-v1 durable state and atomic settled-spin checkpoints; no in-flight reel state.
- `RoyalFortuneSlotsWorkspace.tsx` / `royal-fortune-slots.css`: player-paced machine presentation, transparent paid-spin net wording, RNG-failure safety, responsive/reduced-motion behavior and accessible result/rules surfaces.
- `audio.ts`: optional procedural cues initialized only after enabled user interaction.
- Focused engine/persistence/probability unit suites and `tests/browser/royal-fortune-slots.mjs` are part of the repository validation chain.

## Probability evidence

All five reels contain exactly 32 stops and exactly one Scatter stop each. At the 5-credit normalization wager, the verified source-derived configuration is:

- normal-payline return: `0.8503680229187012` (85.0368022919%),
- Scatter-credit return: `0.0083121657371521` (0.8312165737%),
- paid-spin return before free-spin feature value: `0.8586801886558533` (85.8680188656%),
- any-paying-result probability: `0.4348173141479492` (43.4817314148%),
- feature-entry / free-spin retrigger probability: `0.007124483585357666` (0.7124483585%),
- expected free spins awarded directly by a base spin: `0.05848288536071777`,
- expected feature payout starting with 8 spins: `91.04201497132425` credits at a 5-credit feature wager,
- expected feature payout starting with 12 spins: `170.11451641181813` credits,
- expected feature payout starting with 20 spins: `344.06694598262914` credits,
- free-feature return contribution: `0.13562747003238904` (13.5627470032%),
- configured total theoretical return: `0.9943076586882423` (99.4307658688%).

The normal/Scatter base values derive from exact symbol and visible-stop distributions. The paying-spin probability exhausts all 32³ first-three-reel stop combinations and exact tail Scatter counts. The free-feature value uses those exact event probabilities in the documented finite multiplier-state recurrence, with a closed-form ×5 retrigger queue expectation. `tests/unit/royal-fortune-slots-audit.test.ts` binds the figures to source constants and passed in run `38090041520`.

## Verification evidence

Exact revision `e89b9c64eada44a4a5953c17072d57b7d940b4d2` passed GitHub Actions run `38090041520`. The build job passed frozen install, exact dependency checks, current dependency checks, design lint, TypeScript, game/document governance, all unit tests including the complete Royal Fortune probability recurrence, Firestore rules, the shared account/persistence browser suite, catalog/design regressions, the expanded Royal Fortune deterministic browser suite, both production builds and Pages artifact upload. The deploy job then passed `actions/configure-pages` and `actions/deploy-pages`.

The dedicated Royal Fortune browser suite explicitly passed: RNG-source failure without bankroll deduction, deterministic Scatter feature entry, settled free-spin checkpoint reload, player-paced feature progression, depleted-bankroll restore retaining statistics, 320px no-horizontal-overflow, 200% text reflow, >=48px primary Spin target, reduced-effects behavior and sound opt-in/no-autoplay.

## Continuity note

TASK-003 remains a separate shared platform blocker. Do not reinterpret the game-local verified state as proof that real Firebase Authentication/Firestore have been provisioned. Any future game source/test/index change must reopen and synchronize this tracker and the authoritative spec under repository governance.