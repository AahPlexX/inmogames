import { cardValue, evaluateHand, type Card } from './engine';
export type PlayerAction = 'hit'|'stand'|'double'|'split'|'surrender';
export interface StrategyContext { player: readonly Card[]; dealerUp: Card; canDouble: boolean; canSplit: boolean; canSurrender: boolean }
export interface StrategyAdvice { action: PlayerAction; reason: string }

export function advise(context: StrategyContext): StrategyAdvice {
  const { player, dealerUp } = context;
  const value = evaluateHand(player);
  const up = cardValue(dealerUp);
  if (context.canSplit && player.length === 2 && cardValue(player[0]) === cardValue(player[1])) {
    const pair = cardValue(player[0]);
    if (pair === 11 || pair === 8 || (pair === 9 && ![7,10,11].includes(up)) || ([2,3,7].includes(pair) && up <= 7) || (pair === 6 && up <= 6) || (pair === 4 && [5,6].includes(up))) {
      return { action: 'split', reason: 'Splitting this pair improves the available play against the dealer up-card.' };
    }
  }
  if (context.canSurrender && player.length === 2 && !value.soft && ((value.total === 16 && up >= 9) || (value.total === 15 && up === 10))) {
    return { action: 'surrender', reason: 'Late surrender limits the loss against this strong dealer up-card.' };
  }
  if (value.soft) {
    if (value.total >= 19) return { action: 'stand', reason: 'This soft total is already strong.' };
    if (value.total === 18) {
      if (context.canDouble && up >= 3 && up <= 6) return { action: 'double', reason: 'Soft 18 is a profitable double against a weak dealer card.' };
      return { action: up <= 8 ? 'stand' : 'hit', reason: up <= 8 ? 'Soft 18 is strong enough to stand here.' : 'A strong dealer up-card makes improving soft 18 preferable.' };
    }
    const double = context.canDouble && ((value.total >= 15 && up >= 4 && up <= 6) || (value.total <= 14 && up >= 5 && up <= 6));
    return double ? { action: 'double', reason: 'The dealer weakness makes this soft hand a double.' } : { action: 'hit', reason: 'A soft hand can improve without immediately risking a hard bust.' };
  }
  if (value.total >= 17) return { action: 'stand', reason: 'Hard 17 or better stands on this S17 table.' };
  if (value.total >= 13) return { action: up <= 6 ? 'stand' : 'hit', reason: up <= 6 ? 'Let the dealer draw against a weak up-card.' : 'Improve the hand against a strong dealer up-card.' };
  if (value.total === 12) return { action: up >= 4 && up <= 6 ? 'stand' : 'hit', reason: up >= 4 && up <= 6 ? 'Dealer 4–6 is weak enough to stand against.' : 'Hard 12 needs improvement here.' };
  if (context.canDouble && value.total === 11 && up !== 11) return { action: 'double', reason: 'Hard 11 is a strong double against this up-card.' };
  if (context.canDouble && value.total === 10 && up <= 9) return { action: 'double', reason: 'Hard 10 doubles against dealer 9 or lower.' };
  if (context.canDouble && value.total === 9 && up >= 3 && up <= 6) return { action: 'double', reason: 'Hard 9 doubles against dealer 3–6.' };
  return { action: 'hit', reason: 'The current hard total is best improved with another card.' };
}
