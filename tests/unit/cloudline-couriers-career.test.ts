import { describe, expect, it } from 'vitest';
import {
  MAX_CAREER_XP,
  XP_PER_CARGO,
  XP_PER_CIRCUIT,
  XP_PER_DELIVERY,
  XP_PER_DISTRICT,
  XP_PER_UPGRADE,
  awardXp,
  rankStanding,
  xpForUpgrade,
  xpFromFlight,
  xpFromRun,
} from '../../src/games/cloudline-couriers/career';
import { createCloudlineRun } from '../../src/games/cloudline-couriers/engine';
import { cloudlineCouriersSaveDefinition } from '../../src/games/cloudline-couriers/persistence';

describe('Cloudline Couriers career', () => {
  it('exposes the XP constants', () => {
    expect(MAX_CAREER_XP).toBe(1_000_000_000);
    expect(XP_PER_DELIVERY).toBe(10);
    expect(XP_PER_CIRCUIT).toBe(25);
    expect(XP_PER_CARGO).toBe(5);
    expect(XP_PER_UPGRADE).toBe(15);
    expect(XP_PER_DISTRICT).toBe(100);
  });

  it('awards flight XP from deliveries and circuits gained', () => {
    const before = createCloudlineRun(1);
    expect(xpFromFlight(before, { ...before, deliveries: 1 })).toBe(10);
    expect(xpFromFlight(before, { ...before, circuits: 2 })).toBe(50);
    expect(xpFromFlight(before, { ...before, deliveries: 1, circuits: 2 })).toBe(60);
    const used = { ...before, deliveries: 5, circuits: 3 };
    expect(xpFromFlight(used, { ...used, deliveries: 3, circuits: 1 })).toBe(0);
  });

  it('awards upgrade XP and a bonus for advancing the district', () => {
    const before = createCloudlineRun(1);
    expect(xpForUpgrade(before, { ...before, landmarks: [1, 0, 0, 0] })).toBe(15);
    expect(xpForUpgrade(before, { ...before, district: 2 })).toBe(115);
  });

  it('derives the XP an existing run already earned', () => {
    const initial = createCloudlineRun(1);
    expect(xpFromRun(initial)).toBe(0);
    expect(xpFromRun({ ...initial, deliveries: 7, circuits: 2, district: 3, landmarks: [1, 2, 0, 4] })).toBe(425);
  });

  it('places XP on rank boundaries', () => {
    expect(rankStanding(0)).toMatchObject({ rank: { rank: 1 }, next: { rank: 2 }, xpIntoRank: 0, xpForNext: 100 });
    expect(rankStanding(99)).toMatchObject({ rank: { rank: 1 }, xpIntoRank: 99, xpForNext: 100 });
    expect(rankStanding(100).rank.rank).toBe(2);
    expect(rankStanding(249).rank.rank).toBe(2);
    expect(rankStanding(250).rank.rank).toBe(3);
    expect(rankStanding(3599).rank.rank).toBe(7);
    expect(rankStanding(3600)).toMatchObject({ rank: { rank: 8 }, next: null, xpForNext: null });
    expect(rankStanding(10_000_000)).toMatchObject({ rank: { rank: 8 }, next: null, xpForNext: null });
    // Invalid XP must never reach the UI as NaN or a negative progress value.
    expect(rankStanding(Number.NaN)).toMatchObject({ rank: { rank: 1 }, xpIntoRank: 0, xpForNext: 100 });
    expect(rankStanding(-5)).toMatchObject({ rank: { rank: 1 }, xpIntoRank: 0, xpForNext: 100 });
  });

  it('awards career XP without mutating the input', () => {
    const career = { xp: 5 };
    expect(awardXp(career, 10)).toEqual({ xp: 15 });
    expect(awardXp(career, 0)).toEqual({ xp: 5 });
    expect(awardXp(career, -5)).toEqual({ xp: 5 });
    expect(awardXp(career, Number.NaN)).toEqual({ xp: 5 });
    expect(awardXp(career, Number.POSITIVE_INFINITY)).toEqual({ xp: 5 });
    expect(awardXp(career, 7.9)).toEqual({ xp: 12 });
    expect(awardXp({ xp: MAX_CAREER_XP - 5 }, 100)).toEqual({ xp: MAX_CAREER_XP });
    const result = awardXp(career, 10);
    expect(result).not.toBe(career);
    expect(career).toEqual({ xp: 5 });
  });

  it('clamps migrated XP at the cap instead of rejecting a valid v1 save', () => {
    const run = { ...createCloudlineRun(1), circuits: 100_000_000 };
    expect(xpFromRun(run)).toBeGreaterThan(MAX_CAREER_XP);
    const migrated = cloudlineCouriersSaveDefinition.migrate!(1, { activeRun: run });
    expect(migrated).toEqual({ activeRun: run, career: { xp: MAX_CAREER_XP } });
    expect(cloudlineCouriersSaveDefinition.decode(migrated)).toEqual(migrated);
  });
});
