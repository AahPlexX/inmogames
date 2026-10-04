import { validateState, type AccountRepository, type GameSaveDefinition, type GameSaveRepository } from './contracts';
import type { LocalRepository } from './local';

export interface SaveSnapshot<T> {
  state: T;
  ready: boolean;
  revision: number;
  status: string;
  error: string | null;
}

export class SaveSession<T> implements GameSaveRepository<T> {
  private snapshot: SaveSnapshot<T>;
  private listeners = new Set<() => void>();
  private active = true;
  private hydrated = false;
  private loading: Promise<T | null> | null = null;
  private queue: Promise<void> = Promise.resolve();
  private pending: 'save' | 'delete' | null = null;
  private sequence = 0;
  private loadEpoch = 0;
  constructor(private readonly definition: GameSaveDefinition<T>, private readonly local: LocalRepository<T>, private readonly cloud?: AccountRepository<T>, private readonly guest?: LocalRepository<T>) {
    this.snapshot = { state: structuredClone(definition.initial), ready: false, revision: 0, status: cloud ? 'Loading account progress…' : 'Loading browser progress…', error: null };
  }
  getSnapshot = () => this.snapshot;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  private publish(update: Partial<SaveSnapshot<T>>) {
    if (!this.active) return;
    this.snapshot = { ...this.snapshot, ...update };
    this.listeners.forEach(listener => listener());
  }
  async load(slug: string): Promise<T | null> {
    if (slug !== this.definition.slug) throw new Error('Wrong game save repository.');
    if (this.loading) return this.loading;
    const epoch = ++this.loadEpoch;
    this.loading = this.hydrate(epoch);
    return this.loading;
  }
  private async hydrate(epoch: number): Promise<T | null> {
    const cached = await this.local.load(this.definition.slug);
    if (!this.active || epoch !== this.loadEpoch) return null;
    this.publish({ state: cached ?? structuredClone(this.definition.initial), ready: !this.cloud, error: this.local.warning });
    if (!this.cloud) { this.hydrated = true; this.publish({ status: 'Guest progress saved in this browser.' }); return cached; }
    const timer = setTimeout(() => { if (epoch === this.loadEpoch) this.publish({ ready: true, status: 'Account progress is taking longer to load. You can keep playing.', error: 'Cloud progress has not loaded. Check your connection and retry. When it loads, the account save takes precedence.' }); }, 8000);
    try {
      const seed = await this.guest?.load(this.definition.slug) ?? null;
      if (!this.active || epoch !== this.loadEpoch) return null;
      const state = await this.cloud.loadOrSeed(this.definition.slug, this.definition.schemaVersion, seed);
      if (!this.active || epoch !== this.loadEpoch) return null;
      const value = state ?? structuredClone(this.definition.initial);
      await this.local.save(this.definition.slug, this.definition.schemaVersion, value);
      if (!this.active || epoch !== this.loadEpoch) return null;
      this.hydrated = true;
      this.pending = null;
      this.publish({ state: value, ready: true, revision: this.snapshot.revision + 1, status: 'Account progress loaded.', error: this.local.warning });
      return state;
    } catch {
      if (this.active && epoch === this.loadEpoch) this.publish({ ready: true, status: 'Playing with this account’s browser cache.', error: 'Cloud progress could not load. Check your connection, sign-in and project permissions, then retry. Account progress will take precedence when it loads.' });
      return cached;
    } finally { clearTimeout(timer); }
  }
  async save(slug: string, version: number, state: T): Promise<void> {
    const value = validateState(slug, version, state, this.definition);
    if (!this.active) return;
    await this.local.save(slug, version, value);
    if (!this.active) return;
    this.pending = this.cloud ? 'save' : null;
    const sequence = ++this.sequence;
    this.publish({ state: value, status: this.cloud ? 'Saving account progress…' : 'Guest progress saved in this browser.', error: this.cloud && !this.hydrated ? 'Cloud progress has not loaded. Changes stay in this account’s browser cache for now; the account save takes precedence when it loads.' : this.local.warning });
    if (!this.cloud || !this.hydrated) return;
    return this.enqueue('save', sequence, value);
  }
  async delete(slug: string): Promise<void> {
    if (slug !== this.definition.slug) throw new Error('Wrong game save repository.');
    if (!this.active) return;
    ++this.loadEpoch;
    await this.local.delete(slug);
    if (!this.active) return;
    this.hydrated = true;
    this.pending = this.cloud ? 'delete' : null;
    const sequence = ++this.sequence;
    this.publish({ state: structuredClone(this.definition.initial), ready: true, revision: this.snapshot.revision + 1, status: 'Game progress reset.', error: this.local.warning });
    if (this.cloud) return this.enqueue('delete', sequence);
  }
  private enqueue(operation: 'save' | 'delete', sequence: number, state?: T): Promise<void> {
    this.queue = this.queue.then(async () => {
      if (!this.active || !this.cloud) return;
      try {
        if (operation === 'delete') await this.cloud.save(this.definition.slug, this.definition.schemaVersion, structuredClone(this.definition.initial));
        else await this.cloud.save(this.definition.slug, this.definition.schemaVersion, state!);
        if (sequence === this.sequence) {
          this.pending = null;
          this.publish({ status: operation === 'delete' ? 'Account game progress reset.' : 'Account progress saved.', error: this.local.warning });
        }
      } catch {
        if (sequence === this.sequence) this.publish({ status: 'Account progress is waiting to sync.', error: 'Cloud sync failed. This account’s changes remain in this browser session. Check your connection and project permissions, then retry before leaving.' });
      }
    });
    return this.queue;
  }
  async retry(): Promise<void> {
    if (!this.active || !this.cloud) return;
    if (!this.hydrated) { this.loading = null; await this.load(this.definition.slug); return; }
    if (this.pending) await this.enqueue(this.pending, ++this.sequence, structuredClone(this.snapshot.state));
  }
  dispose(): void { this.active = false; ++this.loadEpoch; }
}
