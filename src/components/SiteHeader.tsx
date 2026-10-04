import { AccountControls } from '../platform/auth/AccountControls';
import type { GameMeta } from '../game-meta';

const categoryLabel: Record<GameMeta['category'], string> = {
  puzzle: 'Puzzle',
  arcade: 'Arcade',
  strategy: 'Strategy',
  'card-board': 'Cards',
  word: 'Word',
  sandbox: 'Sandbox',
};

export function SiteHeader({ game }: { game?: GameMeta }) {
  return (
    <header className={'shell-header' + (game ? ' shell-header--game' : '')}>
      <nav className="site-nav" aria-label="Primary">
        <a className="site-brand" href="#/" aria-label="InMo Games home">
          <span className="site-brand-mark" aria-hidden="true" />
          <span className="site-brand-copy"><strong>InMo</strong><small>Games</small></span>
        </a>
        {game ? <a className="back-link" href="#/">← Game shelf</a> : <span className="site-note">Play now · save if you want</span>}
      </nav>
      {game && (
        <div className="game-heading">
          <p className="eyebrow">{categoryLabel[game.category]} · {game.players === 'single' ? 'Solo' : 'Hot-seat'}</p>
          <h1>{game.name}</h1>
          <p>{game.summary}</p>
        </div>
      )}
      <AccountControls />
    </header>
  );
}
