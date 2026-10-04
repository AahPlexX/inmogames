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
| Responsive 3 × 3 native-button board | planned | Build + viewport review |
| Pointer/touch and keyboard parity | planned | Native-button interaction review |
| Visible focus and non-color selection state | planned | Accessibility review |
| Live round/score/result feedback | planned | Accessibility review |
| Reduced-motion handling | planned | CSS review |
| Defensive guest-local best-score persistence | planned | Storage unit tests |
| Best-score reset | planned | Storage/UI verification |
| Catalog registration and lazy workspace loading | planned | Structural check + build |
| 320 CSS-px no-overflow behavior | planned | Viewport review |
| Completion/results state | planned | UI + engine verification |
| Authenticated best-score account sync | planned | Shared Firebase platform + integration test |
| Runtime network restricted to shared Firebase account/save traffic | planned | Source/build/network review |
| Spec/tracker/index/task synchronization | started | Updated with each implementation commit |

## Assets and licences

No third-party visual, audio, font or gameplay assets are planned. Threefold v1 uses only repository-authored HTML/CSS/TypeScript/React.
