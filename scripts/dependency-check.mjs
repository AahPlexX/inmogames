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
// The range must start with a comparator or digit and carry an upper bound (`<`), so global pins such as
// `pkg@*`, `pkg@latest`, `pkg@x` and `pkg@>=0.0.0` fail; advisory ranges always have an upper bound.
// shortcut: textual check, so a hand-crafted range such as `pkg@>=0.0.0 <9999` or `pkg@<1 || *` still passes; upgrade to a semver parser if overrides ever come from untrusted input.
const scopedOverrideKey = /^(?:@[^/@]+\/)?[^/@]+@(?=[^@]*<)[<>=^~]*\d.*$/;
for (const [selector, version] of Object.entries(pkg.pnpm?.overrides ?? {})) {
  if (!scopedOverrideKey.test(selector)) {
    problems.push(`pnpm.overrides.${selector}: expected "name@<range>" where the range starts with a comparator or digit and has an upper bound "<" (no bare names, "*", "latest" or exact versions)`);
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
