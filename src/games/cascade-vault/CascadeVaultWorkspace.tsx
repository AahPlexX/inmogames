import { useCallback, useEffect, useRef, useState } from 'react';
import { useGameSave } from '../../platform/PlatformProvider';
import { SaveStatus } from '../../platform/SaveStatus';
import { resolveSpin, type Board, type CascadeVaultSpinMode, type ResolveSpinResult } from './engine';
import { CASCADE_VAULT_WAGERS, CREDIT_SCALE, PAYTABLE_CENTI_MULTIPLIERS } from './paytable';
import { cascadeVaultSaveDefinition, restorePracticeCredits, settleCascadeVaultBaseSpin, settleCascadeVaultFreeSpin } from './persistence';
import { cryptographicNextInt } from './random';
import { createVaultAudio } from './audio';
import { DEFAULT_SAVE, type CascadeVaultSave } from './storage';
import { createWeightedVaultRandomSource, PAYING_SYMBOLS, type VaultSymbol } from './symbols';
import './cascade-vault.css';

type Presentation = { result: ResolveSpinResult; mode: CascadeVaultSpinMode; wager: number; frame: number };
type VaultAudio = ReturnType<typeof createVaultAudio>;

const PREVIEW_BOARD: Board = Array.from({ length: 6 }, (_, reel) => (
  Array.from({ length: 5 }, (_, row) => (['quartz', 'copper', 'silver', 'gold', 'sapphire', 'emerald', 'ruby', 'vault_crown', 'wild', 'scatter', 'blank'] as const)[(reel * 5 + row) % 11])
));
const SYMBOL_LABELS: Record<VaultSymbol, string> = {
  quartz: 'Quartz', copper: 'Copper', silver: 'Silver', gold: 'Gold', sapphire: 'Sapphire',
  emerald: 'Emerald', ruby: 'Ruby', vault_crown: 'Vault Crown', wild: 'Wild', scatter: 'Scatter', blank: 'Blank',
};
const money = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
const credits = (units: number) => money.format(units / CREDIT_SCALE);

function rememberPanel(name: string, open: boolean) {
  const url = new URL(window.location.href);
  if (open) url.searchParams.set(name, 'open');
  else url.searchParams.delete(name);
  window.history.replaceState(null, '', url);
}

function resultMessage(result: ResolveSpinResult, mode: CascadeVaultSpinMode, wager: number): string {
  const win = credits(result.totalAwardUnits);
  const cascades = result.cascades.length;
  const feature = result.triggeredVaultRunSpins > 0
    ? ` Vault Run unlocked: ${result.triggeredVaultRunSpins} free spins.`
    : mode === 'vault' && result.nextVaultState
      ? ` ${result.nextVaultState.remainingSpins} Vault Run free spins remain.`
      : mode === 'vault' ? ' Vault Run complete.' : '';
  return `${mode === 'vault' ? 'Free spin' : `Spin at ${wager} credits`} settled with ${cascades} ${cascades === 1 ? 'cascade' : 'cascades'} and ${win} credits won.${feature}`;
}

export default function CascadeVaultWorkspace() {
  const progress = useGameSave(cascadeVaultSaveDefinition);
  return <>
    <SaveStatus {...progress} />
    <CascadeVaultGame
      key={`${progress.scope}:${progress.ready}:${progress.revision}`}
      initial={progress.state}
      persist={progress.save}
      ready={progress.ready}
    />
  </>;
}

