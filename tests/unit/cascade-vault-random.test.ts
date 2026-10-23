import { afterEach, describe, expect, it, vi } from 'vitest';
import { cryptographicNextInt } from '../../src/games/cascade-vault/random';

afterEach(() => {
  vi.unstubAllGlobals();
});

function stubCrypto(draws: number[]) {
  const requestedArrays: Uint32Array[] = [];
  const getRandomValues = vi.fn((values: Uint32Array) => {
    const next = draws.shift();
    if (next === undefined) throw new Error('Finite crypto fixture exhausted.');
    requestedArrays.push(values);
    values[0] = next;
    return values;
  });
  vi.stubGlobal('crypto', { getRandomValues } as unknown as Crypto);
  return { getRandomValues, requestedArrays };
}

describe('Cascade Vault cryptographic integer source', () => {
  it('rejects samples outside the unbiased range before returning a bounded value', () => {
    const crypto = stubCrypto([0xffff_ffff, 42]);

    expect(cryptographicNextInt(10)).toBe(2);
    expect(crypto.getRandomValues).toHaveBeenCalledTimes(2);
    expect(crypto.requestedArrays).toHaveLength(2);
    expect(crypto.requestedArrays.every((values) => values.length === 1)).toBe(true);
  });

  it('accepts the full unsigned 32-bit range', () => {
    stubCrypto([0xffff_ffff]);

    expect(cryptographicNextInt(0x1_0000_0000)).toBe(0xffff_ffff);
  });

  it.each([0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, 0x1_0000_0001])(
    'rejects invalid bound %s before requesting randomness',
    (bound) => {
      const crypto = stubCrypto([]);

      expect(() => cryptographicNextInt(bound)).toThrow(RangeError);
      expect(crypto.getRandomValues).not.toHaveBeenCalled();
    },
  );

  it('propagates a cryptographic source failure without falling back', () => {
    const failure = new Error('secure random source unavailable');
    const getRandomValues = vi.fn(() => {
      throw failure;
    });
    vi.stubGlobal('crypto', { getRandomValues } as unknown as Crypto);

    expect(() => cryptographicNextInt(10)).toThrow(failure);
    expect(getRandomValues).toHaveBeenCalledTimes(1);
  });
});
