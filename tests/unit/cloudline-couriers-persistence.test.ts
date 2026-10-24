import { describe, expect, it } from 'vitest';
import { MAX_CAREER_XP, xpFromRun } from '../../src/games/cloudline-couriers/career';
import { createCloudlineRun, upgradeLandmark } from '../../src/games/cloudline-couriers/engine';
import { cloudlineCouriersSaveDefinition, decodeCloudlineSave } from '../../src/games/cloudline-couriers/persistence';
import { NewerSaveVersionError, decodeEnvelope } from '../../src/platform/saves/contracts';

describe('Cloudline Couriers persistence', () => {
  it('accepts a complete deterministic run and exposes a stable v2 contract', () => {
    const run = upgradeLandmark(createCloudlineRun(12345), 0);
    expect(decodeCloudlineSave({ activeRun: run, career: { xp: 42 } })).toEqual({ activeRun: run, career: { xp: 42 } });
    expect(cloudlineCouriersSaveDefinition.slug).toBe('cloudline-couriers');
    expect(cloudlineCouriersSaveDefinition.schemaVersion).toBe(2);
    expect(cloudlineCouriersSaveDefinition.storageKey).toBe('inmogames:cloudline-couriers:v2');
    expect(cloudlineCouriersSaveDefinition.priorStorageKeys).toEqual(['inmogames:cloudline-couriers:v1']);
    expect(cloudlineCouriersSaveDefinition.initial).toEqual({ activeRun: null, career: { xp: 0 } });
  });

  it('rejects malformed career state instead of partially trusting it', () => {
    const run = createCloudlineRun(999);
    const career = { xp: 0 };
    expect(decodeCloudlineSave({ activeRun: { ...run, fuel: 0 }, career })).toBeNull();
    expect(decodeCloudlineSave({ activeRun: { ...run, landmarks: [0, 0, 0] }, career })).toBeNull();
    expect(decodeCloudlineSave({ activeRun: { ...run, streak: 4 }, career })).toBeNull();
    expect(decodeCloudlineSave({ activeRun: { ...run, pendingCargo: { options: [40, 60, 101] } }, career })).toBeNull();
    expect(decodeCloudlineSave({ activeRun: { ...run, lastRoll: 7 }, career })).toBeNull();
    expect(decodeCloudlineSave({ activeRun: { ...run, landmarks: [4, 4, 4, 4] }, career })).toBeNull();
  });

  it('rejects a save without a valid career xp', () => {
    expect(decodeCloudlineSave({ activeRun: null })).toBeNull();
    expect(decodeCloudlineSave({ activeRun: null, career: { xp: -1 } })).toBeNull();
    expect(decodeCloudlineSave({ activeRun: null, career: { xp: 1.5 } })).toBeNull();
    expect(decodeCloudlineSave({ activeRun: null, career: { xp: '5' } })).toBeNull();
    expect(decodeCloudlineSave({ activeRun: null, career: { xp: MAX_CAREER_XP + 1 } })).toBeNull();
  });

  it('migrates a v1 run to v2 with the rank its run already earned', () => {
    const run = { ...createCloudlineRun(7), deliveries: 7, circuits: 2, district: 3, landmarks: [1, 2, 0, 4] as [number, number, number, number] };
    expect(decodeEnvelope({ schemaVersion: 1, state: { activeRun: run } }, cloudlineCouriersSaveDefinition)).toEqual({ activeRun: run, career: { xp: xpFromRun(run) } });
  });

  it('migrates a v1 save without an active run to zero xp', () => {
    expect(decodeEnvelope({ schemaVersion: 1, state: { activeRun: null } }, cloudlineCouriersSaveDefinition)).toEqual({ activeRun: null, career: { xp: 0 } });
  });

  it('rejects an invalid v1 run during migration', () => {
    const run = createCloudlineRun(999);
    expect(() => decodeEnvelope({ schemaVersion: 1, state: { activeRun: { ...run, fuel: 0 } } }, cloudlineCouriersSaveDefinition)).toThrow('The saved game is invalid.');
  });

  it('refuses a save written by a newer version', () => {
    expect(() => decodeEnvelope({ schemaVersion: 3, state: { activeRun: null, career: { xp: 0 } } }, cloudlineCouriersSaveDefinition)).toThrow(NewerSaveVersionError);
  });
});
