import { useState } from 'react';
import { useGameSave } from '../../platform/PlatformProvider';
import { SaveStatus } from '../../platform/SaveStatus';
import { spinClassicReels, type ClassicSpin } from './engine';
import { CLASSIC_WAGERS, SYMBOL_LABELS, type ClassicWager } from './paytable';
import { CLASSIC_REELS, projectWindow, type ClassicSymbol, type ReelWindow } from './reels';
import { luckySevenSaveDefinition, restorePracticeCredits, settleLuckySevenSpin } from './persistence';
import { DEFAULT_SAVE, type LuckySevenSave } from './storage';
import { playLuckySevenCue } from './audio';
import './lucky-seven-classic.css';

const glyphs: Record<ClassicSymbol, string> = {
  cherry: '●',
  lemon: '◆',
  orange: '●',
  plum: '◆',
  bell: '♟',
  bar: 'BAR',
  double_bar: '2×',
  triple_bar: '3×',
  red7: '7',
  gold7: '7',
};

const paytableRows = [
  ['Any 1 Cherry', '1×'], ['Any 2 Cherries', '3×'], ['Mixed BAR family', '5×'],
  ['3 Cherries / Lemons', '10×'], ['3 Oranges', '16×'], ['3 Plums', '24×'],
  ['3 BAR', '30×'], ['3 Double BAR', '60×'], ['3 Bells', '80×'],
  ['3 Triple BAR', '120×'], ['3 Red 7s', '200×'], ['3 Gold 7s', '500×'],
] as const;

function idleWindows(save: LuckySevenSave): ReelWindow[] {
  if (!save.lastResult) return CLASSIC_REELS.map((strip) => projectWindow(strip, 0));
  return CLASSIC_REELS.map((strip, reelIndex) => {
    const target = save.lastResult?.center[reelIndex];
    const stop = target ? strip.indexOf(target) : 0;
    return projectWindow(strip, stop >= 0 ? stop : 0);
  });
}

function plural(value: number, singular: string, pluralForm = `${singular}s`): string {
  return `${value.toLocaleString()} ${value === 1 ? singular : pluralForm}`;
}

export default function LuckySevenClassicWorkspace() {
  const progress = useGameSave(luckySevenSaveDefinition);
  return (
    <>
      <SaveStatus {...progress} />
      <LuckySevenMachine
        key={`${progress.scope}:${progress.ready}:${progress.revision}`}
        initial={progress.state}
        persist={progress.save}
        reset={progress.reset}
      />
    </>
  );
}

