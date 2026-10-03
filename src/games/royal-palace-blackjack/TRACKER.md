# Royal Palace Blackjack tracker

**Spec:** `docs/specs/2026-10-03-royal-palace-blackjack-design.md`  
**Last synchronized:** 2026-10-03

| Capability | Status | Verification |
| --- | --- | --- |
| Six-deck shoe and cut-card lifecycle | verified | Shoe unit tests |
| Pure hand scoring and natural-blackjack semantics | verified | Engine unit tests |
| S17 dealer behavior | verified | Engine unit tests |
| Hit / stand / double | started | Engine + UI verification |
| One split / DAS / split-Ace restrictions | started | Engine + UI verification |
| Late surrender after dealer check | verified | Engine + UI verification |
| Insurance at half wager, 2:1 profit | verified | Engine + UI verification |
| 3:2 natural blackjack payout | verified | Engine settlement tests |
| Independent split-hand settlement | verified | Engine settlement tests |
| Virtual bankroll and chip betting controls | started | UI verification |
| Re-bet / 2× / all-in / undo / clear | started | UI verification |
| W/L/P and session-net statistics | started | Engine/UI verification |
| Defensive versioned local persistence | verified | Storage unit tests |
| Saved-game reset | started | Storage/UI verification |
| Optional exact-table strategy hints | verified | Strategy unit tests |
| Local procedural sound preference | started | Unit/source verification green; browser review pending Pages |
| Responsive casino-table presentation | started | 320px CSS hardening landed; live viewport/zoom review pending Pages |
| Keyboard/touch parity and visible focus | started | Native controls/focus CSS present; live keyboard/touch review pending Pages |
| Accessible cards/status/dialogs | started | Semantic/static audit improved; live assistive-tech review pending Pages |
| Reduced-motion presentation | started | Reduced-motion CSS present; live browser review pending Pages |
| Catalog + lazy workspace integration | verified | game-check + build |
| No runtime external requests/assets | verified | Source/build review |
| Documentation/task synchronization | started | Updated with implementation commits |

## Assets and licences

No third-party visual, audio, font or gameplay assets. Card faces, table treatment, icons/symbols, sounds and copy are repository-authored or rendered from Unicode/system capabilities; no Google Fonts request from the prototype is retained.
