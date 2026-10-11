import { describe, expect, it } from 'vitest';
import { auditClassicMath, evaluateCenterLine, spinClassicReels } from '../../src/games/lucky-seven-classic/engine';
import { CLASSIC_REELS, type ClassicSymbol } from '../../src/games/lucky-seven-classic/reels';

const symbols = (value: string[]) => value as ClassicSymbol[];

describe('Lucky Seven Classic engine', () => {
  it('projects deterministic reel stops with center-only scoring', () => {
    const stops = [0, 1, 2];
    const spin = spinClassicReels((reelIndex) => stops[reelIndex]);

    expect(spin.stops).toEqual(stops);
    for (let reelIndex = 0; reelIndex < 3; reelIndex += 1) {
      const strip = CLASSIC_REELS[reelIndex];
      const stop = stops[reelIndex];
      expect(spin.windows[reelIndex]).toEqual([
        strip[(stop - 1 + strip.length) % strip.length],
        strip[stop],
        strip[(stop + 1) % strip.length],
      ]);
      expect(spin.center[reelIndex]).toBe(strip[stop]);
    }
  });

  it.each([
    [['cherry', 'lemon', 'orange'], 1, '1 Cherry'],
    [['cherry', 'cherry', 'lemon'], 3, '2 Cherries'],
    [['cherry', 'cherry', 'cherry'], 10, '3 Cherries'],
    [['bar', 'double_bar', 'triple_bar'], 5, 'Mixed BAR'],
    [['bar', 'bar', 'bar'], 30, '3 BAR'],
    [['double_bar', 'double_bar', 'double_bar'], 60, '3 Double BAR'],
    [['triple_bar', 'triple_bar', 'triple_bar'], 120, '3 Triple BAR'],
    [['lemon', 'lemon', 'lemon'], 10, '3 Lemons'],
    [['orange', 'orange', 'orange'], 16, '3 Oranges'],
    [['plum', 'plum', 'plum'], 24, '3 Plums'],
    [['bell', 'bell', 'bell'], 80, '3 Bells'],
    [['red7', 'red7', 'red7'], 200, '3 Red 7s'],
    [['gold7', 'gold7', 'gold7'], 500, '3 Gold 7s'],
    [['gold7', 'gold7', 'red7'], 0, 'No win'],
  ] as const)('scores %j at the exact paytable precedence', (line, multiplier, label) => {
    expect(evaluateCenterLine(symbols([...line]), 1)).toMatchObject({ multiplier, payout: multiplier, label });
  });

  it('scales payout by supported wager and rejects unsupported wagers', () => {
    expect(evaluateCenterLine(symbols(['gold7', 'gold7', 'gold7']), 5).payout).toBe(2500);
    expect(() => evaluateCenterLine(symbols(['cherry', 'lemon', 'orange']), 3)).toThrow(/wager/i);
  });

  it('keeps every reel at the source-controlled 32-stop composition', () => {
    const expected = {
      cherry: 5,
      lemon: 5,
      orange: 5,
      plum: 4,
      bell: 3,
      bar: 3,
      double_bar: 2,
      triple_bar: 2,
      red7: 2,
      gold7: 1,
    };
    for (const strip of CLASSIC_REELS) {
      expect(strip).toHaveLength(32);
      const counts = Object.fromEntries(Object.keys(expected).map((symbol) => [symbol, strip.filter((value) => value === symbol).length]));
      expect(counts).toEqual(expected);
    }
  });

  it('enumerates the complete probability space and configured long-run return', () => {
    const audit = auditClassicMath();
    expect(audit.combinations).toBe(32 ** 3);
    expect(audit.probabilityTotal).toBeCloseTo(1, 12);
    expect(audit.rtp).toBeCloseTo(0.94775390625, 12);
    expect(audit.hitFrequency).toBeCloseTo(0.42047119140625, 12);
    expect(audit.goldSevenProbability).toBeCloseTo(1 / 32768, 12);
  });
});
