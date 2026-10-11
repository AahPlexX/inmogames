import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const port = 4193;
const blankFirebase = {
  VITE_FIREBASE_API_KEY: '',
  VITE_FIREBASE_AUTH_DOMAIN: '',
  VITE_FIREBASE_PROJECT_ID: '',
  VITE_FIREBASE_APP_ID: '',
};

const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
  { env: { ...process.env, ...blankFirebase }, stdio: 'pipe' },
);

const pageUrl = `http://127.0.0.1:${port}/inmogames/prototypes/hollowshift-core-loop-v2.html`;
let browser;

async function waitForServer() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      if ((await fetch(pageUrl)).ok) return;
    } catch {}
    await delay(100);
  }
  throw new Error('Hollowshift prototype Vite server did not start.');
}

try {
  await waitForServer();
  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_PATH || undefined,
  });

  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(pageUrl);
  await page.getByRole('heading', { name: 'Hollowshift', exact: true }).waitFor();

  const grid = page.getByRole('grid', { name: /7 by 7 tunnel board/i });
  const rows = grid.getByRole('row');
  assert.equal(await rows.count(), 7, 'The 7×7 ARIA grid must own seven row elements.');

  for (let rowIndex = 0; rowIndex < 7; rowIndex += 1) {
    assert.equal(
      await rows.nth(rowIndex).getByRole('gridcell').count(),
      7,
      `Grid row ${rowIndex + 1} must own seven gridcells.`,
    );
  }

  assert.equal(
    await grid.locator('[role="gridcell"][tabindex="0"]').count(),
    1,
    'Exactly one gridcell must participate in the page tab sequence.',
  );

  console.log('Hollowshift prototype grid ownership check passed.');
  await context.close();
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
