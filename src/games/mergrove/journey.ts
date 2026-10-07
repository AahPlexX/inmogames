import type { GroveCell, MergroveRun } from './engine';
import { newPlay, type PlayState } from './play';

/**
 * Journey of Biomes: a linear, win-gated progression. Level 1 is always open; each later level opens only when the
 * one before it has been cleared. There are no timers, energy or date gates: deadlines are counted in placements.
 * Level and chapter ids are permanent (append-only).
 */
export type Goal =
  | { kind: 'reach-tier'; tier: number; within: number }
  | { kind: 'reach-score'; score: number; within: number }
  | { kind: 'ancient-blooms'; count: number; within: number };

export interface StarThresholds {
  /** Finish in this many placements or fewer for two stars. */
  two: number;
  /** Finish in this many placements or fewer for three stars. */
  three: number;
}

export interface LevelDefinition {
  readonly id: string;
  readonly chapter: string;
  readonly name: string;
  readonly blurb: string;
  readonly layoutId: string;
  readonly rulesetId: string;
  readonly seed: number;
  /** Pre-placed spirits (layout-sized, no standing groups), or null for an empty board. */
  readonly startingBoard: readonly GroveCell[] | null;
  readonly goal: Goal;
  readonly stars: StarThresholds;
}

export interface Chapter { readonly id: string; readonly name: string; readonly intro: string }

export const CHAPTERS: readonly Chapter[] = Object.freeze([
  { id: 'mossy-hollow', name: 'Mossy Hollow', intro: 'Soft moss, slow light and the first small spirits. Learn to fuse trios on a snug board.' },
  { id: 'fen-lanterns', name: 'Fen Lanterns', intro: 'The land opens into a wide wetland. More room to plan, and bigger groups to build.' },
  { id: 'stonecrest', name: 'Stonecrest', intro: 'A cut-cornered ridge where space is dear. Every placement has to count.' },
  { id: 'emberwood', name: 'Emberwood', intro: 'Autumn has scattered seeds across the clearing already. Work with what you find.' },
  { id: 'moonglade', name: 'Moonglade', intro: 'The quiet heart of the forest. The goals are longer here, and the reward is calm.' },
]);

const N = null;
/** 5x5 starting boards. Adjacent cells never match, so no group stands at the start. */
const SCATTER_5: GroveCell[] = [
  1, N, N, 2, N,
  N, N, 1, N, N,
  N, 2, N, N, 1,
  N, N, N, 2, N,
  1, N, N, N, N,
];
const GARDEN_5: GroveCell[] = [
  2, N, 1, N, 2,
  N, 1, N, 1, N,
  1, N, 3, N, 1,
  N, 1, N, 1, N,
  2, N, 1, N, 2,
];
/** 6x6 board with the four corners blocked (crossroads-6): only playable cells may hold spirits. */
const RIDGE_6: GroveCell[] = [
  N, 1, N, 2, N, N,
  2, N, N, N, 1, N,
  N, N, 3, N, N, 2,
  1, N, N, 3, N, N,
  N, 2, N, N, 1, N,
  N, N, 1, N, 2, N,
];

