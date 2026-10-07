import { useEffect, useState } from 'react';
import { useGameSave } from '../../platform/PlatformProvider';
import { SaveStatus } from '../../platform/SaveStatus';
import { BOARD_CELLS, BOARD_SIZE, COMPOST_COST, compostCell, createRun, placePiece, previewNextDraw, type MergeEvent, type MergroveRun } from './engine';
import { mergroveSaveDefinition, type MergroveSave } from './persistence';
import { MergroveSprite, MergroveSpriteBank, tierName } from './sprites';
import './mergrove.css';

export default function MergroveWorkspace() {
  const progress = useGameSave(mergroveSaveDefinition);
  return (
    <>
      <SaveStatus {...progress} />
      <MergroveGame
        key={`${progress.scope}:${progress.ready}:${progress.revision}`}
        initial={progress.state}
        persist={progress.save}
        reset={progress.reset}
      />
    </>
  );
}

function actionMessage(events: MergeEvent[], placedTier: number): string {
  if (events.length === 0) return `${tierName(placedTier)} placed. Build an orthogonal group of three or more.`;
  const points = events.reduce((total, event) => total + event.points, 0);
  const final = events[events.length - 1];
  if (final.ancientBloom) return `Ancient bloom! ${events.length > 1 ? `${events.length}-stage cascade, ` : ''}+${points} points and the grove opened up.`;
  if (events.length > 1) return `${events.length}-stage cascade! ${tierName(final.resultTier ?? final.tier)} formed for +${points} points.`;
  return `${tierName(final.resultTier ?? final.tier)} formed for +${points} points.`;
}

function saveFor(run: MergroveRun, bestScore: number, bestTier: number): MergroveSave {
  return {
    bestScore: run.gameOver ? Math.max(bestScore, run.score) : bestScore,
    bestTier: Math.max(bestTier, run.highestTier),
    activeRun: run,
  };
}

