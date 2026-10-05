import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const port = 4178;
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
  throw new Error('Royal Palace gameplay Vite server did not start.');
}

function normalized(value) {
  return value.replaceAll(',', '').replace(/\s+/g, ' ').trim();
}

async function newSeededPage(seed) {
  const context = await browser.newContext({ viewport: { width: 1024, height: 900 }, colorScheme: 'light' });
  await context.addInitScript((fixedSeed) => {
    const original = Crypto.prototype.getRandomValues;
    Crypto.prototype.getRandomValues = function seededGetRandomValues(array) {
      if (array instanceof Uint32Array && array.length === 1) {
        array[0] = fixedSeed;
        return array;
      }
      return original.call(this, array);
    };
  }, seed);
  const page = await context.newPage();
  await page.goto(base);
  await page.getByRole('button', { name: 'Add 5 virtual-credit chip', exact: true }).waitFor();
  return { context, page };
}

async function ledger(page) {
  return {
    bank: normalized(await page.locator('.rp-bank').innerText()),
    stats: normalized(await page.locator('.rp-stats span').nth(1).innerText()),
    session: normalized(await page.locator('.rp-stats span').nth(2).innerText()),
  };
}

async function placeFiveAndDeal(page) {
  await page.getByRole('button', { name: 'Add 5 virtual-credit chip', exact: true }).click();
  await page.getByRole('button', { name: 'Deal', exact: true }).click();
}

try {
  await waitForServer();
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined });

  {
    const { context, page } = await newSeededPage(9);
    const deal = page.getByRole('button', { name: 'Deal', exact: true });
    assert.equal(await deal.isDisabled(), true, 'Deal should require the 5-credit minimum.');
    assert.equal(await page.getByRole('button', { name: 'Re-bet', exact: true }).isDisabled(), true, 'Re-bet should be unavailable before a completed wager exists.');
    await page.getByRole('button', { name: 'Add 5 virtual-credit chip', exact: true }).click();
    await page.getByRole('button', { name: 'Add 25 virtual-credit chip', exact: true }).click();
    assert.match(normalized(await page.locator('.rp-bank').innerText()), /Bank 970 Bet 30/);
    await page.getByRole('button', { name: 'Undo', exact: true }).click();
    assert.match(normalized(await page.locator('.rp-bank').innerText()), /Bank 995 Bet 5/);
    await page.getByRole('button', { name: '2×', exact: true }).click();
    assert.match(normalized(await page.locator('.rp-bank').innerText()), /Bank 990 Bet 10/);
    await page.getByRole('button', { name: 'All in', exact: true }).click();
    assert.match(normalized(await page.locator('.rp-bank').innerText()), /Bank 0 Bet 1000/);
    await page.getByRole('button', { name: 'Clear', exact: true }).click();
    assert.match(normalized(await page.locator('.rp-bank').innerText()), /Bank 1000 Bet 0/);
    await context.close();
  }

  {
    const { context, page } = await newSeededPage(1);
    await placeFiveAndDeal(page);
    assert.match(normalized(await page.locator('.rp-hands .rp-handlabel').innerText()), /Player 12/);
    await page.getByRole('button', { name: 'Hit', exact: true }).click();
    assert.match(normalized(await page.locator('.rp-hands .rp-handlabel').innerText()), /Player 17/);
    assert.equal(await page.locator('.rp-hands .rp-card').count(), 3);
    await page.getByRole('button', { name: 'Stand', exact: true }).click();
    await page.getByText('Round complete', { exact: true }).waitFor();
    const result = await ledger(page);
    assert.match(result.bank, /Bank 995 Bet 0/);
    assert.equal(result.stats, '0 W · 1 L · 0 P');
    assert.equal(result.session, 'Session -5');
    await page.getByRole('button', { name: 'Next round', exact: true }).click();
    await page.getByRole('button', { name: 'Re-bet', exact: true }).click();
    assert.match(normalized(await page.locator('.rp-bank').innerText()), /Bank 990 Bet 5/);
    await context.close();
  }

  {
    const { context, page } = await newSeededPage(9);
    await placeFiveAndDeal(page);
    assert.match(normalized(await page.locator('.rp-hands .rp-handlabel').innerText()), /Player 11/);
    assert.equal(await page.getByRole('button', { name: 'Double', exact: true }).isDisabled(), false);
    await page.getByRole('button', { name: 'Double', exact: true }).click();
    await page.getByText('Round complete', { exact: true }).waitFor();
    assert.match(await page.locator('.rp-status').innerText(), /Round won: \+10 virtual credits/i);
    const result = await ledger(page);
    assert.match(result.bank, /Bank 1010 Bet 0/);
    assert.equal(result.stats, '1 W · 0 L · 0 P');
    assert.equal(result.session, 'Session +10');
    await context.close();
  }

  {
    const { context, page } = await newSeededPage(325);
    await placeFiveAndDeal(page);
    assert.equal(await page.getByRole('button', { name: 'Split', exact: true }).isDisabled(), false);
    await page.getByRole('button', { name: 'Split', exact: true }).click();
    assert.equal(await page.locator('.rp-hands .rp-hand').count(), 2);
    await page.getByText('Playing split hand 1.', { exact: true }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Double', exact: true }).isDisabled(), false, 'Double-after-split should remain available on a non-Ace two-card hand.');
    await page.getByRole('button', { name: 'Double', exact: true }).click();
    await page.getByText('Playing hand 2.', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'Stand', exact: true }).click();
    await page.getByText('Round complete', { exact: true }).waitFor();
    const result = await ledger(page);
    assert.match(result.bank, /Bank 1015 Bet 0/);
    assert.equal(result.stats, '2 W · 0 L · 0 P');
    assert.equal(result.session, 'Session +15');
    await context.close();
  }

  {
    const { context, page } = await newSeededPage(617);
    await placeFiveAndDeal(page);
    await page.getByRole('button', { name: 'Split', exact: true }).click();
    await page.getByText('Round complete', { exact: true }).waitFor();
    assert.equal(await page.locator('.rp-hands .rp-hand').count(), 2);
    assert.deepEqual(await page.locator('.rp-hands .rp-hand').evaluateAll((hands) => hands.map((hand) => hand.querySelectorAll('.rp-card').length)), [2, 2]);
    assert.equal(await page.getByRole('button', { name: 'Hit', exact: true }).count(), 0, 'Split Aces should auto-resolve after one additional card each.');
    const result = await ledger(page);
    assert.match(result.bank, /Bank 1010 Bet 0/);
    assert.equal(result.stats, '2 W · 0 L · 0 P');
    assert.equal(result.session, 'Session +10');
    await context.close();
  }

  {
    const { context, page } = await newSeededPage(221);
    await placeFiveAndDeal(page);
    assert.equal(await page.getByRole('button', { name: 'Surrender', exact: true }).isDisabled(), false);
    await page.getByRole('button', { name: 'Surrender', exact: true }).click();
    await page.getByText('Round complete', { exact: true }).waitFor();
    assert.match(await page.locator('.rp-status').innerText(), /Surrendered\. Half the wager returned/i);
    const result = await ledger(page);
    assert.match(result.bank, /Bank 997\.5 Bet 0/);
    assert.equal(result.stats, '0 W · 1 L · 0 P');
    assert.equal(result.session, 'Session -2.5');
    await context.close();
  }

  console.log('Royal Palace gameplay checks passed: betting controls, Hit/Stand, Double, Re-bet, split/DAS, split-Ace auto-resolution, surrender, bankroll and W/L/P/session accounting.');
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
