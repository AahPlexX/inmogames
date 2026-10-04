import { expect, it, vi } from 'vitest';
import { createPlatform } from '../../../src/platform/PlatformProvider';
import { threefoldSaveDefinition } from '../../../src/games/threefold/persistence';
it('keeps a game repository alive when its workspace leaves so checkpoints survive navigation',async()=>{
 const platform=createPlatform({});const session=platform.createSession(threefoldSaveDefinition);
 const unsubscribe=session.subscribe(vi.fn());await session.load('threefold');unsubscribe();await Promise.resolve();await session.save('threefold',1,{bestScore:300});
 expect(platform.createSession(threefoldSaveDefinition)).toBe(session);expect(session.getSnapshot().state.bestScore).toBe(300);
});
