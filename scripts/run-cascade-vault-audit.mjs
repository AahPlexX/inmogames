import { spawnSync } from 'node:child_process';

const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const result = spawnSync(
  pnpm,
  ['exec', 'vitest', 'run', 'tests/audit/cascade-vault-audit.test.ts', '--reporter=verbose'],
  {
    stdio: 'inherit',
    env: { ...process.env, CASCADE_VAULT_AUDIT: '1' },
  },
);

if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
