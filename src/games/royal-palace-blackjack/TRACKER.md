# Royal Palace Blackjack tracker

**Spec:** `docs/specs/2026-10-03-royal-palace-blackjack-design.md`  
**Last synchronized:** 2026-10-09

| Capability | Status | Verification |
| --- | --- | --- |
| Six-deck shoe and cut-card lifecycle | verified | Shoe unit tests; complete chain reconfirmed in run `37994433846` |
| Pure hand scoring and natural-blackjack semantics | verified | Engine unit tests; complete chain reconfirmed in run `37994433846` |
| S17 dealer behavior | verified | Engine unit tests; complete chain reconfirmed in run `37994433846` |
| Hit / stand / double | verified | Engine legality tests + deterministic Chromium regressions; run `37994433846` green |
| One split / DAS / split-Ace restrictions | verified | Engine legality + deterministic Chromium split/DAS/split-Ace regressions; run `37994433846` green |
| Late surrender after dealer check | verified | Engine legality + deterministic Chromium surrender/half-return regression |
| Insurance at half wager, 2:1 profit | verified | Engine + UI verification |
| 3:2 natural blackjack payout | verified | Engine settlement tests |
| Independent split-hand settlement | verified | Engine settlement tests + deterministic split-hand browser settlement |
| Virtual bankroll and chip betting controls | verified | Run `37994433846` passed staged/settled wager visibility, betting modifiers, Hit/Stand, Double, split/DAS, split-Ace, surrender and bankroll/W/L/P/session accounting |
| Practice-credit restore below minimum wager | verified | Pure checkpoint test + 320px browser restore/reload/stat-preservation regression |
| Re-bet / 2× / all-in / undo / clear | verified | Deterministic Chromium betting-control regression; reconfirmed by run `37994433846` |
| W/L/P and session-net statistics | verified | Deterministic Chromium settlement accounting; reconfirmed by run `37994433846` |
| Defensive versioned guest-local persistence | verified | Storage unit tests + account/persistence browser suite in run `37994433846` |
| Authenticated account-bound durable save | blocked externally | Shared repository + browser emulator verified; real Firebase project verification requires TASK-003 |
| Guest-to-account save seeding without cloud overwrite | verified | Atomic migration unit tests + browser emulator |
| Saved-game reset | verified | Scoped guest/account repository tests + browser emulator; defaults prevent guest reseeding |
| Optional exact-table strategy hints | verified | Strategy unit tests |
| Local procedural sound preference | verified | Run `37994433846` passed opt-in, AudioContext resume, no autoplay, persisted preference and procedural cue suppression |
| Responsive casino-table presentation | verified | Run `37994433846` passed shared 320px/200%-text reflow, >=48px chip targets, keyboard/touch/reduced motion/desktop layout, lone-action row fill and dedicated 320×900 first-viewport Deal reachability |
| Table rules/help and phase guidance | verified | Native rules disclosure follows primary actions and passed rendered/keyboard regressions in run `37994433846` |
| Keyboard/touch parity and visible focus | verified | Shared rendered regression plus Royal accessibility passed in run `37994433846` |
| Accessible cards/status/dialogs | verified | Run `37994433846` passed named card/status semantics, insurance focus entry/confinement, Escape close and logical focus restoration |
| Reduced-motion presentation | verified | Shared reduced-motion regression passed and dedicated mobile-layout suite passed normal-motion card feedback in run `37994433846` |
| Catalog + lazy workspace integration | verified | game-check, catalog accessibility and both builds passed in run `37994433846` |
| No runtime third-party assets | verified | Source/build design retains CSS/system-only presentation |
| Runtime network restricted to shared Firebase account/save traffic | verified | Game workspace has no direct Firebase import; browser emulator traffic confined to shared platform services |
| Documentation/task synchronization | verified | Spec/tracker/PRD/todo/index/task closeout records synchronized after full green validation + Pages deployment evidence from run `37994433846` |

## Current handoff

**Implementation state:** verified — 2026-10-09 Royal Palace table-experience/viewport/motion polish complete.  
**Last verified revision:** `4814d85f375ccd90514252b07692c3c570ca410d` / GitHub Actions run `37994433846`; the run passed the complete repository validation chain and automatic GitHub Pages deployment.  
**Verification summary:** run `37994433846` passed exact dependency freshness, design lint, TypeScript, game/document governance, 80 unit tests, Firestore rules, account/persistence browser checks, catalog accessibility, shared 320px/200%-text/keyboard/touch/reduced-motion regressions, Royal accessibility/gameplay/audio, the dedicated Royal mobile-layout suite, Mergrove and Cloudline design regressions, both production builds, artifact upload and Pages deployment. The Royal mobile suite explicitly reported: first-viewport Deal reachability, persistent wager state, card motion and compact multi-action play passed.  
**Open game-local work:** none.  
**External blockers:** TASK-003 only for real Firebase project account/save verification; it is a shared platform blocker and not a Royal Palace implementation defect.  
**Next action:** no game-local action required unless a new rule/feature/material UI or persistence change is requested, or a regression is discovered; any such change must reopen the matching PRD/spec/todo/tracker gates before implementation resumes.

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

No third-party visual, audio, font or gameplay assets. Card faces, table treatment, symbols, sounds, copy and the motion/texture treatments are repository-authored CSS/system capabilities. No runtime dependency was added for this pass.

Persistence schema version 1 and its committed balance/preference boundary remain unchanged. Do not infer future completion from chat history: this tracker and the linked authoritative spec are the resume contract, and any material game-local change must explicitly reopen the relevant gates.
