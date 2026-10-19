import { calculateWaysAwardUnits, isCascadeVaultWager, type WaysReelCount } from './paytable';
import { PAYING_SYMBOLS, type PayingSymbol, type VaultRandomSource, type VaultSymbol } from './symbols';

export type Board = VaultSymbol[][];
export interface BoardCoordinate { reel: number; row: number }
export interface WaysModifiers { cascadeMultiplier: number; featureBoost: boolean }
export interface WaysWin {
  symbol: PayingSymbol;
  consecutiveReels: WaysReelCount;
  ways: number;
  awardUnits: number;
}
export interface WaysEvaluation {
  wins: WaysWin[];
  removals: BoardCoordinate[];
  totalAwardUnits: number;
}
export interface CollapseModifiers { forceWildOnRefill: boolean }
export interface VaultRunState {
  remainingSpins: number;
  persistentMultiplier: number;
  meterLevel: 0 | 1 | 2 | 3;
  stepThreeAwarded: boolean;
}
export interface VaultRunSpinSummary { winningCascades: number; initialScatterCount: number }
export type CascadeVaultSpinMode = 'base' | 'vault';
export interface CascadeResult {
  index: number;
  multiplier: number;
  boardBefore: Board;
  evaluation: WaysEvaluation;
  boardAfter: Board;
}
export interface ResolveSpinInput {
  mode: CascadeVaultSpinMode;
  wagerCredits: number;
  random: VaultRandomSource;
  initialBoard?: Board;
  vaultState?: VaultRunState;
}
export interface ResolveSpinResult {
  mode: CascadeVaultSpinMode;
  initialBoard: Board;
  finalBoard: Board;
  cascades: CascadeResult[];
  totalAwardUnits: number;
  initialScatterCount: number;
  triggeredVaultRunSpins: number;
  nextVaultState: VaultRunState | null;
}

const REEL_COUNT = 6;
const ROW_COUNT = 5;
const MAX_CASCADES = 50;
const MAX_BASE_MULTIPLIER = 10;
const MAX_VAULT_MULTIPLIER = 20;
const MAX_VAULT_SPINS = 20;

interface WaysCandidate {
  symbol: PayingSymbol;
  consecutiveReels: WaysReelCount;
  ways: number;
  wildOnlyWays: number;
  awardPerWayUnits: number;
  coordinates: BoardCoordinate[];
}

function cloneBoard(board: Board): Board {
  return board.map((reel) => [...reel]);
}

function assertBoard(board: Board): void {
  if (!Array.isArray(board) || board.length !== REEL_COUNT) {
    throw new RangeError('Cascade Vault requires exactly six reels.');
  }
  for (const reel of board) {
    if (!Array.isArray(reel) || reel.length !== ROW_COUNT) {
      throw new RangeError('Cascade Vault requires exactly five rows per reel.');
    }
  }
}

function assertCoordinate({ reel, row }: BoardCoordinate): void {
  if (!Number.isSafeInteger(reel) || reel < 0 || reel >= REEL_COUNT || !Number.isSafeInteger(row) || row < 0 || row >= ROW_COUNT) {
    throw new RangeError('Cascade Vault board coordinate is out of range.');
  }
}

function coordinateKey({ reel, row }: BoardCoordinate): string {
  return `${reel}:${row}`;
}

function candidateForSymbol(board: Board, symbol: PayingSymbol, wagerCredits: number, modifiers: WaysModifiers): WaysCandidate | null {
  const matchesByReel: BoardCoordinate[][] = [];
  const wildCounts: number[] = [];

  for (let reel = 0; reel < REEL_COUNT; reel += 1) {
    const matches: BoardCoordinate[] = [];
    let wildCount = 0;
    for (let row = 0; row < ROW_COUNT; row += 1) {
      const cell = board[reel][row];
      if (cell === symbol || cell === 'wild') matches.push({ reel, row });
      if (cell === 'wild') wildCount += 1;
    }
    if (matches.length === 0) break;
    matchesByReel.push(matches);
    wildCounts.push(wildCount);
  }

  if (matchesByReel.length < 3) return null;
  const consecutiveReels = matchesByReel.length as WaysReelCount;
  const ways = matchesByReel.reduce((product, matches) => product * matches.length, 1);
  const wildOnlyWays = wildCounts.every((count) => count > 0)
    ? wildCounts.reduce((product, count) => product * count, 1)
    : 0;
  const awardPerWayUnits = calculateWaysAwardUnits(
    symbol,
    consecutiveReels,
    1,
    wagerCredits,
    modifiers.cascadeMultiplier,
    modifiers.featureBoost,
  );

  return {
    symbol,
    consecutiveReels,
    ways,
    wildOnlyWays,
    awardPerWayUnits,
    coordinates: matchesByReel.flat(),
  };
}

