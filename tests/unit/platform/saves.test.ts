import { describe, expect, it, vi } from 'vitest';
import { LocalRepository } from '../../../src/platform/saves/local';
import { SaveSession } from '../../../src/platform/saves/session';
import type { GameSaveDefinition, AccountRepository } from '../../../src/platform/saves/contracts';

const game: GameSaveDefinition<{ best: number }> = {
  slug: 'test-game', schemaVersion: 1, storageKey: 'legacy-test', initial: { best: 0 },
  decode: v => typeof v === 'object' && v !== null && typeof (v as {best: unknown}).best === 'number' && (v as {best:number}).best >= 0 ? { best: (v as {best:number}).best } : null,
};
const memory = () => {
  const data = new Map<string,string>();
  return { data, getItem: (k:string) => data.get(k) ?? null, setItem: (k:string,v:string) => { data.set(k,v); }, removeItem: (k:string) => { data.delete(k); } };
};
const deferred = <T,>() => { let resolve!: (v:T)=>void; const promise = new Promise<T>(r=>{resolve=r}); return {promise,resolve}; };
function account(value: {best:number}|null): AccountRepository<{best:number}> {
  return { load: vi.fn(async()=>value), loadOrSeed: vi.fn(async(_slug,_version,seed)=>value ?? seed), save: vi.fn(async()=>{}), delete: vi.fn(async()=>{}) };
}

