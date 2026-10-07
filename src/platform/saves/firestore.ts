import { doc, getDoc, deleteDoc, runTransaction, serverTimestamp, type Firestore } from 'firebase/firestore/lite';
import { SchemaNewerError, decodeEnvelope, validateSlug, validateState, type AccountRepository, type GameSaveDefinition } from './contracts';
export class FirestoreRepository<T> implements AccountRepository<T> {
  constructor(private readonly db: Firestore, private readonly uid: string, private readonly definition: GameSaveDefinition<T>, private readonly canWrite: () => boolean) {
    if (!uid || uid.includes('/')) throw new Error('Invalid account identifier.');
  }
  private reference(slug: string) {
    validateSlug(slug);
    if (slug !== this.definition.slug) throw new Error('Wrong game save repository.');
    if (!this.canWrite()) throw new Error('The account session changed.');
    return doc(this.db, 'users', this.uid, 'games', slug);
  }
  async load(slug: string): Promise<T | null> {
    const snapshot = await getDoc(this.reference(slug));
    return snapshot.exists() ? decodeEnvelope(snapshot.data(), this.definition) : null;
  }
  async save(slug: string, version: number, state: T): Promise<void> {
    const value = validateState(slug, version, state, this.definition);
    const ref = this.reference(slug);
    await runTransaction(this.db, async transaction => {
      if (!this.canWrite()) throw new Error('The account session changed.');
      const snapshot = await transaction.get(ref);
      const stored = snapshot.exists() ? (snapshot.data() as { schemaVersion?: unknown }).schemaVersion : undefined;
      if (typeof stored === 'number' && stored > version) throw new SchemaNewerError();
      if (!this.canWrite()) throw new Error('The account session changed.');
      transaction.set(ref, { schemaVersion: version, state: value, updatedAt: serverTimestamp() });
    });
  }
  async delete(slug: string): Promise<void> { await deleteDoc(this.reference(slug)); }
  async loadOrSeed(slug: string, version: number, seed: T | null): Promise<T | null> {
    const ref = this.reference(slug);
    if (seed === null) return this.load(slug);
    const value = validateState(slug, version, seed, this.definition);
    return runTransaction(this.db, async transaction => {
      if (!this.canWrite()) throw new Error('The account session changed.');
      const snapshot = await transaction.get(ref);
      if (snapshot.exists()) return decodeEnvelope(snapshot.data(), this.definition);
      if (!this.canWrite()) throw new Error('The account session changed.');
      transaction.set(ref, { schemaVersion: version, state: value, updatedAt: serverTimestamp() });
      return value;
    });
  }
}
