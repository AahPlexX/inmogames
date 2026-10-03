export interface ThreefoldRound {
  tiles: number[];
  target: number;
  misses: number;
  earned: number | null;
}

export interface ThreefoldRun {
  seed: number;
  roundIndex: number;
  totalScore: number;
  rounds: ThreefoldRound[];
}

export interface SubmissionResult {
  correct: boolean;
  run: ThreefoldRun;
}

function nextRandom(state: number): [number, number] {
  let x = state >>> 0 || 0x6d2b79f5;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return [x >>> 0, (x >>> 0) / 0x1_0000_0000];
}

function shuffled(values: number[], seed: number): [number[], number] {
  const copy = [...values];
  let state = seed >>> 0;
  for (let i = copy.length - 1; i > 0; i -= 1) {
    let random: number;
    [state, random] = nextRandom(state);
    const j = Math.floor(random * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return [copy, state];
}

export function findSolutions(round: Pick<ThreefoldRound, 'tiles' | 'target'>): number[][] {
  const solutions: number[][] = [];
  for (let a = 0; a < round.tiles.length - 2; a += 1) {
    for (let b = a + 1; b < round.tiles.length - 1; b += 1) {
      for (let c = b + 1; c < round.tiles.length; c += 1) {
        if (round.tiles[a] + round.tiles[b] + round.tiles[c] === round.target) {
          solutions.push([round.tiles[a], round.tiles[b], round.tiles[c]]);
        }
      }
    }
  }
  return solutions;
}

export function scoreRound(misses: number): number {
  return Math.max(20, 100 - Math.max(0, Math.trunc(misses)) * 20);
}

export function createRun(seed: number): ThreefoldRun {
  let state = seed >>> 0;
  const rounds: ThreefoldRound[] = [];

  for (let roundIndex = 0; roundIndex < 5; roundIndex += 1) {
    let tiles: number[];
    [tiles, state] = shuffled(Array.from({ length: 9 }, (_, index) => index + 1 + roundIndex * 2), state);
    let solutionPool: number[];
    [solutionPool, state] = shuffled(tiles, state);
    const target = solutionPool[0] + solutionPool[1] + solutionPool[2];
    rounds.push({ tiles, target, misses: 0, earned: null });
  }

  return { seed, roundIndex: 0, totalScore: 0, rounds };
}

export function submitSelection(run: ThreefoldRun, selection: number[]): SubmissionResult {
  if (run.roundIndex >= run.rounds.length) throw new Error('Run is already complete.');
  if (selection.length !== 3 || new Set(selection).size !== 3) {
    throw new Error('Select three distinct tiles.');
  }
  const round = run.rounds[run.roundIndex];
  if (selection.some((value) => !round.tiles.includes(value))) throw new Error('Selection must come from the board.');

  const correct = selection.reduce((sum, value) => sum + value, 0) === round.target;
  const rounds = run.rounds.map((item) => ({ ...item, tiles: [...item.tiles] }));

  if (!correct) {
    rounds[run.roundIndex].misses += 1;
    return { correct: false, run: { ...run, rounds } };
  }

  const earned = scoreRound(round.misses);
  rounds[run.roundIndex].earned = earned;
  return {
    correct: true,
    run: {
      ...run,
      rounds,
      roundIndex: run.roundIndex + 1,
      totalScore: run.totalScore + earned,
    },
  };
}
