import { assert as fcAssert, array, boolean, constant, constantFrom, double, integer, nat, oneof, property, tuple } from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  MAX_TIER, compostCell, connectedGroup, createRun, isRunOver, mergeScore, nextRandom, normalizeSeed, placePiece,
  type GroveCell, type MergroveRun,
} from '../../src/games/mergrove/engine';
import { CLASSIC_5, CROSSROADS_6, STANDARD_6, layoutCellCount, type BoardLayout } from '../../src/games/mergrove/layout';
import { RULESET_V1, RULESET_V2, replayRun, rulesOf, runFingerprint, type ReplayAction } from '../../src/games/mergrove/ruleset';
import { canUndo, holdPiece, newPlay, placeAt, undoLast } from '../../src/games/mergrove/play';

// Property tests for src/games/mergrove. fast-check searches for counterexamples and shrinks them,
// which complements the hand-picked cases in the other mergrove-*.test.ts files.
const NUM_RUNS = 120;
const layouts: BoardLayout[] = [CLASSIC_5, STANDARD_6, CROSSROADS_6];
const layoutArb = constantFrom(...layouts);
const rulesetArb = constantFrom(RULESET_V1, RULESET_V2);
const seedArb = integer({ min: 1, max: 0xffff_ffff });
/** A move script: indexes are reduced modulo the live options, so every script is legal. */
const scriptArb = array(tuple(nat(2), nat(1000), boolean()), { minLength: 0, maxLength: 70 });

function playScript(seed: number, layout: BoardLayout, rules: ReturnType<typeof rulesOf>, script: [number, number, boolean][]) {
  let run = createRun(seed, layout);
  const actions: ReplayAction[] = [];
  for (const [queueIndex, pick, tryCompost] of script) {
    if (run.gameOver) break;
    const empties = run.board.flatMap((cell, index) => (cell === null && layout.playable[index] ? [index] : []));
    const occupied = run.board.flatMap((cell, index) => (cell === null ? [] : [index]));
    if (tryCompost && run.sunlight >= 4 && occupied.length > 0) {
      const cellIndex = occupied[pick % occupied.length];
      run = compostCell(run, cellIndex, layout);
      actions.push({ kind: 'compost', cellIndex });
    } else if (empties.length > 0) {
      const cellIndex = empties[pick % empties.length];
      run = placePiece(run, queueIndex, cellIndex, layout, rules).run;
      actions.push({ kind: 'place', queueIndex, cellIndex });
    } else break;
  }
  return { run, actions };
}

function standingGroups(run: MergroveRun, layout: BoardLayout): number {
  let worst = 0;
  run.board.forEach((tier, index) => {
    if (tier === null) return;
    worst = Math.max(worst, connectedGroup(run.board, index, tier, layout).length);
  });
  return worst;
}

