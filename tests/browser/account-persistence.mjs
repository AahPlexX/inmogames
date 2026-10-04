import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

if (!process.env.FIRESTORE_EMULATOR_HOST || !process.env.FIREBASE_AUTH_EMULATOR_HOST) throw new Error('Run through pnpm test:browser; both Firebase emulators are required.');
const ports = [4174, 4175];
const demoConfig = { VITE_FIREBASE_API_KEY: 'demo-api-key', VITE_FIREBASE_AUTH_DOMAIN: 'demo-inmogames.firebaseapp.com', VITE_FIREBASE_PROJECT_ID: 'demo-inmogames', VITE_FIREBASE_APP_ID: '1:123456789:web:demo', VITE_FIREBASE_EMULATORS: 'true' };
const blankConfig = Object.fromEntries(Object.keys(demoConfig).map(key => [key, '']));
const servers = ports.map((port,index) => spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { env: { ...process.env, ...(index ? blankConfig : demoConfig) }, stdio: 'pipe' }));
let browser;
const errors = [];
async function visibleText(page, text) { await page.getByText(text, { exact: false }).first().waitFor(); }
async function accountReady(page) { await page.waitForFunction(() => /Account (progress loaded|progress saved|game progress reset)/.test(document.querySelector('.save-status')?.textContent ?? '')); }
async function readBank(page) { return Number((await page.locator('.rp-bank b').first().innerText()).replaceAll(',', '')); }
async function signIn(page, email, password, register=false) {
  await page.getByRole('button', { name: 'Sign in / create account', exact: true }).click();
  if(register)await page.getByRole('dialog').getByRole('button',{name:'Create account',exact:true}).click();
  await page.getByRole('dialog').getByLabel('Email',{exact:true}).fill(email);
  await page.getByRole('dialog').getByLabel('Password',{exact:true}).fill(password);
  await page.getByRole('dialog').getByRole('button',{name:register?'Create account':'Sign in',exact:true}).click();
  await visibleText(page, `Signed in as ${email}`);
}
async function completeThreefold(page) {
  for(let round=0;round<5;round++){
    const target=Number((await page.getByRole('heading',{name:/^Make /}).innerText()).slice(5));
    const tiles=(await page.locator('.threefold-board button').allTextContents()).map(Number);
    let solution;
    for(let a=0;a<tiles.length;a++)for(let b=a+1;b<tiles.length;b++)for(let c=b+1;c<tiles.length;c++)if(tiles[a]+tiles[b]+tiles[c]===target)solution=[tiles[a],tiles[b],tiles[c]];
    assert.ok(solution);
    for(const tile of solution)await page.locator('.threefold-board').getByRole('button',{name:String(tile),exact:true}).click();
    await page.getByRole('button',{name:'Check three',exact:true}).click();
  }
  await page.getByRole('heading',{name:'Run complete',exact:true}).waitFor();
}
try {
  for(const port of ports){let ready=false;for(let attempt=0;attempt<100;attempt++){try{ready=(await fetch(`http://127.0.0.1:${port}/inmogames/`)).ok;}catch{}if(ready)break;await delay(100);}assert.ok(ready,'Vite server did not start');}
  browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH || undefined});
  const guest=await browser.newContext({viewport:{width:320,height:900}});
  await guest.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked storage');}});});
  const guestPage=await guest.newPage();guestPage.on('pageerror',error=>errors.push(error.message));
  await guestPage.goto(`http://127.0.0.1:${ports[1]}/inmogames/#/games/royal-palace-blackjack`);
  await visibleText(guestPage,'Accounts are not available');await guestPage.getByRole('button',{name:'Add 25 virtual-credit chip',exact:true}).click();assert.equal(await readBank(guestPage),975);
  assert.ok(await guestPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await guest.close();
  const recovery=await browser.newContext({viewport:{width:320,height:900}});
  await recovery.addInitScript(()=>{const key='inmogames:royal-palace-blackjack:v1';if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify({bankroll:2.5,lastBet:25,stats:{wins:9,losses:8,pushes:2},sessionNet:-997.5,preferences:{sound:true,hints:true}}));});
  const recoveryPage=await recovery.newPage();recoveryPage.on('pageerror',error=>errors.push(error.message));
  await recoveryPage.goto(`http://127.0.0.1:${ports[1]}/inmogames/#/games/royal-palace-blackjack`);
  await recoveryPage.getByRole('button',{name:'Restore 1,000 practice credits',exact:true}).waitFor();assert.equal(await readBank(recoveryPage),2.5);
  await recoveryPage.getByRole('button',{name:'Restore 1,000 practice credits',exact:true}).click();await visibleText(recoveryPage,'Practice credits restored to 1,000');assert.equal(await readBank(recoveryPage),1000);
  await visibleText(recoveryPage,'9 W · 8 L · 2 P');await recoveryPage.reload();assert.equal(await readBank(recoveryPage),1000);await recovery.close();
  const context=await browser.newContext({viewport:{width:320,height:900}});
  await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1' ? route.continue() : route.abort());
  await context.addInitScript(()=>{
    const random=crypto.getRandomValues.bind(crypto);crypto.getRandomValues=array=>array instanceof Uint32Array&&array.length===1?(array[0]=44,array):random(array);
    if(!localStorage.getItem('inmogames:royal-palace-blackjack:v1'))localStorage.setItem('inmogames:royal-palace-blackjack:v1',JSON.stringify({bankroll:725,lastBet:25,stats:{wins:1,losses:2,pushes:1},sessionNet:-275,preferences:{sound:false,hints:false}}));
    if(!localStorage.getItem('inmogames:threefold:v1'))localStorage.setItem('inmogames:threefold:v1','300');
  });
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
  const base=`http://127.0.0.1:${ports[0]}/inmogames/`;
  await page.goto(base+'#/games/royal-palace-blackjack');await page.getByRole('button',{name:'Sign in / create account',exact:true}).waitFor();assert.equal(await readBank(page),725);
  await page.getByRole('button',{name:'Add 100 virtual-credit chip',exact:true}).click();assert.equal(await readBank(page),625);
  await page.getByRole('button',{name:'Strategy hints off',exact:true}).click();
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('inmogames:royal-palace-blackjack:v1')).state?.preferences.hints===true);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('inmogames:royal-palace-blackjack:v1')).state.bankroll),725);
  await page.reload();await page.getByRole('button',{name:'Strategy hints on',exact:true}).waitFor();assert.equal(await readBank(page),725);
  await page.getByRole('button',{name:'Add 25 virtual-credit chip',exact:true}).click();await page.getByRole('button',{name:'Deal',exact:true}).click();await page.getByRole('button',{name:'Hit',exact:true}).waitFor();
  await page.getByRole('button',{name:'Sound off',exact:true}).click();await page.reload();await page.getByRole('button',{name:'Sound on',exact:true}).waitFor();assert.equal(await readBank(page),725);
  await page.getByRole('button',{name:'Sign in / create account',exact:true}).click();await page.getByRole('dialog').waitFor();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);
  const zoomPage=await context.newPage();zoomPage.on('pageerror',error=>errors.push(error.message));await zoomPage.goto(base);await zoomPage.getByRole('button',{name:'Sign in / create account',exact:true}).waitFor();
  await zoomPage.evaluate(()=>{document.documentElement.style.fontSize='200%';});await zoomPage.getByRole('button',{name:'Sign in / create account',exact:true}).click();
  assert.ok(await zoomPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.ok(await zoomPage.getByRole('dialog').getByLabel('Email',{exact:true}).evaluate(element=>element===document.activeElement));
  for(let tab=0;tab<8;tab++){await zoomPage.keyboard.press('Tab');assert.ok(await zoomPage.getByRole('dialog').evaluate(element=>element.contains(document.activeElement)));}
  await zoomPage.keyboard.press('Escape');assert.ok(await zoomPage.getByRole('button',{name:'Sign in / create account',exact:true}).evaluate(element=>element===document.activeElement));await zoomPage.close();
  const email=`player-${Date.now()}@example.test`;const password='Test-password-928!';
  await signIn(page,email,password,true);await accountReady(page);assert.equal(await readBank(page),725);
  await page.getByRole('button',{name:'Strategy hints on',exact:true}).click();await visibleText(page,'Account progress saved');
  await page.reload();await visibleText(page,`Signed in as ${email}`);await accountReady(page);assert.equal(await readBank(page),725);
  await page.goto(base+'#/games/threefold');await accountReady(page);await visibleText(page,'Best completed score: 300');await completeThreefold(page);await visibleText(page,'Account progress saved');await visibleText(page,'Best completed score: 500');
  const other=await browser.newContext();await other.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
  const second=await other.newPage();second.on('pageerror',error=>errors.push(error.message));await second.goto(base+'#/games/threefold');await signIn(second,email,password);await accountReady(second);await visibleText(second,'Best completed score: 500');
  await page.goto(base+'#/games/royal-palace-blackjack');await accountReady(page);await page.getByRole('button',{name:'Reset saved game',exact:true}).click();await visibleText(page,'Account game progress reset');assert.equal(await readBank(page),1000);
  await page.getByRole('button',{name:'Sign out',exact:true}).click();await page.getByRole('button',{name:'Sign in / create account',exact:true}).waitFor();assert.equal(await readBank(page),725);
  await signIn(page,email,password);await accountReady(page);assert.equal(await readBank(page),1000);
  await second.reload();await accountReady(second);await visibleText(second,'Best completed score: 500');
  await page.getByRole('button',{name:'Add 25 virtual-credit chip',exact:true}).click();await page.getByRole('button',{name:'Deal',exact:true}).click();await page.getByRole('button',{name:'Surrender',exact:true}).click();await visibleText(page,'Account progress saved');assert.equal(await readBank(page),987.5);
  await page.reload();await accountReady(page);assert.equal(await readBank(page),987.5);
  await page.route('http://127.0.0.1:8080/**', route=>route.abort());
  await page.getByRole('button',{name:'Sound off',exact:true}).click();await visibleText(page,'Cloud sync failed');
  await page.unroute('http://127.0.0.1:8080/**');await page.getByRole('button',{name:'Retry account sync',exact:true}).click();await visibleText(page,'Account progress saved');
  await page.reload();await accountReady(page);await page.getByRole('button',{name:'Sound on',exact:true}).waitFor();assert.equal(await readBank(page),987.5);
  await page.goto(base+'#/games/threefold');await accountReady(page);await page.getByRole('button',{name:'Reset best score',exact:true}).click();await visibleText(page,'Account game progress reset');await visibleText(page,'Best completed score: 0');
  await second.reload();await accountReady(second);await visibleText(second,'Best completed score: 0');
  await page.getByRole('button',{name:'Sign out',exact:true}).click();await page.getByRole('button',{name:'Sign in / create account',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'Forgot password?',exact:true}).click();await page.getByRole('dialog').getByLabel('Email',{exact:true}).fill(email);await page.getByRole('button',{name:'Send reset email',exact:true}).click();await visibleText(page,'a password reset message will arrive');
  assert.deepEqual(errors,[]);console.log('Browser checks passed: guest/blocked storage, wager reload safety, Auth registration/restoration/reset/sign-out, cloud seeding, cross-browser progress, game-scoped reset and 320px dialog.');
} finally { await browser?.close();for(const server of servers)server.kill('SIGTERM'); }