describe('local save repository',()=>{
 it('reads legacy data, writes a versioned envelope, and deletes only its game',async()=>{
  const s=memory();s.setItem('legacy-test',JSON.stringify({best:15}));s.setItem('other-game','keep');
  const repo=new LocalRepository(game,s);
  expect(await repo.load(game.slug)).toEqual({best:15});
  await repo.save(game.slug,1,{best:20});
  expect(JSON.parse(s.getItem('legacy-test')!)).toMatchObject({schemaVersion:1,state:{best:20}});
  await repo.delete(game.slug);expect(s.getItem('other-game')).toBe('keep');
 });
 it('survives throwing browser storage and rejects invalid/unknown-version state',async()=>{
  const broken={getItem:()=>{throw Error()},setItem:()=>{throw Error()},removeItem:()=>{throw Error()}};
  const repo=new LocalRepository(game,broken);await repo.save(game.slug,1,{best:20});expect(await repo.load(game.slug)).toEqual({best:20});expect(repo.warning).toBeTruthy();
  const s=memory();s.setItem('legacy-test',JSON.stringify({schemaVersion:99,state:{best:100}}));expect(await new LocalRepository(game,s).load(game.slug)).toBeNull();
  await expect(repo.save(game.slug,1,{best:-1})).rejects.toThrow();
 });
 it('isolates each account mirror from guests and other accounts',async()=>{
  const s=memory();const guest=new LocalRepository(game,s);const a=new LocalRepository(game,s,'alice');const b=new LocalRepository(game,s,'bob');
  await guest.save(game.slug,1,{best:5});await a.save(game.slug,1,{best:20});expect(await b.load(game.slug)).toBeNull();expect(await guest.load(game.slug)).toEqual({best:5});
  await a.delete(game.slug);expect(await guest.load(game.slug)).toEqual({best:5});
 });
});
describe('account/guest orchestration',()=>{
 it('plays and saves without any Firebase configuration',async()=>{
  const s=memory();const session=new SaveSession(game,new LocalRepository(game,s));await session.load(game.slug);await session.save(game.slug,1,{best:40});expect(session.getSnapshot().state.best).toBe(40);expect(s.getItem(game.storageKey)).toContain('40');
 });
 it('seeds a missing account once; an existing cloud save wins over guests',async()=>{
  const s=memory();const guest=new LocalRepository(game,s);await guest.save(game.slug,1,{best:99});
  const cloud=account({best:20});const session=new SaveSession(game,new LocalRepository(game,s,'alice'),cloud,guest);await session.load(game.slug);
  expect(session.getSnapshot().state).toEqual({best:20});expect(cloud.loadOrSeed).toHaveBeenCalledWith(game.slug,1,{best:99});expect(cloud.save).not.toHaveBeenCalled();expect(await guest.load(game.slug)).toEqual({best:99});
  const missing=account(null);const next=new SaveSession(game,new LocalRepository(game,s,'bob'),missing,guest);await next.load(game.slug);expect(next.getSnapshot().state.best).toBe(99);
 });
 it('never writes unhydrated guest/default state over an existing account',async()=>{
  const d=deferred<{best:number}|null>();const cloud=account(null);cloud.loadOrSeed=()=>d.promise;
  const s=memory();const session=new SaveSession(game,new LocalRepository(game,s,'alice'),cloud,new LocalRepository(game,s));
  const loading=session.load(game.slug);await session.save(game.slug,1,{best:50});expect(cloud.save).not.toHaveBeenCalled();d.resolve({best:70});await loading;expect(session.getSnapshot().state.best).toBe(70);
 });
 it('keeps failed account checkpoints in their own mirror and retries without touching guests',async()=>{
  const s=memory();const guest=new LocalRepository(game,s);const mirror=new LocalRepository(game,s,'alice');const cloud=account({best:20});
  const session=new SaveSession(game,mirror,cloud,guest);await session.load(game.slug);
  vi.mocked(cloud.save).mockRejectedValueOnce(Error('offline'));await session.save(game.slug,1,{best:30});expect(session.getSnapshot().error).toBeTruthy();expect(await mirror.load(game.slug)).toEqual({best:30});expect(await guest.load(game.slug)).toBeNull();
  await session.retry();expect(cloud.save).toHaveBeenLastCalledWith(game.slug,1,{best:30});expect(session.getSnapshot().error).toBeNull();
 });
 it('serializes checkpoints, blocks stale writes after disposal, and ignores stale hydration',async()=>{
  const d=deferred<void>();const cloud=account({best:20});vi.mocked(cloud.save).mockImplementationOnce(()=>d.promise);
  const s=memory();const session=new SaveSession(game,new LocalRepository(game,s,'alice'),cloud,new LocalRepository(game,s));await session.load(game.slug);
  const first=session.save(game.slug,1,{best:30});const second=session.save(game.slug,1,{best:40});await Promise.resolve();await Promise.resolve();session.dispose();d.resolve();await first;await second;expect(cloud.save).toHaveBeenCalledTimes(1);
  const slow=deferred<{best:number}|null>();const nextCloud=account(null);nextCloud.loadOrSeed=()=>slow.promise;const next=new SaveSession(game,new LocalRepository(game,s,'bob'),nextCloud,new LocalRepository(game,s));const pending=next.load(game.slug);next.dispose();slow.resolve({best:99});await pending;expect(next.getSnapshot().state.best).not.toBe(99);
 });
 it('resets only the selected account game and retries a failed deletion',async()=>{
  const s=memory();const guest=new LocalRepository(game,s);await guest.save(game.slug,1,{best:55});const cloud=account({best:20});const mirror=new LocalRepository(game,s,'alice');const session=new SaveSession(game,mirror,cloud,guest);await session.load(game.slug);
  vi.mocked(cloud.save).mockRejectedValueOnce(Error('offline'));await session.delete(game.slug);expect(session.getSnapshot().state).toEqual(game.initial);expect(session.getSnapshot().error).toBeTruthy();await session.retry();expect(cloud.save).toHaveBeenCalledTimes(2);expect(cloud.save).toHaveBeenLastCalledWith(game.slug,1,game.initial);expect(cloud.delete).not.toHaveBeenCalled();expect(await mirror.load(game.slug)).toBeNull();expect(await guest.load(game.slug)).toEqual({best:55});
 });
});
it('publishes cached account hydration as a new game revision before a slow server read resolves',async()=>{
 const s=memory();const mirror=new LocalRepository(game,s,'alice');await mirror.save(game.slug,1,{best:20});
 const d=deferred<{best:number}|null>();const cloud=account(null);cloud.loadOrSeed=()=>d.promise;
 const session=new SaveSession(game,mirror,cloud,new LocalRepository(game,s));const initialRevision=session.getSnapshot().revision;const loading=session.load(game.slug);await Promise.resolve();await Promise.resolve();
 expect(session.getSnapshot().state.best).toBe(20);expect(session.getSnapshot().revision).toBeGreaterThan(initialRevision);
 d.resolve({best:40});await loading;expect(session.getSnapshot().state.best).toBe(40);
});
