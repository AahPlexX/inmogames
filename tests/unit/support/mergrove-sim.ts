// Dev-only balance harness for src/games/mergrove (MER-018). Never imported by the shipped bundle.
import {
  COMPOST_COST, MAX_TIER, BOARD_CELLS, compostCell, createRun, placePiece,
  type MergroveRun,
} from '../../../src/games/mergrove/engine';
import { CLASSIC_5, type BoardLayout } from '../../../src/games/mergrove/layout';

export type BotAction =
  | { kind: 'place'; queueIndex: number; cellIndex: number }
  | { kind: 'compost'; cellIndex: number };

export type Bot = (run: MergroveRun, layout: BoardLayout) => BotAction;

function emptyCells(run: MergroveRun, layout: BoardLayout): number[] {
  const cells: number[] = [];
  run.board.forEach((cell, index) => { if (cell === null && layout.playable[index]) cells.push(index); });
  return cells;
}

function emptyCount(run: MergroveRun, layout: BoardLayout): number {
  let count = 0;
  for (let index = 0; index < run.board.length; index += 1) if (run.board[index] === null && layout.playable[index]) count += 1;
  return count;
}

/** Compost target when the board is full: the lowest tier, lowest index (cheapest spirit to give up). */
function compostTarget(run: MergroveRun): number {
  let target = 0;
  run.board.forEach((cell, index) => {
    if (cell !== null && (run.board[target] === null || cell < (run.board[target] as number))) target = index;
  });
  return target;
}

/** Heuristic value of a position: open space dominates, score breaks ties. */
function value(run: MergroveRun, layout: BoardLayout): number {
  return emptyCount(run, layout) * 1_000 + run.sunlight * 10 + run.highestTier * 5;
}

interface Candidate { action: BotAction; run: MergroveRun; points: number }

function candidates(run: MergroveRun, layout: BoardLayout): Candidate[] {
  const out: Candidate[] = [];
  for (const cellIndex of emptyCells(run, layout)) {
    for (let queueIndex = 0; queueIndex < 3; queueIndex += 1) {
      const result = placePiece(run, queueIndex, cellIndex, layout);
      out.push({ action: { kind: 'place', queueIndex, cellIndex }, run: result.run, points: result.run.score - run.score });
    }
  }
  return out;
}

function best(options: Candidate[], score: (candidate: Candidate) => number): Candidate {
  let winner = options[0];
  let winnerScore = score(winner);
  for (let index = 1; index < options.length; index += 1) {
    const next = score(options[index]);
    if (next > winnerScore) { winner = options[index]; winnerScore = next; }
  }
  return winner;
}

/** One-ply policy. Deterministic: ties resolve to the earliest cell, then earliest queue slot. */
export const greedyBot: Bot = (run, layout) => {
  if (emptyCount(run, layout) === 0) return { kind: 'compost', cellIndex: compostTarget(run) };
  return best(candidates(run, layout), c => value(c.run, layout) + c.points * 0.01).action;
};

/** Two-ply policy: also scores the best reply, which is knowable because the queue is deterministic. */
export const lookaheadBot: Bot = (run, layout) => {
  if (emptyCount(run, layout) === 0) return { kind: 'compost', cellIndex: compostTarget(run) };
  return best(candidates(run, layout), (c) => {
    if (c.run.gameOver) return -Infinity;
    if (emptyCount(c.run, layout) === 0) return value(c.run, layout) + c.points * 0.01;
    const reply = best(candidates(c.run, layout), r => value(r.run, layout) + r.points * 0.01);
    return value(reply.run, layout) + (c.points + reply.points) * 0.01;
  }).action;
};

export interface RunSummary {
  seed: number;
  turns: number;
  score: number;
  highestTier: number;
  ancientBlooms: number;
  composts: number;
  capped: boolean;
}

export function playRun(bot: Bot, seed: number, maxActions = 4_000, layout: BoardLayout = CLASSIC_5): RunSummary {
  let run = createRun(seed, layout);
  let composts = 0;
  let actions = 0;
  while (!run.gameOver && actions < maxActions) {
    const action = bot(run, layout);
    if (action.kind === 'place') run = placePiece(run, action.queueIndex, action.cellIndex, layout).run;
    else { run = compostCell(run, action.cellIndex, layout); composts += 1; }
    actions += 1;
  }
  return {
    seed, turns: run.turns, score: run.score, highestTier: run.highestTier,
    ancientBlooms: run.ancientBlooms, composts, capped: !run.gameOver,
  };
}

export interface SimulationSummary {
  runs: number;
  capped: number;
  turns: { p10: number; median: number; p90: number };
  medianScore: number;
  /** reach[n-1] = share of runs that reached tier n (index 0 is tier 1). */
  reach: number[];
  bloomsPerRun: number;
  runsWithBloom: number;
  compostsPerRun: number;
}

function percentile(sorted: number[], fraction: number): number {
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * fraction))];
}

export function summarize(results: RunSummary[]): SimulationSummary {
  const turns = results.map(r => r.turns).sort((a, b) => a - b);
  const scores = results.map(r => r.score).sort((a, b) => a - b);
  const total = results.length;
  return {
    runs: total,
    capped: results.filter(r => r.capped).length,
    turns: { p10: percentile(turns, 0.1), median: percentile(turns, 0.5), p90: percentile(turns, 0.9) },
    medianScore: percentile(scores, 0.5),
    reach: Array.from({ length: MAX_TIER }, (_, i) => results.filter(r => r.highestTier >= i + 1).length / total),
    bloomsPerRun: results.reduce((sum, r) => sum + r.ancientBlooms, 0) / total,
    runsWithBloom: results.filter(r => r.ancientBlooms > 0).length / total,
    compostsPerRun: results.reduce((sum, r) => sum + r.composts, 0) / total,
  };
}

export function simulate(bot: Bot, seeds: number[], maxActions?: number, layout: BoardLayout = CLASSIC_5): SimulationSummary {
  return summarize(seeds.map(seed => playRun(bot, seed, maxActions, layout)));
}

/** Evenly spread, reproducible seed list. */
export function seedRange(count: number, start = 1): number[] {
  return Array.from({ length: count }, (_, i) => Math.imul(start + i, 2654435761) >>> 0 || 1);
}

export { BOARD_CELLS, COMPOST_COST };
