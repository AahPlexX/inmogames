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
| Virtual bankroll and chip betting controls | started | Run `37944290232` passed the corrected gameplay suite with visible staged/settled wagers, all betting modifiers, Hit/Stand, Double, split/DAS, split-Ace, surrender and bankroll/W/L/P/session accounting. Final completion still awaits the later mobile-layout/build/deploy gates. |
| Practice-credit restore below minimum wager | verified | Pure checkpoint test + 320px browser restore/reload/stat-preservation regression |
| Re-bet / 2× / all-in / undo / clear | verified | Deterministic Chromium betting-control regression; reconfirmed by run `37944290232` |
| W/L/P and session-net statistics | verified | Deterministic Chromium settlement accounting; reconfirmed by run `37944290232` |
| Defensive versioned guest-local persistence | verified | Storage unit tests |
| Authenticated account-bound durable save | blocked externally | Shared repository + browser emulator verified; real Firebase project verification requires TASK-003 |
| Guest-to-account save seeding without cloud overwrite | verified | Atomic migration unit tests + browser emulator |
| Saved-game reset | verified | Scoped guest/account repository tests + browser emulator; defaults prevent guest reseeding |
| Optional exact-table strategy hints | verified | Strategy unit tests |
| Local procedural sound preference | verified | Run `37944290232` freshly passed opt-in, AudioContext resume, no autoplay, persisted preference and procedural cue suppression |
| Responsive casino-table presentation | started | Shared 320px/200% reflow, >=48px chip targets, Royal keyboard/touch/reduced-motion behavior and desktop layout are green. Run `37944290232` then reached the dedicated 320×900 suite and exposed one geometry defect: a lone Deal button measured 267.06px inside a 281.22px action frame because the single-action frame retained 0.48rem inset padding. Source repair `aacd73fd` removes the inset only for betting/settled single-action phases; fresh rerun pending. |
| Table rules/help and phase guidance | started | Existing copy/semantics unchanged; secondary native rules disclosure follows primary round actions. Fresh full-chain evidence pending. |
| Keyboard/touch parity and visible focus | started | Shared rendered regression and Royal accessibility are green in current evidence; final exact-revision completion awaits the dedicated mobile/layout/build/deploy gates. |
| Accessible cards/status/dialogs | verified | Run `37944290232` passed named card/status semantics, insurance focus entry/confinement, Escape close and logical focus restoration |
| Reduced-motion presentation | started | Shared reduced-motion behavior is green; dedicated normal-motion card/mobile assertion remains pending after the lone-action geometry repair. |
| Catalog + lazy workspace integration | verified | game-check + both builds baseline; no registry change in this pass |
| No runtime third-party assets | verified | Source/build design retains CSS/system-only presentation |
| Runtime network restricted to shared Firebase account/save traffic | verified | Game workspace has no direct Firebase import; browser emulator traffic confined to shared platform services |
| Documentation/task synchronization | started | Spec/tracker are synchronized atomically through the lone-action geometry repair; PRD/todo/index/task return to verified only after fresh exact-revision CI + Pages evidence. |

## Current handoff

**Implementation state:** implementing Royal Palace table-experience polish; game rules/engine/save/audio contracts remain unchanged.  
**Last verified revision:** historical verified baseline is repository revision `9ee0f93d` / run `37256390159`, plus Royal-specific gameplay/audio/mobile runs `37253435033`, `37253740411`, `37255447688`; these runs do not verify the new UI/UX implementation.  
**Dependency baseline before this pass:** workflow `37859097164` passed full validation and bot commit `853c87b0` refreshed exact current stable dependencies (React/DOM 19.3.0, Firebase 13.0.0, Vite 8.3.4, TypeScript 7.0.2, Vitest 5.0.3, Playwright 1.64.0).  
**Current implementation edge:** `5dbe580c` integrated the candidate UI/UX pass. Governance corrections and a 48×48 chip repair progressed the suite until run `37943038650` proved shared 320px/200%/touch/keyboard/reduced-motion/accessibility behavior and exposed stale settled-wager test expectations. `f78cf425` aligned those assertions to the intentional visible exposure contract. Atomic doc sync `c00bfd99` then allowed run `37944290232` to pass governance, 80 unit tests, Firestore rules, account/persistence browser, catalog/design regression, Royal accessibility, the corrected Royal gameplay suite and Royal audio. The next dedicated mobile-layout check found the Deal button only 267.06px wide inside a 281.22px action frame because `.rp-actions` still applied 0.48rem padding to single-action phases. Source commit `aacd73fd` now sets action-frame padding to zero only for `data-phase="betting"` and `data-phase="settled"`, so lone Deal/Next round actions fill the framed row while the five-action player group keeps its inset. No engine, rules, persistence or audio behavior changed.  
**Open game-local work:** run the full exact-revision Pages chain after this atomic documentation synchronization. Verify the lone-action width, first-viewport Deal reachability, staged/post-Deal wager display, normal-motion card entry and all remaining Mergrove/Cloudline/browser/build/Pages gates. Repair only evidence-backed failures without weakening viewport, motion, accessibility or wager-clarity requirements. Restore RPB-003/005/006/007 and the completion contract to verified only after all applicable gates are green.  
**External blockers:** TASK-003 only for real Firebase project account/save verification; unrelated to this game-local polish.  
**Next action:** use the Pages workflow triggered by this synchronized repair as the authoritative execution environment and continue from the first remaining failure, if any.

## Experience principles now binding

- The felt/table is the primary tool surface; route chrome and secondary help must not dominate the first viewport.
- Current action context, wager and outcome remain legible without relying on motion, color or audio.
- The committed round wager remains visible while reviewing settlement and clears only when the next betting round begins.
- Lone round actions fill their framed action row; multi-action player controls retain grouped spacing.
- Motion communicates deal, reveal, active turn, wager update and round consequence once; no infinite pulse/glow/confetti or autoplay pressure.
- Primary round controls remain in document flow instead of a sticky/fixed layer that could obscure focus at zoom.
- Narrow-phone quality is not a shrunken desktop: controls recompose, wager modifiers stay compact, cards scale, and primary action reachability is tested.
- `prefers-reduced-motion: reduce` retains equivalent state/consequence information with cosmetic motion removed.

## Assets and licences

No third-party visual, audio, font or gameplay assets. Card faces, table treatment, symbols, sounds, copy and the new motion/texture treatments are repository-authored CSS/system capabilities. No runtime dependency was added for this pass.

Persistence schema version 1 and its committed balance/preference boundary remain unchanged. Do not infer completion from chat history: this tracker and the linked authoritative spec are the current resume contract until fresh evidence closes the reopened gates.
