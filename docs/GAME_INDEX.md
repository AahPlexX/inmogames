# Game index

One row per game. Update when a game is added, changes status, or is removed.

| Slug | Name | Category | Players | Storage | Status |
| --- | --- | --- | --- | --- | --- |
| `threefold` | Threefold | puzzle | single | localStorage (guest), Firestore (account) | verified game; account saves emulator-verified, live Firebase setup blocked by TASK-003 |
| `royal-palace-blackjack` | Royal Palace Blackjack | card-board | single | localStorage (guest), Firestore (account) | verified game; 2026-10-09 table-experience/viewport/motion polish passed full validation and Pages deployment in run `37994433846`; live Firebase setup blocked by TASK-003 |
| `mergrove` | Mergrove | puzzle | single | localStorage (guest), Firestore (account) | verified game v1; engine/UI/persistence/account-emulator/Pages evidence green in run `37553471015`; v2 Campaign/power-up progression design approved but implementation not started pending written-spec review; live Firebase setup blocked by TASK-003 |
| `cloudline-couriers` | Cloudline Couriers | strategy | single | localStorage (guest), Firestore (account) | implementing expanded long-form scope; schema-v1 persistence verified; current vector/browser regression baseline passed full dependency-maintenance validation in run `37859097164`; broader campaign-quality art/progression remains open |
| `royal-fortune-slots` | Royal Fortune Slots | arcade | single | localStorage (guest), Firestore (account) | verified game; exact probability, persistence, accessibility/responsive browser validation, both builds and Pages deployment passed on functional revision `e89b9c64eada44a4a5953c17072d57b7d940b4d2` in run `38090041520`; live Firebase setup blocked by TASK-003 |
