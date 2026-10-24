import type { GameSaveDefinition } from '../../platform/saves/contracts';
import { LANDMARK_COUNT, LANDMARK_STAGES, MAX_FUEL, SKYWAY_STOPS, type CargoCache, type CloudlineRun } from './engine';
import { MAX_CAREER_XP, xpFromRun, type CloudlineCareer } from './career';

export interface CloudlineSave {
  activeRun: CloudlineRun | null;
  career: CloudlineCareer;
}

function isIntegerIn(value: unknown, min: number, max = Number.MAX_SAFE_INTEGER): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max;
}

function decodeCargo(value: unknown): CargoCache | null {
  if (!value || typeof value !== 'object') return null;
  const cargo = value as { options?: unknown };
  if (!Array.isArray(cargo.options) || cargo.options.length !== 3) return null;
  if (cargo.options.some(option => !isIntegerIn(option, 40, 100))) return null;
  return { options: [cargo.options[0], cargo.options[1], cargo.options[2]] };
}

function decodeRun(value: unknown): CloudlineRun | null {
  if (!value || typeof value !== 'object') return null;
  const run = value as Partial<CloudlineRun>;
  if (!isIntegerIn(run.seed, 1, 0xffff_ffff) || !isIntegerIn(run.rngState, 1, 0xffff_ffff)) return null;
  if (!isIntegerIn(run.position, 0, SKYWAY_STOPS - 1)) return null;
  if (!isIntegerIn(run.credits, 0) || !isIntegerIn(run.fuel, 1, MAX_FUEL) || !isIntegerIn(run.district, 1)) return null;
  if (!Array.isArray(run.landmarks) || run.landmarks.length !== LANDMARK_COUNT || run.landmarks.some(stage => !isIntegerIn(stage, 0, LANDMARK_STAGES))) return null;
  if (run.landmarks.every(stage => stage === LANDMARK_STAGES)) return null;
  if (typeof run.shield !== 'boolean' || !isIntegerIn(run.streak, 0, 3)) return null;
  if (!isIntegerIn(run.circuits, 0) || !isIntegerIn(run.deliveries, 0)) return null;
  let pendingCargo: CargoCache | null = null;
  if (run.pendingCargo !== null) {
    pendingCargo = decodeCargo(run.pendingCargo);
    if (!pendingCargo) return null;
  }
  if (run.lastRoll !== null && !isIntegerIn(run.lastRoll, 1, 6)) return null;
  if (typeof run.message !== 'string' || run.message.length > 240) return null;
  return {
    seed: run.seed,
    rngState: run.rngState,
    position: run.position,
    credits: run.credits,
    fuel: run.fuel,
    district: run.district,
    landmarks: [run.landmarks[0], run.landmarks[1], run.landmarks[2], run.landmarks[3]],
    shield: run.shield,
    streak: run.streak,
    circuits: run.circuits,
    deliveries: run.deliveries,
    pendingCargo,
    lastRoll: run.lastRoll,
    message: run.message,
  };
}

function decodeCareer(value: unknown): CloudlineCareer | null {
  if (!value || typeof value !== 'object') return null;
  const xp = (value as { xp?: unknown }).xp;
  return isIntegerIn(xp, 0, MAX_CAREER_XP) ? { xp } : null;
}

export function decodeCloudlineSave(value: unknown): CloudlineSave | null {
  if (!value || typeof value !== 'object') return null;
  const save = value as Partial<CloudlineSave>;
  const career = decodeCareer(save.career);
  if (!career) return null;
  if (save.activeRun === null) return { activeRun: null, career };
  const activeRun = decodeRun(save.activeRun);
  return activeRun ? { activeRun, career } : null;
}

export const cloudlineCouriersSaveDefinition: GameSaveDefinition<CloudlineSave> = {
  slug: 'cloudline-couriers',
  schemaVersion: 2,
  storageKey: 'inmogames:cloudline-couriers:v2',
  priorStorageKeys: ['inmogames:cloudline-couriers:v1'],
  initial: { activeRun: null, career: { xp: 0 } },
  decode: decodeCloudlineSave,
  migrate(fromVersion, state) {
    if (fromVersion !== 1 || !state || typeof state !== 'object') return null;
    const save = state as Partial<CloudlineSave>;
    if (save.activeRun === null) return { activeRun: null, career: { xp: 0 } };
    const activeRun = decodeRun(save.activeRun);
    // Clamp so an extreme but valid v1 run can never make decode reject (and so destroy) the whole save.
    return activeRun ? { activeRun, career: { xp: Math.min(MAX_CAREER_XP, xpFromRun(activeRun)) } } : null;
  },
};