export const LEVELS: readonly LevelDefinition[] = Object.freeze([
  // Mossy Hollow: classic-5, learn to fuse.
  { id: 'hollow-1', chapter: 'mossy-hollow', name: 'First Seeds', blurb: 'Fuse your first trio and grow a Bud.', layoutId: 'classic-5', rulesetId: 'v2', seed: 1101, startingBoard: null, goal: { kind: 'reach-tier', tier: 3, within: 40 }, stars: { two: 20, three: 12 } },
  { id: 'hollow-2', chapter: 'mossy-hollow', name: 'Quiet Clearing', blurb: 'Score 600 points before the clearing fills.', layoutId: 'classic-5', rulesetId: 'v2', seed: 1102, startingBoard: null, goal: { kind: 'reach-score', score: 600, within: 45 }, stars: { two: 34, three: 24 } },
  { id: 'hollow-3', chapter: 'mossy-hollow', name: 'The Old Bloom', blurb: 'Coax a Bloom out of the moss.', layoutId: 'classic-5', rulesetId: 'v2', seed: 1103, startingBoard: null, goal: { kind: 'reach-tier', tier: 4, within: 70 }, stars: { two: 40, three: 26 } },
  // Fen Lanterns: standard-6, room to plan.
  { id: 'fen-1', chapter: 'fen-lanterns', name: 'Wading In', blurb: 'A wider board. Grow a Bloom.', layoutId: 'standard-6', rulesetId: 'v2', seed: 1201, startingBoard: null, goal: { kind: 'reach-tier', tier: 4, within: 70 }, stars: { two: 46, three: 30 } },
  { id: 'fen-2', chapter: 'fen-lanterns', name: 'Lantern Light', blurb: 'Score 1,200 points.', layoutId: 'standard-6', rulesetId: 'v2', seed: 1202, startingBoard: null, goal: { kind: 'reach-score', score: 1200, within: 70 }, stars: { two: 55, three: 42 } },
  { id: 'fen-3', chapter: 'fen-lanterns', name: 'Reed Choir', blurb: 'Grow a Bloom in the reeds.', layoutId: 'standard-6', rulesetId: 'v2', seed: 1203, startingBoard: null, goal: { kind: 'reach-tier', tier: 4, within: 75 }, stars: { two: 42, three: 28 } },
  // Stonecrest: crossroads-6, cut corners.
  { id: 'stone-1', chapter: 'stonecrest', name: 'Foothold', blurb: 'Cut corners, tight space. Grow a Bud.', layoutId: 'crossroads-6', rulesetId: 'v2', seed: 1301, startingBoard: null, goal: { kind: 'reach-tier', tier: 3, within: 45 }, stars: { two: 26, three: 16 } },
  { id: 'stone-2', chapter: 'stonecrest', name: 'Switchback', blurb: 'Score 1,500 points on the ridge.', layoutId: 'crossroads-6', rulesetId: 'v2', seed: 1302, startingBoard: null, goal: { kind: 'reach-score', score: 1500, within: 80 }, stars: { two: 62, three: 48 } },
  { id: 'stone-3', chapter: 'stonecrest', name: 'Summit Bloom', blurb: 'Grow a Bloom at the top.', layoutId: 'crossroads-6', rulesetId: 'v2', seed: 1303, startingBoard: null, goal: { kind: 'reach-tier', tier: 4, within: 80 }, stars: { two: 44, three: 30 } },
  // Emberwood: pre-seeded boards.
  { id: 'ember-1', chapter: 'emberwood', name: 'Scattered Embers', blurb: 'Seeds already dot the clearing. Grow a Bud.', layoutId: 'classic-5', rulesetId: 'v2', seed: 1401, startingBoard: SCATTER_5, goal: { kind: 'reach-tier', tier: 3, within: 35 }, stars: { two: 14, three: 7 } },
  { id: 'ember-2', chapter: 'emberwood', name: 'Checkered Garden', blurb: 'A tidy lattice with a Bud at its heart. Grow a Bloom.', layoutId: 'classic-5', rulesetId: 'v2', seed: 1402, startingBoard: GARDEN_5, goal: { kind: 'reach-tier', tier: 4, within: 60 }, stars: { two: 22, three: 11 } },
  { id: 'ember-3', chapter: 'emberwood', name: 'Ridge Fire', blurb: 'Pre-seeded ridge. Score 2,000 points.', layoutId: 'crossroads-6', rulesetId: 'v2', seed: 1403, startingBoard: RIDGE_6, goal: { kind: 'reach-score', score: 2000, within: 90 }, stars: { two: 72, three: 56 } },
  // Moonglade: longer goals, the finale.
  { id: 'moon-1', chapter: 'moonglade', name: 'Moonrise', blurb: 'Score 2,500 points.', layoutId: 'standard-6', rulesetId: 'v2', seed: 1501, startingBoard: null, goal: { kind: 'reach-score', score: 2500, within: 100 }, stars: { two: 80, three: 62 } },
  { id: 'moon-2', chapter: 'moonglade', name: 'Silver Roots', blurb: 'Score 3,200 points among the silver roots.', layoutId: 'standard-6', rulesetId: 'v2', seed: 1502, startingBoard: null, goal: { kind: 'reach-score', score: 3200, within: 130 }, stars: { two: 105, three: 82 } },
  { id: 'moon-3', chapter: 'moonglade', name: 'The Quiet Grove', blurb: 'Score 4,000 points and finish the Journey.', layoutId: 'standard-6', rulesetId: 'v2', seed: 1503, startingBoard: null, goal: { kind: 'reach-score', score: 4000, within: 160 }, stars: { two: 130, three: 105 } },
]);