export function evaluateWays(board: Board, wagerCredits: number, modifiers: WaysModifiers): WaysEvaluation {
  assertBoard(board);
  if (!isCascadeVaultWager(wagerCredits)) throw new RangeError('Unsupported Cascade Vault wager.');
  if (!Number.isSafeInteger(modifiers.cascadeMultiplier) || modifiers.cascadeMultiplier < 1 || modifiers.cascadeMultiplier > MAX_VAULT_MULTIPLIER) {
    throw new RangeError('Invalid Cascade Vault multiplier.');
  }

  const candidates = PAYING_SYMBOLS
    .map((symbol) => candidateForSymbol(board, symbol, wagerCredits, modifiers))
    .filter((candidate): candidate is WaysCandidate => candidate !== null);
  const effectiveWays = new Map<PayingSymbol, number>();
  for (const candidate of candidates) effectiveWays.set(candidate.symbol, candidate.ways - candidate.wildOnlyWays);

  for (const reelCount of [3, 4, 5, 6] as const) {
    const group = candidates.filter((candidate) => candidate.consecutiveReels === reelCount && candidate.wildOnlyWays > 0);
    if (group.length === 0) continue;
    const winner = group.reduce((best, candidate) => candidate.awardPerWayUnits > best.awardPerWayUnits ? candidate : best);
    effectiveWays.set(winner.symbol, (effectiveWays.get(winner.symbol) ?? 0) + winner.wildOnlyWays);
  }

  const removals = new Map<string, BoardCoordinate>();
  const wins: WaysWin[] = [];
  for (const candidate of candidates) {
    const ways = effectiveWays.get(candidate.symbol) ?? 0;
    if (ways <= 0) continue;
    const awardUnits = candidate.awardPerWayUnits * ways;
    wins.push({ symbol: candidate.symbol, consecutiveReels: candidate.consecutiveReels, ways, awardUnits });
    for (const coordinate of candidate.coordinates) removals.set(coordinateKey(coordinate), coordinate);
  }

  return {
    wins,
    removals: [...removals.values()],
    totalAwardUnits: wins.reduce((sum, win) => sum + win.awardUnits, 0),
  };
}

export function createInitialBoard(random: VaultRandomSource): Board {
  return Array.from({ length: REEL_COUNT }, () => (
    Array.from({ length: ROW_COUNT }, () => random.drawSymbol('initial'))
  ));
}

export function collapseAndRefill(
  board: Board,
  removals: readonly BoardCoordinate[],
  random: VaultRandomSource,
  modifiers: CollapseModifiers,
): Board {
  assertBoard(board);
  const removed = new Set<string>();
  for (const coordinate of removals) {
    assertCoordinate(coordinate);
    removed.add(coordinateKey(coordinate));
  }

  const next: Board = [];
  const refillCoordinates: BoardCoordinate[] = [];
  for (let reel = 0; reel < REEL_COUNT; reel += 1) {
    const survivors = board[reel].filter((_, row) => !removed.has(`${reel}:${row}`));
    const vacancyCount = ROW_COUNT - survivors.length;
    const refill: VaultSymbol[] = [];
    for (let row = 0; row < vacancyCount; row += 1) {
      const symbol = random.drawSymbol('refill');
      if (symbol === 'scatter') throw new Error('Scatter cannot be generated during a Cascade Vault refill.');
      refill.push(symbol);
      refillCoordinates.push({ reel, row });
    }
    next.push([...refill, ...survivors]);
  }

  if (modifiers.forceWildOnRefill && refillCoordinates.length > 0) {
    const eligible = refillCoordinates.filter(({ reel, row }) => next[reel][row] !== 'wild');
    if (eligible.length > 0) {
      const selected = eligible[random.nextInt(eligible.length)];
      next[selected.reel][selected.row] = 'wild';
    }
  }

  return next;
}

export function vaultRunSpinsForScatters(scatterCount: number): number {
  if (!Number.isSafeInteger(scatterCount) || scatterCount < 0) throw new RangeError('Scatter count must be a non-negative safe integer.');
  if (scatterCount < 4) return 0;
  if (scatterCount === 4) return 8;
  if (scatterCount === 5) return 10;
  return 12;
}

