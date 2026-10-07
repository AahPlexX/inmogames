import type { TileKind } from './engine';

type SpriteProps = { className?: string; title?: string };

function Frame({ children, kind, className = '', title }: SpriteProps & { children: React.ReactNode; kind: string }) {
  return (
    <svg className={`cl-sprite ${className}`} data-cl-sprite={kind} viewBox="0 0 96 72" role="img" aria-label={title ?? kind}>
      <defs>
        <linearGradient id={`sky-${kind}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#dff7ff"/><stop offset="1" stopColor="#91c9ee"/></linearGradient>
        <linearGradient id={`brass-${kind}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffe49a"/><stop offset=".45" stopColor="#d28b35"/><stop offset="1" stopColor="#7c3f1c"/></linearGradient>
        <linearGradient id={`ink-${kind}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#36536d"/><stop offset="1" stopColor="#132c43"/></linearGradient>
        <filter id={`shadow-${kind}`} x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity=".28"/></filter>
      </defs>
      <rect x="2" y="2" width="92" height="68" rx="16" fill={`url(#sky-${kind})`} opacity=".32"/>
      <g filter={`url(#shadow-${kind})`}>{children}</g>
    </svg>
  );
}

export function AirshipSprite({ className = '' }: SpriteProps) {
  return <Frame kind="airship" className={`cl-airship-art ${className}`} title="Cloudline courier airship">
    <path d="M20 31C22 16 35 9 50 10c17 1 28 10 29 23-9 7-19 10-30 10-12 0-21-4-29-12Z" fill="#f6ead0" stroke="#233c54" strokeWidth="2"/>
    <path d="M28 29c5-8 12-12 22-12 9 0 16 3 21 9-13-4-28-3-43 3Z" fill="#fff8e8" opacity=".85"/>
    <path d="M33 43h32l-4 13H38Z" fill="url(#brass-airship)" stroke="#233c54" strokeWidth="2"/>
    <path d="M41 43v-7h17v7M47 36v-8h6v8" fill="none" stroke="#233c54" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="43" cy="49" r="3" fill="#9de8ff" stroke="#233c54" strokeWidth="1.5"/><circle cx="56" cy="49" r="3" fill="#9de8ff" stroke="#233c54" strokeWidth="1.5"/>
    <path d="M65 47l14 5-15 4M33 48l-13 4 14 4" fill="#d76d45" stroke="#233c54" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M39 58c3 4 17 4 21 0" fill="none" stroke="#fff1b8" strokeWidth="2" strokeLinecap="round"/>
  </Frame>;
}

const tileArt: Record<TileKind, React.ReactNode> = {
  dispatch: <><path d="M20 55h57M28 55V30l20-12 20 12v25" fill="#f5dfb2" stroke="#27445e" strokeWidth="2"/><path d="M39 55V39h18v16M48 18V8M48 9l14 7H48" fill="none" stroke="#27445e" strokeWidth="2"/><circle cx="48" cy="31" r="5" fill="#63c7d9" stroke="#27445e" strokeWidth="2"/></>,
  market: <><path d="M21 34h55l-5-14H27Z" fill="#f3b45c" stroke="#314a5f" strokeWidth="2"/><path d="M25 34v23h47V34M34 34v23M63 34v23" fill="#f7e8c8" stroke="#314a5f" strokeWidth="2"/><path d="M27 20h44" stroke="#fff2c7" strokeWidth="4" strokeDasharray="8 6"/><circle cx="48" cy="46" r="7" fill="#77c9a8" stroke="#314a5f" strokeWidth="2"/></>,
  workshop: <><path d="M22 55V30l18 8V26l17 9V23l17 8v24Z" fill="#a8b9c4" stroke="#263d52" strokeWidth="2"/><path d="M31 49h9v6h-9M48 46h9v9h-9M65 43h5v12h-5" fill="#ffd26f" stroke="#263d52" strokeWidth="1.5"/><path d="M27 29c2-9 9-13 14-9 4-8 13-7 16 1" fill="none" stroke="#eef7fb" strokeWidth="5" strokeLinecap="round"/></>,
  beacon: <><path d="M42 56h13l-3-34h-7Z" fill="#e9edf0" stroke="#29445a" strokeWidth="2"/><path d="M37 56h23M39 41h18M42 29h13" stroke="#29445a" strokeWidth="2"/><circle cx="48.5" cy="17" r="7" fill="#ffe87b" stroke="#29445a" strokeWidth="2"/><path d="M29 17h10M58 17h10M35 7l7 6M62 7l-7 6" stroke="#ffe87b" strokeWidth="3" strokeLinecap="round"/></>,
  storm: <><path d="M25 39c-7-11 4-22 15-18 6-12 25-8 25 5 12 0 16 17 5 22H30c-4-1-6-4-5-9Z" fill="#526b83" stroke="#20374d" strokeWidth="2"/><path d="M44 43l-6 12h8l-4 10 16-17h-9l5-5Z" fill="#ffd85e" stroke="#20374d" strokeWidth="1.5"/><path d="M27 56l-3 6M65 55l-3 7M74 52l-2 5" stroke="#6bc6e8" strokeWidth="3" strokeLinecap="round"/></>,
  windgate: <><path d="M24 57V29c0-11 9-20 20-20h8c11 0 20 9 20 20v28" fill="none" stroke="#c98b4d" strokeWidth="7"/><path d="M28 57h-9M77 57h-9" stroke="#6d4829" strokeWidth="5" strokeLinecap="round"/><path d="M34 28c8-6 20-6 28 0M31 38c11-7 24-7 34 0M35 48c8-5 18-5 26 0" fill="none" stroke="#f5fbff" strokeWidth="3" strokeLinecap="round"/></>,
  cargo: <><path d="M22 32l26-14 26 14-26 14Z" fill="#d99543" stroke="#293f53" strokeWidth="2"/><path d="M22 32v24l26 11 26-11V32L48 46Z" fill="#bd6e35" stroke="#293f53" strokeWidth="2"/><path d="M48 46v21M36 25l26 14" stroke="#f6d48c" strokeWidth="3"/><path d="M43 48h10v9H43Z" fill="#ffe87a" stroke="#293f53" strokeWidth="1.5"/></>,
};

export function TileSprite({ kind }: { kind: TileKind }) { return <Frame kind={`tile-${kind}`} title={`${kind} skyway stop`}>{tileArt[kind]}</Frame>; }

const landmarkArt = [
  <><path d="M20 58h58M27 58V31l21-14 21 14v27" fill="#f5e3bc" stroke="#28445d" strokeWidth="2"/><path d="M37 58V42h22v16M48 17V8l14 7" fill="none" stroke="#28445d" strokeWidth="2"/><path d="M31 34h34" stroke="#d77b45" strokeWidth="5"/></>,
  <><path d="M20 58h58M48 58V25" stroke="#355c48" strokeWidth="4"/><path d="M48 28c-17-17-27 4-11 10-14 5-5 21 11 10 15 11 25-5 11-10 17-7 6-27-11-10Z" fill="#7fc78b" stroke="#355c48" strokeWidth="2"/><circle cx="48" cy="38" r="7" fill="#f7d977"/></>,
  <><path d="M39 59h19l-4-39H43Z" fill="#d7e0e7" stroke="#29445b" strokeWidth="2"/><path d="M34 59h29M41 38h14" stroke="#29445b" strokeWidth="2"/><circle cx="48" cy="15" r="6" fill="#f6d766" stroke="#29445b" strokeWidth="2"/><path d="M25 15h13M58 15h13M30 4l10 7M66 4l-10 7" stroke="#f6d766" strokeWidth="3" strokeLinecap="round"/></>,
  <><path d="M20 58h58M27 58V35l18 7V28l24 10v20" fill="#7f9aa9" stroke="#263f53" strokeWidth="2"/><path d="M35 51h9v7M55 48h8v10" stroke="#ffd475" strokeWidth="4"/><path d="M34 27c2-8 9-12 15-7 5-7 15-5 17 3" fill="none" stroke="#edf7fa" strokeWidth="5" strokeLinecap="round"/></>,
] as const;

export function LandmarkSprite({ index, stage }: { index: number; stage: number }) {
  const safe = Math.max(0, Math.min(3, index));
  return <div className="cl-landmark-art" data-stage={stage}><Frame kind={`landmark-${safe}`} title={`Landmark stage ${stage}`}>{landmarkArt[safe]}</Frame><span className="cl-stage-pips" aria-hidden="true">{[1,2,3,4].map(n => <i key={n} data-filled={n <= stage}/>)}</span></div>;
}

export function CargoPodSprite({ index }: { index: number }) {
  return <svg className="cl-pod-art" data-cl-sprite={`cargo-pod-${index}`} viewBox="0 0 72 58" aria-hidden="true"><defs><linearGradient id={`pod-${index}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffe7a1"/><stop offset="1" stopColor="#c56f35"/></linearGradient></defs><path d="M12 21 36 8l24 13-24 13Z" fill={`url(#pod-${index})`} stroke="#263f53" strokeWidth="2"/><path d="M12 21v22l24 10 24-10V21L36 34Z" fill="#a95c34" stroke="#263f53" strokeWidth="2"/><path d="M31 35h10v9H31Z" fill="#ffec7a" stroke="#263f53" strokeWidth="1.5"/></svg>;
}
