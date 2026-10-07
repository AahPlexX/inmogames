import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const gamesDir = 'src/games';
const specsDir = 'docs/specs';
const index = readFileSync('docs/GAME_INDEX.md', 'utf8');
const problems = [];
const allowedTrackerStatuses = new Set(['planned', 'started', 'verified', 'blocked', 'blocked externally', 'excluded']);
const terminalTrackerStatuses = new Set(['verified', 'blocked externally', 'excluded']);

const slugs = readdirSync(gamesDir).filter((name) => statSync(join(gamesDir, name)).isDirectory());

function section(content, heading) {
  const marker = `## ${heading}`;
  const start = content.indexOf(marker);
  if (start < 0) return null;
  const tail = content.slice(start + marker.length);
  const nextHeading = tail.search(/\n## /);
  return nextHeading < 0 ? tail : tail.slice(0, nextHeading);
}

function field(content, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = content.match(new RegExp(`\\*\\*${escaped}:\\*\\*[ \\t]*([^\\n]*)`, 'i'));
  return match ? match[1].trim() : null;
}

function trackerCapabilities(content) {
  const lines = content.split('\n');
  const header = lines.findIndex((line) => /^\|\s*Capability\s*\|\s*Status\s*\|\s*Verification\s*\|\s*$/i.test(line.trim()));
  if (header < 0) return null;
  const rows = [];
  for (let index = header + 2; index < lines.length && lines[index].trim().startsWith('|'); index += 1) {
    const cells = lines[index].trim().split('|').slice(1, -1).map((cell) => cell.trim());
    if (cells.length >= 3) rows.push({ capability: cells[0], status: cells[1].toLowerCase(), verification: cells[2] });
  }
  return rows;
}

function hasExactVerificationEvidence(value) {
  return /\b(?:revision|commit)\s+`?[0-9a-f]{7,40}`?/i.test(value) || /\brun\s+`?\d{5,}`?/i.test(value);
}

function specFilesFor(slug) {
  if (!existsSync(specsDir)) return [];
  const escaped = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`^\\d{4}-\\d{2}-\\d{2}-${escaped}-design\\.md$`);
  return readdirSync(specsDir).filter((name) => pattern.test(name));
}

function requirePattern(content, pattern, problem) {
  if (!pattern.test(content)) problems.push(problem);
}

