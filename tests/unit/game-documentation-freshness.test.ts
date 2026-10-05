import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const checker = fileURLToPath(new URL('../../scripts/game-doc-sync.mjs', import.meta.url));

function git(cwd: string, args: string[]) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout);
  return result.stdout.trim();
}

function makeRepo() {
  const root = mkdtempSync(join(tmpdir(), 'inmogames-doc-freshness-'));
  mkdirSync(join(root, 'src/games/test-game'), { recursive: true });
  mkdirSync(join(root, 'docs/specs'), { recursive: true });
  mkdirSync(join(root, 'tests/unit'), { recursive: true });
  writeFileSync(join(root, 'src/games/test-game/TestGameWorkspace.tsx'), 'export default function TestGameWorkspace(){ return null; }\n');
  writeFileSync(join(root, 'src/games/test-game/test-game.meta.ts'), 'export const meta = {};\n');
  writeFileSync(join(root, 'src/games/test-game/TRACKER.md'), '# Tracker\n\n**Last synchronized:** 2026-10-05\n');
  writeFileSync(join(root, 'docs/specs/2026-10-05-test-game-design.md'), '# Spec\n\n**Last synchronized:** 2026-10-05\n');
  writeFileSync(join(root, 'docs/GAME_INDEX.md'), '| `test-game` | Test Game | implementing |\n');
  writeFileSync(join(root, 'tests/unit/test-game-engine.test.ts'), 'export {};\n');
  git(root, ['init']);
  git(root, ['config', 'user.email', 'fixture@example.test']);
  git(root, ['config', 'user.name', 'Fixture']);
  git(root, ['add', '.']);
  git(root, ['commit', '-m', 'base']);
  return { root, base: git(root, ['rev-parse', 'HEAD']) };
}

function commit(root: string, message: string) {
  git(root, ['add', '.']);
  git(root, ['commit', '-m', message]);
}

function run(root: string, base: string) {
  return spawnSync(process.execPath, [checker], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, GAME_DOC_SYNC_BASE: base },
  });
}

function append(path: string, text: string) {
  writeFileSync(path, readFileSync(path, 'utf8') + text);
}

describe('same-integration per-game documentation freshness', () => {
  it('rejects implementation changes when only the tracker is updated', () => {
    const { root, base } = makeRepo();
    append(join(root, 'src/games/test-game/TestGameWorkspace.tsx'), '// changed\n');
    append(join(root, 'src/games/test-game/TRACKER.md'), '\nchanged\n');
    commit(root, 'change game without spec');
    const result = run(root, base);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('test-game: implementation/test changes require both spec and tracker updates in the same integration');
  });

  it('rejects game-specific test changes when the game documents are untouched', () => {
    const { root, base } = makeRepo();
    append(join(root, 'tests/unit/test-game-engine.test.ts'), '// new evidence\n');
    commit(root, 'change game test without docs');
    const result = run(root, base);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('test-game: implementation/test changes require both spec and tracker updates in the same integration');
  });

  it('rejects one-sided spec or tracker edits', () => {
    const { root, base } = makeRepo();
    append(join(root, 'docs/specs/2026-10-05-test-game-design.md'), '\nchanged\n');
    commit(root, 'change only spec');
    const result = run(root, base);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('test-game: spec and tracker must be updated together');
  });

  it('accepts implementation changes when both game documents change together', () => {
    const { root, base } = makeRepo();
    append(join(root, 'src/games/test-game/TestGameWorkspace.tsx'), '// changed\n');
    append(join(root, 'src/games/test-game/TRACKER.md'), '\nchanged\n');
    append(join(root, 'docs/specs/2026-10-05-test-game-design.md'), '\nchanged\n');
    commit(root, 'change game and docs');
    const result = run(root, base);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('game-doc-sync: OK');
  });
});
