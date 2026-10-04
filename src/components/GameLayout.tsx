import type { ReactNode } from 'react';
import type { GameMeta } from '../game-meta';
import { SiteHeader } from './SiteHeader';

export function GameLayout({ game, children }: { game: GameMeta; children: ReactNode }) {
  return (
    <div className="shell shell--game">
      <SiteHeader game={game} />
      <main className="shell-main game-main">{children}</main>
    </div>
  );
}
