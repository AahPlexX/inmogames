import type { PayingSymbol } from './symbols';

export const CREDIT_SCALE = 100;
export const CASCADE_VAULT_WAGERS = [10, 20, 50, 100, 250] as const;
export type CascadeVaultWager = (typeof CASCADE_VAULT_WAGERS)[number];
export type WaysReelCount = 3 | 4 | 5 | 6;

/** Paytable factors expressed in hundredths of one wager credit. */
export const PAYTABLE_CENTI_MULTIPLIERS: Readonly<Record<PayingSymbol, Readonly<Record<WaysReelCount, number>>>> = {
  quartz: { 3: 1, 4: 2, 5: 6, 6: 15 },
  copper: { 3: 1, 4: 4, 5: 9, 6: 22 },
  silver: { 3: 3, 4: 6, 5: 13, 6: 35 },
  gold: { 3: 3, 4: 8, 5: 19, 6: 57 },
  sapphire: { 3: 4, 4: 15, 5: 39, 6: 114 },
  emerald: { 3: 7, 4: 23, 5: 64, 6: 170 },
  ruby: { 3: 10, 4: 35, 5: 102, 6: 284 },
  vault_crown: { 3: 14, 4: 58, 5: 192, 6: 568 },
};

export function isCascadeVaultWager(value: number): value is CascadeVaultWager {
  return CASCADE_VAULT_WAGERS.includes(value as CascadeVaultWager);
}

export function paytableCentiMultiplier(symbol: PayingSymbol, reelCount: WaysReelCount): number {
  return PAYTABLE_CENTI_MULTIPLIERS[symbol][reelCount];
}

export function calculateWaysAwardUnits(
  symbol: PayingSymbol,
  reelCount: WaysReelCount,
  ways: number,
  wagerCredits: number,
  cascadeMultiplier: number,
  featureBoost: boolean,
): number {
  if (!isCascadeVaultWager(wagerCredits)) throw new RangeError('Unsupported Cascade Vault wager.');
  if (!Number.isSafeInteger(ways) || ways < 0) throw new RangeError('Ways count must be a non-negative safe integer.');
  if (!Number.isSafeInteger(cascadeMultiplier) || cascadeMultiplier < 1 || cascadeMultiplier > 20) {
    throw new RangeError('Cascade multiplier must be an integer from 1 through 20.');
  }

  const baseUnits = wagerCredits * paytableCentiMultiplier(symbol, reelCount) * ways * cascadeMultiplier;
  const awardUnits = featureBoost ? (baseUnits * 3) / 2 : baseUnits;
  if (!Number.isSafeInteger(awardUnits)) {
    throw new RangeError('Configured payout cannot be represented exactly in centi-credit accounting units.');
  }
  return awardUnits;
}

export function creditUnitsToCredits(units: number): number {
  if (!Number.isSafeInteger(units)) throw new RangeError('Credit units must be a safe integer.');
  return units / CREDIT_SCALE;
}
