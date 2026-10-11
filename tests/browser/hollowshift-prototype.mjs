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
const viewports = [
  [320, 568],
  [390, 844],
  [844, 390],
  [768, 1024],
  [1024, 768],
  [1440, 900],
  [1920, 1080],
];

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

async function load(page) {
  await page.goto(pageUrl);
  await page.getByRole('heading', { name: 'Hollowshift', exact: true }).waitFor();
}

async function noOverflow(page, label) {
  const report = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  assert.ok(report.scrollWidth <= report.innerWidth, `${label} overflow: ${JSON.stringify(report)}`);
}

async function targetAtLeast(locator, label, minimum = 44) {
  const box = await locator.boundingBox();
  assert.ok(box, `${label} has no layout box.`);
  assert.ok(
    box.width >= minimum && box.height >= minimum,
    `${label} is ${box.width}×${box.height}; expected at least ${minimum}×${minimum}.`,
  );
}

async function assertGridContract(page) {
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
  assert.equal(await grid.getByRole('gridcell').count(), 49, 'The board must expose 49 gridcells.');
  assert.equal(
    await grid.locator('[role="gridcell"][tabindex="0"]').count(),
    1,
    'Exactly one gridcell must participate in the page tab sequence.',
  );
}

try {
  await waitForServer();
  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_PATH || undefined,
  });

  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await load(page);

  await assertGridContract(page);
  await page.getByRole('group', { name: 'Expedition status' }).waitFor();
  await page.getByRole('group', { name: 'Board legend' }).waitFor();
  await page.getByRole('complementary', { name: 'Expedition guidance' }).waitFor();

  const selected = page.locator('[role="gridcell"][tabindex="0"]');
  await selected.focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('[role="gridcell"][tabindex="0"]').getAttribute('data-index'), '43');
  await page.keyboard.press('Home');
  assert.equal(await page.locator('[role="gridcell"][tabindex="0"]').getAttribute('data-index'), '42');
  await page.keyboard.press('End');
  assert.equal(await page.locator('[role="gridcell"][tabindex="0"]').getAttribute('data-index'), '48');
  await page.keyboard.press('ArrowUp');
  assert.equal(await page.locator('[role="gridcell"][tabindex="0"]').getAttribute('data-index'), '41');
  const focusStyle = await page.locator('[role="gridcell"][tabindex="0"]').evaluate(element => {
    const style = getComputedStyle(element);
    return { outlineStyle: style.outlineStyle, outlineWidth: parseFloat(style.outlineWidth) };
  });
  assert.notEqual(focusStyle.outlineStyle, 'none', 'Focused gridcell needs a visible outline.');
  assert.ok(focusStyle.outlineWidth >= 2, `Focused gridcell outline is only ${focusStyle.outlineWidth}px.`);

  const turnText = async () => (await page.locator('#turn').innerText()).trim();
  const beforePreview = await turnText();
  await page.getByRole('button', { name: 'Preview rotate right' }).click();
  await page.locator('#preview.active').waitFor();
  assert.equal(await turnText(), beforePreview, 'Preview must not spend a turn.');
  await page.getByRole('button', { name: 'Cancel' }).click();
  assert.equal(await page.locator('#preview.active').count(), 0, 'Cancel must close preview mode.');
  assert.equal(await turnText(), beforePreview, 'Cancel must not spend a turn.');
  await page.getByRole('button', { name: 'Preview rotate right' }).click();
  await page.getByRole('button', { name: 'Commit' }).click();
  assert.notEqual(await turnText(), beforePreview, 'Committed geometry must spend a turn.');

  for (const [width, height] of viewports) {
    await page.setViewportSize({ width, height });
    await load(page);
    await assertGridContract(page);
    await noOverflow(page, `Hollowshift ${width}×${height}`);
    await targetAtLeast(page.locator('[role="gridcell"]').first(), `gridcell at ${width}×${height}`);
    await targetAtLeast(page.getByRole('button', { name: 'Survey nearby' }), `Survey button at ${width}×${height}`);
  }

  await page.setViewportSize({ width: 320, height: 568 });
  await load(page);
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await noOverflow(page, 'Hollowshift at 320×568 with 200% text');
  await targetAtLeast(page.locator('[role="gridcell"]').first(), 'gridcell at 200% text');
  await context.close();

  const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const touchPage = await touch.newPage();
  await load(touchPage);
  await touchPage.locator('[role="gridcell"][data-index="24"]').tap();
  await touchPage.locator('[data-shift="right"]').tap();
  await touchPage.locator('#preview.active').waitFor();
  assert.equal(await touchPage.locator('[draggable="true"]').count(), 0, 'Core play must not require draggable controls.');
  await touchPage.getByRole('button', { name: 'Cancel' }).tap();
  await touch.close();

  const reduced = await browser.newContext({ viewport: { width: 844, height: 390 }, reducedMotion: 'reduce' });
  const reducedPage = await reduced.newPage();
  await load(reducedPage);
  const motionMs = await reducedPage.locator('.cell').first().evaluate(element => {
    const toMs = value => value.split(',').reduce((max, part) => {
      const item = part.trim();
      const amount = Number.parseFloat(item) || 0;
      return Math.max(max, item.endsWith('ms') ? amount : amount * 1000);
    }, 0);
    const style = getComputedStyle(element);
    return Math.max(toMs(style.animationDuration), toMs(style.transitionDuration));
  });
  assert.ok(motionMs <= 1, `Reduced-motion presentation still has ${motionMs}ms animation/transition duration.`);
  await reducedPage.locator('[role="gridcell"][data-index="24"]').click();
  await reducedPage.getByRole('button', { name: 'Preview rotate left' }).click();
  await reducedPage.getByRole('button', { name: 'Commit' }).click();
  await noOverflow(reducedPage, 'Hollowshift reduced-motion landscape');
  await reduced.close();

  assert.deepEqual(errors, [], `Browser console/page errors: ${errors.join(' | ')}`);
  console.log('Hollowshift prototype checks passed: ARIA grid/landmarks, full viewport matrix, 44px targets, 200% text, keyboard, preview/cancel, touch and reduced motion.');
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
