import { browserLocalPersistence, inMemoryPersistence, setPersistence, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, type Auth } from 'firebase/auth';
import type { AuthAdapter } from './controller';
export function firebaseAuthAdapter(auth: Auth, returnUrl?: string): AuthAdapter {
  return {
    async prepare() {
      try { await setPersistence(auth, browserLocalPersistence); return null; }
      catch { await setPersistence(auth, inMemoryPersistence); return 'This browser cannot keep you signed in. The account session will end when you leave.'; }
    },
    observe: (next, error) => onAuthStateChanged(auth, user => next(user ? { uid: user.uid, email: user.email } : null), error),
    register: async (email, password) => { await createUserWithEmailAndPassword(auth, email, password); },
    signIn: async (email, password) => { await signInWithEmailAndPassword(auth, email, password); },
    resetPassword: email => sendPasswordResetEmail(auth, email, returnUrl ? { url: returnUrl, handleCodeInApp: false } : undefined),
    signOut: () => signOut(auth),
  };
}
