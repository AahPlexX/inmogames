# Game index

One row per game. Update when a game is added, changes status, or is removed.

All current and future games are subject to `docs/GAME_PRESENTATION_QUALITY.md`. Its source baseline is reconnaissance rather than a status override: a verified game reopens only when its presentation audit becomes active or a concrete presentation defect/change is taken into implementation under the per-game governance contract.

| Slug | Name | Category | Players | Storage | Status |
| --- | --- | --- | --- | --- | --- |
| `threefold` | Threefold | puzzle | single | localStorage (guest), Firestore (account) | verified game; account saves emulator-verified, live Firebase setup blocked by TASK-003 |
| `royal-palace-blackjack` | Royal Palace Blackjack | card-board | single | localStorage (guest), Firestore (account) | verified game; 2026-10-09 table-experience/viewport/motion polish passed full validation and Pages deployment in run `37994433846`; live Firebase setup blocked by TASK-003 |
| `mergrove` | Mergrove | puzzle | single | localStorage (guest), Firestore (account) | verified game v1; engine/UI/persistence/account-emulator/Pages evidence green in run `37553471015`; v2 Campaign/power-up progression design approved but implementation not started pending written-spec review; live Firebase setup blocked by TASK-003 |
| `cloudline-couriers` | Cloudline Couriers | strategy | single | localStorage (guest), Firestore (account) | implementing; client-fix tranche released in exact functional `2628ca27e8aa95778203f78848d30df31e60f25e` / CI/Pages `40034775904`, live-smoked 2026-10-23; expanded campaign and human comprehension/art/motion testing remain open; live Firebase remains TASK-003 |
| `royal-fortune-slots` | Royal Fortune Slots | arcade | single | localStorage (guest), Firestore (account) | verified game; exact probability, persistence, accessibility/responsive browser validation, both builds and Pages deployment passed on functional revision `e89b9c64eada44a4a5953c17072d57b7d940b4d2` in run `38090041520`; live Firebase setup blocked by TASK-003 |
| `lucky-seven-classic` | Lucky Seven Classic | arcade | single | localStorage (guest), Firestore (account) | verified game; exact engine/probability, settled persistence, accessible mechanical cabinet, RNG-failure safety, deterministic keyboard settlement/reload, restore, opt-in audio, 320px/200%-text/reduced-motion browser validation, both production builds and GitHub Pages deployment passed on exact functional revision `04ae049259232edf9ec5af4aa63d4786d8673ba4` in run `38121766726`; live Firebase setup blocked by TASK-003 |
| `cascade-vault` | Cascade Vault | arcade | single | localStorage (guest), Firestore (account) | verified game; exact functional revision `2628ca27e8aa95778203f78848d30df31e60f25e` passed full CI/Pages `40034775904`, refreshed 10M audit `40036114157` and live route smoke on 2026-10-23; live Firebase remains TASK-003 |

### Historical Cascade Vault notes (current state is in the row above)

These entries retain the state and next steps recorded at each earlier audit candidate; their interim next actions are superseded by CV-002 D6 acceptance and the current CV-004/CV-005 handoff in the row above.

- Historical CV-002 audit harness discovery issue (2026-10-20): run `39300303052` exposed audit-test discovery filtering; conditional audit-only Vitest discovery was later integrated and passed in run `39457748530`.
- Historical CV-003 RED/candidate (2026-10-20): RED `40442255…` / run `39458077585` isolated missing storage/persistence modules; CV-003 later verified on `343ca3fc…` / run `39459146356`.
- Cascade Vault CV-002 screen: run `39459206136` recorded a 50-cascade guard hit on the provisional distribution; candidate D1 flattens paying-symbol concentration/Wild frequency before the next screen.
- Cascade Vault CV-002 D2 (2026-10-20): D1 still hit the guard in run `39459715477`; an inert nonpaying `blank` at weight 24 is added to initial/refill distributions before the next 25k screen.
- Cascade Vault CV-002 D3 (2026-10-20): D2 is full-validation/Pages green (`5c2062f8…`, run `39460176426`) and 25k guard-safe (`39460203286`) but measured 1321.4587% RTP; D3 uses blank 30 plus calibrated integer-centi paytable for the next screen.
- Cascade Vault D3 test sync (2026-10-20): run `39461070614` exposed one expected stale fixture payout (200→20 units after paytable calibration); test-only expectation synchronized, production unchanged.
- Cascade Vault D4 (2026-10-20): D3 audit `39461462180` was guard-safe at 62.85558% RTP; distribution frozen, next screen changes paytable only with conservative uplift concentrated in longer/rarer ways.

- Cascade Vault D5 (2026-10-20): D4 full validation/Pages is green in run `39461928870`; 25k audit `39461954213` was guard-safe at RTP `1.1440064`, so distribution remains frozen and D5 scales paytable only toward the 0.955 midpoint before the >=10M acceptance gate.

- Cascade Vault D6 (2026-10-20): D5 revision `2ef4203a…` is fully validated/deployed (`39490450975`), but 10M acceptance `39490755045` rejected RTP `0.87157806` with zero guard hits. D6 is paytable-only; distribution remains frozen at blank 30.

- Cascade Vault CV-002 verified: D6 `f9893506…` passed Pages `39491636082` and 10M acceptance `39491663232` at RTP `0.950268466`, zero guard hits. Remaining game-local scope: CV-004/CV-005.

- Historical Cascade Vault CV-004 RED: the direct-route contract first exposed the missing `.cv` workspace; the current candidate is under D-026 CV-004/CV-005 validation.
