import { BAR_SYMBOLS, EXACT_MULTIPLIERS, SYMBOL_LABELS, isClassicWager } from './paytable';
import { CLASSIC_REELS, cryptoStopSource, projectWindow, type ClassicSymbol, type ReelWindow, type StopSource } from './reels';

export interface ClassicAward {
  multiplier: number;
  payout: number;
  label: string;
}

export interface ClassicSpin {
  stops: number[];
  windows: ReelWindow[];
  center: ClassicSymbol[];
}

function award(multiplier: number, wager: number, label: string): ClassicAward {
  return { multiplier, payout: multiplier * wager, label };
}

function exactLabel(symbol: ClassicSymbol): string {
  if (symbol === 'bar') return '3 BAR';
  if (symbol === 'double_bar') return '3 Double BAR';
  if (symbol === 'triple_bar') return '3 Triple BAR';
  if (symbol === 'red7' || symbol === 'gold7') return `3 ${SYMBOL_LABELS[symbol]}s`;
  return `3 ${SYMBOL_LABELS[symbol]}s`;
}

export function evaluateCenterLine(line: readonly ClassicSymbol[], wager: number): ClassicAward {
  if (line.length !== 3) throw new Error('Classic center line must contain three symbols.');
  if (!isClassicWager(wager)) throw new Error('Unsupported classic wager.');

  const cherryCount = line.filter((symbol) => symbol === 'cherry').length;
  if (cherryCount > 0) {
    const multiplier = cherryCount === 1 ? 1 : cherryCount === 2 ? 3 : 10;
    return award(multiplier, wager, `${cherryCount} Cherr${cherryCount === 1 ? 'y' : 'ies'}`);
  }

  const allBars = line.every((symbol) => BAR_SYMBOLS.has(symbol));
  const allSame = line.every((symbol) => symbol === line[0]);
  if (allBars && !allSame) return award(5, wager, 'Mixed BAR');

  if (allSame) {
    const multiplier = EXACT_MULTIPLIERS[line[0]] ?? 0;
    if (multiplier > 0) return award(multiplier, wager, exactLabel(line[0]));
  }

  return award(0, wager, 'No win');
}

export function spinClassicReels(random: StopSource = cryptoStopSource): ClassicSpin {
  const stops: number[] = [];
  const windows: ReelWindow[] = [];
  const center: ClassicSymbol[] = [];

  CLASSIC_REELS.forEach((strip, reelIndex) => {
    const stop = random(reelIndex, strip.length);
    const window = projectWindow(strip, stop);
    stops.push(stop);
    windows.push(window);
    center.push(window[1]);
  });

  return { stops, windows, center };
}

export interface ClassicMathAudit {
  combinations: number;
  probabilityTotal: number;
  rtp: number;
  hitFrequency: number;
  goldSevenProbability: number;
}

export function auditClassicMath(): ClassicMathAudit {
  const [first, second, third] = CLASSIC_REELS;
  const combinations = first.length * second.length * third.length;
  let payoutTotal = 0;
  let hitCount = 0;
  let goldSevenCount = 0;

  for (const a of first) {
    for (const b of second) {
      for (const c of third) {
        const result = evaluateCenterLine([a, b, c], 1);
        payoutTotal += result.payout;
        if (result.payout > 0) hitCount += 1;
        if (a === 'gold7' && b === 'gold7' && c === 'gold7') goldSevenCount += 1;
      }
    }
  }

  return {
    combinations,
    probabilityTotal: 1,
    rtp: payoutTotal / combinations,
    hitFrequency: hitCount / combinations,
    goldSevenProbability: goldSevenCount / combinations,
  };
}
