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
const credit = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER / 2 && Number.isInteger(value * 2);
const count = (value: unknown): value is number => typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
export function decodeBlackjackSave(value: unknown): BlackjackSave | null {
  if (!value || typeof value !== 'object') return null;
  const p = value as Partial<BlackjackSave>;
  if (!credit(p.bankroll) || p.bankroll < 0 || !credit(p.lastBet) || p.lastBet < 0 || !credit(p.sessionNet ?? 0)) return null;
  if (!p.stats || !count(p.stats.wins) || !count(p.stats.losses) || !count(p.stats.pushes)) return null;
  if (p.preferences && (typeof p.preferences.sound !== 'boolean' || typeof p.preferences.hints !== 'boolean')) return null;
  return { bankroll: p.bankroll, lastBet: p.lastBet, sessionNet: p.sessionNet ?? 0,
    stats: { wins: p.stats.wins, losses: p.stats.losses, pushes: p.stats.pushes },
    preferences: { sound: p.preferences?.sound ?? false, hints: p.preferences?.hints ?? false } };
}
export function loadSave(storage: StorageLike | null | undefined): { value: BlackjackSave; persistent: boolean } {
  if (!storage) return { value: structuredClone(DEFAULT_SAVE), persistent: false };
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { value: structuredClone(DEFAULT_SAVE), persistent: true };
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && 'schemaVersion' in parsed && parsed.schemaVersion !== 1) throw new Error();
    const value = decodeBlackjackSave(parsed && typeof parsed === 'object' && 'schemaVersion' in parsed ? parsed.state : parsed);
    if (!value) throw new Error();
    return { value, persistent: true };
  } catch { return { value: structuredClone(DEFAULT_SAVE), persistent: false }; }
}

export function saveGame(storage: StorageLike | null | undefined, value: BlackjackSave): boolean {
  if (!storage) return false;
  try { storage.setItem(STORAGE_KEY, JSON.stringify(value)); return true; } catch { return false; }
}
export function resetSave(storage: StorageLike | null | undefined): boolean {
  if (!storage) return false;
  try { storage.removeItem(STORAGE_KEY); return true; } catch { return false; }
}
