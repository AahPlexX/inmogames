import { Suspense, useEffect, useState } from 'react';
import { games } from './catalog';
import { GameLayout } from './components/GameLayout';
import { workspaces } from './games/workspaces';

const ROUTE = /^#\/games\/([a-z0-9-]+)$/;

function readSlug(): string | null {
  const match = ROUTE.exec(window.location.hash);
  return match ? match[1] : null;
}

export default function App() {
  const [slug, setSlug] = useState<string | null>(readSlug);

  useEffect(() => {
    const onHashChange = () => setSlug(readSlug());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const game = games.find((g) => g.slug === slug);
  const Workspace = slug ? workspaces[slug] : undefined;

  if (game && Workspace) {
    return (
      <GameLayout game={game}>
        <Suspense fallback={<p role="status">Loading game</p>}>
          <Workspace />
        </Suspense>
      </GameLayout>
    );
  }

  return (
    <div className="shell">
      <header className="shell-header">
        <h1>InMo Games</h1>
        <p>Local-first browser games. No accounts, no server.</p>
      </header>
      <main className="shell-main">
        {slug && <p role="alert">No game named "{slug}".</p>}
        {games.length === 0 ? (
          <p>No games yet.</p>
        ) : (
          <ul className="catalog">
            {games.map((g) => (
              <li key={g.slug}>
                <a href={`#/games/${g.slug}`}>
                  <strong>{g.name}</strong>
                  <span>{g.summary}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
