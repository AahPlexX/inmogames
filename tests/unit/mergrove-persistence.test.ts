import { describe, expect, it } from 'vitest';
import { createRun, placePiece } from '../../src/games/mergrove/engine';
import { decodeMergroveSave, mergroveSaveDefinition } from '../../src/games/mergrove/persistence';

describe('Mergrove persistence', () => {
  it('declares the stable v1 save contract', () => {
    expect(mergroveSaveDefinition).toMatchObject({
      slug: 'mergrove', schemaVersion: 1, storageKey: 'inmogames:mergrove:v1',
      initial: { bestScore: 0, bestTier: 1, activeRun: null },
    });
  });

  it('accepts a valid durable run and rejects malformed state', () => {
    let run = createRun(99);
    run = placePiece(run, 0, 0).run;
    const valid = { bestScore: 120, bestTier: 3, activeRun: { ...run, highestTier: 3 } };
    expect(decodeMergroveSave(valid)).toEqual(valid);
    expect(decodeMergroveSave(null)).toBeNull();
    expect(decodeMergroveSave({ bestScore: -1, bestTier: 1, activeRun: null })).toBeNull();
    expect(decodeMergroveSave({ bestScore: 0, bestTier: 9, activeRun: null })).toBeNull();
    expect(decodeMergroveSave({ bestScore: 0, bestTier: 2, activeRun: { ...run, highestTier: 3 } })).toBeNull();
    expect(decodeMergroveSave({ bestScore: 0, bestTier: 3, activeRun: { ...run, board: run.board.slice(0, 24), highestTier: 3 } })).toBeNull();
    expect(decodeMergroveSave({ bestScore: 0, bestTier: 3, activeRun: { ...run, queue: [1, 3, 1], highestTier: 3 } })).toBeNull();
    expect(decodeMergroveSave({ bestScore: 0, bestTier: 3, activeRun: { ...run, gameOver: true, highestTier: 3 } })).toBeNull();
  });
});
