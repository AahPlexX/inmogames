import { decodeEnvelope, validateState, type GameSaveDefinition, type GameSaveRepository, type StorageLike } from './contracts';

export function browserStorage(): StorageLike | null {
  try { return window.localStorage; } catch { return null; }
}

export class LocalRepository<T> implements GameSaveRepository<T> {
  readonly key: string;
  private readonly priorKeys: string[];
  warning: string | null = null;
  private memory: T | null | undefined;
  constructor(private readonly definition: GameSaveDefinition<T>, private readonly storage: StorageLike | null, private readonly uid?: string) {
    const accountKey = (version: number) => `inmogames:account:${encodeURIComponent(uid ?? '')}:${definition.slug}:v${version}`;
    this.key = uid ? accountKey(definition.schemaVersion) : definition.storageKey;
    this.priorKeys = (definition.migrations ?? []).map(migration => (uid ? accountKey(migration.fromVersion) : migration.storageKey));
  }
  /** Reads the newest prior-version key that holds a save. The key is left in place until a new write succeeds. */
  private priorRaw(): string | null {
    for (const key of this.priorKeys) {
      const raw = this.storage?.getItem(key);
      if (raw) return raw;
    }
    return null;
  }
  async load(slug: string): Promise<T | null> {
    this.check(slug);
    if (this.memory !== undefined) return this.memory === null ? null : structuredClone(this.memory);
    try {
      if (!this.storage) throw new Error();
      const raw = this.storage.getItem(this.key) ?? this.priorRaw();
      if (!raw) return null;
      const parsed: unknown = JSON.parse(raw);
      const state = parsed && typeof parsed === 'object' && 'schemaVersion' in parsed
        ? decodeEnvelope(parsed, this.definition)
        : this.uid ? null : this.definition.decode(this.definition.legacy ? this.definition.legacy(raw) : parsed);
      if (state === null) throw new Error();
      return structuredClone(state);
    } catch {
      this.warning = 'Browser saves are unavailable or unreadable. You can keep playing in this session.';
      return null;
    }
  }
  async save(slug: string, version: number, state: T): Promise<void> {
    const value = validateState(slug, version, state, this.definition);
    this.memory = structuredClone(value);
    try {
      if (!this.storage) throw new Error();
      this.storage.setItem(this.key, JSON.stringify({ schemaVersion: version, state: value }));
      for (const key of this.priorKeys) this.storage.removeItem(key);
    } catch { this.warning = 'Browser storage is unavailable. Progress is kept only in this session until cloud sync succeeds.'; }
  }
  async delete(slug: string): Promise<void> {
    this.check(slug);
    this.memory = null;
    try {
      if (!this.storage) throw new Error();
      this.storage.removeItem(this.key);
      for (const key of this.priorKeys) this.storage.removeItem(key);
    } catch { this.warning = 'Browser storage could not be cleared. The reset applies to this session.'; }
  }
  private check(slug: string) {
    if (slug !== this.definition.slug) throw new Error('Wrong game save repository.');
  }
}
