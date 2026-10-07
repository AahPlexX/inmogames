import {
  BOARD_CELLS, COMPOST_COST, MAX_TIER, SECOND_TIER_CHANCE, compostCell, createRun, placePiece,
  type EngineRules, type MergroveRun,
} from './engine';
import { CLASSIC_5, type BoardLayout } from './layout';

/**
 * Released rulesets are frozen. The engine functions behind "v1" must keep producing byte-identical
 * runs for the same seed and actions; the golden replays in tests/unit/mergrove-ruleset.test.ts enforce
 * that. A rules change ships as a NEW ruleset id, never as an edit to a released one.
 */
export interface Ruleset {
  readonly id: string;
  readonly boardCells: number;
  readonly maxTier: number;
  readonly compostCost: number;
  readonly secondTierChance: number;
  /** Merging 5+ leaves one extra result piece beside the anchor (introduced by v2). */
  readonly largeGroupBonus: boolean;
}

export const RULESET_V1: Ruleset = Object.freeze({
  id: 'v1',
  boardCells: BOARD_CELLS,
  maxTier: MAX_TIER,
  compostCost: COMPOST_COST,
  secondTierChance: SECOND_TIER_CHANCE,
  largeGroupBonus: false,
});

/** v2 = v1 plus the large-group bonus. Same RNG, scoring, sunlight and tiers, so only 5+ merges differ. */
export const RULESET_V2: Ruleset = Object.freeze({ ...RULESET_V1, id: 'v2', largeGroupBonus: true });

/** The engine-facing switches for a ruleset. */
export function rulesOf(ruleset: Ruleset): EngineRules {
  return Object.freeze({ largeGroupBonus: ruleset.largeGroupBonus });
}

const RELEASED: ReadonlyMap<string, Ruleset> = new Map([RULESET_V1, RULESET_V2].map(ruleset => [ruleset.id, ruleset]));

/** Returns the frozen ruleset for an id, or null. A Map lookup keeps ids like "__proto__" harmless. */
export function resolveRuleset(id: string): Ruleset | null {
  return RELEASED.get(id) ?? null;
}

export type ReplayAction =
  | { kind: 'place'; queueIndex: number; cellIndex: number }
  | { kind: 'compost'; cellIndex: number };

export type ReplayResult = { ok: true; run: MergroveRun } | { ok: false; error: string };

/** Rebuilds a run from its seed and action log. Never throws: bad input becomes { ok: false }. */
export function replayRun(seed: number, rulesetId: string, actions: readonly ReplayAction[], layout: BoardLayout = CLASSIC_5): ReplayResult {
  const ruleset = resolveRuleset(rulesetId);
  if (!ruleset) return { ok: false, error: `Unknown ruleset "${rulesetId}".` };
  const rules = rulesOf(ruleset);
  let run = createRun(seed, layout);
  for (let index = 0; index < actions.length; index += 1) {
    const action = actions[index];
    try {
      run = action.kind === 'place' ? placePiece(run, action.queueIndex, action.cellIndex, layout, rules).run : compostCell(run, action.cellIndex, layout);
    } catch (error) {
      return { ok: false, error: `Action ${index + 1} is illegal: ${error instanceof Error ? error.message : 'unknown error'}` };
    }
  }
  return { ok: true, run };
}

/** FNV-1a 32-bit hash of a canonical run string, as 8 lowercase hex digits. Not cryptographic. */
export function runFingerprint(run: MergroveRun): string {
  const canonical = [
    run.seed, run.rngState, run.board.map(cell => cell ?? 0).join(','), run.queue.join(','),
    run.score, run.sunlight, run.highestTier, run.ancientBlooms, run.turns, run.gameOver ? 1 : 0,
  ].join('|');
  let hash = 0x811c9dc5;
  for (let index = 0; index < canonical.length; index += 1) {
    hash ^= canonical.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}
