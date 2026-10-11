import type { GameSaveDefinition } from '../../platform/saves/contracts';
import { evaluateCenterLine } from './engine';
import type { ClassicSymbol } from './reels';
import { DEFAULT_SAVE, STORAGE_KEY, decodeLuckySevenSave, type LuckySevenSave } from './storage';

export const luckySevenSaveDefinition: GameSaveDefinition<LuckySevenSave> = {
  slug: 'lucky-seven-classic',
  schemaVersion: 1,
  storageKey: STORAGE_KEY,
  initial: DEFAULT_SAVE,
  decode: decodeLuckySevenSave,
};

export function settleLuckySevenSpin(
  state: LuckySevenSave,
  center: readonly [ClassicSymbol, ClassicSymbol, ClassicSymbol],
): LuckySevenSave {
  const wager = state.selectedWager;
  if (state.bankroll < wager) throw new Error('Cannot settle a spin beyond the available practice bankroll.');

  const evaluation = evaluateCenterLine(center, wager);
  const totalWagered = state.totalWagered + wager;
  const totalWon = state.totalWon + evaluation.payout;

  return {
    ...state,
    bankroll: state.bankroll - wager + evaluation.payout,
    spins: state.spins + 1,
    totalWagered,
    totalWon,
    net: totalWon - totalWagered,
    largestWin: Math.max(state.largestWin, evaluation.payout),
    lastResult: {
      center: [center[0], center[1], center[2]],
      wager,
      payout: evaluation.payout,
      label: evaluation.label,
    },
  };
}

export function restorePracticeCredits(state: LuckySevenSave): LuckySevenSave | null {
  return state.bankroll < 1 ? { ...state, bankroll: 500 } : null;
}
