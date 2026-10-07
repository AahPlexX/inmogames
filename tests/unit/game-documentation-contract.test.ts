import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const checker = fileURLToPath(new URL('../../scripts/game-check.mjs', import.meta.url));

type FixtureOptions = {
  withSpec: boolean;
  withHandoff: boolean;
  withPrd?: boolean;
  withTodo?: boolean;
  completionState?: 'implementing' | 'verified';
  completeChecklist?: boolean;
  trackerCapability?: 'none' | 'started' | 'verified' | 'blocked externally' | 'unsupported';
  indexStatus?: 'implementing' | 'verified game';
  completionEvidence?: string;
  implementationState?: string;
  openWork?: string;
  externalBlockers?: string;
};

function makeFixture(options: FixtureOptions) {
  const root = mkdtempSync(join(tmpdir(), 'inmogames-game-contract-'));
  const gameDir = join(root, 'src/games/test-game');
  const completionState = options.completionState ?? 'implementing';
  const completeChecklist = options.completeChecklist ?? false;
  const trackerCapability = options.trackerCapability ?? 'none';
  const indexStatus = options.indexStatus ?? 'implementing';
  const completionEvidence = options.completionEvidence ?? (completionState === 'verified' ? 'revision `abcdef1`; run `123456`' : 'not verified yet');
  const implementationState = options.implementationState ?? completionState;
  const openWork = options.openWork ?? (completionState === 'verified' ? 'none' : 'core loop');
  const externalBlockers = options.externalBlockers ?? (trackerCapability === 'blocked externally' ? 'TASK-003 live dependency' : 'none');
  mkdirSync(gameDir, { recursive: true });
  mkdirSync(join(root, 'docs/specs'), { recursive: true });
  writeFileSync(join(gameDir, 'test-game.meta.ts'), 'export const meta = {};\n');
  writeFileSync(join(gameDir, 'TestGameWorkspace.tsx'), 'export default function TestGameWorkspace(){ return null; }\n');

  if (options.withPrd !== false) {
    writeFileSync(
      join(gameDir, 'PRD.md'),
      `# Test Game Product Requirements Document\n\nPlanned Functional Features Specification:\n  game_identity:\n    name: "Test Game"\n    slug: "test-game"\n    development_status: "${completionState}"\n\n  technical_foundation:\n    architecture_and_engine: "Pure deterministic fixture engine."\n    dependencies_used: []\n\n  core_feature_specifications:\n    - name: "Core loop"\n      id: "TEST-001"\n      details: "Fixture core loop with deterministic input, explicit behavior, edge cases and verification state."\n      feature_development_status: "${completionState}"\n`,
    );
  }

  if (options.withTodo !== false) {
    writeFileSync(
      join(gameDir, 'todo.md'),
      `# Test Game Execution Todo\n\n**Status:** ${completionState}\n**Architecture / engine:** Pure deterministic fixture engine.\n**Dependencies:**\n- [x] No game-local dependency.\n\n## Core Feature Execution Pipeline\n\n### TEST-001 — Core loop\n**Purpose:** Exercise the fixture core loop.\n**Inputs:** Fixture state.\n**Dependencies Touched:** Test-only engine surface.\n**Technical Notes & Edge Cases:** Keep the fixture deterministic.\n**Implementation Details:** Fixture implementation details are explicit.\n**Verification & State Sign-off:**\n- [x] Fixture evidence recorded.\n\n## Final Game Assembly & Verification Checklist\n\n- [x] Zero known console errors; applicable MDN/W3C/WCAG requirements covered.\n- [x] Responsive viewport and reflow behavior verified.\n- [x] Persistence/reload/restart behavior verified.\n- [x] Dependency exact pin policy verified.\n- [x] PRD, todo, TRACKER, authoritative spec and GAME_INDEX synchronized.\n- [x] Full validation is green.\n- [x] Pages deployment verified.\n- [x] Overall state may be Complete/Verified only after all gates pass.\n`,
    );
  }

  const capabilityRow = trackerCapability === 'none'
    ? ''
    : `\n| Capability | Status | Verification |\n| --- | --- | --- |\n| Core loop | ${trackerCapability} | fixture evidence |\n`;
  writeFileSync(
    join(gameDir, 'TRACKER.md'),
    `# Test Game tracker\n\n**Spec:** \`docs/specs/2026-10-05-test-game-design.md\`  \n**Last synchronized:** 2026-10-05\n${capabilityRow}\n${options.withHandoff ? `## Current handoff\n\n**Implementation state:** ${implementationState}\n**Last verified revision:** ${completionState === 'verified' ? 'abcdef1' : 'none yet'}\n**Open game-local work:** ${openWork}\n**External blockers:** ${externalBlockers}\n**Next action:** ${completionState === 'verified' ? 'none' : 'implement the core loop'}\n` : ''}`,
  );

  if (options.withSpec) {
    const mark = completeChecklist ? 'x' : ' ';
    writeFileSync(
      join(root, 'docs/specs/2026-10-05-test-game-design.md'),
      `# Test Game design\n\n**Status:** ${completionState}  \n**Last synchronized:** 2026-10-05\n\n## Completion contract\n\n**Completion state:** ${completionState}\n**Completion evidence:** ${completionEvidence}\n\n- [${mark}] Playable start to finish.\n- [${mark}] Rules are covered by engine tests.\n- [${mark}] Responsive and accessible browser evidence is green.\n- [${mark}] Persistence/assets/network constraints are verified.\n- [${mark}] Full validation and deployment are green.\n- [${mark}] Spec, tracker, PRD, todo, index and task records are synchronized.\n`,
    );
  }

  writeFileSync(
    join(root, 'docs/GAME_INDEX.md'),
    `| Slug | Name | Category | Players | Storage | Status |\n| --- | --- | --- | --- | --- | --- |\n| \`test-game\` | Test Game | puzzle | single | none | ${indexStatus} |\n`,
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

  it('rejects a game that has no PRD', () => {
    const result = runChecker(makeFixture({ withSpec: true, withHandoff: true, withPrd: false }));
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('missing PRD.md');
  });

  it('rejects a game that has no todo', () => {
    const result = runChecker(makeFixture({ withSpec: true, withHandoff: true, withTodo: false }));
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('missing todo.md');
  });

  it('rejects a tracker that cannot serve as a resume handoff', () => {
    const result = runChecker(makeFixture({ withSpec: true, withHandoff: false }));
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('TRACKER.md missing Current handoff');
  });

  it('rejects a tracker with no capability table', () => {
    const result = runChecker(makeFixture({ withSpec: true, withHandoff: true }));
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('missing Capability/Status/Verification table');
  });

  it('rejects an unsupported tracker capability status', () => {
    const result = runChecker(makeFixture({ withSpec: true, withHandoff: true, trackerCapability: 'unsupported' }));
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('unsupported status "unsupported"');
  });

  it('rejects a verified game with an unchecked completion gate', () => {
    const result = runChecker(makeFixture({ withSpec: true, withHandoff: true, completionState: 'verified', completeChecklist: false, trackerCapability: 'verified', indexStatus: 'verified game' }));
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('verified Completion contract contains unchecked gates');
  });

  it('rejects a verified game whose tracker still has active work', () => {
    const result = runChecker(makeFixture({ withSpec: true, withHandoff: true, completionState: 'verified', completeChecklist: true, trackerCapability: 'started', indexStatus: 'verified game' }));
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('verified game tracker contains non-terminal capability states');
  });

  it('rejects empty verified completion evidence', () => {
    const result = runChecker(makeFixture({ withSpec: true, withHandoff: true, completionState: 'verified', completeChecklist: true, trackerCapability: 'verified', indexStatus: 'verified game', completionEvidence: '' }));
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Completion evidence must not be empty');
  });

  it('rejects vague verified completion evidence', () => {
    const result = runChecker(makeFixture({ withSpec: true, withHandoff: true, completionState: 'verified', completeChecklist: true, trackerCapability: 'verified', indexStatus: 'verified game', completionEvidence: 'all checks passed' }));
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('must name an exact revision/commit or workflow run');
  });

  it('rejects tracker/spec implementation-state disagreement', () => {
    const result = runChecker(makeFixture({ withSpec: true, withHandoff: true, completionState: 'verified', completeChecklist: true, trackerCapability: 'verified', indexStatus: 'verified game', implementationState: 'implementing' }));
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Implementation state disagrees with spec Completion state');
  });

  it('rejects a verified game that still names open game-local work', () => {
    const result = runChecker(makeFixture({ withSpec: true, withHandoff: true, completionState: 'verified', completeChecklist: true, trackerCapability: 'verified', indexStatus: 'verified game', openWork: 'finish the last interaction' }));
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Open game-local work as none');
  });

  it('requires blocked-external capability state to name the external blocker', () => {
    const result = runChecker(makeFixture({ withSpec: true, withHandoff: true, completionState: 'verified', completeChecklist: true, trackerCapability: 'blocked externally', indexStatus: 'verified game', externalBlockers: 'none' }));
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('blocked externally capability requires a named External blockers handoff');
  });

  it('accepts a fully synchronized verified game contract', () => {
    const result = runChecker(makeFixture({ withSpec: true, withHandoff: true, completionState: 'verified', completeChecklist: true, trackerCapability: 'verified', indexStatus: 'verified game' }));
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('game-check: 1 game(s) OK');
  });
});