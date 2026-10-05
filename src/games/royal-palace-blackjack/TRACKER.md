# Royal Palace Blackjack tracker

**Spec:** `docs/specs/2026-10-03-royal-palace-blackjack-design.md`  
**Last synchronized:** 2026-10-05

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
| Authenticated account-bound durable save | blocked externally | Shared repository + browser emulator verified; real Firebase project verification requires TASK-003 |
| Guest-to-account save seeding without cloud overwrite | verified | Atomic migration unit tests + browser emulator |
| Saved-game reset | verified | Scoped guest/account repository tests + browser emulator; defaults prevent guest reseeding |
| Optional exact-table strategy hints | verified | Strategy unit tests |
| Local procedural sound preference | verified | Unit tests + Chromium WebAudio opt-in/resume/no-autoplay/persistence/cue-suppression regression |
| Responsive casino-table presentation | verified | 320px + 200% browser reflow, live desktop/mobile discovery review, and lone-action mobile regression |
| Table rules/help and phase guidance | verified | Collapsed fixed-rule disclosure + phase/action context; browser discovery check |
| Keyboard/touch parity and visible focus | verified | Chromium deterministic keyboard flow, visible focus, native activation, and touch-target checks |
| Accessible cards/status/dialogs | verified | Deterministic Chromium card semantics, live status, insurance focus entry/confinement, Escape and focus restoration |
| Reduced-motion presentation | verified | Chromium reduced-motion context verifies card animation resolves to `none` |
| Catalog + lazy workspace integration | verified | game-check + both builds |
| No runtime third-party assets | verified | Source/build review |
| Runtime network restricted to shared Firebase account/save traffic | verified | Game workspace has no direct Firebase import; browser emulator traffic confined to shared platform services |
| Documentation/task synchronization | verified | Spec, tracker, game index and task ledger synchronized after deployed verification |

## Assets and licences

No third-party visual, audio, font or gameplay assets. Card faces, table treatment, symbols, sounds and copy are repository-authored or rendered from Unicode/system capabilities; no Google Fonts request from the prototype is retained.

Persistence schema version 1 and its committed balance/preference boundary are defined in the spec. Run `37253435033` verifies deterministic gameplay and the immediate-action shoe-consumption regression: cards drawn for a terminal Hit, Double or split-Ace deal are carried into dealer play rather than being reused through stale React state. Run `37253740411` verifies procedural WebAudio opt-in behavior and deploys it. Run `37255447688` verifies the full validation chain plus the 320px mobile action-row regression and successful Pages deployment. Independent live desktop inspection was clean. Live mobile inspection exposed the lone-action layout defect, and an isolated live-browser discrimination confirmed the exact selector behavior before the same fix passed the unchanged 320px regression and Pages deployment; the later post-deploy live-browser retry timed out, so no unsupported post-fix live-mobile claim is recorded.

The game implementation is verified. Live Firebase account/save provisioning is a shared platform blocker tracked by TASK-003 and is not claimed as verified.