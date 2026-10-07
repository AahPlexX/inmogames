import { describe, expect, it } from 'vitest';
import type { MergeEvent } from '../../src/games/mergrove/engine';
import {
  ACHIEVEMENTS, CODEX, EMPTY_STATS, codexCompletion, discover, evaluateAchievements, recordCompost, recordHold, recordPlace,
  recordRunStart, recordUndo,
} from '../../src/games/mergrove/progress';

const ev = (over: Partial<MergeEvent> = {}): MergeEvent => ({ tier: 1, resultTier: 2, size: 3, chain: 1, points: 30, ancientBloom: false, bonusCell: null, ...over });

describe('lifetime stats (src/games/mergrove)', () => {
  it('starts at zero and never mutates its input', () => {
    const before = JSON.stringify(EMPTY_STATS);
    recordPlace(EMPTY_STATS, [ev()], 0);
    expect(JSON.stringify(EMPTY_STATS)).toBe(before);
    expect(Object.values(EMPTY_STATS).every(value => value === 0)).toBe(true);
  });
  it('counts a plain placement', () => {
    expect(recordPlace(EMPTY_STATS, [], 0)).toEqual({ ...EMPTY_STATS, placements: 1 });
  });
  it('counts merges, the longest chain, the largest group, blooms, sunlight and wishes', () => {
    const stats = recordPlace(EMPTY_STATS, [ev({ size: 5, chain: 1 }), ev({ tier: 2, resultTier: 3, size: 3, chain: 2 }), ev({ tier: 8, resultTier: null, size: 4, chain: 3, ancientBloom: true })], 2);
    expect(stats).toMatchObject({ placements: 1, merges: 3, longestChain: 3, largestGroup: 5, ancientBlooms: 1, wishesDone: 2, sunlightEarned: 3 + 1 + 2 });
  });
  it('awards group size minus two sunlight per stage', () => {
    expect(recordPlace(EMPTY_STATS, [ev({ size: 3 })], 0).sunlightEarned).toBe(1);
    expect(recordPlace(EMPTY_STATS, [ev({ size: 4 })], 0).sunlightEarned).toBe(2);
    expect(recordPlace(EMPTY_STATS, [ev({ size: 7 })], 0).sunlightEarned).toBe(5);
  });
  it('keeps maxima across placements instead of summing them', () => {
    let stats = recordPlace(EMPTY_STATS, [ev({ size: 6, chain: 2 })], 0);
    stats = recordPlace(stats, [ev({ size: 3, chain: 1 })], 0);
    expect(stats.largestGroup).toBe(6);
    expect(stats.longestChain).toBe(2);
    expect(stats.merges).toBe(2);
  });
  it('counts compost, hold, undo and run starts independently', () => {
    let stats = recordCompost(EMPTY_STATS);
    stats = recordHold(stats); stats = recordHold(stats);
    stats = recordUndo(stats); stats = recordRunStart(stats);
    expect(stats).toMatchObject({ compostsUsed: 1, holdsUsed: 2, undosUsed: 1, runsPlayed: 1, placements: 0 });
  });
});

