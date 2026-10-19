import { describe, expect, it } from 'vitest';
import { CREDIT_SCALE } from '../../src/games/cascade-vault/paytable';
import {
  createSeededIntegerSource,
  simulateCascadeVaultPaidSpin,
  simulateCascadeVaultPaidSpins,
} from '../../src/games/cascade-vault/simulation';
import type { VaultRandomSource, VaultSymbol } from '../../src/games/cascade-vault/symbols';

function queuedSource(symbols: VaultSymbol[]): VaultRandomSource & { remaining(): number } {
  const queue = [...symbols];
  return {
    drawSymbol() {
      const symbol = queue.shift();
      if (!symbol) throw new Error('Cascade Vault simulation fixture exhausted.');
      return symbol;
    },
    nextInt(maxExclusive) {
      if (!Number.isSafeInteger(maxExclusive) || maxExclusive <= 0) throw new RangeError('maxExclusive');
      return 0;
    },
    remaining() {
      return queue.length;
    },
  };
}

const quietBoard = (): VaultSymbol[][] => [
  Array(5).fill('quartz'),
  Array(5).fill('copper'),
  Array(5).fill('silver'),
  Array(5).fill('gold'),
  Array(5).fill('sapphire'),
  Array(5).fill('emerald'),
] as VaultSymbol[][];


const singleQuartzBoard = (): VaultSymbol[][] => [
  ['quartz', 'silver', 'gold', 'sapphire', 'emerald'],
  ['quartz', 'ruby', 'vault_crown', 'scatter', 'silver'],
  ['quartz', 'gold', 'sapphire', 'emerald', 'ruby'],
  ['silver', 'emerald', 'ruby', 'gold', 'sapphire'],
  ['silver', 'gold', 'sapphire', 'emerald', 'ruby'],
  ['vault_crown', 'copper', 'silver', 'gold', 'sapphire'],
];

function constantSource(symbol: VaultSymbol): VaultRandomSource {
  return {
    drawSymbol() {
      return symbol;
    },
    nextInt(maxExclusive) {
      if (!Number.isSafeInteger(maxExclusive) || maxExclusive <= 0) throw new RangeError('maxExclusive');
      return 0;
    },
  };
}

function triggeringBoard(): VaultSymbol[][] {
  const board = quietBoard().map((reel) => [...reel]);
  board[5] = ['scatter', 'scatter', 'scatter', 'scatter', 'emerald'];
  return board;
}

describe('Cascade Vault probability simulation', () => {
  it('creates deterministic bounded integer sources without freezing a particular balance result', () => {
    const left = createSeededIntegerSource(0x5eed1234);
    const right = createSeededIntegerSource(0x5eed1234);
    for (const maxExclusive of [1, 2, 7, 100, 65_537]) {
      for (let draw = 0; draw < 20; draw += 1) {
        const value = left(maxExclusive);
        expect(value).toBe(right(maxExclusive));
        expect(Number.isSafeInteger(value)).toBe(true);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(maxExclusive);
      }
    }
    expect(() => left(0)).toThrow(/max|range|positive/i);
  });


  it('keeps the audit PRNG sequence stable for the published seed vector', () => {
    const source = createSeededIntegerSource(0x5eed1234);
    expect([1, 2, 7, 100, 65_537, 97, 10, 3].map((bound) => source(bound))).toEqual([
      0, 0, 1, 20, 817, 66, 8, 0,
    ]);
  });

  it('aggregates nonzero Vault Run value into the paid-spin sample', () => {
    const source = queuedSource([
      ...triggeringBoard().flat(),
      ...singleQuartzBoard().flat(),
      'vault_crown', 'copper', 'copper',
      ...Array.from({ length: 7 }, () => quietBoard().flat()).flat(),
    ]);
    const sample = simulateCascadeVaultPaidSpin(10, source);
    expect(sample).toEqual({
      awardUnits: 200,
      engineSpins: 9,
      winningCascades: 1,
      vaultEntered: true,
    });
    expect(source.remaining()).toBe(0);
  });

  it('streams a reproducible internally consistent report for the same seed', () => {
    const input = { paidSpins: 64, seed: 0x12345678, wagerCredits: 10 } as const;
    const report = simulateCascadeVaultPaidSpins(input);
    expect(simulateCascadeVaultPaidSpins(input)).toEqual(report);
    expect(report).toMatchObject(input);
    expect(report.totalWagerUnits).toBe(input.paidSpins * input.wagerCredits * CREDIT_SCALE);
    expect(Number.isSafeInteger(report.totalAwardUnits)).toBe(true);
    expect(report.totalAwardUnits).toBeGreaterThanOrEqual(0);
    expect(report.observedRtp).toBeCloseTo(report.totalAwardUnits / report.totalWagerUnits, 12);
    expect(report.standardError).toBeGreaterThanOrEqual(0);
    expect(report.ci95Low).toBeCloseTo(report.observedRtp - 1.96 * report.standardError, 12);
    expect(report.ci95High).toBeCloseTo(report.observedRtp + 1.96 * report.standardError, 12);
    expect(report.vaultEntries).toBeGreaterThanOrEqual(0);
    expect(report.vaultEntries).toBeLessThanOrEqual(input.paidSpins);
    expect(report.vaultEntryFrequency).toBeCloseTo(report.vaultEntries / input.paidSpins, 12);
    expect(report.totalEngineSpins).toBeGreaterThanOrEqual(input.paidSpins);
    expect(report.totalWinningCascades).toBeGreaterThanOrEqual(0);
    expect(report.averageCascadeDepth).toBeCloseTo(report.totalWinningCascades / input.paidSpins, 12);
    expect(report.corruptionGuardHits).toBe(0);
  });

  it('rejects invalid audit inputs instead of fabricating confidence statistics', () => {
    expect(() => simulateCascadeVaultPaidSpins({ paidSpins: 1, seed: 1, wagerCredits: 10 })).toThrow(/paid spins|sample|two/i);
  });


  it('propagates the 50-cascade corruption guard instead of emitting a zero-hit report', () => {
    expect(() => simulateCascadeVaultPaidSpin(10, constantSource('quartz'))).toThrow(/50|cascade limit|corrupt/i);
  });
});
