import { describe, expect, it, vi } from 'vitest';
import { decodeEnvelope, NewerSaveVersionError, type AccountRepository, type GameSaveDefinition } from '../../../src/platform/saves/contracts';
import { LocalRepository } from '../../../src/platform/saves/local';
import { SaveSession } from '../../../src/platform/saves/session';

type Demo = { n: number };
const decode = (v: unknown): Demo | null => typeof v === 'object' && v !== null && typeof (v as { n?: unknown }).n === 'number' ? { n: (v as { n: number }).n } : null;
const migrate = (from: number, state: unknown) => from === 1 ? { n: (state as { count: number }).count } : null;
const accountMigrate = (from: number, state: unknown) => from === 1 ? { n: (state as { count: number }).count } : from === 2 ? state : null;
const demo: GameSaveDefinition<Demo> = { slug: 'demo', schemaVersion: 2, storageKey: 'demo:v2', initial: { n: 0 }, decode, migrate };
const plain: GameSaveDefinition<Demo> = { slug: 'demo', schemaVersion: 2, storageKey: 'demo:v2', initial: { n: 0 }, decode };
const guest: GameSaveDefinition<Demo> = { ...demo, priorStorageKeys: ['demo:v1'] };
const accountV3: GameSaveDefinition<Demo> = { ...demo, schemaVersion: 3, storageKey: 'demo:v3', migrate: accountMigrate };
const NEWER_MESSAGE = 'This account’s progress was saved by a newer version of the game. Refresh the page to load it. Changes made on this page are not saved to the account.';
const OLD_VERSION_MESSAGE = 'The saved game needs a different application version.';

const memory = () => {
  const data = new Map<string, string>();
  return { data, getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => { data.set(k, v); }, removeItem: (k: string) => { data.delete(k); } };
};
const envelope = (schemaVersion: unknown, state: unknown) => JSON.stringify({ schemaVersion, state });
const thrownBy = (fn: () => unknown): Error => {
  try { fn(); } catch (error) { return error as Error; }
  throw new Error('expected a throw');
};
const cloud = (): AccountRepository<Demo> => ({ load: vi.fn(async () => null), loadOrSeed: vi.fn(async () => null), save: vi.fn(async () => {}), delete: vi.fn(async () => {}) });

describe('decodeEnvelope schema migration', () => {
  it('decodes the current version without migrating', () => {
    const migrateSpy = vi.fn(migrate);
    expect(decodeEnvelope({ schemaVersion: 2, state: { n: 4 } }, { ...demo, migrate: migrateSpy })).toEqual({ n: 4 });
    expect(migrateSpy).not.toHaveBeenCalled();
  });
  it('migrates an older integer version and then decodes the result', () => {
    const migrateSpy = vi.fn(migrate);
    expect(decodeEnvelope({ schemaVersion: 1, state: { count: 5 } }, { ...demo, migrate: migrateSpy })).toEqual({ n: 5 });
    expect(migrateSpy).toHaveBeenCalledWith(1, { count: 5 });
  });
  it('throws invalid when migrate returns null', () => {
    expect(thrownBy(() => decodeEnvelope({ schemaVersion: 1, state: { count: 5 } }, { ...demo, migrate: () => null })).message).toBe('The saved game is invalid.');
  });
  it('throws invalid when migrate throws', () => {
    expect(thrownBy(() => decodeEnvelope({ schemaVersion: 1, state: { count: 5 } }, { ...demo, migrate: () => { throw new Error('boom'); } })).message).toBe('The saved game is invalid.');
  });
  it('throws invalid when the migrated value fails decode', () => {
    expect(thrownBy(() => decodeEnvelope({ schemaVersion: 1, state: { count: 5 } }, { ...demo, migrate: () => ({ n: 'x' }) })).message).toBe('The saved game is invalid.');
  });
  it('throws NewerSaveVersionError for a newer version', () => {
    const err = thrownBy(() => decodeEnvelope({ schemaVersion: 3, state: { n: 1 } }, demo));
    expect(err).toBeInstanceOf(NewerSaveVersionError);
    expect(err.message).toBe('The saved game needs a different application version.');
  });
  it.each([0, 1.5, '1', NaN])('throws a plain Error, not NewerSaveVersionError, for version %s', version => {
    const err = thrownBy(() => decodeEnvelope({ schemaVersion: version, state: { count: 1 } }, demo));
    expect(err).not.toBeInstanceOf(NewerSaveVersionError);
    expect(err.name).toBe('Error');
    expect(err.message).toBe(OLD_VERSION_MESSAGE);
  });
  it('throws the plain Error for an older version when the definition has no migrate', () => {
    const migrateSpy = vi.fn(migrate);
    const err = thrownBy(() => decodeEnvelope({ schemaVersion: 1, state: { count: 1 } }, plain));
    expect(err).not.toBeInstanceOf(NewerSaveVersionError);
    expect(err.name).toBe('Error');
    expect(err.message).toBe(OLD_VERSION_MESSAGE);
    expect(migrateSpy).not.toHaveBeenCalled();
  });
});

