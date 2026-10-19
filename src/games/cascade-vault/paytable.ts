import type { PayingSymbol } from './symbols';

export const CREDIT_SCALE = 100;
export const CASCADE_VAULT_WAGERS = [10, 20, 50, 100, 250] as const;
export type CascadeVaultWager = (typeof CASCADE_VAULT_WAGERS)[number];
export type WaysReelCount = 3 | 4 | 5 | 6;

/** Paytable factors expressed in hundredths of one wager credit. */
export const PAYTABLE_CENTI_MULTIPLIERS: Readonly<Record<PayingSymbol, Readonly<Record<WaysReelCount, number>>>> = {
  quartz: { 3: 10, 4: 20, 5: 50, 6: 100 },
  copper: { 3: 15, 4: 30, 5: 75, 6: 150 },
  silver: { 3: 20, 4: 50, 5: 100, 6: 250 },
  gold: { 3: 30, 4: 75, 5: 150, 6: 400 },
  sapphire: { 3: 50, 4: 125, 5: 300, 6: 800 },
  emerald: { 3: 75, 4: 200, 5: 500, 6: 1_200 },
  ruby: { 3: 100, 4: 300, 5: 800, 6: 2_000 },
  vault_crown: { 3: 150, 4: 500, 5: 1_500, 6: 4_000 },
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
