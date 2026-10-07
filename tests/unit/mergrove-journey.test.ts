import { describe, expect, it } from 'vitest';
import { normalizeSeed } from '../../src/games/mergrove/engine';
import { CLASSIC_5, resolveLayout } from '../../src/games/mergrove/layout';
import {
  CHAPTERS, LEVELS, evaluateLevel, isUnlocked, levelById, nextLevel, recordClear, startLevel, starsFor, type LevelDefinition,
} from '../../src/games/mergrove/journey';
import { newPlay } from '../../src/games/mergrove/play';
import { resolveRuleset } from '../../src/games/mergrove/ruleset';
import { lookaheadBot, playLevel, seedRange } from './support/mergrove-sim';

const sample: LevelDefinition = {
  id: 'sample', chapter: 'test', name: 'Sample', blurb: 'x', layoutId: 'classic-5', rulesetId: 'v2', seed: 5, startingBoard: null,
  goal: { kind: 'reach-tier', tier: 3, within: 20 }, stars: { two: 15, three: 10 },
};

describe('Journey structure (src/games/mergrove)', () => {
  it('is 15 levels in 5 chapters of 3, linear and uniquely identified', () => {
    expect(LEVELS).toHaveLength(15);
    expect(CHAPTERS).toHaveLength(5);
    expect(new Set(LEVELS.map(l => l.id)).size).toBe(15);
    expect(CHAPTERS.map(c => LEVELS.filter(l => l.chapter === c.id).length)).toEqual([3, 3, 3, 3, 3]);
    expect(LEVELS.map(l => l.chapter)).toEqual(CHAPTERS.flatMap(c => [c.id, c.id, c.id]));
  });
  it('references only released layouts and rulesets, and legal starting boards', () => {
    const problems = LEVELS.flatMap((level) => {
      const layout = resolveLayout(level.layoutId);
      const found: string[] = [];
      if (!layout) found.push(`${level.id}: unknown layout ${level.layoutId}`);
      if (!resolveRuleset(level.rulesetId)) found.push(`${level.id}: unknown ruleset ${level.rulesetId}`);
      if (level.startingBoard && layout) {
        if (level.startingBoard.length !== layout.width * layout.height) found.push(`${level.id}: starting board has the wrong length`);
        if (!level.startingBoard.every((c, i) => c === null || (layout.playable[i] && c >= 1 && c <= 8))) found.push(`${level.id}: starting board has a spirit on a blocked cell or an invalid tier`);
      }
      return found;
    });
    expect(problems).toEqual([]);
  });
  it('starts no level with a standing group of three', () => {
    const standing = LEVELS.filter((level) => {
      const layout = resolveLayout(level.layoutId) ?? CLASSIC_5;
      const board = level.startingBoard ?? [];
      return board.some((tier, i) => tier !== null && layout.adjacency[i].filter(n => board[n] === tier).length >= 2);
    }).map(level => level.id);
    expect(standing).toEqual([]);
  });
  it('has ordered star thresholds that make sense for the goal', () => {
    const bad = LEVELS.filter(level => !(level.stars.three < level.stars.two && level.stars.two <= level.goal.within)).map(level => level.id);
    expect(bad).toEqual([]);
  });
  it('looks levels up by id', () => {
    expect(levelById(LEVELS[0].id)).toBe(LEVELS[0]);
    expect(levelById('nope')).toBeNull();
  });
});

describe('Journey progression', () => {
  it('unlocks the first level always and each next level only after the previous is cleared', () => {
    expect(isUnlocked(LEVELS[0].id, {})).toBe(true);
    expect(isUnlocked(LEVELS[1].id, {})).toBe(false);
    expect(isUnlocked(LEVELS[1].id, { [LEVELS[0].id]: 1 })).toBe(true);
    expect(isUnlocked(LEVELS[2].id, { [LEVELS[0].id]: 3 })).toBe(false); // clearing level 1 does not skip level 2
    expect(isUnlocked('nope', {})).toBe(false);
  });
  it('points at the first unfinished level, then at nothing after the last', () => {
    expect(nextLevel({})?.id).toBe(LEVELS[0].id);
    expect(nextLevel({ [LEVELS[0].id]: 2 })?.id).toBe(LEVELS[1].id);
    expect(nextLevel(Object.fromEntries(LEVELS.map(l => [l.id, 1])))).toBeNull();
  });
  it('keeps the best stars and never lowers them', () => {
    expect(recordClear({}, 'a', 2)).toEqual({ a: 2 });
    expect(recordClear({ a: 3 }, 'a', 1)).toEqual({ a: 3 });
    expect(recordClear({ a: 1 }, 'a', 3)).toEqual({ a: 3 });
    expect(recordClear({ a: 1 }, 'b', 2)).toEqual({ a: 1, b: 2 });
  });
  it('rejects star values outside 1..3', () => {
    expect(() => recordClear({}, 'a', 0)).toThrow(/star/i);
    expect(() => recordClear({}, 'a', 4)).toThrow(/star/i);
  });
});

