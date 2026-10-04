export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
export type Rank = '2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'10'|'J'|'Q'|'K'|'A';
export interface Card { rank: Rank; suit: Suit }
export interface HandValue { total: number; soft: boolean; bust: boolean; blackjack: boolean }

export function cardValue(card: Card): number {
  if (card.rank === 'A') return 11;
  if (card.rank === 'J' || card.rank === 'Q' || card.rank === 'K') return 10;
  return Number(card.rank);
}

export function evaluateHand(cards: readonly Card[], options: { fromSplit?: boolean } = {}): HandValue {
  let total = 0;
  let softAces = 0;
  for (const card of cards) {
    total += cardValue(card);
    if (card.rank === 'A') softAces += 1;
  }
  while (total > 21 && softAces > 0) {
    total -= 10;
    softAces -= 1;
  }
  return {
    total,
    soft: softAces > 0,
    bust: total > 21,
    blackjack: cards.length === 2 && total === 21 && !options.fromSplit,
  };
}

export function dealerShouldHit(cards: readonly Card[]): boolean {
  return evaluateHand(cards).total < 17;
}

export function canHit(_cards: readonly Card[], _splitAces: boolean): boolean {
  return false;
}

export function canDouble(
  _cards: readonly Card[],
  _options: { splitAces: boolean; bankroll: number; wager: number },
): boolean {
  return false;
}

export function canSurrender(
  _cards: readonly Card[],
  _options: { fromSplit: boolean; dealerChecked: boolean },
): boolean {
  return false;
}

export function canSplit(cards: readonly Card[], alreadySplit: boolean): boolean {
  return !alreadySplit && cards.length === 2 && cardValue(cards[0]) === cardValue(cards[1]);
}

export function naturalBlackjackPayout(wager: number): number {
  return wager + wager * 1.5;
}

export function insurancePayout(wager: number, dealerHasBlackjack: boolean): number {
  return dealerHasBlackjack ? wager * 3 : 0;
}

export function surrenderReturn(wager: number): number {
  return wager / 2;
}

export type HandOutcome = 'blackjack' | 'win' | 'push' | 'loss' | 'bust';

export function settleHand(player: readonly Card[], dealer: readonly Card[], fromSplit = false): HandOutcome {
  const p = evaluateHand(player, { fromSplit });
  const d = evaluateHand(dealer);
  if (p.bust) return 'bust';
  if (p.blackjack && !d.blackjack) return 'blackjack';
  if (d.blackjack && !p.blackjack) return 'loss';
  if (p.blackjack && d.blackjack) return 'push';
  if (d.bust || p.total > d.total) return 'win';
  if (p.total === d.total) return 'push';
  return 'loss';
}
