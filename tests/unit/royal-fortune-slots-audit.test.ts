import { describe, expect, it } from 'vitest';
import { CONFIGURED_TOTAL_RETURN_RATIO, auditRoyalFortuneBaseGame, auditRoyalFortuneFullGame } from '../../src/games/royal-fortune-slots/audit';
import { REEL_STRIPS } from '../../src/games/royal-fortune-slots/reels';

describe('Royal Fortune probability audit', () => {
  it('keeps every reel at 32 stops with exactly one Scatter', () => {
    expect(REEL_STRIPS).toHaveLength(5);
    for (const reel of REEL_STRIPS) {
      expect(reel).toHaveLength(32);
      expect(reel.filter((symbol) => symbol === 'Scatter')).toHaveLength(1);
    }
  });

  it('computes exact base-game return and event frequencies from source constants', () => {
    const audit = auditRoyalFortuneBaseGame(5);
    expect(audit.scatterCountProbability.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 12);
    expect(audit.lineReturnRatio).toBeCloseTo(0.8503680229187012, 12);
    expect(audit.scatterReturnRatio).toBeCloseTo(0.0083121657371521, 12);
    expect(audit.baseReturnRatio).toBeCloseTo(0.8586801886558533, 12);
    expect(audit.winningSpinProbability).toBeCloseTo(0.4348173141479492, 12);
    expect(audit.featureEntryProbability).toBeCloseTo(0.007124483585357666, 12);
    expect(audit.expectedBaseFreeSpinsAwarded).toBeCloseTo(0.05848288536071777, 12);
  });

  it('derives the full-feature expected value from the exact free-spin state recurrence', () => {
    const audit = auditRoyalFortuneFullGame(5);
    expect(audit.freeSpinRetriggerProbability).toBeCloseTo(0.007124483585357666, 12);
    expect(audit.expectedFeaturePayoutByInitialSpins[8]).toBeCloseTo(91.04201497132425, 10);
    expect(audit.expectedFeaturePayoutByInitialSpins[12]).toBeCloseTo(170.11451641181813, 10);
    expect(audit.expectedFeaturePayoutByInitialSpins[20]).toBeCloseTo(344.06694598262914, 10);
    expect(audit.featureReturnRatio).toBeCloseTo(0.13562747003238904, 12);
    expect(audit.totalReturnRatio).toBeCloseTo(CONFIGURED_TOTAL_RETURN_RATIO, 12);
  });
});
