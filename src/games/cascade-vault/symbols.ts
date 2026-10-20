export const PAYING_SYMBOLS = [
  'quartz',
  'copper',
  'silver',
  'gold',
  'sapphire',
  'emerald',
  'ruby',
  'vault_crown',
] as const;

export type PayingSymbol = (typeof PAYING_SYMBOLS)[number];
export type VaultSymbol = PayingSymbol | 'wild' | 'scatter' | 'blank';
export type VaultDrawContext = 'initial' | 'refill';

export interface VaultRandomSource {
  drawSymbol(context: VaultDrawContext): VaultSymbol;
  nextInt(maxExclusive: number): number;
}

export interface WeightedVaultSymbol {
  readonly symbol: VaultSymbol;
  readonly weight: number;
}

/**
 * Provisional engineering weights. Task CV-002 owns the final balance gate;
 * these values must not be treated as verified until the 10M-spin audit passes.
 */
export const INITIAL_SYMBOL_WEIGHTS: readonly WeightedVaultSymbol[] = Object.freeze([
  { symbol: 'quartz', weight: 13 },
  { symbol: 'copper', weight: 12 },
  { symbol: 'silver', weight: 12 },
  { symbol: 'gold', weight: 11 },
  { symbol: 'sapphire', weight: 11 },
  { symbol: 'emerald', weight: 11 },
  { symbol: 'ruby', weight: 10 },
  { symbol: 'vault_crown', weight: 1 },
  { symbol: 'wild', weight: 1 },
  { symbol: 'scatter', weight: 4 },
  { symbol: 'blank', weight: 24 },
]);

export const REFILL_SYMBOL_WEIGHTS: readonly WeightedVaultSymbol[] = Object.freeze(
  INITIAL_SYMBOL_WEIGHTS.filter((entry) => entry.symbol !== 'scatter'),
);

function assertRandomBound(maxExclusive: number): void {
  if (!Number.isSafeInteger(maxExclusive) || maxExclusive <= 0) {
    throw new RangeError('Random bound must be a positive safe integer.');
  }
}

export function weightedSymbolTotal(entries: readonly WeightedVaultSymbol[]): number {
  const total = entries.reduce((sum, entry) => {
    if (!Number.isSafeInteger(entry.weight) || entry.weight <= 0) {
      throw new RangeError('Vault symbol weights must be positive safe integers.');
    }
    return sum + entry.weight;
  }, 0);
  if (!Number.isSafeInteger(total) || total <= 0) throw new RangeError('Vault symbol table must have positive total weight.');
  return total;
}

export function drawWeightedVaultSymbol(
  entries: readonly WeightedVaultSymbol[],
  nextInt: (maxExclusive: number) => number,
): VaultSymbol {
  const total = weightedSymbolTotal(entries);
  const pick = nextInt(total);
  if (!Number.isSafeInteger(pick) || pick < 0 || pick >= total) {
    throw new RangeError('Random source returned an out-of-range symbol draw.');
  }

  let cursor = pick;
  for (const entry of entries) {
    if (cursor < entry.weight) return entry.symbol;
    cursor -= entry.weight;
  }
  throw new Error('Vault symbol draw exhausted its source-controlled weight table.');
}

export function createWeightedVaultRandomSource(nextInt: (maxExclusive: number) => number): VaultRandomSource {
  return {
    nextInt(maxExclusive) {
      assertRandomBound(maxExclusive);
      const value = nextInt(maxExclusive);
      if (!Number.isSafeInteger(value) || value < 0 || value >= maxExclusive) {
        throw new RangeError('Random source returned an out-of-range integer.');
      }
      return value;
    },
    drawSymbol(context) {
      return drawWeightedVaultSymbol(context === 'initial' ? INITIAL_SYMBOL_WEIGHTS : REFILL_SYMBOL_WEIGHTS, nextInt);
    },
  };
}
