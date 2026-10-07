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

try {
  await waitForServer();
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));

  await page.goto(base + '#/games/cloudline-couriers');
  await page.getByRole('heading', { name: 'Cloudline Couriers', exact: true }).waitFor();
  const aerie = page.locator('.cl-landmark').filter({ hasText: 'Aerie Post' });
  assert.match(await aerie.innerText(), /Stage 0\/4/, 'A fresh Cloudline career should start Aerie Post at stage zero.');
  await aerie.getByRole('button', { name: /Upgrade/ }).click();
  assert.match(await aerie.innerText(), /Stage 1\/4/, 'Upgrading Aerie Post should advance it to stage one.');

  await page.reload();
  await page.getByRole('heading', { name: 'Cloudline Couriers', exact: true }).waitFor();
  const restoredAerie = page.locator('.cl-landmark').filter({ hasText: 'Aerie Post' });
  assert.match(await restoredAerie.innerText(), /Stage 1\/4/, 'Guest Cloudline career progress must survive a page reload.');

  assert.deepEqual(errors, []);
  await context.close();
  console.log('Cloudline persistence regression passed: landmark career progress survives guest reload.');
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
