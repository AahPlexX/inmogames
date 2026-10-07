import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { checkGameDocChangeSet } from './game-doc-sync-core.mjs';

const gamesDir = 'src/games';
const specsDir = 'docs/specs';
const indexPath = 'docs/GAME_INDEX.md';
const problems = [];

function git(args) { return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim(); }
function tryGit(args) { try { return git(args); } catch { return null; } }
function lines(value) { return value ? value.split('\n').map((line) => line.trim()).filter(Boolean) : []; }
function specPathFor(slug) {
  if (!existsSync(specsDir)) return null;
  const escaped = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matches = readdirSync(specsDir).filter((name) => new RegExp(`^\\d{4}-\\d{2}-\\d{2}-${escaped}-design\\.md$`).test(name));
  return matches.length === 1 ? `${specsDir}/${matches[0]}` : null;
}
function fileAt(ref, path) {
  if (!ref) { try { return readFileSync(path, 'utf8'); } catch { return ''; } }
  return tryGit(['show', `${ref}:${path}`]) ?? '';
}
function indexLine(content, slug) { return content.split('\n').find((line) => line.includes(`\`${slug}\``)) ?? ''; }
function testTouchesGame(path, ref, parentRef, slug) {
  if (!path.startsWith('tests/')) return false;
  if (path.includes(slug)) return true;
  const body = fileAt(ref, path) || fileAt(parentRef, path);
  return body.includes(`games/${slug}`) || body.includes(`#/games/${slug}`);
}

const slugs = existsSync(gamesDir) ? readdirSync(gamesDir).filter((name) => statSync(join(gamesDir, name)).isDirectory()) : [];
let base = process.env.GAME_DOC_SYNC_BASE?.trim() ?? '';
if (!base || /^0+$/.test(base)) base = tryGit(['rev-parse', 'HEAD^']) ?? '';

if (base && !tryGit(['rev-parse', '--verify', `${base}^{commit}`])) {
  problems.push(`repository history does not contain documentation-sync base ${base}; fetch sufficient history before validation`);
} else if (base) {
  const changedPaths = lines(tryGit(['diff', '--name-only', base, 'HEAD']) ?? '');
  const beforeIndex = fileAt(base, indexPath);
  const afterIndex = fileAt('HEAD', indexPath);
  problems.push(...checkGameDocChangeSet({
    label: `push ${base.slice(0, 8)}..HEAD`,
    changedPaths,
    slugs,
    specPathFor,
    indexLineChanged: (slug) => indexLine(beforeIndex, slug) !== indexLine(afterIndex, slug),
    testTouchesGame: (path, slug) => testTouchesGame(path, 'HEAD', base, slug),
  }));
}

const workingChanges = [...new Set([
  ...lines(tryGit(['diff', '--name-only', 'HEAD']) ?? ''),
  ...lines(tryGit(['diff', '--cached', '--name-only', 'HEAD']) ?? ''),
])];
if (workingChanges.length > 0) {
  const beforeIndex = fileAt('HEAD', indexPath);
  const afterIndex = fileAt(null, indexPath);
  problems.push(...checkGameDocChangeSet({
    label: 'working tree', changedPaths: workingChanges, slugs, specPathFor,
    indexLineChanged: (slug) => indexLine(beforeIndex, slug) !== indexLine(afterIndex, slug),
    testTouchesGame: (path, slug) => testTouchesGame(path, null, 'HEAD', slug),
  }));
}

if (problems.length > 0) { console.error(problems.join('\n')); process.exit(1); }
console.log('game-doc-sync: OK');
