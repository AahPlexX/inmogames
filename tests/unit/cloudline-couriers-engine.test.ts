import { describe, expect, it } from 'vitest';
import { buildFlightPath, createCloudlineRun, landmarkCost, resolveCargo, rollFlight, SKYWAY, upgradeLandmark } from '../../src/games/cloudline-couriers/engine';

describe('Cloudline Couriers engine', () => {
  it('creates a deterministic sixteen-stop route state', () => {
    expect(SKYWAY).toHaveLength(16);
    expect(createCloudlineRun(42)).toEqual(createCloudlineRun(42));
    expect(createCloudlineRun(42).fuel).toBeGreaterThan(0);
  });

  it('builds every visible route step, including windgate carry', () => {
    expect(buildFlightPath(15, 2)).toEqual([0, 1]);
    expect(buildFlightPath(4, 1)).toEqual([5, 6, 7]);
    expect(() => buildFlightPath(16, 1)).toThrow(/Start position/);
    expect(() => buildFlightPath(0, 7)).toThrow(/Flight roll/);
  });

  it('rolls deterministically and consumes the selected boost', () => {
    const a = rollFlight(createCloudlineRun(77), 2);
    const b = rollFlight(createCloudlineRun(77), 2);
    expect(a).toEqual(b);
    expect(a.fuel).toBeGreaterThan(0);
    expect(a.lastRoll).toBeGreaterThanOrEqual(1);
    expect(a.lastRoll).toBeLessThanOrEqual(6);
  });

  it('describes a delivery result instead of reporting a generic resolution', () => {
    const next = rollFlight(createCloudlineRun(1), 1);
    expect(next.position).toBe(1);
    expect(next.message).toBe('Delivered at Sunspoke Market. +45 credits.');
  });

  it('requires cargo resolution before another flight', () => {
    let run = createCloudlineRun(1);
    for (let i = 0; i < 30 && !run.pendingCargo; i += 1) run = rollFlight(run, 1);
    if (run.pendingCargo) {
      expect(() => rollFlight(run, 1)).toThrow(/Cargo Cache/);
      const credits = run.credits;
      run = resolveCargo(run, 0);
      expect(run.pendingCargo).toBeNull();
      expect(run.credits).toBeGreaterThan(credits);
    }
  });

  it('prices upgrades and advances a completed district', () => {
    let run = { ...createCloudlineRun(9), credits: 100000, landmarks: [4, 4, 4, 3] as [number, number, number, number] };
    expect(landmarkCost(run, 3)).toBe(480);
    run = upgradeLandmark(run, 3);
    expect(run.district).toBe(2);
    expect(run.landmarks).toEqual([0, 0, 0, 0]);
  });

  it('requires pending cargo to settle before a district upgrade can reprice it', () => {
    const run = { ...createCloudlineRun(9), credits: 10000, landmarks: [4, 4, 4, 3] as [number, number, number, number], pendingCargo: { options: [40, 60, 100] as [number, number, number] } };
    expect(() => upgradeLandmark(run, 3)).toThrow(/cargo pod/i);
    const delivered = resolveCargo(run, 1);
    expect(delivered.credits).toBe(10060);
    const rebuilt = upgradeLandmark(delivered, 3);
    expect(rebuilt.district).toBe(2);
    expect(rebuilt.credits).toBe(9830);
  });

  it('rejects unaffordable boosts and upgrades', () => {
    expect(() => rollFlight({ ...createCloudlineRun(2), fuel: 1 }, 3)).toThrow(/fuel/);
    expect(() => upgradeLandmark({ ...createCloudlineRun(2), credits: 0 }, 0)).toThrow(/credits/);
  });
});
