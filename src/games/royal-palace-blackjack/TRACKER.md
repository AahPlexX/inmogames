# Royal Palace Blackjack tracker

**Spec:** `docs/specs/2026-10-03-royal-palace-blackjack-design.md`  
**Last synchronized:** 2026-10-04

| Capability | Status | Verification |
| --- | --- | --- |
| Six-deck shoe and cut-card lifecycle | verified | Shoe unit tests |
| Pure hand scoring and natural-blackjack semantics | verified | Engine unit tests |
| S17 dealer behavior | verified | Engine unit tests |
| Hit / stand / double | started | Engine legality tests; workspace now consumes engine legality helpers; broader gameplay review remains |
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
| Local procedural sound preference | started | Unit/source verification green; live browser review pending final design pass |
| Responsive casino-table presentation | started | Private-table redesign + 320px hardening landed; browser/zoom verification in progress |
| Keyboard/touch parity and visible focus | started | Native controls/shared + table-local focus treatment present; browser review in progress |
| Accessible cards/status/dialogs | started | Semantic/static audit improved; live browser/accessibility review in progress |
| Reduced-motion presentation | started | Reduced-motion CSS present; live browser review in progress |
| Catalog + lazy workspace integration | verified | game-check + build |
| No runtime third-party assets | verified | Source/build review |
| Runtime network restricted to shared Firebase account/save traffic | verified | Game workspaces have no Firebase imports; browser emulator traffic confined to local services |
| Documentation/task synchronization | started | Updated with implementation commits |

## Assets and licences

No third-party visual, audio, font or gameplay assets. Card faces, table treatment, icons/symbols, sounds and copy are repository-authored or rendered from Unicode/system capabilities; no Google Fonts request from the prototype is retained.

Persistence schema version 1 and its committed balance/preference boundary are defined in the spec. Unit coverage preserves all engine/strategy cases. Live Firebase/email account-save checks remain external; Pages deployment is verified. No production Firebase project has been claimed as verified.
