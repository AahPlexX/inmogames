import type { ReactNode } from 'react';
import type { GameMeta } from '../game-meta';
import { SiteHeader } from './SiteHeader';
import { SkipToContent } from './SkipToContent';

export function GameLayout({ game, children }: { game: GameMeta; children: ReactNode }) {
  return (
    <div className="shell shell--game">
      <SkipToContent label="Skip to game" />
      <SiteHeader game={game} />
      <main id="main-content" className="shell-main game-main" tabIndex={-1}>{children}</main>
    </div>
  );
}
