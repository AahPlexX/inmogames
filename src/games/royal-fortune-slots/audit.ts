import { evaluateLineSymbols } from './engine';
import { BASE_FREE_SPINS, SCATTER_PAYOUT_MULTIPLIER, type RoyalFortuneWager } from './paytable';
import { PAYLINES, REEL_STRIPS, SYMBOLS, projectReelWindow, type RoyalFortuneSymbol } from './reels';

export const CONFIGURED_TOTAL_RETURN_RATIO = 0.9943076586882423;

export interface RoyalFortuneBaseAudit {
  lineReturnRatio: number;
  scatterReturnRatio: number;
  baseReturnRatio: number;
  winningSpinProbability: number;
  featureEntryProbability: number;
  expectedBaseFreeSpinsAwarded: number;
  scatterCountProbability: readonly number[];
}

export interface RoyalFortuneFullAudit extends RoyalFortuneBaseAudit {
  freeSpinRetriggerProbability: number;
  expectedFeaturePayoutByInitialSpins: Readonly<Record<8 | 12 | 20, number>>;
  featureReturnRatio: number;
  totalReturnRatio: number;
}

function symbolCounts(reel: readonly RoyalFortuneSymbol[]): Map<RoyalFortuneSymbol, number> {
  const counts = new Map<RoyalFortuneSymbol, number>();
  for (const symbol of reel) counts.set(symbol, (counts.get(symbol) ?? 0) + 1);
  return counts;
}

function scatterWindowCounts(reel: readonly RoyalFortuneSymbol[]): number[] {
  const counts = [0, 0, 0, 0];
  for (let stop = 0; stop < reel.length; stop += 1) {
    const scatterCount = projectReelWindow(reel, stop).filter((symbol) => symbol === 'Scatter').length;
    counts[scatterCount] += 1;
  }
  return counts;
}

function scatterWindowDistribution(reel: readonly RoyalFortuneSymbol[]): number[] {
  return scatterWindowCounts(reel).map((count) => count / reel.length);
}

function convolve(left: readonly number[], right: readonly number[]): number[] {
  const result = Array.from({ length: left.length + right.length - 1 }, () => 0);
  for (let a = 0; a < left.length; a += 1) for (let b = 0; b < right.length; b += 1) result[a + b] += left[a] * right[b];
  return result;
}

function isPayingThreeSymbolPrefix(symbols: readonly RoyalFortuneSymbol[]): boolean {
  let target: RoyalFortuneSymbol | null = null;
  for (const symbol of symbols) {
    if (symbol === 'Scatter') return false;
    if (symbol === 'Wild') continue;
    if (target === null) target = symbol;
    else if (symbol !== target) return false;
  }
  return true;
}

function countWinningStopCombinations(): number {
  const tailScatterCounts = convolve(scatterWindowCounts(REEL_STRIPS[3]), scatterWindowCounts(REEL_STRIPS[4]));
  const tailCombinations = REEL_STRIPS[3].length * REEL_STRIPS[4].length;
  let winning = 0;

  for (let stop0 = 0; stop0 < REEL_STRIPS[0].length; stop0 += 1) {
    const column0 = projectReelWindow(REEL_STRIPS[0], stop0);
    for (let stop1 = 0; stop1 < REEL_STRIPS[1].length; stop1 += 1) {
      const column1 = projectReelWindow(REEL_STRIPS[1], stop1);
      for (let stop2 = 0; stop2 < REEL_STRIPS[2].length; stop2 += 1) {
        const column2 = projectReelWindow(REEL_STRIPS[2], stop2);
        const hasLineWin = PAYLINES.some((line) => isPayingThreeSymbolPrefix([column0[line[0]], column1[line[1]], column2[line[2]]]));
        if (hasLineWin) {
          winning += tailCombinations;
          continue;
        }
        const firstThreeScatterCount = [...column0, ...column1, ...column2].filter((symbol) => symbol === 'Scatter').length;
        for (let tailScatters = 0; tailScatters < tailScatterCounts.length; tailScatters += 1) {
          if (firstThreeScatterCount + tailScatters >= 3) winning += tailScatterCounts[tailScatters];
        }
      }
    }
  }
  return winning;
}