describe('Mergrove engine properties (src/games/mergrove)', () => {
  it('normalizeSeed always yields a non-zero uint32 and is idempotent', () => {
    fcAssert(property(oneof(double({ noNaN: false }), integer(), constant(0), constant(0x1_0000_0000)), (value) => {
      const seed = normalizeSeed(value);
      expect(Number.isInteger(seed) && seed >= 1 && seed <= 0xffff_ffff).toBe(true);
      expect(normalizeSeed(seed)).toBe(seed);
    }), { numRuns: 300 });
  });

  it('maps non-finite and zero seeds to the documented fallback', () => {
    for (const bad of [Number.NaN, Infinity, -Infinity, 0, 0x1_0000_0000]) expect(normalizeSeed(bad)).toBe(0x6d2b79f5);
  });

  it('nextRandom never returns zero state and stays in [0, 1)', () => {
    fcAssert(property(seedArb, (state) => {
      const [next, value] = nextRandom(state);
      expect(next).toBeGreaterThan(0);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }), { numRuns: 300 });
  });

  it('never leaves a standing group of three, on any layout or ruleset', () => {
    fcAssert(property(seedArb, layoutArb, rulesetArb, scriptArb, (seed, layout, ruleset, script) => {
      const { run } = playScript(seed, layout, rulesOf(ruleset), script);
      expect(standingGroups(run, layout)).toBeLessThan(3);
    }), { numRuns: NUM_RUNS });
  });

  it('keeps every board invariant: length, tiers in range, blocked cells empty, gameOver derived', () => {
    fcAssert(property(seedArb, layoutArb, rulesetArb, scriptArb, (seed, layout, ruleset, script) => {
      const { run } = playScript(seed, layout, rulesOf(ruleset), script);
      expect(run.board).toHaveLength(layoutCellCount(layout));
      const blockedCells = run.board.filter((_cell: GroveCell, index) => !layout.playable[index]);
      expect(blockedCells.every(cell => cell === null)).toBe(true);
      const tiers = run.board.filter((cell: GroveCell): cell is number => cell !== null);
      expect(tiers.every(cell => Number.isInteger(cell) && cell >= 1 && cell <= MAX_TIER)).toBe(true);
      expect(run.gameOver).toBe(isRunOver(run.board, run.sunlight, layout));
      expect(run.highestTier).toBeGreaterThanOrEqual(Math.max(1, ...run.board.map(cell => cell ?? 0)));
      expect(run.score).toBeGreaterThanOrEqual(0);
      expect(run.queue.every(piece => piece === 1 || piece === 2)).toBe(true);
      expect(run.highestTier >= 3 || run.queue.every(piece => piece === 1)).toBe(true);
    }), { numRuns: NUM_RUNS });
  });

  it('replaying the recorded actions reproduces the exact run', () => {
    fcAssert(property(seedArb, layoutArb, rulesetArb, scriptArb, (seed, layout, ruleset, script) => {
      const { run, actions } = playScript(seed, layout, rulesOf(ruleset), script);
      const replay = replayRun(seed, ruleset.id, actions, layout);
      if (!replay.ok) throw new Error(replay.error);
      expect(replay.run).toEqual(run);
      expect(runFingerprint(replay.run)).toBe(runFingerprint(run));
    }), { numRuns: NUM_RUNS });
  });

  it('is deterministic: the same seed and script always produce the same run', () => {
    fcAssert(property(seedArb, layoutArb, rulesetArb, scriptArb, (seed, layout, ruleset, script) => {
      const rules = rulesOf(ruleset);
      expect(playScript(seed, layout, rules, script).run).toEqual(playScript(seed, layout, rules, script).run);
    }), { numRuns: 60 });
  });

  it('never mutates the run passed in', () => {
    fcAssert(property(seedArb, layoutArb, scriptArb, (seed, layout, script) => {
      const { run } = playScript(seed, layout, rulesOf(RULESET_V2), script);
      if (run.gameOver) return;
      const frozen = JSON.stringify(run);
      const empty = run.board.findIndex((cell, index) => cell === null && layout.playable[index]);
      if (empty >= 0) placePiece(run, 0, empty, layout, rulesOf(RULESET_V2));
      expect(JSON.stringify(run)).toBe(frozen);
    }), { numRuns: 80 });
  });

  it('v1 and v2 stay identical until a group of five or more merges', () => {
    fcAssert(property(seedArb, scriptArb, (seed, script) => {
      // Play both rulesets move by move and stop at the first move where v2's rule can matter.
      let v1 = createRun(seed);
      let v2 = createRun(seed);
      for (const [queueIndex, pick] of script) {
        const empties = v1.board.flatMap((cell, index) => (cell === null ? [index] : []));
        if (v1.gameOver || empties.length === 0) break;
        const cell = empties[pick % empties.length];
        const a = placePiece(v1, queueIndex, cell, CLASSIC_5, rulesOf(RULESET_V1));
        const b = placePiece(v2, queueIndex, cell, CLASSIC_5, rulesOf(RULESET_V2));
        const bigMerge = a.events.some(event => event.size >= 5);
        // Before any 5+ merge the two engines must agree exactly; the move that triggers one may differ.
        expect(bigMerge || JSON.stringify(a) === JSON.stringify(b)).toBe(true);
        if (bigMerge) return;
        v1 = a.run;
        v2 = b.run;
      }
    }), { numRuns: 120 });
  });

  it('connectedGroup returns [] for an empty or mismatched start cell, and groups are symmetric', () => {
    fcAssert(property(seedArb, layoutArb, scriptArb, (seed, layout, script) => {
      const { run } = playScript(seed, layout, rulesOf(RULESET_V2), script);
      const emptyCells = run.board.flatMap((tier, index) => (tier === null ? [index] : []));
      const filled = run.board.flatMap((tier, index) => (tier === null ? [] : [{ tier, index }]));
      expect(emptyCells.map(index => connectedGroup(run.board, index, 1, layout).length).every(size => size === 0)).toBe(true);
      expect(filled.map(({ tier, index }) => connectedGroup(run.board, index, tier === MAX_TIER ? 1 : tier + 1, layout).length).every(size => size === 0)).toBe(true);
      const sorted = (list: number[]) => [...list].sort((a, b) => a - b);
      const asymmetric = filled.flatMap(({ tier, index }) => {
        const group = connectedGroup(run.board, index, tier, layout);
        return group.filter(member => JSON.stringify(sorted(connectedGroup(run.board, member, tier, layout))) !== JSON.stringify(sorted(group)));
      });
      expect(asymmetric).toEqual([]);
    }), { numRuns: 60 });
  });

  it('on shaped boards the final playable cell ends the run exactly when sunlight is below the compost cost', () => {
    // Build a full, group-free board by a safe 5-colouring, then empty one playable cell and fill it back.
    const colourFor = (layout: BoardLayout, index: number) => ((Math.floor(index / layout.width) + 2 * (index % layout.width)) % 5) + 2;
    fcAssert(property(constantFrom(STANDARD_6, CROSSROADS_6, CLASSIC_5), nat(1000), integer({ min: 0, max: 8 }), (layout, pick, sunlight) => {
      const playable = layout.playable.flatMap((open, index) => (open ? [index] : []));
      const hole = playable[pick % playable.length];
      const board: GroveCell[] = layout.playable.map((open, index) => (open && index !== hole ? colourFor(layout, index) : null));
      // Piece 1 never matches tiers 2..6, so placing it cannot merge and must fill the board.
      const run: MergroveRun = { ...createRun(11, layout), board, sunlight, highestTier: 6, queue: [1, 1, 1] };
      const next = placePiece(run, 0, hole, layout).run;
      expect(next.board.every((cell, index) => cell !== null || !layout.playable[index])).toBe(true);
      expect(next.gameOver).toBe(sunlight < 4);
      // Blocked cells are not placeable even when the board still has holes.
      const blockedCells = layout.playable.flatMap((open, index) => (open ? [] : [index]));
      const attempts = blockedCells.map(blocked => { try { placePiece(run, 0, blocked, layout); return 'placed'; } catch (error) { return (error as Error).message; } });
      expect(attempts.every(message => message === 'That cell is not part of this board.')).toBe(true);
    }), { numRuns: 200 });
  });

  it('mergeScore is monotonic in group size, tier and chain', () => {
    fcAssert(property(integer({ min: 1, max: 7 }), integer({ min: 3, max: 12 }), integer({ min: 1, max: 8 }), (tier, size, chain) => {
      expect(mergeScore(tier + 1, size, chain)).toBeGreaterThan(mergeScore(tier, size, chain));
      expect(mergeScore(tier, size + 1, chain)).toBeGreaterThan(mergeScore(tier, size, chain));
      expect(mergeScore(tier, size, chain + 1)).toBeGreaterThan(mergeScore(tier, size, chain));
    }), { numRuns: 200 });
  });

  it('rejects a queue slot holding an out-of-range piece instead of corrupting the board', () => {
    const run = createRun(5);
    expect(() => placePiece({ ...run, queue: [0, 1, 1] }, 0, 0)).toThrow('Queue contains an invalid piece.');
    expect(() => placePiece({ ...run, queue: [9, 1, 1] }, 0, 0)).toThrow('Queue contains an invalid piece.');
  });
});

