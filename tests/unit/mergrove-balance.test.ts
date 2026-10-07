import { describe, expect, it } from 'vitest';
import { createRun } from '../../src/games/mergrove/engine';
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
  });

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
  });

  it('shows measurable skill: lookahead out-scores greedy on the same seeds', () => {
    const seeds = seedRange(24);
    expect(simulate(lookaheadBot, seeds).medianScore).toBeGreaterThan(simulate(greedyBot, seeds).medianScore * 3);
  });

  it('plays a full run through the pure engine only', () => {
    const summary = playRun(greedyBot, 4242);
    expect(summary.turns).toBeGreaterThan(0);
    expect(createRun(4242).turns).toBe(0);
  });
});
