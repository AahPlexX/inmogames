import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ doc: vi.fn(), read: vi.fn(), write: vi.fn(), remove: vi.fn(), transaction: vi.fn(), timestamp: vi.fn() }));
vi.mock('firebase/firestore/lite', () => ({ doc: mocks.doc, getDoc: mocks.read, setDoc: mocks.write, deleteDoc: mocks.remove, runTransaction: mocks.transaction, serverTimestamp: mocks.timestamp }));
import { decodeEnvelope, SchemaNewerError, type GameSaveDefinition } from '../../../src/platform/saves/contracts';
import { LocalRepository } from '../../../src/platform/saves/local';
import { FirestoreRepository } from '../../../src/platform/saves/firestore';
import { SaveSession } from '../../../src/platform/saves/session';
import type { Firestore } from 'firebase/firestore/lite';

interface V2 { best: number; tag: string }
const v2: GameSaveDefinition<V2> = {
  slug: 'test-game', schemaVersion: 2, storageKey: 'test-game:v2', initial: { best: 0, tag: 'new' },
  decode: v => {
    const s = v as Partial<V2> | null;
    return s && typeof s.best === 'number' && s.best >= 0 && typeof s.tag === 'string' ? { best: s.best, tag: s.tag } : null;
  },
  migrations: [{ fromVersion: 1, storageKey: 'test-game:v1', migrate: old => ({ best: (old as { best: number }).best, tag: 'migrated' }) }],
};
const noMigration: GameSaveDefinition<V2> = { ...v2, migrations: undefined };
const memory = () => {
  const data = new Map<string, string>();
  return { data, getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => { data.set(k, v); }, removeItem: (k: string) => { data.delete(k); } };
};
const oldEnvelope = (best: number) => JSON.stringify({ schemaVersion: 1, state: { best } });

describe('decodeEnvelope migrations', () => {
  it('decodes the current version unchanged', () => {
    expect(decodeEnvelope({ schemaVersion: 2, state: { best: 3, tag: 'x' } }, v2)).toEqual({ best: 3, tag: 'x' });
  });
  it('migrates an older envelope through the declared migration', () => {
    expect(decodeEnvelope({ schemaVersion: 1, state: { best: 7 } }, v2)).toEqual({ best: 7, tag: 'migrated' });
  });
  it('rejects an older version with no migration and a version with no declared path', () => {
    expect(() => decodeEnvelope({ schemaVersion: 1, state: { best: 7 } }, noMigration)).toThrow(/different application version/);
    expect(() => decodeEnvelope({ schemaVersion: 0, state: { best: 7 } }, v2)).toThrow(/different application version/);
  });
  it('raises SchemaNewerError for a newer version so callers can ask for a refresh', () => {
    expect(() => decodeEnvelope({ schemaVersion: 3, state: {} }, v2)).toThrow(SchemaNewerError);
  });
  it('rejects a migration whose output does not decode, and a throwing migration', () => {
    expect(() => decodeEnvelope({ schemaVersion: 1, state: { best: -5 } }, v2)).toThrow(/invalid/);
    const broken = { ...v2, migrations: [{ fromVersion: 1, storageKey: 'k', migrate: () => { throw new Error('boom'); } }] };
    expect(() => decodeEnvelope({ schemaVersion: 1, state: {} }, broken)).toThrow(/invalid/);
  });
});

describe('LocalRepository migrations', () => {
  it('reads the prior-version guest key, migrates it and keeps it until a new write succeeds', async () => {
    const s = memory(); s.setItem('test-game:v1', oldEnvelope(12));
    const repo = new LocalRepository(v2, s);
    expect(await repo.load('test-game')).toEqual({ best: 12, tag: 'migrated' });
    expect(s.getItem('test-game:v1')).not.toBeNull();
    await repo.save('test-game', 2, { best: 13, tag: 'now' });
    expect(JSON.parse(s.getItem('test-game:v2')!)).toEqual({ schemaVersion: 2, state: { best: 13, tag: 'now' } });
    expect(s.getItem('test-game:v1')).toBeNull();
  });
  it('does not drop the prior key when the new write fails', async () => {
    const s = memory(); s.setItem('test-game:v1', oldEnvelope(12));
    s.setItem = () => { throw new Error('full'); };
    const repo = new LocalRepository(v2, s);
    await repo.save('test-game', 2, { best: 13, tag: 'now' });
    expect(s.getItem('test-game:v1')).not.toBeNull();
    expect(repo.warning).toBeTruthy();
  });
  it('migrates account mirrors from their own prior key and never from the guest key', async () => {
    const s = memory(); s.setItem('test-game:v1', oldEnvelope(99)); s.setItem('inmogames:account:alice:test-game:v1', oldEnvelope(5));
    expect(await new LocalRepository(v2, s, 'alice').load('test-game')).toEqual({ best: 5, tag: 'migrated' });
    expect(await new LocalRepository(v2, s, 'bob').load('test-game')).toBeNull();
  });
  it('prefers the current key over a stale prior key', async () => {
    const s = memory(); s.setItem('test-game:v1', oldEnvelope(1)); s.setItem('test-game:v2', JSON.stringify({ schemaVersion: 2, state: { best: 50, tag: 'cur' } }));
    expect(await new LocalRepository(v2, s).load('test-game')).toEqual({ best: 50, tag: 'cur' });
  });
  it('delete removes every version key so a reset cannot be resurrected by migration', async () => {
    const s = memory(); s.setItem('test-game:v1', oldEnvelope(12)); s.setItem('other', 'keep');
    const repo = new LocalRepository(v2, s);
    await repo.delete('test-game');
    expect(s.getItem('test-game:v1')).toBeNull();
    expect(s.getItem('other')).toBe('keep');
    expect(await new LocalRepository(v2, s).load('test-game')).toBeNull();
  });
  it('warns and starts fresh when the prior save is unreadable', async () => {
    const s = memory(); s.setItem('test-game:v1', 'not json');
    const repo = new LocalRepository(v2, s);
    expect(await repo.load('test-game')).toBeNull();
    expect(repo.warning).toBeTruthy();
  });
});

