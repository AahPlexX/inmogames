# In progress

## Resume here — 2026-10-23

**Current state:** `docs/GAME_PRESENTATION_QUALITY.md` is now the binding all-games animation/interaction/effects audit standard. Cloudline's released client-fix tranche already covers finite/skippable/reduced-motion travel, event feedback, animation-independent settlement and visible landmark stages, while its expanded PRD and human comprehension/art/motion review remain open. Repository source reconnaissance confirms Cascade Vault has no authored gameplay motion, Mergrove has only a placement-pop family, and Threefold has only immediate hover/selection transforms; Lucky Seven Classic and Royal Fortune Slots have partial reel/action motion; Royal Palace Blackjack already has the strongest finite-motion baseline and rendered reduced-motion evidence.
**Next action:** keep presentation implementation serialized. Finish or explicitly human-block the remaining Cloudline presentation criteria, then open Cascade Vault's presentation audit test-first and synchronize its spec/tracker/PRD/todo/index/task state before or with the first game-local test/change. Continue afterward in the queue defined by `docs/GAME_PRESENTATION_QUALITY.md`.
**Blockers:** Cloudline human comprehension/art/motion review and TASK-003 real Firebase verification remain external/manual gates. They do not erase their open criteria and do not prevent the next machine-auditable game from entering the serialized presentation queue once Cloudline's machine work is closed. Preserved Mergrove branch review and Node-only dependency advisories remain separately recorded in `.tasks/BACKLOG.md`.

## QUALITY-002: All-game presentation quality audit
**Priority:** P0 | **Tags:** animation, vfx, effects, interaction, micro-interaction, accessibility, reduced-motion, browser-quality | **Status:** active — serialized audit queue

Authoritative standard: `docs/GAME_PRESENTATION_QUALITY.md`. Repository instruction: `AGENTS.md` → `Game presentation quality`. D-022 continues to require one-game-at-a-time presentation implementation.

Source reconnaissance on 2026-10-23 establishes the starting queue, not final rendered approval:

- **Cloudline Couriers:** current automated presentation tranche is released; expanded campaign VFX/art breadth and human comprehension/art/motion review remain open in its existing implementing contract.
- **Cascade Vault:** confirmed missing gameplay animation/effect sequencing in `cascade-vault.css`; reduced-motion rules currently disable motion that is not otherwise authored. This is the next confirmed implementation audit after Cloudline machine work.
- **Mergrove:** current authored motion is essentially the bounded `mg-pop` placement feedback; merge/cascade/resource/reward transitions require explicit audit and likely implementation.
- **Threefold:** current presentation uses immediate hover/pressed transforms with no authored keyframe/transition sequence; action/result feedback requires explicit audit and likely implementation.
- **Lucky Seven Classic:** reel-settle and lever-pull motion plus reduced-effects handling exist; outcome/recovery/reward-significance and micro-interaction depth require audit before deciding on implementation.
- **Royal Fortune Slots:** reel-spin and winning-symbol pop plus reduced-effects handling exist; free-feature/reward cadence and broader micro-interactions require audit before deciding on implementation.
- **Royal Palace Blackjack:** finite deal/reveal/hand/result/dialog/control motion and reduced-motion rendered evidence already exist; perform a confirmatory audit and change only reproduced gaps.

**Current state:** the repository-wide requirement and source baseline are durable. No verified game has been silently reclassified solely from reconnaissance; each verified game must reopen when its audit becomes active or a concrete presentation defect is implemented, in accordance with governance.
**Next action:** use Cloudline's canonical todo/tracker to close or human-block its remaining presentation criteria, then begin Cascade Vault with a rendered RED that proves the missing normal-motion feedback without changing game mathematics or persistence.
**Blockers:** human-only review remains human-only; source reconnaissance cannot substitute for browser evidence. No presentation audit may be marked complete from source inspection alone.

## Historical progress — current state is above

## PLATFORM-001: Firebase authentication and account saves
**Priority:** P0 | **Tags:** firebase, auth, firestore, persistence

Shared optional email/password Auth, isolated guest/account repositories, transactional migration, secured/tested rules and durable game checkpoints are repository-verified. Live configured-project completion remains TASK-003. GitHub Pages is canonical; emulator/account-save evidence must not be represented as live-project completion.

Lucky Seven Classic is game-locally verified on exact functional revision `04ae049259232edf9ec5af4aa63d4786d8673ba4` / run `38121766726`; its remaining live-Firebase concern is only this shared external TASK-003 platform blocker.

## Historical item — GAME-CLOUDLINE-COURIERS-001: automated client-fix tranche closed locally
**Priority:** P1 | **Tags:** cloudline-couriers, animation, vfx, interaction, onboarding, accessibility | **Status:** client-fix tranche closed on `1d0c269`; broader game implementation remains open

