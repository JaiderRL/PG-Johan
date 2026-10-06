import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { fresh } from '../js/storage.js';
const URL = process.env.TEST_URL || 'http://localhost:4173';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const checks = [], errors = [];
await mkdir('test-results', { recursive: true });
const seed = fresh();
for (let id = 1; id <= 8; id++) seed.levels[id] = { completed: true, score: 1000, stars: 3, accuracy: 1, plays: 1, date: new Date().toISOString() };
try {
  const context = await browser.newContext({ serviceWorkers: 'block', reducedMotion: 'reduce' });
  await context.addInitScript(state => { if (!localStorage.getItem('mision-palabra:v1')) localStorage.setItem('mision-palabra:v1', JSON.stringify(state)); }, seed);
  const page = await context.newPage();
  page.on('pageerror', e => errors.push(e.message));
  for (const [width, height] of [[1920, 1080], [1440, 810], [1366, 768], [768, 1024], [390, 844], [320, 640]]) {
    await page.setViewportSize({ width, height });
    for (const route of ['home', 'map', 'settings', 'achievements', 'stats', 'credits', ...Array.from({ length: 8 }, (_, i) => `game/${i + 1}`)]) {
      await page.goto(`${URL}/#/${route}`);
      await page.locator('.home-view, .page-shell, .game-shell').waitFor();
      const measured = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, opacity: getComputedStyle(document.querySelector('main>section')).opacity }));
      expect(measured.scroll, `${route} overflows at ${width}`).toBeLessThanOrEqual(width);
      expect(measured.opacity).toBe('1');
      if ([1440, 390].includes(width) && ['home', 'map', 'game/1', 'game/8'].includes(route)) await page.screenshot({ animations: 'disabled', path: `test-results/final-${width}-${route.replace('/', '-')}.png`, fullPage: true });
    }
    checks.push(`Sin desbordamiento en 14 pantallas a ${width} × ${height}`);
  }
  await page.setViewportSize({ width: 1440, height: 810 });
  await page.goto(`${URL}/#/game/1`);
  await page.locator('.skip-link').focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#\/game\/1$/);
  expect(await page.evaluate(() => document.activeElement.id)).toBe('main');
  await page.goto(`${URL}/#/map`);
  await page.locator('[data-level="1"]').click();
  await expect(page.locator('dialog')).toBeVisible();
  await page.evaluate(() => location.hash = '/home');
  await expect(page.locator('dialog')).not.toBeVisible();
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.activeElement.tagName)).not.toBe('BODY');
  checks.push('Navegación de historial cierra los diálogos y el teclado alcanza los controles');
  await page.goto(`${URL}/#/game/8`);
  const draft = 'Una historia con <img src=x onerror="window.__injected=true"> texto que debe mostrarse sin ejecutar código.';
  await page.locator('#story-text').fill(draft);
  await page.locator('#save-story').click();
  await page.locator('.saved-stories summary').click();
  await page.locator('.saved-story').first().click();
  await expect(page.locator('.story-reader')).toContainText('<img');
  expect(await page.evaluate(() => !!window.__injected)).toBe(false);
  checks.push('Los relatos guardados conservan texto HTML como texto inerte');
  await context.close();

  for (const channel of ['chrome', 'msedge']) {
    const writtenBrowser = channel === 'chrome' ? browser : await chromium.launch({ channel, headless: true });
    const written = await writtenBrowser.newContext({ serviceWorkers: 'block', reducedMotion: 'reduce' });
    await written.addInitScript(state => {
      localStorage.setItem('mision-palabra:v1', JSON.stringify(state));
      for (const api of ['SpeechRecognition', 'webkitSpeechRecognition']) {
        Object.defineProperty(window, api, { get() { throw new Error('El modo escrito no debe acceder a la API de voz'); } });
      }
      window.AudioContext = undefined; window.webkitAudioContext = undefined;
    }, seed);
    const writtenPage = await written.newPage();
    writtenPage.on('pageerror', e => errors.push(`${channel}: ${e.message}`));
    await writtenPage.goto(`${URL}/#/game/7`);
    const explanation = 'Representa algo especial que las personas pueden conocer durante sus actividades cotidianas y describir de muchas maneras diferentes.';
    for (let round = 0; round < 3; round++) {
      await expect(writtenPage.locator('#oral-mode, #mic-start, #oral-controls, .mode-tabs')).toHaveCount(0);
      await expect(writtenPage.getByLabel('Escribe tu explicación')).toBeVisible();
      if (round === 0) {
        await writtenPage.locator('#description').fill('Muy corto.');
        await writtenPage.locator('#check-description').click();
        await expect(writtenPage.locator('.feedback')).toContainText('necesitas 12 palabras');
        await expect(writtenPage.locator('#hud-lives')).toHaveAttribute('aria-label', '3 de 3 vidas');
        const term = await writtenPage.locator('.forbidden-target').textContent();
        await writtenPage.locator('#description').fill(`${explanation} ${term}`);
        await writtenPage.locator('#check-description').click();
        await expect(writtenPage.locator('.feedback')).toContainText('Encontramos:');
        await expect(writtenPage.locator('#hud-lives')).toHaveAttribute('aria-label', '2 de 3 vidas');
      }
      await writtenPage.locator('#description').fill(explanation);
      await writtenPage.locator('#check-description').click();
      await expect(writtenPage.locator('.feedback')).toHaveClass(/positive/);
      if (round === 0) await writtenPage.screenshot({ animations: 'disabled', path: `test-results/${channel}-level-7-written.png`, fullPage: true });
      await writtenPage.locator('.next-round').click();
    }
    await expect(writtenPage.locator('.result-card')).toHaveClass(/victory/);
    checks.push(`${channel}: tres rondas por escrito, validaciones y vidas correctas; sin controles ni acceso a API de micrófono, incluso sin AudioContext`);
    await written.close();
    if (writtenBrowser !== browser) await writtenBrowser.close();
  }

  const blocked = await browser.newContext({ serviceWorkers: 'block' });
  await blocked.addInitScript(() => { Storage.prototype.getItem = () => { throw new Error('Storage blocked'); }; Storage.prototype.setItem = () => { throw new Error('Storage blocked'); }; });
  const blockedPage = await blocked.newPage();
  blockedPage.on('pageerror', e => errors.push(e.message));
  await blockedPage.goto(URL);
  await expect(blockedPage.locator('.toast')).toContainText('no permite guardar');
  await blockedPage.getByRole('link', { name: /^Jugar/ }).click();
  await expect(blockedPage.locator('.level-card')).toHaveCount(8);
  checks.push('Almacenamiento rechazado: aviso visible y juego utilizable en memoria');
  await blocked.close();

  const offline = await browser.newContext({ reducedMotion: 'reduce' });
  const offlinePage = await offline.newPage();
  offlinePage.on('pageerror', e => errors.push(e.message));
  await offlinePage.goto(URL);
  await offlinePage.evaluate(async () => { await navigator.serviceWorker.ready; if (!navigator.serviceWorker.controller) await new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true })); });
  const cacheSize = await offlinePage.evaluate(async () => (await (await caches.open('mision-palabra-v1.0.1')).keys()).length);
  expect(cacheSize).toBeGreaterThan(30);
  await offline.setOffline(true);
  await offlinePage.reload();
  await expect(offlinePage.locator('.game-logo')).toBeVisible();
  await offlinePage.getByRole('link', { name: /^Jugar/ }).click();
  await offlinePage.locator('[data-level="1"]').click();
  await offlinePage.getByRole('button', { name: 'Comenzar' }).click();
  await expect(offlinePage.locator('.detective-text')).toBeVisible();
  expect(await offlinePage.locator('.lia-portrait').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  checks.push(`PWA: ${cacheSize} recursos precargados; recarga, menú, mapa y primer desafío funcionales sin red`);
  await offline.close();
  expect(errors).toEqual([]);
  await writeFile('test-results/compatibility.json', JSON.stringify({ date: new Date().toISOString(), checks, errors }, null, 2));
  checks.forEach(c => console.log(`OK: ${c}`));
} catch (error) {
  errors.push(error.stack);
  await writeFile('test-results/compatibility.json', JSON.stringify({ checks, errors }, null, 2));
  console.error(error); process.exitCode = 1;
} finally { await browser.close(); }
