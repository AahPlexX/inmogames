import { describe, expect, it } from 'vitest';
import { createRun } from '../../src/games/mergrove/engine';
import { decodeMergroveSave } from '../../src/games/mergrove/persistence';

const base = createRun(77);
const save = (run: unknown, bestTier = 8) => ({ bestScore: 0, bestTier, activeRun: run });

describe('Mergrove v1 decoder edge cases (src/games/mergrove)', () => {
  it('accepts a fresh run and the initial empty save', () => {
    expect(decodeMergroveSave(save(base))).toEqual(save(base));
    expect(decodeMergroveSave({ bestScore: 0, bestTier: 1, activeRun: null })).toEqual({ bestScore: 0, bestTier: 1, activeRun: null });
  });

  it.each([
    ['seed 0', { seed: 0 }],
    ['seed above uint32', { seed: 0x1_0000_0000 }],
    ['fractional seed', { seed: 1.5 }],
    ['rngState 0', { rngState: 0 }],
    ['rngState above uint32', { rngState: 0x1_0000_0000 }],
    ['non-integer board cell', { board: [1.5, ...Array(24).fill(null)] }],
    ['tier 0 board cell', { board: [0, ...Array(24).fill(null)] }],
    ['tier 9 board cell', { board: [9, ...Array(24).fill(null)], highestTier: 8 }],
    ['board tier above highestTier', { board: [4, ...Array(24).fill(null)] }],
    ['Sprout in queue before Bud', { queue: [1, 2, 1] }],
    ['queue of length 2', { queue: [1, 1] }],
    ['negative turns', { turns: -1 }],
    ['fractional turns', { turns: 1.5 }],
    ['negative ancientBlooms', { ancientBlooms: -1 }],
    ['negative sunlight', { sunlight: -1 }],
    ['negative score', { score: -5 }],
    ['non-boolean gameOver', { gameOver: 'false' }],
  ])('rejects %s', (_label, patch) => {
    expect(decodeMergroveSave(save({ ...base, ...patch }))).toBeNull();
  });

  it('drops unknown fields instead of trusting them', () => {
    const decoded = decodeMergroveSave(save({ ...base, injected: 'x' }));
    expect(decoded?.activeRun).toEqual(base);
    expect(decoded?.activeRun).not.toHaveProperty('injected');
  });

  it('accepts a Sprout in the queue once the run has reached Bud', () => {
    const run = { ...base, highestTier: 3, queue: [1, 2, 1] };
    expect(decodeMergroveSave(save(run, 3))?.activeRun?.queue).toEqual([1, 2, 1]);
  });
});
