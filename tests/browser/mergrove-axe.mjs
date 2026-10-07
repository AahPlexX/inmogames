import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';

// Automated WCAG audit of #/games/mergrove (src/games/mergrove) in several real UI states.
// axe-core cannot judge everything (focus order, meaning of text), so this complements, not replaces,
// the keyboard and reflow assertions in mergrove-design.mjs.
const port = 4187;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
  env: { ...process.env, VITE_FIREBASE_API_KEY: '', VITE_FIREBASE_AUTH_DOMAIN: '', VITE_FIREBASE_PROJECT_ID: '', VITE_FIREBASE_APP_ID: '' }, stdio: 'pipe',
});
const base = `http://127.0.0.1:${port}/inmogames/`;
const errors = [];
let browser;

async function waitForServer() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try { if ((await fetch(base)).ok) return; } catch { /* retry */ }
    await delay(100);
  }
  throw new Error('Mergrove axe Vite server did not start.');
}

/**
 * axe-core reports color-contrast as "incomplete" here (the decorative .mg::before layer stops it resolving
 * backgrounds), so contrast is verified by this in-page checker instead. It composites translucent ancestor
 * backgrounds, then applies the WCAG 2.2 text thresholds (4.5:1, or 3:1 for large text).
 */
async function contrastFailures(page, scope = '.mg') {
  return page.evaluate((selector) => {
    const parse = (value) => {
      const m = value.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
      return { r, g, b, a };
    };
    const over = (top, bottom) => {
      const a = top.a + bottom.a * (1 - top.a);
      if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
      const mix = (t, b2) => (t * top.a + b2 * bottom.a * (1 - top.a)) / a;
      return { r: mix(top.r, bottom.r), g: mix(top.g, bottom.g), b: mix(top.b, bottom.b), a };
    };
    const lum = ({ r, g, b }) => {
      const lin = (v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
      return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    };
    // Split a CSS background-image into its top-level layers (commas inside parentheses do not separate layers).
    const layersOf = (image) => {
      const layers = [];
      let depth = 0; let start = 0;
      for (let i = 0; i < image.length; i += 1) {
        if (image[i] === '(') depth += 1;
        else if (image[i] === ')') depth -= 1;
        else if (image[i] === ',' && depth === 0) { layers.push(image.slice(start, i).trim()); start = i + 1; }
      }
      layers.push(image.slice(start).trim());
      return layers.filter(layer => layer && layer !== 'none');
    };
    // Every colour an element's text can really sit on. Each element contributes its background colour and its
    // gradient layers (painted top-first, so we walk them bottom-up). Stops inside one gradient are alternatives,
    // so the check is conservative: text must pass against the worst stop. An opaque layer hides everything below.
    const backgrounds = (element) => {
      const paint = [];
      for (let node = element; node; node = node.parentElement) {
        const style = getComputedStyle(node);
        const nodePaint = [];
        const color = parse(style.backgroundColor);
        if (color && color.a > 0) nodePaint.push({ stops: [color] });
        for (const layer of layersOf(style.backgroundImage)) {
          const stops = (layer.match(/rgba?\([^)]+\)/g) ?? []).map(parse).filter(Boolean);
          if (stops.length) nodePaint.push({ stops });
        }
        // CSS paints background-image layers above background-color, first layer on top; nodePaint is colour-first.
        const colourLayer = nodePaint.filter((_, i) => i === 0 && color && color.a > 0);
        const imageLayers = nodePaint.slice(colourLayer.length);
        const ordered = [...colourLayer, ...imageLayers.reverse()];
        paint.push(...ordered.reverse());
        const opaque = ordered.some(layer => layer.stops.every(stop => stop.a >= 1));
        if (opaque) break;
      }
      const page = parse(getComputedStyle(document.body).backgroundColor);
      let candidates = [page && page.a > 0 ? { ...page, a: 1 } : { r: 255, g: 255, b: 255, a: 1 }];
      const hidden = paint.findIndex(layer => layer.stops.every(stop => stop.a >= 1));
      const visible = hidden >= 0 ? paint.slice(0, hidden + 1) : paint;
      for (const layer of visible.reverse()) candidates = layer.stops.flatMap(stop => candidates.map(base => over(stop, base)));
      return candidates;
    };
    const failures = [];
    const root = document.querySelector(selector);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    for (let text = walker.nextNode(); text; text = walker.nextNode()) {
      const element = text.parentElement;
      if (!element || seen.has(element) || !text.textContent.trim()) continue;
      seen.add(element);
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      if (style.visibility === 'hidden' || style.display === 'none' || box.width === 0 || box.height === 0) continue;
      if (element.closest('.mg-sr-only, [aria-hidden="true"]')) continue;
      const fg = parse(style.color);
      if (!fg) continue;
      let ratio = Infinity;
      let bg = { r: 0, g: 0, b: 0 };
      for (const candidate of backgrounds(element)) {
        const [hi, lo] = [lum(over(fg, candidate)), lum(candidate)].sort((x, y) => y - x);
        const candidateRatio = (hi + 0.05) / (lo + 0.05);
        if (candidateRatio < ratio) { ratio = candidateRatio; bg = candidate; }
      }
      const px = parseFloat(style.fontSize);
      const large = px >= 24 || (px >= 18.66 && Number(style.fontWeight) >= 700);
      const needed = large ? 3 : 4.5;
      const disabled = element.closest('button:disabled, [aria-disabled="true"]');
      if (ratio < needed && !disabled) failures.push(`${ratio.toFixed(2)}:1 (<${needed}) ${element.tagName.toLowerCase()}.${String(element.className).split(' ')[0]} "${text.textContent.trim().slice(0, 28)}" ${style.color} on rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)})`);
    }
    return failures;
  }, scope);
}

