import {
  compostCell, createRun, drawPiece, isRunOver, nextRandom, normalizeSeed, placePiece,
  type MergeEvent, type MergroveRun,
} from './engine';
import { resolveLayout, type BoardLayout } from './layout';
import { resolveRuleset, rulesOf } from './ruleset';

/** Pure play-state layer: hold slot, single-step undo and in-run wishes on top of the frozen engine. */
export type PlayMode = 'endless' | 'daily' | 'expedition';

export const UNDO_COST = 2;
export const MAX_WISHES = 2;

export interface WishDefinition {
  /** Permanent id: append-only, never renumber or reuse. */
  readonly id: string;
  readonly label: string;
  /** Sunlight paid on completion. */
  readonly reward: number;
  /** Placements allowed from the moment the wish appears. Counted in turns, never wall-clock time. */
  readonly window: number;
  /** A wish is only drawn while its goal is still ahead of the player. */
  readonly eligible: (highestTier: number) => boolean;
  readonly done: (events: readonly MergeEvent[], run: MergroveRun) => boolean;
}

const always = () => true;
export const WISH_TABLE: readonly WishDefinition[] = Object.freeze([
  { id: 'merge-four', label: 'Merge a group of four or more', reward: 2, window: 8, eligible: always, done: events => events.some(e => e.size >= 4) },
  { id: 'merge-five', label: 'Merge a group of five or more', reward: 3, window: 16, eligible: always, done: events => events.some(e => e.size >= 5) },
  { id: 'cascade-two', label: 'Trigger a two-stage cascade', reward: 2, window: 10, eligible: always, done: events => events.some(e => e.chain >= 2) },
  { id: 'reach-bud', label: 'Grow a Bud', reward: 2, window: 8, eligible: tier => tier < 3, done: (_e, run) => run.highestTier >= 3 },
  { id: 'reach-bloom', label: 'Grow a Bloom', reward: 3, window: 14, eligible: tier => tier < 4, done: (_e, run) => run.highestTier >= 4 },
  { id: 'reach-sapling', label: 'Grow a Sapling', reward: 3, window: 18, eligible: tier => tier < 5, done: (_e, run) => run.highestTier >= 5 },
  { id: 'reach-lantern', label: 'Grow a Lantern Tree', reward: 4, window: 24, eligible: tier => tier < 6, done: (_e, run) => run.highestTier >= 6 },
]);

export interface ActiveWish { id: string; deadline: number }

export interface UndoSnapshot {
  run: MergroveRun;
  hold: number | null;
  wishes: ActiveWish[];
  wishRng: number | null;
  wishesDone: number;
}

export interface PlayState {
  run: MergroveRun;
  rulesetId: string;
  layoutId: string;
  mode: PlayMode;
  hold: number | null;
  undo: UndoSnapshot | null;
  wishes: ActiveWish[];
  /** Separate RNG stream for wishes, so wishes never shift the queue sequence. Null when wishes are off. */
  wishRng: number | null;
  wishesDone: number;
}

export interface NewPlayInput {
  seed: number;
  rulesetId: string;
  layoutId: string;
  mode: PlayMode;
  /** Defaults to true. Migrated v1 runs start without wishes. */
  wishes?: boolean;
}

export interface PlayResult {
  state: PlayState;
  events: MergeEvent[];
  completed: string[];
  expired: string[];
  placedCell: number;
}

function layoutOf(state: Pick<PlayState, 'layoutId'>): BoardLayout {
  const layout = resolveLayout(state.layoutId);
  if (!layout) throw new Error(`Unknown layout "${state.layoutId}".`);
  return layout;
}

function definitionOf(id: string): WishDefinition {
  const found = WISH_TABLE.find(wish => wish.id === id);
  if (!found) throw new Error(`Unknown wish "${id}".`);
  return found;
}

function drawWish(wishRng: number, highestTier: number, exclude: readonly string[], turns: number): { wish: ActiveWish | null; wishRng: number } {
  const [next, random] = nextRandom(wishRng);
  const pool = WISH_TABLE.filter(wish => wish.eligible(highestTier) && !exclude.includes(wish.id));
  if (pool.length === 0) return { wish: null, wishRng: next };
  const pick = pool[Math.min(pool.length - 1, Math.floor(random * pool.length))];
  return { wish: { id: pick.id, deadline: turns + pick.window }, wishRng: next };
}

function fillWishes(wishes: ActiveWish[], wishRng: number, highestTier: number, turns: number): { wishes: ActiveWish[]; wishRng: number } {
  const kept = [...wishes];
  let rng = wishRng;
  while (kept.length < MAX_WISHES) {
    const drawn = drawWish(rng, highestTier, kept.map(wish => wish.id), turns);
    rng = drawn.wishRng;
    if (!drawn.wish) break;
    kept.push(drawn.wish);
  }
  return { wishes: kept, wishRng: rng };
}

