import { readFile } from 'node:fs/promises';
import { after, before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

let env;
before(async () => {
  if (!process.env.FIRESTORE_EMULATOR_HOST) throw new Error('Run through pnpm test:rules; a Firestore emulator is required.');
  const [host, port] = process.env.FIRESTORE_EMULATOR_HOST.split(':');
  env = await initializeTestEnvironment({ projectId: 'demo-inmogames', firestore: { host, port: Number(port), rules: await readFile('firestore.rules', 'utf8') } });
});
beforeEach(async () => env.clearFirestore());
after(async () => env?.cleanup());
const payload = () => ({ schemaVersion: 1, state: { bestScore: 120 }, updatedAt: serverTimestamp() });
const own = (db, game = 'threefold') => doc(db, 'users/alice/games/' + game);

test('an authenticated owner can create, read, update and delete their game', async () => {
  const db = env.authenticatedContext('alice').firestore();
  await assertSucceeds(setDoc(own(db), payload()));
  const loaded = await assertSucceeds(getDoc(own(db)));
  assert.equal(loaded.data().state.bestScore, 120); assert.ok(loaded.data().updatedAt instanceof Timestamp);
  await assertSucceeds(setDoc(own(db), { ...payload(), state: { bestScore: 500 } }));
  await assertSucceeds(deleteDoc(own(db))); assert.equal((await getDoc(own(db))).exists(), false);
});
test('a different user cannot read, create, update or delete another account save', async () => {
  await assertSucceeds(setDoc(own(env.authenticatedContext('alice').firestore()), payload()));
  const db = env.authenticatedContext('bob').firestore();
  await assertFails(getDoc(own(db))); await assertFails(setDoc(own(db), payload()));
  await assertFails(setDoc(own(db, 'royal-palace-blackjack'), payload())); await assertFails(deleteDoc(own(db)));
});
test('unauthenticated reads, writes and deletes are denied; unrelated paths stay denied', async () => {
  const db = env.unauthenticatedContext().firestore();
  await assertFails(getDoc(own(db))); await assertFails(setDoc(own(db), payload())); await assertFails(deleteDoc(own(db)));
  const alice = env.authenticatedContext('alice').firestore();
  await assertFails(setDoc(doc(alice, 'users/alice'), payload())); await assertFails(getDoc(doc(alice, 'leaderboards/threefold')));
});
test('a game reset cannot delete a different game; writes must use a valid versioned server-time envelope', async () => {
  const db = env.authenticatedContext('alice').firestore();
  await assertSucceeds(setDoc(own(db), payload()));await assertSucceeds(setDoc(own(db, 'royal-palace-blackjack'), payload()));
  await assertSucceeds(deleteDoc(own(db, 'royal-palace-blackjack')));assert.equal((await getDoc(own(db))).exists(), true);
  await assertFails(setDoc(own(db), { state: {} }));
  await assertFails(setDoc(own(db), { ...payload(), schemaVersion: 0 }));
  await assertFails(setDoc(own(db), { ...payload(), state: 'invalid' }));
  await assertFails(setDoc(own(db), { ...payload(), updatedAt: Timestamp.fromMillis(0) }));
  await assertFails(setDoc(own(db), { ...payload(), extra: true }));
});