Authoritative design: `docs/specs/2026-10-06-cloudline-couriers-design.md`. Product requirements: `src/games/cloudline-couriers/PRD.md`. Execution/resume state: `src/games/cloudline-couriers/todo.md` and `TRACKER.md`.

### Local client-triage closeout — 2026-10-23

**Current state:** the automated client-fix acceptance is GREEN on local functional revision `1d0c269`; full exact-revision validation and deployment remain pending. Cloudline is not game-complete.
**Next action:** resume Cloudline only for a new reproduced defect or remaining broader PRD/human-comprehension work after the current Cascade release gate.
**Remaining scope:** complete-game PRD, human comprehension and deployed sign-off remain open. D-026 closes only the automated client-fix tranche. Live Firebase remains TASK-003.

### Historical evidence

Owner playtesting on 2026-10-22 identified unclear purpose/controls, generic landing copy and low-quality/perpetual motion. The first clarity/turn-interaction RED was isolated in `39822058558`; implementation revision `d7995308` passed its first Cloudline browser contract in `39862639992`. A follow-up reduced-motion stale-animation-state RED was isolated in `39863334636`; fix revision `a26c22f7c1a9b889f40f1779355f5aea87adb7f4` passed in `39863962054`.

The next CLC-011/CLC-015 RED was isolated in `39959280821`: non-delivery, first-delivery and first-upgrade states all collapsed to generic upgrade guidance because starting credits already permitted upgrades. Production revision `8e74431747cff945021b0c42689b64dbc086d99e`, validated from main head `397fc2d33b33e12cb61a7070b0752228ab328fd8` in run `39960131577`, passed dependency-current/design/type/document gates, all 151 unit tests, Firestore rules, account-browser checks, and the expanded Cloudline browser contract: first-screen purpose/help, contextual delivery → upgrade → starter-contract guidance, stepwise bounded flight, event/upgrade feedback, 390/1024/1440 reflow, reduced motion without stale animation-only state, and guest reload persistence. The guidance derives from existing run state and adds no save-schema field.

Cloudline remains implementing overall. CLC-007 still needs broader campaign-quality VFX/art state breadth and independent human rendered critique; CLC-011 still needs comprehension evidence; generalized CLC-015 contract generation/variety/persistence remains open. D-026 closes the automated client-fix tranche so the previously specified Cascade release gate can resume.

The prior dependency-corroboration blocker is resolved by D-025. Package/lock refresh and full validation remain pending on the current candidate; the resumed Cascade CV-004/CV-005 release gate is active. TASK-003 remains the external live-Firebase blocker.

**Historical resume note:** earlier triage blockers and next steps above are superseded by the authoritative Current resume at the top of this file. Preserve their run evidence as historical; do not treat them as the active workstream.

## GAME-CASCADE-VAULT-001: Cascade Vault production implementation
**Priority:** P1 | **Tags:** arcade, ways, cascades, probability, accessibility, persistence | **Status:** active — D-026 resumes CV-004 presentation and CV-005 release integration

Authoritative design: `docs/specs/2026-10-10-cascade-vault-design.md`. Plan: `docs/plans/2026-10-10-cascade-vault.md`.

CV-001 is verified on exact refreshed revision `08c3506773d17eee3fed7554f211531141856386` / run `39296638285`: dependency freshness, design lint, TypeScript, history-aware governance, the full unit/rules/browser chain, both builds, Pages artifact upload and deployment all passed. The earlier RED/fixture/terminal-feature evidence remains preserved in the game spec/tracker.

CV-002 and CV-003 are complete and their historical evidence is retained below. The active work is CV-004 presentation/browser acceptance followed by CV-005 release integration; preserve the audited D6 economy and schema-v1 save contract.

The playable workspace/route candidate is now present; CV-004 browser acceptance and CV-005 exact-revision release verification remain open. TASK-003 remains the external real-Firebase blocker only.

### Historical CV-002 test-first and balance evidence

CV-002 RED is exact revision `82b7bb2fa9d2e5aafa2cd7d2b080052127240c5e` / run `39297705487`. Simulator implementation `cf8f6e3723f483bc126b0f50b0f42161c14dff56` then passed the full repository validation and Pages deployment chain in run `39298014858`. Independent simulation review identified three test-evidence gaps. Run `39299103907` then showed the nonzero feature fixture itself had an accidental second Sapphire cascade and exhausted its queue; production simulation code was unaffected. The refill triplet is corrected to `vault_crown/copper/copper` and independently checked to produce exactly one 200-unit quartz cascade. The fixture correction is GREEN on `fac39b0744d2872ec05cab7b9e8f7c7aadb26cc6` / run `39299407841`. Later CV-002 verification and the current CV-004/CV-005 action are recorded separately; this historical next-step sequence is superseded.

