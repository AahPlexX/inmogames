import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const port = 4182;
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
  throw new Error('Catalog accessibility Vite server did not start.');
}

try {
  await waitForServer();
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined });
  const context = await browser.newContext({ viewport: { width: 375, height: 667 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto(base);
  await page.getByRole('heading', { level: 1, name: 'Choose a table.', exact: true }).waitFor();

  const gameHeadings = page.getByRole('heading', { level: 2 });
  assert.deepEqual(await gameHeadings.allTextContents(), ['Threefold', 'Royal Palace Blackjack'], 'Catalog game titles must remain navigable H2 headings.');

  const brand = page.getByRole('link', { name: 'InMo Games home', exact: true });
  const brandBox = await brand.boundingBox();
  assert.ok(brandBox, 'Home/brand link must have a layout box.');
  assert.ok(brandBox.width >= 44 && brandBox.height >= 44, `Home/brand target is ${brandBox.width}×${brandBox.height}, expected at least 44×44.`);

  const cards = await page.locator('.game-card').evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().toJSON()));
  assert.equal(cards.length, 2);
  assert.ok(cards[1].top > cards[0].bottom, 'Phone catalog cards must stack with separation.');
  assert.ok(cards[0].top < 667, 'The first game card should begin within the first phone viewport.');
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Catalog must not overflow horizontally at 375px.');
  assert.deepEqual(errors, []);

  console.log('Catalog accessibility checks passed: H1/H2 hierarchy, 44px brand target, phone stacking and no overflow.');
  await context.close();
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
