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
const base = `http://127.0.0.1:${port}/inmogames/#/games/royal-fortune-slots`;
let browser;

async function waitForServer() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try { if ((await fetch(`http://127.0.0.1:${port}/inmogames/`)).ok) return; } catch {}
    await delay(100);
  }
  throw new Error('Royal Fortune Vite server did not start.');
}

try {
  await waitForServer();
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined });
  const context = await browser.newContext({ viewport: { width: 320, height: 900 }, colorScheme: 'light' });
  await context.addInitScript(() => {
    globalThis.__rfStops = [];
    globalThis.__rfThrow = false;
    globalThis.__rfAudioContexts = 0;
    const original = Crypto.prototype.getRandomValues;
    Crypto.prototype.getRandomValues = function deterministicRoyalFortune(array) {
      if (globalThis.__rfThrow) {
        globalThis.__rfThrow = false;
        throw new Error('Injected random source failure');
      }
      if (array instanceof Uint32Array && array.length === 1) {
        const queue = globalThis.__rfStops;
        array[0] = Array.isArray(queue) && queue.length ? queue.shift() : 0;
        return array;
      }
      return original.call(this, array);
    };
    const NativeAudioContext = globalThis.AudioContext;
    if (NativeAudioContext) {
      globalThis.AudioContext = class CountingAudioContext extends NativeAudioContext {
        constructor(...args) { super(...args); globalThis.__rfAudioContexts += 1; }
      };
    }
  });
  const page = await context.newPage();
  await page.goto(base);

  await page.getByRole('heading', { name: /Royal Fortune/i }).waitFor().catch(async () => {
    await page.getByText('Royal Fortune', { exact: true }).waitFor();
  });
  const machine = page.locator('.rf');
  await machine.waitFor();
  assert.equal(await page.locator('.rf-reel').count(), 5, 'Royal Fortune should render exactly five reels.');
  assert.equal(await page.locator('.rf-symbol').count(), 15, 'Royal Fortune should render a 5×3 visible window.');
  assert.ok(await page.getByText('Paytable & rules', { exact: true }).isVisible(), 'Rules/paytable must be discoverable before the first spin.');

  const spin = page.getByRole('button', { name: /Spin · 10 credits/i });
  const spinBox = await spin.boundingBox();
  assert.ok(spinBox && spinBox.height >= 48, `Primary Spin target should be at least 48px tall; got ${spinBox?.height}.`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  assert.ok(overflow <= 1, `320px layout should not create page-level horizontal overflow; overflow=${overflow}.`);

  assert.equal(await page.evaluate(() => globalThis.__rfAudioContexts), 0, 'Audio must not initialize before opt-in/user-triggered sound use.');
  await page.evaluate(() => { globalThis.__rfThrow = true; });
  await spin.click();
  await page.getByText(/random outcome source was unavailable/i).waitFor();
  assert.match(await page.locator('.rf-meter').innerText(), /2,500/, 'Random-source failure must not deduct the wager.');
  assert.equal(await page.evaluate(() => globalThis.__rfAudioContexts), 0, 'Failed outcome generation must not initialize sound while sound is off.');

  await page.evaluate(() => { globalThis.__rfStops = [25, 3, 19, 0, 0]; });
  await spin.focus();
  await page.keyboard.press('Space');
  await page.getByText(/8 free spins remain/i).waitFor({ timeout: 3000 });
  assert.match(await page.locator('.rf-feature').innerText(), /8 remaining/i, 'Three Scatters should enter an eight-spin feature.');
  assert.equal(await page.evaluate(() => globalThis.__rfAudioContexts), 0, 'Sound-off spin must remain silent.');

  await page.reload();
  await page.locator('.rf').waitFor();
  await page.getByRole('button', { name: /Play free spin · 8 remaining/i }).waitFor();
  assert.match(await page.locator('.rf-feature').innerText(), /8 remaining/i, 'A settled free-spin checkpoint should survive reload without duplicating or losing spins.');

  await page.evaluate(() => { globalThis.__rfStops = [0, 0, 0, 0, 0]; });
  await page.getByRole('button', { name: /Play free spin · 8 remaining/i }).click();
  await page.getByText(/7 free spins remain/i).waitFor({ timeout: 3000 });

  await page.getByText('Preferences & saved game', { exact: true }).click();
  await page.getByRole('button', { name: /Reduced effects off/i }).click();
  assert.equal(await page.locator('.rf').getAttribute('data-reduced'), 'true', 'Explicit reduced-effects preference should mark the machine.');
  await page.getByRole('button', { name: /Sound off/i }).click();
  await page.evaluate(() => { globalThis.__rfStops = [0, 0, 0, 0, 0]; });
  await page.getByRole('button', { name: /Play free spin · 7 remaining/i }).click();
  await page.getByText(/6 free spins remain/i).waitFor({ timeout: 1500 });
  assert.ok((await page.evaluate(() => globalThis.__rfAudioContexts)) > 0, 'Sound-on user-triggered play should create a Web Audio context.');

  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await delay(100);
  const zoomOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  assert.ok(zoomOverflow <= 1, `200% text at 320px should not horizontally overflow; overflow=${zoomOverflow}.`);
  assert.ok(await page.getByRole('button', { name: /Play free spin/i }).isVisible(), 'Primary free-spin control should remain available at 200% text.');

  await page.evaluate(() => {
    localStorage.setItem('inmogames:royal-fortune-slots:v1', JSON.stringify({
      schemaVersion: 1,
      state: {
        bankroll: 0,
        selectedWager: 10,
        spins: 9,
        freeSpinsPlayed: 2,
        totalWagered: 50,
        totalWon: 40,
        net: -10,
        largestWin: 20,
        preferences: { sound: false, reducedEffects: false },
        lastResult: null,
        feature: null,
      },
    }));
  });
  await page.reload();
  await page.getByRole('button', { name: 'Restore 2,500 practice credits' }).waitFor();
  assert.match(await page.locator('.rf-foot').innerText(), /9 completed spins/, 'Depleted-save fixture should preserve session history.');
  await page.getByRole('button', { name: 'Restore 2,500 practice credits' }).click();
  await page.getByText(/Practice bankroll restored to 2,500/i).waitFor();
  assert.match(await page.locator('.rf-meter').innerText(), /2,500/, 'Restore action should replenish only the practice bankroll.');
  assert.match(await page.locator('.rf-foot').innerText(), /9 completed spins/, 'Restore action must preserve prior statistics.');

  console.log('Royal Fortune browser checks passed: RNG failure safety, deterministic feature/reload flow, restore checkpoint, 320px/200%-text reflow, 48px target, reduced effects and opt-in audio.');
  await context.close();
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