function checkPrd(slug, path) {
  if (!existsSync(path)) {
    problems.push(`${slug}: missing PRD.md`);
    return;
  }
  const prd = readFileSync(path, 'utf8');
  const requirements = [
    [/Planned Functional Features Specification:/, 'Planned Functional Features Specification'],
    [/^\s*game_identity:\s*$/m, 'game_identity'],
    [/^\s*name:\s*["'].+["']\s*$/m, 'game_identity.name'],
    [/^\s*slug:\s*["'].+["']\s*$/m, 'game_identity.slug'],
    [/^\s*development_status:\s*["'].+["']\s*$/m, 'game_identity.development_status'],
    [/^\s*technical_foundation:\s*$/m, 'technical_foundation'],
    [/^\s*architecture_and_engine:\s*.+$/m, 'technical_foundation.architecture_and_engine'],
    [/^\s*dependencies_used:\s*(?:\[.*\])?\s*$/m, 'technical_foundation.dependencies_used'],
    [/^\s*core_feature_specifications:\s*$/m, 'core_feature_specifications'],
    [/^\s*-\s+name:\s*.+$/m, 'feature.name'],
    [/^\s*id:\s*.+$/m, 'feature.id'],
    [/^\s*details:\s*.+$/m, 'feature.details'],
    [/^\s*feature_development_status:\s*.+$/m, 'feature.feature_development_status'],
  ];
  for (const [pattern, label] of requirements) requirePattern(prd, pattern, `${slug}: PRD.md missing required ${label} field/structure`);
  const slugMatch = prd.match(/^\s*slug:\s*["']([^"']+)["']\s*$/m);
  if (slugMatch && slugMatch[1] !== slug) problems.push(`${slug}: PRD.md game_identity.slug must exactly match directory slug`);
}

function checkTodo(slug, path) {
  if (!existsSync(path)) {
    problems.push(`${slug}: missing todo.md`);
    return;
  }
  const todo = readFileSync(path, 'utf8');
  const requirements = [
    [/^#\s+.+/m, 'title'],
    [/\*\*Status:\*\*\s*\S/i, 'Status'],
    [/\*\*Architecture\s*(?:\/|&)\s*Engine:\*\*\s*\S/i, 'Architecture / engine'],
    [/\*\*Dependencies(?: Used)?:\*\*/i, 'Dependencies checklist'],
    [/##\s+Core Feature Execution Pipeline/i, 'Core Feature Execution Pipeline'],
    [/\*\*Purpose:\*\*/i, 'Purpose'],
    [/\*\*Inputs(?: \/ Parameters)?:\*\*/i, 'Inputs'],
    [/\*\*Dependencies Touched:\*\*/i, 'Dependencies Touched'],
    [/\*\*Technical Notes & Edge Cases:\*\*/i, 'Technical Notes & Edge Cases'],
    [/\*\*Implementation Details:\*\*/i, 'Implementation Details'],
    [/\*\*Verification & State Sign-off:\*\*/i, 'Verification & State Sign-off'],
    [/##\s+Final Game Assembly & Verification Checklist/i, 'Final Game Assembly & Verification Checklist'],
    [/-\s+\[[ xX]\]\s+/, 'checkbox state'],
  ];
  for (const [pattern, label] of requirements) requirePattern(todo, pattern, `${slug}: todo.md missing required ${label} structure`);
  const final = section(todo, 'Final Game Assembly & Verification Checklist') ?? '';
  const finalConcepts = [
    [/console/i, 'console/runtime quality gate'],
    [/responsive|viewport|reflow/i, 'responsive/device gate'],
    [/persist|reload|restart/i, 'persistence/restart gate'],
    [/dependenc|exact pin/i, 'dependency pin/freshness gate'],
    [/TRACKER|PRD|GAME_INDEX|authoritative spec/i, 'documentation synchronization gate'],
    [/validation|pnpm validate/i, 'exact-revision validation gate'],
    [/Pages|deploy/i, 'deployment gate'],
    [/Complete|Verified/i, 'final Complete/Verified gate'],
  ];
  for (const [pattern, label] of finalConcepts) requirePattern(final, pattern, `${slug}: todo.md final checklist missing ${label}`);
}

for (const slug of slugs) {
  const dir = join(gamesDir, slug);
  const trackerPath = join(dir, 'TRACKER.md');
  const prdPath = join(dir, 'PRD.md');
  const todoPath = join(dir, 'todo.md');
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) problems.push(`${slug}: slug must be kebab-case`);
  if (!existsSync(join(dir, `${slug}.meta.ts`))) problems.push(`${slug}: missing ${slug}.meta.ts`);
  if (!existsSync(trackerPath)) problems.push(`${slug}: missing TRACKER.md`);
  checkPrd(slug, prdPath);
  checkTodo(slug, todoPath);
  if (!readdirSync(dir).some((f) => f.endsWith('Workspace.tsx'))) problems.push(`${slug}: missing *Workspace.tsx`);

  const indexLine = index.split('\n').find((line) => line.includes(`\`${slug}\``));
  if (!indexLine) problems.push(`${slug}: missing from docs/GAME_INDEX.md`);

  const specs = specFilesFor(slug);
  if (specs.length === 0) problems.push(`${slug}: missing authoritative spec sheet docs/specs/YYYY-MM-DD-${slug}-design.md`);
  else if (specs.length > 1) problems.push(`${slug}: multiple authoritative spec sheets found; keep exactly one dated ${slug} design spec`);

  if (!existsSync(trackerPath)) continue;
  const tracker = readFileSync(trackerPath, 'utf8');
  if (!tracker.includes('**Last synchronized:**')) problems.push(`${slug}: TRACKER.md missing Last synchronized`);
  if (!tracker.includes('## Current handoff')) problems.push(`${slug}: TRACKER.md missing Current handoff`);
  for (const label of ['Implementation state', 'Last verified revision', 'Open game-local work', 'External blockers', 'Next action']) {
    const value = field(tracker, label);
    if (value === null) problems.push(`${slug}: TRACKER.md missing handoff field **${label}:**`);
    else if (!value) problems.push(`${slug}: TRACKER.md handoff field **${label}:** is empty`);
  }

  const capabilities = trackerCapabilities(tracker);
  if (!capabilities) problems.push(`${slug}: TRACKER.md missing Capability/Status/Verification table`);
  else if (capabilities.length === 0) problems.push(`${slug}: TRACKER.md capability table must contain at least one capability`);
  else {
    for (const row of capabilities) {
      if (!row.capability) problems.push(`${slug}: tracker capability row has no capability name`);
      if (!allowedTrackerStatuses.has(row.status)) problems.push(`${slug}: tracker capability "${row.capability || '(unnamed)'}" has unsupported status "${row.status}"`);
      if (terminalTrackerStatuses.has(row.status) && !row.verification) problems.push(`${slug}: tracker capability "${row.capability || '(unnamed)'}" with status ${row.status} requires verification or rationale`);
    }
  }

  if (specs.length !== 1) continue;
  const specPath = `docs/specs/${specs[0]}`;
  const spec = readFileSync(specPath, 'utf8');
  if (!tracker.includes(`**Spec:** \`${specPath}\``)) problems.push(`${slug}: TRACKER.md must reference authoritative spec ${specPath}`);
  if (!spec.includes('**Last synchronized:**')) problems.push(`${slug}: spec missing Last synchronized`);
  if (!spec.includes('## Completion contract')) problems.push(`${slug}: spec missing Completion contract`);

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
  const completionEvidence = field(completion, 'Completion evidence');
  if (completionEvidence === null) problems.push(`${slug}: spec missing Completion evidence`);
  else if (!completionEvidence) problems.push(`${slug}: Completion evidence must not be empty`);

  const implementationState = field(tracker, 'Implementation state');
  const trackerStateMatch = implementationState?.match(/^(implementing|verified)\b/i);
  if (!trackerStateMatch) problems.push(`${slug}: TRACKER.md Implementation state must begin with implementing or verified`);
  else if (trackerStateMatch[1].toLowerCase() !== state) problems.push(`${slug}: TRACKER.md Implementation state disagrees with spec Completion state`);

  const indexVerified = Boolean(indexLine?.toLowerCase().includes('verified game'));
  if (state === 'verified') {
    if (checklist.some((match) => match[1] !== 'x' && match[1] !== 'X')) problems.push(`${slug}: verified Completion contract contains unchecked gates`);
    if (capabilities?.some((row) => !terminalTrackerStatuses.has(row.status))) problems.push(`${slug}: verified game tracker contains non-terminal capability states`);
    if (completionEvidence && !hasExactVerificationEvidence(completionEvidence)) problems.push(`${slug}: verified Completion evidence must name an exact revision/commit or workflow run`);
    if (!indexVerified) problems.push(`${slug}: Completion state is verified but GAME_INDEX does not say verified game`);

    const lastVerifiedRevision = field(tracker, 'Last verified revision') ?? '';
    if (/^none\b/i.test(lastVerifiedRevision) || !/\b[0-9a-f]{7,40}\b/i.test(lastVerifiedRevision)) problems.push(`${slug}: verified game must record an exact Last verified revision`);
    const openWork = field(tracker, 'Open game-local work') ?? '';
    if (!/^none\b/i.test(openWork)) problems.push(`${slug}: verified game must state Open game-local work as none`);
    if (capabilities?.some((row) => row.status === 'blocked externally')) {
      const blockers = field(tracker, 'External blockers') ?? '';
      if (/^none\b/i.test(blockers)) problems.push(`${slug}: blocked externally capability requires a named External blockers handoff`);
    }
  } else if (indexVerified) problems.push(`${slug}: GAME_INDEX says verified game while Completion state is implementing`);
}

if (problems.length > 0) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`game-check: ${slugs.length} game(s) OK`);
