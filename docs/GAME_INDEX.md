# Game index

One row per game. Update when a game is added, changes status, or is removed.

| Slug | Name | Category | Players | Storage | Status |
| --- | --- | --- | --- | --- | --- |
| `threefold` | Threefold | puzzle | single | localStorage (guest), Firestore (account) | verified game; account saves emulator-verified, live Firebase setup blocked by TASK-003 |
| `royal-palace-blackjack` | Royal Palace Blackjack | card-board | single | localStorage (guest), Firestore (account) | verified game; 2026-10-09 table-experience/viewport/motion polish passed full validation and Pages deployment in run `37994433846`; live Firebase setup blocked by TASK-003 |
| `mergrove` | Mergrove | puzzle | single | localStorage (guest), Firestore (account) | verified game v1; engine/UI/persistence/account-emulator/Pages evidence green in run `37553471015`; v2 expansion remains separately gated; live Firebase setup blocked by TASK-003 |
| `cloudline-couriers` | Cloudline Couriers | strategy | single | localStorage (guest), Firestore (account) | implementing expanded long-form scope; schema-v1 persistence verified; current regression baseline passed run `37859097164`; broader campaign-quality art/progression remains open |
| `royal-fortune-slots` | Royal Fortune Slots | arcade | single | localStorage (guest), Firestore (account) | verified game; exact probability, persistence, responsive/accessibility browser validation, builds and Pages passed on `e89b9c64eada44a4a5953c17072d57b7d940b4d2` / run `38090041520`; live Firebase setup blocked by TASK-003 |
| `lucky-seven-classic` | Lucky Seven Classic | arcade | single | localStorage (guest), Firestore (account) | implementing; engine/probability and schema-v1 persistence are green through `a72d095e3569b056b211803335e6b6d401e048bb` / run `38099724416`; consolidated playable-cabinet browser TDD is opening before route integration; final release gates remain open; live Firebase setup blocked by TASK-003 |