async function audit(page, label, scope = '.mg') {
  const results = await new AxeBuilder({ page })
    .include(scope)
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
    .analyze();
  // Anything axe could not decide must be on this explicit list (with a reason), never silently skipped.
  const knownIncomplete = new Map([['color-contrast', 'verified by contrastFailures(): .mg::before blocks axe background resolution']]);
  const undecided = results.incomplete.filter(item => !knownIncomplete.has(item.id)).map(item => `${item.id}: ${item.nodes.length} node(s), e.g. ${item.nodes[0].target.join(' ')}`);
  assert.deepEqual(undecided, [], `${label}: axe could not decide these checks; review them:\n${undecided.join('\n')}`);
  const lowContrast = await contrastFailures(page, scope);
  assert.deepEqual(lowContrast, [], `${label}: text contrast failures:\n${lowContrast.join('\n')}`);
  const summary = results.violations.map(v => `${v.id} (${v.impact}): ${v.nodes.length} node(s), e.g. ${v.nodes[0].target.join(' ')}\n    ${v.help}`);
  assert.deepEqual(summary, [], `${label}: axe found violations:\n${summary.join('\n')}`);
  return results.passes.length;
}

try {
  await waitForServer();
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined });
  let checked = 0;
  for (const scheme of ['dark', 'light']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: scheme, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base + '#/games/mergrove');
    await page.getByRole('heading', { name: 'Grow the grove.', exact: true }).waitFor();
    checked += await audit(page, `${scheme}: fresh board`);

    // Build three Sprouts so the board holds spirits, then reach 4 sunlight for the Compost states.
    for (const cell of [0, 1, 2, 5, 6, 7, 10, 11, 12]) await page.locator('.mg-cell').nth(cell).click();
    await page.waitForFunction(() => document.querySelector('[data-stat="sunlight"]')?.textContent?.trim() === '4');
    checked += await audit(page, `${scheme}: board with spirits and sunlight`);

    await page.locator('.mg-sun-card .mg-secondary').click();
    checked += await audit(page, `${scheme}: compost armed`);
    await page.keyboard.press('Escape');

    await page.locator('.mg-rules summary').click();
    checked += await audit(page, `${scheme}: rules disclosure open`);
    await context.close();
  }
  assert.deepEqual(errors, []);
  console.log(`Mergrove axe audit passed: dark and light, fresh / spirits / compost-armed / rules-open states, ${checked} rule checks and zero violations.`);
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
