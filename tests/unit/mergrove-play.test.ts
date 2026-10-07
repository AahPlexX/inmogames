import { describe, expect, it } from 'vitest';
import { createRun, type MergroveRun } from '../../src/games/mergrove/engine';
import {
  UNDO_COST, WISH_TABLE, canHold, canUndo, compostAt, holdPiece, newPlay, placeAt, undoLast, type PlayState,
} from '../../src/games/mergrove/play';

const fresh = (extra: Partial<Parameters<typeof newPlay>[0]> = {}) => newPlay({ seed: 99, rulesetId: 'v1', layoutId: 'classic-5', mode: 'endless', ...extra });
const withRun = (s: PlayState, run: Partial<MergroveRun>): PlayState => ({ ...s, run: { ...s.run, ...run } });
const boardOf = (cells: Record<number, number>) => { const b = Array<number | null>(25).fill(null); for (const [i, t] of Object.entries(cells)) b[Number(i)] = t; return b; };

describe('newPlay', () => {
  it('starts an empty, wish-bearing, undo-less play state from a seed', () => {
    const s = fresh();
    expect(s.run).toEqual(createRun(99));
    expect(s.hold).toBeNull();
    expect(s.undo).toBeNull();
    expect(s.wishes).toHaveLength(2);
    expect(new Set(s.wishes.map(w => w.id)).size).toBe(2);
    expect(s.wishesDone).toBe(0);
  });
  it('is deterministic and keeps the wish stream separate from the queue stream', () => {
    expect(fresh()).toEqual(fresh());
    expect(fresh().run.rngState).toBe(createRun(99).rngState);
  });
  it('can be created with wishes disabled for migrated v1 runs', () => {
    const s = fresh({ wishes: false });
    expect(s.wishes).toEqual([]);
    expect(s.wishRng).toBeNull();
  });
  it('rejects unknown ruleset or layout ids', () => {
    expect(() => fresh({ rulesetId: 'nope' })).toThrow(/ruleset/i);
    expect(() => fresh({ layoutId: 'nope' })).toThrow(/layout/i);
  });
});

describe('placeAt / compostAt', () => {
  it('places like the engine, counts the turn and snapshots for undo in endless mode', () => {
    const s = fresh();
    const r = placeAt(s, 0, 12);
    expect(r.state.run.board[12]).toBe(1);
    expect(r.state.run.turns).toBe(1);
    expect(r.state.undo?.run).toEqual(s.run);
  });
  it('does not snapshot outside endless mode', () => {
    expect(placeAt(fresh({ mode: 'daily' }), 0, 0).state.undo).toBeNull();
    expect(placeAt(fresh({ mode: 'expedition' }), 0, 0).state.undo).toBeNull();
  });
  it('uses the ruleset: v2 leaves a bonus piece for a five-group, v1 does not', () => {
    const base = (id: string) => { const s = fresh({ rulesetId: id, wishes: false }); return withRun(s, { board: boardOf({ 1: 1, 5: 1, 7: 1, 11: 1 }) }); };
    expect(placeAt(base('v2'), 0, 6).state.run.board.filter(c => c !== null)).toHaveLength(2);
    expect(placeAt(base('v1'), 0, 6).state.run.board.filter(c => c !== null)).toHaveLength(1);
  });
  it('composts through the engine and snapshots too', () => {
    const s = withRun(fresh({ wishes: false }), { board: boardOf({ 3: 2 }), sunlight: 5 });
    const next = compostAt(s, 3);
    expect(next.run.board[3]).toBeNull();
    expect(next.run.sunlight).toBe(1);
    expect(next.undo?.run.sunlight).toBe(5);
  });
});

describe('holdPiece (Storehouse)', () => {
  it('stashes into an empty slot and refills that queue slot with exactly one draw', () => {
    const s = fresh({ wishes: false });
    const next = holdPiece(s, 1);
    expect(next.hold).toBe(s.run.queue[1]);
    expect(next.run.rngState).not.toBe(s.run.rngState);
    expect(next.run.queue[0]).toBe(s.run.queue[0]);
    expect(next.run.turns).toBe(0);
    expect(next.run.score).toBe(0);
  });
  it('swaps with a held piece without drawing', () => {
    let s = withRun(fresh({ wishes: false }), { highestTier: 3, queue: [1, 2, 1] });
    s = { ...s, hold: 1 };
    const next = holdPiece(s, 1);
    expect(next.hold).toBe(2);
    expect(next.run.queue).toEqual([1, 1, 1]);
    expect(next.run.rngState).toBe(s.run.rngState);
  });
  it('can be used any number of times in a row', () => {
    let s = holdPiece(fresh({ wishes: false }), 0);
    for (let i = 0; i < 6; i += 1) s = holdPiece(s, i % 3);
    expect(s.hold).not.toBeNull();
  });
  it('is unavailable once the run is over', () => {
    const over = withRun(fresh(), { gameOver: true });
    expect(canHold(over)).toBe(false);
    expect(() => holdPiece(over, 0)).toThrow(/over/i);
  });
  it('rejects a bad queue slot', () => {
    expect(() => holdPiece(fresh(), 3)).toThrow(/queue/i);
  });
});

