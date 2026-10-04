import { useState } from 'react';
import { createRun, submitSelection } from './engine';
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

  function check() {
    const result = submitSelection(run, selection);
    setRun(result.run);
    setSelection([]);
    setMessage(result.correct ? 'Correct.' : 'Not quite. Try another trio.');
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
      <p className="tf-kicker">Run complete</p><strong>{run.totalScore}</strong><span>points out of 500</span>
      <button className="tf-primary" onClick={start}>Play another run</button>
    </div> : <>
      <div className="tf-roundline"><span>Round {run.roundIndex + 1} of 5</span><span>{selection.length} of 3 selected</span></div>
      <div className="tf-target" aria-label={'Target ' + round.target}><span>Make</span><strong>{round.target}</strong></div>
      <div className="threefold-board">
        {round.tiles.map(tile => <button key={tile} aria-pressed={selection.includes(tile)} onClick={() => setSelection(current => current.includes(tile) ? current.filter(value => value !== tile) : current.length < 3 ? [...current, tile] : current)}>{tile}</button>)}
      </div>
      <div className="tf-feedback"><p role="status" aria-live="polite">{message}</p><button className="tf-primary" disabled={selection.length !== 3} onClick={check}>Check three</button></div>
    </>}

    <div className="tf-footer"><span>Best score is saved after a completed run.</span><button className="tf-reset" onClick={() => { setBest(0); start(); reset(); }}>Reset best score</button></div>
  </section>;
}
