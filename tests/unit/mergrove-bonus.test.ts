import { describe, expect, it } from 'vitest';
import { createRun, placePiece, type MergroveRun } from '../../src/games/mergrove/engine';
import { CLASSIC_5 } from '../../src/games/mergrove/layout';
import { RULESET_V1, RULESET_V2, replayRun, resolveRuleset, rulesOf } from '../../src/games/mergrove/ruleset';

type Queue = [number, number, number];
function board(cells: Record<number, number>, extra: Partial<MergroveRun> = {}): MergroveRun {
  const b = Array<number | null>(25).fill(null);
  for (const [i, t] of Object.entries(cells)) b[Number(i)] = t;
  return { ...createRun(31), board: b, queue: [1, 1, 1] as Queue, ...extra };
}
const v2 = rulesOf(RULESET_V2);

describe('Mergrove ruleset v2: large-group bonus (src/games/mergrove)', () => {
  it('registers v2 next to the frozen v1', () => {
    expect(resolveRuleset('v2')).toBe(RULESET_V2);
    expect(Object.isFrozen(RULESET_V2)).toBe(true);
    expect(RULESET_V1.largeGroupBonus).toBe(false);
    expect(RULESET_V2.largeGroupBonus).toBe(true);
  });

  it('leaves a trio and a group of four exactly as v1 does', () => {
    const four = board({ 1: 1, 5: 1, 7: 1 });
    expect(placePiece(four, 0, 6, CLASSIC_5, v2)).toEqual(placePiece(four, 0, 6, CLASSIC_5));
    const trio = board({ 5: 1, 7: 1 });
    expect(placePiece(trio, 0, 6, CLASSIC_5, v2)).toEqual(placePiece(trio, 0, 6, CLASSIC_5));
  });

  it('adds one extra result piece beside the anchor for a group of five', () => {
    const run = board({ 1: 1, 5: 1, 7: 1, 11: 1 });
    const result = placePiece(run, 0, 6, CLASSIC_5, v2);
    expect(result.run.board[6]).toBe(2);
    expect(result.run.board[1]).toBe(2); // lowest-index group cell adjacent to the anchor
    expect(result.run.board.filter(c => c !== null)).toHaveLength(2);
    expect(result.events[0]).toMatchObject({ size: 5, resultTier: 2, bonusCell: 1, points: 50 });
    expect(result.run.sunlight).toBe(3);
    expect(placePiece(run, 0, 6).run.board.filter(c => c !== null)).toHaveLength(1); // v1 baseline
  });

  it('feeds the bonus piece into the cascade when it completes another group', () => {
    const run = board({ 1: 1, 5: 1, 7: 1, 11: 1, 0: 2 });
    const result = placePiece(run, 0, 6, CLASSIC_5, v2);
    // bonus Sprout at 1 touches the Sprout at 0 and the anchor at 6: group of three -> Bud
    expect(result.events.map(e => [e.tier, e.size, e.chain])).toEqual([[1, 5, 1], [2, 3, 2]]);
    expect(result.run.board[6]).toBe(3);
    expect(result.run.board.filter(c => c !== null)).toHaveLength(1);
  });

  it('records a null bonus cell for ordinary merges', () => {
    const result = placePiece(board({ 5: 1, 7: 1 }), 0, 6, CLASSIC_5, v2);
    expect(result.events[0].bonusCell).toBeNull();
  });

  it('gives no bonus to an ancient bloom of five Grovehearts', () => {
    const run = board({ 1: 8, 5: 8, 7: 8, 11: 8 }, { highestTier: 8, queue: [8, 1, 1] as Queue });
    const result = placePiece(run, 0, 6, CLASSIC_5, v2);
    expect(result.events[0]).toMatchObject({ ancientBloom: true, bonusCell: null });
    expect(result.run.board.every(c => c === null)).toBe(true);
  });

  it('never leaves a standing group of three over scripted play', () => {
    for (let seed = 1; seed <= 40; seed += 1) {
      let run = createRun(seed * 7919);
      for (let step = 0; step < 80 && !run.gameOver; step += 1) {
        const empties = run.board.flatMap((c, i) => (c === null ? [i] : []));
        if (empties.length === 0) break;
        run = placePiece(run, step % 3, empties[(step * 5 + seed) % empties.length], CLASSIC_5, v2).run;
        run.board.forEach((tier, index) => {
          if (tier === null) return;
          const seen = new Set([index]); const stack = [index];
          while (stack.length) {
            const at = stack.pop() as number;
            for (const next of CLASSIC_5.adjacency[at]) if (!seen.has(next) && run.board[next] === tier) { seen.add(next); stack.push(next); }
          }
          expect(seen.size).toBeLessThan(3);
        });
      }
    }
  });

  it('replays under v2 deterministically and differs from v1 once a five-group forms', () => {
    const seed = 777;
    const actions = [1, 5, 7, 11, 6].map(cellIndex => ({ kind: 'place' as const, queueIndex: 0, cellIndex }));
    const a = replayRun(seed, 'v2', actions); const b = replayRun(seed, 'v2', actions); const one = replayRun(seed, 'v1', actions);
    expect(a).toEqual(b);
    expect(a.ok && one.ok && a.run.board.filter(c => c !== null).length).toBe(2);
    expect(a.ok && one.ok && one.run.board.filter(c => c !== null).length).toBe(1);
  });

  it('keeps the released v1 goldens untouched', () => {
    expect(replayRun(20261007, 'v1', [{ kind: 'place', queueIndex: 0, cellIndex: 0 }]).ok).toBe(true);
  });
});
