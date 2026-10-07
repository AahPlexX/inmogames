import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const gamesDir = 'src/games';
const specsDir = 'docs/specs';
const indexPath = 'docs/GAME_INDEX.md';
const problems = [];
const perGameDocumentation = new Set(['TRACKER.md', 'PRD.md', 'todo.md']);

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function tryGit(args) {
  try { return git(args); } catch { return null; }
}

function lines(value) {
  return value ? value.split('\n').map((line) => line.trim()).filter(Boolean) : [];
}

function specPathFor(slug) {
  if (!existsSync(specsDir)) return null;
  const escaped = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`^\\d{4}-\\d{2}-\\d{2}-${escaped}-design\\.md$`);
  const matches = readdirSync(specsDir).filter((name) => pattern.test(name));
  return matches.length === 1 ? `${specsDir}/${matches[0]}` : null;
}

function fileAt(ref, path) {
  if (!ref) {
    try { return readFileSync(path, 'utf8'); } catch { return ''; }
  }
  return tryGit(['show', `${ref}:${path}`]) ?? '';
}

function indexLine(content, slug) {
  return content.split('\n').find((line) => line.includes(`\`${slug}\``)) ?? '';
}

function testTouchesGame(path, ref, parentRef, slug) {
  if (!path.startsWith('tests/')) return false;
  if (path.includes(slug)) return true;
  const body = fileAt(ref, path) || fileAt(parentRef, path);
  return body.includes(`games/${slug}`) || body.includes(`#/games/${slug}`);
}

function isGameImplementationPath(path, slug) {
  const prefix = `${gamesDir}/${slug}/`;
  if (!path.startsWith(prefix)) return false;
  return !perGameDocumentation.has(path.slice(prefix.length));
}

function checkChangeSet(label, changedPaths, ref, parentRef, slugs) {
  const changed = new Set(changedPaths);
  const indexChanged = changed.has(indexPath);
  const beforeIndex = indexChanged ? fileAt(parentRef, indexPath) : '';
  const afterIndex = indexChanged ? fileAt(ref, indexPath) : '';

  for (const slug of slugs) {
    const trackerPath = `${gamesDir}/${slug}/TRACKER.md`;
    const specPath = specPathFor(slug);
    if (!specPath) continue; // structural checker reports missing/duplicate specs.

    const trackerChanged = changed.has(trackerPath);
    const specChanged = changed.has(specPath);
    const implementationChanged = changedPaths.some((path) => isGameImplementationPath(path, slug));
    const testChanged = changedPaths.some((path) => testTouchesGame(path, ref, parentRef, slug));

    if ((implementationChanged || testChanged) && !(trackerChanged && specChanged)) {
      problems.push(`${label}: ${slug}: implementation/test changes require both spec and tracker updates in the same integration`);
    }

    if (trackerChanged !== specChanged) {
      problems.push(`${label}: ${slug}: spec and tracker must be updated together`);
    }

    if (indexChanged && indexLine(beforeIndex, slug) !== indexLine(afterIndex, slug) && !(trackerChanged && specChanged)) {
      problems.push(`${label}: ${slug}: GAME_INDEX row changes require both spec and tracker updates in the same integration`);
    }
  }
}

const slugs = existsSync(gamesDir)
  ? readdirSync(gamesDir).filter((name) => statSync(join(gamesDir, name)).isDirectory())
  : [];

let base = process.env.GAME_DOC_SYNC_BASE?.trim() ?? '';
if (!base || /^0+$/.test(base)) base = tryGit(['rev-parse', 'HEAD^']) ?? '';

if (base && !tryGit(['rev-parse', '--verify', `${base}^{commit}`])) {
  problems.push(`repository history does not contain documentation-sync base ${base}; fetch sufficient history before validation`);
} else if (base) {
  const commits = lines(tryGit(['rev-list', '--reverse', `${base}..HEAD`]) ?? '');
  for (const commit of commits) {
    const parent = tryGit(['rev-parse', `${commit}^`]);
    const changed = lines(tryGit(['diff-tree', '--no-commit-id', '--name-only', '-r', commit]) ?? '');
    checkChangeSet(`commit ${commit.slice(0, 8)}`, changed, commit, parent, slugs);
  }
}

const workingChanges = new Set([
  ...lines(tryGit(['diff', '--name-only', 'HEAD']) ?? ''),
  ...lines(tryGit(['diff', '--cached', '--name-only', 'HEAD']) ?? ''),
]);
if (workingChanges.size > 0) checkChangeSet('working tree', [...workingChanges], null, 'HEAD', slugs);

if (problems.length > 0) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('game-doc-sync: OK');