## GAME-MERGROVE-002: Progression expansion planning
**Priority:** P1 | **Tags:** mergrove, campaign, levels, power-ups, progression, achievements | **Status:** design approved; implementation separately gated

The approved v2 Mergrove scope remains documented and outside the active Cascade Vault release workstream.

## QUALITY-001: Device- and viewport-agnostic game UX contract
**Priority:** P0 | **Tags:** responsive, device-agnostic, viewport, accessibility, design-browser, quality | **Status:** design approved; separately gated

Repository-wide quality direction remains governed by its own specification. Cloudline's local interaction tranche has browser evidence at 390/1024/1440 plus reduced motion, while complete-game 320px/200%-text/input evidence remains open. Active Cascade CV-004/CV-005 work must meet the same quality bar before release.

### Historical Cascade Vault audit harness discovery repair
Run `39300303052` passed dependency/type/focused engine+simulation checks, then failed because the repo Vitest include excluded `tests/audit/**`. Conditional discovery under `CASCADE_VAULT_AUDIT=1` was later integrated and passed in run `39457748530`; routine unit discovery remains unchanged. D6 balance acceptance is complete.

### Historical CV-003 RED contract (later verified)

The CV-003 RED contract required exact centi-credit accounting, validated post-spin Vault checkpoints, compact settled summaries, restore guards, and no partial cascade/animation persistence. The RED revision intentionally lacked production `storage.ts` / `persistence.ts`; the settled implementation was later verified as recorded below.

### Historical CV-003 RED and GREEN
RED `40442255…` / run `39458077585` isolated the missing persistence/storage modules. CV-003 was later verified on `343ca3fc…` / full validation and Pages run `39459146356`; the candidate-era pending wording is superseded. Audit discovery fix `4808b129…` / run `39457748530` is fully green/deployed; D6 balance acceptance later completed.

### Historical CV-002 distribution candidate D1
25k audit `39459206136` aborted on one corruption-guard hit, so provisional weights are rejected. D1 flattens common paying-symbol concentration/Wild frequency before the next screen.

### Historical CV-002 structural candidate D2
D1 25k audit `39459715477` still hit the 50-cascade guard. D2 adds inert nonpaying `blank` weight 24 to initial/refill tables, with focused tests; paytable remains unchanged. Next gate: full validation + same-seed 25k audit.

### Historical CV-002 calibrated candidate D3
D2 is chain-safe (25k run `39460203286`, zero guard hits) but RTP=13.214587. D3 sets blank=30 and a positive integer-centi paytable near 8.5% of D2, targeting ~0.955 by screening estimate. Full validation + same-seed 25k measurement are next; no acceptance claim yet.

### Historical D3 test synchronization
Audit `39461070614` reached focused tests and failed only because the historical one-cascade feature fixture still expected 200 units; D3 correctly produces 20. Test-only expectation synchronized; production unchanged. Rerun full + 25k audit next.

### Historical CV-002 paytable candidate D4
D3 audit `39461462180`: zero guard hits, RTP 0.6285558, SE .04704613, CI .536345-.720766. Distribution is frozen; D4 modifies only positive integer-centi paytable values, retaining minimum common 3-reel awards. Next: full validation + same-seed 25k screen.

### Historical CV-002 paytable candidate D5
D4 `84a18f92…` passed full validation/Pages (`39461928870`) and same-seed 25k audit `39461954213` with zero guard hits but RTP `1.1440064`. Distribution remains frozen at blank 30. D5 is paytable-only using midpoint scale `0.8347855`; next gate is full validation + same-seed 25k, then >=10M acceptance only if calibration is plausible.

### Historical CV-002 paytable candidate D6
D5 full validation/Pages is green (`2ef4203a…`, run `39490450975`), but 10M acceptance `39490755045` rejected RTP `0.87157806` (95% CI `0.865325..0.877831`) with zero guard hits. D6 changes paytable only by midpoint scale ~1.0957; next gate is full validation then >=10M acceptance.

### Historical CV-002 verified acceptance
D6 `f9893506…` passed Pages `39491636082` and 10M acceptance `39491663232` at RTP `0.950268466` with zero guard hits. CV-002 is complete; see the current CV-004/CV-005 resume above.

### Historical CV-004 browser RED
The preserved direct-route RED identified the missing `.cv` workspace. The current CV-004 candidate and browser contract are being completed under D-026; the active release state is recorded at the top of this file and in the Cascade Vault tracker.

## RELEASE-001: Prototype icon release gate

**Status:** local verification passed; exact committed CI/Pages pending. Full validation reached the Hollowshift prototype after all production-game browser checks passed, then reproduced `/favicon.ico` HTTP 404. The prototype now reuses `public/icon.svg`; the browser console gate is unchanged.
**Resume here:** current state: focused and full local browser checks passed; next action: verify exact committed CI/Pages; blockers: no additional service blocker.
