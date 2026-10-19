import { resolveSpin, type VaultRunState } from './engine';
import { CREDIT_SCALE, isCascadeVaultWager, type CascadeVaultWager } from './paytable';
import { createWeightedVaultRandomSource, type VaultRandomSource } from './symbols';

export interface CascadeVaultPaidSpinSample {
  awardUnits: number;
  engineSpins: number;
  winningCascades: number;
  vaultEntered: boolean;
}

export interface CascadeVaultSimulationInput {
  paidSpins: number;
  seed: number;
  wagerCredits: CascadeVaultWager;
}

export interface CascadeVaultSimulationReport extends CascadeVaultSimulationInput {
  totalWagerUnits: number;
  totalAwardUnits: number;
  observedRtp: number;
  standardError: number;
  ci95Low: number;
  ci95High: number;
  vaultEntries: number;
  vaultEntryFrequency: number;
  totalEngineSpins: number;
  totalWinningCascades: number;
  averageCascadeDepth: number;
  corruptionGuardHits: 0;
}

const UINT32_RANGE = 0x1_0000_0000;

function assertSafeTotal(value: number, label: string): number {
  if (!Number.isSafeInteger(value) || value < 0) throw new RangeError(`${label} exceeded safe integer accounting.`);
  return value;
}

export function createSeededIntegerSource(seed: number): (maxExclusive: number) => number {
  if (!Number.isSafeInteger(seed) || seed < 0 || seed >= UINT32_RANGE) {
    throw new RangeError('Cascade Vault simulation seed must be an unsigned 32-bit integer.');
  }
  let state = seed >>> 0;

  const nextUint32 = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return (value ^ (value >>> 14)) >>> 0;
  };

  return (maxExclusive: number) => {
    if (!Number.isSafeInteger(maxExclusive) || maxExclusive <= 0 || maxExclusive > UINT32_RANGE) {
      throw new RangeError('Simulation random bound must be a positive integer no larger than 2^32.');
    }
    const limit = UINT32_RANGE - (UINT32_RANGE % maxExclusive);
    let value = nextUint32();
    while (value >= limit) value = nextUint32();
    return value % maxExclusive;
  };
}

export function simulateCascadeVaultPaidSpin(
  wagerCredits: CascadeVaultWager,
  random: VaultRandomSource,
): CascadeVaultPaidSpinSample {
  if (!isCascadeVaultWager(wagerCredits)) throw new RangeError('Unsupported Cascade Vault wager.');

  const base = resolveSpin({ mode: 'base', wagerCredits, random });
  let awardUnits = base.totalAwardUnits;
  let engineSpins = 1;
  let winningCascades = base.cascades.length;
  const vaultEntered = base.triggeredVaultRunSpins > 0;
  let feature: VaultRunState | null = vaultEntered
    ? { remainingSpins: base.triggeredVaultRunSpins, persistentMultiplier: 2, meterLevel: 0, stepThreeAwarded: false }
    : null;

  while (feature) {
    const freeSpin = resolveSpin({ mode: 'vault', wagerCredits, random, vaultState: feature });
    awardUnits = assertSafeTotal(awardUnits + freeSpin.totalAwardUnits, 'Cascade Vault paid-spin award');
    engineSpins += 1;
    winningCascades += freeSpin.cascades.length;
    feature = freeSpin.nextVaultState;
  }

  return { awardUnits, engineSpins, winningCascades, vaultEntered };
}

export function simulateCascadeVaultPaidSpins(input: CascadeVaultSimulationInput): CascadeVaultSimulationReport {
  if (!Number.isSafeInteger(input.paidSpins) || input.paidSpins < 2) {
    throw new RangeError('Cascade Vault simulation requires at least two paid spins for confidence statistics.');
  }
  if (!isCascadeVaultWager(input.wagerCredits)) throw new RangeError('Unsupported Cascade Vault wager.');

  const wagerUnits = input.wagerCredits * CREDIT_SCALE;
  const totalWagerUnits = assertSafeTotal(input.paidSpins * wagerUnits, 'Cascade Vault total wager');
  const random = createWeightedVaultRandomSource(createSeededIntegerSource(input.seed));
  let totalAwardUnits = 0;
  let vaultEntries = 0;
  let totalEngineSpins = 0;
  let totalWinningCascades = 0;
  let mean = 0;
  let m2 = 0;

  for (let index = 0; index < input.paidSpins; index += 1) {
    const sample = simulateCascadeVaultPaidSpin(input.wagerCredits, random);
    totalAwardUnits = assertSafeTotal(totalAwardUnits + sample.awardUnits, 'Cascade Vault total award');
    vaultEntries += sample.vaultEntered ? 1 : 0;
    totalEngineSpins += sample.engineSpins;
    totalWinningCascades += sample.winningCascades;

    const returnRatio = sample.awardUnits / wagerUnits;
    const count = index + 1;
    const delta = returnRatio - mean;
    mean += delta / count;
    m2 += delta * (returnRatio - mean);
  }

  const sampleVariance = m2 / (input.paidSpins - 1);
  const standardError = Math.sqrt(sampleVariance / input.paidSpins);
  const observedRtp = totalAwardUnits / totalWagerUnits;

  return {
    ...input,
    totalWagerUnits,
    totalAwardUnits,
    observedRtp,
    standardError,
    ci95Low: observedRtp - 1.96 * standardError,
    ci95High: observedRtp + 1.96 * standardError,
    vaultEntries,
    vaultEntryFrequency: vaultEntries / input.paidSpins,
    totalEngineSpins,
    totalWinningCascades,
    averageCascadeDepth: totalWinningCascades / input.paidSpins,
    corruptionGuardHits: 0,
  };
}
