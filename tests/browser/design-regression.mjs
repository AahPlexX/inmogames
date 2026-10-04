import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const port = 4176;
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
let browser;
const errors = [];
const base = `http://127.0.0.1:${port}/inmogames/`;

async function waitForServer() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      if ((await fetch(base)).ok) return;
    } catch {}
    await delay(100);
  }
  throw new Error('Design-regression Vite server did not start.');
}

async function assertNoOverflow(page, label) {
  const report = await page.evaluate(() => ({
    innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    offenders: [...document.querySelectorAll('body *')].map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        tag: element.tagName,
        className: element.className,
        text: element.textContent?.trim().slice(0, 50) ?? '',
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
      };
    }).filter((item) => item.left < -1 || item.right > innerWidth + 1).slice(0, 15),
  }));
  assert.ok(report.scrollWidth <= report.innerWidth, `${label} overflow: ${JSON.stringify(report)}`);
}

async function assertTouchTarget(locator, label, minimum = 44) {
  const box = await locator.boundingBox();
  assert.ok(box, `${label} has no layout box.`);
  assert.ok(box.width >= minimum && box.height >= minimum, `${label} is ${box.width}×${box.height}, expected at least ${minimum}×${minimum}.`);
}

function cssRgb(value) {
  const numbers = value.match(/[\d.]+/g)?.slice(0, 3).map(Number);
  if (!numbers || numbers.length !== 3) throw new Error(`Unsupported computed color: ${value}`);
  return numbers;
}

