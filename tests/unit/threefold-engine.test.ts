import { describe, expect, it } from 'vitest';
import {
  createRun,
  findSolutions,
  scoreRound,
  submitSelection,
  type ThreefoldRun,
} from '../../src/games/threefold/engine';

describe('Threefold engine', () => {
  it('generates deterministic, solvable rounds for a fixed seed', () => {
    const first = createRun(20261003);
    const second = createRun(20261003);

    expect(first).toEqual(second);
    expect(first.rounds).toHaveLength(5);
    for (const round of first.rounds) {
      expect(round.tiles).toHaveLength(9);
      expect(new Set(round.tiles).size).toBe(9);
      expect(findSolutions(round).length).toBeGreaterThan(0);
    }
  });

  it('accepts any valid trio rather than a hidden authored solution', () => {
    const run: ThreefoldRun = {
      seed: 1,
      roundIndex: 0,
      totalScore: 0,
      rounds: [
        { tiles: [1, 2, 3, 4, 5, 6, 7, 8, 9], target: 15, misses: 0, earned: null },
        { tiles: [1, 2, 3, 4, 5, 6, 7, 8, 9], target: 6, misses: 0, earned: null },
        { tiles: [1, 2, 3, 4, 5, 6, 7, 8, 9], target: 6, misses: 0, earned: null },
        { tiles: [1, 2, 3, 4, 5, 6, 7, 8, 9], target: 6, misses: 0, earned: null },
        { tiles: [1, 2, 3, 4, 5, 6, 7, 8, 9], target: 6, misses: 0, earned: null },
      ],
    };

    expect(submitSelection(run, [1, 5, 9]).correct).toBe(true);
    expect(submitSelection(run, [2, 6, 7]).correct).toBe(true);
  });

  it('penalizes misses by 20 points with a 20 point floor', () => {
    expect(scoreRound(0)).toBe(100);
    expect(scoreRound(1)).toBe(80);
    expect(scoreRound(4)).toBe(20);
    expect(scoreRound(99)).toBe(20);
  });

  it('rejects incomplete, duplicate, and non-board selections', () => {
    const run = createRun(42);
    const round = run.rounds[0];

    expect(() => submitSelection(run, round.tiles.slice(0, 2))).toThrow(/three distinct/i);
    expect(() => submitSelection(run, [round.tiles[0], round.tiles[0], round.tiles[1]])).toThrow(/three distinct/i);
    expect(() => submitSelection(run, [round.tiles[0], round.tiles[1], 999])).toThrow(/board/i);
  });

  it('completes exactly five rounds and accumulates earned score', () => {
    let run = createRun(77);

    for (let index = 0; index < 5; index += 1) {
      const solution = findSolutions(run.rounds[run.roundIndex])[0];
      const result = submitSelection(run, solution);
      expect(result.correct).toBe(true);
      run = result.run;
    }

    expect(run.roundIndex).toBe(5);
    expect(run.totalScore).toBe(500);
  });
});
