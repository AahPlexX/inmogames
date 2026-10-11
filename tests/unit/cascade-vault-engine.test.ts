import { describe, expect, it } from 'vitest';
import {
  advanceVaultRunAfterSpin,
  collapseAndRefill,
  createInitialBoard,
  evaluateWays,
  resolveSpin,
  vaultRunSpinsForScatters,
  type Board,
  type VaultRunState,
} from '../../src/games/cascade-vault/engine';
import { CREDIT_SCALE } from '../../src/games/cascade-vault/paytable';
import type { VaultRandomSource, VaultSymbol } from '../../src/games/cascade-vault/symbols';

const S: VaultSymbol = 'scatter';

function board(reels: VaultSymbol[][]): Board {
  expect(reels).toHaveLength(6);
  for (const reel of reels) expect(reel).toHaveLength(5);
  return reels as Board;
}

function key({ reel, row }: { reel: number; row: number }): string {
  return `${reel}:${row}`;
}

function queuedSource(symbols: VaultSymbol[], fallback: VaultSymbol = 'quartz', pick = 0) {
  const contexts: Array<'initial' | 'refill'> = [];
  const queue = [...symbols];
  const source: VaultRandomSource = {
    drawSymbol(context) {
      contexts.push(context);
      return queue.shift() ?? fallback;
    },
    nextInt(maxExclusive) {
      if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) throw new RangeError('maxExclusive');
      return Math.min(pick, maxExclusive - 1);
    },
  };
  return { source, contexts };
}

const singleQuartzBoard = () => board([
  ['quartz', 'silver', 'gold', 'sapphire', 'emerald'],
  ['quartz', 'ruby', 'vault_crown', S, 'silver'],
  ['quartz', 'gold', 'sapphire', 'emerald', 'ruby'],
  ['copper', 'emerald', 'ruby', 'gold', 'sapphire'],
  ['silver', 'gold', 'sapphire', 'emerald', 'ruby'],
  ['vault_crown', 'copper', 'silver', 'gold', 'sapphire'],
]);

