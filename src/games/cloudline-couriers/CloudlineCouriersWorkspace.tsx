import { useState } from 'react';
import { useGameSave } from '../../platform/PlatformProvider';
import { SaveStatus } from '../../platform/SaveStatus';
import { createCloudlineRun, landmarkCost, resolveCargo, rollFlight, SKYWAY, upgradeLandmark, type CloudlineRun } from './engine';
import { cloudlineCouriersSaveDefinition, type CloudlineSave } from './persistence';
import './cloudline-couriers.css';

const LANDMARKS = ['Aerie Post', 'Cloud Garden', 'Signal Spire', 'Skyforge Hangar'];

export default function CloudlineCouriersWorkspace() {
  const progress = useGameSave(cloudlineCouriersSaveDefinition);
  return (
    <>
      <SaveStatus {...progress} />
      <CloudlineGame
        key={`${progress.scope}:${progress.ready}:${progress.revision}`}
        initial={progress.state}
        persist={progress.save}
        reset={progress.reset}
      />
    </>
  );
}

function CloudlineGame({ initial, persist, reset }: { initial: CloudlineSave; persist(state: CloudlineSave): void; reset(): void }) {
  const [run, setRun] = useState<CloudlineRun>(() => initial.activeRun ?? createCloudlineRun(Date.now()));
  const [boost, setBoost] = useState<1 | 2 | 3>(1);

  function commitRun(next: CloudlineRun) {
    setRun(next);
    persist({ activeRun: next });
  }

  function startFreshRoute() {
    commitRun(createCloudlineRun(Date.now()));
    setBoost(1);
  }

  function resetCareer() {
    reset();
    setRun(createCloudlineRun(Date.now()));
    setBoost(1);
  }

  return (
    <section className="cl" aria-labelledby="cl-title">
      <header>
        <p className="cl-kicker">Skyway strategy</p>
        <h2 id="cl-title">Cloudline Couriers</h2>
        <p>Fly the sixteen-stop skyway, make deliveries and turn each district into a working neighborhood.</p>
      </header>
      <dl className="cl-stats">
        <div><dt>Credits</dt><dd>{run.credits}</dd></div>
        <div><dt>Fuel</dt><dd>{run.fuel}</dd></div>
        <div><dt>District</dt><dd>{run.district}</dd></div>
        <div><dt>Shield</dt><dd>{run.shield ? 'Ready' : 'None'}</dd></div>
      </dl>
      <div className="cl-layout">
        <div>
          <div className="cl-board" aria-label="Sixteen-stop skyway">
            {SKYWAY.map((tile, index) => (
              <div className={`cl-tile cl-tile-${index}`} data-active={run.position === index} key={tile.name + index}>
                <strong>{tile.name}</strong>
                <span>{tile.kind}</span>
                {run.position === index && <b aria-label="Courier position">✦</b>}
              </div>
            ))}
            <div className="cl-center">
              <strong>{run.lastRoll ?? '—'}</strong>
              <span>last roll</span>
              <div className="cl-boost" role="group" aria-label="Flight boost">
                {([1, 2, 3] as const).map(value => (
                  <button key={value} aria-pressed={boost === value} onClick={() => setBoost(value)}>{value}×</button>
                ))}
              </div>
              <button className="cl-fly" disabled={Boolean(run.pendingCargo) || run.fuel < boost} onClick={() => commitRun(rollFlight(run, boost))}>Fly</button>
            </div>
          </div>
          <p className="cl-status" role="status">{run.message}</p>
          {run.pendingCargo && (
            <div className="cl-cache" role="group" aria-label="Cargo Cache">
              <h3>Choose a sealed cargo pod</h3>
              {run.pendingCargo.options.map((_, index) => (
                <button key={index} onClick={() => commitRun(resolveCargo(run, index))}>Pod {index + 1}</button>
              ))}
            </div>
          )}
        </div>
        <aside>
          <h3>District landmarks</h3>
          {LANDMARKS.map((name, index) => {
            const cost = landmarkCost(run, index);
            return (
              <div className="cl-landmark" key={name}>
                <strong>{name}</strong>
                <span>Stage {run.landmarks[index]}/4</span>
                <button disabled={cost === null || run.credits < (cost ?? 0)} onClick={() => commitRun(upgradeLandmark(run, index))}>
                  {cost === null ? 'Complete' : `Upgrade · ${cost}`}
                </button>
              </div>
            );
          })}
          <p>Delivery streak: {run.streak}/4 · circuits: {run.circuits}</p>
          <button onClick={startFreshRoute}>Start fresh route</button>
          <button onClick={resetCareer}>Reset saved career</button>
        </aside>
      </div>
    </section>
  );
}
