import { beforeEach, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({
  persistence: vi.fn(), observer: vi.fn(), register: vi.fn(), login: vi.fn(), reset: vi.fn(), logout: vi.fn(),
  doc: vi.fn(), read: vi.fn(), write: vi.fn(), remove: vi.fn(), transaction: vi.fn(), timestamp: vi.fn(),
}));
vi.mock('firebase/auth', () => ({
  browserLocalPersistence: 'local', inMemoryPersistence: 'memory', setPersistence: mocks.persistence,
  onAuthStateChanged: mocks.observer, createUserWithEmailAndPassword: mocks.register,
  signInWithEmailAndPassword: mocks.login, sendPasswordResetEmail: mocks.reset, signOut: mocks.logout,
}));
vi.mock('firebase/firestore/lite', () => ({ doc: mocks.doc, getDoc: mocks.read, setDoc: mocks.write, deleteDoc: mocks.remove, runTransaction: mocks.transaction, serverTimestamp: mocks.timestamp }));
import { firebaseAuthAdapter } from '../../../src/platform/auth/firebase';
import { FirestoreRepository } from '../../../src/platform/saves/firestore';
import { threefoldSaveDefinition } from '../../../src/games/threefold/persistence';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore/lite';
beforeEach(() => { vi.resetAllMocks(); mocks.doc.mockReturnValue('reference'); mocks.timestamp.mockReturnValue('server-time'); });
it('awaits persistent Auth storage and explicitly falls back to an in-memory session when storage is blocked', async () => {
  const adapter = firebaseAuthAdapter({} as Auth);
  await adapter.prepare(); expect(mocks.persistence).toHaveBeenCalledWith({}, 'local');
  mocks.persistence.mockRejectedValueOnce(Error('storage blocked')); expect(await adapter.prepare()).toMatch(/cannot keep you signed in/);expect(mocks.persistence).toHaveBeenLastCalledWith({}, 'memory');
});
it('wires all email/password operations and observes the resolved Firebase user', async () => {
  const adapter = firebaseAuthAdapter({} as Auth, 'https://site.example/inmogames/');
  const next=vi.fn();adapter.observe(next,vi.fn());mocks.observer.mock.calls[0][1]({uid:'alice',email:'alice@example.test'});expect(next).toHaveBeenCalledWith({uid:'alice',email:'alice@example.test'});
  await adapter.register('a@example.test','password');await adapter.signIn('a@example.test','password');await adapter.resetPassword('a@example.test');await adapter.signOut();
  expect(mocks.register).toHaveBeenCalledWith({},'a@example.test','password');expect(mocks.login).toHaveBeenCalledWith({},'a@example.test','password');expect(mocks.reset).toHaveBeenCalledWith({},'a@example.test',{url:'https://site.example/inmogames/',handleCodeInApp:false});expect(mocks.logout).toHaveBeenCalledWith({});
});
it('uses account-scoped document paths and a server timestamp; rejects writes after the account changes', async () => {
  const current=vi.fn(()=>true);const repo=new FirestoreRepository({} as Firestore,'alice',threefoldSaveDefinition,current);
  await repo.save('threefold',1,{bestScore:120});expect(mocks.doc).toHaveBeenCalledWith({},'users','alice','games','threefold');expect(mocks.write).toHaveBeenCalledWith('reference',{schemaVersion:1,state:{bestScore:120},updatedAt:'server-time'});
  current.mockReturnValue(false);await expect(repo.save('threefold',1,{bestScore:500})).rejects.toThrow(/session changed/);expect(mocks.write).toHaveBeenCalledTimes(1);
});
it('atomically seeds only absent documents and never overwrites existing or unsupported account saves', async () => {
  const repo=new FirestoreRepository({} as Firestore,'alice',threefoldSaveDefinition,()=>true);
  const tx={get:vi.fn(),set:vi.fn()};mocks.transaction.mockImplementation((_db,fn)=>fn(tx));
  tx.get.mockResolvedValueOnce({exists:()=>true,data:()=>({schemaVersion:1,state:{bestScore:120}})});expect(await repo.loadOrSeed('threefold',1,{bestScore:500})).toEqual({bestScore:120});expect(tx.set).not.toHaveBeenCalled();
  tx.get.mockResolvedValueOnce({exists:()=>false});expect(await repo.loadOrSeed('threefold',1,{bestScore:500})).toEqual({bestScore:500});expect(tx.set).toHaveBeenCalledWith('reference',{schemaVersion:1,state:{bestScore:500},updatedAt:'server-time'});
  tx.get.mockResolvedValueOnce({exists:()=>true,data:()=>({schemaVersion:99,state:{bestScore:120}})});await expect(repo.loadOrSeed('threefold',1,{bestScore:500})).rejects.toThrow(/version/);expect(tx.set).toHaveBeenCalledTimes(1);
});
it('propagates permission/network failures and deletes only the exact game path', async () => {
  const repo=new FirestoreRepository({} as Firestore,'alice',threefoldSaveDefinition,()=>true);mocks.read.mockRejectedValueOnce({code:'permission-denied'});await expect(repo.load('threefold')).rejects.toMatchObject({code:'permission-denied'});
  await repo.delete('threefold');expect(mocks.remove).toHaveBeenCalledWith('reference');await expect(repo.delete('royal-palace-blackjack')).rejects.toThrow(/Wrong game/);
});
