import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore, useCallback, type ReactNode } from 'react';
import { AuthController } from './auth/controller';
import { readFirebaseConfig } from './firebase/config';
import { LocalRepository, browserStorage } from './saves/local';
import { SaveSession } from './saves/session';
import type { AccountRepository, GameSaveDefinition } from './saves/contracts';

export function createPlatform(env: Record<string, unknown>) {
  const config = readFirebaseConfig(env);
  const auth = new AuthController(config.status === 'configured' ? 'loading' : 'unconfigured');
  let factory: (<T>(definition: GameSaveDefinition<T>, uid: string) => AccountRepository<T>) | undefined;
  let started = false;
  const sessions = new Map<string, { definition: unknown; value: unknown; dispose(): void }>();
  let scope = 'guest';
  auth.subscribe(() => {
    const state = auth.getSnapshot();
    const next = state.status === 'ready' ? state.user?.uid ?? 'guest' : 'guest';
    if (next === scope) return;
    sessions.forEach(entry => entry.dispose());
    sessions.clear();
    scope = next;
  });
  return {
    auth,
    async start() {
      if (started || config.status !== 'configured') return;
      started = true;
      try {
        const [{ createFirebaseClient }, { firebaseAuthAdapter }, { FirestoreRepository }] = await Promise.all([
          import('./firebase/client'), import('./auth/firebase'), import('./saves/firestore'),
        ]);
        const useEmulators = import.meta.env.DEV && env.VITE_FIREBASE_EMULATORS === 'true' && config.value.projectId === 'demo-inmogames' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
        const client = createFirebaseClient(config.value, useEmulators);
        factory = (definition, uid) => new FirestoreRepository(client.db, uid, definition, () => auth.canWrite(uid));
        await auth.start(firebaseAuthAdapter(client.auth, new URL(import.meta.env.BASE_URL, window.location.origin).href));
      } catch { auth.unavailable(); }
    },
    createSession<T>(definition: GameSaveDefinition<T>, uid?: string) {
      const key = `${uid ?? 'guest'}:${definition.slug}`;
      const existing = sessions.get(key);
      if (existing) {
        if (existing.definition !== definition) throw new Error('A game identifier has more than one save definition.');
        return existing.value as SaveSession<T>;
      }
      const storage = browserStorage();
      const guest = new LocalRepository(definition, storage);
      const session = uid && factory
        ? new SaveSession(definition, new LocalRepository(definition, storage, uid), factory(definition, uid), guest)
        : new SaveSession(definition, guest);
      sessions.set(key, { definition, value: session, dispose: () => session.dispose() });
      return session;
    },
  };
}
const Context = createContext<ReturnType<typeof createPlatform> | null>(null);
export function PlatformProvider({ children }: { children: ReactNode }) {
  const [platform] = useState(() => createPlatform(import.meta.env));
  useEffect(() => { void platform.start(); }, [platform]);
  return <Context.Provider value={platform}>{children}</Context.Provider>;
}
export function usePlatform() {
  const platform = useContext(Context);
  if (!platform) throw new Error('Missing platform provider.');
  return platform;
}
export function useAccount() {
  const { auth } = usePlatform();
  return useSyncExternalStore(auth.subscribe, auth.getSnapshot);
}
export function useGameSave<T>(definition: GameSaveDefinition<T>) {
  const platform = usePlatform();
  const auth = useAccount();
  const uid = auth.status === 'ready' ? auth.user?.uid : undefined;
  const session = useMemo(() => platform.createSession(definition, uid), [platform, definition, uid]);
  const snapshot = useSyncExternalStore(session.subscribe, session.getSnapshot);
  useEffect(() => { void session.load(definition.slug); }, [session, definition.slug]);
  const save = useCallback((state: T) => { void session.save(definition.slug, definition.schemaVersion, state); }, [session, definition]);
  const reset = useCallback(() => { void session.delete(definition.slug); }, [session, definition.slug]);
  return { ...snapshot, scope: uid ?? 'guest', save, reset, retry: () => { void session.retry(); } };
}
