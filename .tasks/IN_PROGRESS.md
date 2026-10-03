# In progress

## GAME-001: Threefold
**Priority:** P0 | **Tags:** first-game, puzzle, reference-implementation

Approved 2026-10-03. Its engine TDD contract is established and remains active. Continue from the red engine test commit; do not let its spec/tracker drift.

## GAME-002: Royal Palace Blackjack
**Priority:** P0 | **Tags:** card-board, blackjack, production-game

Approved from the user's Royal Palace Blackjack prototype on 2026-10-03. Convert the concept into the independent multi-file game defined by `docs/specs/2026-10-03-royal-palace-blackjack-design.md`. Use the prototype as visual/product direction, not as a single-file implementation. TDD applies to rules, shoe, persistence and strategy behavior.

Repository-level deployment remains separately blocked by TASK-001 (enable GitHub Pages source = GitHub Actions).
