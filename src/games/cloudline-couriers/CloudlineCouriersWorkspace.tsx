import { useEffect, useRef, useState, type AnimationEvent, type CSSProperties } from 'react';
import { useGameSave } from '../../platform/PlatformProvider';
import { SaveStatus } from '../../platform/SaveStatus';
import {
  buildFlightPath,
  createCloudlineRun,
  LANDMARK_NAMES,
  landmarkCost,
  resolveCargo,
  rollFlight,
  SKYWAY,
  SKYWAY_STOPS,
  upgradeLandmark,
  type CloudlineRun,
  type TileKind,
} from './engine';
import { cloudlineCouriersSaveDefinition, type CloudlineSave } from './persistence';
import { AirshipSprite, CargoPodSprite, LandmarkSprite, TileSprite } from './sprites';
import './cloudline-couriers.css';

// shortcut: fixed 16-stop perimeter coordinates match the introductory board; replace with route-graph coordinates when CLC-022 adds branching skyways.
const ROUTE_POINTS = [
  [10, 10], [30, 10], [50, 10], [70, 10], [90, 10],
  [90, 30], [90, 50], [90, 70], [90, 90],
  [70, 90], [50, 90], [30, 90], [10, 90],
  [10, 70], [10, 50], [10, 30],
] as const;

const EFFECT_LABELS: Record<TileKind, string> = {
  dispatch: 'Delivery complete',
  market: 'Delivery complete',
  workshop: 'Fuel restored',
  beacon: 'Storm shield ready',
  storm: 'Storm impact',
  windgate: 'Tailwind boost',
  cargo: 'Cargo choice',
};

type FeedbackKind = TileKind | 'upgrade' | 'district';
type Feedback = { id: number; kind: FeedbackKind; label: string };
type Flight = { next: CloudlineRun; path: number[]; step: number; eventKind: TileKind };
type CargoChoice = { index: number; next: CloudlineRun; reward: number };

export default function CloudlineCouriersWorkspace() {
  const progress = useGameSave(cloudlineCouriersSaveDefinition);
  return <><SaveStatus {...progress} /><CloudlineGame key={`${progress.scope}:${progress.ready}:${progress.revision}`} initial={progress.state} persist={progress.save} reset={progress.reset} /></>;
}

