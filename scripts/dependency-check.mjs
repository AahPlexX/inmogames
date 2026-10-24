import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const groups = ['dependencies', 'devDependencies', 'optionalDependencies'];
const exactSemver = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const problems = [];

for (const group of groups) {
  for (const [name, version] of Object.entries(pkg[group] ?? {})) {
    if (!exactSemver.test(version)) {
      problems.push(`${group}.${name}: expected an exact version, found "${version}"`);
    }
  }
}

// Transitive security overrides (D-029) must target a vulnerable range and resolve to one exact version.
const scopedOverrideKey = /^(?:@[^/@]+\/)?[^/@]+@\S.*$/;
for (const [selector, version] of Object.entries(pkg.pnpm?.overrides ?? {})) {
  if (!scopedOverrideKey.test(selector)) {
    problems.push(`pnpm.overrides.${selector}: expected a "name@vulnerable-range" selector, not a bare package name`);
  }
  if (!exactSemver.test(version)) {
    problems.push(`pnpm.overrides.${selector}: expected an exact version, found "${version}"`);
  }
}

if (!/^pnpm@\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(pkg.packageManager ?? '')) {
  problems.push(`packageManager: expected exact pnpm version, found "${pkg.packageManager ?? ''}"`);
}

if (problems.length > 0) {
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log('dependency-check: exact versions OK');
