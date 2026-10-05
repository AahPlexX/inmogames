import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const port = 4177;
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
const base = `http://127.0.0.1:${port}/inmogames/`;
let browser;

async function waitForServer() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      if ((await fetch(base)).ok) return;
    } catch {}
    await delay(100);
  }
  throw new Error('Royal Palace accessibility Vite server did not start.');
}

async function assertFocused(locator, label) {
  assert.equal(await locator.evaluate((element) => document.activeElement === element), true, `${label} should own keyboard focus.`);
}

try {
  await waitForServer();
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined });
  const context = await browser.newContext({ viewport: { width: 1024, height: 900 }, colorScheme: 'light' });
  await context.addInitScript(() => {
    const original = Crypto.prototype.getRandomValues;
    Crypto.prototype.getRandomValues = function seededGetRandomValues(array) {
      if (array instanceof Uint32Array && array.length === 1) {
        array[0] = 8;
        return array;
      }
      return original.call(this, array);
    };
  });
  const page = await context.newPage();
  await page.goto(base + '#/games/royal-palace-blackjack');

  await page.getByRole('button', { name: 'Add 5 virtual-credit chip', exact: true }).click();
  await page.getByRole('button', { name: 'Deal', exact: true }).click();

  const dialog = page.getByRole('dialog', { name: 'Dealer shows an Ace' });
  await dialog.waitFor();
  assert.match(await page.locator('.rp-status').innerText(), /Dealer shows an Ace/i);
  await page.getByRole('img', { name: 'A of diamonds', exact: true }).waitFor();
  await page.getByRole('img', { name: 'Hidden card', exact: true }).waitFor();

  const takeInsurance = page.getByRole('button', { name: 'Take insurance', exact: true });
  const declineInsurance = page.getByRole('button', { name: 'No insurance', exact: true });
  await assertFocused(declineInsurance, 'Default insurance decision');

  await page.keyboard.press('Tab');
  await assertFocused(takeInsurance, 'Forward Tab wrap inside insurance dialog');
  await page.keyboard.press('Shift+Tab');
  await assertFocused(declineInsurance, 'Reverse Tab wrap inside insurance dialog');

  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'detached' });
  await page.getByText('Your turn', { exact: true }).waitFor();
  await assertFocused(page.getByRole('button', { name: 'Hit', exact: true }), 'Logical player action after insurance closes');

  await context.close();
  console.log('Royal Palace accessibility checks passed: named card/status semantics, insurance focus entry/confinement, Escape close and logical focus restoration.');
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
