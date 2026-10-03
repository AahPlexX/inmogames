export interface BlackjackStats { wins: number; losses: number; pushes: number }
export interface BlackjackPreferences { sound: boolean; hints: boolean }
export interface BlackjackSave {
  bankroll: number;
  lastBet: number;
  stats: BlackjackStats;
  sessionNet: number;
  preferences: BlackjackPreferences;
}
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
export const STORAGE_KEY = 'inmogames:royal-palace-blackjack:v1';
export const DEFAULT_SAVE: BlackjackSave = {
  bankroll: 1000,
  lastBet: 0,
  stats: { wins: 0, losses: 0, pushes: 0 },
  sessionNet: 0,
  preferences: { sound: false, hints: false },
};
const finiteNonnegative = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0;

export function loadSave(storage: StorageLike | null | undefined): { value: BlackjackSave; persistent: boolean } {
  if (!storage) return { value: structuredClone(DEFAULT_SAVE), persistent: false };
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { value: structuredClone(DEFAULT_SAVE), persistent: true };
    const p = JSON.parse(raw) as Partial<BlackjackSave>;
    if (!finiteNonnegative(p.bankroll) || !finiteNonnegative(p.lastBet) || !finiteNonnegative(p.sessionNet === undefined ? 0 : Math.abs(p.sessionNet))) throw new Error();
    const stats = p.stats;
    if (!stats || !finiteNonnegative(stats.wins) || !finiteNonnegative(stats.losses) || !finiteNonnegative(stats.pushes)) throw new Error();
    return {
      persistent: true,
      value: {
        bankroll: p.bankroll,
        lastBet: p.lastBet,
        stats: { wins: stats.wins, losses: stats.losses, pushes: stats.pushes },
        sessionNet: typeof p.sessionNet === 'number' && Number.isFinite(p.sessionNet) ? p.sessionNet : 0,
        preferences: { sound: !!p.preferences?.sound, hints: !!p.preferences?.hints },
      },
    };
  } catch {
    return { value: structuredClone(DEFAULT_SAVE), persistent: false };
  }
}

export function saveGame(storage: StorageLike | null | undefined, value: BlackjackSave): boolean {
  if (!storage) return false;
  try { storage.setItem(STORAGE_KEY, JSON.stringify(value)); return true; } catch { return false; }
}
export function resetSave(storage: StorageLike | null | undefined): boolean {
  if (!storage) return false;
  try { storage.removeItem(STORAGE_KEY); return true; } catch { return false; }
}
