import { describe, expect, it } from 'vitest';
import { games } from '../../src/catalog';

describe('game catalog', () => {
  it('has unique kebab-case slugs', () => {
    const slugs = games.map((g) => g.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('has a name and summary for every game', () => {
    for (const g of games) {
      expect(g.name.trim()).not.toBe('');
      expect(g.summary.trim()).not.toBe('');
    }
  });
});
