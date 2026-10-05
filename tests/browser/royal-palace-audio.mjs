import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const port = 4179;
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
const base = `http://127.0.0.1:${port}/inmogames/#/games/royal-palace-blackjack`;
let browser;

async function waitForServer() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      if ((await fetch(`http://127.0.0.1:${port}/inmogames/`)).ok) return;
    } catch {}
    await delay(100);
  }
  throw new Error('Royal Palace audio Vite server did not start.');
}

try {
  await waitForServer();
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined });
  const context = await browser.newContext({ viewport: { width: 900, height: 800 } });
  await context.addInitScript(() => {
    const probe = { contexts: 0, resumes: 0, starts: 0, stops: 0 };
    Object.defineProperty(globalThis, '__royalAudioProbe', { configurable: true, value: probe });
    class ProbeAudioContext {
      constructor() {
        probe.contexts += 1;
        this.state = 'suspended';
        this.currentTime = 0;
        this.destination = {};
      }
      resume() {
        probe.resumes += 1;
        this.state = 'running';
        return Promise.resolve();
      }
      createOscillator() {
        return {
          type: 'sine',
          frequency: { setValueAtTime() {} },
          connect(node) { return node; },
          start() { probe.starts += 1; },
          stop() { probe.stops += 1; },
        };
      }
      createGain() {
        return {
          gain: {
            setValueAtTime() {},
            exponentialRampToValueAtTime() {},
          },
          connect(node) { return node; },
        };
      }
    }
    Object.defineProperty(globalThis, 'AudioContext', { configurable: true, writable: true, value: ProbeAudioContext });
  });

  const page = await context.newPage();
  await page.goto(base);
  const soundOff = page.getByRole('button', { name: 'Sound off', exact: true });
  await soundOff.waitFor();

  await page.getByRole('button', { name: 'Add 5 virtual-credit chip', exact: true }).click();
  assert.deepEqual(await page.evaluate(() => globalThis.__royalAudioProbe), { contexts: 0, resumes: 0, starts: 0, stops: 0 }, 'Sound-off gameplay must not create or schedule WebAudio.');

  await soundOff.click();
  const soundOn = page.getByRole('button', { name: 'Sound on', exact: true });
  await soundOn.waitFor();
  assert.equal(await soundOn.getAttribute('aria-pressed'), 'true');
  assert.deepEqual(await page.evaluate(() => globalThis.__royalAudioProbe), { contexts: 1, resumes: 1, starts: 2, stops: 2 }, 'Opt-in should resume one AudioContext and schedule the two-tone chip cue from the user gesture.');

  await page.reload();
  await page.getByRole('button', { name: 'Sound on', exact: true }).waitFor();
  assert.deepEqual(await page.evaluate(() => globalThis.__royalAudioProbe), { contexts: 0, resumes: 0, starts: 0, stops: 0 }, 'Reload should not autoplay a persisted sound preference.');

  await page.getByRole('button', { name: 'Add 5 virtual-credit chip', exact: true }).click();
  assert.deepEqual(await page.evaluate(() => globalThis.__royalAudioProbe), { contexts: 1, resumes: 1, starts: 2, stops: 2 }, 'Persisted opt-in should schedule the chip cue on the next user interaction.');
  await page.getByRole('button', { name: 'Deal', exact: true }).click();
  assert.equal((await page.evaluate(() => globalThis.__royalAudioProbe)).starts >= 3, true, 'Deal should schedule its local procedural card cue while sound is enabled.');

  await page.getByRole('button', { name: 'Sound on', exact: true }).click();
  const beforeDisabledAction = await page.evaluate(() => globalThis.__royalAudioProbe.starts);
  const hit = page.getByRole('button', { name: 'Hit', exact: true });
  if (await hit.count() && !(await hit.isDisabled())) await hit.click();
  assert.equal(await page.evaluate(() => globalThis.__royalAudioProbe.starts), beforeDisabledAction, 'Turning sound off must suppress later gameplay cues.');

  console.log('Royal Palace audio checks passed: opt-in, AudioContext resume, no autoplay, persisted preference and procedural cue suppression.');
  await context.close();
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