describe('undo', () => {
  const setup = () => {
    let s = withRun(fresh({ wishes: false }), { sunlight: 6 });
    s = placeAt(s, 0, 12).state;
    return s;
  };
  it('restores the exact prior run and charges the cost from the restored sunlight', () => {
    const before = withRun(fresh({ wishes: false }), { sunlight: 6 });
    const after = placeAt(before, 0, 12).state;
    expect(canUndo(after)).toBe(true);
    const undone = undoLast(after);
    expect(undone.run).toEqual({ ...before.run, sunlight: 6 - UNDO_COST });
    expect(undone.undo).toBeNull();
  });
  it('cannot reroll the queue: the same placement after an undo draws the same replacement', () => {
    const s = setup();
    const again = placeAt(undoLast(s), 0, 12).state;
    expect(again.run.queue).toEqual(s.run.queue);
    expect(again.run.rngState).toBe(s.run.rngState);
  });
  it('is one level deep', () => {
    expect(canUndo(undoLast(setup()))).toBe(false);
    expect(() => undoLast(undoLast(setup()))).toThrow(/undo/i);
  });
  it('needs enough sunlight at the restored point', () => {
    const poor = placeAt(withRun(fresh({ wishes: false }), { sunlight: UNDO_COST - 1 }), 0, 12).state;
    expect(canUndo(poor)).toBe(false);
    expect(() => undoLast(poor)).toThrow(/undo/i);
  });
  it('is endless-only', () => {
    expect(canUndo({ ...setup(), mode: 'daily' })).toBe(false);
  });
  it('is blocked across a game-over transition', () => {
    const nearlyFull = Array<number | null>(25).fill(1); nearlyFull[0] = null;
    nearlyFull.forEach((_, i) => { if (i % 5 === 1) nearlyFull[i] = 2; if (i % 5 === 3) nearlyFull[i] = 3; if (i % 5 === 4) nearlyFull[i] = 4; if (i % 5 === 2) nearlyFull[i] = 5; });
    const s = withRun(fresh({ wishes: false }), { board: nearlyFull, sunlight: 2, highestTier: 5, queue: [6, 6, 6] });
    const done = placeAt(s, 0, 0).state;
    expect(done.run.gameOver).toBe(true);
    expect(done.undo).toBeNull();
    expect(canUndo(done)).toBe(false);
  });
  it('also undoes a hold made after the move, restoring everything together', () => {
    const s = setup();
    const held = holdPiece(s, 0);
    const undone = undoLast(held);
    expect(undone.hold).toBeNull();
  });
});

describe('wishes', () => {
  it('has a permanent, unique id table', () => {
    const ids = WISH_TABLE.map(w => w.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain('merge-four');
  });
  it('completes a wish, pays sunlight and replaces it from the wish stream only', () => {
    let s = fresh();
    s = { ...s, wishes: [{ id: 'merge-four', deadline: 8 }, { id: 'cascade-two', deadline: 10 }] };
    s = withRun(s, { board: boardOf({ 1: 1, 5: 1, 7: 1 }) });
    const r = placeAt(s, 0, 6);
    expect(r.completed).toEqual(['merge-four']);
    expect(r.state.run.sunlight).toBe(s.run.sunlight + 2 /* group of 4 */ + 2 /* reward */);
    expect(r.state.wishesDone).toBe(1);
    expect(r.state.wishes).toHaveLength(2);
    expect(r.state.wishes.map(w => w.id)).not.toContain('merge-four');
    expect(r.state.run.rngState).toBe(placeAt({ ...s, wishes: [], wishRng: null }, 0, 6).state.run.rngState);
  });
  it('expires a wish by placement count, never by time', () => {
    let s = { ...fresh(), wishes: [{ id: 'reach-sapling', deadline: 2 }, { id: 'cascade-two', deadline: 50 }] };
    const r1 = placeAt(s, 0, 0); expect(r1.expired).toEqual([]);
    const r2 = placeAt(r1.state, 0, 24); expect(r2.expired).toEqual(['reach-sapling']);
    expect(r2.state.wishes).toHaveLength(2);
  });
  it('a reward that lifts sunlight to the compost cost rescues a board the placement just filled', () => {
    const full = Array<number | null>(25).fill(null);
    full.forEach((_, i) => { full[i] = ((Math.floor(i / 5) + 2 * (i % 5)) % 5) + 2; }); // no equal neighbors
    full[0] = null;
    const base = withRun(fresh(), { board: full, sunlight: 2, highestTier: 6, queue: [1, 1, 1] });
    const noWish = placeAt({ ...base, wishes: [], wishRng: null }, 0, 0);
    expect(noWish.state.run.gameOver).toBe(true);
    const wished = placeAt({ ...base, wishes: [{ id: 'reach-bud', deadline: 99 }] }, 0, 0);
    expect(wished.completed).toEqual(['reach-bud']);
    expect(wished.state.run.sunlight).toBe(4);
    expect(wished.state.run.gameOver).toBe(false);
  });
  it('wishes disabled never touch the wish fields', () => {
    const r = placeAt(fresh({ wishes: false }), 0, 0);
    expect(r.state.wishes).toEqual([]);
    expect(r.state.wishRng).toBeNull();
    expect(r.completed).toEqual([]);
  });
});
