import type { GameSaveDefinition } from '../../platform/saves/contracts';
import { advanceVaultRunAfterSpin, vaultRunSpinsForScatters, type ResolveSpinResult, type VaultRunState } from './engine';
import { CREDIT_SCALE } from './paytable';
import { DEFAULT_SAVE, STORAGE_KEY, decodeCascadeVaultSave, type CascadeVaultResultSummary, type CascadeVaultSave } from './storage';

export const cascadeVaultSaveDefinition: GameSaveDefinition<CascadeVaultSave> = {
  slug: 'cascade-vault',
  schemaVersion: 1,
  storageKey: STORAGE_KEY,
  initial: DEFAULT_SAVE,
  decode: decodeCascadeVaultSave,
};

function validatedState(state: CascadeVaultSave): CascadeVaultSave {
  const decoded = decodeCascadeVaultSave(state);
  if (!decoded) throw new Error('Invalid Cascade Vault save state.');
  return decoded;
}

function safeAdd(left: number, right: number, label: string): number {
  const value = left + right;
  if (!Number.isSafeInteger(value) || value < 0) throw new RangeError(`${label} exceeded safe integer accounting.`);
  return value;
}

function validateResolved(result: ResolveSpinResult): void {
  if (!result || (result.mode !== 'base' && result.mode !== 'vault')) throw new Error('Invalid resolved Cascade Vault spin.');
  if (!Number.isSafeInteger(result.totalAwardUnits) || result.totalAwardUnits < 0) throw new Error('Invalid resolved Cascade Vault award.');
  if (!Array.isArray(result.cascades) || result.cascades.length > 50) throw new Error('Invalid resolved Cascade Vault cascade chain.');
  if (!Number.isSafeInteger(result.initialScatterCount) || result.initialScatterCount < 0 || result.initialScatterCount > 30) {
    throw new Error('Invalid resolved Cascade Vault Scatter count.');
  }
  const expectedTrigger = result.mode === 'base' ? vaultRunSpinsForScatters(result.initialScatterCount) : 0;
  if (result.triggeredVaultRunSpins !== expectedTrigger) throw new Error('Resolved Cascade Vault trigger does not match its Scatter count.');
}

function sameFeature(left: VaultRunState | null, right: VaultRunState | null): boolean {
  if (left === null || right === null) return left === right;
  return left.remainingSpins === right.remainingSpins &&
    left.persistentMultiplier === right.persistentMultiplier &&
    left.meterLevel === right.meterLevel &&
    left.stepThreeAwarded === right.stepThreeAwarded;
}

function summary(result: ResolveSpinResult, wagerCredits: CascadeVaultSave['selectedWager'] | null): CascadeVaultResultSummary {
  return {
    mode: result.mode,
    wagerCredits,
    awardUnits: result.totalAwardUnits,
    winningCascades: result.cascades.length,
    initialScatterCount: result.initialScatterCount,
    triggeredVaultRunSpins: result.triggeredVaultRunSpins,
  };
}

export function settleCascadeVaultBaseSpin(stateInput: CascadeVaultSave, result: ResolveSpinResult): CascadeVaultSave {
  const state = validatedState(stateInput);
  validateResolved(result);
  if (result.mode !== 'base' || state.feature !== null || result.nextVaultState !== null) {
    throw new Error('Base settlement requires a base result and no active Vault Run.');
  }
  const wagerUnits = state.selectedWager * CREDIT_SCALE;
  if (state.bankrollUnits < wagerUnits) throw new Error('Cannot settle a spin beyond the available practice bankroll.');
  const totalWageredUnits = safeAdd(state.totalWageredUnits, wagerUnits, 'Cascade Vault wager');
  const totalWonUnits = safeAdd(state.totalWonUnits, result.totalAwardUnits, 'Cascade Vault award');
  const feature: VaultRunState | null = result.triggeredVaultRunSpins > 0 ? {
    remainingSpins: result.triggeredVaultRunSpins,
    persistentMultiplier: 2,
    meterLevel: 0,
    stepThreeAwarded: false,
  } : null;
  return {
    ...state,
    bankrollUnits: safeAdd(state.bankrollUnits - wagerUnits, result.totalAwardUnits, 'Cascade Vault bankroll'),
    paidSpins: safeAdd(state.paidSpins, 1, 'Cascade Vault paid-spin count'),
    totalWageredUnits,
    totalWonUnits,
    netUnits: totalWonUnits - totalWageredUnits,
    largestSpinWinUnits: Math.max(state.largestSpinWinUnits, result.totalAwardUnits),
    highestCascadeChain: Math.max(state.highestCascadeChain, result.cascades.length),
    feature,
    lastResult: summary(result, state.selectedWager),
  };
}

export function settleCascadeVaultFreeSpin(stateInput: CascadeVaultSave, result: ResolveSpinResult): CascadeVaultSave {
  const state = validatedState(stateInput);
  validateResolved(result);
  if (result.mode !== 'vault' || state.feature === null) throw new Error('Free-spin settlement requires an active Vault Run.');
  const advanced = advanceVaultRunAfterSpin(state.feature, {
    winningCascades: result.cascades.length,
    initialScatterCount: result.initialScatterCount,
  });
  const expectedFeature = advanced.remainingSpins > 0 ? advanced : null;
  if (!sameFeature(result.nextVaultState, expectedFeature)) throw new Error('Resolved Vault Run checkpoint does not match the engine transition.');
  const totalWonUnits = safeAdd(state.totalWonUnits, result.totalAwardUnits, 'Cascade Vault award');
  return {
    ...state,
    bankrollUnits: safeAdd(state.bankrollUnits, result.totalAwardUnits, 'Cascade Vault bankroll'),
    freeSpins: safeAdd(state.freeSpins, 1, 'Cascade Vault free-spin count'),
    totalWonUnits,
    netUnits: totalWonUnits - state.totalWageredUnits,
    largestSpinWinUnits: Math.max(state.largestSpinWinUnits, result.totalAwardUnits),
    highestCascadeChain: Math.max(state.highestCascadeChain, result.cascades.length),
    completedVaultRuns: expectedFeature === null ? safeAdd(state.completedVaultRuns, 1, 'Cascade Vault completed-run count') : state.completedVaultRuns,
    feature: expectedFeature,
    lastResult: summary(result, null),
  };
}

export function restorePracticeCredits(stateInput: CascadeVaultSave): CascadeVaultSave | null {
  const state = validatedState(stateInput);
  if (state.bankrollUnits >= 10 * CREDIT_SCALE || state.feature !== null) return null;
  return { ...state, bankrollUnits: DEFAULT_SAVE.bankrollUnits };
}