function relativeLuminance([red, green, blue]) {
  const linear = [red, green, blue].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

async function assertContrast(foreground, background, label, minimum = 4.5) {
  const foregroundColor = await foreground.evaluate((element) => getComputedStyle(element).color);
  const backgroundColor = await background.evaluate((element) => getComputedStyle(element).backgroundColor);
  const fg = relativeLuminance(cssRgb(foregroundColor));
  const bg = relativeLuminance(cssRgb(backgroundColor));
  const ratio = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
  assert.ok(ratio >= minimum, `${label} contrast is ${ratio.toFixed(2)}:1, expected at least ${minimum}:1 (${foregroundColor} on ${backgroundColor}).`);
}

async function assertCatalogContrast(page, theme) {
  await assertContrast(page.locator('.eyebrow').first(), page.locator('body'), `${theme} catalog eyebrow`);
  await assertContrast(page.locator('.catalog-hero > p').last(), page.locator('body'), `${theme} catalog supporting copy`);
  const accountButton = page.getByRole('button', { name: 'Sign in / create account', exact: true });
  await accountButton.waitFor();
  await assertContrast(accountButton, accountButton, `${theme} account primary action`);
}

try {
  await waitForServer();
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined });

  const phone = await browser.newContext({ viewport: { width: 320, height: 900 }, colorScheme: 'light' });
  const page = await phone.newPage();
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto(base);
  const catalogSkip = page.getByRole('button', { name: 'Skip to games', exact: true });
  await catalogSkip.waitFor();
  await assertNoOverflow(page, 'catalog at 320px');
  assert.equal(await page.locator('.game-card').count(), 2);
  await assertCatalogContrast(page, 'Light');
  const phoneCards = await page.locator('.game-card').evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().toJSON()));
  assert.ok(phoneCards[1].top > phoneCards[0].top, 'Phone catalog cards should stack vertically.');
  await catalogSkip.focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'main-content');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await assertNoOverflow(page, 'catalog at 200% text');
  await page.evaluate(() => { document.documentElement.style.fontSize = ''; });

  await page.goto(base + '#/games/threefold');
  const gameSkip = page.getByRole('button', { name: 'Skip to game', exact: true });
  await gameSkip.waitFor();
  const firstTile = page.locator('.threefold-board button').first();
  await firstTile.waitFor();
  await assertNoOverflow(page, 'Threefold at 320px');
  assert.equal(await page.locator('.threefold-board button').count(), 9);
  await page.getByLabel('Selected tiles', { exact: true }).waitFor();
  await firstTile.focus();
  await page.keyboard.press('Enter');
  assert.equal(await firstTile.getAttribute('aria-pressed'), 'true');
  assert.ok((await firstTile.evaluate((element) => getComputedStyle(element, '::after').content)).includes('✓'));
  await assertTouchTarget(firstTile, 'Threefold tile');
  await page.getByText(/Round value \d+ points/).waitFor();
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await assertNoOverflow(page, 'Threefold at 200% text');
  await page.evaluate(() => { document.documentElement.style.fontSize = ''; });

  await page.goto(base + '#/games/royal-palace-blackjack');
  await page.getByRole('button', { name: 'Add 5 virtual-credit chip', exact: true }).waitFor();
  await assertNoOverflow(page, 'Royal Palace at 320px');
  await page.locator('summary').filter({ hasText: 'Table rules & help' }).waitFor();
  const chip = page.getByRole('button', { name: 'Add 5 virtual-credit chip', exact: true });
  await assertTouchTarget(chip, 'Blackjack chip', 48);
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await assertNoOverflow(page, 'Royal Palace at 200% text');
  await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
  await phone.close();

  const dark = await browser.newContext({ viewport: { width: 320, height: 900 }, colorScheme: 'dark' });
  const darkPage = await dark.newPage();
  darkPage.on('pageerror', (error) => errors.push(error.message));
  await darkPage.goto(base);
  await darkPage.getByRole('button', { name: 'Skip to games', exact: true }).waitFor();
  await assertNoOverflow(darkPage, 'dark catalog at 320px');
  await assertCatalogContrast(darkPage, 'Dark');
  await dark.close();

  const desktop = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'light' });
  const desktopPage = await desktop.newPage();
  desktopPage.on('pageerror', (error) => errors.push(error.message));
  await desktopPage.goto(base);
  await desktopPage.locator('.game-card').first().waitFor();
  const desktopCards = await desktopPage.locator('.game-card').evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().toJSON()));
  assert.ok(Math.abs(desktopCards[0].top - desktopCards[1].top) < 4, 'Desktop catalog cards should share a row.');
  assert.ok(desktopCards[1].left > desktopCards[0].left, 'Desktop catalog should use two columns.');
  await assertNoOverflow(desktopPage, 'catalog at desktop width');
  await desktop.close();

  const reduced = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const reducedPage = await reduced.newPage();
  reducedPage.on('pageerror', (error) => errors.push(error.message));
  await reducedPage.goto(base + '#/games/royal-palace-blackjack');
  await reducedPage.getByRole('button', { name: 'Add 5 virtual-credit chip', exact: true }).waitFor();
  await reducedPage.getByRole('button', { name: 'Add 5 virtual-credit chip', exact: true }).click();
  await reducedPage.getByRole('button', { name: 'Deal', exact: true }).click();
  await reducedPage.locator('.rp-card').first().waitFor();
  assert.equal(await reducedPage.locator('.rp-card').first().evaluate((element) => getComputedStyle(element).animationName), 'none');
  await assertNoOverflow(reducedPage, 'Royal Palace with reduced motion');
  await reducedPage.goto(base + '#/games/threefold');
  const reducedTile = reducedPage.locator('.threefold-board button').first();
  await reducedTile.waitFor();
  await reducedTile.click();
  assert.equal(await reducedTile.evaluate((element) => getComputedStyle(element).transform), 'none');
  await assertNoOverflow(reducedPage, 'Threefold with reduced motion');
  await reduced.close();

  assert.deepEqual(errors, []);
  console.log('Design regression checks passed: light/dark catalog contrast, skip controls, 320px/200% reflow, Threefold keyboard/non-color/reduced-motion behavior, Blackjack touch targets/help, desktop layout and reduced motion.');
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
