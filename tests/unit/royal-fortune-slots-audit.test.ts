import { describe, expect, it } from 'vitest';
import { auditRoyalFortuneBaseGame } from '../../src/games/royal-fortune-slots/audit';
import { REEL_STRIPS } from '../../src/games/royal-fortune-slots/reels';

describe('Royal Fortune probability audit', () => {
  it('keeps every reel at 32 stops with exactly one Scatter', () => {
    expect(REEL_STRIPS).toHaveLength(5);
    for (const reel of REEL_STRIPS) {
      expect(reel).toHaveLength(32);
      expect(reel.filter((symbol) => symbol === 'Scatter')).toHaveLength(1);
    }
  });

  it('computes exact base-game return and feature-entry frequency from source constants', () => {
    const audit = auditRoyalFortuneBaseGame(5);
    expect(audit.scatterCountProbability.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 12);
    expect(audit.lineReturnRatio).toBeCloseTo(0.8503680229187012, 12);
    expect(audit.scatterReturnRatio).toBeCloseTo(0.0083121657371521, 12);
    expect(audit.baseReturnRatio).toBeCloseTo(0.8586801886558533, 12);
    expect(audit.featureEntryProbability).toBeCloseTo(0.007124483585357666, 12);
    expect(audit.expectedBaseFreeSpinsAwarded).toBeCloseTo(0.05848288536071777, 12);
  });
});
