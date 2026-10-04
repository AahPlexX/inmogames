import { readFileSync, writeFileSync } from 'node:fs';

const requestPath = process.argv[2] ?? '.tasks/dependency-refresh-request.json';
const request = JSON.parse(readFileSync(requestPath, 'utf8'));
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

for (const group of ['dependencies', 'devDependencies']) {
  const requested = request[group];
  if (!requested || typeof requested !== 'object' || Array.isArray(requested)) {
    throw new Error(`${requestPath} is missing ${group}.`);
  }
  pkg[group] = Object.fromEntries(Object.entries(requested).sort(([a], [b]) => a.localeCompare(b)));
}

pkg.engines = { node: '>=24.12.0' };
pkg.scripts['test:rules'] = 'firebase emulators:exec --only firestore --project demo-inmogames "node --test tests/rules/firestore.test.mjs"';
pkg.scripts['test:browser'] = 'firebase emulators:exec --only auth,firestore --project demo-inmogames "node tests/browser/account-persistence.mjs"';

writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
console.log(`Applied dependency request from ${requestPath}.`);
