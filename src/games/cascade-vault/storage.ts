import type { VaultRunState } from './engine';
import { isCascadeVaultWager, type CascadeVaultWager } from './paytable';

export interface CascadeVaultPreferences {
  sound: boolean;
  reducedEffects: boolean;
}

export interface CascadeVaultResultSummary {
  mode: 'base' | 'vault';
  wagerCredits: CascadeVaultWager | null;
  awardUnits: number;
  winningCascades: number;
  initialScatterCount: number;
  triggeredVaultRunSpins: number;
}

export interface CascadeVaultSave {
  bankrollUnits: number;
  selectedWager: CascadeVaultWager;
  paidSpins: number;
  freeSpins: number;
  totalWageredUnits: number;
  totalWonUnits: number;
  netUnits: number;
  largestSpinWinUnits: number;
  highestCascadeChain: number;
  completedVaultRuns: number;
  preferences: CascadeVaultPreferences;
  lastResult: CascadeVaultResultSummary | null;
  feature: VaultRunState | null;
}

export const STORAGE_KEY = 'inmogames:cascade-vault:v1';

export const DEFAULT_SAVE: CascadeVaultSave = {
  bankrollUnits: 500_000,
  selectedWager: 10,
  paidSpins: 0,
  freeSpins: 0,
  totalWageredUnits: 0,
  totalWonUnits: 0,
  netUnits: 0,
  largestSpinWinUnits: 0,
  highestCascadeChain: 0,
  completedVaultRuns: 0,
  preferences: { sound: false, reducedEffects: false },
  lastResult: null,
  feature: null,
};

const nonNegativeSafeInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;

const signedSafeInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value);

function triggerSpins(scatterCount: number): number {
  if (scatterCount < 4) return 0;
  if (scatterCount === 4) return 8;
  if (scatterCount === 5) return 10;
  return 12;
}

function decodeFeature(value: unknown): VaultRunState | null | undefined {
  if (value === null) return null;
  if (!value || typeof value !== 'object') return undefined;
  const feature = value as Partial<VaultRunState>;
  if (
    !Number.isSafeInteger(feature.remainingSpins) || feature.remainingSpins! < 1 || feature.remainingSpins! > 20 ||
    !Number.isSafeInteger(feature.persistentMultiplier) || feature.persistentMultiplier! < 2 || feature.persistentMultiplier! > 20 ||
    !Number.isSafeInteger(feature.meterLevel) || ![0, 1, 2, 3].includes(feature.meterLevel as number) ||
    typeof feature.stepThreeAwarded !== 'boolean' || feature.stepThreeAwarded !== (feature.meterLevel === 3)
  ) return undefined;
  return {
    remainingSpins: feature.remainingSpins!,
    persistentMultiplier: feature.persistentMultiplier!,
    meterLevel: feature.meterLevel as VaultRunState['meterLevel'],
    stepThreeAwarded: feature.stepThreeAwarded,
  };
}

function decodeResult(value: unknown): CascadeVaultResultSummary | null | undefined {
  if (value === null) return null;
  if (!value || typeof value !== 'object') return undefined;
  const result = value as Partial<CascadeVaultResultSummary>;
  if (result.mode !== 'base' && result.mode !== 'vault') return undefined;
  if (!nonNegativeSafeInteger(result.awardUnits)) return undefined;
  if (!nonNegativeSafeInteger(result.winningCascades) || result.winningCascades > 50) return undefined;
  if (!nonNegativeSafeInteger(result.initialScatterCount) || result.initialScatterCount > 30) return undefined;
  if (!nonNegativeSafeInteger(result.triggeredVaultRunSpins) || result.triggeredVaultRunSpins > 12) return undefined;
  if (result.mode === 'base') {
    if (!isCascadeVaultWager(result.wagerCredits as number)) return undefined;
    if (result.triggeredVaultRunSpins !== triggerSpins(result.initialScatterCount)) return undefined;
  } else if (result.wagerCredits !== null || result.triggeredVaultRunSpins !== 0) {
    return undefined;
  }
  return {
    mode: result.mode,
    wagerCredits: result.wagerCredits as CascadeVaultWager | null,
    awardUnits: result.awardUnits,
    winningCascades: result.winningCascades,
    initialScatterCount: result.initialScatterCount,
    triggeredVaultRunSpins: result.triggeredVaultRunSpins,
  };
}

export function decodeCascadeVaultSave(value: unknown): CascadeVaultSave | null {
  if (!value || typeof value !== 'object') return null;
  const save = value as Partial<CascadeVaultSave>;
  if (!nonNegativeSafeInteger(save.bankrollUnits) || !isCascadeVaultWager(save.selectedWager as number)) return null;
  if (
    !nonNegativeSafeInteger(save.paidSpins) || !nonNegativeSafeInteger(save.freeSpins) ||
    !nonNegativeSafeInteger(save.totalWageredUnits) || !nonNegativeSafeInteger(save.totalWonUnits) ||
    !signedSafeInteger(save.netUnits) || !nonNegativeSafeInteger(save.largestSpinWinUnits) ||
    !nonNegativeSafeInteger(save.highestCascadeChain) || save.highestCascadeChain > 50 ||
    !nonNegativeSafeInteger(save.completedVaultRuns)
  ) return null;
  if (save.netUnits !== save.totalWonUnits - save.totalWageredUnits) return null;
  if (!save.preferences || typeof save.preferences.sound !== 'boolean' || typeof save.preferences.reducedEffects !== 'boolean') return null;
  const lastResult = decodeResult(save.lastResult ?? null);
  if (lastResult === undefined) return null;
  const feature = decodeFeature(save.feature ?? null);
  if (feature === undefined) return null;
  return {
    bankrollUnits: save.bankrollUnits,
    selectedWager: save.selectedWager as CascadeVaultWager,
    paidSpins: save.paidSpins,
    freeSpins: save.freeSpins,
    totalWageredUnits: save.totalWageredUnits,
    totalWonUnits: save.totalWonUnits,
    netUnits: save.netUnits,
    largestSpinWinUnits: save.largestSpinWinUnits,
    highestCascadeChain: save.highestCascadeChain,
    completedVaultRuns: save.completedVaultRuns,
    preferences: { sound: save.preferences.sound, reducedEffects: save.preferences.reducedEffects },
    lastResult,
    feature,
  };
}
