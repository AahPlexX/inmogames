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
}
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
export function validateSlug(slug: string): void {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Invalid game identifier.');
}
export function decodeEnvelope<T>(value: unknown, definition: GameSaveDefinition<T>): T {
  if (!value || typeof value !== 'object') throw new Error('The saved game has an unsupported format.');
  const envelope = value as { schemaVersion?: unknown; state?: unknown };
  if (envelope.schemaVersion !== definition.schemaVersion) throw new Error('The saved game needs a different application version.');
  const state = definition.decode(envelope.state);
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