function MergroveGame({ initial, persist, reset }: { initial: MergroveSave; persist(state: MergroveSave): void; reset(): void }) {
  const [run, setRun] = useState<MergroveRun>(() => initial.activeRun ?? createRun(Date.now()));
  const [bestScore, setBestScore] = useState(initial.bestScore);
  const [bestTier, setBestTier] = useState(initial.bestTier);
  const [selectedQueue, setSelectedQueue] = useState(0);
  const [compostMode, setCompostMode] = useState(false);
  const [lastAnchor, setLastAnchor] = useState<number | null>(null);
  const [message, setMessage] = useState(initial.activeRun ? 'Saved grove restored. Choose a spirit and an empty cell.' : 'Choose a spirit, then place it on an empty cell.');

  function commitRun(next: MergroveRun) {
    const nextSave = saveFor(next, bestScore, bestTier);
    setRun(next);
    setBestScore(nextSave.bestScore);
    setBestTier(nextSave.bestTier);
    persist(nextSave);
  }

  function place(cellIndex: number) {
    const placedTier = run.queue[selectedQueue];
    const result = placePiece(run, selectedQueue, cellIndex);
    commitRun(result.run);
    setLastAnchor(cellIndex);
    setMessage(actionMessage(result.events, placedTier));
    if (result.run.gameOver) setMessage(`The grove is full. Final score ${result.run.score}. Start a new run and grow a cleaner chain.`);
  }

  function compost(cellIndex: number) {
    const removed = run.board[cellIndex];
    const next = compostCell(run, cellIndex);
    commitRun(next);
    setCompostMode(false);
    setLastAnchor(null);
    setMessage(`${removed ? tierName(removed) : 'Piece'} composted. ${COMPOST_COST} sunlight spent; one cell is open again.`);
  }

  function setCompost(armed: boolean) {
    setCompostMode(armed);
    setMessage(armed ? 'Compost ready. Choose one occupied cell to remove.' : 'Compost cancelled. Choose a spirit and an empty cell.');
  }

  function startNewRun() {
    const next = createRun(Date.now());
    setSelectedQueue(0);
    setCompostMode(false);
    setLastAnchor(null);
    setMessage('Fresh grove started. Choose a spirit, then place it on an empty cell.');
    commitRun(next);
  }

  function resetProgress() {
    reset();
    setBestScore(0);
    setBestTier(1);
    setRun(createRun(Date.now()));
    setSelectedQueue(0);
    setCompostMode(false);
    setLastAnchor(null);
    setMessage('Mergrove progress reset. A fresh local run is ready.');
  }

  const occupied = run.board.reduce<number>((count, cell) => count + (cell === null ? 0 : 1), 0);
  const nextDraw = previewNextDraw(run);
  const nextDrawText = run.gameOver
    ? 'Run complete'
    : `${tierName(nextDraw.tier)}${nextDraw.sproutIfBud ? ' (a Sprout if this placement reaches Bud)' : ''}`;

  // Escape is a convenience on top of the Cancel button. The listener exists only while Compost is armed,
  // so a non-interactive section never carries key handlers.
  useEffect(() => {
    if (!compostMode) return undefined;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      event.preventDefault();
      setCompostMode(false);
      setMessage('Compost cancelled. Choose a spirit and an empty cell.');
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [compostMode]);

  return (
    <section className="mg" aria-labelledby="mg-title">
      <MergroveSpriteBank />
      <header className="mg-header">
        <div>
          <p className="mg-kicker">Cascade merge puzzle</p>
          <h2 id="mg-title">Grow the grove.</h2>
          <p>Place one queued spirit at a time. Three or more matching neighbors fuse where you placed the last piece, and a new match can cascade again.</p>
        </div>
        <dl className="mg-scoreboard">
          <div><dt>Score</dt><dd data-stat="score">{run.score.toLocaleString()}</dd></div>
          <div><dt>Best</dt><dd data-stat="best">{bestScore.toLocaleString()}</dd></div>
          <div><dt>Highest</dt><dd data-stat="tier">{tierName(Math.max(bestTier, run.highestTier))}</dd></div>
          <div><dt>Sunlight</dt><dd data-stat="sunlight">{run.sunlight}</dd></div>
        </dl>
      </header>

      <div className="mg-stage">
        <div className="mg-playfield">
          <div className="mg-queue-block">
            <div className="mg-section-heading">
              <div><span>Spirit queue</span><strong>{compostMode ? 'Choose a board piece to remove' : 'Choose what to place'}</strong></div>
              <span>{occupied}/{BOARD_CELLS} cells used</span>
            </div>
            <p className="mg-next" data-mg="next-draw">Next to arrive: <strong>{nextDrawText}</strong></p>
            <fieldset className="mg-queue">
              <legend className="mg-sr-only">Spirit queue</legend>
              {run.queue.map((tier, index) => (
                <button
                  key={`${index}-${tier}`}
                  type="button"
                  className="mg-queue-piece"
                  aria-pressed={!compostMode && selectedQueue === index}
                  aria-label={`Queue ${index + 1}: ${tierName(tier)}${selectedQueue === index && !compostMode ? ', selected' : ''}`}
                  disabled={run.gameOver || compostMode}
                  onClick={() => setSelectedQueue(index)}
                >
                  <MergroveSprite tier={tier} />
                  <span>{tierName(tier)}</span>
                </button>
              ))}
            </fieldset>
          </div>

          <div className="mg-board-wrap">
            <fieldset className="mg-board">
              <legend className="mg-sr-only">Mergrove 5 by 5 board</legend>
              {run.board.map((tier, index) => {
                const row = Math.floor(index / BOARD_SIZE) + 1;
                const column = (index % BOARD_SIZE) + 1;
                const actionable = !run.gameOver && (compostMode ? tier !== null : tier === null);
                const label = tier === null
                  ? `Row ${row} column ${column}, empty${compostMode ? '' : `, place ${tierName(run.queue[selectedQueue])}`}`
                  : `Row ${row} column ${column}, ${tierName(tier)}${compostMode ? ', compost this piece' : ', occupied'}`;
                return (
                  <button
                    key={index}
                    type="button"
                    className={`mg-cell ${tier === null ? 'mg-cell--empty' : 'mg-cell--occupied'} ${lastAnchor === index ? 'mg-cell--pulse' : ''}`}
                    aria-label={label}
                    disabled={!actionable}
                    data-tier={tier ?? 0}
                    onClick={() => tier === null ? place(index) : compost(index)}
                  >
                    {tier !== null && <MergroveSprite key={`${index}-${tier}-${lastAnchor === index ? run.turns : 0}`} tier={tier} />}
                    {tier === null && <span className="mg-empty-mark" aria-hidden="true">+</span>}
                  </button>
                );
              })}
            </fieldset>
          </div>

          <output className="mg-status" aria-live="polite">{message}</output>

          {run.gameOver && (
            <div className="mg-complete">
              <p className="mg-kicker">Run complete</p>
              <h3>The grove filled in.</h3>
              <strong>{run.score.toLocaleString()}</strong>
              <span>points · reached {tierName(run.highestTier)} · {run.ancientBlooms} ancient {run.ancientBlooms === 1 ? 'bloom' : 'blooms'}</span>
              <button type="button" className="mg-primary" onClick={startNewRun}>Grow another grove</button>
            </div>
          )}
        </div>

        <aside className="mg-tools" aria-label="Mergrove tools and rules">
          <div className="mg-tool-card mg-sun-card">
            <span className="mg-tool-label">Recovery</span>
            <strong>{run.sunlight} sunlight</strong>
            <p>Every merge stage earns sunlight. Spend {COMPOST_COST} to remove one blocking spirit without consuming the queue.</p>
            <button
              type="button"
              className="mg-secondary"
              aria-pressed={compostMode}
              disabled={run.gameOver || run.sunlight < COMPOST_COST}
              onClick={() => setCompost(!compostMode)}
            >{compostMode ? 'Cancel compost' : `Compost a piece (${COMPOST_COST})`}</button>
          </div>

          <div className="mg-tool-card">
            <span className="mg-tool-label">Run</span>
            <strong>{run.turns} placements</strong>
            <p>{run.ancientBlooms} ancient {run.ancientBlooms === 1 ? 'bloom' : 'blooms'} this run. Merging three Grovehearts clears them instead of creating a ninth tier.</p>
            <button type="button" className="mg-secondary" onClick={startNewRun}>Start a new run</button>
          </div>

          <details className="mg-rules">
            <summary>How merging works</summary>
            <div>
              <p><b>1.</b> Pick any of the three queued spirits and place it in an empty cell.</p>
              <p><b>2.</b> If that cell connects orthogonally to at least two matching spirits, the whole connected group fuses at the new piece.</p>
              <p><b>3.</b> If the new spirit immediately forms another group, it cascades. Later stages multiply the points earned.</p>
              <p><b>4.</b> Four sunlight lets you compost one blocker. No dragging is required; every action works with ordinary buttons, touch, keyboard Enter or Space.</p>
              <p><b>5.</b> Press Escape while Compost is armed to cancel it. The “Next to arrive” line previews the spirit that will replace the one you place; it never changes the random sequence.</p>
            </div>
          </details>

          <button type="button" className="mg-reset" onClick={resetProgress}>Reset Mergrove progress</button>
        </aside>
      </div>
    </section>
  );
}
