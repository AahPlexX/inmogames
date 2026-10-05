import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const gamesDir = 'src/games';
const specsDir = 'docs/specs';
const index = readFileSync('docs/GAME_INDEX.md', 'utf8');
const problems = [];

const slugs = readdirSync(gamesDir).filter((name) => statSync(join(gamesDir, name)).isDirectory());

function section(content, heading) {
  const marker = `## ${heading}`;
  const start = content.indexOf(marker);
  if (start < 0) return null;
  const tail = content.slice(start + marker.length);
  const nextHeading = tail.search(/\n## /);
  return nextHeading < 0 ? tail : tail.slice(0, nextHeading);
}

function specFilesFor(slug) {
  if (!existsSync(specsDir)) return [];
  const escaped = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`^\\d{4}-\\d{2}-\\d{2}-${escaped}-design\\.md$`);
  return readdirSync(specsDir).filter((name) => pattern.test(name));
}

for (const slug of slugs) {
  const dir = join(gamesDir, slug);
  const trackerPath = join(dir, 'TRACKER.md');
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) problems.push(`${slug}: slug must be kebab-case`);
  if (!existsSync(join(dir, `${slug}.meta.ts`))) problems.push(`${slug}: missing ${slug}.meta.ts`);
  if (!existsSync(trackerPath)) problems.push(`${slug}: missing TRACKER.md`);
  if (!readdirSync(dir).some((f) => f.endsWith('Workspace.tsx'))) problems.push(`${slug}: missing *Workspace.tsx`);

  const indexLine = index.split('\n').find((line) => line.includes(`\`${slug}\``));
  if (!indexLine) problems.push(`${slug}: missing from docs/GAME_INDEX.md`);

  const specs = specFilesFor(slug);
  if (specs.length === 0) {
    problems.push(`${slug}: missing authoritative spec sheet docs/specs/YYYY-MM-DD-${slug}-design.md`);
  } else if (specs.length > 1) {
    problems.push(`${slug}: multiple authoritative spec sheets found; keep exactly one dated ${slug} design spec`);
  }

  if (!existsSync(trackerPath)) continue;
  const tracker = readFileSync(trackerPath, 'utf8');
  if (!tracker.includes('**Last synchronized:**')) problems.push(`${slug}: TRACKER.md missing Last synchronized`);
  if (!tracker.includes('## Current handoff')) problems.push(`${slug}: TRACKER.md missing Current handoff`);
  for (const marker of ['**Implementation state:**', '**Last verified revision:**', '**Open game-local work:**', '**External blockers:**', '**Next action:**']) {
    if (!tracker.includes(marker)) problems.push(`${slug}: TRACKER.md missing handoff field ${marker}`);
  }

  if (specs.length !== 1) continue;
  const specPath = `docs/specs/${specs[0]}`;
  const spec = readFileSync(specPath, 'utf8');
  if (!tracker.includes(`**Spec:** \`${specPath}\``)) problems.push(`${slug}: TRACKER.md must reference authoritative spec ${specPath}`);
  if (!spec.includes('**Last synchronized:**')) problems.push(`${slug}: spec missing Last synchronized`);
  if (!spec.includes('## Completion contract')) problems.push(`${slug}: spec missing Completion contract`);
  if (!spec.includes('**Completion state:**')) problems.push(`${slug}: spec missing Completion state`);
  if (!spec.includes('**Completion evidence:**')) problems.push(`${slug}: spec missing Completion evidence`);

  const completion = section(spec, 'Completion contract');
  if (!completion) continue;
  const checklist = [...completion.matchAll(/^- \[( |x)\] /gim)];
  if (checklist.length < 6) problems.push(`${slug}: Completion contract must contain at least six explicit checklist gates`);

  const stateMatch = completion.match(/\*\*Completion state:\*\*\s*(implementing|verified)\b/i);
  if (!stateMatch) {
    problems.push(`${slug}: Completion state must be implementing or verified`);
    continue;
  }

  const state = stateMatch[1].toLowerCase();
  const indexVerified = Boolean(indexLine?.toLowerCase().includes('verified game'));
  if (state === 'verified') {
    if (checklist.some((match) => match[1] !== 'x' && match[1] !== 'X')) problems.push(`${slug}: verified Completion contract contains unchecked gates`);
    if (/\|\s*(planned|started)\s*\|/i.test(tracker)) problems.push(`${slug}: verified game tracker still contains planned or started capabilities`);
    if (/\|\s*blocked\s*\|/i.test(tracker)) problems.push(`${slug}: verified game tracker contains a game-local blocked capability`);
    if (!indexVerified) problems.push(`${slug}: Completion state is verified but GAME_INDEX does not say verified game`);
  } else if (indexVerified) {
    problems.push(`${slug}: GAME_INDEX says verified game while Completion state is implementing`);
  }
}

if (problems.length > 0) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`game-check: ${slugs.length} game(s) OK`);
