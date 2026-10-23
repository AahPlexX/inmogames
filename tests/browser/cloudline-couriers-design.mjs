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

function seededRun(overrides = {}) {
  return {
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
}

async function openSeededCloudline(browserInstance, overrides) {
  const context = await browserInstance.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(({ key, activeRun }) => {
    if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify({ schemaVersion: 1, state: { activeRun } }));
  }, { key: cloudlineStorageKey, activeRun: seededRun(overrides) });
  await page.goto(base + '#/games/cloudline-couriers');
  await waitForCloudlineSurface(page);
  return { context, page };
}

async function readSeededCurrentJob(browserInstance, overrides) {
  const { context, page } = await openSeededCloudline(browserInstance, overrides);
  const currentJob = (await page.locator('#cl-job-title + p').innerText()).trim();
  await context.close();
  return currentJob;
}

async function readSeededLandmarkStageLayers(browserInstance) {
  const { context, page } = await openSeededCloudline(browserInstance, {
    landmarks: [1, 2, 3, 4],
    credits: 0,
    deliveries: 4,
    streak: 0,
    message: 'District improvements in progress.',
  });
  const layerCounts = await page.locator('.cl-landmark').evaluateAll(elements => elements.map(element => element.querySelectorAll('[data-cl-stage-layer]').length));
  await context.close();
  return layerCounts;
}

async function checkClientTriage(browserInstance) {
  const failures = [];
  const check = (condition, message) => { if (!condition) failures.push(message); };
  const small = await openSeededCloudline(browserInstance, {});
  await small.page.setViewportSize({ width: 320, height: 900 });
  for (const fontSize of ['100%', '200%']) {
    await small.page.evaluate(size => { document.documentElement.style.fontSize = size; }, fontSize);
    const geometry = await small.page.evaluate(() => {
      const board = document.querySelector('.cl-board').getBoundingClientRect();
      const controls = [...document.querySelectorAll('.cl-boost button, .cl-fly')].map(element => element.getBoundingClientRect().toJSON());
      return { board: board.toJSON(), controls, width: innerWidth, scrollWidth: document.documentElement.scrollWidth };
    });
    check(geometry.controls.every(box => box.top >= geometry.board.bottom && box.height >= 44 && box.width >= 44), `CLC-008-A1 controls overlap route or miss 44px targets at 320px/${fontSize}`);
    check(geometry.scrollWidth <= geometry.width + 1, `CLC-008-A1 overflow at 320px/${fontSize}`);
    await small.page.screenshot({ path: `test-results/cloudline-couriers/phone-320-${fontSize.replace('%', '')}.png`, fullPage: true });
  }
  await small.context.close();

  const job = await readSeededCurrentJob(browserInstance, { deliveries: 3, streak: 0, landmarks: [1,0,0,0] });
  check(/0\/4/.test(job) && /storm/i.test(job), 'CLC-015-A1 starter guidance must use streak zero after a storm, not lifetime deliveries');

  const cargo = await openSeededCloudline(browserInstance, { pendingCargo: { options: [40,60,100] }, position: 7 });
  await cargo.page.addStyleTag({ content: '.cl * { animation: none !important; }' });
  await cargo.page.getByRole('button', { name: 'Choose pod 2', exact: true }).click();
  await cargo.page.emulateMedia({ reducedMotion: 'reduce' });
  check(/510/.test(await cargo.page.locator('.cl-stats').innerText()), 'CLC-005-A1 cargo reward must settle without animationend');
  check(await cargo.page.getByRole('button', { name: 'Fly route', exact: true }).isEnabled(), 'CLC-005-A1 cargo must not lock flight when animation is disabled');
  await cargo.page.reload();
  await waitForCloudlineSurface(cargo.page);
  check(/510/.test(await cargo.page.locator('.cl-stats').innerText()), 'CLC-005-A1 cargo reward must persist before animation ends');
  await cargo.context.close();

  const districtCargo = await openSeededCloudline(browserInstance, {
    pendingCargo: { options: [40,60,100] }, credits: 10000, landmarks: [4,4,4,3], district: 1,
  });
  await districtCargo.page.emulateMedia({ reducedMotion: 'reduce' });
  const finalLandmark = districtCargo.page.locator('.cl-landmark').filter({ hasText: 'Skyforge Hangar' });
  const finalUpgrade = finalLandmark.getByRole('button', { name: 'Upgrade for 480 credits', exact: true });
  check(await finalUpgrade.isDisabled(), 'CLC-005-A2 the final district upgrade must wait until pending cargo is chosen');
  await districtCargo.page.getByRole('button', { name: 'Choose pod 2', exact: true }).click();
  check(/Credits\s+10060/.test(await districtCargo.page.locator('.cl-stats').innerText()) && /District\s+1/.test(await districtCargo.page.locator('.cl-stats').innerText()), 'CLC-005-A2 pod rewards must retain their district-one value before rebuilding');
  await finalUpgrade.click();
  check(/Credits\s+9830/.test(await districtCargo.page.locator('.cl-stats').innerText()) && /District\s+2/.test(await districtCargo.page.locator('.cl-stats').innerText()), 'CLC-005-A2 choosing cargo before the final upgrade must preserve its district-one reward through district rebuild');
  await districtCargo.context.close();

  const fuel = await openSeededCloudline(browserInstance, { fuel: 4 });
  await fuel.page.emulateMedia({ reducedMotion: 'reduce' });
  await fuel.page.getByRole('button', { name: '3×', exact: true }).click();
  await fuel.page.getByRole('button', { name: 'Fly route', exact: true }).click();
  check(await fuel.page.getByRole('button', { name: '1×', exact: true }).getAttribute('aria-pressed') === 'true', 'CLC-003-A1 select an affordable boost after spending fuel');
  check(await fuel.page.getByRole('button', { name: 'Fly route', exact: true }).isEnabled(), 'CLC-003-A1 low fuel must leave a usable next flight');
  for (const [boost, cost] of [['2×', '2 fuel'], ['3×', '3 fuel']]) {
    const button = fuel.page.getByRole('button', { name: boost, exact: true });
    check(await button.isDisabled() && (await button.getAttribute('title'))?.includes(cost), `CLC-003-A1 ${boost} must be disabled with its fuel cost explained`);
  }
  check(/Fuel remaining: 1\/30/.test(await fuel.page.locator('#cl-boost-cost').innerText()), 'CLC-003-A1 boost guidance must state the remaining fuel');
  await fuel.page.getByText('Route options', { exact: true }).click();
  let confirmations = 0;
  fuel.page.on('dialog', async dialog => { confirmations += 1; await dialog.dismiss(); });
  const before = await fuel.page.locator('.cl-stats').innerText();
  await fuel.page.getByRole('button', { name: 'Start fresh route', exact: true }).click();
  await fuel.page.getByRole('button', { name: 'Reset saved career', exact: true }).click();
  check(confirmations === 2 && before === await fuel.page.locator('.cl-stats').innerText(), 'CLC-009-A1 canceling either destructive action must preserve progress');
  await fuel.context.close();
  const skipped = await openSeededCloudline(browserInstance, { rngState: 1 });
  await skipped.page.getByRole('button', { name: 'Fly route', exact: true }).click();
  await skipped.page.locator('.cl[data-flight-state="flying"]').waitFor();
  await skipped.page.getByRole('button', { name: 'Skip flight', exact: true }).click();
  await skipped.page.locator('.cl[data-flight-state="idle"]').waitFor();
  // Let the original one-stop flight timer expire; skipping must not settle twice.
  await delay(450);
  check(/Credits\s+495/.test(await skipped.page.locator('.cl-stats').innerText()) && /Fuel\s+17/.test(await skipped.page.locator('.cl-stats').innerText()) && /At Sunspoke Market/.test(await skipped.page.locator('.cl-flight-result').innerText()), 'CLC-001 skipping roll 1 must settle its market reward, fuel cost, and destination exactly once');
  await skipped.page.reload();
  await waitForCloudlineSurface(skipped.page);
  check(/Credits\s+495/.test(await skipped.page.locator('.cl-stats').innerText()) && /Fuel\s+17/.test(await skipped.page.locator('.cl-stats').innerText()) && /At Sunspoke Market/.test(await skipped.page.locator('.cl-flight-result').innerText()), 'CLC-001 skipped-flight settlement must persist after reload');
  await skipped.context.close();
  const motion = await openSeededCloudline(browserInstance, { rngState: 123456789 });
  await motion.page.getByRole('button', { name: 'Fly route', exact: true }).focus();
  await motion.page.keyboard.press('Space');
  await motion.page.locator('.cl[data-flight-state="flying"]').waitFor();
  await motion.page.emulateMedia({ reducedMotion: 'reduce' });
  try {
    await motion.page.locator('.cl[data-flight-state="idle"]').waitFor({ timeout: 250 });
  } catch { failures.push('CLC-027-A1 changing reduced motion during flight must resolve immediately'); }
  check(await motion.page.locator('.cl-effect').count() === 0, 'CLC-027-A1 motion change must not retain decorative feedback');
  await motion.context.close();
  assert.deepEqual(failures, [], 'Client triage acceptance failures');
}

