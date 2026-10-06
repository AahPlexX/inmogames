import type { GameSaveDefinition } from '../../platform/saves/contracts';
import { BOARD_CELLS, MAX_TIER, isRunOver, type GroveCell, type MergroveRun } from './engine';

export interface MergroveSave {
  bestScore: number;
  bestTier: number;
  activeRun: MergroveRun | null;
}

function isIntegerIn(value: unknown, min: number, max = Number.MAX_SAFE_INTEGER): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max;
}

function decodeRun(value: unknown): MergroveRun | null {
  if (!value || typeof value !== 'object') return null;
  const run = value as Partial<MergroveRun>;
  if (!isIntegerIn(run.seed, 1, 0xffff_ffff) || !isIntegerIn(run.rngState, 1, 0xffff_ffff)) return null;
  if (!Array.isArray(run.board) || run.board.length !== BOARD_CELLS) return null;
  const board: GroveCell[] = [];
  for (const cell of run.board) {
    if (cell === null) { board.push(null); continue; }
    if (!isIntegerIn(cell, 1, MAX_TIER)) return null;
    board.push(cell);
  }
  if (!Array.isArray(run.queue) || run.queue.length !== 3 || run.queue.some(piece => !isIntegerIn(piece, 1, 2))) return null;
  if (!isIntegerIn(run.score, 0) || !isIntegerIn(run.sunlight, 0) || !isIntegerIn(run.highestTier, 1, MAX_TIER)) return null;
  if (!isIntegerIn(run.ancientBlooms, 0) || !isIntegerIn(run.turns, 0) || typeof run.gameOver !== 'boolean') return null;
  const boardHighest = board.reduce<number>((highest, cell) => cell === null ? highest : Math.max(highest, cell), 1);
  if (boardHighest > run.highestTier) return null;
  if (run.highestTier < 3 && run.queue.some(piece => piece !== 1)) return null;
  if (run.gameOver !== isRunOver(board, run.sunlight)) return null;
  return {
    seed: run.seed,
    rngState: run.rngState,
    board,
    queue: [run.queue[0], run.queue[1], run.queue[2]],
    score: run.score,
    sunlight: run.sunlight,
    highestTier: run.highestTier,
    ancientBlooms: run.ancientBlooms,
    turns: run.turns,
    gameOver: run.gameOver,
  };
}

export function decodeMergroveSave(value: unknown): MergroveSave | null {
  if (!value || typeof value !== 'object') return null;
  const save = value as Partial<MergroveSave>;
  if (!isIntegerIn(save.bestScore, 0) || !isIntegerIn(save.bestTier, 1, MAX_TIER)) return null;
  let activeRun: MergroveRun | null = null;
  if (save.activeRun !== null) {
    activeRun = decodeRun(save.activeRun);
    if (!activeRun || save.bestTier < activeRun.highestTier) return null;
  }
  return { bestScore: save.bestScore, bestTier: save.bestTier, activeRun };
}

export const mergroveSaveDefinition: GameSaveDefinition<MergroveSave> = {
  slug: 'mergrove',
  schemaVersion: 1,
  storageKey: 'inmogames:mergrove:v1',
  initial: { bestScore: 0, bestTier: 1, activeRun: null },
  decode: decodeMergroveSave,
};