describe('Mergrove play-state properties (src/games/mergrove)', () => {
  const opArb = array(tuple(constantFrom('place', 'hold', 'undo'), nat(2), nat(1000)), { minLength: 0, maxLength: 60 });

  it('undo never lets a player reroll: redoing the undone move gives the identical state', () => {
    let undone = 0;
    fcAssert(property(seedArb, rulesetArb, opArb, (seed, ruleset, ops) => {
      let state = newPlay({ seed, rulesetId: ruleset.id, layoutId: 'classic-5', mode: 'endless' });
      state = { ...state, run: { ...state.run, sunlight: 40 } }; // plenty to pay for undo, so it is exercised
      for (const [kind, slot, pick] of ops) {
        if (state.run.gameOver) break;
        const empties = state.run.board.flatMap((cell, index) => (cell === null ? [index] : []));
        if (kind === 'hold') { state = holdPiece(state, slot); continue; }
        if (kind === 'undo') { if (canUndo(state)) state = undoLast(state); continue; }
        if (empties.length === 0) break;
        const cell = empties[pick % empties.length];
        const before = state;
        const after = placeAt(before, slot, cell).state;
        const restored = canUndo(after) ? undoLast(after) : null;
        undone += restored ? 1 : 0;
        const faults = restored ? [
          JSON.stringify(restored.run.board) === JSON.stringify(before.run.board) ? '' : 'board',
          restored.run.rngState === before.run.rngState ? '' : 'rngState',
          JSON.stringify(restored.run.queue) === JSON.stringify(before.run.queue) ? '' : 'queue',
          JSON.stringify(placeAt(restored, slot, cell).state.run.queue) === JSON.stringify(after.run.queue) ? '' : 'replay-queue',
        ].filter(Boolean) : [];
        expect(faults).toEqual([]);
        state = after;
      }
    }), { numRuns: 80 });
    expect(undone).toBeGreaterThan(50); // the property must really exercise undo, not pass vacuously
  });

  it('holding never changes score, turns or sunlight and keeps the queue length', () => {
    fcAssert(property(seedArb, array(nat(2), { minLength: 1, maxLength: 20 }), (seed, slots) => {
      let state = newPlay({ seed, rulesetId: 'v2', layoutId: 'classic-5', mode: 'journey' });
      const { score, turns, sunlight } = state.run;
      for (const slot of slots) {
        state = holdPiece(state, slot);
        expect(state.run).toMatchObject({ score, turns, sunlight });
        expect(state.run.queue).toHaveLength(3);
        expect(state.hold).not.toBeNull();
      }
    }), { numRuns: 80 });
  });

  it('wishes never change the queue stream: on and off runs draw identical queues', () => {
    fcAssert(property(seedArb, array(nat(1000), { minLength: 1, maxLength: 24 }), (seed, picks) => {
      let on = newPlay({ seed, rulesetId: 'v1', layoutId: 'classic-5', mode: 'endless' });
      let off = newPlay({ seed, rulesetId: 'v1', layoutId: 'classic-5', mode: 'endless', wishes: false });
      for (const pick of picks) {
        if (on.run.gameOver || off.run.gameOver) break;
        const emptiesOn = on.run.board.flatMap((cell, index) => (cell === null ? [index] : []));
        const emptiesOff = off.run.board.flatMap((cell, index) => (cell === null ? [index] : []));
        if (emptiesOn.length === 0 || emptiesOff.length === 0) break;
        on = placeAt(on, 0, emptiesOn[pick % emptiesOn.length]).state;
        off = placeAt(off, 0, emptiesOff[pick % emptiesOff.length]).state;
        // Rewards only add sunlight, so while no reward has paid out the two boards and queues must match.
        const diverged = on.wishesDone === 0 && (JSON.stringify(on.run.queue) !== JSON.stringify(off.run.queue) || on.run.rngState !== off.run.rngState);
        expect(diverged).toBe(false);
      }
    }), { numRuns: 80 });
  });
});
