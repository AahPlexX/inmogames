import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const port = 4187;
const cloudlineStorageKey = 'inmogames:cloudline-couriers:v1';
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

async function assertNoHorizontalOverflow(page, label) {
  const sizes = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
  assert.ok(sizes.scrollWidth <= sizes.width + 1, `${label} must not horizontally overflow: ${sizes.scrollWidth}px > ${sizes.width}px.`);
}

async function readSeededCurrentJob(browserInstance, overrides) {
  const context = await browserInstance.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  const run = {
    seed: 1,
    rngState: 1,
    position: 0,
    credits: 450,
    fuel: 18,
    district: 1,
    landmarks: [0, 0, 0, 0],
    shield: false,
    streak: 0,
    circuits: 0,
    deliveries: 0,
    pendingCargo: null,
    lastRoll: null,
    message: 'Ready at Dispatch Dock. Choose a boost, then fly.',
    ...overrides,
  };
  await page.addInitScript(({ key, activeRun }) => {
    localStorage.setItem(key, JSON.stringify({ schemaVersion: 1, state: { activeRun } }));
  }, { key: cloudlineStorageKey, activeRun: run });
  await page.goto(base + '#/games/cloudline-couriers');
  await waitForCloudlineSurface(page);
  const currentJob = (await page.locator('.cl-brief > div > p').first().innerText()).trim();
  await context.close();
  return currentJob;
}

