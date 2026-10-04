import { useState } from 'react';
import { createRun, scoreRound, submitSelection } from './engine';
import { threefoldSaveDefinition, type ThreefoldSave } from './persistence';
import { useGameSave } from '../../platform/PlatformProvider';
import { SaveStatus } from '../../platform/SaveStatus';
import './threefold.css';

export default function ThreefoldWorkspace() {
  const progress = useGameSave(threefoldSaveDefinition);
  return <>
    <SaveStatus {...progress} />
    <ThreefoldBoard key={progress.scope + ':' + progress.ready + ':' + progress.revision} initial={progress.state} persist={progress.save} reset={progress.reset} />
  </>;
}

function ThreefoldBoard({ initial, persist, reset }: { initial: ThreefoldSave; persist(state: ThreefoldSave): void; reset(): void }) {
  const [run, setRun] = useState(() => createRun(Date.now()));
  const [selection, setSelection] = useState<number[]>([]);
  const [message, setMessage] = useState('Choose three tiles.');
  const [best, setBest] = useState(initial.bestScore);
  const round = run.rounds[run.roundIndex];
  const done = run.roundIndex >= run.rounds.length;
  const roundValue = done ? 0 : scoreRound(round.misses);

  function check() {
    const roundIndex = run.roundIndex;
    const result = submitSelection(run, selection);
    setRun(result.run);
    setSelection([]);
    if (result.correct) {
      const earned = result.run.rounds[roundIndex].earned ?? 0;
      setMessage(`Correct — ${earned} points banked.`);
    } else {
      const nextValue = scoreRound(result.run.rounds[roundIndex].misses);
      setMessage(`Not quite. Try another trio. Round value is now ${nextValue} points.`);
    }
    if (result.run.roundIndex === result.run.rounds.length && result.run.totalScore > best) {
      setBest(result.run.totalScore);
      persist({ bestScore: result.run.totalScore });
    }
  }

  function start() { setRun(createRun(Date.now())); setSelection([]); setMessage('Choose three tiles.'); }

  return <section className="tf" aria-label="Threefold puzzle">
    <header className="tf-header">
      <div>
        <p className="tf-kicker">Five-round number puzzle</p>
        <h2>Find the trio.</h2>
        <p>Choose exactly three tiles whose total matches the target.</p>
      </div>
      <dl className="tf-scoreboard">
        <div><dt>Best</dt><dd>{best}<span>/500</span></dd></div>
        <div><dt>{done ? 'Rounds' : 'Round'}</dt><dd>{done ? '5/5' : (run.roundIndex + 1) + '/5'}</dd></div>
        <div><dt>Score</dt><dd>{run.totalScore}<span>/500</span></dd></div>
      </dl>
    </header>

    {done ? <div className="tf-complete">
      <p className="tf-kicker">Final score</p><h2>Run complete</h2><strong>{run.totalScore}</strong><span>points out of 500</span>
      <ol className="tf-results" aria-label="Round scores">{run.rounds.map((item, index) => <li key={index}><span>Round {index + 1}</span><b>{item.earned ?? 0} pts</b></li>)}</ol>
      <button className="tf-primary" onClick={start}>Play another run</button>
    </div> : <>
      <div className="tf-roundline"><span>Round {run.roundIndex + 1} of 5</span><span>Round value {roundValue} points</span><span>{selection.length} of 3 selected</span></div>
      <h2 className="tf-target"><span>Make</span><strong>{round.target}</strong></h2>
      <div className="tf-selection" aria-label="Selected tiles"><span>Selected</span><strong>{selection.length ? selection.join(' + ') : '—'}</strong></div>
      <div className="threefold-board">
        {round.tiles.map(tile => <button key={tile} aria-pressed={selection.includes(tile)} onClick={() => setSelection(current => current.includes(tile) ? current.filter(value => value !== tile) : current.length < 3 ? [...current, tile] : current)}>{tile}</button>)}
      </div>
      <div className="tf-feedback"><p role="status" aria-live="polite">{message}</p><button className="tf-primary" disabled={selection.length !== 3} onClick={check}>Check three</button></div>
    </>}

    <div className="tf-footer"><span>Best completed score: <b>{best}</b> / 500 · saved after a completed run.</span><button className="tf-reset" onClick={() => { setBest(0); start(); reset(); }}>Reset best score</button></div>
  </section>;
}
