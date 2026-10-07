import { describe, expect, it } from 'vitest';
import { createCloudlineRun, upgradeLandmark } from '../../src/games/cloudline-couriers/engine';
import { cloudlineCouriersSaveDefinition, decodeCloudlineSave } from '../../src/games/cloudline-couriers/persistence';

describe('Cloudline Couriers persistence', () => {
  it('accepts a complete deterministic run and exposes a stable v1 contract', () => {
    const run = upgradeLandmark(createCloudlineRun(12345), 0);
    expect(decodeCloudlineSave({ activeRun: run })).toEqual({ activeRun: run });
    expect(cloudlineCouriersSaveDefinition.slug).toBe('cloudline-couriers');
    expect(cloudlineCouriersSaveDefinition.schemaVersion).toBe(1);
    expect(cloudlineCouriersSaveDefinition.storageKey).toBe('inmogames:cloudline-couriers:v1');
  });

  it('rejects malformed career state instead of partially trusting it', () => {
    const run = createCloudlineRun(999);
    expect(decodeCloudlineSave({ activeRun: { ...run, fuel: 0 } })).toBeNull();
    expect(decodeCloudlineSave({ activeRun: { ...run, landmarks: [0, 0, 0] } })).toBeNull();
    expect(decodeCloudlineSave({ activeRun: { ...run, streak: 4 } })).toBeNull();
    expect(decodeCloudlineSave({ activeRun: { ...run, pendingCargo: { options: [40, 60, 101] } } })).toBeNull();
    expect(decodeCloudlineSave({ activeRun: { ...run, lastRoll: 7 } })).toBeNull();
    expect(decodeCloudlineSave({ activeRun: { ...run, landmarks: [4, 4, 4, 4] } })).toBeNull();
  });
});