try {
  await waitForServer();
  await mkdir('test-results/cloudline-couriers', { recursive: true });
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));

  await page.goto(base + '#/games/cloudline-couriers');
  await waitForCloudlineSurface(page);
  await assertNoHorizontalOverflow(page, '390px Cloudline');

  await page.getByText('Deliver cargo. Earn credits. Rebuild the district.', { exact: true }).waitFor();
  assert.equal(await page.getByRole('heading', { name: 'Current job' }).count(), 1, 'The first screen must state the player’s current job.');
  const help = page.getByText('How to play', { exact: true });
  await help.click();
  assert.match(await page.locator('.cl-help').innerText(), /Choose a boost.*Fly route.*Spend credits/is, 'Replayable help must explain the core boost → fly → rebuild loop in plain language.');

  const spriteCount = await page.locator('[data-cl-sprite]').count();
  assert.ok(spriteCount >= 21, `Cloudline must render its repository-authored vector sprite family across board, courier and landmarks; found ${spriteCount}.`);
  assert.equal(await page.locator('.cl-courier [data-cl-sprite="airship"]').count(), 1, 'The active courier must use exactly one original airship vector sprite instead of a typographic placeholder.');
  assert.equal(await page.locator('.cl-tile > [data-cl-sprite^="tile-"]').count(), 16, 'Every skyway stop must have a vector event identity.');
  assert.equal(await page.locator('.cl-landmark [data-cl-sprite^="landmark-"]').count(), 4, 'Every landmark must have an original vector identity.');

  const courierIterations = await page.locator('.cl-courier').evaluate(element => getComputedStyle(element).animationIterationCount);
  assert.ok(!courierIterations.split(',').some(value => value.trim() === 'infinite'), 'Courier motion must not bob forever after arrival.');

  const fly = page.getByRole('button', { name: 'Fly route' });
  await fly.click();
  const flying = page.locator('.cl[data-flight-state="flying"]');
  await flying.waitFor();
  const flightTotal = Number(await flying.getAttribute('data-flight-total'));
  assert.ok(flightTotal >= 1, 'A flight must expose at least one traversed route step.');
  await page.locator('.cl-flight-courier').waitFor();
  await page.waitForFunction(() => Number(document.querySelector('.cl')?.getAttribute('data-flight-step') ?? 0) > 0);
  assert.ok(Number(await flying.getAttribute('data-flight-step')) > 0, 'The courier must visibly advance through route steps instead of snapping directly to the destination.');
  await page.locator('.cl[data-flight-state="idle"]').waitFor();
  await page.locator('.cl-effect').waitFor();
  assert.doesNotMatch(await page.locator('.cl-status').innerText(), /resolved\.$/i, 'Landing feedback must explain the consequence instead of saying only that a stop resolved.');

  const aerie = page.locator('.cl-landmark').filter({ hasText: 'Aerie Post' });
  assert.match(await aerie.innerText(), /Stage 0\/4/, 'A fresh Cloudline career should start Aerie Post at stage zero.');
  await aerie.getByRole('button', { name: /Upgrade/ }).click();
  await aerie.locator('[data-stage="1"]').waitFor();
  assert.equal(await aerie.getAttribute('data-upgraded'), 'true', 'A landmark upgrade must expose a dedicated visual-feedback state.');
  assert.match(await aerie.innerText(), /Stage 1\/4/, 'Upgrading Aerie Post should advance it to stage one.');

  const firstSessionJobs = [
    await readSeededCurrentJob(browser, {
      position: 2,
      lastRoll: 2,
      message: 'Refueled at Cloudsmith Works. Fuel is now 18/30.',
    }),
    await readSeededCurrentJob(browser, {
      position: 1,
      credits: 495,
      streak: 1,
      deliveries: 1,
      lastRoll: 1,
      message: 'Delivered at Sunspoke Market. +45 credits.',
    }),
    await readSeededCurrentJob(browser, {
      position: 1,
      credits: 375,
      landmarks: [1, 0, 0, 0],
      streak: 1,
      deliveries: 1,
      lastRoll: 1,
      message: 'Aerie Post upgraded to stage 1.',
    }),
  ];
  assert.deepEqual(firstSessionJobs, [
    'Keep flying until you complete your first delivery.',
    'First delivery complete. Upgrade Aerie Post for 120 credits.',
    'Starter contract: complete 4 deliveries. Progress 1/4. The fourth delivery pays 120 × boost credits.',
  ], 'CLC-011/CLC-015 first-session guidance must preserve the delivery → upgrade → starter-contract teaching sequence.');

  await page.screenshot({ path: 'test-results/cloudline-couriers/phone-390.png', fullPage: true });
  await page.reload();
  await waitForCloudlineSurface(page);
  await page.waitForFunction(() => [...document.querySelectorAll('.cl-landmark')].some(element => element.textContent?.includes('Aerie Post') && element.textContent?.includes('Stage 1/4')));
  const restoredAerie = page.locator('.cl-landmark').filter({ hasText: 'Aerie Post' });
  assert.match(await restoredAerie.innerText(), /Stage 1\/4/, 'Guest Cloudline career progress must survive a page reload.');
  await context.close();

  for (const viewport of [{ width: 1024, height: 768, label: 'desktop-1024' }, { width: 1440, height: 900, label: 'desktop-1440' }]) {
    const visualContext = await browser.newContext({ viewport });
    const visualPage = await visualContext.newPage();
    visualPage.on('pageerror', error => errors.push(error.message));
    await visualPage.goto(base + '#/games/cloudline-couriers');
    await waitForCloudlineSurface(visualPage);
    await assertNoHorizontalOverflow(visualPage, `${viewport.width}px Cloudline`);
    await visualPage.screenshot({ path: `test-results/cloudline-couriers/${viewport.label}.png`, fullPage: true });
    await visualContext.close();
  }

  const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const reduced = await reducedContext.newPage();
  reduced.on('pageerror', error => errors.push(error.message));
  await reduced.goto(base + '#/games/cloudline-couriers');
  await waitForCloudlineSurface(reduced);
  const courierAnimation = await reduced.locator('.cl-courier').evaluate(element => getComputedStyle(element).animationName);
  assert.equal(courierAnimation, 'none', 'Courier arrival/travel motion must be disabled under prefers-reduced-motion.');
  const beforeStatus = await reduced.locator('.cl-status').innerText();
  await reduced.getByRole('button', { name: 'Fly route' }).click();
  await reduced.waitForFunction(before => document.querySelector('.cl-status')?.textContent !== before, beforeStatus);
  assert.equal(await reduced.locator('.cl-flight-courier').count(), 0, 'Reduced-motion play must resolve the turn without a traveling airship animation.');
  assert.equal(await reduced.locator('.cl-effect').count(), 0, 'Reduced-motion play must not retain a hidden animation-only landing effect after the turn resolves.');
  assert.equal(await reduced.locator('.cl').getAttribute('data-flight-state'), 'idle', 'Reduced-motion play must not wait on an animation state.');
  const reducedAerie = reduced.locator('.cl-landmark').filter({ hasText: 'Aerie Post' });
  await reducedAerie.getByRole('button', { name: /Upgrade/ }).click();
  assert.notEqual(await reducedAerie.getAttribute('data-upgraded'), 'true', 'Reduced-motion upgrades must not retain animation-only upgraded state after the synchronous action.');
  await reducedContext.close();

  assert.deepEqual(errors, []);
  console.log('Cloudline design checks passed: first-screen purpose/help, first-session delivery→upgrade→starter-contract guidance, stepwise bounded flight, event/upgrade feedback, 390/1024/1440 reflow, reduced motion without stale animation state, and guest reload persistence.');
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
