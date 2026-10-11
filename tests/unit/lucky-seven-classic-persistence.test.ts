import { describe, expect, it } from 'vitest';
import { luckySevenSaveDefinition, restorePracticeCredits, settleLuckySevenSpin } from '../../src/games/lucky-seven-classic/persistence';
import { DEFAULT_SAVE, decodeLuckySevenSave } from '../../src/games/lucky-seven-classic/storage';

describe('Lucky Seven Classic persistence', () => {
  it('defines the versioned settled save contract', () => {
    expect(luckySevenSaveDefinition).toMatchObject({
      slug: 'lucky-seven-classic',
      schemaVersion: 1,
      storageKey: 'inmogames:lucky-seven-classic:v1',
      initial: DEFAULT_SAVE,
    });
    expect(decodeLuckySevenSave(DEFAULT_SAVE)).toEqual(DEFAULT_SAVE);
  });

  it('settles a completed spin atomically from the selected wager and center line', () => {
    const state = { ...DEFAULT_SAVE, selectedWager: 5 as const };
    const next = settleLuckySevenSpin(state, ['gold7', 'gold7', 'gold7']);

    expect(next).toEqual({
      ...state,
      bankroll: 2995,
      spins: 1,
      totalWagered: 5,
      totalWon: 2500,
      net: 2495,
      largestWin: 2500,
      lastResult: {
        center: ['gold7', 'gold7', 'gold7'],
        wager: 5,
        payout: 2500,
        label: '3 Gold 7s',
      },
    });
    expect(state.bankroll).toBe(500);
  });

  it('accounts for a losing spin without allowing an unaffordable wager', () => {
    const loss = settleLuckySevenSpin({ ...DEFAULT_SAVE, selectedWager: 25 }, ['gold7', 'red7', 'bell']);
    expect(loss).toMatchObject({ bankroll: 475, spins: 1, totalWagered: 25, totalWon: 0, net: -25, largestWin: 0 });
    expect(() => settleLuckySevenSpin({ ...DEFAULT_SAVE, bankroll: 0, selectedWager: 1 }, ['cherry', 'lemon', 'orange'])).toThrow(/bankroll/i);
  });

  it('rejects malformed durable accounting and malformed completed results', () => {
    expect(decodeLuckySevenSave({ ...DEFAULT_SAVE, selectedWager: 3 })).toBeNull();
    expect(decodeLuckySevenSave({ ...DEFAULT_SAVE, net: 1 })).toBeNull();
    expect(decodeLuckySevenSave({ ...DEFAULT_SAVE, bankroll: -1 })).toBeNull();
    expect(decodeLuckySevenSave({
      ...DEFAULT_SAVE,
      lastResult: { center: ['gold7', 'bogus', 'gold7'], wager: 1, payout: 0, label: 'No win' },
    })).toBeNull();
  });

  it('restores only a below-minimum bankroll and preserves durable history/preferences', () => {
    const exhausted = {
      ...DEFAULT_SAVE,
      bankroll: 0,
      spins: 7,
      totalWagered: 20,
      totalWon: 4,
      net: -16,
      largestWin: 4,
      preferences: { sound: true, motion: false },
    };
    expect(restorePracticeCredits(exhausted)).toEqual({ ...exhausted, bankroll: 500 });
    expect(restorePracticeCredits({ ...DEFAULT_SAVE, bankroll: 1 })).toBeNull();
  });
});
