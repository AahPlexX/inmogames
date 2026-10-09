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
| Virtual bankroll and chip betting controls | started | Staged wager behavior remains green; the polished UI keeps actual hand exposure visible through active play and settlement. Run `37943038650` exposed only stale `Bet 0` gameplay expectations after the shared design/accessibility suites passed; `f78cf425` now expects the correct settled exposure for ordinary, double, split/DAS, split-Ace and surrender paths. Fresh rerun pending. |
| Practice-credit restore below minimum wager | verified | Pure checkpoint test + 320px browser restore/reload/stat-preservation regression |
| Re-bet / 2× / all-in / undo / clear | verified | Deterministic Chromium betting-control regression |
| W/L/P and session-net statistics | verified | Deterministic Chromium loss/win/split/surrender settlement accounting; gameplay assertion values remain unchanged by the presentation-only wager expectation update |
| Defensive versioned guest-local persistence | verified | Storage unit tests |
| Authenticated account-bound durable save | blocked externally | Shared repository + browser emulator verified; real Firebase project verification requires TASK-003 |
| Guest-to-account save seeding without cloud overwrite | verified | Atomic migration unit tests + browser emulator |
| Saved-game reset | verified | Scoped guest/account repository tests + browser emulator; defaults prevent guest reseeding |
| Optional exact-table strategy hints | verified | Strategy unit tests |
| Local procedural sound preference | verified | Unit tests + Chromium WebAudio opt-in/resume/no-autoplay/persistence/cue-suppression regression |
| Responsive casino-table presentation | started | Run `37943038650` proves the 48×48 narrow-chip repair plus shared 320px/200% reflow, Royal keyboard/touch/reduced-motion behavior and desktop layout. Dedicated 320×900 first-viewport Deal reachability still awaits the later Royal mobile-layout suite in a fully advancing run. |
| Table rules/help and phase guidance | started | Existing copy/semantics unchanged; secondary native rules disclosure now follows primary round actions. Fresh full-chain evidence pending. |
| Keyboard/touch parity and visible focus | started | Shared rendered regression and Royal accessibility passed in `37943038650`; final exact-revision completion still awaits gameplay/audio/mobile/build/deploy gates. |
| Accessible cards/status/dialogs | started | Run `37943038650` passed named card/status semantics, insurance focus entry/confinement, Escape close and logical focus restoration. |
| Reduced-motion presentation | started | Shared reduced-motion behavior passed in `37943038650`; one-shot normal-motion card/mobile evidence remains pending in the dedicated Royal mobile-layout suite. |
| Catalog + lazy workspace integration | verified | game-check + both builds baseline; no registry change in this pass |
| No runtime third-party assets | verified | Source/build design retains CSS/system-only presentation |
| Runtime network restricted to shared Firebase account/save traffic | verified | Game workspace has no direct Firebase import; browser emulator traffic confined to shared platform services |
| Documentation/task synchronization | started | Spec/tracker are synchronized atomically through the settled-wager regression update; PRD/todo/index/task return to verified only after fresh exact-revision CI + Pages evidence. |

## Current handoff

**Implementation state:** implementing Royal Palace table-experience polish; game rules/engine/save/audio contracts remain unchanged.  
**Last verified revision:** historical verified baseline is repository revision `9ee0f93d` / run `37256390159`, plus Royal-specific gameplay/audio/mobile runs `37253435033`, `37253740411`, `37255447688`; these runs do not verify the new UI/UX implementation.  
**Dependency baseline before this pass:** workflow `37859097164` passed full validation and bot commit `853c87b0` refreshed exact current stable dependencies (React/DOM 19.3.0, Firebase 13.0.0, Vite 8.3.4, TypeScript 7.0.2, Vitest 5.0.3, Playwright 1.64.0).  
**Current implementation edge:** `5dbe580c` integrated the candidate UI/UX pass. Governance repairs `5bc8d6fc` and `8f839ef6` corrected tracker vocabulary and synchronized the authoritative spec. Run `37942073809` found the real 47×47 chip regression at the 320px/200%-text checkpoint. Repair `fe6e632e` plus synchronized docs `129a8c32` restored a non-shrinking 48×48 target. Run `37943038650` confirmed that fix by passing the complete shared design regression (including 320px/200% reflow, Royal touch/keyboard/reduced-motion behavior and desktop layout) and then passed Royal accessibility. Its next gameplay assertion expected the historical `Bank 995 Bet 0` after settlement, while the current product contract intentionally displays the committed wager until **Next round**. Test revision `f78cf425` updates all settlement paths to the correct visible exposure (`5`, `10`, or `15`) without changing bankroll, stats, session-net, engine or persistence behavior. Spec commit `1fb1f328` and tracker commit `0116ae6b` recorded that evidence sequentially; run `37943885380` correctly rejected the two-commit sequence because its push freshness base was the immediately preceding spec-only commit. This atomic spec+tracker commit supersedes that governance-only failure and changes no behavior.  
**Open game-local work:** run the full exact-revision Pages chain; if gameplay passes, continue through audio, the new Royal 320×900/mobile-motion regression, Mergrove/Cloudline design regressions, both builds and Pages deployment. Repair only evidence-backed failures without weakening the viewport, motion, accessibility or wager-clarity requirements. Restore RPB-003/005/006/007 and the completion contract to verified only after all applicable gates are green.  
**External blockers:** TASK-003 only for real Firebase project account/save verification; unrelated to this game-local polish.  
**Next action:** use the Pages workflow triggered by this atomic handoff as the authoritative execution environment and continue from the first remaining failure, if any.

## Experience principles now binding

- The felt/table is the primary tool surface; route chrome and secondary help must not dominate the first viewport.
- Current action context, wager and outcome remain legible without relying on motion, color or audio.
- The committed round wager remains visible while reviewing settlement and clears only when the next betting round begins.
- Motion communicates deal, reveal, active turn, wager update and round consequence once; no infinite pulse/glow/confetti or autoplay pressure.
- Primary round controls remain in document flow instead of a sticky/fixed layer that could obscure focus at zoom.
- Narrow-phone quality is not a shrunken desktop: controls recompose, wager modifiers stay compact, cards scale, and primary action reachability is tested.
- `prefers-reduced-motion: reduce` retains equivalent state/consequence information with cosmetic motion removed.

## Assets and licences

No third-party visual, audio, font or gameplay assets. Card faces, table treatment, symbols, sounds, copy and the new motion/texture treatments are repository-authored CSS/system capabilities. No runtime dependency was added for this pass.

Persistence schema version 1 and its committed balance/preference boundary remain unchanged. Do not infer completion from chat history: this tracker and the linked authoritative spec are the current resume contract until fresh evidence closes the reopened gates.
