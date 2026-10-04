# Threefold tracker

**Spec:** `docs/specs/2026-10-03-threefold-design.md`  
**Last synchronized:** 2026-10-04

| Capability | Status | Verification |
| --- | --- | --- |
| Pure deterministic engine | verified | Engine unit tests |
| Guaranteed-solvable 9-tile rounds | verified | Generation/property-style unit coverage |
| Five-round run progression | verified | Engine unit tests |
| 100-point round scoring with 20-point miss penalty and 20-point floor | verified | Engine unit tests |
| Accept any valid three-tile solution | verified | Engine unit tests |
| Responsive 3 × 3 native-button board | started | Authored tile-board UI landed; browser/viewport verification in progress |
| Pointer/touch and keyboard parity | started | Native buttons preserved; browser interaction review in progress |
| Visible focus and non-color selection state | started | Shared focus ring + selected fill/position/checkmark landed; browser review in progress |
| Live round/score/result feedback | started | Score rail/status/completion composition landed; browser review in progress |
| Reduced-motion handling | started | Scoped reduced-motion override landed; browser review in progress |
| Defensive guest-local best-score persistence | verified | Valid/legacy/schema/blocked-storage unit coverage + browser completion |
| Best-score reset | verified | Game-scoped browser emulator reset across two account sessions |
| Catalog registration and lazy workspace loading | verified | Structural check + both builds |
| 320 CSS-px no-overflow behavior | started | Narrow-layout implementation landed; regression suite review in progress |
| Completion/results state | verified | Five-round browser completion and persisted best score |
| Authenticated best-score account sync | blocked | Shared repository + cross-browser emulator verified; real Firebase project verification requires TASK-003 |
| Runtime network restricted to shared Firebase account/save traffic | verified | No game Firebase calls; browser emulator traffic restricted to local services |
| Spec/tracker/index/task synchronization | started | Updated with each implementation commit |

## Assets and licences

No third-party visual, audio, font or gameplay assets are planned. Threefold v1 uses only repository-authored HTML/CSS/TypeScript/React.

Save schema version 1 stores only the best completed score. Full live Firebase/deployed-site checks and broader accessibility review remain explicit external/remaining game checks.