export function levelById(id: string): LevelDefinition | null {
  return LEVELS.find(level => level.id === id) ?? null;
}

/** Best stars (1-3) per cleared level id. */
export type JourneyStars = Readonly<Record<string, number>>;

/** Level 1 is always open; every other level opens only once the level before it has been cleared. */
export function isUnlocked(levelId: string, stars: JourneyStars): boolean {
  const index = LEVELS.findIndex(level => level.id === levelId);
  if (index < 0) return false;
  return index === 0 || (stars[LEVELS[index - 1].id] ?? 0) >= 1;
}

/** The first level not yet cleared, or null once the Journey is complete. */
export function nextLevel(stars: JourneyStars): LevelDefinition | null {
  return LEVELS.find(level => (stars[level.id] ?? 0) < 1) ?? null;
}

/** Keeps the best result. Stars are 1..3 and are never lowered by a worse replay. */
export function recordClear(stars: JourneyStars, levelId: string, earned: number): Record<string, number> {
  if (!Number.isInteger(earned) || earned < 1 || earned > 3) throw new Error('Stars must be a whole number from 1 to 3.');
  return { ...stars, [levelId]: Math.max(stars[levelId] ?? 0, earned) };
}

export function starsFor(thresholds: StarThresholds, placements: number): number {
  if (placements <= thresholds.three) return 3;
  if (placements <= thresholds.two) return 2;
  return 1;
}

export interface LevelStatus {
  status: 'playing' | 'won' | 'lost';
  stars: number;
  /** Placements left before the deadline (0 once the level is decided). */
  remaining: number;
}

function goalMet(goal: Goal, run: MergroveRun): boolean {
  if (goal.kind === 'reach-tier') return run.highestTier >= goal.tier;
  if (goal.kind === 'reach-score') return run.score >= goal.score;
  return run.ancientBlooms >= goal.count;
}

/** Wins are checked first, so a move that reaches the goal and also fills the board still counts as a win. */
export function evaluateLevel(level: LevelDefinition, run: MergroveRun): LevelStatus {
  if (goalMet(level.goal, run)) return { status: 'won', stars: starsFor(level.stars, run.turns), remaining: 0 };
  const remaining = Math.max(0, level.goal.within - run.turns);
  if (remaining === 0 || run.gameOver) return { status: 'lost', stars: 0, remaining: 0 };
  return { status: 'playing', stars: 0, remaining };
}

/** A fresh Journey play state for a level. Wishes are off: the level's own goal is the objective. */
export function startLevel(level: LevelDefinition): PlayState {
  const state = newPlay({ seed: level.seed, rulesetId: level.rulesetId, layoutId: level.layoutId, mode: 'journey', wishes: false });
  if (!level.startingBoard) return state;
  return { ...state, run: { ...state.run, board: [...level.startingBoard], highestTier: Math.max(1, ...level.startingBoard.map(cell => cell ?? 0)) } };
}