describe('Journey goals', () => {
  const play = () => newPlay({ seed: 5, rulesetId: 'v2', layoutId: 'classic-5', mode: 'journey', wishes: false });

  it('is in progress at the start', () => {
    expect(evaluateLevel(sample, play().run)).toEqual({ status: 'playing', stars: 0, remaining: 20 });
  });
  it('wins on reaching the tier and awards stars by how quickly', () => {
    const base = play().run;
    expect(evaluateLevel(sample, { ...base, highestTier: 3, turns: 9 })).toMatchObject({ status: 'won', stars: 3 });
    expect(evaluateLevel(sample, { ...base, highestTier: 3, turns: 10 })).toMatchObject({ status: 'won', stars: 3 });
    expect(evaluateLevel(sample, { ...base, highestTier: 3, turns: 11 })).toMatchObject({ status: 'won', stars: 2 });
    expect(evaluateLevel(sample, { ...base, highestTier: 3, turns: 15 })).toMatchObject({ status: 'won', stars: 2 });
    expect(evaluateLevel(sample, { ...base, highestTier: 3, turns: 16 })).toMatchObject({ status: 'won', stars: 1 });
    expect(evaluateLevel(sample, { ...base, highestTier: 3, turns: 20 })).toMatchObject({ status: 'won', stars: 1 });
  });
  it('loses when the deadline passes or the run ends without the goal', () => {
    const base = play().run;
    expect(evaluateLevel(sample, { ...base, turns: 20 })).toMatchObject({ status: 'lost', stars: 0 });
    expect(evaluateLevel(sample, { ...base, turns: 7, gameOver: true })).toMatchObject({ status: 'lost' });
    expect(evaluateLevel(sample, { ...base, turns: 19 })).toMatchObject({ status: 'playing', remaining: 1 });
  });
  it('supports score goals where more points earn more stars', () => {
    const scoreLevel: LevelDefinition = { ...sample, goal: { kind: 'reach-score', score: 500, within: 30 }, stars: { two: 20, three: 12 } };
    const base = play().run;
    expect(evaluateLevel(scoreLevel, { ...base, score: 500, turns: 12 })).toMatchObject({ status: 'won', stars: 3 });
    expect(evaluateLevel(scoreLevel, { ...base, score: 499, turns: 12 })).toMatchObject({ status: 'playing' });
  });
  it('supports bloom-count and sunlight-free goals', () => {
    const bloom: LevelDefinition = { ...sample, goal: { kind: 'ancient-blooms', count: 1, within: 99 }, stars: { two: 60, three: 40 } };
    expect(evaluateLevel(bloom, { ...play().run, ancientBlooms: 1, turns: 30 })).toMatchObject({ status: 'won', stars: 3 });
  });
  it('wins at the goal even if the same move also filled the board', () => {
    const base = play().run;
    expect(evaluateLevel(sample, { ...base, highestTier: 3, turns: 8, gameOver: true })).toMatchObject({ status: 'won' });
  });
  it('builds a journey play state from a level: its seed, layout, ruleset and starting board', () => {
    const seeded = LEVELS.find(l => l.startingBoard !== null);
    if (!seeded) throw new Error('At least one level must use a starting board.');
    const state = startLevel(seeded);
    expect(state.mode).toBe('journey');
    expect(state.run.board).toEqual(seeded.startingBoard);
    expect(state.run.seed).toBe(normalizeSeed(seeded.seed));
    expect(state.layoutId).toBe(seeded.layoutId);
    expect(state.rulesetId).toBe(seeded.rulesetId);
    expect(state.wishes).toEqual([]);
    expect(state.run.gameOver).toBe(false);
    const plain = startLevel(LEVELS.find(l => l.startingBoard === null) ?? seeded);
    expect(plain.run.board.every(c => c === null)).toBe(true);
  });
  it('maps stars from placements deterministically', () => {
    expect(starsFor({ two: 15, three: 10 }, 10)).toBe(3);
    expect(starsFor({ two: 15, three: 10 }, 11)).toBe(2);
    expect(starsFor({ two: 15, three: 10 }, 16)).toBe(1);
  });
});

describe('Journey solvability gate (MER-015-F04)', () => {
  // Every level must be clearable by the reference two-ply bot on its own seed and on several others, with slack
  // before the deadline. Calibrated 2026-10-07: all 15 levels cleared on 11 of 11 runs. If a balance change breaks
  // this, fix the level or the rules deliberately; never loosen the gate.
  it.each(LEVELS.map(level => [level.id, level] as const))('%s is cleared by the bot on its own seed and on others, with slack', (_id, level) => {
    const runs = [playLevel(lookaheadBot, level), ...seedRange(4, 90).map(seed => playLevel(lookaheadBot, level, seed))];
    expect(runs.map(run => run.status)).toEqual(Array(5).fill('won'));
    const slowest = Math.max(...runs.map(run => run.turns));
    expect(slowest).toBeLessThanOrEqual(level.goal.within - 5); // at least five placements of slack
  }, 120_000);

  it('gives the tutorial level three stars and keeps the finale from handing them out for free', () => {
    const first = playLevel(lookaheadBot, LEVELS[0]);
    expect(first.stars).toBe(3);
    const finale = LEVELS[LEVELS.length - 1];
    const runs = seedRange(4, 90).map(seed => playLevel(lookaheadBot, finale, seed));
    expect(runs.filter(run => run.stars === 3).length).toBeLessThan(runs.length);
  }, 120_000);
});