function assertVaultRunState(state: VaultRunState): void {
  if (!Number.isSafeInteger(state.remainingSpins) || state.remainingSpins < 1 || state.remainingSpins > MAX_VAULT_SPINS) {
    throw new RangeError('Vault Run remaining spins must be between 1 and 20.');
  }
  if (!Number.isSafeInteger(state.persistentMultiplier) || state.persistentMultiplier < 2 || state.persistentMultiplier > MAX_VAULT_MULTIPLIER) {
    throw new RangeError('Vault Run multiplier must be between 2 and 20.');
  }
  if (![0, 1, 2, 3].includes(state.meterLevel)) throw new RangeError('Vault Run meter level must be 0 through 3.');
  if (state.meterLevel < 3 && state.stepThreeAwarded) throw new RangeError('Vault Run step-three award cannot precede meter level 3.');
}

export function advanceVaultRunAfterSpin(state: VaultRunState, summary: VaultRunSpinSummary): VaultRunState {
  assertVaultRunState(state);
  if (!Number.isSafeInteger(summary.winningCascades) || summary.winningCascades < 0 || summary.winningCascades > MAX_CASCADES) {
    throw new RangeError('Winning cascade count is out of range.');
  }
  if (!Number.isSafeInteger(summary.initialScatterCount) || summary.initialScatterCount < 0 || summary.initialScatterCount > REEL_COUNT * ROW_COUNT) {
    throw new RangeError('Initial Scatter count is out of range.');
  }

  const persistentMultiplier = Math.min(MAX_VAULT_MULTIPLIER, state.persistentMultiplier + summary.winningCascades);
  const meterLevel = Math.min(3, state.meterLevel + (summary.winningCascades >= 3 ? 1 : 0)) as 0 | 1 | 2 | 3;
  const newlyCompletedStepThree = meterLevel === 3 && !state.stepThreeAwarded;
  const retrigger = summary.initialScatterCount >= 4 ? 4 : 0;
  const stepThreeAward = newlyCompletedStepThree ? 3 : 0;
  const remainingSpins = Math.min(MAX_VAULT_SPINS, state.remainingSpins - 1 + retrigger + stepThreeAward);

  return {
    remainingSpins,
    persistentMultiplier,
    meterLevel,
    stepThreeAwarded: state.stepThreeAwarded || newlyCompletedStepThree,
  };
}

function countScatters(board: Board): number {
  return board.reduce((total, reel) => total + reel.filter((symbol) => symbol === 'scatter').length, 0);
}

export function resolveSpin(input: ResolveSpinInput): ResolveSpinResult {
  if (!isCascadeVaultWager(input.wagerCredits)) throw new RangeError('Unsupported Cascade Vault wager.');
  if (input.mode === 'vault') {
    if (!input.vaultState) throw new Error('Vault Run spin requires active feature state.');
    assertVaultRunState(input.vaultState);
  } else if (input.vaultState) {
    throw new Error('Base spin cannot consume Vault Run state.');
  }

  const initialBoard = cloneBoard(input.initialBoard ?? createInitialBoard(input.random));
  assertBoard(initialBoard);
  const initialScatterCount = countScatters(initialBoard);
  const cascades: CascadeResult[] = [];
  let board = cloneBoard(initialBoard);
  let multiplier = input.mode === 'base' ? 1 : input.vaultState!.persistentMultiplier;
  const featureBoost = input.mode === 'vault' && input.vaultState!.meterLevel >= 2;
  const forceWildOnRefill = input.mode === 'vault' && input.vaultState!.meterLevel >= 1;
  let totalAwardUnits = 0;

  while (true) {
    const evaluation = evaluateWays(board, input.wagerCredits, { cascadeMultiplier: multiplier, featureBoost });
    if (evaluation.wins.length === 0) break;
    if (cascades.length >= MAX_CASCADES) {
      throw new Error('Cascade Vault corruption guard reached the 50-cascade limit.');
    }

    const boardBefore = cloneBoard(board);
    const boardAfter = collapseAndRefill(board, evaluation.removals, input.random, { forceWildOnRefill });
    cascades.push({ index: cascades.length + 1, multiplier, boardBefore, evaluation, boardAfter: cloneBoard(boardAfter) });
    totalAwardUnits += evaluation.totalAwardUnits;
    board = boardAfter;
    multiplier = Math.min(input.mode === 'base' ? MAX_BASE_MULTIPLIER : MAX_VAULT_MULTIPLIER, multiplier + 1);
  }

  const triggeredVaultRunSpins = input.mode === 'base' ? vaultRunSpinsForScatters(initialScatterCount) : 0;
  const nextVaultState = input.mode === 'vault'
    ? advanceVaultRunAfterSpin(input.vaultState!, { winningCascades: cascades.length, initialScatterCount })
    : null;

  return {
    mode: input.mode,
    initialBoard,
    finalBoard: cloneBoard(board),
    cascades,
    totalAwardUnits,
    initialScatterCount,
    triggeredVaultRunSpins,
    nextVaultState,
  };
}
