export const SKYWAY_STOPS = 16;
export const MAX_FUEL = 30;
export const LANDMARK_COUNT = 4;
export const LANDMARK_STAGES = 4;
export const LANDMARK_NAMES = ['Aerie Post', 'Cloud Garden', 'Signal Spire', 'Skyforge Hangar'] as const;

export type TileKind = 'dispatch' | 'market' | 'workshop' | 'beacon' | 'storm' | 'windgate' | 'cargo';
export interface SkyTile { name: string; kind: TileKind }
export interface CargoCache { options: [number, number, number] }
export interface CloudlineRun {
  seed: number;
  rngState: number;
  position: number;
  credits: number;
  fuel: number;
  district: number;
  landmarks: [number, number, number, number];
  shield: boolean;
  streak: number;
  circuits: number;
  deliveries: number;
  pendingCargo: CargoCache | null;
  lastRoll: number | null;
  message: string;
}

export const SKYWAY: readonly SkyTile[] = [
  { name: 'Dispatch Dock', kind: 'dispatch' }, { name: 'Sunspoke Market', kind: 'market' }, { name: 'Cloudsmith Works', kind: 'workshop' }, { name: 'Northstar Beacon', kind: 'beacon' },
  { name: 'Squall Belt', kind: 'storm' }, { name: 'Tailwind Gate', kind: 'windgate' }, { name: 'Copperwing Market', kind: 'market' }, { name: 'Cargo Cache', kind: 'cargo' },
  { name: 'Aerie Workshop', kind: 'workshop' }, { name: 'Eastlight Beacon', kind: 'beacon' }, { name: 'Rainwall', kind: 'storm' }, { name: 'Highroute Market', kind: 'market' },
  { name: 'Cargo Cache', kind: 'cargo' }, { name: 'Jetstream Gate', kind: 'windgate' }, { name: 'Lantern Market', kind: 'market' }, { name: 'Homewind Workshop', kind: 'workshop' },
];

function norm(seed: number) { return (Math.trunc(seed) >>> 0) || 0x6d2b79f5; }
function random(state: number): [number, number] {
  let x = norm(state);
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  const n = x >>> 0;
  return [n, n / 0x1_0000_0000];
}

export function buildFlightPath(startPosition: number, roll: number): number[] {
  if (!Number.isInteger(startPosition) || startPosition < 0 || startPosition >= SKYWAY_STOPS) throw new Error('Start position is out of range.');
  if (!Number.isInteger(roll) || roll < 1 || roll > 6) throw new Error('Flight roll is out of range.');
  const path = Array.from({ length: roll }, (_, step) => (startPosition + step + 1) % SKYWAY_STOPS);
  const landing = path[path.length - 1];
  if (SKYWAY[landing].kind === 'windgate') {
    path.push((landing + 1) % SKYWAY_STOPS, (landing + 2) % SKYWAY_STOPS);
  }
  return path;
}

export function createCloudlineRun(seed: number): CloudlineRun {
  const s = norm(seed);
  return {
    seed: s,
    rngState: s,
    position: 0,
    credits: 450,
    fuel: 18,
    district: 1,
    landmarks: [0, 0, 0, 0],
    shield: false,
    streak: 0,
    circuits: 0,
    deliveries: 0,
    pendingCargo: null,
    lastRoll: null,
    message: 'Ready at Dispatch Dock. Choose a boost, then fly.',
  };
}

function rewardDelivery(run: CloudlineRun, base: number, boost: number) {
  const nextStreak = (run.streak + 1) % 4;
  const streakBonus = nextStreak === 0 ? 120 * run.district * boost : 0;
  return {
    ...run,
    credits: run.credits + (base * boost) + streakBonus,
    streak: nextStreak,
    deliveries: run.deliveries + 1,
  };
}

