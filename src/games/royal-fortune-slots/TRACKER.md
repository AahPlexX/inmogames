# Royal Fortune Slots tracker

**Last synchronized:** 2026-10-10  
**Spec:** `docs/specs/2026-10-10-royal-fortune-slots-design.md`

## Capability status

| Capability | Status | Verification |
| --- | --- | --- |
| Explicit five-reel strips and 20 fixed paylines | started | Source implemented in `reels.ts`; exact-revision validation pending. |
| Wild/Scatter/free-spin payout engine | started | Pure engine and focused unit coverage added; CI evidence pending. |
| Durable local save/checkpoint contract | started | Schema v1 and settlement helpers added; CI/account-emulator evidence pending. |
| Responsive accessible machine UI | started | Workspace/CSS and dedicated browser regression are implemented; exact-revision browser evidence pending. |
| Probability/RTP audit | started | Exact source-derived base-game audit is implemented: line return 85.0368022919%, Scatter return 0.8312165737%, combined pre-feature base return 85.8680188656%, feature-entry probability 0.7124483585%, expected base free-spins awarded 0.0584828854/spin. Full free-spin feature contribution remains open and no total RTP claim is made yet. |
| Authenticated account-bound durable save | blocked externally | Shared account-save implementation exists, but live configured Firebase services remain blocked by repository TASK-003. |
| Production build and GitHub Pages deployment | started | Exact-revision workflow evidence pending. |

## Current handoff

**Implementation state:** implementing — initial production integration is assembled and under exact-revision validation.  
**Last verified revision:** none — this new game has not yet reached a verified production revision.  
**Open game-local work:** obtain green unit/type/governance/browser/full validation; complete full free-spin feature probability/RTP evidence; synchronize exact revision/run evidence and close remaining checklist gates.  
**External blockers:** TASK-003 blocks live configured-project Firebase account verification only; it does not block guest gameplay or game-local completion.  
**Next action:** inspect the coherent Royal Fortune CI run, repair any concrete failures, then complete the full-feature probability audit before considering verified status.

## Implemented source boundary

- `reels.ts`: five explicit 32-stop strips, 20 paylines, unbiased browser cryptographic random integer adapter, deterministic injected random seam.
- `paytable.ts`: supported wagers, normal-symbol units, Scatter awards and free-spin constants.
- `engine.ts`: line evaluation, Wild substitution, Scatter evaluation, feature transitions and multiplier rules; reusable pure line evaluator for probability analysis.
- `audit.ts`: exact weighted-symbol base-game line return plus exact stop-derived Scatter-window distribution and feature-entry audit.
- `storage.ts` / `persistence.ts`: schema-v1 durable state and atomic settled-spin checkpoints.
- `RoyalFortuneSlotsWorkspace.tsx` / `royal-fortune-slots.css`: machine presentation, controls, rules/paytable, textual outcomes, responsive/reduced-motion behavior.
- `audio.ts`: optional short procedural cues initialized only from user-triggered play/preferences.
- Focused engine, persistence and probability unit suites plus `tests/browser/royal-fortune-slots.mjs` are registered in the repository validation path.

## Probability evidence

All five reels contain exactly 32 stops and exactly one Scatter stop each. The exact source-derived base audit at the 5-credit normalization wager is:

- normal-payline return before free-spin multiplier value: `0.8503680229187012` (85.0368022919%),
- Scatter-credit return: `0.0083121657371521` (0.8312165737%),
- combined paid-spin return before free-spin feature value: `0.8586801886558533` (85.8680188656%),
- probability a base spin enters the free-spin feature: `0.007124483585357666` (0.7124483585%),
- expected free spins awarded directly by a base spin: `0.05848288536071777`.

These values are derived from committed reel frequencies/paytable constants and are asserted by `tests/unit/royal-fortune-slots-audit.test.ts`; the test still requires exact-revision CI execution before it becomes verification evidence. Final verified status additionally requires reproducible full-feature expected-value evidence covering winning-spin multiplier advancement and Scatter retriggers. Until then, no total RTP claim is made.

## Continuity note

Do not mark this game verified by inference from Royal Palace or another title. Verification must name an exact Royal Fortune revision/workflow run that passed the repo-wide gates. TASK-003 must remain separately represented if live Firebase is still unprovisioned.