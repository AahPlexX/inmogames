import { MAX_TIER, type MergeEvent } from './engine';

/** Lifetime stats, Herbarium and achievements. Pure and persistence-agnostic: the save layer stores the results. */
export interface MergroveStats {
  runsPlayed: number;
  placements: number;
  merges: number;
  longestChain: number;
  largestGroup: number;
  ancientBlooms: number;
  sunlightEarned: number;
  compostsUsed: number;
  holdsUsed: number;
  undosUsed: number;
  wishesDone: number;
}

export const EMPTY_STATS: MergroveStats = Object.freeze({
  runsPlayed: 0, placements: 0, merges: 0, longestChain: 0, largestGroup: 0, ancientBlooms: 0,
  sunlightEarned: 0, compostsUsed: 0, holdsUsed: 0, undosUsed: 0, wishesDone: 0,
});

export function recordPlace(stats: MergroveStats, events: readonly MergeEvent[], wishesCompleted: number): MergroveStats {
  return {
    ...stats,
    placements: stats.placements + 1,
    merges: stats.merges + events.length,
    longestChain: Math.max(stats.longestChain, ...events.map(event => event.chain)),
    largestGroup: Math.max(stats.largestGroup, ...events.map(event => event.size)),
    ancientBlooms: stats.ancientBlooms + events.filter(event => event.ancientBloom).length,
    sunlightEarned: stats.sunlightEarned + events.reduce((total, event) => total + Math.max(1, event.size - 2), 0),
    wishesDone: stats.wishesDone + wishesCompleted,
  };
}
export const recordCompost = (stats: MergroveStats): MergroveStats => ({ ...stats, compostsUsed: stats.compostsUsed + 1 });
export const recordHold = (stats: MergroveStats): MergroveStats => ({ ...stats, holdsUsed: stats.holdsUsed + 1 });
export const recordUndo = (stats: MergroveStats): MergroveStats => ({ ...stats, undosUsed: stats.undosUsed + 1 });
export const recordRunStart = (stats: MergroveStats): MergroveStats => ({ ...stats, runsPlayed: stats.runsPlayed + 1 });

export interface CodexEntry {
  readonly tier: number;
  readonly name: string;
  readonly note: string;
}

/** Herbarium entries, original text. Tier ids are permanent: append, never renumber. */
export const CODEX: readonly CodexEntry[] = Object.freeze([
  { tier: 1, name: 'Seed', note: 'A small brown seed that has not yet decided what it wants to be. It sleeps lightly and wakes beside friends.' },
  { tier: 2, name: 'Sprout', note: 'Two pale leaves and a great deal of curiosity. Sprouts lean toward whichever neighbour grows the fastest.' },
  { tier: 3, name: 'Bud', note: 'Tightly folded and quietly proud. A bud keeps its colour hidden until the whole grove is watching.' },
  { tier: 4, name: 'Bloom', note: 'The first spirit bright enough to be noticed from across the clearing. Moths arrive within the hour.' },
  { tier: 5, name: 'Sapling', note: 'Slender, stubborn and already taller than the stories about it. Its roots are older than its trunk.' },
  { tier: 6, name: 'Lantern Tree', note: 'Hangs small glowing fruit that never burn. Travellers swear the light is warmer than it ought to be.' },
  { tier: 7, name: 'Elder Tree', note: 'Remembers every season the grove has seen. It speaks rarely, and then only in the rustle of the leaves.' },
  { tier: 8, name: 'Groveheart', note: 'The still point the whole forest turns around. When three meet, the grove exhales and begins again.' },
]);

export interface Discovery { discovered: number[]; first: boolean }

/** Adds a tier to the Herbarium. Returns a new sorted, de-duplicated list and whether this was a first discovery. */
export function discover(discovered: readonly number[], tier: number): Discovery {
  const valid = Number.isInteger(tier) && tier >= 1 && tier <= MAX_TIER;
  if (!valid || discovered.includes(tier)) return { discovered: [...discovered], first: false };
  return { discovered: [...discovered, tier].sort((a, b) => a - b), first: true };
}