export function newPlay(input: NewPlayInput): PlayState {
  const ruleset = resolveRuleset(input.rulesetId);
  if (!ruleset) throw new Error(`Unknown ruleset "${input.rulesetId}".`);
  const layout = resolveLayout(input.layoutId);
  if (!layout) throw new Error(`Unknown layout "${input.layoutId}".`);
  const run = createRun(input.seed, layout);
  const base: PlayState = { run, rulesetId: ruleset.id, layoutId: layout.id, mode: input.mode, hold: null, undo: null, wishes: [], wishRng: null, wishesDone: 0 };
  if (input.wishes === false) return base;
  const start = normalizeSeed((run.seed ^ 0x5bd1e995) >>> 0);
  const filled = fillWishes([], start, run.highestTier, 0);
  return { ...base, wishes: filled.wishes, wishRng: filled.wishRng };
}

function snapshotOf(state: PlayState): UndoSnapshot {
  return { run: structuredClone(state.run), hold: state.hold, wishes: state.wishes.map(wish => ({ ...wish })), wishRng: state.wishRng, wishesDone: state.wishesDone };
}

function keepsUndo(state: PlayState, next: MergroveRun): UndoSnapshot | null {
  if (state.mode !== 'endless' || next.gameOver) return null;
  return snapshotOf(state);
}

export function placeAt(state: PlayState, queueIndex: number, cellIndex: number): PlayResult {
  const layout = layoutOf(state);
  const ruleset = resolveRuleset(state.rulesetId);
  if (!ruleset) throw new Error(`Unknown ruleset "${state.rulesetId}".`);
  const placed = placePiece(state.run, queueIndex, cellIndex, layout, rulesOf(ruleset));
  let run = placed.run;
  const completed: string[] = [];
  const expired: string[] = [];
  let wishes = state.wishes;
  let wishRng = state.wishRng;
  let wishesDone = state.wishesDone;

  if (wishRng !== null) {
    const survivors: ActiveWish[] = [];
    let reward = 0;
    for (const wish of state.wishes) {
      const definition = definitionOf(wish.id);
      if (definition.done(placed.events, run)) { completed.push(wish.id); reward += definition.reward; wishesDone += 1; }
      else if (run.turns >= wish.deadline) expired.push(wish.id);
      else survivors.push(wish);
    }
    if (reward > 0) {
      const sunlight = run.sunlight + reward;
      run = { ...run, sunlight, gameOver: isRunOver(run.board, sunlight, layout) };
    }
    const refilled = fillWishes(survivors, wishRng, run.highestTier, run.turns);
    wishes = refilled.wishes;
    wishRng = refilled.wishRng;
  }

  const next: PlayState = { ...state, run, hold: state.hold, undo: null, wishes, wishRng, wishesDone };
  return { state: { ...next, undo: keepsUndo(state, run) }, events: placed.events, completed, expired, placedCell: cellIndex };
}

export function compostAt(state: PlayState, cellIndex: number): PlayState {
  const run = compostCell(state.run, cellIndex, layoutOf(state));
  return { ...state, run, undo: keepsUndo(state, run) };
}

export function canHold(state: PlayState): boolean {
  return !state.run.gameOver;
}

/** Storehouse: stash into an empty slot (one queue draw) or swap with the held piece (no draw). */
export function holdPiece(state: PlayState, queueIndex: number): PlayState {
  if (state.run.gameOver) throw new Error('This Mergrove run is over.');
  if (!Number.isInteger(queueIndex) || queueIndex < 0 || queueIndex > 2) throw new Error('Queue slot is out of range.');
  const queue: [number, number, number] = [...state.run.queue];
  const chosen = queue[queueIndex];
  if (state.hold === null) {
    const [rngState, replacement] = drawPiece(state.run.rngState, state.run.highestTier);
    queue[queueIndex] = replacement;
    return { ...state, hold: chosen, run: { ...state.run, queue, rngState } };
  }
  queue[queueIndex] = state.hold;
  return { ...state, hold: chosen, run: { ...state.run, queue } };
}

export function canUndo(state: PlayState): boolean {
  return state.mode === 'endless' && state.undo !== null && !state.run.gameOver && state.undo.run.sunlight >= UNDO_COST;
}

/** Restores the position before the last move, then charges UNDO_COST. The RNG is restored too, so nothing can be rerolled. */
export function undoLast(state: PlayState): PlayState {
  if (!canUndo(state) || state.undo === null) throw new Error('Undo is not available.');
  const snapshot = state.undo;
  const sunlight = snapshot.run.sunlight - UNDO_COST;
  const layout = layoutOf(state);
  const run = { ...snapshot.run, sunlight, gameOver: isRunOver(snapshot.run.board, sunlight, layout) };
  return { ...state, run, hold: snapshot.hold, wishes: snapshot.wishes, wishRng: snapshot.wishRng, wishesDone: snapshot.wishesDone, undo: null };
}