try {
  await waitForServer();
  await mkdir('test-results/cloudline-couriers', { recursive: true });
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined });
  await checkClientTriage(browser);
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
  const helpCopy = await page.locator('.cl-help').innerText();
  assert.match(helpCopy, /Choose a boost.*Fly route.*Spend credits/is, 'Replayable help must explain the core boost → fly → rebuild loop in plain language.');
  assert.match(helpCopy, /Windgates carry you 2 more stops without triggering another event/i, 'Help must explain that a Windgate’s extra movement does not trigger a recursive landing event.');
  assert.match(helpCopy, /3 reserve fuel lets you keep flying/i, 'Help must explain how the emergency fuel reserve prevents a dead end.');

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
    'Delivery bonus: complete 4 deliveries without an unshielded storm. Current streak 1/4. The fourth delivery pays an extra 120 credits at 1×.',
  ], 'CLC-011/CLC-015 first-session guidance must preserve the delivery → upgrade → starter-contract teaching sequence.');

  assert.deepEqual(
    await readSeededLandmarkStageLayers(browser),
    [1, 2, 3, 4],
    'CLC-004/CLC-007 landmark stages must add visible authored structure at every earned stage instead of changing only progress pips.',
  );

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
  console.log('Cloudline design checks passed: purpose/help and first-win guidance; streak-correct bonus; visible landmark stages; stepwise/skippable flight; live reduced-motion changes; animation-independent cargo settlement/reload; affordable boost recovery; reset cancellation; 320px/200%-text and 390/1024/1440 reflow; guest persistence.');
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
