import { describe, expect, it } from 'vitest';
import { compostCell, connectedGroup, createRun, isRunOver, placePiece } from '../../src/games/mergrove/engine';
import { CLASSIC_5, CROSSROADS_6, STANDARD_6 } from '../../src/games/mergrove/layout';
import { seedRange } from './support/mergrove-sim';

describe('Mergrove engine on other layouts (src/games/mergrove)', () => {
  it('creates a board sized to the layout', () => {
    expect(createRun(3, STANDARD_6).board).toHaveLength(36);
    expect(createRun(3, CROSSROADS_6).board).toHaveLength(36);
    expect(createRun(3, CROSSROADS_6).board.every(cell => cell === null)).toBe(true);
  });

  it('is byte-identical to the default path when classic-5 is passed explicitly', () => {
    for (const seed of seedRange(25)) {
      let implicit = createRun(seed);
      let explicit = createRun(seed, CLASSIC_5);
      expect(explicit).toEqual(implicit);
      for (let step = 0; step < 30 && !implicit.gameOver; step += 1) {
        const empties = implicit.board.flatMap((cell, index) => (cell === null ? [index] : []));
        const cell = empties[(step * 5) % empties.length];
        implicit = placePiece(implicit, step % 3, cell).run;
        explicit = placePiece(explicit, step % 3, cell, CLASSIC_5).run;
        expect(explicit).toEqual(implicit);
      }
    }
  });

  it('merges a trio across a row on standard-6 and does not wrap at the right edge', () => {
    let run = createRun(8, STANDARD_6);
    run = placePiece(run, 0, 4, STANDARD_6).run;
    run = placePiece(run, 0, 5, STANDARD_6).run;
    run = placePiece(run, 0, 6, STANDARD_6).run; // cell 6 starts the next row; 5 and 6 are not neighbors
    expect(run.board.filter(cell => cell !== null)).toHaveLength(3);
    expect(run.score).toBe(0);
    const merged = placePiece(run, 0, 3, STANDARD_6);
    expect(merged.run.board[3]).toBe(2);
    expect(merged.run.board[4]).toBeNull();
    expect(merged.run.board[5]).toBeNull();
    expect(merged.run.board[6]).toBe(1);
    expect(merged.run.score).toBe(30);
  });

  it('finds groups using layout neighbors', () => {
    const board = Array<number | null>(36).fill(null);
    board[5] = 1; board[11] = 1; board[6] = 1;
    expect(connectedGroup(board, 5, 1, STANDARD_6).sort((a, b) => a - b)).toEqual([5, 11]);
  });

  it('rejects placing on a blocked cell and a board of the wrong length', () => {
    const run = createRun(2, CROSSROADS_6);
    expect(() => placePiece(run, 0, 0, CROSSROADS_6)).toThrow('That cell is not part of this board.');
    expect(() => placePiece(run, 0, 36, CROSSROADS_6)).toThrow('Cell is out of range.');
    expect(() => placePiece(run, 0, 0, CLASSIC_5)).toThrow('Board must contain 25 cells.');
  });

  it('counts only playable cells toward a full board', () => {
    const board = Array<number | null>(36).fill(null);
    CROSSROADS_6.playable.forEach((open, index) => { if (open) board[index] = 1; });
    expect(isRunOver(board, 0, CROSSROADS_6)).toBe(true);
    expect(isRunOver(board, 4, CROSSROADS_6)).toBe(false);
    board[7] = null;
    expect(isRunOver(board, 0, CROSSROADS_6)).toBe(false);
  });

  it('keeps compost working on a shaped board', () => {
    const board = Array<number | null>(36).fill(null);
    CROSSROADS_6.playable.forEach((open, index) => { if (open) board[index] = 1; });
    const run = { ...createRun(4, CROSSROADS_6), board, sunlight: 4 };
    expect(compostCell(run, 7, CROSSROADS_6).board[7]).toBeNull();
    expect(() => compostCell(run, 0, CROSSROADS_6)).toThrow('Choose an occupied cell to compost.');
  });
});
