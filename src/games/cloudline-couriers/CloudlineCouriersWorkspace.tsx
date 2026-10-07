import { useState } from 'react';
import { useGameSave } from '../../platform/PlatformProvider';
import { SaveStatus } from '../../platform/SaveStatus';
import { createCloudlineRun, landmarkCost, resolveCargo, rollFlight, SKYWAY, upgradeLandmark, type CloudlineRun } from './engine';
import { cloudlineCouriersSaveDefinition, type CloudlineSave } from './persistence';
import { AirshipSprite, CargoPodSprite, LandmarkSprite, TileSprite } from './sprites';
import './cloudline-couriers.css';

const LANDMARKS = ['Aerie Post', 'Cloud Garden', 'Signal Spire', 'Skyforge Hangar'];

export default function CloudlineCouriersWorkspace() {
  const progress = useGameSave(cloudlineCouriersSaveDefinition);
  return <><SaveStatus {...progress} /><CloudlineGame key={`${progress.scope}:${progress.ready}:${progress.revision}`} initial={progress.state} persist={progress.save} reset={progress.reset} /></>;
}

function CloudlineGame({ initial, persist, reset }: { initial: CloudlineSave; persist(state: CloudlineSave): void; reset(): void }) {
  const [run, setRun] = useState<CloudlineRun>(() => initial.activeRun ?? createCloudlineRun(Date.now()));
  const [boost, setBoost] = useState<1 | 2 | 3>(1);
  const commitRun = (next: CloudlineRun) => { setRun(next); persist({ activeRun: next }); };
  const startFreshRoute = () => { commitRun(createCloudlineRun(Date.now())); setBoost(1); };
  const resetCareer = () => { reset(); setRun(createCloudlineRun(Date.now())); setBoost(1); };

  return <section className="cl" aria-labelledby="cl-title">
    <header className="cl-hero"><div><p className="cl-kicker">Skyway strategy</p><h2 id="cl-title">Cloudline Couriers</h2><p>Fly the skyway, deliver what matters, and rebuild a neighborhood that changes because you showed up.</p></div><div className="cl-hero-ship" aria-hidden="true"><AirshipSprite /></div></header>
    <dl className="cl-stats"><div><dt>Credits</dt><dd>{run.credits}</dd></div><div><dt>Fuel</dt><dd>{run.fuel}</dd></div><div><dt>District</dt><dd>{run.district}</dd></div><div><dt>Shield</dt><dd>{run.shield ? 'Ready' : 'None'}</dd></div></dl>
    <div className="cl-layout"><div>
      <div className="cl-board" aria-label="Sixteen-stop skyway">
        {SKYWAY.map((tile,index)=><div className={`cl-tile cl-tile-${index}`} data-kind={tile.kind} data-active={run.position===index} key={tile.name+index}><TileSprite kind={tile.kind}/><div className="cl-tile-copy"><strong>{tile.name}</strong><span>{tile.kind}</span></div>{run.position===index&&<div className="cl-courier" aria-label="Courier position"><AirshipSprite/></div>}</div>)}
        <div className="cl-center"><span className="cl-center-label">Flight console</span><strong>{run.lastRoll ?? '—'}</strong><span>last roll</span><div className="cl-boost" role="group" aria-label="Flight boost">{([1,2,3] as const).map(value=><button key={value} aria-pressed={boost===value} onClick={()=>setBoost(value)}>{value}×</button>)}</div><button className="cl-fly" disabled={Boolean(run.pendingCargo)||run.fuel<boost} onClick={()=>commitRun(rollFlight(run,boost))}>Fly route</button><small>{run.pendingCargo ? 'Cargo decision required' : `${boost} fuel · ${run.streak}/4 streak`}</small></div>
      </div>
      <p className="cl-status" role="status">{run.message}</p>
      {run.pendingCargo&&<div className="cl-cache" role="group" aria-label="Cargo Cache"><div><p className="cl-kicker">Cargo Cache</p><h3>Choose one sealed pod</h3><p>Every pod contains a delivery payout. Pick a manifest and keep moving.</p></div><div className="cl-pods">{run.pendingCargo.options.map((_,index)=><button key={index} onClick={()=>commitRun(resolveCargo(run,index))}><CargoPodSprite index={index}/><span>Pod {index+1}</span></button>)}</div></div>}
    </div><aside><div className="cl-aside-head"><p className="cl-kicker">District works</p><h3>Landmarks</h3><p>Every upgrade changes the neighborhood and moves this district toward completion.</p></div>{LANDMARKS.map((name,index)=>{const cost=landmarkCost(run,index);return <div className="cl-landmark" key={name}><LandmarkSprite index={index} stage={run.landmarks[index]}/><div><strong>{name}</strong><span>Stage {run.landmarks[index]}/4</span></div><button disabled={cost===null||run.credits<(cost??0)} onClick={()=>commitRun(upgradeLandmark(run,index))}>{cost===null?'Complete':`Upgrade · ${cost}`}</button></div>})}<p className="cl-route-meta">Delivery streak <strong>{run.streak}/4</strong> · circuits <strong>{run.circuits}</strong></p><details><summary>Route options</summary><div className="cl-route-actions"><button onClick={startFreshRoute}>Start fresh route</button><button onClick={resetCareer}>Reset saved career</button></div></details></aside></div>
  </section>;
}