export function rollFlight(run: CloudlineRun, boost: 1 | 2 | 3): CloudlineRun {
  if (run.pendingCargo) throw new Error('Resolve the Cargo Cache first.');
  if (run.fuel < boost) throw new Error('Not enough fuel for that boost.');

  let state: number;
  let r: number;
  [state, r] = random(run.rngState);
  const roll = 1 + Math.floor(r * 6);
  const raw = run.position + roll;
  const crossed = Math.floor(raw / SKYWAY_STOPS);
  const circuitReward = crossed * 100 * run.district * boost;
  let next: CloudlineRun = {
    ...run,
    rngState: state,
    position: raw % SKYWAY_STOPS,
    fuel: run.fuel - boost,
    circuits: run.circuits + crossed,
    credits: run.credits + circuitReward,
    lastRoll: roll,
  };
  const tile = SKYWAY[next.position];
  let message: string;

  if (tile.kind === 'market') {
    const before = next.credits;
    next = rewardDelivery(next, 45 * next.district, boost);
    message = `Delivered at ${tile.name}. +${next.credits - before} credits.`;
  } else if (tile.kind === 'workshop') {
    next = { ...next, fuel: Math.min(MAX_FUEL, next.fuel + 2 * boost) };
    message = `Refueled at ${tile.name}. Fuel is now ${next.fuel}/${MAX_FUEL}.`;
  } else if (tile.kind === 'beacon') {
    next = { ...next, shield: true };
    message = `Storm shield ready at ${tile.name}.`;
  } else if (tile.kind === 'storm') {
    if (next.shield) {
      next = { ...next, shield: false };
      message = `Storm shield absorbed ${tile.name}. Your delivery streak is safe.`;
    } else {
      const before = next.credits;
      next = { ...next, credits: Math.max(0, next.credits - 35 * next.district), streak: 0 };
      message = `Hit ${tile.name}. -${before - next.credits} credits and delivery streak reset.`;
    }
  } else if (tile.kind === 'windgate') {
    next = { ...next, position: (next.position + 2) % SKYWAY_STOPS };
    message = `${tile.name} carried you ahead to ${SKYWAY[next.position].name}.`;
  } else if (tile.kind === 'dispatch') {
    const before = next.credits;
    next = rewardDelivery(next, 70 * next.district, boost);
    message = `Delivered at ${tile.name}. +${next.credits - before} credits.`;
  } else {
    let a: number;
    let b: number;
    let c: number;
    [state, a] = random(next.rngState);
    [state, b] = random(state);
    [state, c] = random(state);
    next = {
      ...next,
      rngState: state,
      pendingCargo: { options: [40 + Math.floor(a * 61), 40 + Math.floor(b * 61), 40 + Math.floor(c * 61)] },
    };
    message = 'Cargo Cache found. Choose a pod to finish this stop.';
  }

  if (circuitReward > 0) message += ` Circuit complete: +${circuitReward} credits.`;
  if (next.fuel === 0) {
    next = { ...next, fuel: 3 };
    message += ' Emergency reserve restored 3 fuel.';
  }
  return { ...next, message };
}

export function resolveCargo(run: CloudlineRun, index: number): CloudlineRun {
  if (!run.pendingCargo) throw new Error('No Cargo Cache is open.');
  if (!Number.isInteger(index) || index < 0 || index > 2) throw new Error('Cargo pod is out of range.');
  const reward = run.pendingCargo.options[index] * run.district;
  return { ...run, credits: run.credits + reward, pendingCargo: null, message: `Cargo delivered. +${reward} credits.` };
}

export function landmarkCost(run: CloudlineRun, index: number) {
  if (!Number.isInteger(index) || index < 0 || index >= LANDMARK_COUNT) throw new Error('Landmark is out of range.');
  const stage = run.landmarks[index];
  if (stage >= LANDMARK_STAGES) return null;
  return 120 * run.district * (stage + 1);
}

export function upgradeLandmark(run: CloudlineRun, index: number): CloudlineRun {
  const cost = landmarkCost(run, index);
  if (run.pendingCargo) throw new Error('Choose a cargo pod before upgrading a landmark.');
  if (cost === null) throw new Error('Landmark is already complete.');
  if (run.credits < cost) throw new Error('Not enough credits.');
  const landmarks = [...run.landmarks] as [number, number, number, number];
  landmarks[index] += 1;
  const complete = landmarks.every(stage => stage === LANDMARK_STAGES);
  if (complete) {
    return {
      ...run,
      credits: run.credits - cost + 250 * run.district,
      district: run.district + 1,
      landmarks: [0, 0, 0, 0],
      fuel: Math.min(MAX_FUEL, run.fuel + 6),
      message: `District ${run.district} rebuilt. District ${run.district + 1} unlocked.`,
    };
  }
  return {
    ...run,
    credits: run.credits - cost,
    landmarks,
    message: `${LANDMARK_NAMES[index]} upgraded to stage ${landmarks[index]}.`,
  };
}
