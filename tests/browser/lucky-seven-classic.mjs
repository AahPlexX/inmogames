import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const port = 4183;
const blankFirebase = { VITE_FIREBASE_API_KEY: '', VITE_FIREBASE_AUTH_DOMAIN: '', VITE_FIREBASE_PROJECT_ID: '', VITE_FIREBASE_APP_ID: '' };
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
  env: { ...process.env, ...blankFirebase }, stdio: 'pipe',
});
const base = `http://127.0.0.1:${port}/inmogames/#/games/lucky-seven-classic`;
let browser;

async function waitForServer() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try { if ((await fetch(`http://127.0.0.1:${port}/inmogames/`)).ok) return; } catch {}
    await delay(100);
  }
  throw new Error('Lucky Seven Classic Vite server did not start.');
}

try {
  await waitForServer();
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined });
  const context = await browser.newContext({ viewport: { width: 320, height: 900 }, colorScheme: 'light', reducedMotion: 'reduce' });
  await context.addInitScript(() => {
    globalThis.__lscStops = [];
    globalThis.__lscThrow = false;
    globalThis.__lscAudioContexts = 0;
    const original = Crypto.prototype.getRandomValues;
    Crypto.prototype.getRandomValues = function deterministicLuckySeven(array) {
      if (globalThis.__lscThrow) {
        globalThis.__lscThrow = false;
        throw new Error('Injected random source failure');
      }
      if (array instanceof Uint32Array && array.length === 1) {
        const queue = globalThis.__lscStops;
        array[0] = Array.isArray(queue) && queue.length ? queue.shift() : 0;
        return array;
      }
      return original.call(this, array);
    };
    const NativeAudioContext = globalThis.AudioContext;
    if (NativeAudioContext) {
      globalThis.AudioContext = class CountingAudioContext extends NativeAudioContext {
        constructor(...args) { super(...args); globalThis.__lscAudioContexts += 1; }
      };
    }
  });

  const page = await context.newPage();
  await page.goto(base);
  const machine = page.locator('.lsc');
  await machine.waitFor({ timeout: 3000 });

  assert.equal(await page.locator('.lsc-reel').count(), 3, 'Lucky Seven should render exactly three reels.');
  assert.equal(await page.locator('.lsc-symbol').count(), 9, 'Each classic reel should visibly show previous, center and next symbols.');
  assert.ok(await page.getByText('Paytable & rules', { exact: true }).isVisible(), 'Paytable/rules must be discoverable before first spin.');
  assert.ok(await page.getByText('Center payline', { exact: true }).isVisible(), 'The paying row must be identified with text.');

  const spin = page.getByRole('button', { name: /Pull \/ Spin · 1 credit/i });
  const spinBox = await spin.boundingBox();
  assert.ok(spinBox && spinBox.height >= 48, `Primary spin target should be at least 48px tall; got ${spinBox?.height}.`);
  assert.ok((await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 1, '320px layout must not horizontally overflow.');
  assert.equal(await page.evaluate(() => globalThis.__lscAudioContexts), 0, 'Audio must not initialize before opt-in.');

  await page.evaluate(() => { globalThis.__lscThrow = true; });
  await spin.click();
  await page.getByText(/random outcome source was unavailable/i).waitFor();
  assert.match(await page.locator('.lsc-meter').innerText(), /500/, 'Random-source failure must not deduct the wager.');

  await page.evaluate(() => { globalThis.__lscStops = [20, 18, 17]; });
  await spin.focus();
  await page.keyboard.press('Space');
  await page.getByText(/3 Gold 7s/i).waitFor({ timeout: 2000 });
  assert.match(await page.locator('.lsc-meter').innerText(), /999/, 'One-credit three-Gold-7 result should settle bankroll to 999.');
  assert.equal(await page.evaluate(() => globalThis.__lscAudioContexts), 0, 'Sound-off winning spin must remain silent.');

  const reducedAnimation = await page.locator('.lsc-reel').first().evaluate((element) => {
    const style = getComputedStyle(element);
    return { name: style.animationName, duration: style.animationDuration };
  });
  assert.ok(reducedAnimation.name === 'none' || reducedAnimation.duration === '0s', `Reduced motion should suppress reel animation; got ${JSON.stringify(reducedAnimation)}.`);

  await page.reload();
  await machine.waitFor();
  assert.match(await page.locator('.lsc-meter').innerText(), /999/, 'Settled bankroll must survive reload.');
  assert.match(await page.locator('.lsc-foot').innerText(), /1 completed spin/, 'Spin count must survive reload.');

  await page.getByText('Preferences & saved game', { exact: true }).click();
  await page.getByRole('button', { name: 'Sound off', exact: true }).click();
  await page.evaluate(() => { globalThis.__lscStops = [0, 0, 0]; });
  await page.getByRole('button', { name: /Pull \/ Spin · 1 credit/i }).click();
  await page.getByText(/3 Red 7s/i).waitFor({ timeout: 2000 });
  assert.ok((await page.evaluate(() => globalThis.__lscAudioContexts)) > 0, 'Sound-on user-triggered play should create Web Audio.');

  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await delay(100);
  assert.ok((await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 1, '200% text at 320px must not horizontally overflow.');
  assert.ok(await page.getByRole('button', { name: /Pull \/ Spin/i }).isVisible(), 'Primary action must remain available at 200% text.');

  await page.evaluate(() => {
    localStorage.setItem('inmogames:lucky-seven-classic:v1', JSON.stringify({
      schemaVersion: 1,
      state: {
        bankroll: 0, selectedWager: 1, spins: 9, totalWagered: 25, totalWon: 9, net: -16, largestWin: 5,
        preferences: { sound: false, motion: true }, lastResult: null,
      },
    }));
    document.documentElement.style.fontSize = '';
  });
  await page.reload();
  await page.getByRole('button', { name: 'Restore 500 practice credits', exact: true }).waitFor();
  assert.match(await page.locator('.lsc-foot').innerText(), /9 completed spins/, 'Depleted fixture should retain durable history.');
  await page.getByRole('button', { name: 'Restore 500 practice credits', exact: true }).click();
  await page.getByText(/Practice bankroll restored to 500/i).waitFor();
  assert.match(await page.locator('.lsc-meter').innerText(), /500/, 'Restore should replenish only the virtual bankroll.');
  assert.match(await page.locator('.lsc-foot').innerText(), /9 completed spins/, 'Restore must preserve prior statistics.');

  console.log('Lucky Seven browser checks passed: route/cabinet, RNG safety, deterministic settlement/reload, restore, 320px/200%-text reflow, 48px action, reduced motion and opt-in audio.');
  await context.close();
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
