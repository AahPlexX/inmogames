export type GameCategory = 'puzzle' | 'arcade' | 'strategy' | 'card-board' | 'word' | 'sandbox';

export interface GameMeta {
  /** Lowercase kebab-case, unique, stable once published. */
  slug: string;
  name: string;
  summary: string;
  category: GameCategory;
  players: 'single' | 'hot-seat';
  storage: 'none' | 'localStorage' | 'indexedDB';
}
