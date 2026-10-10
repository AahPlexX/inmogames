# Royal Fortune Slots tracker

**Last synchronized:** 2026-10-10  
**Spec:** `docs/specs/2026-10-10-royal-fortune-slots-design.md`

## Capability status

| Capability | Status | Verification |
| --- | --- | --- |
| Explicit five-reel strips and 20 fixed paylines | started | Source and focused tests passed on baseline revision `8c3e2fa` / run `38089533535`; current exact-feature audit revision still requires CI. |
| Wild/Scatter/free-spin payout engine | started | Engine tests passed on baseline `8c3e2fa`; current audit/polish integration requires fresh exact-revision evidence. |
| Durable local save/checkpoint contract | started | Schema-v1 settlement tests and account/persistence repository suite passed on baseline run `38089533535`; expanded feature-reload browser gate requires fresh evidence. |
| Responsive accessible machine UI | started | Dedicated Royal Fortune browser suite passed on baseline run `38089533535`; current RNG-failure/restore/LDW polish expands that suite and requires fresh evidence. |
| Probability/RTP audit | started | Exact source-derived base and free-feature recurrence are implemented. Current configured theoretical return is 99.4307658688% including feature value; fresh exact-revision unit evidence is required before this becomes verification evidence. |
| Authenticated account-bound durable save | blocked externally | Shared account-save implementation exists and emulator infrastructure passed the baseline run; live configured Firebase services remain blocked by repository TASK-003. |
| Production build and GitHub Pages deployment | started | Baseline revision `8c3e2fa` built/deployed in run `38089533535`; current source revision requires its own deployment evidence. |

## Current handoff

**Implementation state:** implementing — production integration is green at the prior baseline and the final probability/edge-case evidence pass is being validated.  
**Last verified revision:** none — Royal Fortune has not yet reached its final verified production revision.  
**Open game-local work:** obtain fresh exact-revision CI for the full-feature audit and expanded browser safety/reload/restore gates; then atomically close docs/index/task state if all repository gates remain green.  
**External blockers:** TASK-003 blocks live configured-project Firebase account verification only; it does not block guest gameplay or game-local verification.  
**Next action:** run the current synchronized source/test/docs integration through full CI; repair any concrete regression; if green, close the Royal Fortune game-local checklist with exact revision/run evidence.

## Implemented source boundary

- `reels.ts`: five explicit 32-stop strips, 20 paylines, unbiased browser cryptographic random integer adapter, deterministic injected random seam.
- `paytable.ts`: supported wagers, normal-symbol units, Scatter awards and free-spin constants.
- `engine.ts`: line evaluation, Wild substitution, Scatter evaluation, feature transitions and multiplier rules; reusable pure line evaluator for probability analysis.
- `audit.ts`: exact weighted-symbol base return, exact stop-derived paying-spin/Scatter probabilities, and exact free-spin multiplier/retrigger expected-value recurrence.
- `storage.ts` / `persistence.ts`: schema-v1 durable state and atomic settled-spin checkpoints.
- `RoyalFortuneSlotsWorkspace.tsx` / `royal-fortune-slots.css`: machine presentation, controls, rules/paytable, transparent paid-spin net wording, RNG-failure safety, responsive/reduced-motion behavior.
- `audio.ts`: optional short procedural cues initialized only from user-triggered play/preferences.
- Focused engine, persistence and probability unit suites plus `tests/browser/royal-fortune-slots.mjs` are registered in the repository validation path.

## Probability evidence

All five reels contain exactly 32 stops and exactly one Scatter stop each. At the 5-credit normalization wager, the source-derived values are:

- normal-payline return before free-spin multiplier value: `0.8503680229187012` (85.0368022919%),
- Scatter-credit return: `0.0083121657371521` (0.8312165737%),
- combined paid-spin return before free-spin feature value: `0.8586801886558533` (85.8680188656%),
- probability a paid/free spin has any credit-paying result: `0.4348173141479492` (43.4817314148%),
- base feature-entry / free-spin retrigger probability: `0.007124483585357666` (0.7124483585%),
- expected free spins awarded directly by a base spin: `0.05848288536071777`,
- expected free-feature payout when starting with 8 spins: `91.04201497132425` credits at a 5-credit feature wager,
- expected free-feature payout when starting with 12 spins: `170.11451641181813` credits,
- expected free-feature payout when starting with 20 spins: `344.06694598262914` credits,
- free-feature return contribution per paid wager: `0.13562747003238904` (13.5627470032%),
- configured total theoretical return: `0.9943076586882423` (99.4307658688%).

The base portion is computed from exact symbol/reel-stop distributions. The full feature value uses the exact paying-spin and retrigger probabilities in a finite multiplier-state recurrence; at multiplier ×5, the retrigger queue has closed-form expected value because each free spin adds five queued spins with probability `0.007124483585357666`, safely below the divergence threshold. `tests/unit/royal-fortune-slots-audit.test.ts` binds these values to the committed constants. The current expanded audit still requires its exact-revision CI pass before the capability can move to verified.

## Baseline validation evidence

Revision `8c3e2fa474dab14f10b5853becac9ad17e434df1` passed GitHub Actions run `38089533535`: exact dependency/current checks, design lint, TypeScript, game/document governance, unit tests, Firestore rules, account/persistence browser checks, the complete design-browser chain including Royal Fortune, both production builds, Pages artifact upload and Pages deployment. This is a valid production baseline but predates the final full-feature recurrence and edge-case browser expansion, so it is not used as the final verified revision.

## Continuity note

Do not mark this game verified by inference from Royal Palace or another title. Final verification must name an exact Royal Fortune revision/workflow run containing the full audit and current browser safety gates. TASK-003 must remain separately represented if live Firebase is still unprovisioned.