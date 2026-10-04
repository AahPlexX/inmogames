import type { GameSaveDefinition } from '../../platform/saves/contracts';
export interface ThreefoldSave { bestScore: number }
export const threefoldSaveDefinition: GameSaveDefinition<ThreefoldSave> = {
  slug: 'threefold', schemaVersion: 1, storageKey: 'inmogames:threefold:v1', initial: { bestScore: 0 },
  legacy: raw => { const parsed: unknown = JSON.parse(raw); return typeof parsed === 'number' ? { bestScore: parsed } : parsed; },
  decode: value => {
    if (!value || typeof value !== 'object' || !('bestScore' in value)) return null;
    const score = value.bestScore;
    return typeof score === 'number' && Number.isInteger(score) && (score === 0 || score >= 100 && score <= 500 && score % 20 === 0) ? { bestScore: score } : null;
  },
};