describe('Cascade Vault engine', () => {
  it('counts adjacent-reel ways from reel 1 and preserves fractional paytable awards exactly', () => {
    const result = evaluateWays(board([
      ['quartz', 'quartz', S, S, S],
      ['quartz', S, S, S, S],
      ['quartz', 'quartz', S, S, S],
      [S, S, S, S, S],
      [S, S, S, S, S],
      [S, S, S, S, S],
    ]), 10, { cascadeMultiplier: 1, featureBoost: false });

    expect(CREDIT_SCALE).toBe(100);
    expect(result.wins).toHaveLength(1);
    expect(result.wins[0]).toMatchObject({ symbol: 'quartz', consecutiveReels: 3, ways: 4, awardUnits: 400 });
    expect(result.totalAwardUnits).toBe(400);
    expect(new Set(result.removals.map(key))).toEqual(new Set(['0:0', '0:1', '1:0', '2:0', '2:1']));
  });

  it.each([
    [3, 1_500],
    [4, 5_000],
    [5, 15_000],
    [6, 40_000],
  ] as const)('applies the Vault Crown paytable for %i consecutive reels', (reelCount, expectedUnits) => {
    const reels = Array.from({ length: 6 }, (_, reelIndex) => (
      Array.from({ length: 5 }, (_, row) => reelIndex < reelCount && row === 0 ? 'vault_crown' : 'scatter') as VaultSymbol[]
    ));
    const result = evaluateWays(board(reels), 10, { cascadeMultiplier: 1, featureBoost: false });
    expect(result.wins).toHaveLength(1);
    expect(result.wins[0]).toMatchObject({ symbol: 'vault_crown', consecutiveReels: reelCount, ways: 1, awardUnits: expectedUnits });
  });

  it('deduplicates an all-Wild way to its highest valid symbol interpretation', () => {
    const result = evaluateWays(board([
      ['wild', S, S, S, S],
      ['wild', S, S, S, S],
      ['wild', S, S, S, S],
      [S, S, S, S, S],
      [S, S, S, S, S],
      [S, S, S, S, S],
    ]), 10, { cascadeMultiplier: 1, featureBoost: false });

    expect(result.wins).toHaveLength(1);
    expect(result.wins[0]).toMatchObject({ symbol: 'vault_crown', ways: 1, awardUnits: 1_500 });
    expect(new Set(result.removals.map(key))).toEqual(new Set(['0:0', '1:0', '2:0']));
  });

  it('evaluates simultaneous symbol wins from one immutable board and unions removals', () => {
    const result = evaluateWays(board([
      ['quartz', 'copper', S, S, S],
      ['quartz', 'copper', S, S, S],
      ['quartz', 'copper', S, S, S],
      [S, S, S, S, S],
      [S, S, S, S, S],
      [S, S, S, S, S],
    ]), 10, { cascadeMultiplier: 1, featureBoost: false });

    expect(result.wins.map((win) => win.symbol)).toEqual(['quartz', 'copper']);
    expect(result.totalAwardUnits).toBe(250);
    expect(new Set(result.removals.map(key))).toEqual(new Set(['0:0', '0:1', '1:0', '1:1', '2:0', '2:1']));
  });

  it('applies the Vault Run ×1.5 boost after the persistent cascade multiplier with integer centi-credit accounting', () => {
    const result = evaluateWays(board([
      ['copper', S, S, S, S],
      ['copper', S, S, S, S],
      ['copper', S, S, S, S],
      [S, S, S, S, S],
      [S, S, S, S, S],
      [S, S, S, S, S],
    ]), 10, { cascadeMultiplier: 2, featureBoost: true });

    expect(result.totalAwardUnits).toBe(450);
    expect(result.wins[0].awardUnits).toBe(450);
  });

  it('applies gravity, refills only vacancies, and can inject exactly one feature Wild into the refill set', () => {
    const original = board([
      ['quartz', 'copper', 'silver', 'gold', 'ruby'],
      ['emerald', 'sapphire', 'ruby', 'gold', 'silver'],
      [S, S, S, S, S],
      [S, S, S, S, S],
      [S, S, S, S, S],
      [S, S, S, S, S],
    ]);
    const { source, contexts } = queuedSource(['emerald', 'sapphire', 'quartz'], 'gold', 2);
    const next = collapseAndRefill(original, [
      { reel: 0, row: 3 },
      { reel: 0, row: 4 },
      { reel: 1, row: 4 },
    ], source, { forceWildOnRefill: true });

    expect(next[0]).toEqual(['emerald', 'sapphire', 'quartz', 'copper', 'silver']);
    expect(next[1][0]).toBe('wild');
    expect(next[1].slice(1)).toEqual(['emerald', 'sapphire', 'ruby', 'gold']);
    expect(contexts).toEqual(['refill', 'refill', 'refill']);
    expect(next.flat().filter((symbol) => symbol === 'wild')).toHaveLength(1);
  });

  it('uses initial-only draws for the 6×5 starting board', () => {
    const { source, contexts } = queuedSource(Array.from({ length: 30 }, () => 'scatter'));
    const initial = createInitialBoard(source);
    expect(initial).toHaveLength(6);
    expect(initial.every((reel) => reel.length === 5)).toBe(true);
    expect(initial.flat().every((symbol) => symbol === 'scatter')).toBe(true);
    expect(contexts).toEqual(Array.from({ length: 30 }, () => 'initial'));
  });

  it.each([
    [3, 0],
    [4, 8],
    [5, 10],
    [6, 12],
    [9, 12],
  ] as const)('maps %i initial Scatters to %i Vault Run spins', (scatterCount, expected) => {
    expect(vaultRunSpinsForScatters(scatterCount)).toBe(expected);
  });

  it('advances the Vault meter at most once per free spin, persists multiplier growth, awards step 3 once, and caps retriggers at 20', () => {
    const start: VaultRunState = { remainingSpins: 8, persistentMultiplier: 2, meterLevel: 0, stepThreeAwarded: false };
    const step1 = advanceVaultRunAfterSpin(start, { winningCascades: 3, initialScatterCount: 0 });
    expect(step1).toEqual({ remainingSpins: 7, persistentMultiplier: 5, meterLevel: 1, stepThreeAwarded: false });

    const step2 = advanceVaultRunAfterSpin(step1, { winningCascades: 4, initialScatterCount: 0 });
    expect(step2).toEqual({ remainingSpins: 6, persistentMultiplier: 9, meterLevel: 2, stepThreeAwarded: false });

    const step3 = advanceVaultRunAfterSpin(step2, { winningCascades: 3, initialScatterCount: 0 });
    expect(step3).toEqual({ remainingSpins: 8, persistentMultiplier: 12, meterLevel: 3, stepThreeAwarded: true });

    const noRepeat = advanceVaultRunAfterSpin(step3, { winningCascades: 3, initialScatterCount: 0 });
    expect(noRepeat).toEqual({ remainingSpins: 7, persistentMultiplier: 15, meterLevel: 3, stepThreeAwarded: true });

    const capped = advanceVaultRunAfterSpin({ remainingSpins: 19, persistentMultiplier: 19, meterLevel: 3, stepThreeAwarded: true }, { winningCascades: 5, initialScatterCount: 4 });
    expect(capped).toEqual({ remainingSpins: 20, persistentMultiplier: 20, meterLevel: 3, stepThreeAwarded: true });
  });

  it('resolves ordered cascades with base multiplier progression and no Scatter generation in refills', () => {
    const { source, contexts } = queuedSource(['copper', 'copper', 'copper', 'vault_crown', 'quartz', 'copper']);
    const result = resolveSpin({ mode: 'base', wagerCredits: 10, initialBoard: singleQuartzBoard(), random: source });

    expect(result.cascades).toHaveLength(2);
    expect(result.cascades.map((cascade) => cascade.multiplier)).toEqual([1, 2]);
    expect(result.cascades.map((cascade) => cascade.evaluation.wins[0].symbol)).toEqual(['quartz', 'copper']);
    expect(result.totalAwardUnits).toBe(400);
    expect(contexts).toEqual(['refill', 'refill', 'refill', 'refill', 'refill', 'refill']);
  });

  it('throws an explicit corruption error rather than silently accepting a 51st winning cascade', () => {
    const alwaysQuartz = queuedSource([], 'quartz').source;
    const allQuartz = board(Array.from({ length: 6 }, () => Array.from({ length: 5 }, () => 'quartz') as VaultSymbol[]));
    expect(() => resolveSpin({ mode: 'base', wagerCredits: 10, initialBoard: allQuartz, random: alwaysQuartz })).toThrow(/50|cascade limit|corrupt/i);
  });
});
