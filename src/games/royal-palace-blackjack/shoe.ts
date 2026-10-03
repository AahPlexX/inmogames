import type { Card, Rank, Suit } from './engine';

export const DECK_COUNT = 6;
export const SHOE_SIZE = 312;
export const CUT_FRACTION = 0.75;
const suits: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];
const ranks: Rank[] = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];

export function createShoe(): Card[] {
  const cards: Card[] = [];
  for (let deck = 0; deck < DECK_COUNT; deck += 1) {
    for (const suit of suits) for (const rank of ranks) cards.push({ rank, suit });
  }
  return cards;
}

function next(state: number): [number, number] {
  let x = state >>> 0 || 0x9e3779b9;
  x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
  return [x >>> 0, (x >>> 0) / 0x1_0000_0000];
}

export function shuffleSeeded(cards: readonly Card[], seed: number): Card[] {
  const copy = cards.map((card) => ({ ...card }));
  let state = seed >>> 0;
  for (let i = copy.length - 1; i > 0; i -= 1) {
    let random: number; [state, random] = next(state);
    const j = Math.floor(random * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function browserSeed(): number {
  const values = new Uint32Array(1);
  globalThis.crypto?.getRandomValues?.(values);
  return values[0] || (Date.now() >>> 0);
}

export function shuffledShoe(seed = browserSeed()): Card[] {
  return shuffleSeeded(createShoe(), seed);
}

export function needsShuffle(cardsRemaining: number): boolean {
  return SHOE_SIZE - cardsRemaining >= SHOE_SIZE * CUT_FRACTION;
}