function LuckySevenMachine({
  initial,
  persist,
  reset,
}: {
  initial: LuckySevenSave;
  persist: (state: LuckySevenSave) => void;
  reset: () => void;
}) {
  const [save, setSave] = useState<LuckySevenSave>(() => structuredClone(initial));
  const [windows, setWindows] = useState<ReelWindow[]>(() => idleWindows(initial));
  const [spinning, setSpinning] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [status, setStatus] = useState(() => initial.lastResult
    ? `Last result: ${initial.lastResult.label} · ${plural(initial.lastResult.payout, 'virtual credit')}.`
    : 'Choose a wager, then pull the machine.');

  const selectedWager = save.selectedWager;
  const canSpin = !spinning && save.bankroll >= selectedWager;

  function commit(next: LuckySevenSave) {
    setSave(next);
    persist(next);
  }

  function chooseWager(wager: ClassicWager) {
    if (spinning || wager > save.bankroll) return;
    commit({ ...save, selectedWager: wager });
    setStatus(`Wager set to ${plural(wager, 'virtual credit')}.`);
  }

  function finishPresentation(spin: ClassicSpin, next: LuckySevenSave) {
    const result = next.lastResult;
    if (!result) return;
    const net = result.payout - result.wager;
    setWindows(spin.windows);
    setStatus(result.payout > 0
      ? `${result.label} · Returned ${plural(result.payout, 'virtual credit')} · net ${net >= 0 ? '+' : '−'}${Math.abs(net)}.`
      : `No win · ${plural(result.wager, 'virtual credit')} used.`);
    playLuckySevenCue(result.payout > 0 ? 'win' : 'stop', next.preferences.sound);

    const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.setTimeout(() => setSpinning(false), next.preferences.motion && !prefersReduced ? 520 : 0);
  }

  function spin() {
    if (!canSpin) return;
    setSpinning(true);
    setConfirmReset(false);

    try {
      const spinResult = spinClassicReels();
      const next = settleLuckySevenSpin(save, spinResult.center as [ClassicSymbol, ClassicSymbol, ClassicSymbol]);
      playLuckySevenCue('pull', save.preferences.sound);
      commit(next);
      finishPresentation(spinResult, next);
    } catch {
      setSpinning(false);
      setStatus('The random outcome source was unavailable. No virtual credits were deducted. Try again.');
    }
  }

  function restoreCredits() {
    const next = restorePracticeCredits(save);
    if (!next || spinning) return;
    commit(next);
    setStatus('Practice bankroll restored to 500 virtual credits. Your completed-spin record was kept.');
  }

  function toggleSound() {
    const next = { ...save, preferences: { ...save.preferences, sound: !save.preferences.sound } };
    commit(next);
    setStatus(next.preferences.sound ? 'Sound on. Procedural machine cues will play after your next action.' : 'Sound off. Gameplay remains fully signaled on screen.');
  }

  function toggleMotion() {
    const next = { ...save, preferences: { ...save.preferences, motion: !save.preferences.motion } };
    commit(next);
    setStatus(next.preferences.motion ? 'Cabinet motion on. System reduced-motion preferences still take priority.' : 'Cabinet motion off. Results update without reel travel.');
  }

  function resetSavedGame() {
    if (!confirmReset) {
      setConfirmReset(true);
      setStatus('Press Reset saved game again to clear Lucky Seven progress only.');
      return;
    }
    const next = structuredClone(DEFAULT_SAVE);
    reset();
    setSave(next);
    setWindows(idleWindows(next));
    setSpinning(false);
    setConfirmReset(false);
    setStatus('Lucky Seven saved progress reset. You have 500 virtual practice credits.');
  }

  return (
    <section className="lsc" data-spinning={spinning ? 'true' : 'false'} data-motion={save.preferences.motion ? 'on' : 'off'} aria-label="Lucky Seven Classic machine">
      <header className="lsc-marquee">
        <div>
          <span className="lsc-kicker">Mechanical practice machine</span>
          <h2>Lucky Seven Classic</h2>
          <p>Three reels. One center payline. Transparent virtual-credit odds.</p>
        </div>
        <span className="lsc-practice">Virtual credits only</span>
      </header>

      <div className="lsc-meter" aria-label="Game totals">
        <span>Bank <strong>{save.bankroll.toLocaleString()}</strong></span>
        <span>Wager <strong>{selectedWager.toLocaleString()}</strong></span>
        <span>Session net <strong>{save.net >= 0 ? '+' : '−'}{Math.abs(save.net).toLocaleString()}</strong></span>
        <span>Best <strong>{save.largestWin.toLocaleString()}</strong></span>
      </div>

      <div className="lsc-cabinet">
        <div className="lsc-payline-label"><span aria-hidden="true">◆</span><span>Center payline</span><span aria-hidden="true">◆</span></div>
        <div className="lsc-reels" aria-label="Three mechanical reels">
          {windows.map((windowSymbols, reelIndex) => (
            <div className="lsc-reel" key={reelIndex} aria-label={`Reel ${reelIndex + 1}`}>
              {windowSymbols.map((symbol, rowIndex) => (
                <div className="lsc-symbol" data-center={rowIndex === 1 ? 'true' : 'false'} key={`${reelIndex}-${rowIndex}-${symbol}`}>
                  <span className={`lsc-glyph lsc-glyph--${symbol}`} aria-hidden="true">{glyphs[symbol]}</span>
                  <span className="lsc-symbol-name">{SYMBOL_LABELS[symbol]}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="lsc-status" role="status" aria-live="polite" aria-atomic="true">{status}</div>
      </div>

      <div className="lsc-console">
        {save.bankroll < 1 ? (
          <div className="lsc-recovery">
            <p>Your practice balance is below the one-credit minimum. Restore the bankroll without clearing your record.</p>
            <button className="lsc-primary" type="button" onClick={restoreCredits}>Restore 500 practice credits</button>
          </div>
        ) : (
          <>
            <fieldset className="lsc-wagers" disabled={spinning}>
              <legend>Wager</legend>
              {CLASSIC_WAGERS.map((wager) => (
                <button
                  type="button"
                  key={wager}
                  aria-pressed={selectedWager === wager}
                  disabled={wager > save.bankroll}
                  onClick={() => chooseWager(wager)}
                >
                  {wager}
                </button>
              ))}
            </fieldset>
            <button className="lsc-spin lsc-primary" type="button" disabled={!canSpin} onClick={spin}>
              <span className="lsc-lever" aria-hidden="true">●</span>
              Pull / Spin · {selectedWager} {selectedWager === 1 ? 'credit' : 'credits'}
            </button>
          </>
        )}
      </div>

      <div className="lsc-disclosures">
        <details>
          <summary>Paytable &amp; rules</summary>
          <div className="lsc-help">
            <p>Only the center row pays. Cherries pay first; otherwise mixed BAR-family symbols or exact three-symbol matches may pay. Every spin is independently random.</p>
            <p><strong>Theoretical RTP:</strong> 94.775390625% across all 32³ reel-stop combinations. This is a long-run simulation statistic, not a prediction of your next spin.</p>
            <div className="lsc-paytable" aria-label="Lucky Seven paytable">
              {paytableRows.map(([label, multiplier]) => <span key={label}><b>{label}</b><strong>{multiplier}</strong></span>)}
            </div>
          </div>
        </details>
        <details>
          <summary>Preferences &amp; saved game</summary>
          <div className="lsc-preferences">
            <button type="button" onClick={toggleSound}>Sound {save.preferences.sound ? 'on' : 'off'}</button>
            <button type="button" onClick={toggleMotion}>Cabinet motion {save.preferences.motion ? 'on' : 'off'}</button>
            <button type="button" className={confirmReset ? 'lsc-danger' : ''} onClick={resetSavedGame}>{confirmReset ? 'Confirm reset saved game' : 'Reset saved game'}</button>
          </div>
        </details>
      </div>

      <footer className="lsc-foot">
        {plural(save.spins, 'completed spin')} · {plural(save.totalWagered, 'credit')} wagered · {plural(save.totalWon, 'credit')} returned
      </footer>
    </section>
  );
}
