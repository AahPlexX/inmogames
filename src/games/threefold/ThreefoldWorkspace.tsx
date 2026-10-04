import { useState } from 'react';
import { createRun, submitSelection } from './engine';
import { threefoldSaveDefinition, type ThreefoldSave } from './persistence';
import { useGameSave } from '../../platform/PlatformProvider';
import { SaveStatus } from '../../platform/SaveStatus';
export default function ThreefoldWorkspace() {
  const progress = useGameSave(threefoldSaveDefinition);
  return <><SaveStatus {...progress} /><ThreefoldBoard key={`${progress.scope}:${progress.ready}:${progress.revision}`} initial={progress.state} persist={progress.save} reset={progress.reset} /></>;
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
    setRun(result.run); setSelection([]); setMessage(result.correct ? 'Correct.' : 'Not quite. Try another trio.');
    if (result.run.roundIndex === result.run.rounds.length && result.run.totalScore > best) {
      setBest(result.run.totalScore); persist({ bestScore: result.run.totalScore });
    }
  }
  function start() { setRun(createRun(Date.now())); setSelection([]); setMessage('Choose three tiles.'); }
  return <section aria-label="Threefold puzzle">
    <p>Best completed score: <b>{best}</b> / 500</p>
    {done ? <><h2>Run complete</h2><p role="status">Score: <b>{run.totalScore}</b> / 500</p><button onClick={start}>Play again</button></> : <>
      <p>Round {run.roundIndex + 1} of 5 · Score {run.totalScore}</p>
      <h2>Make {round.target}</h2>
      <div className="threefold-board">{round.tiles.map(tile => <button key={tile} aria-pressed={selection.includes(tile)} onClick={() => setSelection(current => current.includes(tile) ? current.filter(value => value !== tile) : current.length < 3 ? [...current, tile] : current)}>{tile}</button>)}</div>
      <p role="status">{message}</p>
      <button disabled={selection.length !== 3} onClick={check}>Check three</button>
    </>}
    <p><button onClick={() => { setBest(0); start(); reset(); }}>Reset best score</button></p>
  </section>;
}
