import { readFileSync } from 'node:fs';

const requestPath = process.argv[2] ?? '.tasks/dependency-refresh-request.json';
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const request = JSON.parse(readFileSync(requestPath, 'utf8'));
const problems = [];

async function registryLatest(name) {
  const url = `https://registry.npmjs.org/${encodeURIComponent(name)}/latest`;
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const value = await response.json();
      if (typeof value.version !== 'string') throw new Error('Registry response has no version.');
      return value.version;
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise(resolve => setTimeout(resolve, attempt * 1000));
    }
  }
  throw new Error(`Unable to verify ${name} against npm registry latest: ${lastError}`);
}

for (const group of ['dependencies', 'devDependencies']) {
  const expected = request[group] ?? {};
  const actual = pkg[group] ?? {};
  const expectedNames = Object.keys(expected).sort();
  const actualNames = Object.keys(actual).sort();
  if (JSON.stringify(expectedNames) !== JSON.stringify(actualNames)) {
    problems.push(`${group}: request/package names differ. request=${expectedNames.join(',')} package=${actualNames.join(',')}`);
    continue;
  }
  for (const name of expectedNames) {
    if (actual[name] !== expected[name]) problems.push(`${group}.${name}: package ${actual[name]} != request ${expected[name]}`);
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

for (const group of ['dependencies', 'devDependencies']) {
  for (const [name, version] of Object.entries(request[group] ?? {})) {
    const latest = await registryLatest(name);
    if (version !== latest) problems.push(`${group}.${name}: requested ${version}, npm latest is ${latest}`);
    else console.log(`${name}@${version}: npm latest verified`);
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
