import assert from 'node:assert/strict';
import { checkGameDocChangeSet } from './game-doc-sync-core.mjs';

const context = {
  slugs: ['mergrove'],
  specPathFor: () => 'docs/specs/2026-10-06-mergrove-design.md',
  indexLineChanged: () => false,
  testTouchesGame: () => false,
};

const splitProblems = checkGameDocChangeSet({
  label: 'push',
  changedPaths: [
    'src/games/mergrove/TRACKER.md',
    'docs/specs/2026-10-06-mergrove-design.md',
  ],
  ...context,
});

assert.deepEqual(splitProblems, [], 'a push containing both synchronized documents must pass even when they arrived in separate commits');
console.log('game-doc-sync regression: OK');