function CloudlineGame({ initial, persist, reset }: { initial: CloudlineSave; persist(state: CloudlineSave): void; reset(): void }) {
  const [run, setRun] = useState<CloudlineRun>(() => initial.activeRun ?? createCloudlineRun(Date.now()));
  const [boost, setBoost] = useState<1 | 2 | 3>(1);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [cargoChoice, setCargoChoice] = useState<CargoChoice | null>(null);
  const [upgradedLandmark, setUpgradedLandmark] = useState<number | null>(null);
  const feedbackSequence = useRef(0);
  const isFlying = flight !== null;
  const isBusy = isFlying || cargoChoice !== null;
  const completedStages = run.landmarks.reduce((sum, stage) => sum + stage, 0);
  const canUpgrade = LANDMARK_NAMES.some((_, index) => {
    const cost = landmarkCost(run, index);
    return cost !== null && run.credits >= cost;
  });
  const firstLandmarkCost = landmarkCost(run, 0);
  const currentJob = run.pendingCargo
    ? 'Choose a cargo pod to finish this stop.'
    : run.deliveries === 0
      ? run.lastRoll === null
        ? 'Make your first delivery: choose a boost, then select Fly route.'
        : 'Keep flying until you complete your first delivery.'
      : run.district === 1 && completedStages === 0 && firstLandmarkCost !== null
        ? `First delivery complete. Upgrade ${LANDMARK_NAMES[0]} for ${firstLandmarkCost} credits.`
        : run.district === 1 && completedStages > 0 && run.deliveries < 4
          ? `Starter contract: complete 4 deliveries. Progress ${run.deliveries}/4. The fourth delivery pays 120 × boost credits.`
          : canUpgrade
            ? 'Upgrade a landmark, or fly again to earn more credits.'
            : 'Fly the route to earn credits for your next landmark upgrade.';

  const showFeedback = (kind: FeedbackKind, label: string) => {
    feedbackSequence.current += 1;
    setFeedback({ id: feedbackSequence.current, kind, label });
  };
  const commitRun = (next: CloudlineRun) => {
    setRun(next);
    persist({ activeRun: next });
  };
  const commitWithoutMotionFeedback = (next: CloudlineRun) => {
    setFeedback(null);
    setUpgradedLandmark(null);
    commitRun(next);
  };
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finishFlight = (current: Flight) => {
    setFlight(null);
    commitRun(current.next);
    showFeedback(current.eventKind, EFFECT_LABELS[current.eventKind]);
  };

  useEffect(() => {
    if (!flight) return;
    const atDestination = flight.step >= flight.path.length;
    const delay = atDestination ? 120 : flight.step === 0 ? 70 : 165;
    const timer = window.setTimeout(() => {
      if (atDestination) {
        finishFlight(flight);
        return;
      }
      setFlight(current => current ? { ...current, step: current.step + 1 } : null);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [flight]);

  const startFreshRoute = () => {
    setFlight(null);
    setCargoChoice(null);
    setFeedback(null);
    setUpgradedLandmark(null);
    commitRun(createCloudlineRun(Date.now()));
    setBoost(1);
  };
  const resetCareer = () => {
    setFlight(null);
    setCargoChoice(null);
    setFeedback(null);
    setUpgradedLandmark(null);
    reset();
    setRun(createCloudlineRun(Date.now()));
    setBoost(1);
  };
  const flyRoute = () => {
    const next = rollFlight(run, boost);
    const roll = next.lastRoll;
    if (roll === null) return;
    const eventPosition = (run.position + roll) % SKYWAY_STOPS;
    const eventKind = SKYWAY[eventPosition].kind;
    if (prefersReducedMotion()) {
      commitWithoutMotionFeedback(next);
      return;
    }
    setFeedback(null);
    setFlight({ next, path: buildFlightPath(run.position, roll), step: 0, eventKind });
  };
  const chooseCargo = (index: number) => {
    const next = resolveCargo(run, index);
    const reward = next.credits - run.credits;
    if (prefersReducedMotion()) {
      commitWithoutMotionFeedback(next);
      return;
    }
    setCargoChoice({ index, next, reward });
  };
  const finishCargoChoice = (index: number) => {
    if (!cargoChoice || cargoChoice.index !== index) return;
    const current = cargoChoice;
    setCargoChoice(null);
    commitRun(current.next);
    showFeedback('cargo', `+${current.reward} credits`);
  };
  const upgrade = (index: number) => {
    const next = upgradeLandmark(run, index);
    if (prefersReducedMotion()) {
      commitWithoutMotionFeedback(next);
      return;
    }
    const districtComplete = next.district !== run.district;
    commitRun(next);
    setUpgradedLandmark(index);
    showFeedback(districtComplete ? 'district' : 'upgrade', districtComplete ? 'District rebuilt' : `${LANDMARK_NAMES[index]} upgraded`);
  };

  const flightPosition = flight
    ? flight.step === 0
      ? run.position
      : flight.path[Math.min(flight.step - 1, flight.path.length - 1)]
    : run.position;
  const flightPoint = ROUTE_POINTS[flightPosition];
  const flightStyle = flight ? {
    '--cl-flight-x': `${flightPoint[0]}cqw`,
    '--cl-flight-y': `${flightPoint[1]}cqw`,
  } as CSSProperties : undefined;
  const boardImpact = feedback?.kind ?? 'none';

  return <section
    className="cl"
    aria-labelledby="cl-title"
    data-flight-state={isFlying ? 'flying' : 'idle'}
    data-flight-step={flight?.step ?? 0}
    data-flight-total={flight?.path.length ?? 0}
  >
    <header className="cl-hero">
      <div>
        <h2 id="cl-title">Cloudline Couriers</h2>
        <p className="cl-purpose">Deliver cargo. Earn credits. Rebuild the district.</p>
        <p>Choose a boost, fly clockwise around the route, and use delivery credits to upgrade all four landmarks.</p>
      </div>
      <div className="cl-hero-ship" aria-hidden="true"><AirshipSprite /></div>
    </header>

    <section className="cl-brief" aria-labelledby="cl-job-title">
      <div>
        <h3 id="cl-job-title">Current job</h3>
        <p>{currentJob}</p>
        <p className="cl-progress">Landmark work: {completedStages} of 16 stages complete in district {run.district}.</p>
      </div>
      <details className="cl-help">
        <summary>How to play</summary>
        <ol>
          <li><strong>Choose a boost.</strong> 1× uses 1 fuel. 2× and 3× use more fuel and multiply delivery credits.</li>
          <li><strong>Select Fly route.</strong> The die moves your airship clockwise to a stop.</li>
          <li><strong>Read the landing result.</strong> Markets pay credits, Workshops restore fuel, Beacons block one storm, and Cargo Caches ask you to choose a pod.</li>
          <li><strong>Spend credits on landmark upgrades.</strong> Raise all four landmarks to stage 4 to rebuild the district and move on.</li>
        </ol>
      </details>
    </section>

    <dl className="cl-stats">
      <div data-pulse={Boolean(feedback && ['dispatch', 'market', 'storm', 'cargo', 'upgrade', 'district'].includes(feedback.kind))}><dt>Credits</dt><dd>{run.credits}</dd></div>
      <div data-pulse={Boolean(feedback && ['workshop', 'district'].includes(feedback.kind))}><dt>Fuel</dt><dd>{run.fuel}</dd></div>
      <div data-pulse={feedback?.kind === 'district'}><dt>District</dt><dd>{run.district}</dd></div>
      <div data-pulse={Boolean(feedback && ['beacon', 'storm'].includes(feedback.kind))}><dt>Storm shield</dt><dd>{run.shield ? 'Ready' : 'Empty'}</dd></div>
    </dl>

    <div className="cl-layout"><div>
      <div className="cl-board" aria-label="Sixteen-stop skyway" data-impact={boardImpact}>
        {SKYWAY.map((tile, index) => <div
          className={`cl-tile cl-tile-${index}`}
          data-kind={tile.kind}
          data-active={!isFlying && run.position === index}
          data-flight-active={isFlying && flightPosition === index}
          key={tile.name + index}
        >
          <TileSprite kind={tile.kind} />
          <div className="cl-tile-copy"><strong>{tile.name}</strong><span>{tile.kind}</span></div>
          {!isFlying && run.position === index && <div className="cl-courier" aria-label="Courier position"><AirshipSprite /></div>}
        </div>)}

        {flight && <div
          className="cl-flight-courier"
          data-position={flightPosition}
          data-step={flight.step}
          style={flightStyle}
          aria-hidden="true"
        ><AirshipSprite /></div>}

        {feedback && <div
          className="cl-effect"
          data-kind={feedback.kind}
          key={feedback.id}
          aria-hidden="true"
          onAnimationEnd={(event: AnimationEvent<HTMLDivElement>) => {
            if (event.target !== event.currentTarget || event.animationName !== 'cl-effect-pop') return;
            setFeedback(null);
            setUpgradedLandmark(null);
          }}
        ><span>{feedback.label}</span></div>}

        <div className="cl-center">
          <span className="cl-center-label">Last flight</span>
          <strong className={isFlying ? 'cl-roll-number' : undefined}>{flight?.next.lastRoll ?? run.lastRoll ?? '—'}</strong>
          <span>{flight?.next.lastRoll || run.lastRoll ? 'spaces rolled' : 'No flight yet'}</span>
          <div className="cl-boost" role="group" aria-label="Flight boost">{([1, 2, 3] as const).map(value => <button type="button" key={value} disabled={isBusy} aria-pressed={boost === value} onClick={() => setBoost(value)}>{value}×</button>)}</div>
          <button type="button" className="cl-fly" disabled={isBusy || Boolean(run.pendingCargo) || run.fuel < boost} onClick={flyRoute}>Fly route</button>
          {flight && <button type="button" className="cl-skip-flight" onClick={() => finishFlight(flight)}>Skip flight</button>}
          <small>{run.pendingCargo ? 'Choose a cargo pod before the next flight.' : isFlying ? `Flying stop ${Math.min(flight.step, flight.path.length)} of ${flight.path.length}.` : `Boost ${boost}× uses ${boost} fuel. Delivery streak ${run.streak}/4.`}</small>
        </div>
      </div>

      <p className="cl-status" role="status" aria-live="polite">{isFlying ? flight.step >= flight.path.length ? 'Landing…' : `Flying ${flight.next.lastRoll ?? ''} spaces…` : run.message}</p>

      {run.pendingCargo && <div className="cl-cache" aria-labelledby="cl-cache-title">
        <div><h3 id="cl-cache-title">Cargo cache</h3><p>Choose one sealed pod to finish this stop. Each pod pays credits.</p></div>
        <div className="cl-pods">{run.pendingCargo.options.map((_, index) => <button
          type="button"
          key={index}
          disabled={isFlying || cargoChoice !== null}
          data-selected={cargoChoice?.index === index}
          data-muted={cargoChoice !== null && cargoChoice.index !== index}
          onClick={() => chooseCargo(index)}
          onAnimationEnd={(event: AnimationEvent<HTMLButtonElement>) => {
            if (event.target === event.currentTarget && event.animationName === 'cl-pod-select') finishCargoChoice(index);
          }}
        ><CargoPodSprite index={index} /><span>Choose pod {index + 1}</span></button>)}</div>
      </div>}
    </div><aside>
      <div className="cl-aside-head"><h3>Rebuild the district</h3><p>Upgrade each landmark to stage 4. Finishing all four unlocks the next district.</p></div>
      {LANDMARK_NAMES.map((name, index) => {
        const cost = landmarkCost(run, index);
        return <div className="cl-landmark" key={name} data-upgraded={upgradedLandmark === index}>
          <LandmarkSprite index={index} stage={run.landmarks[index]} />
          <div><strong>{name}</strong><span>Stage {run.landmarks[index]}/4</span></div>
          <button type="button" disabled={isBusy || cost === null || run.credits < (cost ?? 0)} onClick={() => upgrade(index)}>{cost === null ? 'Complete' : `Upgrade for ${cost} credits`}</button>
        </div>;
      })}
      <p className="cl-route-meta">Delivery streak <strong>{run.streak}/4</strong>. Completed circuits <strong>{run.circuits}</strong>.</p>
      <details><summary>Route options</summary><div className="cl-route-actions"><button type="button" disabled={isBusy} onClick={startFreshRoute}>Start fresh route</button><button type="button" disabled={isBusy} onClick={resetCareer}>Reset saved career</button></div></details>
    </aside></div>
  </section>;
}
