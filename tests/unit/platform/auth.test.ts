import { expect, it, vi } from 'vitest';
import { AuthController, type AuthAdapter } from '../../../src/platform/auth/controller';
import { readFirebaseConfig } from '../../../src/platform/firebase/config';
function adapter(){let observer!:Parameters<AuthAdapter['observe']>[0];return {auth:{prepare:vi.fn(async()=>null),observe:vi.fn((next:Parameters<AuthAdapter['observe']>[0])=>{observer=next;return ()=>{}}),register:vi.fn(async()=>{}),signIn:vi.fn(async()=>{}),resetPassword:vi.fn(async()=>{}),signOut:vi.fn(async()=>{})},notify:(u:{uid:string,email:string}|null)=>observer(u)};}
it('keeps missing, partial, and malformed config controlled; accepts only valid Web config',()=>{
 expect(readFirebaseConfig({}).status).toBe('unconfigured');expect(readFirebaseConfig({VITE_FIREBASE_API_KEY:'abc'}).status).toBe('invalid');
 expect(readFirebaseConfig({VITE_FIREBASE_API_KEY:'public-value',VITE_FIREBASE_PROJECT_ID:'project-name',VITE_FIREBASE_AUTH_DOMAIN:'project-name.firebaseapp.com',VITE_FIREBASE_APP_ID:'1:123:web:abcdef'}).status).toBe('configured');
 expect(readFirebaseConfig({VITE_FIREBASE_API_KEY:'public-value',VITE_FIREBASE_PROJECT_ID:'bad/path',VITE_FIREBASE_AUTH_DOMAIN:'https://bad',VITE_FIREBASE_APP_ID:'bad'}).status).toBe('invalid');
});
it('waits for the initial observer before exposing a restored user and supports sign-out',async()=>{
 const a=adapter();const store=new AuthController();await store.start(a.auth);expect(store.getSnapshot().status).toBe('loading');a.notify({uid:'alice',email:'alice@example.test'});expect(store.getSnapshot().user?.uid).toBe('alice');
 let resolve!:()=>void;a.auth.signOut.mockImplementation(()=>new Promise<void>(r=>{resolve=r}));const pending=store.signOut();expect(store.canWrite('alice')).toBe(false);resolve();await pending;expect(store.getSnapshot().user).toBeNull();
});
it('provides registration/login/reset seams and safe actionable failures',async()=>{
 const a=adapter();const store=new AuthController();await store.start(a.auth);a.notify(null);
 await store.register('player@example.test','a-password');expect(a.auth.register).toHaveBeenCalledWith('player@example.test','a-password');
 await store.signIn('player@example.test','a-password');expect(a.auth.signIn).toHaveBeenCalled();await store.resetPassword('player@example.test');expect(a.auth.resetPassword).toHaveBeenCalled();
 a.auth.signIn.mockRejectedValueOnce({code:'auth/invalid-credential'});await expect(store.signIn('player@example.test','wrong')).rejects.toThrow(/email|password/i);expect(store.getSnapshot().busy).toBe(false);
});
it('falls back to guest mode on preparation failure, without inventing an account',async()=>{
 const a=adapter();a.auth.prepare.mockRejectedValueOnce(Error('blocked'));const store=new AuthController();await store.start(a.auth);expect(store.getSnapshot().status).toBe('unavailable');expect(store.getSnapshot().user).toBeNull();expect(store.canWrite('alice')).toBe(false);
 const missing=new AuthController('unconfigured');expect(missing.getSnapshot().status).toBe('unconfigured');
});
