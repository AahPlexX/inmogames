import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const port = 4186;
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
  throw new Error('Mergrove design Vite server did not start.');
}

async function noOverflow(page, label) {
  const report = await page.evaluate(() => ({ innerWidth, scrollWidth: document.documentElement.scrollWidth }));
  assert.ok(report.scrollWidth <= report.innerWidth, `${label} overflow: ${JSON.stringify(report)}`);
}

async function targetAtLeast(locator, label, minimum = 44) {
  const box = await locator.boundingBox();
  assert.ok(box, `${label} has no layout box.`);
  assert.ok(box.width >= minimum && box.height >= minimum, `${label} is ${box.width}×${box.height}, expected at least ${minimum}×${minimum}.`);
}

try {
  await waitForServer();
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined });
  const mobile = await browser.newContext({ viewport: { width: 320, height: 900 }, reducedMotion: 'no-preference' });
  const page = await mobile.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base + '#/games/mergrove');
  await page.getByRole('heading', { name: 'Grow the grove.', exact: true }).waitFor();
  assert.equal(await page.locator('.mg-cell').count(), 25);
  assert.equal(await page.locator('.mg-queue-piece').count(), 3);
  assert.equal(await page.locator('.mg-queue-piece').first().getAttribute('aria-pressed'), 'true');
  await targetAtLeast(page.locator('.mg-cell').first(), 'Mergrove board cell');
  await targetAtLeast(page.locator('.mg-queue-piece').first(), 'Mergrove queue choice');
  await noOverflow(page, 'Mergrove at 320px');

  await page.locator('.mg-cell').nth(0).click();
  await page.locator('.mg-cell').nth(1).click();
  await page.locator('.mg-cell').nth(2).click();
  await page.waitForFunction(() => document.querySelector('[data-stat="score"]')?.textContent?.trim() === '30');
  assert.equal((await page.locator('.mg-cell').nth(0).getAttribute('data-tier')), '0');
  assert.equal((await page.locator('.mg-cell').nth(1).getAttribute('data-tier')), '0');
  assert.equal((await page.locator('.mg-cell').nth(2).getAttribute('data-tier')), '2');
  assert.equal((await page.locator('[data-stat="sunlight"]').innerText()).trim(), '1');

  await page.reload();
  await page.waitForFunction(() => document.querySelector('[data-stat="score"]')?.textContent?.trim() === '30');
  assert.equal(await page.locator('.mg-cell').nth(2).getAttribute('data-tier'), '2', 'Guest active run must survive reload.');
  const thirdQueue = page.locator('.mg-queue-piece').nth(2);
  await thirdQueue.focus();
  await page.keyboard.press('Enter');
  assert.equal(await thirdQueue.getAttribute('aria-pressed'), 'true');
  const nextCell = page.locator('.mg-cell').nth(3);
  await nextCell.focus();
  await page.keyboard.press('Space');
  assert.equal(await nextCell.getAttribute('data-tier'), '1');

  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await noOverflow(page, 'Mergrove at 200% text');
  await mobile.close();

  const reduced = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const reducedPage = await reduced.newPage();
  reducedPage.on('pageerror', error => errors.push(error.message));
  await reducedPage.goto(base + '#/games/mergrove');
  await reducedPage.getByRole('heading', { name: 'Grow the grove.', exact: true }).waitFor();
  await reducedPage.locator('.mg-cell').nth(0).click();
  await reducedPage.locator('.mg-cell').nth(1).click();
  await reducedPage.locator('.mg-cell').nth(2).click();
  const mergedSprite = reducedPage.locator('.mg-cell--pulse .mg-spirit');
  await mergedSprite.waitFor();
  assert.equal(await mergedSprite.evaluate(element => getComputedStyle(element).animationName), 'none');
  await noOverflow(reducedPage, 'Mergrove with reduced motion');
  await reduced.close();

  // MER-022: next-draw preview, Escape cancels an armed compost, and compost still works afterwards.
  const recovery = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const recoveryPage = await recovery.newPage();
  recoveryPage.on('pageerror', error => errors.push(error.message));
  await recoveryPage.goto(base + '#/games/mergrove');
  await recoveryPage.getByRole('heading', { name: 'Grow the grove.', exact: true }).waitFor();
  const nextDraw = recoveryPage.locator('[data-mg="next-draw"]');
  assert.match((await nextDraw.innerText()).trim(), /^Next to arrive: Seed/, 'Next-draw preview must show the upcoming Seed.');
  const compostButton = recoveryPage.locator('.mg-sun-card .mg-secondary');
  assert.match((await compostButton.innerText()).trim(), /^Compost a piece \(4\)$/);
  assert.equal(await compostButton.isDisabled(), true, 'Compost must be disabled below 4 sunlight.');
  // Three Seed trios, the last cascading three Sprouts into a Bud, are four merge stages = exactly 4 sunlight.
  for (const cell of [0, 1, 2, 5, 6, 7, 10, 11, 12]) await recoveryPage.locator('.mg-cell').nth(cell).click();
  await recoveryPage.waitForFunction(() => document.querySelector('[data-stat="sunlight"]')?.textContent?.trim() === '4');
  assert.equal(await recoveryPage.locator('.mg-cell').nth(12).getAttribute('data-tier'), '3');
  await compostButton.click();
  assert.equal((await compostButton.innerText()).trim(), 'Cancel compost');
  assert.equal(await compostButton.getAttribute('aria-pressed'), 'true');
  await recoveryPage.keyboard.press('Escape');
  assert.equal(await compostButton.getAttribute('aria-pressed'), 'false', 'Escape must disarm compost.');
  assert.match((await recoveryPage.locator('.mg-status').innerText()).trim(), /^Compost cancelled\./);
  assert.equal((await recoveryPage.locator('[data-stat="sunlight"]').innerText()).trim(), '4', 'Cancelling must not spend sunlight.');
  await compostButton.click();
  await recoveryPage.locator('.mg-cell').nth(12).click();
  assert.equal(await recoveryPage.locator('.mg-cell').nth(12).getAttribute('data-tier'), '0');
  assert.equal((await recoveryPage.locator('[data-stat="sunlight"]').innerText()).trim(), '0');
  await noOverflow(recoveryPage, 'Mergrove recovery flow');
  await recovery.close();

  assert.deepEqual(errors, []);
  console.log('Mergrove design checks passed: 25-cell board, queue selection, trio merge, guest reload, keyboard play, 44px targets, 320px/200% reflow, reduced motion, next-draw preview and Escape-to-cancel compost.');
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
