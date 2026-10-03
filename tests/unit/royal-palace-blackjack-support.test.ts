import { describe, expect, it } from 'vitest';
import { createShoe, needsShuffle, shuffleSeeded } from '../../src/games/royal-palace-blackjack/shoe';
import { DEFAULT_SAVE, loadSave, resetSave, saveGame, STORAGE_KEY, type StorageLike } from '../../src/games/royal-palace-blackjack/storage';
import { advise } from '../../src/games/royal-palace-blackjack/strategy';
import type { Card } from '../../src/games/royal-palace-blackjack/engine';

const c=(rank:Card['rank'],suit:Card['suit']='spades'):Card=>({rank,suit});

describe('Royal Palace shoe',()=>{
 it('builds six complete decks and shuffles deterministically for tests',()=>{
  const shoe=createShoe(); expect(shoe).toHaveLength(312);
  expect(shoe.filter(x=>x.rank==='A'&&x.suit==='spades')).toHaveLength(6);
  expect(shuffleSeeded(shoe,44)).toEqual(shuffleSeeded(shoe,44));
 });
 it('cuts after 75 percent penetration',()=>{expect(needsShuffle(79)).toBe(false);expect(needsShuffle(78)).toBe(true)});
});

describe('Royal Palace persistence',()=>{
 const memory=():StorageLike&{data:Map<string,string>}=>{const data=new Map<string,string>();return{data,getItem:k=>data.get(k)??null,setItem:(k,v)=>{data.set(k,v)},removeItem:k=>{data.delete(k)}}};
 it('uses defaults for missing and malformed data',()=>{const s=memory();expect(loadSave(s).value).toEqual(DEFAULT_SAVE);s.data.set(STORAGE_KEY,'{bad');expect(loadSave(s).persistent).toBe(false)});
 it('round trips and resets only its own key',()=>{const s=memory();const v={...DEFAULT_SAVE,bankroll:725};expect(saveGame(s,v)).toBe(true);expect(loadSave(s).value.bankroll).toBe(725);expect(resetSave(s)).toBe(true);expect(s.data.has(STORAGE_KEY)).toBe(false)});
 it('survives unavailable storage',()=>{expect(loadSave(null).persistent).toBe(false);expect(saveGame(null,DEFAULT_SAVE)).toBe(false)});
});

describe('Royal Palace strategy',()=>{
 it('covers representative pair, soft, hard and surrender choices',()=>{
  expect(advise({player:[c('8'),c('8')],dealerUp:c('10'),canDouble:true,canSplit:true,canSurrender:true}).action).toBe('surrender');
  expect(advise({player:[c('A'),c('7')],dealerUp:c('6'),canDouble:true,canSplit:false,canSurrender:false}).action).toBe('double');
  expect(advise({player:[c('10'),c('6')],dealerUp:c('6'),canDouble:false,canSplit:false,canSurrender:false}).action).toBe('stand');
  expect(advise({player:[c('10'),c('6')],dealerUp:c('10'),canDouble:false,canSplit:false,canSurrender:false}).action).toBe('hit');
 });
});
