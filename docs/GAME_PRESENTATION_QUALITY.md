# Game presentation quality standard

**Last synchronized:** 2026-10-23  
**Scope:** every game in `docs/GAME_INDEX.md`  
**Execution:** one game at a time; no parallel game-presentation implementation

## Required outcome

Every game must receive an explicit presentation-quality audit covering animation, interaction feedback, micro-interactions, effects/VFX, state transitions, reward/hazard feedback, responsive behavior and reduced-motion equivalents. Missing or materially weak presentation behavior is implementation work, not an optional polish note. A game cannot claim the presentation portion of its completion contract solely because controls function or because `prefers-reduced-motion` exists.

The audit is evidence-driven. Source inspection identifies gaps; rendered browser behavior and tests verify the implemented result. Human visual/comprehension review remains a separate gate when the game contract requires it.

## Audit surface

For each game, inspect and record all applicable items below.

- Primary gameplay actions: press/selection feedback, action start, progress, settlement and readiness for the next action.
- Game-state transitions: turn/round/spin/placement/deal start, intermediate steps, completion, win/loss/push/error/recovery and progression transitions.
- Micro-interactions: hover where hover exists, active/pressed feedback, focus-visible behavior, selected state, disabled/busy state, disclosure/dialog transitions and meaningful control-state changes.
- Effects/VFX: outcome emphasis, hazards, rewards, merges/cascades, upgrades, streaks/features, milestone significance and other game-specific consequences. Effects must encode game meaning rather than generic decoration.
- Sequencing: where comprehension benefits from a sequence, motion must make causality readable instead of snapping from start to final state. Player input must not be locked longer than the feedback requires.
- Motion quality: finite, purposeful, brief and interruptible. Avoid perpetual ambient movement, `transition: all`, layout-thrashing motion and repeated decorative animation that does not explain a state change. Prefer `transform`/`opacity` when they satisfy the effect.
- State integrity: durable gameplay, payout, persistence and readiness must never depend on `animationend` or another cosmetic callback completing. Disabling CSS animation must not duplicate, omit or strand a gameplay result.
- Reduced motion: `prefers-reduced-motion: reduce` and any game-local reduced-effects setting must preserve equivalent state/consequence clarity while suppressing nonessential travel, scale, shake, sweep or similar motion.
- Accessibility/input: no essential information is motion-only, color-only or audio-only; keyboard/touch/pointer activation remains equivalent; visible focus and minimum target requirements remain intact.
- Responsive rendering: presentation changes must not introduce horizontal overflow, obscured controls, clipped effects or interaction loss at the game’s required viewport/zoom matrix, including 320 CSS px and 200% text where the repository contract requires them.
- Performance: no unbounded timers/listeners, uncontrolled per-frame React state, avoidable layout reads in render or effect systems that grow without cleanup.

## Required evidence

When an audit opens for a game, its authoritative spec, `TRACKER.md`, `PRD.md` and `todo.md` must be synchronized before or with the first implementation/test change under repository governance.

A presentation audit is not closed until its applicable evidence includes:

1. A documented inventory of the game’s meaningful interactions and presentation states.
2. At least one rendered normal-motion assertion for each newly added significant motion/effect family.
3. Reduced-motion evidence for every added nonessential motion family.
4. A regression proving gameplay settlement/readiness remains correct when animation is suppressed whenever cosmetic lifecycle could otherwise affect state.
5. Existing engine/persistence tests remain green; presentation changes may not alter game mathematics or durable schema unless separately specified.
6. Responsive/browser evidence for the affected screen, including the repository-required narrow/zoom checks.
7. No infinite or unrelated ambient animation unless the authoritative game spec explicitly requires it and accessibility behavior is documented.
8. Human screenshot/visual critique when required by that game’s completion contract; if unavailable, record it as awaiting human testing rather than verified.
9. Exact validation evidence recorded in the spec/tracker before the game returns to `verified` after a presentation change.

## Documentation behavior

- Use existing feature IDs when the presentation requirement is already part of a feature. Add a stable new ID only when the requirement is independently implementable and not already represented.
- Every opened audit/fix updates the corresponding PRD feature state, todo acceptance items, tracker capability/evidence and authoritative spec in the same development cycle.
- A verified game with no presentation defect may remain verified only after the audit records why its existing normal-motion, reduced-motion, interaction and rendered evidence satisfy this standard.
- A verified game with a concrete presentation gap reopens to `implementing` before or with the first implementation change and remains open until fresh evidence closes the gap.
- Keep one `Resume here` record in the active game documents and the repository task ledger; do not rely on chat history.

## 2026-10-23 source baseline

This baseline is reconnaissance, not final rendered approval. It determines audit priority and must be replaced by game-local evidence as each audit completes.

| Game | Source baseline | Audit state |
| --- | --- | --- |
| Cloudline Couriers | Finite/skippable route travel, event effects, resource/cargo/upgrade feedback, visible landmark stages and reduced-motion lifecycle tests are implemented; broader campaign art/VFX breadth and human art/motion review remain open. | active game contract remains `implementing`; machine-auditable client-fix tranche released, human/campaign presentation work remains |
| Cascade Vault | `cascade-vault.css` contains no gameplay keyframes/transitions; board/result changes are effectively instantaneous while reduced-motion rules only disable motion that is not present. | implementation audit required; highest confirmed missing-motion priority after Cloudline machine work |
| Mergrove | `mergrove.css` provides one `mg-pop` placement animation and reduced-motion suppression; merge/cascade/resource/reward progression has no comparable authored motion system. | implementation audit required |
| Threefold | `threefold.css` has hover/pressed transforms but no authored keyframes or transition system; current reduced-motion evidence only proves selected-tile transform removal. | implementation audit required |
| Lucky Seven Classic | Authored reel-settle and lever-pull motion plus reduced-effects handling exist; outcome/recovery/reward-significance depth still needs explicit audit. | full audit required; implementation only if gaps are confirmed |
| Royal Fortune Slots | Reel-spin and winning-symbol pop effects plus reduced-effects handling exist; free-feature/reward cadence and broader micro-interaction depth still need explicit audit. | full audit required; implementation only if gaps are confirmed |
| Royal Palace Blackjack | Card entry/reveal, active-hand, wager, result/dialog and control micro-interactions already have purposeful finite motion and reduced-motion rendered evidence. | confirmatory audit required; no change unless a concrete gap is reproduced |

## Serialized audit queue

1. Finish or explicitly human-block the current Cloudline presentation criteria without weakening its expanded PRD.
2. Cascade Vault presentation audit and missing motion/effects implementation.
3. Mergrove presentation audit and merge/cascade/resource/reward feedback implementation as required.
4. Threefold presentation audit and action/result feedback implementation as required.
5. Lucky Seven Classic full outcome/recovery/micro-interaction audit.
6. Royal Fortune Slots full feature/reward/micro-interaction audit.
7. Royal Palace Blackjack confirmatory audit against this standard.

Only one game’s presentation implementation is active at a time. A human-only blocker on one game may be recorded and the machine-auditable queue may proceed, but the blocked criterion remains open in that game’s documents.