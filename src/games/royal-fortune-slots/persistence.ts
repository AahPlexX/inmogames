import type { GameSaveDefinition } from '../../platform/saves/contracts';
import type { SpinEvaluation, RoyalFortuneFeatureState } from './engine';
import { DEFAULT_SAVE, STORAGE_KEY, decodeRoyalFortuneSave, type RoyalFortuneSave } from './storage';

export const royalFortuneSaveDefinition: GameSaveDefinition<RoyalFortuneSave> = {
  slug: 'royal-fortune-slots',
  schemaVersion: 1,
  storageKey: STORAGE_KEY,
  initial: DEFAULT_SAVE,
  decode: decodeRoyalFortuneSave,
};

export function settleRoyalFortuneSpin(
  state: RoyalFortuneSave,
  evaluation: SpinEvaluation,
  paidSpin: boolean,
  feature: RoyalFortuneFeatureState | null,
): RoyalFortuneSave {
  const wagered = paidSpin ? evaluation.wager : 0;
  const bankroll = state.bankroll - wagered + evaluation.totalPayout;
  if (bankroll < 0) throw new Error('Cannot settle a spin beyond the available practice bankroll.');
  const totalWagered = state.totalWagered + wagered;
  const totalWon = state.totalWon + evaluation.totalPayout;
  return {
    ...state,
    bankroll,
    spins: state.spins + 1,
    freeSpinsPlayed: state.freeSpinsPlayed + (paidSpin ? 0 : 1),
    totalWagered,
    totalWon,
    net: totalWon - totalWagered,
    largestWin: Math.max(state.largestWin, evaluation.totalPayout),
    lastResult: {
      mode: evaluation.mode,
      wager: evaluation.wager,
      payout: evaluation.totalPayout,
      scatterCount: evaluation.scatterCount,
      freeSpinsAwarded: evaluation.freeSpinsAwarded,
    },
    feature,
  };
}

export function restorePracticeCredits(state: RoyalFortuneSave): RoyalFortuneSave | null {
  return state.bankroll < 5 && state.feature === null ? { ...state, bankroll: 2500 } : null;
}
