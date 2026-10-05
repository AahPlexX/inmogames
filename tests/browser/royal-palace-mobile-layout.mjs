import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const port = 4179;
const blankFirebase = {
  VITE_FIREBASE_API_KEY: '',
  VITE_FIREBASE_AUTH_DOMAIN: '',
  VITE_FIREBASE_PROJECT_ID: '',
  VITE_FIREBASE_APP_ID: '',
};
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
  env: { ...process.env, ...blankFirebase },
  stdio: 'pipe',
});
const base = `http://127.0.0.1:${port}/inmogames/#/games/royal-palace-blackjack`;
let browser;

async function waitForServer() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      if ((await fetch(`http://127.0.0.1:${port}/inmogames/`)).ok) return;
    } catch {}
    await delay(100);
  }
  throw new Error('Royal Palace mobile-layout Vite server did not start.');
}

try {
  await waitForServer();
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined });
  const context = await browser.newContext({ viewport: { width: 320, height: 900 }, colorScheme: 'light' });
  await context.addInitScript(() => {
    const original = Crypto.prototype.getRandomValues;
    Crypto.prototype.getRandomValues = function seededGetRandomValues(array) {
      if (array instanceof Uint32Array && array.length === 1) {
        array[0] = 1;
        return array;
      }
      return original.call(this, array);
    };
  });
  const page = await context.newPage();
  await page.goto(base);

  const deal = page.getByRole('button', { name: 'Deal', exact: true });
  await deal.waitFor();
  const actionBox = await page.locator('.rp-actions').boundingBox();
  const dealBox = await deal.boundingBox();
  assert.ok(actionBox && dealBox, 'Betting action row should have measurable layout boxes.');
  assert.ok(dealBox.width >= actionBox.width - 2, `A lone Deal action should span the mobile action row; got ${dealBox.width}px of ${actionBox.width}px.`);

  await page.getByRole('button', { name: 'Add 5 virtual-credit chip', exact: true }).click();
  await deal.click();
  await page.getByText('Your turn', { exact: true }).waitFor();
  const playerActions = page.locator('.rp-actions button');
  assert.equal(await playerActions.count(), 5, 'Player phase should retain the five-action grid.');
  const firstPlayerAction = await playerActions.first().boundingBox();
  const playerActionBox = await page.locator('.rp-actions').boundingBox();
  assert.ok(firstPlayerAction && playerActionBox, 'Player action grid should have measurable layout boxes.');
  assert.ok(firstPlayerAction.width < playerActionBox.width * 0.75, 'Multiple player actions should remain multi-column on mobile.');

  console.log('Royal Palace mobile-layout checks passed: lone Deal spans the row while multi-action play remains compact.');
  await context.close();
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
