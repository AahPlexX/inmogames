import { describe, expect, it } from 'vitest';
import { createCloudlineRun, landmarkCost, resolveCargo, rollFlight, upgradeLandmark, type CloudlineRun } from '../../src/games/cloudline-couriers/engine';

// Searches seeds 1..5000 for a run whose rollFlight result satisfies `landed`. Throws if none matches.
function findRun(start: Partial<CloudlineRun>, boost: 1 | 2 | 3, landed: (next: CloudlineRun) => boolean): { run: CloudlineRun; next: CloudlineRun } {
  for (let seed = 1; seed <= 5000; seed += 1) {
    const run = { ...createCloudlineRun(seed), ...start };
    const next = rollFlight(run, boost);
    if (landed(next)) return { run, next };
  }
  throw new Error('No seed in 1..5000 matched the landing predicate.');
}

describe('Cloudline Couriers engine characterization', () => {
  it('pays dispatch tile reward (70 * district * boost) plus circuit reward', () => {
    // Only reachable by crossing the circuit: start 14 + roll 2 = 16 -> position 0.
    const { next } = findRun({ position: 14, district: 2 }, 2, n => n.position === 0);
    expect(next.credits).toBe(450 + 400 + 280);
    expect(next.fuel).toBe(16);
    expect(next.circuits).toBe(1);
    expect(next.streak).toBe(1);
    expect(next.deliveries).toBe(1);
    expect(next.message).toBe('Delivered at Dispatch Dock. +280 credits. Circuit complete: +400 credits.');
  });

  it('refuels at a workshop by 2 * boost, capped at MAX_FUEL', () => {
    const plain = findRun({ position: 0, fuel: 18 }, 2, n => n.position === 2).next;
    expect(plain.fuel).toBe(20);
    expect(plain.message).toBe('Refueled at Cloudsmith Works. Fuel is now 20/30.');

    const capped = findRun({ position: 0, fuel: 29 }, 3, n => n.position === 2).next;
    expect(capped.fuel).toBe(30);
    expect(capped.message).toBe('Refueled at Cloudsmith Works. Fuel is now 30/30.');
  });

  it('grants a storm shield on a beacon', () => {
    // Seeds 1..5000 only roll 1 or 2 first, so start tiles are chosen to make the needed roll 1 or 2.
    const { next } = findRun({ position: 2, credits: 450 }, 1, n => n.position === 3);
    expect(next.shield).toBe(true);
    expect(next.credits).toBe(450);
    expect(next.message).toBe('Storm shield ready at Northstar Beacon.');
  });

  it('absorbs a storm with the shield: shield consumed, streak kept, no credit loss', () => {
    const { next } = findRun({ position: 2, shield: true, streak: 2, credits: 450 }, 1, n => n.position === 4);
    expect(next.shield).toBe(false);
    expect(next.streak).toBe(2);
    expect(next.credits).toBe(450);
    expect(next.message).toBe('Storm shield absorbed Squall Belt. Your delivery streak is safe.');
  });

  it('storm without shield costs 35 * district credits and resets the streak', () => {
    const { next } = findRun({ position: 2, streak: 2, district: 2, credits: 450 }, 1, n => n.position === 4);
    expect(next.credits).toBe(380);
    expect(next.streak).toBe(0);
    expect(next.shield).toBe(false);
    expect(next.message).toBe('Hit Squall Belt. -70 credits and delivery streak reset.');
  });

  it('storm credit loss floors at zero and reports the actual loss', () => {
    const { next } = findRun({ position: 2, credits: 20, district: 1 }, 1, n => n.position === 4);
    expect(next.credits).toBe(0);
    expect(next.message).toBe('Hit Squall Belt. -20 credits and delivery streak reset.');
  });

  it('windgate carries the flight two stops ahead', () => {
    // Windgate at 5 advances to 7 (Cargo Cache); the cargo tile is not resolved after a carry.
    const { next } = findRun({ position: 3, credits: 450 }, 1, n => n.position === 7 && n.lastRoll === 2);
    expect(next.position).toBe(7);
    expect(next.pendingCargo).toBeNull();
    expect(next.credits).toBe(450);
    expect(next.message).toBe('Tailwind Gate carried you ahead to Cargo Cache.');
  });

  it('opens a Cargo Cache with three pods each between 40 and 100', () => {
    const { next } = findRun({ position: 6, credits: 450 }, 1, n => n.pendingCargo !== null);
    expect(next.pendingCargo).not.toBeNull();
    const options = next.pendingCargo!.options;
    expect(options).toHaveLength(3);
    for (const option of options) {
      expect(option).toBeGreaterThanOrEqual(40);
      expect(option).toBeLessThanOrEqual(100);
    }
    expect(next.credits).toBe(450);
    expect(next.message).toBe('Cargo Cache found. Choose a pod to finish this stop.');
  });

  it('pays circuit completion (crossed * 100 * district * boost) and counts circuits', () => {
    // Start 15 + roll 2 = 17 -> position 1 (market), crossing the circuit once.
    const { next } = findRun({ position: 15, district: 2, credits: 450 }, 3, n => n.position === 1);
    expect(next.circuits).toBe(1);
    expect(next.fuel).toBe(15);
    expect(next.credits).toBe(450 + 600 + 270);
    expect(next.message).toBe('Delivered at Sunspoke Market. +270 credits. Circuit complete: +600 credits.');
  });

  it('pays the route bonus on every fourth delivery and wraps the streak', () => {
    const third = findRun({ position: 0, streak: 2, credits: 450 }, 1, n => n.position === 1).next;
    expect(third.streak).toBe(3);
    expect(third.credits).toBe(495);

    const fourth = findRun({ position: 0, streak: 3, district: 2, credits: 450 }, 2, n => n.position === 1).next;
    expect(fourth.streak).toBe(0);
    expect(fourth.deliveries).toBe(1);
    expect(fourth.credits).toBe(450 + 180 + 480);
    expect(fourth.message).toBe('Delivered at Sunspoke Market. +660 credits.');
  });

  it('restores 3 fuel when fuel reaches zero', () => {
    const { next } = findRun({ position: 0, fuel: 1, credits: 450 }, 1, n => n.position === 1);
    expect(next.fuel).toBe(3);
    expect(next.credits).toBe(495);
    expect(next.message).toBe('Delivered at Sunspoke Market. +45 credits. Emergency reserve restored 3 fuel.');
  });

  it('rollFlight refuses to fly while a Cargo Cache is pending', () => {
    const run = { ...createCloudlineRun(1), pendingCargo: { options: [40, 50, 60] as [number, number, number] } };
    expect(() => rollFlight(run, 1)).toThrow('Resolve the Cargo Cache first.');
  });

  it('resolveCargo pays the chosen pod times district and rejects bad indexes', () => {
    const run = { ...createCloudlineRun(1), district: 2, credits: 450, pendingCargo: { options: [40, 60, 100] as [number, number, number] } };
    const next = resolveCargo(run, 1);
    expect(next.credits).toBe(570);
    expect(next.pendingCargo).toBeNull();
    expect(next.message).toBe('Cargo delivered. +120 credits.');
    expect(() => resolveCargo(run, 3)).toThrow('Cargo pod is out of range.');
    expect(() => resolveCargo(run, -1)).toThrow('Cargo pod is out of range.');
  });

  it('landmarkCost returns null for a completed landmark', () => {
    const run = { ...createCloudlineRun(1), landmarks: [4, 0, 0, 0] as [number, number, number, number] };
    expect(landmarkCost(run, 0)).toBeNull();
    expect(landmarkCost(run, 1)).toBe(120);
  });

  it('upgradeLandmark rejects a completed landmark', () => {
    const run = { ...createCloudlineRun(1), credits: 100000, landmarks: [4, 0, 0, 0] as [number, number, number, number] };
    expect(() => upgradeLandmark(run, 0)).toThrow('Landmark is already complete.');
  });

  it('upgradeLandmark increments a non-final stage and charges 120 * district * (stage + 1)', () => {
    const once = upgradeLandmark({ ...createCloudlineRun(1), credits: 450 }, 0);
    expect(once.landmarks).toEqual([1, 0, 0, 0]);
    expect(once.credits).toBe(330);
    expect(once.district).toBe(1);
    expect(once.message).toBe('Aerie Post upgraded to stage 1.');

    const twice = upgradeLandmark(once, 0);
    expect(twice.landmarks).toEqual([2, 0, 0, 0]);
    expect(twice.credits).toBe(90);
  });

  it('completing the final landmark pays 250 * district, adds 6 fuel capped at MAX_FUEL, and advances the district', () => {
    const run = { ...createCloudlineRun(1), district: 2, credits: 1000, fuel: 10, landmarks: [4, 4, 4, 3] as [number, number, number, number] };
    const next = upgradeLandmark(run, 3);
    expect(next.credits).toBe(1000 - 960 + 500);
    expect(next.fuel).toBe(16);
    expect(next.district).toBe(3);
    expect(next.landmarks).toEqual([0, 0, 0, 0]);
    expect(next.message).toBe('District 2 rebuilt. District 3 unlocked.');

    const capped = upgradeLandmark({ ...run, fuel: 28 }, 3);
    expect(capped.fuel).toBe(30);
  });

  it('normalizes seed 0 to the fallback seed and yields identical runs for the same seed', () => {
    const fallback = 0x6d2b79f5;
    expect(createCloudlineRun(0).seed).toBe(fallback);
    expect(createCloudlineRun(0).rngState).toBe(fallback);
    expect(createCloudlineRun(0)).toEqual(createCloudlineRun(fallback));
    expect(createCloudlineRun(42)).toEqual(createCloudlineRun(42));
    expect(rollFlight(createCloudlineRun(0), 1)).toEqual(rollFlight(createCloudlineRun(fallback), 1));
  });
});
