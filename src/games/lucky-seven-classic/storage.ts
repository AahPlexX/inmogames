import { isClassicWager, type ClassicWager } from './paytable';
import type { ClassicSymbol } from './reels';

export interface LuckySevenPreferences {
  sound: boolean;
  motion: boolean;
}

export interface LuckySevenResultSummary {
  center: [ClassicSymbol, ClassicSymbol, ClassicSymbol];
  wager: ClassicWager;
  payout: number;
  label: string;
}

export interface LuckySevenSave {
  bankroll: number;
  selectedWager: ClassicWager;
  spins: number;
  totalWagered: number;
  totalWon: number;
  net: number;
  largestWin: number;
  preferences: LuckySevenPreferences;
  lastResult: LuckySevenResultSummary | null;
}

export const STORAGE_KEY = 'inmogames:lucky-seven-classic:v1';

export const DEFAULT_SAVE: LuckySevenSave = {
  bankroll: 500,
  selectedWager: 1,
  spins: 0,
  totalWagered: 0,
  totalWon: 0,
  net: 0,
  largestWin: 0,
  preferences: { sound: false, motion: true },
  lastResult: null,
};

const CLASSIC_SYMBOLS = new Set<ClassicSymbol>([
  'cherry',
  'lemon',
  'orange',
  'plum',
  'bell',
  'bar',
  'double_bar',
  'triple_bar',
  'red7',
  'gold7',
]);

const nonNegativeSafeInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;

const signedSafeInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value);

const isClassicSymbol = (value: unknown): value is ClassicSymbol =>
  typeof value === 'string' && CLASSIC_SYMBOLS.has(value as ClassicSymbol);

function decodeResult(value: unknown): LuckySevenResultSummary | null | undefined {
  if (value === null) return null;
  if (!value || typeof value !== 'object') return undefined;

  const result = value as Partial<LuckySevenResultSummary>;
  if (!Array.isArray(result.center) || result.center.length !== 3 || !result.center.every(isClassicSymbol)) return undefined;
  if (!isClassicWager(result.wager as number) || !nonNegativeSafeInteger(result.payout)) return undefined;
  if (typeof result.label !== 'string' || result.label.trim().length === 0) return undefined;

  return {
    center: [result.center[0], result.center[1], result.center[2]],
    wager: result.wager as ClassicWager,
    payout: result.payout,
    label: result.label,
  };
}

export function decodeLuckySevenSave(value: unknown): LuckySevenSave | null {
  if (!value || typeof value !== 'object') return null;

  const save = value as Partial<LuckySevenSave>;
  if (!nonNegativeSafeInteger(save.bankroll) || !isClassicWager(save.selectedWager as number)) return null;
  if (!nonNegativeSafeInteger(save.spins) || !nonNegativeSafeInteger(save.totalWagered) || !nonNegativeSafeInteger(save.totalWon) || !signedSafeInteger(save.net) || !nonNegativeSafeInteger(save.largestWin)) return null;
  if (save.net !== save.totalWon - save.totalWagered) return null;
  if (!save.preferences || typeof save.preferences.sound !== 'boolean' || typeof save.preferences.motion !== 'boolean') return null;

  const lastResult = decodeResult(save.lastResult ?? null);
  if (lastResult === undefined) return null;

  return {
    bankroll: save.bankroll,
    selectedWager: save.selectedWager as ClassicWager,
    spins: save.spins,
    totalWagered: save.totalWagered,
    totalWon: save.totalWon,
    net: save.net,
    largestWin: save.largestWin,
    preferences: { sound: save.preferences.sound, motion: save.preferences.motion },
    lastResult,
  };
}
