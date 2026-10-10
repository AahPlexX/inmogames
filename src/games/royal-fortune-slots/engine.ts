import { BASE_FREE_SPINS, FREE_SPIN_RETRIGGER, MAX_FREE_SPIN_MULTIPLIER, NORMAL_PAYTABLE, SCATTER_PAYOUT_MULTIPLIER, isRoyalFortuneWager, type RoyalFortuneWager } from './paytable';
import { PAYLINES, SYMBOLS, type ReelWindow, type RoyalFortuneSymbol } from './reels';

type NormalSymbol = Exclude<RoyalFortuneSymbol, 'Wild' | 'Scatter'>;
export type SpinMode = 'base' | 'free';
export interface WinningCell { reel: number; row: number }
export interface LineWin {
  lineIndex: number;
  symbol: NormalSymbol;
  count: 3 | 4 | 5;
  payout: number;
  cells: readonly WinningCell[];
}
export interface SpinEvaluation {
  mode: SpinMode;
  wager: RoyalFortuneWager;
  lineWins: readonly LineWin[];
  linePayout: number;
  scatterCount: number;
  scatterPayout: number;
  totalPayout: number;
  freeSpinsAwarded: number;
  multiplier: number;
  nextMultiplier: number;
}
export interface RoyalFortuneFeatureState { remaining: number; wager: RoyalFortuneWager; multiplier: number }

const normalSymbols = SYMBOLS.filter((symbol): symbol is NormalSymbol => symbol !== 'Wild' && symbol !== 'Scatter');

function assertWindow(window: ReelWindow): void {
  if (!Array.isArray(window) || window.length !== 5 || window.some((column) => !Array.isArray(column) || column.length !== 3)) {
    throw new RangeError('Royal Fortune requires a five-reel, three-row window.');
  }
  for (const column of window) for (const symbol of column) if (!SYMBOLS.includes(symbol)) throw new RangeError('Unknown Royal Fortune symbol.');
}

function bestAllWildSymbol(count: 3 | 4 | 5): NormalSymbol {
  return normalSymbols.reduce((best, symbol) => NORMAL_PAYTABLE[symbol][count] > NORMAL_PAYTABLE[best][count] ? symbol : best, normalSymbols[0]);
}

function evaluateLine(window: ReelWindow, lineIndex: number, wager: RoyalFortuneWager, multiplier: number): LineWin | null {
  const line = PAYLINES[lineIndex];
  let target: NormalSymbol | null = null;
  let count = 0;
  for (let reel = 0; reel < line.length; reel += 1) {
    const symbol = window[reel][line[reel]];
    if (symbol === 'Scatter') break;
    if (symbol === 'Wild') { count += 1; continue; }
    if (target === null) { target = symbol; count += 1; continue; }
    if (symbol !== target) break;
    count += 1;
  }
  if (count < 3) return null;
  const payableCount = count as 3 | 4 | 5;
  const payableSymbol = target ?? bestAllWildSymbol(payableCount);
  const payout = NORMAL_PAYTABLE[payableSymbol][payableCount] * (wager / 5) * multiplier;
  return {
    lineIndex,
    symbol: payableSymbol,
    count: payableCount,
    payout,
    cells: line.slice(0, payableCount).map((row, reel) => ({ reel, row })),
  };
}

export function evaluateSpin(window: ReelWindow, wager: number, mode: SpinMode = 'base', multiplier = 1): SpinEvaluation {
  assertWindow(window);
  if (!isRoyalFortuneWager(wager)) throw new RangeError('Unsupported Royal Fortune wager.');
  if (!Number.isSafeInteger(multiplier) || multiplier < 1 || multiplier > MAX_FREE_SPIN_MULTIPLIER) throw new RangeError('Invalid free-spin multiplier.');
  const appliedMultiplier = mode === 'free' ? multiplier : 1;
  const lineWins = PAYLINES.map((_, lineIndex) => evaluateLine(window, lineIndex, wager, appliedMultiplier)).filter((win): win is LineWin => win !== null);
  const linePayout = lineWins.reduce((sum, win) => sum + win.payout, 0);
  const scatterCount = window.reduce((total, column) => total + column.filter((symbol) => symbol === 'Scatter').length, 0);
  const scatterPayout = wager * (SCATTER_PAYOUT_MULTIPLIER[scatterCount] ?? 0);
  const totalPayout = linePayout + scatterPayout;
  const freeSpinsAwarded = mode === 'base'
    ? (BASE_FREE_SPINS[scatterCount] ?? 0)
    : scatterCount >= 3 ? FREE_SPIN_RETRIGGER : 0;
  const nextMultiplier = mode === 'free' && totalPayout > 0 ? Math.min(MAX_FREE_SPIN_MULTIPLIER, appliedMultiplier + 1) : appliedMultiplier;
  return { mode, wager, lineWins, linePayout, scatterCount, scatterPayout, totalPayout, freeSpinsAwarded, multiplier: appliedMultiplier, nextMultiplier };
}

export function featureAfterBaseSpin(evaluation: SpinEvaluation): RoyalFortuneFeatureState | null {
  if (evaluation.mode !== 'base' || evaluation.freeSpinsAwarded <= 0) return null;
  return { remaining: evaluation.freeSpinsAwarded, wager: evaluation.wager, multiplier: 1 };
}

export function featureAfterFreeSpin(feature: RoyalFortuneFeatureState, evaluation: SpinEvaluation): RoyalFortuneFeatureState | null {
  if (evaluation.mode !== 'free' || evaluation.wager !== feature.wager) throw new Error('Free-spin result does not match the active feature.');
  const remaining = feature.remaining - 1 + evaluation.freeSpinsAwarded;
  return remaining > 0 ? { remaining, wager: feature.wager, multiplier: evaluation.nextMultiplier } : null;
}
