# Royal Palace Blackjack tracker

**Spec:** `docs/specs/2026-10-03-royal-palace-blackjack-design.md`  
**Last synchronized:** 2026-10-04

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
| Virtual bankroll and chip betting controls | verified | Checkpoint tests + browser wager/reload/recovery + deterministic chip/bankroll gameplay regression |
| Practice-credit restore below minimum wager | verified | Pure checkpoint test + 320px browser restore/reload/stat-preservation regression |
| Re-bet / 2× / all-in / undo / clear | verified | Deterministic Chromium betting-control regression |
| W/L/P and session-net statistics | verified | Deterministic Chromium loss/win/split/surrender settlement accounting |
| Defensive versioned guest-local persistence | verified | Storage unit tests |
| Authenticated account-bound durable save | blocked | Shared repository + browser emulator verified; real Firebase project verification requires TASK-003 |
| Guest-to-account save seeding without cloud overwrite | verified | Atomic migration unit tests + browser emulator |
| Saved-game reset | verified | Scoped guest/account repository tests + browser emulator; defaults prevent guest reseeding |
| Optional exact-table strategy hints | verified | Strategy unit tests |
| Local procedural sound preference | started | Unit/source + preference browser persistence green; AudioContext cue scheduling browser verification remains |
| Responsive casino-table presentation | verified | Dedicated design-browser 320px + 200% text reflow assertions |
| Table rules/help and phase guidance | verified | Collapsed fixed-rule disclosure + phase/action context; design-browser discovery check |
| Keyboard/touch parity and visible focus | verified | Chromium deterministic keyboard flow tabs to chip and actions, verifies visible focus, Enter wager/deal/next-round, Space stand, and 48px minimum chip target |
| Accessible cards/status/dialogs | verified | Deterministic Chromium Ace-upcard flow verifies named visible/hidden card semantics, live status, initial dialog focus, Tab/Shift+Tab confinement, Escape dismissal and logical focus restoration |
| Reduced-motion presentation | verified | Chromium reduced-motion context verifies card animation resolves to `none` |
| Catalog + lazy workspace integration | verified | game-check + both builds |
| No runtime third-party assets | verified | Source/build review |
| Runtime network restricted to shared Firebase account/save traffic | verified | Game workspaces have no Firebase imports; browser emulator traffic confined to local services |
| Documentation/task synchronization | started | Updated with implementation/design verification commits |

## Assets and licences

No third-party visual, audio, font or gameplay assets. Card faces, table treatment, symbols, sounds and copy are repository-authored or rendered from Unicode/system capabilities; no Google Fonts request from the prototype is retained.

Persistence schema version 1 and its committed balance/preference boundary are defined in the spec. Current rendered-browser evidence covers 320px/200% reflow, minimum chip target sizing, table-help discoverability, native keyboard gameplay/focus, named card semantics, insurance-dialog keyboard behavior, reduced motion, betting modifiers, Hit/Stand, Double, split/DAS, split-Ace auto-resolution, surrender and resulting bankroll/W/L/P/session accounting. Run `37253435033` also verifies the immediate-action shoe-consumption regression: cards drawn for a terminal Hit, Double or split-Ace deal are carried into dealer play rather than being reused through stale React state. Pages deployment is verified. No production Firebase project has been claimed as verified.
