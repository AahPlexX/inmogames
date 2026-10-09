# Royal Palace Blackjack tracker

**Spec:** `docs/specs/2026-10-03-royal-palace-blackjack-design.md`  
**Last synchronized:** 2026-10-09

| Capability | Status | Verification |
| --- | --- | --- |
| Six-deck shoe and cut-card lifecycle | verified | Shoe unit tests |
| Pure hand scoring and natural-blackjack semantics | verified | Engine unit tests |
| S17 dealer behavior | verified | Engine unit tests |
| Hit / stand / double | verified | Engine legality tests + deterministic Chromium Hit/Stand and Double settlement regressions |
| One split / DAS / split-Ace restrictions | verified | Engine legality + deterministic Chromium non-Ace split/DAS and split-Ace one-card auto-resolution regressions |
| Late surrender after dealer check | verified | Engine legality + deterministic Chromium surrender/half-return regression |
| Insurance at half wager, 2:1 profit | verified | Engine + UI verification |
| 3:2 natural blackjack payout | verified | Engine settlement tests |
| Independent split-hand settlement | verified | Engine settlement tests + deterministic split-hand browser settlement |
| Virtual bankroll and chip betting controls | started | Run `37945661859` again passed visible staged/settled wagers, all betting modifiers, Hit/Stand, Double, split/DAS, split-Ace, surrender and bankroll/W/L/P/session accounting. Final completion still awaits the mobile-layout/build/deploy gates. |
| Practice-credit restore below minimum wager | verified | Pure checkpoint test + 320px browser restore/reload/stat-preservation regression |
| Re-bet / 2× / all-in / undo / clear | verified | Deterministic Chromium betting-control regression; reconfirmed by run `37945661859` |
| W/L/P and session-net statistics | verified | Deterministic Chromium settlement accounting; reconfirmed by run `37945661859` |
| Defensive versioned guest-local persistence | verified | Storage unit tests |
| Authenticated account-bound durable save | blocked externally | Shared repository + browser emulator verified; real Firebase project verification requires TASK-003 |
| Guest-to-account save seeding without cloud overwrite | verified | Atomic migration unit tests + browser emulator |
| Saved-game reset | verified | Scoped guest/account repository tests + browser emulator; defaults prevent guest reseeding |
| Optional exact-table strategy hints | verified | Strategy unit tests |
| Local procedural sound preference | verified | Run `37945661859` freshly passed opt-in, AudioContext resume, no autoplay, persisted preference and procedural cue suppression |
| Responsive casino-table presentation | started | Shared 320px/200% reflow, >=48px chip targets, keyboard/touch/reduced-motion behavior, desktop layout and lone-action row fill are green. Run `37945661859` proved the empty-betting felt repair reduced the initial 320×900 Deal bottom edge from 1030.47px to 941.25px, leaving 41.25px below the viewport. Source repair `c8debf71` now removes only the nonessential route-description paragraph at ≤350px and tightens Royal-only shell/header/save-status spacing while preserving the title, persistence status, table, wager controls, 48px chips and Deal action. Fresh rerun pending. |
| Table rules/help and phase guidance | started | Existing copy/semantics unchanged; secondary native rules disclosure follows primary round actions. Fresh full-chain evidence pending. |
| Keyboard/touch parity and visible focus | started | Shared rendered regression and Royal accessibility are green through run `37945661859`; final exact-revision completion awaits mobile-motion/build/deploy gates. |
| Accessible cards/status/dialogs | verified | Run `37945661859` passed named card/status semantics, insurance focus entry/confinement, Escape close and logical focus restoration |
| Reduced-motion presentation | started | Shared reduced-motion behavior is green; dedicated normal-motion card/mobile assertion remains pending because the 320×900 first-viewport check still failed first in run `37945661859`. |
| Catalog + lazy workspace integration | verified | game-check + both builds baseline; no registry change in this pass |
| No runtime third-party assets | verified | Source/build design retains CSS/system-only presentation |
| Runtime network restricted to shared Firebase account/save traffic | verified | Game workspace has no direct Firebase import; browser emulator traffic confined to shared platform services |
| Documentation/task synchronization | started | Spec/tracker are synchronized atomically through the narrow-route-chrome repair; PRD/todo/index/task return to verified only after fresh exact-revision CI + Pages evidence. |

