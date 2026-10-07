import { CLASSIC_5, layoutCellCount, type BoardLayout } from './layout';

export const BOARD_SIZE = 5;
export const BOARD_CELLS = BOARD_SIZE * BOARD_SIZE;
export const MAX_TIER = 8;
export const COMPOST_COST = 4;
export const SECOND_TIER_CHANCE = 0.22;

export type GroveCell = number | null;

/** Rule switches a ruleset can flip. Released rulesets are frozen in ruleset.ts; v1 is the default here. */
export interface EngineRules {
  /** Merging 5+ pieces below tier 8 also leaves one extra result piece beside the anchor. */
  readonly largeGroupBonus: boolean;
}
export const V1_RULES: EngineRules = Object.freeze({ largeGroupBonus: false });
export const LARGE_GROUP_MIN = 5;

export interface MergroveRun {
  seed: number;
  rngState: number;
  board: GroveCell[];
  queue: [number, number, number];
  score: number;
  sunlight: number;
  highestTier: number;
  ancientBlooms: number;
  turns: number;
  gameOver: boolean;
}

export interface MergeEvent {
  tier: number;
  resultTier: number | null;
  size: number;
  chain: number;
  points: number;
  ancientBloom: boolean;
  /** Cell that received the large-group bonus piece, or null when none was awarded. */
  bonusCell: number | null;
}

export interface PlacementResult {
  run: MergroveRun;
  events: MergeEvent[];
  placedCell: number;
}

function normalizeSeed(seed: number): number {
  if (!Number.isFinite(seed)) return 0x6d2b79f5;
  return Math.trunc(seed) >>> 0 || 0x6d2b79f5;
}

function nextRandom(state: number): [number, number] {
  let x = normalizeSeed(state);
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  const next = x >>> 0;
  return [next, next / 0x1_0000_0000];
}

function drawPiece(state: number, highestTier: number): [number, number] {
  const [next, random] = nextRandom(state);
  const tier = highestTier >= 3 && random < SECOND_TIER_CHANCE ? 2 : 1;
  return [next, tier];
}

export interface DrawPreview {
  /** Tier the next replacement piece will have if the current highest tier does not change first. */
  tier: number;
  /** True when reaching Bud during the placement that uses a queue slot would turn the replacement into a Sprout. */
  sproutIfBud: boolean;
}

/** Pure peek at the next queue draw. Never advances or mutates the run's RNG. */
export function previewNextDraw(run: Pick<MergroveRun, 'rngState' | 'highestTier'>): DrawPreview {
  const [, random] = nextRandom(run.rngState);
  const sprout = random < SECOND_TIER_CHANCE;
  if (run.highestTier >= 3) return { tier: sprout ? 2 : 1, sproutIfBud: false };
  return { tier: 1, sproutIfBud: sprout };
}

function assertIndex(index: number, label: string, max: number): void {
  if (!Number.isInteger(index) || index < 0 || index >= max) throw new Error(`${label} is out of range.`);
}

function assertBoard(board: GroveCell[], layout: BoardLayout): void {
  const cells = layoutCellCount(layout);
  if (board.length !== cells) throw new Error(`Board must contain ${cells} cells.`);
}

