import { describe,expect,it,vi } from 'vitest';
import { playCue } from '../../src/games/royal-palace-blackjack/audio';
describe('Royal Palace audio boundary',()=>{it('does nothing while sound is disabled',()=>{expect(playCue('chip',false)).toBe(false)});it('fails safely when Web Audio is unavailable',()=>{vi.stubGlobal('AudioContext',undefined);expect(playCue('win',true)).toBe(false);vi.unstubAllGlobals()})});
