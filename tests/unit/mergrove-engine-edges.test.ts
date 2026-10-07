import { describe, expect, it } from 'vitest';
import {
  COMPOST_COST, SECOND_TIER_CHANCE, compostCell, createRun, mergeScore, placePiece, previewNextDraw,
  type MergroveRun,
} from '../../src/games/mergrove/engine';
import { seedRange } from './support/mergrove-sim';

type Queue = [number, number, number];

function withBoard(cells: Record<number, number>, overrides: Partial<MergroveRun> = {}): MergroveRun {
  const board = Array<number | null>(25).fill(null);
  for (const [index, tier] of Object.entries(cells)) board[Number(index)] = tier;
  return { ...createRun(11), board, ...overrides };
}

describe('Mergrove engine edge cases (src/games/mergrove)', () => {
  it('rejects placement and compost once the run is over', () => {
    const over = withBoard({}, { board: Array<number | null>(25).fill(1), sunlight: 0, gameOver: true });
    expect(() => placePiece(over, 0, 0)).toThrow('This Mergrove run is over.');
    expect(() => compostCell(over, 0)).toThrow('This Mergrove run is over.');
  });

  it('rejects composting an empty cell with the exact message', () => {
    const run = withBoard({ 0: 1 }, { sunlight: COMPOST_COST });
    expect(() => compostCell(run, 5)).toThrow('Choose an occupied cell to compost.');
    expect(() => compostCell(run, 25)).toThrow('Cell is out of range.');
  });

  it('compost changes only the cell, sunlight and gameOver', () => {
    const run = withBoard({ 0: 3, 1: 2 }, { sunlight: 6, score: 90, turns: 4, highestTier: 3, ancientBlooms: 1, queue: [1, 2, 1] as Queue });
    const next = compostCell(run, 0);
    expect(next).toEqual({ ...run, board: [null, 2, ...Array(23).fill(null)], sunlight: 6 - COMPOST_COST });
  });

  it('never mutates the input run', () => {
    const run = withBoard({ 0: 1, 1: 1 }, { queue: [1, 1, 1] as Queue });
    const before = JSON.stringify(run);
    placePiece(run, 0, 2);
    expect(JSON.stringify(run)).toBe(before);
    const rich = { ...run, sunlight: 5 };
    const beforeRich = JSON.stringify(rich);
    compostCell(rich, 0);
    expect(JSON.stringify(rich)).toBe(beforeRich);
  });

  it('replenishes only the used queue slot and counts the turn', () => {
    const run = withBoard({}, { queue: [1, 2, 1] as Queue, highestTier: 3 });
    const result = placePiece(run, 1, 12).run;
    expect(result.queue[0]).toBe(1);
    expect(result.queue[2]).toBe(1);
    expect(result.turns).toBe(run.turns + 1);
    expect(result.rngState).not.toBe(run.rngState);
  });

  it('awards max(1, size - 2) sunlight for larger groups', () => {
    const four = placePiece(withBoard({ 1: 1, 5: 1, 7: 1 }), 0, 6);
    expect(four.events[0]).toMatchObject({ size: 4, points: mergeScore(1, 4, 1) });
    expect(four.run.sunlight).toBe(2);
    const five = placePiece(withBoard({ 1: 1, 5: 1, 7: 1, 11: 1 }), 0, 6);
    expect(five.events[0].size).toBe(5);
    expect(five.run.sunlight).toBe(3);
  });

  it('rejects invalid mergeScore arguments', () => {
    expect(() => mergeScore(0, 3, 1)).toThrow('Merge tier is invalid.');
    expect(() => mergeScore(9, 3, 1)).toThrow('Merge tier is invalid.');
    expect(() => mergeScore(1, 2, 1)).toThrow('A merge needs at least three pieces.');
    expect(() => mergeScore(1, 3.5, 1)).toThrow('A merge needs at least three pieces.');
    expect(() => mergeScore(1, 3, 0)).toThrow('Chain depth must be positive.');
    expect([1, 2, 3, 4, 5, 6, 7, 8].map(tier => mergeScore(tier, 3, 1))).toEqual([30, 60, 120, 240, 480, 960, 1920, 3840]);
  });

  it('reaches an ancient bloom at the end of a three-stage cascade', () => {
    const run = withBoard({ 6: 6, 8: 6, 2: 7, 3: 7, 12: 8, 17: 8 }, { queue: [6, 1, 1] as Queue, highestTier: 8 });
    const result = placePiece(run, 0, 7);
    expect(result.events.map(event => [event.tier, event.chain, event.ancientBloom])).toEqual([[6, 1, false], [7, 2, false], [8, 3, true]]);
    expect(result.run.ancientBlooms).toBe(1);
    expect(result.run.board.every(cell => cell === null)).toBe(true);
    expect(result.run.score).toBe(mergeScore(6, 3, 1) + mergeScore(7, 3, 2) + mergeScore(8, 3, 3));
  });

  it('leaves no standing group of three during scripted pseudo-random play', () => {
    for (const seed of seedRange(40)) {
      let run = createRun(seed);
      for (let step = 0; step < 60 && !run.gameOver; step += 1) {
        const empties = run.board.flatMap((cell, index) => (cell === null ? [index] : []));
        if (empties.length === 0) break;
        run = placePiece(run, step % 3, empties[(step * 7) % empties.length]).run;
        for (let index = 0; index < 25; index += 1) {
          const tier = run.board[index];
          if (tier === null) continue;
          const seen = new Set([index]);
          const stack = [index];
          while (stack.length) {
            const at = stack.pop() as number;
            const row = Math.floor(at / 5);
            for (const next of [at - 5, at + 5, at - 1, at + 1]) {
              if (next < 0 || next > 24 || seen.has(next)) continue;
              if ((next === at - 1 || next === at + 1) && Math.floor(next / 5) !== row) continue;
              if (run.board[next] === tier) { seen.add(next); stack.push(next); }
            }
          }
          expect(seen.size).toBeLessThan(3);
        }
      }
    }
  });
});

