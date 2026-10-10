export const SYMBOLS = ['Crown','Ruby','Emerald','Chalice','Bell','A','K','Q','J','Wild','Scatter'] as const;
export type RoyalFortuneSymbol = (typeof SYMBOLS)[number];
export type ReelColumn = readonly [RoyalFortuneSymbol, RoyalFortuneSymbol, RoyalFortuneSymbol];
export type ReelWindow = readonly [ReelColumn, ReelColumn, ReelColumn, ReelColumn, ReelColumn];

export interface RandomSource { int(maxExclusive: number): number }

const strip = (...symbols: RoyalFortuneSymbol[]) => Object.freeze(symbols);

export const REEL_STRIPS = Object.freeze([
  strip('J','A','Chalice','A','Chalice','Q','A','A','Emerald','Crown','Wild','Q','Bell','K','J','K','Emerald','Emerald','J','K','Bell','K','A','Bell','Crown','Scatter','Wild','Bell','Q','Ruby','Chalice','Ruby'),
  strip('K','A','Wild','Scatter','Q','J','Bell','Q','Emerald','A','A','Ruby','Chalice','Bell','K','Bell','Q','Wild','K','Chalice','A','A','Bell','Chalice','Crown','J','Emerald','K','Ruby','Crown','J','Emerald'),
  strip('Emerald','Q','Bell','A','K','A','Wild','J','Ruby','Crown','K','Chalice','Emerald','Chalice','Wild','K','Bell','A','Bell','Scatter','Chalice','A','Ruby','Q','Emerald','K','Q','J','Crown','A','Bell','J'),
  strip('Q','J','K','Chalice','A','Emerald','Bell','Bell','Ruby','Bell','Ruby','Wild','Crown','K','K','Bell','A','Emerald','Emerald','J','Wild','Chalice','Scatter','A','Chalice','K','Crown','J','Q','A','A','Q'),
  strip('Q','A','Bell','Wild','Crown','J','J','Chalice','Emerald','A','Chalice','A','Chalice','Emerald','Emerald','K','Wild','K','Q','Bell','A','Scatter','Bell','Q','J','K','Bell','A','Ruby','K','Ruby','Crown'),
] as const);

export const PAYLINES = Object.freeze([
  [1,1,1,1,1], [0,0,0,0,0], [2,2,2,2,2], [0,1,2,1,0], [2,1,0,1,2],
  [0,0,1,2,2], [2,2,1,0,0], [1,0,0,0,1], [1,2,2,2,1], [0,1,1,1,0],
  [2,1,1,1,2], [1,0,1,2,1], [1,2,1,0,1], [0,1,0,1,0], [2,1,2,1,2],
  [1,1,0,1,1], [1,1,2,1,1], [0,2,0,2,0], [2,0,2,0,2], [0,2,2,2,0],
] as const);

export const cryptoRandomSource: RandomSource = {
  int(maxExclusive) {
    if (!Number.isSafeInteger(maxExclusive) || maxExclusive <= 0 || maxExclusive > 0x1_0000_0000) {
      throw new RangeError('Random bound must be a positive 32-bit integer.');
    }
    const range = 0x1_0000_0000;
    const limit = Math.floor(range / maxExclusive) * maxExclusive;
    const sample = new Uint32Array(1);
    do globalThis.crypto.getRandomValues(sample); while (sample[0] >= limit);
    return sample[0] % maxExclusive;
  },
};

export function projectReelWindow(stripSymbols: readonly RoyalFortuneSymbol[], stop: number): ReelColumn {
  if (!Number.isSafeInteger(stop) || stop < 0 || stop >= stripSymbols.length) throw new RangeError('Invalid reel stop.');
  const length = stripSymbols.length;
  return [stripSymbols[(stop - 1 + length) % length], stripSymbols[stop], stripSymbols[(stop + 1) % length]];
}

export function spinReels(random: RandomSource = cryptoRandomSource): { stops: readonly number[]; window: ReelWindow } {
  const stops = REEL_STRIPS.map((reel) => random.int(reel.length));
  const columns = REEL_STRIPS.map((reel, index) => projectReelWindow(reel, stops[index]));
  return { stops, window: columns as unknown as ReelWindow };
}
