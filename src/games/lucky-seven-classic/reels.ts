export type ClassicSymbol =
  | 'cherry'
  | 'lemon'
  | 'orange'
  | 'plum'
  | 'bell'
  | 'bar'
  | 'double_bar'
  | 'triple_bar'
  | 'red7'
  | 'gold7';

export type StopSource = (reelIndex: number, stripLength: number) => number;
export type ReelWindow = readonly [ClassicSymbol, ClassicSymbol, ClassicSymbol];

export const CLASSIC_REELS: readonly (readonly ClassicSymbol[])[] = [
  ['red7','bell','bell','orange','cherry','orange','bar','lemon','bar','cherry','orange','orange','lemon','cherry','cherry','lemon','double_bar','cherry','bell','plum','gold7','lemon','lemon','plum','plum','double_bar','orange','bar','red7','plum','triple_bar','triple_bar'],
  ['plum','orange','orange','triple_bar','plum','bar','double_bar','cherry','lemon','red7','lemon','bell','plum','plum','triple_bar','double_bar','orange','cherry','gold7','red7','cherry','orange','bell','bar','cherry','bar','lemon','orange','bell','cherry','lemon','lemon'],
  ['triple_bar','cherry','orange','bell','cherry','cherry','orange','lemon','lemon','orange','cherry','orange','bar','cherry','red7','double_bar','plum','gold7','bar','bell','bar','lemon','plum','plum','red7','plum','lemon','triple_bar','double_bar','lemon','bell','orange'],
];

export function projectWindow(strip: readonly ClassicSymbol[], stop: number): ReelWindow {
  if (!Number.isInteger(stop) || stop < 0 || stop >= strip.length) throw new Error('Invalid reel stop.');
  return [
    strip[(stop - 1 + strip.length) % strip.length],
    strip[stop],
    strip[(stop + 1) % strip.length],
  ];
}

export function cryptoStopSource(_reelIndex: number, stripLength: number): number {
  if (!Number.isSafeInteger(stripLength) || stripLength < 1 || stripLength > 0x100000000) throw new Error('Invalid reel length.');
  const range = 0x100000000;
  const accepted = Math.floor(range / stripLength) * stripLength;
  const buffer = new Uint32Array(1);
  do {
    globalThis.crypto.getRandomValues(buffer);
  } while (buffer[0] >= accepted);
  return buffer[0] % stripLength;
}
