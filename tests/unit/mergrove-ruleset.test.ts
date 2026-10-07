import { describe, expect, it } from 'vitest';
import { createRun, placePiece } from '../../src/games/mergrove/engine';
import {
  RULESET_V1, replayRun, resolveRuleset, runFingerprint, type ReplayAction,
} from '../../src/games/mergrove/ruleset';

// src/games/mergrove ruleset "v1" golden replays (MER-009). A change to any value below means a released
// ruleset's behavior changed: add a NEW ruleset id instead of editing these.
const GOLDEN_SEED = 20261007;
const GOLDEN_ACTIONS: ReplayAction[] = [
  { kind: 'place', queueIndex: 0, cellIndex: 0 },
  { kind: 'place', queueIndex: 1, cellIndex: 1 },
  { kind: 'place', queueIndex: 2, cellIndex: 2 },
  { kind: 'place', queueIndex: 0, cellIndex: 5 },
  { kind: 'place', queueIndex: 0, cellIndex: 6 },
  { kind: 'place', queueIndex: 0, cellIndex: 7 },
  { kind: 'place', queueIndex: 0, cellIndex: 10 },
  { kind: 'place', queueIndex: 0, cellIndex: 11 },
  { kind: 'place', queueIndex: 0, cellIndex: 12 },
];

describe('Mergrove rulesets and replay (src/games/mergrove)', () => {
  it('resolves the released v1 ruleset and rejects unknown ids safely', () => {
    expect(resolveRuleset('v1')).toBe(RULESET_V1);
    expect(resolveRuleset('v3')).toBeNull();
    expect(resolveRuleset('')).toBeNull();
    expect(resolveRuleset('__proto__')).toBeNull();
    expect(resolveRuleset('constructor')).toBeNull();
  });

  it('freezes the released ruleset so it cannot be altered at runtime', () => {
    expect(Object.isFrozen(RULESET_V1)).toBe(true);
    expect(() => { (RULESET_V1 as { id: string }).id = 'hacked'; }).toThrow(/read only|read-only|frozen/i);
  });

  it('replays an empty action list to the freshly created run', () => {
    const replay = replayRun(GOLDEN_SEED, 'v1', []);
    expect(replay).toEqual({ ok: true, run: createRun(GOLDEN_SEED) });
  });

  it('replays actions to exactly the state the live engine reaches', () => {
    let live = createRun(GOLDEN_SEED);
    for (const action of GOLDEN_ACTIONS) {
      if (action.kind === 'place') live = placePiece(live, action.queueIndex, action.cellIndex).run;
    }
    expect(replayRun(GOLDEN_SEED, 'v1', GOLDEN_ACTIONS)).toEqual({ ok: true, run: live });
  });

  it('replays compost actions too', () => {
    const base = replayRun(GOLDEN_SEED, 'v1', GOLDEN_ACTIONS);
    if (!base.ok) throw new Error('golden replay failed');
    expect(base.run.sunlight).toBe(4);
    const composted = replayRun(GOLDEN_SEED, 'v1', [...GOLDEN_ACTIONS, { kind: 'compost', cellIndex: 12 }]);
    expect(composted).toMatchObject({ ok: true, run: { sunlight: 0 } });
  });

  it('reports an unknown ruleset without throwing', () => {
    expect(replayRun(1, 'nope', [])).toEqual({ ok: false, error: 'Unknown ruleset "nope".' });
  });

  it('reports the index of the first illegal action without throwing', () => {
    const result = replayRun(GOLDEN_SEED, 'v1', [
      { kind: 'place', queueIndex: 0, cellIndex: 0 },
      { kind: 'place', queueIndex: 0, cellIndex: 0 },
    ]);
    expect(result).toEqual({ ok: false, error: 'Action 2 is illegal: Choose an empty cell.' });
  });

  it('fingerprints deterministically and detects any state difference', () => {
    const a = createRun(5);
    expect(runFingerprint(a)).toBe(runFingerprint(createRun(5)));
    expect(runFingerprint(a)).toMatch(/^[0-9a-f]{8}$/);
    expect(runFingerprint(a)).not.toBe(runFingerprint(createRun(6)));
    expect(runFingerprint({ ...a, score: 1 })).not.toBe(runFingerprint(a));
    expect(runFingerprint({ ...a, board: a.board.map((c, i) => (i === 24 ? 1 : c)) })).not.toBe(runFingerprint(a));
  });

  it('matches the committed golden fingerprints', () => {
    const fresh = createRun(GOLDEN_SEED);
    const replay = replayRun(GOLDEN_SEED, 'v1', GOLDEN_ACTIONS);
    if (!replay.ok) throw new Error(replay.error);
    expect(runFingerprint(fresh)).toBe('1021b0d0');
    expect(runFingerprint(replay.run)).toBe('06aff2c1');
    // Readable mirror of the final hash, worked out by hand: 3 Seed trios (3 x 30) + Sprout cascade (3 x 10 x 2 x chain 2).
    expect(replay.run).toMatchObject({ score: 210, sunlight: 4, turns: 9, highestTier: 3, queue: [1, 1, 1], rngState: 1232670640 });
    expect(replay.run.board.filter(cell => cell !== null)).toEqual([3]);
    expect(replay.run.board[12]).toBe(3);
  });
});
