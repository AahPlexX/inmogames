export const MERGROVE_TIER_NAMES = [
  'Seed',
  'Sprout',
  'Bud',
  'Bloom',
  'Sapling',
  'Lantern Tree',
  'Elder Tree',
  'Groveheart',
] as const;

export function tierName(tier: number): string {
  return MERGROVE_TIER_NAMES[tier - 1] ?? `Tier ${tier}`;
}

export function MergroveSpriteBank() {
  return (
    <svg className="mg-sprite-bank" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="mg-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c8f18d" />
          <stop offset="0.52" stopColor="#5eb56d" />
          <stop offset="1" stopColor="#2f744d" />
        </linearGradient>
        <linearGradient id="mg-leaf-deep" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#79cf78" />
          <stop offset="1" stopColor="#1f5a43" />
        </linearGradient>
        <linearGradient id="mg-bark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d79a5b" />
          <stop offset="0.55" stopColor="#985d3c" />
          <stop offset="1" stopColor="#573529" />
        </linearGradient>
        <radialGradient id="mg-gold" cx="40%" cy="32%" r="72%">
          <stop offset="0" stopColor="#fff3a5" />
          <stop offset="0.42" stopColor="#f0c64e" />
          <stop offset="1" stopColor="#c56f2f" />
        </radialGradient>
        <radialGradient id="mg-magic" cx="50%" cy="42%" r="62%">
          <stop offset="0" stopColor="#f7ffd8" />
          <stop offset="0.38" stopColor="#9de8b3" />
          <stop offset="1" stopColor="#2f8c77" />
        </radialGradient>
        <filter id="mg-shadow" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#07150f" floodOpacity=".3" />
        </filter>
      </defs>

      <symbol id="mg-tier-1" viewBox="0 0 96 96">
        <g filter="url(#mg-shadow)">
          <path d="M31 60c0-18 9-31 17-31s17 13 17 31c0 14-7 23-17 23S31 74 31 60Z" fill="url(#mg-bark)" stroke="#3f2a22" strokeWidth="3" />
          <path d="M48 31c1-10 7-17 17-19-1 11-6 18-17 20Z" fill="url(#mg-leaf)" stroke="#295c42" strokeWidth="2.5" />
          <path d="M39 52c5 3 13 3 18 0" fill="none" stroke="#f3c985" strokeWidth="3" strokeLinecap="round" opacity=".75" />
          <circle cx="42" cy="63" r="2.5" fill="#2c201c" /><circle cx="55" cy="63" r="2.5" fill="#2c201c" />
        </g>
      </symbol>

      <symbol id="mg-tier-2" viewBox="0 0 96 96">
        <g filter="url(#mg-shadow)">
          <path d="M48 79V39" stroke="#6a4931" strokeWidth="6" strokeLinecap="round" />
          <path d="M47 52C28 53 20 43 19 28c16 0 27 7 30 21Z" fill="url(#mg-leaf)" stroke="#265e43" strokeWidth="3" />
          <path d="M49 43c17-1 26-10 28-24-16-1-27 7-30 21Z" fill="url(#mg-leaf-deep)" stroke="#265e43" strokeWidth="3" />
          <path d="M37 82h22" stroke="#3f6a45" strokeWidth="5" strokeLinecap="round" />
          <circle cx="45" cy="65" r="2.5" fill="#163c2e" /><circle cx="53" cy="65" r="2.5" fill="#163c2e" />
        </g>
      </symbol>

      <symbol id="mg-tier-3" viewBox="0 0 96 96">
        <g filter="url(#mg-shadow)">
          <path d="M48 82V45" stroke="#704631" strokeWidth="7" strokeLinecap="round" />
          <path d="M47 61C31 63 23 55 22 43c13-1 22 5 26 16Z" fill="url(#mg-leaf-deep)" stroke="#245840" strokeWidth="3" />
          <path d="M49 56c16 1 24-7 27-19-14-2-23 4-28 16Z" fill="url(#mg-leaf)" stroke="#245840" strokeWidth="3" />
          <path d="M48 47c-13-7-15-22-2-33 15 7 18 21 4 34Z" fill="#e9946f" stroke="#914a43" strokeWidth="3" />
          <path d="M48 19c4 9 5 16 1 24" fill="none" stroke="#ffd5a8" strokeWidth="3" strokeLinecap="round" />
        </g>
      </symbol>

      <symbol id="mg-tier-4" viewBox="0 0 96 96">
        <g filter="url(#mg-shadow)">
          <path d="M48 80V52" stroke="#754a32" strokeWidth="7" strokeLinecap="round" />
          <g fill="#e98383" stroke="#8c434f" strokeWidth="2.5">
            <ellipse cx="48" cy="28" rx="11" ry="20" />
            <ellipse cx="48" cy="28" rx="11" ry="20" transform="rotate(60 48 38)" />
            <ellipse cx="48" cy="28" rx="11" ry="20" transform="rotate(120 48 38)" />
          </g>
          <circle cx="48" cy="39" r="10" fill="url(#mg-gold)" stroke="#9f6b2d" strokeWidth="3" />
          <path d="M47 65c-15 1-22-6-23-17 13-1 21 4 24 14Z" fill="url(#mg-leaf-deep)" stroke="#245840" strokeWidth="3" />
          <path d="M50 66c13 0 20-6 22-16-12-1-20 4-23 13Z" fill="url(#mg-leaf)" stroke="#245840" strokeWidth="3" />
        </g>
      </symbol>

      <symbol id="mg-tier-5" viewBox="0 0 96 96">
        <g filter="url(#mg-shadow)">
          <path d="M40 84c6-17 5-31 7-48h10c1 17 0 31 7 48Z" fill="url(#mg-bark)" stroke="#4e3428" strokeWidth="3" />
          <path d="M51 52 35 66M54 48l15 13" stroke="#76503a" strokeWidth="5" strokeLinecap="round" />
          <circle cx="34" cy="32" r="18" fill="url(#mg-leaf-deep)" stroke="#245840" strokeWidth="3" />
          <circle cx="58" cy="27" r="22" fill="url(#mg-leaf)" stroke="#245840" strokeWidth="3" />
          <circle cx="72" cy="43" r="17" fill="url(#mg-leaf-deep)" stroke="#245840" strokeWidth="3" />
          <circle cx="48" cy="43" r="20" fill="url(#mg-leaf)" stroke="#245840" strokeWidth="3" />
        </g>
      </symbol>

      <symbol id="mg-tier-6" viewBox="0 0 96 96">
        <g filter="url(#mg-shadow)">
          <path d="M37 86c8-20 7-39 10-58h12c2 19 1 38 10 58Z" fill="url(#mg-bark)" stroke="#4c3125" strokeWidth="3" />
          <path d="M53 58 29 42M55 53l22-18" stroke="#79513a" strokeWidth="6" strokeLinecap="round" />
          <g fill="url(#mg-leaf-deep)" stroke="#23573d" strokeWidth="2.5">
            <circle cx="27" cy="31" r="15" /><circle cx="46" cy="24" r="20" /><circle cx="69" cy="28" r="18" /><circle cx="74" cy="49" r="15" /><circle cx="44" cy="46" r="21" />
          </g>
          <g fill="url(#mg-gold)" stroke="#9c6928" strokeWidth="2">
            <circle cx="27" cy="32" r="6" /><circle cx="52" cy="20" r="6" /><circle cx="72" cy="39" r="6" />
          </g>
        </g>
      </symbol>

      <symbol id="mg-tier-7" viewBox="0 0 96 96">
        <g filter="url(#mg-shadow)">
          <path d="M31 88c11-17 12-35 12-50h19c0 16 2 34 13 50Z" fill="url(#mg-bark)" stroke="#432d24" strokeWidth="3" />
          <path d="M50 58 24 41M56 54l22-22M48 49 37 23" stroke="#80563b" strokeWidth="7" strokeLinecap="round" />
          <g fill="url(#mg-leaf-deep)" stroke="#1d5039" strokeWidth="2.5">
            <circle cx="22" cy="32" r="17" /><circle cx="38" cy="20" r="20" /><circle cx="61" cy="19" r="21" /><circle cx="78" cy="35" r="17" /><circle cx="68" cy="51" r="21" /><circle cx="39" cy="47" r="23" />
          </g>
          <path d="M47 68c4-5 9-5 13 0-2 7-11 7-13 0Z" fill="url(#mg-magic)" stroke="#286754" strokeWidth="2" />
        </g>
      </symbol>

      <symbol id="mg-tier-8" viewBox="0 0 96 96">
        <g filter="url(#mg-shadow)">
          <path d="M27 88c13-18 13-35 13-52h22c0 17 2 34 15 52Z" fill="url(#mg-bark)" stroke="#3d2921" strokeWidth="3" />
          <path d="M51 60 22 39M58 52l25-24M48 51 36 20" stroke="#8a5d3d" strokeWidth="7" strokeLinecap="round" />
          <path d="M49 69c-17-13-24-23-24-34 0-11 8-18 18-18 6 0 11 3 15 8 4-5 9-8 15-8 10 0 18 7 18 18 0 13-11 25-33 39Z" fill="url(#mg-magic)" stroke="#1f6856" strokeWidth="3" opacity=".96" />
          <path d="m48 16 5-9 5 9 10-3-3 10 9 5-9 5 3 10-10-3-5 9-5-9-10 3 3-10-9-5 9-5-3-10Z" fill="url(#mg-gold)" stroke="#9c6a2d" strokeWidth="2" />
          <circle cx="48" cy="52" r="8" fill="#f8ffe2" stroke="#4b9f77" strokeWidth="3" />
        </g>
      </symbol>
    </svg>
  );
}

export function MergroveSprite({ tier, className = '' }: { tier: number; className?: string }) {
  return (
    <svg className={`mg-spirit ${className}`.trim()} viewBox="0 0 96 96" aria-hidden="true" focusable="false">
      <use href={`#mg-tier-${tier}`} />
    </svg>
  );
}
