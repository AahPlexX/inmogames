# Royal Palace Blackjack tracker

**Spec:** `docs/specs/2026-10-03-royal-palace-blackjack-design.md`  
**Last synchronized:** 2026-10-04

| Capability | Status | Verification |
| --- | --- | --- |
| Six-deck shoe and cut-card lifecycle | verified | Shoe unit tests |
| Pure hand scoring and natural-blackjack semantics | verified | Engine unit tests |
| S17 dealer behavior | verified | Engine unit tests |
| Hit / stand / double | started | Engine legality tests; workspace consumes engine legality helpers; broader gameplay review remains |
| One split / DAS / split-Ace restrictions | started | Engine + UI verification |
| Late surrender after dealer check | verified | Engine + UI verification |
| Insurance at half wager, 2:1 profit | verified | Engine + UI verification |
| 3:2 natural blackjack payout | verified | Engine settlement tests |
| Independent split-hand settlement | verified | Engine settlement tests |
| Virtual bankroll and chip betting controls | started | Completed checkpoint tests + browser wager/reload/recovery checks pass; broader gameplay review remains |
| Practice-credit restore below minimum wager | verified | Pure checkpoint test + 320px browser restore/reload/stat-preservation regression |
| Re-bet / 2× / all-in / undo / clear | started | UI verification |
| W/L/P and session-net statistics | started | Engine/UI verification |
| Defensive versioned guest-local persistence | verified | Storage unit tests |
| Authenticated account-bound durable save | blocked | Shared repository + browser emulator verified; real Firebase project verification requires TASK-003 |
| Guest-to-account save seeding without cloud overwrite | verified | Atomic migration unit tests + browser emulator |
| Saved-game reset | verified | Scoped guest/account repository tests + browser emulator; defaults prevent guest reseeding |
| Optional exact-table strategy hints | verified | Strategy unit tests |
| Local procedural sound preference | started | Unit/source + preference browser persistence green; audible-cue browser review remains |
| Responsive casino-table presentation | verified | Dedicated design-browser 320px + 200% text reflow assertions |
| Table rules/help and phase guidance | verified | Collapsed fixed-rule disclosure + phase/action context; design-browser discovery check |
| Keyboard/touch parity and visible focus | started | Native controls/shared + table-local focus treatment; representative touch target verified, broader keyboard gameplay review remains |
| Accessible cards/status/dialogs | started | Semantic/static audit + existing dialog focus/Escape browser checks; broader assistive-tech review remains |
| Reduced-motion presentation | verified | Chromium reduced-motion context verifies card animation resolves to `none` |
| Catalog + lazy workspace integration | verified | game-check + both builds |
| No runtime third-party assets | verified | Source/build review |
| Runtime network restricted to shared Firebase account/save traffic | verified | Game workspaces have no Firebase imports; browser emulator traffic confined to local services |
| Documentation/task synchronization | started | Updated with implementation/design verification commits |

## Assets and licences

No third-party visual, audio, font or gameplay assets. Card faces, table treatment, symbols, sounds and copy are repository-authored or rendered from Unicode/system capabilities; no Google Fonts request from the prototype is retained.

Persistence schema version 1 and its committed balance/preference boundary are defined in the spec. Current rendered-browser evidence covers 320px/200% reflow, minimum chip target sizing, table-help discoverability and reduced motion. Live Firebase/email account-save checks and broader assistive-technology/gameplay review remain external/remaining checks. Pages deployment is verified. No production Firebase project has been claimed as verified.
