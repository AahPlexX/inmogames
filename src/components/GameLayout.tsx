import type { ReactNode } from 'react';
import type { GameMeta } from '../game-meta';

export function GameLayout({ game, children }: { game: GameMeta; children: ReactNode }) {
  return (
    <div className="shell">
      <header className="shell-header">
        <a href="#/">All games</a>
        <h1>{game.name}</h1>
        <p>{game.summary}</p>
      </header>
      <main className="shell-main">{children}</main>
    </div>
  );
}
