import type { RoyalFortuneSymbol } from './reels';

export const WAGERS = [5, 10, 20, 40, 100] as const;
export type RoyalFortuneWager = (typeof WAGERS)[number];

export const NORMAL_PAYTABLE: Readonly<Record<Exclude<RoyalFortuneSymbol, 'Wild' | 'Scatter'>, Readonly<Record<3 | 4 | 5, number>>>> = {
  Crown: { 3: 9, 4: 37, 5: 186 },
  Ruby: { 3: 7, 4: 28, 5: 112 },
  Emerald: { 3: 6, 4: 19, 5: 74 },
  Chalice: { 3: 4, 4: 15, 5: 47 },
  Bell: { 3: 4, 4: 9, 5: 28 },
  A: { 3: 2, 4: 6, 5: 19 },
  K: { 3: 2, 4: 4, 5: 15 },
  Q: { 3: 2, 4: 4, 5: 15 },
  J: { 3: 2, 4: 4, 5: 15 },
};

export const SCATTER_PAYOUT_MULTIPLIER: Readonly<Partial<Record<number, number>>> = { 3: 1, 4: 4, 5: 20 };
export const BASE_FREE_SPINS: Readonly<Partial<Record<number, number>>> = { 3: 8, 4: 12, 5: 20 };
export const FREE_SPIN_RETRIGGER = 5;
export const MAX_FREE_SPIN_MULTIPLIER = 5;

export function isRoyalFortuneWager(value: number): value is RoyalFortuneWager {
  return WAGERS.includes(value as RoyalFortuneWager);
}

export function normalSymbolPayoutUnits(symbol: Exclude<RoyalFortuneSymbol, 'Wild' | 'Scatter'>, count: 3 | 4 | 5): number {
  return NORMAL_PAYTABLE[symbol][count];
}
