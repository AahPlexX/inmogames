import { useEffect, useMemo, useState } from 'react';
import { canSplit, cardValue, dealerShouldHit, evaluateHand, settleHand, type Card } from './engine';
import { advise } from './strategy';
import { loadSave, resetSave, saveGame, DEFAULT_SAVE, type BlackjackSave } from './storage';
import { needsShuffle, shuffledShoe } from './shoe';
import './royal-palace-blackjack.css';

type Phase='betting'|'player'|'dealer'|'settled';
interface Hand { cards:Card[]; wager:number; fromSplit:boolean; splitAces:boolean; doubled:boolean; surrendered:boolean }
const chips=[5,25,100,500,1000];
const suit:Record<Card['suit'],string>={spades:'♠',hearts:'♥',diamonds:'♦',clubs:'♣'};
const money=(n:number)=>Math.round(n).toLocaleString();
const freshHand=():Hand=>({cards:[],wager:0,fromSplit:false,splitAces:false,doubled:false,surrendered:false});

export default function RoyalPalaceBlackjackWorkspace(){
 const loaded=useMemo(()=>loadSave(typeof window==='undefined'?null:window.localStorage),[]);
 const [save,setSave]=useState<BlackjackSave>(loaded.value);
 const [persistent,setPersistent]=useState(loaded.persistent);
 const [phase,setPhase]=useState<Phase>('betting');
 const [bet,setBet]=useState(0); const [betStack,setBetStack]=useState<number[]>([]);
 const [shoe,setShoe]=useState<Card[]>(()=>shuffledShoe());
 const [dealer,setDealer]=useState<Card[]>([]); const [holeHidden,setHoleHidden]=useState(true);
 const [hands,setHands]=useState<Hand[]>([freshHand()]); const [active,setActive]=useState(0);
 const [status,setStatus]=useState('Place virtual chips to begin.'); const [insurance,setInsurance]=useState(false);
 const current=hands[active]; const value=current?evaluateHand(current.cards,{fromSplit:current.fromSplit}):null;
 const dealerUp=dealer[0]; const remaining=shoe.length; const shoePct=Math.round(remaining/312*100);

 useEffect(()=>{if(phase!=='betting')return;const ok=saveGame(window.localStorage,save);if(!ok)setPersistent(false)},[save,phase]);

 function drawFrom(cards:Card[]):[Card,Card[]]{const copy=[...cards];const card=copy.pop();if(!card)throw new Error('Shoe unexpectedly empty');return[card,copy]}
 function addChip(v:number){if(phase!=='betting'||v>save.bankroll)return;setSave(s=>({...s,bankroll:s.bankroll-v}));setBet(x=>x+v);setBetStack(x=>[...x,v])}
 function undo(){const v=betStack.at(-1);if(!v)return;setBetStack(x=>x.slice(0,-1));setBet(x=>x-v);setSave(s=>({...s,bankroll:s.bankroll+v}))}
 function clear(){setSave(s=>({...s,bankroll:s.bankroll+bet}));setBet(0);setBetStack([])}
 function setExactBet(amount:number){const available=save.bankroll+bet;const next=Math.min(available,Math.max(0,amount));setSave(s=>({...s,bankroll:available-next}));setBet(next);setBetStack([])}
 function deal(){
  if(phase!=='betting'||bet<5)return;
  let deck=needsShuffle(shoe.length)?shuffledShoe():[...shoe];let p1,p2,d1,d2;
  [p1,deck]=drawFrom(deck);[d1,deck]=drawFrom(deck);[p2,deck]=drawFrom(deck);[d2,deck]=drawFrom(deck);
  const hand={...freshHand(),cards:[p1,p2],wager:bet};setShoe(deck);setHands([hand]);setDealer([d1,d2]);setHoleHidden(true);setActive(0);
  setSave(s=>({...s,lastBet:bet}));setBet(0);setBetStack([]);
  const pv=evaluateHand(hand.cards);const dv=evaluateHand([d1,d2]);
  if(d1.rank==='A'){setInsurance(true);setPhase('player');setStatus('Dealer shows an Ace. Insurance is available before play.');return}
  if(cardValue(d1)===10&&dv.blackjack){setHoleHidden(false);finishRound([hand],[d1,d2],deck);return}
  if(pv.blackjack){setHoleHidden(false);finishRound([hand],[d1,d2],deck);return}
  setPhase('player');setStatus('Your move.');
 }
 function declineInsurance(){setInsurance(false);const d=evaluateHand(dealer);if(d.blackjack){setHoleHidden(false);finishRound(hands,dealer,shoe)}else setStatus('No insurance. Your move.')}
 function takeInsurance(){
  const cost=Math.floor(hands[0].wager/2);if(save.bankroll<cost)return;setInsurance(false);
  const d=evaluateHand(dealer);setSave(s=>({...s,bankroll:s.bankroll-cost+(d.blackjack?cost*3:0),sessionNet:s.sessionNet-cost+(d.blackjack?cost*3:0)}));
  if(d.blackjack){setHoleHidden(false);finishRound(hands,dealer,shoe)}else setStatus('Insurance lost. Your move.');
 }
 function mutateActive(fn:(h:Hand)=>Hand){setHands(list=>list.map((h,i)=>i===active?fn(h):h))}
 function hit(){
  if(phase!=='player'||!current)return;let card,deck;[card,deck]=drawFrom(shoe);setShoe(deck);const next={...current,cards:[...current.cards,card]};mutateActive(()=>next);
  const v=evaluateHand(next.cards,{fromSplit:next.fromSplit});if(v.bust||v.total===21){setStatus(v.bust?`Hand ${active+1} busts with ${v.total}.`:`Hand ${active+1} has 21.`);advance({...next})}
 }
 function stand(){if(phase==='player')advance(current)}
 function advance(updated:Hand){
  const list=hands.map((h,i)=>i===active?updated:h);
  if(active<list.length-1){setHands(list);setActive(active+1);setStatus(`Playing hand ${active+2}.`);return}
  dealerPlay(list);
 }
 function doubleDown(){
  if(!current||current.cards.length!==2||save.bankroll<current.wager)return;setSave(s=>({...s,bankroll:s.bankroll-current.wager}));
  let card,deck;[card,deck]=drawFrom(shoe);setShoe(deck);const next={...current,wager:current.wager*2,doubled:true,cards:[...current.cards,card]};mutateActive(()=>next);advance(next);
 }
 function split(){
  if(!current||!dealerUp||!canSplit(current.cards,current.fromSplit)||save.bankroll<current.wager)return;
  setSave(s=>({...s,bankroll:s.bankroll-current.wager}));let deck=[...shoe],a,b;[a,deck]=drawFrom(deck);[b,deck]=drawFrom(deck);setShoe(deck);
  const aces=current.cards[0].rank==='A';const next:[Hand,Hand]=[
   {...freshHand(),wager:current.wager,fromSplit:true,splitAces:aces,cards:[current.cards[0],a]},
   {...freshHand(),wager:current.wager,fromSplit:true,splitAces:aces,cards:[current.cards[1],b]},
  ];setHands(next);setActive(0);setStatus(aces?'Split Aces receive one card each.':'Playing split hand 1.');
  if(aces)dealerPlay(next);
 }
 function surrender(){if(!current||current.fromSplit||current.cards.length!==2)return;const next={...current,surrendered:true};setSave(s=>({...s,bankroll:s.bankroll+current.wager/2,sessionNet:s.sessionNet-current.wager/2,stats:{...s.stats,losses:s.stats.losses+1}}));setHoleHidden(false);setHands([next]);setPhase('settled');setStatus('Surrendered. Half the wager returned.')}
 function dealerPlay(playerHands:Hand[]){
  setPhase('dealer');setHoleHidden(false);let deck=[...shoe],d=[...dealer];
  if(playerHands.some(h=>!evaluateHand(h.cards,{fromSplit:h.fromSplit}).bust)){while(dealerShouldHit(d)){let card;[card,deck]=drawFrom(deck);d.push(card)}}
  setDealer(d);setShoe(deck);finishRound(playerHands,d,deck);
 }
 function finishRound(playerHands:Hand[],dealerCards:Card[],deck:Card[]){
  let returned=0,w=0,l=0,p=0;let net=0;
  for(const h of playerHands){if(h.surrendered)continue;const outcome=settleHand(h.cards,dealerCards,h.fromSplit);
   if(outcome==='blackjack'){returned+=h.wager*2.5;net+=h.wager*1.5;w++}else if(outcome==='win'){returned+=h.wager*2;net+=h.wager;w++}else if(outcome==='push'){returned+=h.wager;p++}else{net-=h.wager;l++}}
  setSave(s=>({...s,bankroll:s.bankroll+returned,sessionNet:s.sessionNet+net,stats:{wins:s.stats.wins+w,losses:s.stats.losses+l,pushes:s.stats.pushes+p}}));
  setPhase('settled');setShoe(deck);setStatus(net>0?`Round won: +${money(net)} virtual credits.`:net<0?`Round result: −${money(Math.abs(net))} virtual credits.`:'Round is a push.');
 }
 function nextRound(){setDealer([]);setHands([freshHand()]);setActive(0);setHoleHidden(true);setInsurance(false);setPhase('betting');setStatus('Place virtual chips for the next round.')}
 function resetAll(){resetSave(window.localStorage);setSave(structuredClone(DEFAULT_SAVE));setBet(0);setBetStack([]);setShoe(shuffledShoe());setDealer([]);setHands([freshHand()]);setActive(0);setPhase('betting');setPersistent(true);setStatus('Saved game reset. You have 1,000 virtual credits.')}
 const canD=phase==='player'&&current?.cards.length===2&&!current.splitAces&&save.bankroll>=current.wager;
 const canS=phase==='player'&&!!current&&canSplit(current.cards,current.fromSplit)&&save.bankroll>=current.wager;
 const canR=phase==='player'&&!!current&&current.cards.length===2&&!current.fromSplit&&!insurance;
 const advice=save.preferences.hints&&phase==='player'&&dealerUp&&current&&!insurance?advise({player:current.cards,dealerUp,canDouble:!!canD,canSplit:!!canS,canSurrender:!!canR}):null;
 return <section className="rp" aria-label="Royal Palace Blackjack table">
  <div className="rp-top"><div><strong>♠ Royal Palace</strong><span>6 decks · S17 · 3:2 · DAS</span></div><div className="rp-stats"><span>Shoe <b>{shoePct}%</b></span><span><b>{save.stats.wins}</b> W · <b>{save.stats.losses}</b> L · <b>{save.stats.pushes}</b> P</span><span>Session <b>{save.sessionNet>=0?'+':''}{money(save.sessionNet)}</b></span></div></div>
  {!persistent&&<p className="rp-note" role="status">Browser storage is unavailable. This session still plays normally, but progress may not persist.</p>}
  <div className="rp-felt">
   <div className="rp-rules" aria-hidden="true">BLACKJACK PAYS 3 TO 2 · DEALER STANDS ON ALL 17</div>
   <HandView label="Dealer" cards={dealer} hiddenIndex={holeHidden?1:-1}/>
   <div className="rp-status" role="status" aria-live="polite">{status}</div>
   <div className="rp-hands">{hands.map((h,i)=><HandView key={i} label={hands.length>1?`Hand ${i+1}`:'Player'} cards={h.cards} active={phase==='player'&&i===active} fromSplit={h.fromSplit}/>)}</div>
   {advice&&<aside className="rp-advice"><b>Strategy: {advice.action}</b><span>{advice.reason} Recommendations improve decisions; they do not guarantee a win.</span></aside>}
  </div>
  <div className="rp-console">
   <div className="rp-bank"><span>Bank <b>{money(save.bankroll)}</b></span><span>Bet <b>{money(bet)}</b></span><span>Cards <b>{remaining}</b></span></div>
   {phase==='betting'&&<div className="rp-betting" aria-label="Bet controls"><div className="rp-chips">{chips.map(v=><button key={v} disabled={v>save.bankroll} onClick={()=>addChip(v)} aria-label={`Add ${v} virtual-credit chip`}>{v>=1000?'1K':v}</button>)}</div><div className="rp-betmods"><button onClick={undo} disabled={!betStack.length}>Undo</button><button onClick={clear} disabled={!bet}>Clear</button><button onClick={()=>setExactBet(save.lastBet)} disabled={!save.lastBet||save.lastBet>save.bankroll+bet}>Re-bet</button><button onClick={()=>setExactBet(bet*2)} disabled={!bet||bet>save.bankroll}>2×</button><button onClick={()=>setExactBet(save.bankroll+bet)} disabled={!save.bankroll}>All in</button></div></div>}
   <div className="rp-actions">
    {phase==='betting'&&<button className="primary" disabled={bet<5} onClick={deal}>Deal</button>}
    {phase==='player'&&!insurance&&<><button disabled={!!current?.splitAces||!!value?.bust} onClick={hit}>Hit</button><button onClick={stand}>Stand</button><button disabled={!canD} onClick={doubleDown}>Double</button><button disabled={!canS} onClick={split}>Split</button><button disabled={!canR} onClick={surrender}>Surrender</button></>}
    {phase==='settled'&&<button className="primary" onClick={nextRound}>Next round</button>}
   </div>
   <div className="rp-prefs"><button aria-pressed={save.preferences.hints} onClick={()=>setSave(s=>({...s,preferences:{...s.preferences,hints:!s.preferences.hints}}))}>Strategy hints {save.preferences.hints?'on':'off'}</button><button onClick={resetAll}>Reset saved game</button></div>
  </div>
  {insurance&&<div className="rp-modal" role="dialog" aria-modal="true" aria-labelledby="insurance-title"><div><h2 id="insurance-title">Dealer shows an Ace</h2><p>Insurance costs {money(Math.floor(hands[0].wager/2))} virtual credits and pays 2:1 profit if the dealer has blackjack.</p><div><button disabled={save.bankroll<Math.floor(hands[0].wager/2)} onClick={takeInsurance}>Take insurance</button><button className="primary" onClick={declineInsurance}>No insurance</button></div></div></div>}
 </section>
}
function HandView({label,cards,hiddenIndex=-1,active=false,fromSplit=false}:{label:string;cards:Card[];hiddenIndex?:number;active?:boolean;fromSplit?:boolean}){
 const shown=cards.filter((_,i)=>i!==hiddenIndex);const v=evaluateHand(shown,{fromSplit});
 return <div className={`rp-hand ${active?'active':''}`}><div className="rp-handlabel"><b>{label}</b>{cards.length>0&&<span>{hiddenIndex>=0?`Showing ${v.total}`:v.bust?`Bust ${v.total}`:v.blackjack?'Blackjack':v.soft?`Soft ${v.total}`:v.total}</span>}</div><div className="rp-cards">{cards.map((card,i)=>i===hiddenIndex?<div className="rp-card back" key={i}><span>Hidden card</span></div>:<div className={`rp-card ${card.suit==='hearts'||card.suit==='diamonds'?'red':''}`} key={i} aria-label={`${card.rank} of ${card.suit}`}><b>{card.rank}</b><span aria-hidden="true">{suit[card.suit]}</span></div>)}</div></div>
}
