import { describe, expect, it } from 'vitest';
import {
  canDouble,
  canHit,
  canSplit,
  canSurrender,
  dealerShouldHit,
  evaluateHand,
  insurancePayout,
  naturalBlackjackPayout,
  surrenderReturn,
  type Card,
} from '../../src/games/royal-palace-blackjack/engine';

const c = (rank: Card['rank'], suit: Card['suit'] = 'spades'): Card => ({ rank, suit });

describe('Royal Palace Blackjack rules', () => {
  it('scores aces as 11 or 1 without busting when possible', () => {
    expect(evaluateHand([c('A'), c('6')])).toMatchObject({ total: 17, soft: true, bust: false });
    expect(evaluateHand([c('A'), c('6'), c('10')])).toMatchObject({ total: 17, soft: false, bust: false });
    expect(evaluateHand([c('A'), c('A'), c('9')])).toMatchObject({ total: 21, soft: true, bust: false });
  });

  it('distinguishes a natural blackjack from a split two-card 21', () => {
    expect(evaluateHand([c('A'), c('K')], { fromSplit: false }).blackjack).toBe(true);
    expect(evaluateHand([c('A'), c('K')], { fromSplit: true }).blackjack).toBe(false);
  });

  it('stands on soft 17 for the fixed S17 table', () => {
    expect(dealerShouldHit([c('A'), c('6')])).toBe(false);
    expect(dealerShouldHit([c('A'), c('5')])).toBe(true);
    expect(dealerShouldHit([c('10'), c('6')])).toBe(true);
  });

  it('allows equal-value initial cards to split but not an already split hand', () => {
    expect(canSplit([c('K'), c('10')], false)).toBe(true);
    expect(canSplit([c('8'), c('8')], false)).toBe(true);
    expect(canSplit([c('8'), c('8')], true)).toBe(false);
  });

  it('keeps action legality in the rules engine', () => {
    expect(canHit([c('10'), c('A')], false)).toBe(false);
    expect(canHit([c('5'), c('6')], true)).toBe(false);
    expect(canHit([c('5'), c('6')], false)).toBe(true);

    expect(canDouble([c('5'), c('6')], { splitAces: false, bankroll: 10, wager: 10 })).toBe(true);
    expect(canDouble([c('A'), c('A')], { splitAces: true, bankroll: 10, wager: 10 })).toBe(false);
    expect(canDouble([c('5'), c('6')], { splitAces: false, bankroll: 5, wager: 10 })).toBe(false);

    expect(canSurrender([c('10'), c('6')], { fromSplit: false, dealerChecked: true })).toBe(true);
    expect(canSurrender([c('10'), c('6')], { fromSplit: true, dealerChecked: true })).toBe(false);
    expect(canSurrender([c('10'), c('6')], { fromSplit: false, dealerChecked: false })).toBe(false);
  });

  it('uses exact table payouts', () => {
    expect(naturalBlackjackPayout(100)).toBe(250);
    expect(insurancePayout(50, true)).toBe(150);
    expect(insurancePayout(2.5, true)).toBe(7.5);
    expect(insurancePayout(50, false)).toBe(0);
    expect(surrenderReturn(100)).toBe(50);
    expect(surrenderReturn(5)).toBe(2.5);
  });
});
