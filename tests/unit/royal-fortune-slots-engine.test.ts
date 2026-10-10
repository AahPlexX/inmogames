import { describe, expect, it } from 'vitest';
import { evaluateSpin, featureAfterBaseSpin, featureAfterFreeSpin } from '../../src/games/royal-fortune-slots/engine';
import { spinReels, type ReelColumn, type ReelWindow } from '../../src/games/royal-fortune-slots/reels';

const col = (a: ReelColumn[0], b: ReelColumn[1], c: ReelColumn[2]): ReelColumn => [a,b,c];
const windowOf = (...columns: ReelColumn[]): ReelWindow => columns as unknown as ReelWindow;

const quietRows = (centers: ReelColumn[1][]): ReelWindow => windowOf(
  col('J',centers[0],'K'), col('Q',centers[1],'A'), col('Bell',centers[2],'J'), col('K',centers[3],'Q'), col('A',centers[4],'Bell'),
);

describe('Royal Fortune reel model', () => {
  it('uses injected deterministic reel stops', () => {
    const stops = [1,2,3,4,5];
    let index = 0;
    const spun = spinReels({ int: () => stops[index++] });
    expect(spun.stops).toEqual(stops);
    expect(spun.window).toHaveLength(5);
    expect(spun.window.every((column) => column.length === 3)).toBe(true);
  });
});

describe('Royal Fortune payout engine', () => {
  it('scores a left-to-right fixed-payline win and lets Wild substitute', () => {
    const result = evaluateSpin(quietRows(['Wild','Wild','Crown','Crown','Crown']), 5);
    const center = result.lineWins.find((win) => win.lineIndex === 0);
    expect(center).toMatchObject({ symbol: 'Crown', count: 5, payout: 186 });
  });

  it('does not let Scatter substitute and pays Scatter independently', () => {
    const reels = windowOf(
      col('Scatter','A','J'), col('Q','Scatter','K'), col('Bell','A','Scatter'), col('K','Q','A'), col('A','Bell','K'),
    );
    const result = evaluateSpin(reels, 10);
    expect(result.scatterCount).toBe(3);
    expect(result.scatterPayout).toBe(10);
    expect(result.freeSpinsAwarded).toBe(8);
  });

  it('awards 12 and 20 base free spins for four and five Scatters', () => {
    const four = windowOf(col('Scatter','A','J'),col('Scatter','Q','K'),col('Scatter','A','Bell'),col('Scatter','K','Q'),col('A','Bell','K'));
    const five = windowOf(col('Scatter','A','J'),col('Scatter','Q','K'),col('Scatter','A','Bell'),col('Scatter','K','Q'),col('Scatter','Bell','K'));
    expect(evaluateSpin(four, 5).freeSpinsAwarded).toBe(12);
    expect(evaluateSpin(five, 5).freeSpinsAwarded).toBe(20);
  });

  it('applies and advances the free-spin multiplier only after a winning free spin', () => {
    const win = evaluateSpin(quietRows(['A','A','A','A','A']), 10, 'free', 4);
    expect(win.multiplier).toBe(4);
    expect(win.nextMultiplier).toBe(5);
    const loss = evaluateSpin(quietRows(['A','K','Q','J','Bell']), 10, 'free', 3);
    expect(loss.totalPayout).toBe(0);
    expect(loss.nextMultiplier).toBe(3);
  });

  it('creates, advances, retriggers and completes a free-spin checkpoint', () => {
    const triggerWindow = windowOf(col('Scatter','A','J'),col('Q','Scatter','K'),col('Bell','A','Scatter'),col('K','Q','A'),col('A','Bell','K'));
    const trigger = evaluateSpin(triggerWindow, 20);
    const started = featureAfterBaseSpin(trigger);
    expect(started).toEqual({ remaining: 8, wager: 20, multiplier: 1 });
    const retrigger = evaluateSpin(triggerWindow, 20, 'free', 1);
    expect(retrigger.freeSpinsAwarded).toBe(5);
    expect(featureAfterFreeSpin(started!, retrigger)?.remaining).toBe(12);
    const last = { remaining: 1, wager: 20 as const, multiplier: 1 };
    const loss = evaluateSpin(quietRows(['A','K','Q','J','Bell']), 20, 'free', 1);
    expect(featureAfterFreeSpin(last, loss)).toBeNull();
  });

  it('rejects unsupported wagers and invalid dimensions', () => {
    expect(() => evaluateSpin(quietRows(['A','A','A','A','A']), 7)).toThrow(/Unsupported/);
    expect(() => evaluateSpin([[ 'A','A','A' ]] as unknown as ReelWindow, 5)).toThrow(/five-reel/);
  });
});
