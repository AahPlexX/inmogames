import { describe, expect, it } from 'vitest';
import {
  BOARD_CELLS, COMPOST_COST, MAX_TIER, compostCell, connectedGroup, createRun,
  isRunOver, mergeScore, placePiece,
} from '../../src/games/mergrove/engine';

describe('Mergrove engine', () => {
  it('creates deterministic 5 by 5 runs with a three-piece queue', () => {
    const run = createRun(123456);
    expect(BOARD_CELLS).toBe(25);
    expect(COMPOST_COST).toBe(4);
    expect(MAX_TIER).toBe(8);
    expect(run.board).toHaveLength(25);
    expect(run.queue).toEqual([1, 1, 1]);
    expect(createRun(123456)).toEqual(run);
  });

  it('finds only orthogonally connected matching pieces', () => {
    const board = Array<number | null>(25).fill(null);
    board[0] = 1; board[1] = 1; board[5] = 1; board[6] = 1; board[12] = 1;
    expect(connectedGroup(board, 0, 1).sort((a, b) => a - b)).toEqual([0, 1, 5, 6]);
  });

  it('merges a connected trio at the placement cell and awards sunlight', () => {
    let run = createRun(42);
    run = placePiece(run, 0, 0).run;
    run = placePiece(run, 0, 1).run;
    const result = placePiece(run, 0, 2);
    expect(result.run.board.slice(0, 3)).toEqual([null, null, 2]);
    expect(result.run.score).toBe(30);
    expect(result.run.sunlight).toBe(1);
    expect(result.events).toMatchObject([{ tier: 1, resultTier: 2, size: 3, chain: 1, points: 30, ancientBloom: false }]);
  });

  it('resolves a newly-created matching tier as a scored cascade', () => {
    const board = Array<number | null>(25).fill(null);
    board[1] = 2; board[7] = 2; board[5] = 1; board[11] = 1;
    const run = { ...createRun(9), board, queue: [1, 1, 1] as [number, number, number], highestTier: 2 };
    const result = placePiece(run, 0, 6);
    expect(result.events).toHaveLength(2);
    expect(result.run.board[6]).toBe(3);
    expect(result.run.score).toBe(150);
    expect(result.run.sunlight).toBe(2);
    expect(result.run.highestTier).toBe(3);
  });

  it('clears a tier-eight ancient bloom instead of inventing a ninth tier', () => {
    const board = Array<number | null>(25).fill(null);
    board[0] = 8; board[1] = 8;
    const run = { ...createRun(7), board, queue: [8, 1, 1] as [number, number, number], highestTier: 8 };
    const result = placePiece(run, 0, 2);
    expect(result.run.board.slice(0, 3)).toEqual([null, null, null]);
    expect(result.run.ancientBlooms).toBe(1);
    expect(result.events[0]).toMatchObject({ tier: 8, resultTier: null, ancientBloom: true });
  });

  it('keeps a full board recoverable only when compost sunlight is available', () => {
    const full = Array<number | null>(25).fill(1);
    expect(isRunOver(full, 3)).toBe(true);
    expect(isRunOver(full, 4)).toBe(false);
    const run = { ...createRun(5), board: full, sunlight: 4 };
    const recovered = compostCell(run, 0);
    expect(recovered.board[0]).toBeNull();
    expect(recovered.sunlight).toBe(0);
    expect(recovered.gameOver).toBe(false);
  });

  it('rejects invalid placement and compost actions', () => {
    expect(() => placePiece(createRun(1), 3, 0)).toThrow(/queue/i);
    expect(() => placePiece(createRun(1), 0, 25)).toThrow(/cell/i);
    expect(() => placePiece({ ...createRun(1), board: [1, ...Array(24).fill(null)] }, 0, 0)).toThrow(/empty/i);
    expect(() => compostCell({ ...createRun(1), board: [1, ...Array(24).fill(null)] }, 0)).toThrow(/sunlight/i);
    expect(mergeScore(2, 3, 2)).toBe(120);
  });
});
