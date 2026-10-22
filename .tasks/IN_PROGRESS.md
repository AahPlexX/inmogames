# In progress

## PLATFORM-001: Firebase authentication and account saves
**Priority:** P0 | **Tags:** firebase, auth, firestore, persistence

Shared optional email/password Auth, isolated guest/account repositories, transactional migration, secured/tested rules and durable game checkpoints are repository-verified. Live configured-project completion remains TASK-003. GitHub Pages is canonical; emulator/account-save evidence must not be represented as live-project completion.

Lucky Seven Classic is game-locally verified on exact functional revision `04ae049259232edf9ec5af4aa63d4786d8673ba4` / run `38121766726`; its remaining live-Firebase concern is only this shared external TASK-003 platform blocker.

## GAME-CLOUDLINE-COURIERS-001: Cloudline Couriers presentation and first-session quality
**Priority:** P1 | **Tags:** cloudline-couriers, animation, vfx, interaction, onboarding, accessibility | **Status:** implementing — active one-game workstream

Authoritative design: `docs/specs/2026-10-06-cloudline-couriers-design.md`. Product requirements: `src/games/cloudline-couriers/PRD.md`. Execution/resume state: `src/games/cloudline-couriers/todo.md` and `TRACKER.md`.

Owner playtesting on 2026-10-22 identified unclear purpose/controls, generic landing copy and low-quality/perpetual motion. The first clarity/turn-interaction RED was isolated in `39822058558`; implementation revision `d7995308` passed its first Cloudline browser contract in `39862639992`. A follow-up reduced-motion stale-animation-state RED was isolated in `39863334636`. Fix revision `a26c22f7c1a9b889f40f1779355f5aea87adb7f4`, validated from main head `dec94fe5205e0ce65f4c1fa52cc2c35af8b64c08` in run `39863962054`, passed all 151 unit tests and the Cloudline browser contract: purpose/help, stepwise bounded flight, event/upgrade feedback, 390/1024/1440 reflow, reduced motion without stale animation-only state, and guest reload persistence.

Cloudline remains implementing. CLC-007 still needs broader campaign-quality VFX/art state breadth and independent human rendered critique; CLC-011 still needs contextual first-win reward → upgrade → contract guidance and comprehension evidence. Continue Cloudline only until the active quality workstream is explicitly closed; do not start another game's animation/effects/interactions work in parallel.

Repository package/lock dependency refresh remains blocked from committing because the complete maintenance suite reaches and passes Cloudline, then hits the preserved unrelated Cascade Vault CV-004 RED waiting for `.cv`. TASK-003 remains the external live-Firebase blocker only.

## GAME-CASCADE-VAULT-001: Cascade Vault production implementation
**Priority:** P1 | **Tags:** arcade, ways, cascades, probability, accessibility, persistence | **Status:** paused — preserved CV-004 browser RED; Cloudline is the active game workstream

Authoritative design: `docs/specs/2026-10-10-cascade-vault-design.md`. Plan: `docs/plans/2026-10-10-cascade-vault.md`.

CV-001 is verified on exact refreshed revision `08c3506773d17eee3fed7554f211531141856386` / run `39296638285`: dependency freshness, design lint, TypeScript, history-aware governance, the full unit/rules/browser chain, both production builds, Pages artifact upload and deployment all passed. The earlier RED/fixture/terminal-feature evidence remains preserved in the game spec/tracker.

CV-002 opens test-first with a focused simulation contract before `simulation.ts` exists. It must reuse production `createWeightedVaultRandomSource` + `resolveSpin`, treat one paid spin plus its complete attached Vault Run as one RTP observation, stream confidence statistics, report Vault entry/cascade metrics, and reject any corruption-guard hit. Current paytable and weights remain provisional; supporting reconnaissance rules out a weights-only tune, so the spec-authorized paytable + distribution rebalance remains in scope.

The governance-only workspace shell remains non-playable; route registration waits for browser RED. TASK-003 remains the external real-Firebase blocker only.

CV-002 RED is exact revision `82b7bb2fa9d2e5aafa2cd7d2b080052127240c5e` / run `39297705487`. Simulator implementation `cf8f6e3723f483bc126b0f50b0f42161c14dff56` then passed the full repository validation and Pages deployment chain in run `39298014858`. Independent simulation review identified three test-evidence gaps. Run `39299103907` then showed the nonzero feature fixture itself had an accidental second Sapphire cascade and exhausted its queue; production simulation code was unaffected. The refill triplet is corrected to `vault_crown/copper/copper` and independently checked to produce exactly one 200-unit quartz cascade. The fixture correction is GREEN on `fac39b0744d2872ec05cab7b9e8f7c7aadb26cc6` / run `39299407841`. Next when resumed: validate the opt-in audit harness/workflow, run a 25,000-spin production-engine screen of the unchanged configuration, use that evidence to select/tune paytable+weights, and only then run the required >=10M acceptance audit before CV-003 integration claims.