## Current handoff

**Implementation state:** implementing Royal Palace table-experience polish; game rules/engine/save/audio contracts remain unchanged.  
**Last verified revision:** historical verified baseline is repository revision `9ee0f93d` / run `37256390159`, plus Royal-specific gameplay/audio/mobile runs `37253435033`, `37253740411`, `37255447688`; these runs do not verify the new UI/UX implementation.  
**Dependency baseline before this pass:** workflow `37859097164` passed full validation and bot commit `853c87b0` refreshed exact current stable dependencies (React/DOM 19.3.0, Firebase 13.0.0, Vite 8.3.4, TypeScript 7.0.2, Vitest 5.0.3, Playwright 1.64.0).  
**Current implementation edge:** `5dbe580c` integrated the candidate UI/UX pass. Governance corrections, a 48×48 chip repair and settled-wager regression synchronization progressed the suite until run `37944290232` passed governance, 80 unit tests, Firestore rules, account/persistence browser, catalog/design regression, Royal accessibility, corrected Royal gameplay and Royal audio, then exposed a lone-action row-width defect. `aacd73fd` removed only the betting/settled action-frame inset; synchronized revision `8fa1c2c0` and run `37944928586` proved that repair while again passing every earlier Royal gate. The next dedicated mobile assertion measured the initial Deal bottom at 1030.47px in a 320×900 viewport. Source `93a9d051` compacted only the empty betting felt/card lanes; synchronized revision `f12e3b14` and run `37945661859` then passed every earlier gate again and reduced the Deal bottom edge to 941.25px, proving the direction while leaving 41.25px unresolved. Source `c8debf71` now takes that remaining height only from nonessential Royal route chrome at ≤350px: the descriptive route paragraph is omitted, shell/header spacing is tightened, and save-status spacing is reduced. The game title, save-state feedback, table content, bankroll/wager controls, 48px chips and primary action remain intact. No engine, rules, persistence or audio behavior changed.  
**Open game-local work:** run the full exact-revision Pages chain after this atomic documentation synchronization. Verify first-viewport Deal reachability, staged/post-Deal wager display, authored normal-motion card entry and all remaining Mergrove/Cloudline/browser/build/Pages gates. Repair only evidence-backed failures without weakening viewport, motion, accessibility or wager-clarity requirements. Restore RPB-003/005/006/007 and the completion contract to verified only after all applicable gates are green.  
**External blockers:** TASK-003 only for real Firebase project account/save verification; unrelated to this game-local polish.  
**Next action:** use the Pages workflow triggered by this synchronized narrow-route-chrome repair as the authoritative execution environment and continue from the first remaining failure, if any.

## Experience principles now binding

- The felt/table is the primary tool surface; route chrome and secondary help must not dominate the first viewport.
- Current action context, wager and outcome remain legible without relying on motion, color or audio.
- The committed round wager remains visible while reviewing settlement and clears only when the next betting round begins.
- Lone round actions fill their framed action row; multi-action player controls retain grouped spacing.
- Empty pre-deal card lanes may compact on narrow phones; active hands never inherit that compaction.
- At ≤350px the route title and save-state feedback remain; only the nonessential descriptive route paragraph may be omitted to prioritize the playable table and first primary action.
- Motion communicates deal, reveal, active turn, wager update and round consequence once; no infinite pulse/glow/confetti or autoplay pressure.
- Primary round controls remain in document flow instead of a sticky/fixed layer that could obscure focus at zoom.
- Narrow-phone quality is not a shrunken desktop: controls recompose, wager modifiers stay compact, cards scale, and primary action reachability is tested.
- `prefers-reduced-motion: reduce` retains equivalent state/consequence information with cosmetic motion removed.

## Assets and licences

No third-party visual, audio, font or gameplay assets. Card faces, table treatment, symbols, sounds, copy and the new motion/texture treatments are repository-authored CSS/system capabilities. No runtime dependency was added for this pass.

Persistence schema version 1 and its committed balance/preference boundary remain unchanged. Do not infer completion from chat history: this tracker and the linked authoritative spec are the current resume contract until fresh evidence closes the reopened gates.
