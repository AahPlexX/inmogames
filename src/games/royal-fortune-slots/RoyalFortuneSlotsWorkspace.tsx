import { useMemo, useState } from 'react';
import { SaveStatus } from '../../platform/SaveStatus';
import { useGameSave } from '../../platform/PlatformProvider';
import { CONFIGURED_TOTAL_RETURN_RATIO } from './audit';
import { evaluateSpin, featureAfterBaseSpin, featureAfterFreeSpin, type SpinEvaluation } from './engine';
import { NORMAL_PAYTABLE, WAGERS, type RoyalFortuneWager } from './paytable';
import { DEFAULT_SAVE, type RoyalFortuneSave } from './storage';
import { restorePracticeCredits, royalFortuneSaveDefinition, settleRoyalFortuneSpin } from './persistence';
import { PAYLINES, spinReels, type ReelWindow, type RoyalFortuneSymbol } from './reels';
import { playRoyalFortuneCue } from './audio';
import './royal-fortune-slots.css';

const initialWindow = spinReels({ int: () => 0 }).window;
const glyphs: Record<RoyalFortuneSymbol, string> = {
  Crown: '♛', Ruby: '♦', Emerald: '◆', Chalice: '♕', Bell: '◉', A: 'A', K: 'K', Q: 'Q', J: 'J', Wild: 'W', Scatter: '✦',
};
const format = (value: number) => value.toLocaleString();
const configuredReturnPercent = (CONFIGURED_TOTAL_RETURN_RATIO * 100).toFixed(2);

function netForResult(evaluation: SpinEvaluation): number {
  return evaluation.totalPayout - (evaluation.mode === 'base' ? evaluation.wager : 0);
}

function resultHeadline(evaluation: SpinEvaluation): string {
  if (evaluation.mode === 'free') return `Free-spin award ${format(evaluation.totalPayout)} credits`;
  const net = netForResult(evaluation);
  return `Return ${format(evaluation.totalPayout)} · Net ${net >= 0 ? '+' : '−'}${format(Math.abs(net))}`;
}

function isCelebratoryResult(evaluation: SpinEvaluation): boolean {
  if (evaluation.freeSpinsAwarded > 0) return true;
  return evaluation.mode === 'free' ? evaluation.totalPayout > 0 : netForResult(evaluation) > 0;
}

export default function RoyalFortuneSlotsWorkspace() {
  const progress = useGameSave(royalFortuneSaveDefinition);
  return <><SaveStatus {...progress}/><RoyalFortuneMachine key={`${progress.scope}:${progress.ready}:${progress.revision}`} initial={progress.state} persist={progress.save} reset={progress.reset}/></>;
}