## GAME-MERGROVE-002: Progression expansion planning
**Priority:** P1 | **Tags:** mergrove, campaign, levels, power-ups, progression, achievements | **Status:** design approved; implementation separately gated

The approved v2 Mergrove scope remains documented and outside the active Cloudline Couriers workstream.

## QUALITY-001: Device- and viewport-agnostic game UX contract
**Priority:** P0 | **Tags:** responsive, device-agnostic, viewport, accessibility, design-browser, quality | **Status:** design approved; separately gated

Repository-wide quality direction remains governed by its own specification. Cloudline's current interaction tranche is browser-verified at 390/1024/1440 plus reduced motion, but complete-game 320px/200%-text/input evidence remains open. Cascade Vault must ultimately meet the same quality bar when its paused workstream resumes.

### Cascade Vault audit harness discovery repair
Run `39300303052` passed dependency/type/focused engine+simulation checks, then failed because the repo Vitest include excluded `tests/audit/**`. The fix conditionally adds audit discovery only under `CASCADE_VAULT_AUDIT=1`; routine unit discovery remains unchanged. Validate full repo + 25k audit before balance tuning.

## GAME-CASCADE-VAULT-003: Settled persistence
**Status:** RED contract opened in parallel with CV-002 audit

Schema-v1 tests require exact centi-credit accounting, validated post-spin Vault checkpoints, compact settled summaries, restore guards, and no partial cascade/animation persistence. Production `storage.ts` / `persistence.ts` remain intentionally absent until the missing-module RED is recorded.

### CV-003 GREEN candidate
RED `40442255…` / run `39458077585` isolated only missing persistence/storage modules. Candidate implements the unchanged settled-only contract; verification pending. Audit discovery fix `4808b129…` / run `39457748530` is fully green/deployed; 25k balance screen remains open.

### CV-002 distribution candidate D1
25k audit `39459206136` aborted on one corruption-guard hit, so provisional weights are rejected. D1 flattens common paying weights and reduces Wild to 1 while preserving initial Scatter 4; paytable remains unchanged to isolate board-evolution risk. CV-003 is fully GREEN/deployed on run `39459146356`.

### CV-002 structural candidate D2
D1 25k audit `39459715477` still hit the 50-cascade guard. D2 adds inert nonpaying `blank` weight 24 to initial/refill tables, with focused tests; paytable remains unchanged. Next gate: full validation + same-seed 25k audit.

### CV-002 calibrated candidate D3
D2 is chain-safe (25k run `39460203286`, zero guard hits) but RTP=13.214587. D3 sets blank=30 and a positive integer-centi paytable near 8.5% of D2, targeting ~0.955 by screening estimate. Full validation + same-seed 25k measurement are next; no acceptance claim yet.

### D3 test synchronization
Audit `39461070614` reached focused tests and failed only because the historical one-cascade feature fixture still expected 200 units; D3 correctly produces 20. Test-only expectation synchronized; production unchanged. Rerun full + 25k audit next.

### CV-002 paytable candidate D4
D3 audit `39461462180`: zero guard hits, RTP 0.6285558, SE .04704613, CI .536345-.720766. Distribution is frozen; D4 modifies only positive integer-centi paytable values, retaining minimum common 3-reel awards. Next: full validation + same-seed 25k screen.

### CV-002 paytable candidate D5
D4 `84a18f92…` passed full validation/Pages (`39461928870`) and same-seed 25k audit `39461954213` with zero guard hits but RTP `1.1440064`. Distribution remains frozen at blank 30. D5 is paytable-only using midpoint scale `0.8347855`; next gate is full validation + same-seed 25k, then >=10M acceptance only if calibration is plausible.

### CV-002 paytable candidate D6
D5 full validation/Pages is green (`2ef4203a…`, run `39490450975`), but 10M acceptance `39490755045` rejected RTP `0.87157806` (95% CI `0.865325..0.877831`) with zero guard hits. D6 changes paytable only by midpoint scale ~1.0957; next gate is full validation then >=10M acceptance.

### CV-002 verified acceptance
D6 `f9893506…` passed Pages `39491636082` and 10M acceptance `39491663232` at RTP `0.950268466` with zero guard hits. Resume with CV-004 browser RED.

### CV-004 browser RED candidate
Consolidated `tests/browser/cascade-vault.mjs` is registered before playable workspace routing; expected first failure is missing `.cv`. Its RED remains preserved while Cloudline is the active one-game quality workstream.
