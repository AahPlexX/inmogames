import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';
const port=4184;
const blankFirebase={VITE_FIREBASE_API_KEY:'',VITE_FIREBASE_AUTH_DOMAIN:'',VITE_FIREBASE_PROJECT_ID:'',VITE_FIREBASE_APP_ID:''};
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port',String(port),'--strictPort'],{env:{...process.env,...blankFirebase},stdio:'pipe'});
const base=`http://127.0.0.1:${port}/inmogames/#/games/cascade-vault`;
const deterministicRound=[...Array.from({length:3},()=>[0,100,100,100,100]).flat(),...Array(15).fill(100),0,0,0,100,100,100];
let browser;
async function installRandomControls(context){await context.addInitScript(()=>{globalThis.__cvValues=[];globalThis.__cvAudioContexts=0;globalThis.__cvThrow=false;const original=Crypto.prototype.getRandomValues;Crypto.prototype.getRandomValues=function(array){if(array instanceof Uint32Array&&array.length===1){if(globalThis.__cvThrow)throw new DOMException('Random source unavailable.','NotAllowedError');const q=globalThis.__cvValues;if(!Array.isArray(q)||!q.length)throw new Error('Finite crypto fixture exhausted.');array[0]=q.shift();return array;}return original.call(this,array);};const Native=globalThis.AudioContext;if(Native){globalThis.AudioContext=class extends Native{constructor(...args){super(...args);globalThis.__cvAudioContexts+=1;}};}});}
async function waitForServer(){for(let i=0;i<100;i+=1){try{if((await fetch(`http://127.0.0.1:${port}/inmogames/`)).ok)return;}catch{} await delay(100);}throw new Error('Cascade Vault Vite server did not start.');}
try{
 await waitForServer(); browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined});
 const context=await browser.newContext({viewport:{width:320,height:900},colorScheme:'light'});
 await installRandomControls(context);
 const page=await context.newPage(); await page.goto(base); const game=page.locator('.cv'); await game.waitFor({timeout:3000});
 assert.equal(await page.locator('.cv-cell').count(),30,'Cascade Vault must render a 6×5 board.');
 assert.ok(await page.getByText('Paytable & rules',{exact:true}).isVisible(),'Rules/paytable must be discoverable before play.');
 const spin=page.getByRole('button',{name:/Spin · 10 credits/i}); const box=await spin.boundingBox(); assert.ok(box&&box.height>=48,`Spin target must be at least 48px; got ${box?.height}.`);
 assert.ok((await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth))<=1,'320px layout must not overflow.'); assert.equal(await page.evaluate(()=>globalThis.__cvAudioContexts),0,'Audio must not initialize before opt-in.');
 await page.evaluate(v=>{globalThis.__cvValues=[...v];},deterministicRound); await spin.focus(); await page.keyboard.press('Space');
 assert.equal(await spin.isDisabled(),true,'Spin must lock during presentation.'); assert.equal(await page.getByRole('button',{name:/20 credits/i}).isDisabled(),true,'Wager must lock during presentation.');
 await page.locator('.cv-status').filter({hasText:/2 cascades/i}).waitFor({timeout:4000}); assert.match(await page.locator('.cv-bankroll').innerText(),/^4,990\.3$/,'Round must settle once with the exact two-cascade award.');
 assert.equal(await page.locator('[aria-live="polite"] .cv-live-detail').count(),1,'Use one aggregate completion announcement.');
 assert.equal(await page.locator('.cv-cell[data-symbol=blank]').count(),30,'The completed board must remain visible after presentation.');
 await page.reload(); await page.locator('.cv').waitFor(); assert.match(await page.locator('.cv-bankroll').innerText(),/4,990/,'Settled bankroll must survive reload.'); assert.match(await page.locator('.cv-history').innerText(),/1 paid spin/i,'Reload must not resettle.');
 await page.getByText('Preferences & saved game',{exact:true}).click(); await page.getByRole('button',{name:/Reduced effects off/i}).click(); assert.equal(await page.locator('.cv').getAttribute('data-reduced'),'true');
 await page.getByRole('button',{name:/Sound off/i}).click(); assert.equal(await page.evaluate(()=>globalThis.__cvAudioContexts),0,'Sound opt-in must not eagerly create audio.');
 await page.evaluate(()=>{document.documentElement.style.fontSize='200%';}); await delay(100); assert.ok((await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth))<=1,'200% text at 320px must not overflow.'); assert.ok(await page.getByRole('button',{name:/Spin/i}).isVisible());
 await page.evaluate(()=>{localStorage.setItem('inmogames:cascade-vault:v1',JSON.stringify({schemaVersion:1,state:{bankrollUnits:0,selectedWager:10,paidSpins:9,freeSpins:2,totalWageredUnits:9000,totalWonUnits:4000,netUnits:-5000,largestSpinWinUnits:1000,highestCascadeChain:2,completedVaultRuns:1,preferences:{sound:false,reducedEffects:false},lastResult:null,feature:null}}));document.documentElement.style.fontSize='';});
 await page.reload(); await page.getByRole('button',{name:'Restore 5,000 practice credits',exact:true}).waitFor(); assert.match(await page.locator('.cv-history').innerText(),/9 paid spins/i); await page.getByRole('button',{name:'Restore 5,000 practice credits',exact:true}).click(); await page.getByText(/Practice bankroll restored to 5,000/i).waitFor(); assert.match(await page.locator('.cv-bankroll').innerText(),/5,000/); assert.match(await page.locator('.cv-history').innerText(),/9 paid spins/i);
 const errorContext=await browser.newContext({viewport:{width:390,height:844}}); await installRandomControls(errorContext); const errorPage=await errorContext.newPage(); await errorPage.goto(base); await errorPage.locator('.cv').waitFor();
 const errorSpin=errorPage.getByRole('button',{name:/Spin · 10 credits/i}); const balanceBefore=await errorPage.locator('.cv-bankroll').innerText(); const historyBefore=await errorPage.locator('.cv-history').innerText(); await errorPage.evaluate(()=>{globalThis.__cvThrow=true;}); await errorSpin.click();
 const spinError=errorPage.getByRole('alert').filter({hasText:'No credits were changed'}); await spinError.waitFor(); assert.match(await spinError.innerText(),/try again|retry/i,'A failed random draw must explain how to retry.');
 assert.equal(await errorPage.locator('.cv-bankroll').innerText(),balanceBefore,'RNG failure must leave the bankroll unchanged.'); assert.equal(await errorPage.locator('.cv-history').innerText(),historyBefore,'RNG failure must leave paid/free spin counters unchanged.'); assert.equal(await errorSpin.isEnabled(),true,'RNG failure must leave the paid-spin action available.'); await errorPage.evaluate(()=>{globalThis.__cvThrow=false;}); await errorContext.close();
 const featureContext=await browser.newContext({viewport:{width:390,height:844}}); await installRandomControls(featureContext); const featurePage=await featureContext.newPage(); await featurePage.goto(base); await featurePage.locator('.cv').waitFor();
 await featurePage.getByText('Preferences & saved game',{exact:true}).click(); await featurePage.getByRole('button',{name:/Reduced effects off/i}).click();
 await featurePage.evaluate(()=>{globalThis.__cvValues=[82,82,82,82,...Array(26).fill(100),...Array(8*30).fill(100)];}); const featureSpin=featurePage.getByRole('button',{name:/Spin · 10 credits/i}); await featureSpin.click();
 await featurePage.getByRole('button',{name:'Free spin',exact:true}).waitFor(); assert.match(await featurePage.locator('.cv-bankroll').innerText(),/4,990/,'Four Scatters trigger eight free spins without changing the paid wager accounting.');
 await featurePage.reload(); await featurePage.locator('.cv').waitFor(); await featurePage.evaluate(()=>{globalThis.__cvValues=Array(8*30).fill(100);}); await featurePage.getByRole('button',{name:'Free spin',exact:true}).waitFor(); assert.match(await featurePage.locator('.cv-bankroll').innerText(),/4,990/,'An active Vault Run checkpoint must survive reload without another paid wager.');
 for(let spinIndex=0;spinIndex<8;spinIndex+=1) await featurePage.getByRole('button',{name:'Free spin',exact:true}).click();
 await featurePage.getByRole('button',{name:'Free spin',exact:true}).waitFor({state:'detached'}); assert.match(await featurePage.locator('.cv-bankroll').innerText(),/4,990/,'Blank Vault spins must not alter the settled bankroll.'); assert.equal(await featureSpin.isEnabled(),true,'The paid-spin action must resume when the Vault Run ends.'); await featureContext.close();

 await page.getByText('Paytable & rules',{exact:true}).click();
 const paytable=page.getByRole('region',{name:'Paytable, scroll horizontally for all reel counts'});
 await paytable.focus(); await page.keyboard.press('ArrowRight'); await delay(150);
 assert.ok(await paytable.evaluate(element=>element.scrollLeft>0),'The paytable must scroll from the keyboard at narrow widths.');
 for(const width of [320,1024,1440]) {
  await page.setViewportSize({width,height:1000});
  await page.evaluate(()=>{document.documentElement.style.fontSize='200%';});
  assert.ok((await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth))<=1,`Expanded rules must reflow at ${width}px and 200% text.`);
 }
 await page.evaluate(()=>{document.documentElement.style.fontSize='';});
 assert.ok(new URL(page.url()).searchParams.has('vault-rules'),'Expanded rules must be deep-linked.');
 await page.reload(); await page.locator('.cv-rules[open]').waitFor();
 await page.getByRole('button',{name:/Sound off/i}).click();
 await page.evaluate(v=>{globalThis.__cvValues=[...v];},deterministicRound); await page.getByRole('button',{name:/Spin · 10 credits/i}).click();
 assert.equal(await page.evaluate(()=>globalThis.__cvAudioContexts),1,'Opted-in sound initializes from the Spin action.');
 await page.getByRole('button',{name:'Skip presentation',exact:true}).click();
 assert.equal(await page.getByRole('button',{name:/Spin · 10 credits/i}).isEnabled(),true,'Skipping presentation unlocks the next spin.');
 assert.match(await page.locator('.cv-bankroll').innerText(),/^4,990\.3$/,'Skipping must preserve the exact settled award.');
 assert.equal(await page.locator('.cv-cell[data-symbol=blank]').count(),30,'Skipping preserves the completed board.');
 console.log('Cascade Vault browser checks passed.'); await context.close();
} finally {await browser?.close();server.kill('SIGTERM');}
