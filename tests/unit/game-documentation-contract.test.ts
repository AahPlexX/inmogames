import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const checker = fileURLToPath(new URL('../../scripts/game-check.mjs', import.meta.url));

function makeFixture(options: { withSpec: boolean; withHandoff: boolean }) {
  const root = mkdtempSync(join(tmpdir(), 'inmogames-game-contract-'));
  const gameDir = join(root, 'src/games/test-game');
  mkdirSync(gameDir, { recursive: true });
  mkdirSync(join(root, 'docs/specs'), { recursive: true });
  writeFileSync(join(gameDir, 'test-game.meta.ts'), 'export const meta = {};\n');
  writeFileSync(join(gameDir, 'TestGameWorkspace.tsx'), 'export default function TestGameWorkspace(){ return null; }\n');
  writeFileSync(
    join(gameDir, 'TRACKER.md'),
    `# Test Game tracker\n\n**Spec:** \`docs/specs/2026-10-05-test-game-design.md\`  \n**Last synchronized:** 2026-10-05\n\n${options.withHandoff ? '## Current handoff\n\n**Implementation state:** implementing\n**Last verified revision:** none yet\n**Open game-local work:** core loop\n**External blockers:** none\n**Next action:** implement the core loop\n' : ''}`,
  );
  if (options.withSpec) {
    writeFileSync(
      join(root, 'docs/specs/2026-10-05-test-game-design.md'),
      '# Test Game design\n\n**Status:** implementing  \n**Last synchronized:** 2026-10-05\n\n## Completion contract\n\n**Completion state:** implementing\n**Completion evidence:** none yet\n\n- [ ] Playable start to finish.\n- [ ] Rules are covered by engine tests.\n- [ ] Responsive and accessible browser evidence is green.\n- [ ] Persistence/assets/network constraints are verified.\n- [ ] Full validation and deployment are green.\n- [ ] Spec, tracker, index and task records are synchronized.\n',
    );
  }
  writeFileSync(
    join(root, 'docs/GAME_INDEX.md'),
    '| Slug | Name | Category | Players | Storage | Status |\n| --- | --- | --- | --- | --- | --- |\n| `test-game` | Test Game | puzzle | single | none | implementing |\n',
  );
  return root;
}

function runChecker(cwd: string) {
  return spawnSync(process.execPath, [checker], { cwd, encoding: 'utf8' });
}

describe('per-game documentation contract', () => {
  it('rejects a game that has no authoritative spec sheet', () => {
    const result = runChecker(makeFixture({ withSpec: false, withHandoff: true }));
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('missing authoritative spec sheet');
  });

  it('rejects a tracker that cannot serve as a resume handoff', () => {
    const result = runChecker(makeFixture({ withSpec: true, withHandoff: false }));
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('TRACKER.md missing Current handoff');
  });
});
