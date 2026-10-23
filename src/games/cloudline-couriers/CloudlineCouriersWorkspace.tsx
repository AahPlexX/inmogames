import { useEffect, useRef, useState, type AnimationEvent, type CSSProperties } from 'react';
import { useGameSave } from '../../platform/PlatformProvider';
import { SaveStatus } from '../../platform/SaveStatus';
import {
  buildFlightPath,
  createCloudlineRun,
  LANDMARK_NAMES,
  MAX_FUEL,
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
type CargoChoice = { index: number; reward: number };

export default function CloudlineCouriersWorkspace() {
  const progress = useGameSave(cloudlineCouriersSaveDefinition);
  return <>
    <SaveStatus {...progress} />
    {progress.scope !== 'guest' && !progress.ready && <p className="cl-load-warning inline-alert" role="status">Account progress is loading. You can play using this browser’s progress; the account save will replace it when loading finishes.</p>}
    <CloudlineGame key={`${progress.scope}:${progress.ready}:${progress.revision}`} initial={progress.state} persist={progress.save} reset={progress.reset} />
  </>;

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
      : run.district === 1 && completedStages === 0 && firstLandmarkCost !== null && run.credits >= firstLandmarkCost
        ? `First delivery complete. Upgrade ${LANDMARK_NAMES[0]} for ${firstLandmarkCost} credits.`
        : run.district === 1 && completedStages > 0
          ? `Delivery bonus: complete 4 deliveries without an unshielded storm. Current streak ${run.streak}/4. The fourth delivery pays an extra ${120 * boost} credits at ${boost}×.`
          : canUpgrade
            ? 'Upgrade a landmark, or fly again to earn more credits.'
            : 'Fly the route to earn credits for your next landmark upgrade.';

  const showFeedback = (kind: FeedbackKind, label: string) => {
    feedbackSequence.current += 1;
    setFeedback({ id: feedbackSequence.current, kind, label });
  };
  const commitRun = (next: CloudlineRun) => {
    setRun(next);
    setBoost(current => Math.min(current, next.fuel) as 1 | 2 | 3);
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
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reduceMotion = () => {
      if (!motion.matches) return;
      setFeedback(null);
      setUpgradedLandmark(null);
      if (flight) {
        setFlight(null);
        commitRun(flight.next);
      }
    };
    motion.addEventListener('change', reduceMotion);
    let timer: number | undefined;
    if (flight) {
      if (motion.matches) {
        reduceMotion();
      } else {
        const atDestination = flight.step >= flight.path.length;
        const delay = atDestination ? 120 : flight.step === 0 ? 70 : 165;
        timer = window.setTimeout(() => {
          if (atDestination) {
            finishFlight(flight);
            return;
          }
          setFlight(current => current ? { ...current, step: current.step + 1 } : null);
        }, delay);
      }
    }
    return () => {
      window.clearTimeout(timer);
      motion.removeEventListener('change', reduceMotion);
    };
  }, [flight]);

  const startFreshRoute = () => {
    if (!window.confirm('Start a fresh route? This replaces all saved Cloudline Couriers progress, including landmark upgrades.')) return;
    setFlight(null);
    setCargoChoice(null);
    setFeedback(null);
    setUpgradedLandmark(null);
    commitRun(createCloudlineRun(Date.now()));
    setBoost(1);
  };
  const resetCareer = () => {
    if (!window.confirm('Reset saved career? This removes all Cloudline Couriers progress, including landmark upgrades.')) return;
    setFlight(null);
    setCargoChoice(null);
    setFeedback(null);
    setUpgradedLandmark(null);
    reset();
    setRun(createCloudlineRun(Date.now()));
    setBoost(1);
  };
  const flyRoute = () => {
    setCargoChoice(null);
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
    // Reward settlement must not depend on animationend: reduced motion can change during an action.
    commitRun(next);
    setCargoChoice({ index, reward });
    if (prefersReducedMotion()) {
      setFeedback(null);
      setUpgradedLandmark(null);
    } else {
      showFeedback('cargo', `+${reward} credits`);
    }
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
    <section className="cl-brief" aria-labelledby="cl-job-title">
      <div>
        <h2 id="cl-title">Rebuild district {run.district}</h2>
        <p className="cl-purpose">Deliver cargo. Earn credits. Rebuild the district.</p>
        <h3 id="cl-job-title">Current job</h3>
        <p>{currentJob}</p>
        <p className="cl-progress">Landmark work: {completedStages} of 16 stages complete in district {run.district}.</p>
      </div>
      <details className="cl-help">
        <summary>How to play</summary>
        <ol>
          <li><strong>Choose a boost.</strong> 1× uses 1 fuel. 2× uses 2 fuel and doubles delivery credits; 3× uses 3 fuel and triples them. Boost does not change the die or cargo-pod rewards.</li>
          <li><strong>Select Fly route.</strong> The die moves your airship 1–6 stops clockwise. Completing a circuit pays 100 × district × boost credits.</li>
          <li><strong>Read the landing result.</strong> Markets and Dispatch pay credits. Workshops restore fuel. Beacons block one storm. An unshielded storm costs credits and resets the delivery streak. Windgates carry you 2 more stops without triggering another event. Cargo Caches ask you to choose one pod for credits.</li>
          <li><strong>Spend credits on landmark upgrades.</strong> Raise all four landmarks to stage 4 to rebuild the district and move on. Every fourth delivery in a streak pays a bonus; storms only reset it when you have no shield. If fuel reaches zero, 3 reserve fuel lets you keep flying.</li>
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
          role="img"
          aria-label={`Stop ${index + 1}: ${tile.name}, ${tile.kind}${!isFlying && run.position === index ? ' — courier here' : ''}`}
          data-kind={tile.kind}
          data-active={!isFlying && run.position === index}
          data-flight-active={isFlying && flightPosition === index}
          key={tile.name + index}
        >
          <span className="cl-stop-number" aria-hidden="true">{index + 1}</span>
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

        <div className="cl-center" aria-hidden="true">
          <div className="cl-district-art">{LANDMARK_NAMES.map((name, index) => <LandmarkSprite key={name} index={index} stage={run.landmarks[index]} />)}</div>
        </div>
      </div>

      <div className="cl-controls">
        <p className="cl-flight-result">{isFlying ? `Flying to ${SKYWAY[flightPosition].name}…` : `At ${SKYWAY[run.position].name}. ${run.lastRoll ? `Last flight: ${run.lastRoll} stops.` : 'No flight yet.'}`}</p>
        <span id="cl-boost-label">Choose a boost</span>
        <div className="cl-boost" aria-describedby="cl-boost-cost" role="group" aria-labelledby="cl-boost-label">{([1, 2, 3] as const).map(value => <button type="button" key={value} disabled={isFlying || run.fuel < value} title={`${value}× uses ${value} fuel`} aria-pressed={boost === value} onClick={() => setBoost(value)}>{value}×</button>)}</div>
        <button type="button" className="cl-fly" disabled={isFlying || Boolean(run.pendingCargo) || run.fuel < boost} onClick={flyRoute}>Fly route</button>
        {flight && <button type="button" className="cl-skip-flight" onClick={() => finishFlight(flight)}>Skip flight</button>}
        <small id="cl-boost-cost">{run.pendingCargo ? 'Choose a cargo pod before the next flight.' : isFlying ? `Flying stop ${Math.min(flight.step, flight.path.length)} of ${flight.path.length}.` : `Boost ${boost}× uses ${boost} fuel. Fuel remaining: ${run.fuel}/${MAX_FUEL}.`}</small>
      </div>

      <p className="cl-status" role="status" aria-live="polite">{isFlying ? flight.step >= flight.path.length ? 'Landing…' : `Flying ${flight.next.lastRoll ?? ''} spaces…` : run.message}</p>

      {(run.pendingCargo || cargoChoice) && <div className="cl-cache" aria-labelledby="cl-cache-title">
        <div><h3 id="cl-cache-title">Cargo cache</h3><p>{cargoChoice ? `Pod ${cargoChoice.index + 1} delivered. +${cargoChoice.reward} credits. Fly the route to continue.` : 'Choose one sealed pod to finish this stop. Each pod pays credits; boost does not multiply this reward.'}</p></div>
        <div className="cl-pods">{[0, 1, 2].map(index => <button
          type="button"
          key={index}
          disabled={isFlying || !run.pendingCargo}
          data-selected={cargoChoice?.index === index}
          data-muted={cargoChoice !== null && cargoChoice.index !== index}
          onClick={() => chooseCargo(index)}
        ><CargoPodSprite index={index} /><span>{cargoChoice?.index === index ? `Delivered +${cargoChoice.reward}` : `Choose pod ${index + 1}`}</span></button>)}</div>
      </div>}
    </div><aside>
      <div className="cl-aside-head"><h3>Rebuild the district</h3><p>Upgrade each landmark to stage 4. Finishing all four unlocks the next district.</p></div>
      {LANDMARK_NAMES.map((name, index) => {
        const cost = landmarkCost(run, index);
        return <div className="cl-landmark" key={name} data-upgraded={upgradedLandmark === index}>
          <LandmarkSprite index={index} stage={run.landmarks[index]} />
          <div><strong>{name}</strong><span>Stage {run.landmarks[index]}/4</span></div>
          <button type="button" disabled={isFlying || Boolean(run.pendingCargo) || cost === null || run.credits < (cost ?? 0)} onClick={() => upgrade(index)}>{cost === null ? 'Complete' : `Upgrade for ${cost} credits`}</button>
        </div>;
      })}
      <p className="cl-route-meta">Delivery streak <strong>{run.streak}/4</strong>. Completed circuits <strong>{run.circuits}</strong>.</p>
      <details><summary>Route options</summary><div className="cl-route-actions"><button type="button" disabled={isFlying} onClick={startFreshRoute}>Start fresh route</button><button type="button" disabled={isFlying} onClick={resetCareer}>Reset saved career</button></div></details>
    </aside></div>
  </section>;
}
