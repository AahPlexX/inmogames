import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const port = 4187;
const blankFirebase = {
  VITE_FIREBASE_API_KEY: '',
  VITE_FIREBASE_AUTH_DOMAIN: '',
  VITE_FIREBASE_PROJECT_ID: '',
  VITE_FIREBASE_APP_ID: '',
};
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
  env: { ...process.env, ...blankFirebase }, stdio: 'pipe',
});
const base = `http://127.0.0.1:${port}/inmogames/`;
let browser;
const errors = [];

async function waitForServer() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try { if ((await fetch(base)).ok) return; } catch {}
    await delay(100);
  }
  throw new Error('Cloudline Couriers design Vite server did not start.');
}

async function waitForCloudlineSurface(page) {
  await page.locator('#cl-title').waitFor();
  await page.locator('.cl-courier [data-cl-sprite="airship"]').waitFor();
}

try {
  await waitForServer();
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));

  await page.goto(base + '#/games/cloudline-couriers');
  await waitForCloudlineSurface(page);

  const spriteCount = await page.locator('[data-cl-sprite]').count();
  assert.ok(spriteCount >= 21, `Cloudline must render its repository-authored vector sprite family across board, courier and landmarks; found ${spriteCount}.`);
  assert.equal(await page.locator('.cl-courier [data-cl-sprite="airship"]').count(), 1, 'The active courier must use exactly one original airship vector sprite instead of a typographic placeholder.');
  assert.equal(await page.locator('.cl-tile [data-cl-sprite]').count(), 16, 'Every skyway stop must have a vector event identity.');
  assert.equal(await page.locator('.cl-landmark [data-cl-sprite]').count(), 4, 'Every landmark must have an original vector identity.');

  const aerie = page.locator('.cl-landmark').filter({ hasText: 'Aerie Post' });
  assert.match(await aerie.innerText(), /Stage 0\/4/, 'A fresh Cloudline career should start Aerie Post at stage zero.');
  await aerie.getByRole('button', { name: /Upgrade/ }).click();
  assert.match(await aerie.innerText(), /Stage 1\/4/, 'Upgrading Aerie Post should advance it to stage one.');

  await page.reload();
  await waitForCloudlineSurface(page);
  await page.waitForFunction(() => [...document.querySelectorAll('.cl-landmark')].some(element => element.textContent?.includes('Aerie Post') && element.textContent?.includes('Stage 1/4')));
  const restoredAerie = page.locator('.cl-landmark').filter({ hasText: 'Aerie Post' });
  assert.match(await restoredAerie.innerText(), /Stage 1\/4/, 'Guest Cloudline career progress must survive a page reload.');
  await context.close();

  const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const reduced = await reducedContext.newPage();
  reduced.on('pageerror', error => errors.push(error.message));
  await reduced.goto(base + '#/games/cloudline-couriers');
  await waitForCloudlineSurface(reduced);
  const courierAnimation = await reduced.locator('.cl-courier').evaluate(element => getComputedStyle(element).animationName);
  assert.equal(courierAnimation, 'none', 'Courier arrival/bobbing motion must be disabled under prefers-reduced-motion.');
  await reducedContext.close();

  assert.deepEqual(errors, []);
  console.log('Cloudline design checks passed: authored vector family, reduced motion and guest reload persistence.');
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
