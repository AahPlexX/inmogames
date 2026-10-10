import { describe, expect, it } from 'vitest';
import { evaluateSpin } from '../../src/games/royal-fortune-slots/engine';
import { settleRoyalFortuneSpin, restorePracticeCredits, royalFortuneSaveDefinition } from '../../src/games/royal-fortune-slots/persistence';
import { DEFAULT_SAVE, decodeRoyalFortuneSave } from '../../src/games/royal-fortune-slots/storage';
import type { ReelWindow } from '../../src/games/royal-fortune-slots/reels';

const lossWindow = [
  ['J','A','K'], ['Q','K','A'], ['Bell','Q','J'], ['K','J','Q'], ['A','Bell','K'],
] as unknown as ReelWindow;

describe('Royal Fortune persistence', () => {
  it('publishes the expected versioned save definition', () => {
    expect(royalFortuneSaveDefinition.slug).toBe('royal-fortune-slots');
    expect(royalFortuneSaveDefinition.schemaVersion).toBe(1);
    expect(royalFortuneSaveDefinition.storageKey).toBe('inmogames:royal-fortune-slots:v1');
    expect(royalFortuneSaveDefinition.initial.bankroll).toBe(2500);
  });

  it('decodes a valid durable save and rejects inconsistent or malformed state', () => {
    expect(decodeRoyalFortuneSave(structuredClone(DEFAULT_SAVE))).toEqual(DEFAULT_SAVE);
    expect(decodeRoyalFortuneSave({ ...DEFAULT_SAVE, bankroll: -1 })).toBeNull();
    expect(decodeRoyalFortuneSave({ ...DEFAULT_SAVE, selectedWager: 7 })).toBeNull();
    expect(decodeRoyalFortuneSave({ ...DEFAULT_SAVE, net: 1 })).toBeNull();
    expect(decodeRoyalFortuneSave({ ...DEFAULT_SAVE, feature: { remaining: 3, wager: 10, multiplier: 6 } })).toBeNull();
  });

  it('settles paid and free spins without persisting transient reel state', () => {
    const paid = evaluateSpin(lossWindow, 10, 'base');
    const afterPaid = settleRoyalFortuneSpin(structuredClone(DEFAULT_SAVE), paid, true, null);
    expect(afterPaid.bankroll).toBe(2490);
    expect(afterPaid.totalWagered).toBe(10);
    expect(afterPaid.spins).toBe(1);
    expect(afterPaid.freeSpinsPlayed).toBe(0);
    expect(afterPaid.net).toBe(-10);
    expect('reels' in afterPaid).toBe(false);
    expect('spinning' in afterPaid).toBe(false);

    const free = evaluateSpin(lossWindow, 10, 'free', 2);
    const afterFree = settleRoyalFortuneSpin({ ...afterPaid, feature: { remaining: 1, wager: 10, multiplier: 2 } }, free, false, null);
    expect(afterFree.bankroll).toBe(afterPaid.bankroll);
    expect(afterFree.totalWagered).toBe(afterPaid.totalWagered);
    expect(afterFree.freeSpinsPlayed).toBe(1);
    expect(afterFree.spins).toBe(2);
  });

  it('restores only a depleted non-feature bankroll while preserving history', () => {
    const depleted = { ...DEFAULT_SAVE, bankroll: 0, spins: 9, totalWagered: 50, totalWon: 40, net: -10, preferences: { sound: true, reducedEffects: true } };
    const restored = restorePracticeCredits(depleted);
    expect(restored).toMatchObject({ bankroll: 2500, spins: 9, totalWagered: 50, totalWon: 40, net: -10, preferences: depleted.preferences });
    expect(restorePracticeCredits({ ...depleted, feature: { remaining: 2, wager: 10, multiplier: 1 } })).toBeNull();
  });
});