describe('Mergrove queue draw gating and preview', () => {
  it('only draws Seeds until the run reaches Bud', () => {
    for (const seed of seedRange(300)) {
      const run = { ...createRun(seed), highestTier: 2 };
      expect(placePiece(run, 0, 0).run.queue[0]).toBe(1);
    }
  });

  it('draws Sprouts at roughly the documented 22% rate once Bud is reached', () => {
    const seeds = seedRange(4_000);
    const sprouts = seeds.filter(seed => placePiece({ ...createRun(seed), highestTier: 3 }, 0, 0).run.queue[0] === 2).length;
    expect(Math.abs(sprouts / seeds.length - SECOND_TIER_CHANCE)).toBeLessThan(0.03);
  });

  it('previews exactly the replacement the next placement will draw, without advancing the RNG', () => {
    for (const seed of seedRange(300)) {
      const run = { ...createRun(seed), highestTier: 3 };
      const before = JSON.stringify(run);
      const preview = previewNextDraw(run);
      expect(JSON.stringify(run)).toBe(before);
      expect(preview.sproutIfBud).toBe(false);
      expect(placePiece(run, 0, 0).run.queue[0]).toBe(preview.tier);
    }
  });

  it('flags a hidden Sprout before Bud and keeps the visible tier a Seed', () => {
    let flagged = 0;
    for (const seed of seedRange(300)) {
      const run = createRun(seed);
      const preview = previewNextDraw(run);
      expect(preview.tier).toBe(1);
      expect(preview.sproutIfBud).toBe(placePiece({ ...run, highestTier: 3 }, 0, 0).run.queue[0] === 2);
      if (preview.sproutIfBud) flagged += 1;
    }
    expect(flagged).toBeGreaterThan(0);
  });
});
