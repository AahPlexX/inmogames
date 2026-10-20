import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';
const port=4184;
const blankFirebase={VITE_FIREBASE_API_KEY:'',VITE_FIREBASE_AUTH_DOMAIN:'',VITE_FIREBASE_PROJECT_ID:'',VITE_FIREBASE_APP_ID:''};
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port',String(port),'--strictPort'],{env:{...process.env,...blankFirebase},stdio:'pipe'});
const base=`http://127.0.0.1:${port}/inmogames/#/games/cascade-vault`;
const deterministicRound=[0,13,25,37,70,0,70,80,82,25,0,37,48,59,70,25,59,70,37,48,25,37,48,59,70,80,13,25,37,48,13,13,13,80,0,13];
let browser;
async function waitForServer(){for(let i=0;i<100;i+=1){try{if((await fetch(`http://127.0.0.1:${port}/inmogames/`)).ok)return;}catch{} await delay(100);}throw new Error('Cascade Vault Vite server did not start.');}
try{
 await waitForServer(); browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined});
 const context=await browser.newContext({viewport:{width:320,height:900},colorScheme:'light'});
 await context.addInitScript(()=>{globalThis.__cvValues=[];globalThis.__cvAudioContexts=0;const original=Crypto.prototype.getRandomValues;Crypto.prototype.getRandomValues=function(array){if(array instanceof Uint32Array&&array.length===1){const q=globalThis.__cvValues;array[0]=Array.isArray(q)&&q.length?q.shift():0;return array;}return original.call(this,array);};const Native=globalThis.AudioContext;if(Native){globalThis.AudioContext=class extends Native{constructor(...args){super(...args);globalThis.__cvAudioContexts+=1;}};}});
 const page=await context.newPage(); await page.goto(base); const game=page.locator('.cv'); await game.waitFor({timeout:3000});
 assert.equal(await page.locator('.cv-cell').count(),30,'Cascade Vault must render a 6×5 board.');
 assert.ok(await page.getByText('Paytable & rules',{exact:true}).isVisible(),'Rules/paytable must be discoverable before play.');
 const spin=page.getByRole('button',{name:/Spin · 10 credits/i}); const box=await spin.boundingBox(); assert.ok(box&&box.height>=48,`Spin target must be at least 48px; got ${box?.height}.`);
 assert.ok((await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth))<=1,'320px layout must not overflow.'); assert.equal(await page.evaluate(()=>globalThis.__cvAudioContexts),0,'Audio must not initialize before opt-in.');
 await page.evaluate(v=>{globalThis.__cvValues=[...v];},deterministicRound); await spin.focus(); await page.keyboard.press('Space');
 assert.equal(await spin.isDisabled(),true,'Spin must lock during presentation.'); assert.equal(await page.getByRole('button',{name:/20 credits/i}).isDisabled(),true,'Wager must lock during presentation.');
 await page.locator('.cv-status').filter({hasText:/2 cascades/i}).waitFor({timeout:4000}); assert.match(await page.locator('.cv-bankroll').innerText(),/4,990/,'Round must settle once.');
 assert.equal(await page.locator('[aria-live="polite"] .cv-live-detail').count(),1,'Use one aggregate completion announcement.');
 await page.reload(); await page.locator('.cv').waitFor(); assert.match(await page.locator('.cv-bankroll').innerText(),/4,990/,'Settled bankroll must survive reload.'); assert.match(await page.locator('.cv-history').innerText(),/1 paid spin/i,'Reload must not resettle.');
 await page.getByText('Preferences & saved game',{exact:true}).click(); await page.getByRole('button',{name:/Reduced effects off/i}).click(); assert.equal(await page.locator('.cv').getAttribute('data-reduced'),'true');
 await page.getByRole('button',{name:/Sound off/i}).click(); assert.equal(await page.evaluate(()=>globalThis.__cvAudioContexts),0,'Sound opt-in must not eagerly create audio.');
 await page.evaluate(()=>{document.documentElement.style.fontSize='200%';}); await delay(100); assert.ok((await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth))<=1,'200% text at 320px must not overflow.'); assert.ok(await page.getByRole('button',{name:/Spin/i}).isVisible());
 await page.evaluate(()=>{localStorage.setItem('inmogames:cascade-vault:v1',JSON.stringify({schemaVersion:1,state:{bankrollUnits:0,selectedWager:10,paidSpins:9,freeSpins:2,totalWageredUnits:9000,totalWonUnits:4000,netUnits:-5000,largestSpinWinUnits:1000,highestCascadeChain:2,completedVaultRuns:1,preferences:{sound:false,reducedEffects:false},lastResult:null,feature:null}}));document.documentElement.style.fontSize='';});
 await page.reload(); await page.getByRole('button',{name:'Restore 5,000 practice credits',exact:true}).waitFor(); assert.match(await page.locator('.cv-history').innerText(),/9 paid spins/i); await page.getByRole('button',{name:'Restore 5,000 practice credits',exact:true}).click(); await page.getByText(/Practice bankroll restored to 5,000/i).waitFor(); assert.match(await page.locator('.cv-bankroll').innerText(),/5,000/); assert.match(await page.locator('.cv-history').innerText(),/9 paid spins/i);
 console.log('Cascade Vault browser checks passed.'); await context.close();
} finally {await browser?.close();server.kill('SIGTERM');}