function RoyalFortuneMachine({ initial, persist, reset }: { initial: RoyalFortuneSave; persist: (state: RoyalFortuneSave) => void; reset: () => void }) {
  const [save, setSave] = useState(() => structuredClone(initial));
  const [reels, setReels] = useState<ReelWindow>(initialWindow);
  const [result, setResult] = useState<SpinEvaluation | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [status, setStatus] = useState(initial.feature ? `${initial.feature.remaining} free spins remain.` : 'Choose a wager and spin when you are ready.');
  const [resetConfirm, setResetConfirm] = useState(false);
  const celebrateResult = result ? isCelebratoryResult(result) : false;
  const winningCells = useMemo(() => {
    const cells = new Set<string>();
    for (const win of result?.lineWins ?? []) for (const cell of win.cells) cells.add(`${cell.reel}:${cell.row}`);
    return cells;
  }, [result]);

  function commit(next: RoyalFortuneSave) {
    setSave(next);
    persist(next);
  }

  function chooseWager(wager: RoyalFortuneWager) {
    if (spinning || save.feature) return;
    commit({ ...save, selectedWager: wager });
    setStatus(`Wager set to ${wager} virtual credits.`);
  }

  function describe(evaluation: SpinEvaluation, next: RoyalFortuneSave): string {
    const pieces: string[] = [];
    if (evaluation.mode === 'free') {
      pieces.push(evaluation.totalPayout > 0 ? `Awarded ${format(evaluation.totalPayout)} virtual credits` : 'No credit award on this free spin');
    } else {
      const net = netForResult(evaluation);
      if (net > 0) pieces.push(`Returned ${format(evaluation.totalPayout)} virtual credits · net +${format(net)}`);
      else if (net === 0) pieces.push(evaluation.totalPayout > 0 ? `Returned ${format(evaluation.totalPayout)} virtual credits · wager recovered` : `No return · net −${format(evaluation.wager)}`);
      else if (evaluation.totalPayout > 0) pieces.push(`Returned ${format(evaluation.totalPayout)} virtual credits · net −${format(Math.abs(net))}`);
      else pieces.push(`No return · net −${format(Math.abs(net))}`);
    }
    if (evaluation.lineWins.length) pieces.push(`${evaluation.lineWins.length} paying ${evaluation.lineWins.length === 1 ? 'line' : 'lines'}`);
    if (evaluation.scatterCount) pieces.push(`${evaluation.scatterCount} Scatter${evaluation.scatterCount === 1 ? '' : 's'}`);
    if (evaluation.freeSpinsAwarded) pieces.push(`${evaluation.freeSpinsAwarded} free spins added`);
    if (next.feature) pieces.push(`${next.feature.remaining} free spins remain at ×${next.feature.multiplier}`);
    return `${pieces.join(' · ')}.`;
  }

  function spin() {
    if (spinning) return;
    const feature = save.feature;
    const freeSpin = feature !== null;
    const wager = feature?.wager ?? save.selectedWager;
    if (!freeSpin && save.bankroll < wager) {
      setStatus('Your practice bankroll is below the selected wager. Choose a smaller wager or restore practice credits.');
      return;
    }

    let nextReels: ReelWindow;
    let evaluation: SpinEvaluation;
    let nextFeature;
    let nextSave: RoyalFortuneSave;
    try {
      nextReels = spinReels().window;
      evaluation = evaluateSpin(nextReels, wager, freeSpin ? 'free' : 'base', feature?.multiplier ?? 1);
      nextFeature = freeSpin ? featureAfterFreeSpin(feature, evaluation) : featureAfterBaseSpin(evaluation);
      nextSave = settleRoyalFortuneSpin(save, evaluation, !freeSpin, nextFeature);
    } catch {
      setStatus('The random outcome source was unavailable. No virtual credits were deducted. Try the spin again.');
      return;
    }

    playRoyalFortuneCue('spin', save.preferences.sound);
    commit(nextSave);
    setReels(nextReels);
    setResult(evaluation);
    setSpinning(true);
    setStatus(freeSpin ? 'Free spin resolving…' : 'Reels spinning…');
    const reduceMotion = save.preferences.reducedEffects || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.setTimeout(() => {
      setSpinning(false);
      setStatus(describe(evaluation, nextSave));
      const positive = isCelebratoryResult(evaluation);
      playRoyalFortuneCue(evaluation.freeSpinsAwarded ? 'feature' : positive ? 'win' : 'stop', save.preferences.sound);
    }, reduceMotion ? 0 : 560);
  }

  function togglePreference(name: keyof RoyalFortuneSave['preferences']) {
    const next = { ...save, preferences: { ...save.preferences, [name]: !save.preferences[name] } };
    commit(next);
  }

  function restoreCredits() {
    const next = restorePracticeCredits(save);
    if (!next) return;
    commit(next);
    setStatus('Practice bankroll restored to 2,500. Your statistics and preferences were kept.');
  }

  function resetAll() {
    const next = structuredClone(DEFAULT_SAVE);
    reset();
    setSave(next);
    setReels(initialWindow);
    setResult(null);
    setSpinning(false);
    setResetConfirm(false);
    setStatus('Royal Fortune reset. You have 2,500 virtual credits.');
  }

  const activeWager = save.feature?.wager ?? save.selectedWager;
  const spinLabel = save.feature ? `Play free spin · ${save.feature.remaining} remaining` : `Spin · ${activeWager} credits`;

  return <section className="rf" data-spinning={spinning || undefined} data-reduced={save.preferences.reducedEffects || undefined} aria-label="Royal Fortune Slots machine">
    <header className="rf-marquee">
      <div><span className="rf-kicker">Twenty-line video slot</span><strong>Royal Fortune</strong><small>Virtual credits only · fixed reels · player-paced free spins</small></div>
      {save.feature && <div className="rf-feature" role="status"><b>Free spins</b><span>{save.feature.remaining} remaining</span><span>Line multiplier ×{save.feature.multiplier}</span></div>}
    </header>

    <div className="rf-meter" aria-label="Session information">
      <span>Bank <b>{format(save.bankroll)}</b></span>
      <span>Wager <b>{activeWager}</b></span>
      <span>Net <b>{save.net >= 0 ? '+' : ''}{format(save.net)}</b></span>
      <span>Best <b>{format(save.largestWin)}</b></span>
    </div>

    <div className="rf-stage">
      <div className="rf-reels" aria-label="Five reels, three rows">
        {reels.map((column, reelIndex) => <div className="rf-reel" key={reelIndex} aria-label={`Reel ${reelIndex + 1}`}>
          {column.map((symbol, rowIndex) => <div
            className={`rf-symbol rf-symbol--${symbol.toLowerCase()}${celebrateResult && winningCells.has(`${reelIndex}:${rowIndex}`) ? ' is-win' : ''}`}
            key={`${reelIndex}-${rowIndex}-${symbol}`}
            role="img"
            aria-label={`${symbol}, reel ${reelIndex + 1}, row ${rowIndex + 1}`}
          ><span aria-hidden="true">{glyphs[symbol]}</span><small aria-hidden="true">{symbol}</small></div>)}
        </div>)}
      </div>
      <div className="rf-payline-rail" aria-hidden="true"><span>20</span><span>LINES</span></div>
    </div>

    <div className="rf-result" role="status" aria-live="polite" aria-atomic="true">
      <strong>{result ? resultHeadline(result) : 'Ready'}</strong>
      <span>{status}</span>
      {result?.lineWins.length ? <div className="rf-linewins" aria-label="Paying lines">{result.lineWins.slice(0, 6).map((win) => <span key={win.lineIndex}>Line {win.lineIndex + 1}: {win.symbol} ×{win.count} · +{format(win.payout)}</span>)}</div> : null}
    </div>

    <div className="rf-controls">
      <fieldset className="rf-wagers" disabled={spinning || save.feature !== null}>
        <legend>Total wager</legend>
        {WAGERS.map((wager) => <button type="button" className={save.selectedWager === wager ? 'is-selected' : ''} aria-pressed={save.selectedWager === wager} onClick={() => chooseWager(wager)} key={wager}>{wager}</button>)}
      </fieldset>
      <button className="rf-spin" type="button" onClick={spin} disabled={spinning || (!save.feature && save.bankroll < activeWager)}>{spinning ? 'Spinning…' : spinLabel}</button>
    </div>

    {!save.feature && save.bankroll < 5 && <div className="rf-recovery"><span>Your balance is below the 5-credit minimum.</span><button type="button" onClick={restoreCredits}>Restore 2,500 practice credits</button></div>}

    <div className="rf-secondary">
      <details>
        <summary>Paytable & rules</summary>
        <div className="rf-help">
          <p>All 20 paylines are active. Normal symbols pay from the leftmost reel across 3–5 consecutive reels. Wild substitutes for every normal symbol; Scatter pays anywhere and never uses a payline.</p>
          <p>3 / 4 / 5 Scatters award 8 / 12 / 20 free spins. During free spins, each winning spin raises the line-win multiplier by one up to ×5. Three or more Scatters during free spins add five more spins.</p>
          <div className="rf-paytable" role="table" aria-label="Normal symbol paytable in units per five wager credits">
            {Object.entries(NORMAL_PAYTABLE).map(([symbol, awards]) => <div className="rf-payrow" role="row" key={symbol}><b role="cell">{symbol}</b><span role="cell">3: {awards[3]}</span><span role="cell">4: {awards[4]}</span><span role="cell">5: {awards[5]}</span></div>)}
          </div>
          <p className="rf-note">Paytable numbers are units per 5 wager credits. Example: at a 20-credit wager, multiply a listed line award by 4. Scatter awards are 1× / 4× / 20× the total wager for 3 / 4 / 5 Scatters.</p>
          <p className="rf-note">This fixed configuration has a mathematically derived long-run return of about {configuredReturnPercent}% of virtual credits wagered, including free-spin value. That is a simulated-game probability statistic, not a prediction of any spin or session.</p>
          <p className="rf-note">Outcomes use fixed source-controlled reel strips and do not change based on your bankroll, history, session length or choices.</p>
        </div>
      </details>
      <details>
        <summary>Preferences & saved game</summary>
        <div className="rf-settings">
          <button type="button" aria-pressed={save.preferences.sound} onClick={() => togglePreference('sound')}>Sound {save.preferences.sound ? 'on' : 'off'}</button>
          <button type="button" aria-pressed={save.preferences.reducedEffects} onClick={() => togglePreference('reducedEffects')}>Reduced effects {save.preferences.reducedEffects ? 'on' : 'off'}</button>
          {!resetConfirm ? <button type="button" className="rf-danger" onClick={() => setResetConfirm(true)}>Reset saved game</button> : <div className="rf-confirm" role="group" aria-label="Confirm saved game reset"><span>Reset bankroll, statistics and preferences for Royal Fortune only?</span><button type="button" onClick={() => setResetConfirm(false)}>Cancel</button><button type="button" className="rf-danger" onClick={resetAll}>Confirm reset</button></div>}
        </div>
      </details>
    </div>
    <footer className="rf-foot">{PAYLINES.length} fixed paylines · {format(save.spins)} completed spins · {format(save.totalWagered)} credits wagered</footer>
  </section>;
}
