import type { GameSaveDefinition } from '../../platform/saves/contracts';
import { DEFAULT_SAVE, STORAGE_KEY, decodeBlackjackSave, type BlackjackSave } from './storage';
export const blackjackSaveDefinition: GameSaveDefinition<BlackjackSave> = {
  slug: 'royal-palace-blackjack', schemaVersion: 1, storageKey: STORAGE_KEY,
  initial: DEFAULT_SAVE, decode: decodeBlackjackSave,
};
export function durableCheckpoint(committed: BlackjackSave, visible: BlackjackSave, phase: 'betting' | 'player' | 'dealer' | 'settled'): BlackjackSave {
  return { ...(phase === 'settled' ? visible : committed), preferences: { ...visible.preferences } };
}


export function restorePracticeCredits(_state: BlackjackSave): BlackjackSave | null {
  return null;
}