describe('Herbarium (src/games/mergrove)', () => {
  it('has one original entry per tier with a botanical note', () => {
    expect(CODEX.map(entry => entry.tier)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(CODEX.every(entry => entry.name.length > 0 && entry.note.length > 40)).toBe(true);
    expect(new Set(CODEX.map(entry => entry.note)).size).toBe(8);
  });
  it('records a discovery once, sorted and de-duplicated, and reports first discoveries', () => {
    const first = discover([1], 3);
    expect(first).toEqual({ discovered: [1, 3], first: true });
    expect(discover(first.discovered, 3)).toEqual({ discovered: [1, 3], first: false });
    expect(discover([3], 1).discovered).toEqual([1, 3]);
  });
  it('rejects tiers outside 1..8 without changing the list', () => {
    expect(discover([1], 0)).toEqual({ discovered: [1], first: false });
    expect(discover([1], 9)).toEqual({ discovered: [1], first: false });
    expect(discover([1], 2.5)).toEqual({ discovered: [1], first: false });
  });
  it('reports completion against the registered entries, not a fixed 8', () => {
    expect(codexCompletion([])).toBe(0);
    expect(codexCompletion([1, 2])).toBe(2 / CODEX.length);
    expect(codexCompletion(CODEX.map(entry => entry.tier))).toBe(1);
  });
});

describe('achievements (src/games/mergrove)', () => {
  const ctx = (over: Partial<Parameters<typeof evaluateAchievements>[0]> = {}) => ({ stats: EMPTY_STATS, discovered: [1], runTurns: 0, journeyStars: {}, journeyTotal: 3, ...over });

  it('has permanent unique ids and labels', () => {
    const ids = ACHIEVEMENTS.map(a => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ACHIEVEMENTS.every(a => a.label.length > 0 && a.description.length > 0)).toBe(true);
  });
  it('unlocks nothing for a new player', () => {
    expect(evaluateAchievements(ctx(), [])).toEqual({ earned: [], unlocked: [] });
  });
  it('unlocks tier achievements from the Herbarium', () => {
    expect(evaluateAchievements(ctx({ discovered: [1, 2] }), []).unlocked).toEqual(['first-sprout']);
    expect(evaluateAchievements(ctx({ discovered: [1, 2, 3, 4, 5] }), []).unlocked).toEqual(['first-sprout', 'budding', 'bloom-keeper', 'sapling-steward']);
  });
  it('unlocks stat achievements at their thresholds and not one below', () => {
    const at = (field: string, value: number) => evaluateAchievements(ctx({ stats: { ...EMPTY_STATS, [field]: value } }), []).unlocked;
    expect(at('longestChain', 2)).not.toContain('cascade-conductor');
    expect(at('longestChain', 3)).toContain('cascade-conductor');
    expect(at('longestChain', 4)).toContain('cascade-master');
    expect(at('largestGroup', 4)).not.toContain('big-bundle');
    expect(at('largestGroup', 5)).toContain('big-bundle');
    expect(at('ancientBlooms', 1)).toContain('primordial-rebirth');
    expect(at('compostsUsed', 9)).not.toContain('tidy-gardener');
    expect(at('compostsUsed', 10)).toContain('tidy-gardener');
  });
  it('unlocks the long-run achievement from the current run length', () => {
    expect(evaluateAchievements(ctx({ runTurns: 99 }), []).unlocked).not.toContain('century-grove');
    expect(evaluateAchievements(ctx({ runTurns: 100 }), []).unlocked).toContain('century-grove');
  });
  it('is append-only: earned ids are kept in order, never re-announced, never removed', () => {
    const first = evaluateAchievements(ctx({ discovered: [1, 2] }), []);
    const again = evaluateAchievements(ctx({ discovered: [1, 2] }), first.earned);
    expect(again.unlocked).toEqual([]);
    expect(again.earned).toEqual(first.earned);
    const worse = evaluateAchievements(ctx({ discovered: [1] }), first.earned);
    expect(worse.earned).toEqual(['first-sprout']);
  });
  it('ignores unknown ids already in the earned list and keeps them out of the result', () => {
    expect(evaluateAchievements(ctx(), ['made-up']).earned).toEqual([]);
  });
  it('unlocks Journey achievements from stars: first level, a chapter of five, then every level at three stars', () => {
    const stars = (n: number, value = 1) => Object.fromEntries(Array.from({ length: n }, (_, i) => [`level-${i}`, value]));
    expect(evaluateAchievements(ctx({ journeyStars: stars(1) }), []).unlocked).toEqual(['first-steps']);
    expect(evaluateAchievements(ctx({ journeyStars: stars(5), journeyTotal: 15 }), []).unlocked).toEqual(['first-steps', 'trailblazer']);
    expect(evaluateAchievements(ctx({ journeyStars: stars(3, 2), journeyTotal: 3 }), []).unlocked).not.toContain('master-gardener');
    expect(evaluateAchievements(ctx({ journeyStars: stars(3, 3), journeyTotal: 3 }), []).unlocked).toContain('master-gardener');
    expect(evaluateAchievements(ctx({ journeyStars: stars(2, 3), journeyTotal: 3 }), []).unlocked).not.toContain('master-gardener');
  });
});