export function auditRoyalFortuneBaseGame(wager: RoyalFortuneWager = 5): RoyalFortuneBaseAudit {
  const reelCounts = REEL_STRIPS.map(symbolCounts);
  const totalStopCombinations = REEL_STRIPS.reduce((product, reel) => product * reel.length, 1);
  let weightedLinePayout = 0;
  const sequence: RoyalFortuneSymbol[] = Array(5).fill('J');

  function walk(reelIndex: number, weight: number) {
    if (reelIndex === 5) {
      weightedLinePayout += (evaluateLineSymbols(sequence, wager)?.payout ?? 0) * weight;
      return;
    }
    for (const symbol of SYMBOLS) {
      const count = reelCounts[reelIndex].get(symbol) ?? 0;
      if (!count) continue;
      sequence[reelIndex] = symbol;
      walk(reelIndex + 1, weight * count);
    }
  }
  walk(0, 1);
  const expectedSingleLinePayout = weightedLinePayout / totalStopCombinations;
  const lineReturnRatio = expectedSingleLinePayout * PAYLINES.length / wager;

  let scatterDistribution: number[] = [1];
  for (const reel of REEL_STRIPS) scatterDistribution = convolve(scatterDistribution, scatterWindowDistribution(reel));
  const scatterReturnRatio = scatterDistribution.reduce((sum, probability, count) => sum + probability * (SCATTER_PAYOUT_MULTIPLIER[count] ?? 0), 0);
  const featureEntryProbability = scatterDistribution.slice(3).reduce((sum, probability) => sum + probability, 0);
  const expectedBaseFreeSpinsAwarded = scatterDistribution.reduce((sum, probability, count) => sum + probability * (BASE_FREE_SPINS[count] ?? 0), 0);

  return {
    lineReturnRatio,
    scatterReturnRatio,
    baseReturnRatio: lineReturnRatio + scatterReturnRatio,
    winningSpinProbability: countWinningStopCombinations() / totalStopCombinations,
    featureEntryProbability,
    expectedBaseFreeSpinsAwarded,
    scatterCountProbability: scatterDistribution,
  };
}

export function auditRoyalFortuneFullGame(wager: RoyalFortuneWager = 5): RoyalFortuneFullAudit {
  const base = auditRoyalFortuneBaseGame(wager);
  const retriggerProbability = base.featureEntryProbability;
  const winProbability = base.winningSpinProbability;
  const noWinProbability = 1 - winProbability;
  const winWithoutRetriggerProbability = winProbability - retriggerProbability;
  const expectedLinePayoutAtMultiplierOne = base.lineReturnRatio * wager;
  const expectedScatterPayout = base.scatterReturnRatio * wager;
  const maxInitialSpins = 20;
  const values = Array.from({ length: 6 }, () => Array(maxInitialSpins + 17).fill(0));

  const multiplierFivePerQueuedSpin = (5 * expectedLinePayoutAtMultiplierOne + expectedScatterPayout) / (1 - 5 * retriggerProbability);
  for (let queued = 0; queued < values[5].length; queued += 1) values[5][queued] = queued * multiplierFivePerQueuedSpin;

  for (let multiplier = 4; multiplier >= 1; multiplier -= 1) {
    const maxQueued = maxInitialSpins + 4 * (multiplier - 1);
    for (let queued = 1; queued <= maxQueued; queued += 1) {
      const currentExpectedPayout = multiplier * expectedLinePayoutAtMultiplierOne + expectedScatterPayout;
      values[multiplier][queued] = currentExpectedPayout
        + noWinProbability * values[multiplier][queued - 1]
        + winWithoutRetriggerProbability * values[multiplier + 1][queued - 1]
        + retriggerProbability * values[multiplier + 1][queued + 4];
    }
  }

  const expectedFeaturePayoutByInitialSpins = {
    8: values[1][8],
    12: values[1][12],
    20: values[1][20],
  } as const;
  const expectedFeaturePayout = (base.scatterCountProbability[3] ?? 0) * expectedFeaturePayoutByInitialSpins[8]
    + (base.scatterCountProbability[4] ?? 0) * expectedFeaturePayoutByInitialSpins[12]
    + (base.scatterCountProbability[5] ?? 0) * expectedFeaturePayoutByInitialSpins[20];
  const featureReturnRatio = expectedFeaturePayout / wager;

  return {
    ...base,
    freeSpinRetriggerProbability: retriggerProbability,
    expectedFeaturePayoutByInitialSpins,
    featureReturnRatio,
    totalReturnRatio: base.baseReturnRatio + featureReturnRatio,
  };
}
