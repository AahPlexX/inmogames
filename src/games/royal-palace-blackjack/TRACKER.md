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
| Virtual bankroll and chip betting controls | started | Existing betting/checkpoint behavior remains verified; polished UI derives visible table exposure from staged wager before Deal and actual hand wagers afterward. Fresh rendered verification pending. |
| Practice-credit restore below minimum wager | verified | Pure checkpoint test + 320px browser restore/reload/stat-preservation regression |
| Re-bet / 2× / all-in / undo / clear | verified | Deterministic Chromium betting-control regression |
| W/L/P and session-net statistics | verified | Deterministic Chromium loss/win/split/surrender settlement accounting |
| Defensive versioned guest-local persistence | verified | Storage unit tests |
| Authenticated account-bound durable save | blocked externally | Shared repository + browser emulator verified; real Firebase project verification requires TASK-003 |
| Guest-to-account save seeding without cloud overwrite | verified | Atomic migration unit tests + browser emulator |
| Saved-game reset | verified | Scoped guest/account repository tests + browser emulator; defaults prevent guest reseeding |
| Optional exact-table strategy hints | verified | Strategy unit tests |
| Local procedural sound preference | verified | Unit tests + Chromium WebAudio opt-in/resume/no-autoplay/persistence/cue-suppression regression |
| Responsive casino-table presentation | started | Scoped Royal-only route/header compaction, stable `svh` felt sizing, denser narrow betting controls, safe-area console spacing and first-viewport Deal reachability are implemented; run `37942073809` exposed a real 47×47 narrow-chip regression before the remaining Royal suites ran, repaired at `fe6e632e` by restoring a non-shrinking 48×48 target. Fresh rerun pending. |
| Table rules/help and phase guidance | started | Existing copy/semantics unchanged; secondary native rules disclosure now follows primary round actions. Fresh rendered/keyboard evidence pending. |
| Keyboard/touch parity and visible focus | started | Native controls/focus baseline unchanged; fresh exact-revision browser validation required after hierarchy/layout changes. |
| Accessible cards/status/dialogs | started | Accessible card/dialog semantics retained; status is now atomic and presentation changed, so fresh evidence pending. |
| Reduced-motion presentation | started | One-shot card/reveal/active-hand/wager/result/dialog/help motion added with scoped `prefers-reduced-motion: reduce` suppression; fresh normal/reduced evidence pending. |
| Catalog + lazy workspace integration | verified | game-check + both builds baseline; no registry change in this pass |
| No runtime third-party assets | verified | Source/build design retains CSS/system-only presentation |
| Runtime network restricted to shared Firebase account/save traffic | verified | Game workspace has no direct Firebase import; browser emulator traffic confined to shared platform services |
| Documentation/task synchronization | started | Spec, tracker, PRD/todo, game index and in-progress ledger reopened together; return to verified only after fresh exact-revision CI + Pages evidence. |

## Current handoff

**Implementation state:** implementing Royal Palace table-experience polish; game rules/engine/save/audio contracts remain unchanged.  
**Last verified revision:** historical verified baseline is repository revision `9ee0f93d` / run `37256390159`, plus Royal-specific gameplay/audio/mobile runs `37253435033`, `37253740411`, `37255447688`; these runs do not verify the new UI/UX implementation.  
**Dependency baseline before this pass:** workflow `37859097164` passed full validation and bot commit `853c87b0` refreshed exact current stable dependencies (React/DOM 19.3.0, Firebase 13.0.0, Vite 8.3.4, TypeScript 7.0.2, Vitest 5.0.3, Playwright 1.64.0).  
**Current implementation edge:** revision `5dbe580c` integrates the candidate UI/UX pass: `RoyalPalaceBlackjackWorkspace.tsx` derives `tableWager` from staged betting state before Deal and actual hand wagers afterward; root phase/outcome data attributes drive presentation only; status is atomic; round actions precede the rules disclosure. CSS compacts shared route chrome only when `.rp` is mounted, reduces narrow felt height using `svh` with fallback, keeps controls in normal flow, tightens mobile chip/modifier layout, adds safe-area spacing and finite deal/reveal/turn/wager/result/dialog/help feedback. Reduced-motion removes cosmetic animation. Mobile regression adds first-viewport Deal reachability, staged/post-Deal wager visibility and normal-motion card animation. Pages run `37860044626` stopped at `game:check` because the first tracker draft used unsupported capability status vocabulary and lacked the exact required `Last verified revision` field. Tracker-only repair `5bc8d6fc` fixed that schema, and run `37941713765` then confirmed `game-check: 4 game(s) OK` before the documentation synchronization guard correctly required the authoritative spec and tracker to change together. Synchronized revision `8f839ef6` cleared governance, dependency freshness, design lint, TypeScript, 80 unit tests, Firestore rules and the account/persistence browser suite. Its design-browser stage then found the first actual UI regression: at the 320px/200%-text checkpoint a chip measured 47×47 although the contract requires at least 48×48. Commit `fe6e632e` restores 48×48 and prevents flex shrink at ≤350px; no rule, engine, save or audio behavior changed.  
**Open game-local work:** rerun full exact-revision CI after synchronizing this touch-target repair; diagnose/fix any later rendered failure without weakening requirements; then verify Pages deployment and restore RPB-003/005/006/007 + completion state only if all applicable gates are green.  
**External blockers:** TASK-003 only for real Firebase project account/save verification; unrelated to this game-local polish.  
**Next action:** use the Pages workflow triggered by the synchronized touch-target repair as the authoritative execution environment and continue from the first remaining unit/browser/build failure, if any.

## Experience principles now binding

- The felt/table is the primary tool surface; route chrome and secondary help must not dominate the first viewport.
- Current action context, wager and outcome remain legible without relying on motion, color or audio.
- Motion communicates deal, reveal, active turn, wager update and round consequence once; no infinite pulse/glow/confetti or autoplay pressure.
- Primary round controls remain in document flow instead of a sticky/fixed layer that could obscure focus at zoom.
- Narrow-phone quality is not a shrunken desktop: controls recompose, wager modifiers stay compact, cards scale, and primary action reachability is tested.
- `prefers-reduced-motion: reduce` retains equivalent state/consequence information with cosmetic motion removed.

## Assets and licences

No third-party visual, audio, font or gameplay assets. Card faces, table treatment, symbols, sounds, copy and the new motion/texture treatments are repository-authored CSS/system capabilities. No runtime dependency was added for this pass.

Persistence schema version 1 and its committed balance/preference boundary remain unchanged. Do not infer completion from chat history: this tracker and the linked authoritative spec are the current resume contract until fresh evidence closes the reopened gates.