function CascadeVaultGame({ initial, persist, ready }: {
  initial: CascadeVaultSave;
  persist(state: CascadeVaultSave): void;
  ready: boolean;
}) {
  const [save, setSave] = useState<CascadeVaultSave>(() => initial ?? DEFAULT_SAVE);
  const [settledBoard, setSettledBoard] = useState<Board | null>(null);
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [error, setError] = useState('');
  const [systemReduced, setSystemReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const locked = useRef(false);
  const audio = useRef<VaultAudio | null>(null);
  const reduced = save.preferences.reducedEffects || systemReduced;
  const featureActive = save.feature !== null;

  const commit = useCallback((next: CascadeVaultSave) => {
    setSave(next);
    persist(next);
  }, [persist]);

  const finishPresentation = useCallback((current: Presentation) => {
    locked.current = false;
    setSettledBoard(current.result.finalBoard);
    setPresentation(null);
    setAnnouncement(resultMessage(current.result, current.mode, current.wager));
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setSystemReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!presentation) return;
    if (reduced) {
      finishPresentation(presentation);
      return;
    }
    const timer = window.setTimeout(() => {
      if (presentation.frame < presentation.result.cascades.length) {
        setPresentation(current => current ? { ...current, frame: current.frame + 1 } : null);
      } else {
        finishPresentation(presentation);
      }
    }, 420);
    return () => window.clearTimeout(timer);
  }, [presentation, reduced, finishPresentation]);

  useEffect(() => () => {
    audio.current?.close();
    audio.current = null;
  }, []);

  const playSpin = () => {
    if (locked.current) return;
    locked.current = true;
    setError('');
    setAnnouncement('');
    const mode: CascadeVaultSpinMode = featureActive ? 'vault' : 'base';
    const wager = save.selectedWager;
    try {
      const random = createWeightedVaultRandomSource(cryptographicNextInt);
      const result = resolveSpin({
        mode,
        wagerCredits: wager,
        random,
        ...(mode === 'vault' ? { vaultState: save.feature! } : {}),
      });
      const next = mode === 'vault'
        ? settleCascadeVaultFreeSpin(save, result)
        : settleCascadeVaultBaseSpin(save, result);
      commit(next);
      if (save.preferences.sound) {
        try {
          if (!audio.current) audio.current = createVaultAudio();
          audio.current.play();
        } catch {
          audio.current?.close();
          audio.current = null;
        }
      }
      const current = { result, mode, wager, frame: 0 } satisfies Presentation;
      if (reduced) finishPresentation(current);
      else setPresentation(current);
    } catch {
      locked.current = false;
      setError('The spin could not be generated safely. No credits were changed. Try again.');
    }
  };

  const selectWager = (wager: typeof CASCADE_VAULT_WAGERS[number]) => {
    if (locked.current || featureActive || save.selectedWager === wager) return;
    setError('');
    commit({ ...save, selectedWager: wager });
  };

  const togglePreference = (key: 'sound' | 'reducedEffects') => {
    if (locked.current && key !== 'reducedEffects') return;
    const next = { ...save, preferences: { ...save.preferences, [key]: !save.preferences[key] } };
    commit(next);
    if (key === 'sound' && next.preferences.sound === false) {
      audio.current?.close();
      audio.current = null;
    }
    if (key === 'reducedEffects' && next.preferences.reducedEffects && presentation) finishPresentation(presentation);
  };

  const restore = () => {
    if (locked.current) return;
    const next = restorePracticeCredits(save);
    if (!next) return;
    commit(next);
    setError('');
    setAnnouncement('Practice bankroll restored to 5,000 credits. Previous statistics and preferences were kept.');
  };

  const activeCascade = presentation && presentation.frame < presentation.result.cascades.length
    ? presentation.result.cascades[presentation.frame]
    : null;
  const board = presentation
    ? activeCascade?.boardBefore ?? presentation.result.finalBoard
    : settledBoard ?? PREVIEW_BOARD;
  const winning = new Set(activeCascade?.evaluation.removals.map(({ reel, row }) => `${reel}:${row}`) ?? []);
  const canRestore = save.bankrollUnits < 10 * CREDIT_SCALE && !featureActive;
  const canPay = save.bankrollUnits >= save.selectedWager * CREDIT_SCALE;
  const spinDisabled = Boolean(presentation) || !featureActive && !canPay;
  const statusText = presentation
    ? activeCascade
      ? `Cascade ${activeCascade.index} of ${presentation.result.cascades.length}: ×${activeCascade.multiplier} multiplier, ${credits(activeCascade.evaluation.totalAwardUnits)} credits won. The spin is already settled.`
      : 'Showing the completed board. The spin is already settled.'
    : save.lastResult
      ? `${save.lastResult.winningCascades} ${save.lastResult.winningCascades === 1 ? 'cascade' : 'cascades'} in the last settled spin.`
      : 'Choose a wager, then press Spin. Each spin uses that many practice credits.';

  return <section className="cv" data-reduced={reduced} data-presenting={Boolean(presentation)}>
    <header className="cv-heading">
      <p>Match minerals across the first three or more reels. Winning symbols clear for another chance to win; four Scatters unlock free spins. Play uses practice credits only.</p>
      {!ready && <p className="cv-cache-note">Playing with the currently available save while account progress loads. A completed account load takes precedence.</p>}
    </header>

    <section className="cv-summary" aria-label="Saved game statistics">
      <div><span>Practice bankroll</span><strong className="cv-bankroll">{credits(save.bankrollUnits)}</strong></div>
      <div><span>Wager</span><strong>{save.selectedWager} credits</strong></div>
      <div><span>Net</span><strong>{credits(save.netUnits)} credits</strong></div>
    </section>

    {featureActive && <section className="cv-feature" aria-label="Vault Run status">
      <h3>Vault Run</h3>
      <p><strong>{save.feature!.remainingSpins}</strong> free spins · persistent multiplier <strong>×{save.feature!.persistentMultiplier}</strong></p>
      <p>Vault meter: {save.feature!.meterLevel}/3{save.feature!.meterLevel >= 1 ? ' · wild refill active' : ''}{save.feature!.meterLevel >= 2 ? ' · award boost active' : ''}</p>
    </section>}

    <div className="cv-board-wrap">
      <div className="cv-board" role="group" aria-label={`Six reels by five rows: ${presentation ? 'spin in progress' : settledBoard ? 'last completed spin' : 'example board'}`} data-cascade={activeCascade?.index ?? 0}>
        {board.flatMap((reel, reelIndex) => reel.map((symbol, rowIndex) => <span
          className="cv-cell"
          role="img"
          data-symbol={symbol}
          data-winning={winning.has(`${reelIndex}:${rowIndex}`)}
          key={`${reelIndex}:${rowIndex}`}
          style={{ gridColumn: reelIndex + 1, gridRow: rowIndex + 1 }}
          aria-label={`Reel ${reelIndex + 1}, row ${rowIndex + 1}: ${SYMBOL_LABELS[symbol]}`}
        >{SYMBOL_LABELS[symbol]}</span>))}
      </div>
      {!presentation && <p className="cv-board-caption">{settledBoard ? 'Last completed spin. Your next spin generates a new board.' : 'Example board. Press Spin to generate a new outcome.'}</p>}
    </div>

    <div className="cv-controls">
      <fieldset disabled={Boolean(presentation) || featureActive}>
        <legend>Choose wager</legend>
        <div className="cv-wagers">{CASCADE_VAULT_WAGERS.map(wager => <button
          type="button"
          key={wager}
          aria-pressed={save.selectedWager === wager}
          disabled={wager * CREDIT_SCALE > save.bankrollUnits}
          onClick={() => selectWager(wager)}
        >{wager} credits</button>)}</div>
      </fieldset>
      <button type="button" className="cv-spin" disabled={spinDisabled} onClick={playSpin}>
        {featureActive ? 'Free spin' : `Spin · ${save.selectedWager} credits`}
      </button>
      {presentation && <button type="button" className="cv-skip" onClick={() => finishPresentation(presentation)}>Skip presentation</button>}
      {!featureActive && !canPay && <p className="cv-error">Choose a lower wager, or restore practice credits if your bankroll is below 10.</p>}
    </div>

    <p className="cv-status">{statusText}</p>
    {error && <p className="cv-error" role="alert">{error}</p>}
    <div className="cv-live" aria-live="polite" aria-atomic="true">
      {announcement && <p className="cv-live-detail">{announcement}</p>}
    </div>

    <section className="cv-history" aria-label="Practice history">
      <h3>Practice history</h3>
      <p>{save.paidSpins} paid {save.paidSpins === 1 ? 'spin' : 'spins'} · {save.freeSpins} Vault Run {save.freeSpins === 1 ? 'free spin' : 'free spins'} · {save.completedVaultRuns} completed Vault {save.completedVaultRuns === 1 ? 'Run' : 'Runs'}</p>
      <p>Wagered {credits(save.totalWageredUnits)} · won {credits(save.totalWonUnits)} · largest spin win {credits(save.largestSpinWinUnits)}</p>
      {save.lastResult && <p className="cv-last-result">Last result: {save.lastResult.winningCascades} cascades, {credits(save.lastResult.awardUnits)} credits awarded.</p>}
      {canRestore && <button type="button" onClick={restore}>Restore 5,000 practice credits</button>}
    </section>

    <details className="cv-rules" open={new URLSearchParams(window.location.search).has('vault-rules')} onToggle={event => rememberPanel('vault-rules', event.currentTarget.open)}>
      <summary>Paytable &amp; rules</summary>
      <p>A paid spin costs the selected wager. A match must start on the first reel and continue across at least three consecutive reels. Symbols can be in different rows. Every combination of matching cells is a winning way. Wins are removed together, symbols fall, and new symbols refill the reels. Every cascade raises the base multiplier up to ×10.</p>
      <p>Wild substitutes for paying minerals, including Vault Crown. Blank never wins. Four, five, or six or more Scatters on the starting board unlock 8, 10, or 12 free spins. Scatters never appear in refills. An all-Wild way pays once at its highest value.</p>
      <p>Vault Run starts at ×2. Each winning cascade increases the carried multiplier by one, up to ×20. A free spin with at least three winning cascades advances the meter one step: step 1 adds a Wild to later refills; step 2 multiplies later awards by 1.5; step 3 adds three free spins once. Four or more starting Scatters add four free spins. Remaining free spins never exceed 20. Your wager stays fixed until the run ends.</p>
      <p>All awards are practice credits. Outcomes use browser cryptographic randomness. The example board is not a generated outcome. Credits cannot be bought or exchanged for money.</p>
      <div className="cv-paytable" role="region" aria-label="Paytable, scroll horizontally for all reel counts" tabIndex={0}>
      <table>
        <caption>Paytable factor per way at the selected wager</caption>
        <thead><tr><th scope="col">Symbol</th>{([3, 4, 5, 6] as const).map(count => <th scope="col" key={count}>{count} reels</th>)}</tr></thead>
        <tbody>{PAYING_SYMBOLS.map(symbol => <tr key={symbol}><th scope="row">{SYMBOL_LABELS[symbol]}</th>{([3, 4, 5, 6] as const).map(count => <td key={count}>{(PAYTABLE_CENTI_MULTIPLIERS[symbol][count] / 100).toFixed(2)}×</td>)}</tr>)}</tbody>
      </table>
      </div>
      <p>Displayed awards are wager × paytable factor × number of ways × cascade multiplier; Vault Run boosts and persistent multipliers also apply. Awards use centi-credit precision.</p>
    </details>

    <details className="cv-preferences" open={new URLSearchParams(window.location.search).has('vault-preferences')} onToggle={event => rememberPanel('vault-preferences', event.currentTarget.open)}>
      <summary>Preferences &amp; saved game</summary>
      <p>Saved game stores completed spins and a settled Vault Run checkpoint. A board animation is never replayed after reload.</p>
      <button type="button" onClick={() => togglePreference('reducedEffects')}>Reduced effects {save.preferences.reducedEffects ? 'on' : 'off'}</button>
      <button type="button" disabled={Boolean(presentation)} onClick={() => togglePreference('sound')}>Sound {save.preferences.sound ? 'on' : 'off'}</button>
      <p>Sound is created only from a Spin action after you turn it on. Reduced effects skips the cascade presentation while keeping the same result and saved credits.</p>
    </details>
  </section>;
}
