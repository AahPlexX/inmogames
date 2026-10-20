import { describe, expect, it } from 'vitest';
import { advanceVaultRunAfterSpin, type ResolveSpinResult } from '../../src/games/cascade-vault/engine';
import { CREDIT_SCALE } from '../../src/games/cascade-vault/paytable';
import {
  cascadeVaultSaveDefinition,
  restorePracticeCredits,
  settleCascadeVaultBaseSpin,
  settleCascadeVaultFreeSpin,
} from '../../src/games/cascade-vault/persistence';
import {
  DEFAULT_SAVE,
  STORAGE_KEY,
  decodeCascadeVaultSave,
} from '../../src/games/cascade-vault/storage';

function resolved(overrides: Partial<ResolveSpinResult> = {}): ResolveSpinResult {
  return {
    mode: 'base',
    initialBoard: [] as unknown as ResolveSpinResult['initialBoard'],
    finalBoard: [] as unknown as ResolveSpinResult['finalBoard'],
    cascades: [],
    totalAwardUnits: 0,
    initialScatterCount: 0,
    triggeredVaultRunSpins: 0,
    nextVaultState: null,
    ...overrides,
  } as ResolveSpinResult;
}

describe('Cascade Vault persistence', () => {
  it('defines schema v1 and decodes a 5,000-credit settled default save', () => {
    expect(cascadeVaultSaveDefinition).toMatchObject({
      slug: 'cascade-vault',
      schemaVersion: 1,
      storageKey: STORAGE_KEY,
      initial: DEFAULT_SAVE,
    });
    expect(DEFAULT_SAVE).toMatchObject({
      bankrollUnits: 5_000 * CREDIT_SCALE,
      selectedWager: 10,
      paidSpins: 0,
      freeSpins: 0,
      feature: null,
      preferences: { sound: false, reducedEffects: false },
    });
    expect(decodeCascadeVaultSave(DEFAULT_SAVE)).toEqual(DEFAULT_SAVE);
  });

  it('rejects malformed accounting, unsupported wagers, and impossible active feature checkpoints', () => {
    expect(decodeCascadeVaultSave({ ...DEFAULT_SAVE, selectedWager: 30 })).toBeNull();
    expect(decodeCascadeVaultSave({ ...DEFAULT_SAVE, bankrollUnits: -1 })).toBeNull();
    expect(decodeCascadeVaultSave({ ...DEFAULT_SAVE, totalWonUnits: Number.NaN })).toBeNull();
    expect(decodeCascadeVaultSave({ ...DEFAULT_SAVE, netUnits: 1 })).toBeNull();
    expect(decodeCascadeVaultSave({
      ...DEFAULT_SAVE,
      feature: { remainingSpins: 0, persistentMultiplier: 2, meterLevel: 0, stepThreeAwarded: false },
    })).toBeNull();
  });

  it('settles one paid spin exactly and starts a triggered Vault Run without persisting boards', () => {
    const next = settleCascadeVaultBaseSpin(DEFAULT_SAVE, resolved({
      totalAwardUnits: 125,
      initialScatterCount: 4,
      triggeredVaultRunSpins: 8,
    }));

    expect(next).toMatchObject({
      bankrollUnits: 499_125,
      paidSpins: 1,
      freeSpins: 0,
      totalWageredUnits: 1_000,
      totalWonUnits: 125,
      netUnits: -875,
      largestSpinWinUnits: 125,
      feature: { remainingSpins: 8, persistentMultiplier: 2, meterLevel: 0, stepThreeAwarded: false },
      lastResult: { mode: 'base', wagerCredits: 10, awardUnits: 125, initialScatterCount: 4, triggeredVaultRunSpins: 8 },
    });
    expect(next.lastResult).not.toHaveProperty('initialBoard');
    expect(next.lastResult).not.toHaveProperty('finalBoard');
    expect(DEFAULT_SAVE.bankrollUnits).toBe(500_000);
  });

  it('settles a free spin without a wager and counts Vault completion exactly once', () => {
    const feature = { remainingSpins: 1, persistentMultiplier: 2, meterLevel: 0 as const, stepThreeAwarded: false };
    const state = { ...DEFAULT_SAVE, feature };
    const next = settleCascadeVaultFreeSpin(state, resolved({
      mode: 'vault',
      totalAwardUnits: 250,
      nextVaultState: null,
    }));

    expect(next).toMatchObject({
      bankrollUnits: 500_250,
      paidSpins: 0,
      freeSpins: 1,
      totalWageredUnits: 0,
      totalWonUnits: 250,
      netUnits: 250,
      completedVaultRuns: 1,
      feature: null,
    });
    expect(() => settleCascadeVaultFreeSpin(next, resolved({ mode: 'vault' }))).toThrow(/active Vault Run/i);
  });

  it('validates ongoing free-spin checkpoints against the engine transition', () => {
    const feature = { remainingSpins: 3, persistentMultiplier: 2, meterLevel: 0 as const, stepThreeAwarded: false };
    const expected = advanceVaultRunAfterSpin(feature, { winningCascades: 0, initialScatterCount: 0 });
    const state = { ...DEFAULT_SAVE, feature };
    expect(settleCascadeVaultFreeSpin(state, resolved({ mode: 'vault', nextVaultState: expected })).feature).toEqual(expected);
    expect(() => settleCascadeVaultFreeSpin(state, resolved({
      mode: 'vault',
      nextVaultState: { ...expected, persistentMultiplier: 7 },
    }))).toThrow(/checkpoint|state|transition/i);
  });

  it('rejects unaffordable paid settlement and restores only an exhausted settled bankroll', () => {
    expect(() => settleCascadeVaultBaseSpin({ ...DEFAULT_SAVE, bankrollUnits: 999 }, resolved())).toThrow(/bankroll|available|afford/i);
    const exhausted = {
      ...DEFAULT_SAVE,
      bankrollUnits: 999,
      paidSpins: 7,
      totalWageredUnits: 20_000,
      totalWonUnits: 4_000,
      netUnits: -16_000,
      completedVaultRuns: 2,
      preferences: { sound: true, reducedEffects: true },
    };
    expect(restorePracticeCredits(exhausted)).toEqual({ ...exhausted, bankrollUnits: 500_000 });
    expect(restorePracticeCredits({ ...exhausted, bankrollUnits: 1_000 })).toBeNull();
    expect(restorePracticeCredits({
      ...exhausted,
      feature: { remainingSpins: 1, persistentMultiplier: 2, meterLevel: 0, stepThreeAwarded: false },
    })).toBeNull();
  });
});
