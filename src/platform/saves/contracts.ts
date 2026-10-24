export interface GameSaveRepository<T> {
  load(gameSlug: string): Promise<T | null>;
  save(gameSlug: string, schemaVersion: number, state: T): Promise<void>;
  delete(gameSlug: string): Promise<void>;
}
export interface AccountRepository<T> extends GameSaveRepository<T> {
  loadOrSeed(gameSlug: string, schemaVersion: number, seed: T | null): Promise<T | null>;
}
export interface GameSaveDefinition<T> {
  slug: string;
  schemaVersion: number;
  storageKey: string;
  initial: T;
  decode(value: unknown): T | null;
  legacy?(raw: string): unknown;
  /** Converts a save written by an older `schemaVersion` to the current shape (decode still validates the result); return null if it cannot be converted. */
  migrate?(fromVersion: number, state: unknown): unknown | null;
  /** Guest browser keys used by earlier schema versions; read when the current key is empty and removed after the first successful save. */
  priorStorageKeys?: readonly string[];
}
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
/** Saved progress was written by a newer app version than this client understands; it must not be read as current or overwritten. */
export class NewerSaveVersionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NewerSaveVersionError';
  }
}
export function validateSlug(slug: string): void {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Invalid game identifier.');
}
export function decodeEnvelope<T>(value: unknown, definition: GameSaveDefinition<T>): T {
  if (!value || typeof value !== 'object') throw new Error('The saved game has an unsupported format.');
  const envelope = value as { schemaVersion?: unknown; state?: unknown };
  const version = envelope.schemaVersion;
  let candidate = envelope.state;
  if (version !== definition.schemaVersion) {
    const migratable = definition.migrate && typeof version === 'number' && Number.isInteger(version) && version >= 1 && version < definition.schemaVersion;
    if (!migratable) {
      const message = 'The saved game needs a different application version.';
      throw typeof version === 'number' && Number.isInteger(version) && version > definition.schemaVersion ? new NewerSaveVersionError(message) : new Error(message);
    }
    try { candidate = definition.migrate!(version, envelope.state); } catch { candidate = null; }
    if (candidate === null) throw new Error('The saved game is invalid.');
  }
  const state = definition.decode(candidate);
  if (state === null) throw new Error('The saved game is invalid.');
  return state;
}
export function validateState<T>(slug: string, version: number, state: T, definition: GameSaveDefinition<T>): T {
  validateSlug(slug);
  if (slug !== definition.slug || version !== definition.schemaVersion) throw new Error('Unsupported game save version.');
  const decoded = definition.decode(state);
  if (decoded === null) throw new Error('Invalid game state.');
  return decoded;
}
