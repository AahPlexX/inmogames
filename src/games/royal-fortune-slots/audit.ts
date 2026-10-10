import { evaluateLineSymbols } from './engine';
import { BASE_FREE_SPINS, SCATTER_PAYOUT_MULTIPLIER, type RoyalFortuneWager } from './paytable';
import { REEL_STRIPS, SYMBOLS, projectReelWindow, type RoyalFortuneSymbol } from './reels';

export interface RoyalFortuneBaseAudit {
  lineReturnRatio: number;
  scatterReturnRatio: number;
  baseReturnRatio: number;
  featureEntryProbability: number;
  expectedBaseFreeSpinsAwarded: number;
  scatterCountProbability: readonly number[];
}

function symbolCounts(reel: readonly RoyalFortuneSymbol[]): Map<RoyalFortuneSymbol, number> {
  const counts = new Map<RoyalFortuneSymbol, number>();
  for (const symbol of reel) counts.set(symbol, (counts.get(symbol) ?? 0) + 1);
  return counts;
}

function scatterWindowDistribution(reel: readonly RoyalFortuneSymbol[]): number[] {
  const counts = [0, 0, 0, 0];
  for (let stop = 0; stop < reel.length; stop += 1) {
    const scatterCount = projectReelWindow(reel, stop).filter((symbol) => symbol === 'Scatter').length;
    counts[scatterCount] += 1;
  }
  return counts.map((count) => count / reel.length);
}

function convolve(left: readonly number[], right: readonly number[]): number[] {
  const result = Array.from({ length: left.length + right.length - 1 }, () => 0);
  for (let a = 0; a < left.length; a += 1) for (let b = 0; b < right.length; b += 1) result[a + b] += left[a] * right[b];
  return result;
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
  const lineReturnRatio = expectedSingleLinePayout * 20 / wager;

  let scatterDistribution: number[] = [1];
  for (const reel of REEL_STRIPS) scatterDistribution = convolve(scatterDistribution, scatterWindowDistribution(reel));
  const scatterReturnRatio = scatterDistribution.reduce((sum, probability, count) => sum + probability * (SCATTER_PAYOUT_MULTIPLIER[count] ?? 0), 0);
  const featureEntryProbability = scatterDistribution.slice(3).reduce((sum, probability) => sum + probability, 0);
  const expectedBaseFreeSpinsAwarded = scatterDistribution.reduce((sum, probability, count) => sum + probability * (BASE_FREE_SPINS[count] ?? 0), 0);

  return {
    lineReturnRatio,
    scatterReturnRatio,
    baseReturnRatio: lineReturnRatio + scatterReturnRatio,
    featureEntryProbability,
    expectedBaseFreeSpinsAwarded,
    scatterCountProbability: scatterDistribution,
  };
}