describe('LocalRepository prior-version storage', () => {
  it('guest: loads from a prior key when the current key is empty and keeps the prior key', async () => {
    const s = memory();
    s.setItem('demo:v1', envelope(1, { count: 7 }));
    expect(await new LocalRepository(guest, s).load('demo')).toEqual({ n: 7 });
    expect(s.getItem('demo:v1')).toBe(envelope(1, { count: 7 }));
  });
  it('guest: ignores the prior key when the current key is present', async () => {
    const s = memory();
    s.setItem('demo:v2', envelope(2, { n: 3 }));
    s.setItem('demo:v1', envelope(1, { count: 9 }));
    expect(await new LocalRepository(guest, s).load('demo')).toEqual({ n: 3 });
  });
  it('guest: save writes the current envelope and removes the prior key', async () => {
    const s = memory();
    s.setItem('demo:v1', envelope(1, { count: 7 }));
    await new LocalRepository(guest, s).save('demo', 2, { n: 4 });
    expect(s.getItem('demo:v2')).toBe(envelope(2, { n: 4 }));
    expect(s.getItem('demo:v1')).toBeNull();
  });
  it('guest: delete removes the current and prior keys so progress cannot resurrect', async () => {
    const s = memory();
    s.setItem('demo:v2', envelope(2, { n: 3 }));
    s.setItem('demo:v1', envelope(1, { count: 9 }));
    const repo = new LocalRepository(guest, s);
    await repo.delete('demo');
    expect(s.getItem('demo:v2')).toBeNull();
    expect(s.getItem('demo:v1')).toBeNull();
    expect(await new LocalRepository(guest, s).load('demo')).toBeNull();
  });
  it('account: reads prior keys newest first, the newest wins, and save removes both', async () => {
    const s = memory();
    const reads: string[] = [];
    const storage = { ...s, getItem: (k: string) => { reads.push(k); return s.getItem(k); } };
    s.setItem('inmogames:account:alice:demo:v1', envelope(1, { count: 10 }));
    const repo = new LocalRepository(accountV3, storage, 'alice');
    expect(await repo.load('demo')).toEqual({ n: 10 });
    expect(reads).toEqual(['inmogames:account:alice:demo:v3', 'inmogames:account:alice:demo:v2', 'inmogames:account:alice:demo:v1']);
    s.setItem('inmogames:account:alice:demo:v2', envelope(2, { n: 20 }));
    expect(await repo.load('demo')).toEqual({ n: 20 });
    await repo.save('demo', 3, { n: 30 });
    expect(s.getItem('inmogames:account:alice:demo:v3')).toBe(envelope(3, { n: 30 }));
    expect(s.getItem('inmogames:account:alice:demo:v2')).toBeNull();
    expect(s.getItem('inmogames:account:alice:demo:v1')).toBeNull();
  });
  it('definition without migrate never reads or removes prior keys', async () => {
    const s = memory();
    s.setItem('demo:v1', envelope(1, { count: 7 }));
    const reads: string[] = [];
    const storage = { ...s, getItem: (k: string) => { reads.push(k); return s.getItem(k); } };
    const repo = new LocalRepository({ ...plain, priorStorageKeys: ['demo:v1'] }, storage);
    expect(await repo.load('demo')).toBeNull();
    expect(reads).toEqual(['demo:v2']);
    await repo.save('demo', 2, { n: 1 });
    expect(s.getItem('demo:v1')).toBe(envelope(1, { count: 7 }));
  });
  it('an undecodable prior value returns null with a warning and is left untouched', async () => {
    const s = memory();
    s.setItem('demo:v1', 'not json');
    const repo = new LocalRepository(guest, s);
    expect(await repo.load('demo')).toBeNull();
    expect(repo.warning).toBe('Browser saves are unavailable or unreadable. You can keep playing in this session.');
    expect(s.getItem('demo:v1')).toBe('not json');
  });
  it('a failing removeItem after a successful write does not fail save', async () => {
    const s = memory();
    s.setItem('demo:v1', envelope(1, { count: 7 }));
    const repo = new LocalRepository(guest, { ...s, removeItem: () => { throw new Error('denied'); } });
    await expect(repo.save('demo', 2, { n: 4 })).resolves.toBeUndefined();
    expect(repo.warning).toBeNull();
    expect(await new LocalRepository(guest, s).load('demo')).toEqual({ n: 4 });
  });
});

describe('SaveSession account schema errors', () => {
  it('shows the refresh message when cloud load reports a newer save', async () => {
    const remote = { ...cloud(), loadOrSeed: vi.fn(async () => { throw new NewerSaveVersionError('newer'); }) };
    const session = new SaveSession(demo, new LocalRepository(demo, memory(), 'alice'), remote);
    await session.load('demo');
    expect(session.getSnapshot().ready).toBe(true);
    expect(session.getSnapshot().error).toBe(NEWER_MESSAGE);
  });
  it('reports not saved when cloud save reports a newer save after hydration', async () => {
    const remote = { ...cloud(), loadOrSeed: vi.fn(async () => ({ n: 1 })), save: vi.fn(async () => { throw new NewerSaveVersionError('newer'); }) };
    const session = new SaveSession(demo, new LocalRepository(demo, memory(), 'alice'), remote);
    await session.load('demo');
    expect(session.getSnapshot().status).toBe('Account progress loaded.');
    await session.save('demo', 2, { n: 2 });
    expect(remote.save).toHaveBeenCalledWith('demo', 2, { n: 2 });
    expect(session.getSnapshot().status).toBe('Account progress was not saved.');
    expect(session.getSnapshot().error).toBe(NEWER_MESSAGE);
  });
  it('reports waiting to sync for a generic cloud save failure', async () => {
    const remote = { ...cloud(), loadOrSeed: vi.fn(async () => ({ n: 1 })), save: vi.fn(async () => { throw new Error('offline'); }) };
    const session = new SaveSession(demo, new LocalRepository(demo, memory(), 'alice'), remote);
    await session.load('demo');
    await session.save('demo', 2, { n: 2 });
    expect(session.getSnapshot().status).toBe('Account progress is waiting to sync.');
    expect(session.getSnapshot().error).toContain('Cloud sync failed');
    expect(session.getSnapshot().error).not.toContain('Refresh the page');
  });
});
