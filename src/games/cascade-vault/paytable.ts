import type { PayingSymbol } from './symbols';

export const CREDIT_SCALE = 100;
export const CASCADE_VAULT_WAGERS = [10, 20, 50, 100, 250] as const;
export type CascadeVaultWager = (typeof CASCADE_VAULT_WAGERS)[number];
export type WaysReelCount = 3 | 4 | 5 | 6;

/** Paytable factors expressed in hundredths of one wager credit. */
export const PAYTABLE_CENTI_MULTIPLIERS: Readonly<Record<PayingSymbol, Readonly<Record<WaysReelCount, number>>>> = {
  quartz: { 3: 1, 4: 2, 5: 7, 6: 16 },
  copper: { 3: 1, 4: 4, 5: 10, 6: 24 },
  silver: { 3: 3, 4: 7, 5: 14, 6: 38 },
  gold: { 3: 3, 4: 9, 5: 21, 6: 62 },
  sapphire: { 3: 4, 4: 16, 5: 43, 6: 125 },
  emerald: { 3: 8, 4: 25, 5: 70, 6: 186 },
  ruby: { 3: 11, 4: 38, 5: 112, 6: 311 },
  vault_crown: { 3: 15, 4: 64, 5: 210, 6: 623 },
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
