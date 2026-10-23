const UINT32_RANGE = 0x1_0000_0000;

export function cryptographicNextInt(maxExclusive: number): number {
  if (!Number.isSafeInteger(maxExclusive) || maxExclusive <= 0 || maxExclusive > UINT32_RANGE) {
    throw new RangeError('Random bound must be a positive integer no larger than 2^32.');
  }

  const limit = UINT32_RANGE - (UINT32_RANGE % maxExclusive);
  const sample = new Uint32Array(1);
  do globalThis.crypto.getRandomValues(sample); while (sample[0] >= limit);
  return sample[0] % maxExclusive;
}
