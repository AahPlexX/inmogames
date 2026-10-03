# Royal Palace Blackjack tracker

**Spec:** `docs/specs/2026-10-03-royal-palace-blackjack-design.md`  
**Last synchronized:** 2026-10-03

| Capability | Status | Verification |
| --- | --- | --- |
| Six-deck shoe and cut-card lifecycle | planned | Shoe unit tests |
| Pure hand scoring and natural-blackjack semantics | planned | Engine unit tests |
| S17 dealer behavior | planned | Engine unit tests |
| Hit / stand / double | planned | Engine + UI verification |
| One split / DAS / split-Ace restrictions | planned | Engine + UI verification |
| Late surrender after dealer check | planned | Engine + UI verification |
| Insurance at half wager, 2:1 profit | planned | Engine + UI verification |
| 3:2 natural blackjack payout | planned | Engine settlement tests |
| Independent split-hand settlement | planned | Engine settlement tests |
| Virtual bankroll and chip betting controls | planned | UI verification |
| Re-bet / 2× / all-in / undo / clear | planned | UI verification |
| W/L/P and session-net statistics | planned | Engine/UI verification |
| Defensive versioned local persistence | planned | Storage unit tests |
| Saved-game reset | planned | Storage/UI verification |
| Optional exact-table strategy hints | planned | Strategy unit tests |
| Local procedural sound preference | planned | Browser review |
| Responsive casino-table presentation | planned | 320px/zoom/large viewport review |
| Keyboard/touch parity and visible focus | planned | Accessibility review |
| Accessible cards/status/dialogs | planned | Accessibility review |
| Reduced-motion presentation | planned | CSS/browser review |
| Catalog + lazy workspace integration | planned | game-check + build |
| No runtime external requests/assets | planned | Source/build review |
| Documentation/task synchronization | started | Updated with implementation commits |

## Assets and licences

No third-party visual, audio, font or gameplay assets. Card faces, table treatment, icons/symbols, sounds and copy are repository-authored or rendered from Unicode/system capabilities; no Google Fonts request from the prototype is retained.
