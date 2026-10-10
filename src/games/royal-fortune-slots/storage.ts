import { isRoyalFortuneWager, type RoyalFortuneWager } from './paytable';
import type { RoyalFortuneFeatureState, SpinMode } from './engine';

export interface RoyalFortunePreferences { sound: boolean; reducedEffects: boolean }
export interface RoyalFortuneResultSummary {
  mode: SpinMode;
  wager: RoyalFortuneWager;
  payout: number;
  scatterCount: number;
  freeSpinsAwarded: number;
}
export interface RoyalFortuneSave {
  bankroll: number;
  selectedWager: RoyalFortuneWager;
  spins: number;
  freeSpinsPlayed: number;
  totalWagered: number;
  totalWon: number;
  net: number;
  largestWin: number;
  preferences: RoyalFortunePreferences;
  lastResult: RoyalFortuneResultSummary | null;
  feature: RoyalFortuneFeatureState | null;
}

export const STORAGE_KEY = 'inmogames:royal-fortune-slots:v1';
export const DEFAULT_SAVE: RoyalFortuneSave = {
  bankroll: 2500,
  selectedWager: 10,
  spins: 0,
  freeSpinsPlayed: 0,
  totalWagered: 0,
  totalWon: 0,
  net: 0,
  largestWin: 0,
  preferences: { sound: false, reducedEffects: false },
  lastResult: null,
  feature: null,
};

const nonNegativeInt = (value: unknown): value is number => typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
const signedInt = (value: unknown): value is number => typeof value === 'number' && Number.isSafeInteger(value);
const bool = (value: unknown): value is boolean => typeof value === 'boolean';

function decodeFeature(value: unknown): RoyalFortuneFeatureState | null | undefined {
  if (value === null) return null;
  if (!value || typeof value !== 'object') return undefined;
  const feature = value as Partial<RoyalFortuneFeatureState>;
  if (!nonNegativeInt(feature.remaining) || feature.remaining < 1 || !isRoyalFortuneWager(feature.wager as number) || !nonNegativeInt(feature.multiplier) || feature.multiplier < 1 || feature.multiplier > 5) return undefined;
  return { remaining: feature.remaining, wager: feature.wager as RoyalFortuneWager, multiplier: feature.multiplier };
}

function decodeResult(value: unknown): RoyalFortuneResultSummary | null | undefined {
  if (value === null) return null;
  if (!value || typeof value !== 'object') return undefined;
  const result = value as Partial<RoyalFortuneResultSummary>;
  if ((result.mode !== 'base' && result.mode !== 'free') || !isRoyalFortuneWager(result.wager as number) || !nonNegativeInt(result.payout) || !nonNegativeInt(result.scatterCount) || result.scatterCount > 5 || !nonNegativeInt(result.freeSpinsAwarded)) return undefined;
  return { mode: result.mode, wager: result.wager as RoyalFortuneWager, payout: result.payout, scatterCount: result.scatterCount, freeSpinsAwarded: result.freeSpinsAwarded };
}

export function decodeRoyalFortuneSave(value: unknown): RoyalFortuneSave | null {
  if (!value || typeof value !== 'object') return null;
  const save = value as Partial<RoyalFortuneSave>;
  if (!nonNegativeInt(save.bankroll) || !isRoyalFortuneWager(save.selectedWager as number) || !nonNegativeInt(save.spins) || !nonNegativeInt(save.freeSpinsPlayed) || !nonNegativeInt(save.totalWagered) || !nonNegativeInt(save.totalWon) || !signedInt(save.net) || !nonNegativeInt(save.largestWin)) return null;
  if (!save.preferences || !bool(save.preferences.sound) || !bool(save.preferences.reducedEffects)) return null;
  const lastResult = decodeResult(save.lastResult ?? null);
  const feature = decodeFeature(save.feature ?? null);
  if (lastResult === undefined || feature === undefined) return null;
  if (save.net !== save.totalWon - save.totalWagered) return null;
  return {
    bankroll: save.bankroll,
    selectedWager: save.selectedWager as RoyalFortuneWager,
    spins: save.spins,
    freeSpinsPlayed: save.freeSpinsPlayed,
    totalWagered: save.totalWagered,
    totalWon: save.totalWon,
    net: save.net,
    largestWin: save.largestWin,
    preferences: { ...save.preferences },
    lastResult,
    feature,
  };
}
