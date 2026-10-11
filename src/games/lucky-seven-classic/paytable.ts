import type { ClassicSymbol } from './reels';

export const CLASSIC_WAGERS = [1, 2, 5, 10, 25] as const;
export type ClassicWager = (typeof CLASSIC_WAGERS)[number];

export const BAR_SYMBOLS = new Set<ClassicSymbol>(['bar', 'double_bar', 'triple_bar']);

export const EXACT_MULTIPLIERS: Readonly<Partial<Record<ClassicSymbol, number>>> = {
  lemon: 10,
  orange: 16,
  plum: 24,
  bar: 30,
  double_bar: 60,
  bell: 80,
  triple_bar: 120,
  red7: 200,
  gold7: 500,
};

export const SYMBOL_LABELS: Readonly<Record<ClassicSymbol, string>> = {
  cherry: 'Cherry',
  lemon: 'Lemon',
  orange: 'Orange',
  plum: 'Plum',
  bell: 'Bell',
  bar: 'BAR',
  double_bar: 'Double BAR',
  triple_bar: 'Triple BAR',
  red7: 'Red 7',
  gold7: 'Gold 7',
};

export function isClassicWager(value: number): value is ClassicWager {
  return CLASSIC_WAGERS.includes(value as ClassicWager);
}