describe('FirestoreRepository schema safety', () => {
  beforeEach(() => { vi.resetAllMocks(); mocks.doc.mockReturnValue('reference'); mocks.timestamp.mockReturnValue('server-time'); });
  const tx = () => { const t = { get: vi.fn(), set: vi.fn() }; mocks.transaction.mockImplementation((_db, fn) => fn(t)); return t; };
  const repo = () => new FirestoreRepository({} as Firestore, 'alice', v2, () => true);

  it('writes when no document exists or the stored version is not newer', async () => {
    const t = tx();
    t.get.mockResolvedValueOnce({ exists: () => false });
    await repo().save('test-game', 2, { best: 1, tag: 'a' });
    expect(t.set).toHaveBeenCalledWith('reference', { schemaVersion: 2, state: { best: 1, tag: 'a' }, updatedAt: 'server-time' });
    t.get.mockResolvedValueOnce({ exists: () => true, data: () => ({ schemaVersion: 1, state: { best: 1 } }) });
    await repo().save('test-game', 2, { best: 2, tag: 'b' });
    expect(t.set).toHaveBeenCalledTimes(2);
  });
  it('refuses to overwrite a newer stored schema and tells the caller to refresh', async () => {
    const t = tx();
    t.get.mockResolvedValueOnce({ exists: () => true, data: () => ({ schemaVersion: 3, state: {} }) });
    await expect(repo().save('test-game', 2, { best: 1, tag: 'a' })).rejects.toBeInstanceOf(SchemaNewerError);
    expect(t.set).not.toHaveBeenCalled();
  });
  it('still rejects writes after the account session changes', async () => {
    const t = tx(); const live = vi.fn(() => true);
    const r = new FirestoreRepository({} as Firestore, 'alice', v2, live);
    t.get.mockResolvedValue({ exists: () => false }); live.mockReturnValue(false);
    await expect(r.save('test-game', 2, { best: 1, tag: 'a' })).rejects.toThrow(/session changed/);
  });
  it('loads an older cloud document through the migration', async () => {
    mocks.read.mockResolvedValueOnce({ exists: () => true, data: () => ({ schemaVersion: 1, state: { best: 8 } }) });
    expect(await repo().load('test-game')).toEqual({ best: 8, tag: 'migrated' });
  });
  it('seeds nothing over an older existing document and returns it migrated', async () => {
    const t = tx();
    t.get.mockResolvedValueOnce({ exists: () => true, data: () => ({ schemaVersion: 1, state: { best: 8 } }) });
    expect(await repo().loadOrSeed('test-game', 2, { best: 99, tag: 'guest' })).toEqual({ best: 8, tag: 'migrated' });
    expect(t.set).not.toHaveBeenCalled();
  });
});

describe('SaveSession downgrade messaging', () => {
  it('shows a refresh message when the cloud holds a newer schema', async () => {
    const s = memory();
    const cloud = { load: vi.fn(), loadOrSeed: vi.fn(async () => ({ best: 1, tag: 'c' })), delete: vi.fn(), save: vi.fn(async () => { throw new SchemaNewerError(); }) };
    const session = new SaveSession(v2, new LocalRepository(v2, s, 'alice'), cloud);
    await session.load('test-game');
    await session.save('test-game', 2, { best: 2, tag: 'd' });
    expect(session.getSnapshot().error).toMatch(/refresh/i);
  });
  it('shows the refresh message when loading finds a newer cloud schema', async () => {
    const s = memory();
    const cloud = { load: vi.fn(), loadOrSeed: vi.fn(async () => { throw new SchemaNewerError(); }), delete: vi.fn(), save: vi.fn() };
    const session = new SaveSession(v2, new LocalRepository(v2, s, 'alice'), cloud);
    await session.load('test-game');
    expect(session.getSnapshot().error).toMatch(/refresh/i);
  });
});
