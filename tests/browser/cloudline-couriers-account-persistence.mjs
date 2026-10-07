import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

if (!process.env.FIRESTORE_EMULATOR_HOST || !process.env.FIREBASE_AUTH_EMULATOR_HOST) throw new Error('Run through pnpm test:browser; Auth and Firestore emulators are required.');
const port = 4188;
const config = {
  VITE_FIREBASE_API_KEY: 'demo-api-key',
  VITE_FIREBASE_AUTH_DOMAIN: 'demo-inmogames.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'demo-inmogames',
  VITE_FIREBASE_APP_ID: '1:123456789:web:demo',
  VITE_FIREBASE_EMULATORS: 'true',
};
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
  env: { ...process.env, ...config }, stdio: 'pipe',
});
const base = `http://127.0.0.1:${port}/inmogames/`;
let browser;
const errors = [];

async function waitForServer() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try { if ((await fetch(base)).ok) return; } catch {}
    await delay(100);
  }
  throw new Error('Cloudline account Vite server did not start.');
}
async function visibleText(page, text) { await page.getByText(text, { exact: false }).first().waitFor(); }
async function accountReady(page) { await page.waitForFunction(() => /Account (progress loaded|progress saved|game progress reset)/.test(document.querySelector('.save-status')?.textContent ?? '')); }
async function signIn(page, email, password, register = false) {
  await page.getByRole('button', { name: 'Sign in / create account', exact: true }).click();
  if (register) await page.getByRole('dialog').getByRole('button', { name: 'Create account', exact: true }).click();
  await page.getByRole('dialog').getByLabel('Email', { exact: true }).fill(email);
  await page.getByRole('dialog').getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('dialog').getByRole('button', { name: register ? 'Create account' : 'Sign in', exact: true }).click();
  await visibleText(page, `Signed in as ${email}`);
}
function aerie(page) { return page.locator('.cl-landmark').filter({ hasText: 'Aerie Post' }); }

try {
  await waitForServer();
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined });
  const email = `cloudline-${Date.now()}@example.test`;
  const password = 'Test-password-928!';

  const firstContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const first = await firstContext.newPage();
  first.on('pageerror', error => errors.push(error.message));
  await first.goto(base + '#/games/cloudline-couriers');
  await signIn(first, email, password, true);
  await accountReady(first);
  await aerie(first).getByRole('button', { name: /Upgrade/ }).click();
  await visibleText(first, 'Account progress saved');
  assert.match(await aerie(first).innerText(), /Stage 1\/4/);

  const secondContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const second = await secondContext.newPage();
  second.on('pageerror', error => errors.push(error.message));
  await second.goto(base + '#/games/cloudline-couriers');
  await signIn(second, email, password);
  await accountReady(second);
  assert.match(await aerie(second).innerText(), /Stage 1\/4/, 'Account Cloudline career must follow the player across browser contexts.');

  await second.getByRole('button', { name: 'Reset saved career', exact: true }).click();
  await visibleText(second, 'Account game progress reset');
  assert.match(await aerie(second).innerText(), /Stage 0\/4/);
  await first.reload();
  await accountReady(first);
  assert.match(await aerie(first).innerText(), /Stage 0\/4/, 'Game-scoped account reset must propagate to another browser context after reload.');

  assert.deepEqual(errors, []);
  console.log('Cloudline account checks passed: authenticated career checkpoint, cross-browser restoration and game-scoped reset.');
  await secondContext.close();
  await firstContext.close();
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