export function codexCompletion(discovered: readonly number[]): number {
  const known = new Set(CODEX.map(entry => entry.tier));
  return discovered.filter(tier => known.has(tier)).length / CODEX.length;
}

export interface AchievementContext {
  stats: MergroveStats;
  discovered: readonly number[];
  /** Placements in the current run. */
  runTurns: number;
  /** Best stars (1-3) per cleared Journey level id. */
  journeyStars: Readonly<Record<string, number>>;
  journeyTotal: number;
}

export interface Achievement {
  /** Permanent id: append-only. */
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly test: (context: AchievementContext) => boolean;
}

const reached = (tier: number) => (context: AchievementContext) => context.discovered.includes(tier);
const stat = (field: keyof MergroveStats, threshold: number) => (context: AchievementContext) => context.stats[field] >= threshold;

// Thresholds come from the MER-023 simulation: the two-ply bot's best chain was 4 and largest group 8 over 24 runs,
// and its shortest run was 154 placements, so 3-chain, 5-group and 100-placement goals are reachable but not trivial.
export const ACHIEVEMENTS: readonly Achievement[] = Object.freeze([
  { id: 'first-sprout', label: 'First Sprout', description: 'Grow your first Sprout.', test: reached(2) },
  { id: 'budding', label: 'Budding', description: 'Grow a Bud.', test: reached(3) },
  { id: 'bloom-keeper', label: 'Bloom Keeper', description: 'Grow a Bloom.', test: reached(4) },
  { id: 'sapling-steward', label: 'Sapling Steward', description: 'Grow a Sapling.', test: reached(5) },
  { id: 'canopy-builder', label: 'Canopy Builder', description: 'Grow a Lantern Tree.', test: reached(6) },
  { id: 'heart-of-the-grove', label: 'Heart of the Grove', description: 'Grow a Groveheart.', test: reached(8) },
  { id: 'cascade-conductor', label: 'Cascade Conductor', description: 'Trigger a three-stage cascade.', test: stat('longestChain', 3) },
  { id: 'cascade-master', label: 'Cascade Master', description: 'Trigger a four-stage cascade.', test: stat('longestChain', 4) },
  { id: 'big-bundle', label: 'Big Bundle', description: 'Merge a group of five or more.', test: stat('largestGroup', 5) },
  { id: 'primordial-rebirth', label: 'Primordial Rebirth', description: 'Trigger an ancient bloom.', test: stat('ancientBlooms', 1) },
  { id: 'tidy-gardener', label: 'Tidy Gardener', description: 'Compost ten pieces.', test: stat('compostsUsed', 10) },
  { id: 'century-grove', label: 'Century Grove', description: 'Make 100 placements in one run.', test: context => context.runTurns >= 100 },
  { id: 'first-steps', label: 'First Steps', description: 'Clear your first Journey level.', test: context => Object.keys(context.journeyStars).length >= 1 },
  { id: 'trailblazer', label: 'Trailblazer', description: 'Clear five Journey levels.', test: context => Object.keys(context.journeyStars).length >= 5 },
  { id: 'master-gardener', label: 'Master Gardener', description: 'Earn three stars on every Journey level.', test: context => context.journeyTotal > 0 && Object.values(context.journeyStars).filter(stars => stars >= 3).length >= context.journeyTotal },
]);

export interface AchievementResult { earned: string[]; unlocked: string[] }

/** Append-only evaluation: ids already earned stay earned and are never announced twice; unknown ids are dropped. */
export function evaluateAchievements(context: AchievementContext, earned: readonly string[]): AchievementResult {
  const known = new Set(ACHIEVEMENTS.map(achievement => achievement.id));
  const kept = earned.filter(id => known.has(id));
  const unlocked = ACHIEVEMENTS.filter(achievement => !kept.includes(achievement.id) && achievement.test(context)).map(achievement => achievement.id);
  return { earned: [...kept, ...unlocked], unlocked };
}
