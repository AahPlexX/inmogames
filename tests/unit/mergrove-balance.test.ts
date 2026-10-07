import { describe, expect, it } from 'vitest';

// Two-ply simulations take ~3s locally; CI machines can be several times slower, so give them room.
const SLOW = 60_000;
import { createRun } from '../../src/games/mergrove/engine';
import { CLASSIC_5, CROSSROADS_6, STANDARD_6 } from '../../src/games/mergrove/layout';
import { RULESET_V1, RULESET_V2 } from '../../src/games/mergrove/ruleset';
import { greedyBot, lookaheadBot, playRun, seedRange, simulate } from './support/mergrove-sim';

/**
 * MER-018 drift gate for src/games/mergrove, ruleset "v1" on the classic 5x5 board.
 * Ranges were set from a measured baseline (see TRACKER.md) with generous margins. A failure means a
 * rules or balance change moved a released configuration and must be reviewed deliberately.
 */
describe('Mergrove balance simulation (MER-018)', () => {
  it('is reproducible for a fixed seed list', () => {
    const seeds = seedRange(5);
    expect(simulate(lookaheadBot, seeds)).toEqual(simulate(lookaheadBot, seeds));
  }, SLOW);

  it('always terminates: no run hits the action cap', () => {
    const summary = simulate(greedyBot, seedRange(150));
    expect(summary.capped).toBe(0);
  });

  it('keeps the greedy baseline in its measured range', () => {
    const summary = simulate(greedyBot, seedRange(150));
    expect(summary.turns.median).toBeGreaterThanOrEqual(25);
    expect(summary.turns.median).toBeLessThanOrEqual(120);
    expect(summary.reach[1]).toBe(1);
    expect(summary.bloomsPerRun).toBe(0);
  });

  it('keeps the two-ply bot within the target skill-expression range', () => {
    const summary = simulate(lookaheadBot, seedRange(24));
    expect(summary.capped).toBe(0);
    expect(summary.turns.median).toBeGreaterThanOrEqual(120);
    expect(summary.turns.median).toBeLessThanOrEqual(600);
    expect(summary.reach[2]).toBe(1);           // Bud is always reachable
    expect(summary.reach[3]).toBeGreaterThanOrEqual(0.8); // Bloom is the common ceiling
    expect(summary.reach[4]).toBeGreaterThan(0.1); // Sapling is a real, skill-gated goal
    expect(summary.compostsPerRun).toBeGreaterThan(5);
  }, SLOW);

  it('shows measurable skill: lookahead out-scores greedy on the same seeds', () => {
    const seeds = seedRange(24);
    expect(simulate(lookaheadBot, seeds).medianScore).toBeGreaterThan(simulate(greedyBot, seeds).medianScore * 3);
  }, SLOW);

  it.each([['standard-6', STANDARD_6], ['crossroads-6', CROSSROADS_6]])(
    'keeps %s playable and longer-lived than classic-5 for the two-ply bot',
    (_id, layout) => {
      const seeds = seedRange(8);
      const classic = simulate(lookaheadBot, seeds, undefined, CLASSIC_5);
      const bigger = simulate(lookaheadBot, seeds, undefined, layout);
      expect(bigger.capped).toBe(0);
      expect(bigger.reach[2]).toBe(1); // Bud is always reachable
      expect(bigger.reach[3]).toBeGreaterThanOrEqual(0.8); // so is Bloom
      expect(bigger.turns.median).toBeGreaterThan(classic.turns.median);
      expect(bigger.turns.median).toBeLessThanOrEqual(900);
    },
    SLOW,
  );

  it('ruleset v2 (large-group bonus) improves mid-game reach on classic-5 without breaking termination', () => {
    const seeds = seedRange(24);
    const v1 = simulate(lookaheadBot, seeds, undefined, CLASSIC_5, RULESET_V1);
    const v2 = simulate(lookaheadBot, seeds, undefined, CLASSIC_5, RULESET_V2);
    expect(v2.capped).toBe(0);
    expect(v2.reach[3]).toBeGreaterThanOrEqual(0.95); // Bloom
    expect(v2.reach[4]).toBeGreaterThan(v1.reach[4]); // Sapling gets easier, measured 0.38 -> 0.50
    expect(v2.medianScore).toBeGreaterThan(v1.medianScore);
  }, SLOW);

  it('plays a full run through the pure engine only', () => {
    const summary = playRun(greedyBot, 4242);
    expect(summary.turns).toBeGreaterThan(0);
    expect(createRun(4242).turns).toBe(0);
  });
});
