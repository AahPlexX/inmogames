import { Suspense, useEffect, useState } from 'react';
import { games } from './catalog';
import { GameLayout } from './components/GameLayout';
import { SiteHeader } from './components/SiteHeader';
import { SkipToContent } from './components/SkipToContent';
import { workspaces } from './games/workspaces';

const ROUTE = /^#\/games\/([a-z0-9-]+)$/;

function readSlug(): string | null {
  const match = ROUTE.exec(window.location.hash);
  return match ? match[1] : null;
}

function categoryName(value: string) {
  return value === 'card-board' ? 'Cards' : value.charAt(0).toUpperCase() + value.slice(1);
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
        <Suspense fallback={<p className="loading-state" role="status">Loading game…</p>}>
          <Workspace />
        </Suspense>
      </GameLayout>
    );
  }

  return (
    <div className="shell">
      <SkipToContent label="Skip to games" />
      <SiteHeader />
      <main id="main-content" className="shell-main" tabIndex={-1}>
        <section className="catalog-hero" aria-labelledby="catalog-title">
          <p className="eyebrow">Game shelf</p>
          <h1 id="catalog-title">Choose a table.</h1>
          <p>Focused browser games with no sign-in wall. Play as a guest, or use an account when you want progress to follow you.</p>
        </section>
        {slug && <p className="inline-alert" role="alert">No game named “{slug}”. Pick one from the shelf below.</p>}
        {games.length === 0 ? (
          <p className="empty-state">No games are on the shelf yet.</p>
        ) : (
          <ul className="catalog">
            {games.map((g) => (
              <li key={g.slug}>
                <a className="game-card" data-game={g.slug} href={'#/games/' + g.slug}>
                  <span className="catalog-art" data-game={g.slug} aria-hidden="true">
                    <span className="catalog-glyph">{g.slug === 'threefold' ? 'Σ3' : g.slug === 'royal-palace-blackjack' ? '21' : '▶'}</span>
                  </span>
                  <span className="game-card-body">
                    <span className="game-card-meta">
                      <span>{categoryName(g.category)}</span>
                      <span>{g.players === 'single' ? 'Solo' : 'Hot-seat'}</span>
                    </span>
                    <h2 className="game-card-title">{g.name}</h2>
                    <span className="game-card-summary">{g.summary}</span>
                    <span className="game-card-cta">Play game <span aria-hidden="true">→</span></span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