export function connectedGroup(board: GroveCell[], start: number, tier: number, layout: BoardLayout = CLASSIC_5): number[] {
  assertBoard(board, layout);
  assertIndex(start, 'Cell', layoutCellCount(layout));
  if (!Number.isInteger(tier) || tier < 1 || tier > MAX_TIER || board[start] !== tier) return [];
  const adjacency = layout.adjacency;
  const visited = new Set<number>([start]);
  const queue = [start];
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const current = queue[cursor];
    for (const neighbor of adjacency[current]) {
      if (!visited.has(neighbor) && board[neighbor] === tier) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return [...visited];
}

export function mergeScore(tier: number, groupSize: number, chain: number): number {
  if (!Number.isInteger(tier) || tier < 1 || tier > MAX_TIER) throw new Error('Merge tier is invalid.');
  if (!Number.isInteger(groupSize) || groupSize < 3) throw new Error('A merge needs at least three pieces.');
  if (!Number.isInteger(chain) || chain < 1) throw new Error('Chain depth must be positive.');
  return groupSize * 10 * (2 ** (tier - 1)) * chain;
}

export function isRunOver(board: GroveCell[], sunlight: number, layout: BoardLayout = CLASSIC_5): boolean {
  assertBoard(board, layout);
  if (sunlight >= COMPOST_COST) return false;
  for (let index = 0; index < board.length; index += 1) {
    if (board[index] === null && layout.playable[index]) return false;
  }
  return true;
}

export function createRun(seed: number, layout: BoardLayout = CLASSIC_5): MergroveRun {
  const normalized = normalizeSeed(seed);
  let state = normalized;
  const drawn: number[] = [];
  for (let index = 0; index < 3; index += 1) {
    let tier: number;
    [state, tier] = drawPiece(state, 1);
    drawn.push(tier);
  }
  return {
    seed: normalized,
    rngState: state,
    board: Array<GroveCell>(layoutCellCount(layout)).fill(null),
    queue: [drawn[0], drawn[1], drawn[2]],
    score: 0,
    sunlight: 0,
    highestTier: 1,
    ancientBlooms: 0,
    turns: 0,
    gameOver: false,
  };
}

export function placePiece(run: MergroveRun, queueIndex: number, cellIndex: number, layout: BoardLayout = CLASSIC_5, rules: EngineRules = V1_RULES): PlacementResult {
  if (run.gameOver) throw new Error('This Mergrove run is over.');
  assertIndex(queueIndex, 'Queue slot', 3);
  assertIndex(cellIndex, 'Cell', layoutCellCount(layout));
  assertBoard(run.board, layout);
  if (!layout.playable[cellIndex]) throw new Error('That cell is not part of this board.');
  if (run.board[cellIndex] !== null) throw new Error('Choose an empty cell.');

  const board = [...run.board];
  const queue: [number, number, number] = [...run.queue];
  const placedTier = queue[queueIndex];
  if (!Number.isInteger(placedTier) || placedTier < 1 || placedTier > MAX_TIER) throw new Error('Queue contains an invalid piece.');
  board[cellIndex] = placedTier;

  let score = run.score;
  let sunlight = run.sunlight;
  let highestTier = Math.max(run.highestTier, placedTier);
  let ancientBlooms = run.ancientBlooms;
  let currentTier = placedTier;
  let chain = 1;
  const events: MergeEvent[] = [];

  while (board[cellIndex] === currentTier) {
    const group = connectedGroup(board, cellIndex, currentTier, layout);
    if (group.length < 3) break;
    const points = mergeScore(currentTier, group.length, chain);
    score += points;
    sunlight += Math.max(1, group.length - 2);
    const ancientBloom = currentTier === MAX_TIER;

    for (const index of group) board[index] = null;
    if (ancientBloom) {
      ancientBlooms += 1;
      events.push({ tier: currentTier, resultTier: null, size: group.length, chain, points, ancientBloom: true, bonusCell: null });
      break;
    }

    const nextTier: number = currentTier + 1;
    board[cellIndex] = nextTier;
    let bonusCell: number | null = null;
    if (rules.largeGroupBonus && group.length >= LARGE_GROUP_MIN) {
      const beside = layout.adjacency[cellIndex];
      bonusCell = group.filter(index => index !== cellIndex && beside.includes(index)).sort((a, b) => a - b)[0] ?? null;
      if (bonusCell !== null) board[bonusCell] = nextTier;
    }
    highestTier = Math.max(highestTier, nextTier);
    events.push({ tier: currentTier, resultTier: nextTier, size: group.length, chain, points, ancientBloom: false, bonusCell });
    currentTier = nextTier;
    chain += 1;
  }

  let rngState: number;
  let replacementTier: number;
  [rngState, replacementTier] = drawPiece(run.rngState, highestTier);
  queue[queueIndex] = replacementTier;
  const gameOver = isRunOver(board, sunlight, layout);

  return {
    run: {
      ...run,
      rngState,
      board,
      queue,
      score,
      sunlight,
      highestTier,
      ancientBlooms,
      turns: run.turns + 1,
      gameOver,
    },
    events,
    placedCell: cellIndex,
  };
}

export function compostCell(run: MergroveRun, cellIndex: number, layout: BoardLayout = CLASSIC_5): MergroveRun {
  if (run.gameOver) throw new Error('This Mergrove run is over.');
  assertIndex(cellIndex, 'Cell', layoutCellCount(layout));
  assertBoard(run.board, layout);
  if (run.sunlight < COMPOST_COST) throw new Error(`Composting needs ${COMPOST_COST} sunlight.`);
  if (run.board[cellIndex] === null) throw new Error('Choose an occupied cell to compost.');
  const board = [...run.board];
  board[cellIndex] = null;
  const sunlight = run.sunlight - COMPOST_COST;
  return { ...run, board, sunlight, gameOver: isRunOver(board, sunlight, layout) };
}
