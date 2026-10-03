import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const gamesDir = 'src/games';
const index = readFileSync('docs/GAME_INDEX.md', 'utf8');
const problems = [];

const slugs = readdirSync(gamesDir).filter((name) => statSync(join(gamesDir, name)).isDirectory());

for (const slug of slugs) {
  const dir = join(gamesDir, slug);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) problems.push(`${slug}: slug must be kebab-case`);
  if (!existsSync(join(dir, `${slug}.meta.ts`))) problems.push(`${slug}: missing ${slug}.meta.ts`);
  if (!existsSync(join(dir, 'TRACKER.md'))) problems.push(`${slug}: missing TRACKER.md`);
  if (!readdirSync(dir).some((f) => f.endsWith('Workspace.tsx'))) problems.push(`${slug}: missing *Workspace.tsx`);
  if (!index.includes(`\`${slug}\``)) problems.push(`${slug}: missing from docs/GAME_INDEX.md`);
}

if (problems.length > 0) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`game-check: ${slugs.length} game(s) OK`);
