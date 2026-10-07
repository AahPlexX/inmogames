export interface GameSaveRepository<T> {
  load(gameSlug: string): Promise<T | null>;
  save(gameSlug: string, schemaVersion: number, state: T): Promise<void>;
  delete(gameSlug: string): Promise<void>;
}
export interface AccountRepository<T> extends GameSaveRepository<T> {
  loadOrSeed(gameSlug: string, schemaVersion: number, seed: T | null): Promise<T | null>;
}
/** Converts a save written at an older schema version into input the current `decode` accepts. */
export interface SaveMigration {
  fromVersion: number;
  /** Guest storage key the older version used. Account mirrors derive theirs from the slug and version. */
  storageKey: string;
  migrate(prior: unknown): unknown;
}
export interface GameSaveDefinition<T> {
  slug: string;
  schemaVersion: number;
  storageKey: string;
  initial: T;
  decode(value: unknown): T | null;
  legacy?(raw: string): unknown;
  migrations?: readonly SaveMigration[];
}
/** A stored save was written by a newer version of the site than this client. Never overwrite it. */
export class SchemaNewerError extends Error {
  constructor() { super('The saved game was written by a newer version of this site. Refresh the page to continue.'); this.name = 'SchemaNewerError'; }
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
  let input = envelope.state;
  if (typeof envelope.schemaVersion === 'number' && envelope.schemaVersion > definition.schemaVersion) throw new SchemaNewerError();
  if (envelope.schemaVersion !== definition.schemaVersion) {
    const migration = definition.migrations?.find(candidate => candidate.fromVersion === envelope.schemaVersion);
    if (!migration) throw new Error('The saved game needs a different application version.');
    try { input = migration.migrate(envelope.state); } catch { throw new Error('The saved game is invalid.'); }
  }
  const state = definition.decode(input);
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
