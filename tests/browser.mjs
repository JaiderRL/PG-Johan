import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { detective, sentences } from '../data/questions.js';
import { parseText } from '../js/games/detective.js';

const URL = process.env.TEST_URL || 'http://localhost:4173';
await mkdir('test-results', { recursive: true });
const report = { date: new Date().toISOString(), browsers: [], checks: [], errors: [] };
const channels = process.env.TEST_BROWSER ? [process.env.TEST_BROWSER] : ['chrome', 'msedge'];
const log = message => { console.log(message); report.checks.push(message); };

async function finishLevel(page, id, channel) {
  if (id === 1) {
    for (let round = 0; round < 3; round++) {
      const title = await page.locator('.paper h2').textContent();
      const question = detective.find(q => q.title === title), tokens = parseText(question.text);
      for (let i = 0; i < tokens.length; i++) if (tokens[i].error) await page.locator(`[data-token="${i}"]`).click();
      await page.locator('#review').click();
      if (round === 0) await page.screenshot({ animations: 'disabled', path: `test-results/${channel}-detective.png`, fullPage: true });
      await page.locator('.next-round').click();
    }
  } else if ([2, 3, 5, 6].includes(id)) {
    const rounds = { 2: 10, 3: 7, 5: 5, 6: 7 }[id];
    for (let round = 0; round < rounds; round++) {
      if (id === 3 && round === 0) {
        await page.locator('[data-answer="1"]').click();
        await expect(page.locator('#hud-lives')).toHaveAttribute('aria-label', '2 de 3 vidas');
        await expect(page.locator('.feedback')).toContainText('prueba otra respuesta');
      }
      await page.locator('[data-answer="0"]').click();
      await expect(page.locator('.feedback')).toHaveClass(/positive/);
      if (round === 0) await page.screenshot({ animations: 'disabled', path: `test-results/${channel}-level-${id}.png`, fullPage: true });
      if (id === 2 && round === 9) await expect(page.locator('.library-door')).toHaveClass(/opened/);
      await page.locator('.next-round').click();
    }
  } else if (id === 4) {
    for (let round = 0; round < 5; round++) {
      const count = await page.locator('[data-word]').count();
      // IDs identify original positions, while the buttons are displayed in shuffled order.
      if (round === 0) {
        await page.locator('[data-word="0"]').dragTo(page.locator('.sentence-slots'));
        await expect(page.locator('[data-remove="0"]')).toBeVisible();
        await page.locator('#undo-word').click();
      }
      for (let i = 0; i < count; i++) await page.locator(`[data-word="${i}"]`).click();
      await page.locator('#verify').click();
      await expect(page.locator('.feedback')).toHaveClass(/positive/);
      if (round === 0) await page.screenshot({ animations: 'disabled', path: `test-results/${channel}-level-4.png`, fullPage: true });
      await page.locator('.next-round').click();
    }
  } else if (id === 7) {
    for (let round = 0; round < 3; round++) {
      await page.locator('#description').fill('Representa algo especial que las personas pueden conocer durante sus actividades cotidianas y describir de muchas maneras diferentes.');
      await page.locator('#check-description').click();
      await expect(page.locator('.feedback')).toHaveClass(/positive/);
      if (round === 0) await page.screenshot({ animations: 'disabled', path: `test-results/${channel}-level-7.png`, fullPage: true });
      await page.locator('.next-round').click();
    }
  } else if (id === 8) {
    const prompt = await page.evaluate(() => JSON.parse(localStorage.getItem('mision-palabra:v1')).draft.prompt);
    const story = `Una aventura comenzó con ${prompt.character.label.toLowerCase()} en ${prompt.place.label.toLowerCase()}. Todo cambió por ${prompt.conflict.label.toLowerCase()} y gracias a ${prompt.object.label.toLowerCase()}. ` + 'Nuestra protagonista decidió caminar con paciencia y prestar atención a todas las pistas que encontraba por el sendero. '.repeat(4) + 'Al final compartió lo aprendido con sus nuevos compañeros y regresó a su hogar feliz.';
    await page.locator('#story-text').fill(story);
    await page.reload();
    await expect(page.locator('#story-text')).toHaveValue(story);
    await page.locator('#save-story').click();
    await expect(page.locator('.saved-stories summary')).toContainText('1');
    await page.locator('#evaluate-story').click();
    await expect(page.locator('.criterion.passed')).toHaveCount(7);
    await page.screenshot({ animations: 'disabled', path: `test-results/${channel}-level-8.png`, fullPage: true });
    await page.locator('.next-round').click();
  }
  await expect(page.locator('.result-card')).toHaveClass(/victory/);
  await expect(page.locator('.result-stars .earned')).toHaveCount(3);
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem('mision-palabra:v1')));
  expect(state.levels[id].completed).toBe(true);
  expect(state.levels[id].score).toBeGreaterThan(500);
}

try {
  for (const channel of channels) {
    const browser = await chromium.launch({ channel, headless: true });
    report.browsers.push({ channel, version: browser.version() });
    const context = await browser.newContext({ viewport: { width: 1440, height: 810 }, locale: 'es-CO', serviceWorkers: 'block' });
    const page = await context.newPage();
    page.on('pageerror', error => report.errors.push(`${channel}: ${error.message}`));
    page.on('response', response => { if (response.status() >= 400) report.errors.push(`${channel}: ${response.status()} ${response.url()}`); });
    await page.goto(URL);
    await expect(page.locator('.game-logo')).toBeVisible();
    await page.screenshot({ animations: 'disabled', path: `test-results/${channel}-home.png`, fullPage: true });
    await page.getByRole('link', { name: /^Jugar/ }).click();
    await expect(page.locator('.level-card:disabled')).toHaveCount(7);
    await page.screenshot({ animations: 'disabled', path: `test-results/${channel}-map.png`, fullPage: true });
    await page.locator('[data-level="1"]').click();
    await page.getByRole('button', { name: 'Comenzar' }).click();
    const before = await page.locator('#hud-time').textContent();
    await page.waitForTimeout(1200);
    expect(await page.locator('#hud-time').textContent()).not.toBe(before);
    await page.locator('#game-pause').click();
    const paused = await page.locator('#hud-time').textContent();
    await page.waitForTimeout(1200);
    expect(await page.locator('#hud-time').textContent()).toBe(paused);
    await page.getByRole('button', { name: 'Continuar jugando' }).click();
    log(`${channel}: menú, bloqueo inicial, temporizador y pausa verificados`);
    for (let id = 1; id <= 8; id++) {
      await finishLevel(page, id, channel);
      log(`${channel}: desafío ${id} completado mediante controles de usuario, puntos y tres estrellas verificados`);
      if (id < 8) {
        await page.locator('.result-actions').getByRole('link', { name: 'Volver al mapa' }).click();
        await expect(page.locator(`[data-level="${id + 1}"]`)).toBeEnabled();
        await page.locator(`[data-level="${id + 1}"]`).click();
        await page.getByRole('button', { name: 'Comenzar' }).click();
      }
    }
    await page.screenshot({ animations: 'disabled', path: `test-results/${channel}-victory.png`, fullPage: true });
    const complete = await page.evaluate(() => JSON.parse(localStorage.getItem('mision-palabra:v1')));
    expect(Object.values(complete.levels).filter(l => l.completed)).toHaveLength(8);
    expect(complete.stats.bestStreak).toBeGreaterThanOrEqual(10);
    expect(complete.achievements.legend).toBeTruthy();
    expect(complete.achievements.writer).toBeTruthy();
    const saved = await context.storageState();
    await context.close();
    const restored = await browser.newContext({ viewport: { width: 1366, height: 768 }, storageState: saved, serviceWorkers: 'block' });
    const nextPage = await restored.newPage();
    await nextPage.goto(`${URL}/#/map`);
    await expect(nextPage.locator('.level-card.completed')).toHaveCount(8);
    await nextPage.goto(`${URL}/#/achievements`);
    await expect(nextPage.locator('.achievement-card.unlocked')).toHaveCount(Object.keys(complete.achievements).length);
    await nextPage.screenshot({ animations: 'disabled', path: `test-results/${channel}-achievements.png`, fullPage: true });
    await nextPage.goto(`${URL}/#/stats`);
    await expect(nextPage.locator('.stat-card')).toHaveCount(8);
    await nextPage.goto(`${URL}/#/settings`);
    await nextPage.locator('#setting-music').click();
    await nextPage.locator('#setting-effects').click();
    await nextPage.locator('#setting-animations').click();
    await nextPage.locator('[name=difficulty][value=hard]').check();
    await nextPage.locator('#volume').fill('60');
    await nextPage.reload();
    await expect(nextPage.locator('#setting-music')).toHaveAttribute('aria-checked', 'false');
    await expect(nextPage.locator('[name=difficulty][value=hard]')).toBeChecked();
    await nextPage.locator('#reset-progress').click();
    await nextPage.getByRole('button', { name: 'Conservar mi aventura' }).click();
    expect(await nextPage.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('mision-palabra:v1')).levels).length)).toBe(8);
    await nextPage.goto(`${URL}/#/credits`);
    await expect(nextPage.locator('.credits-panel')).toBeVisible();
    log(`${channel}: progreso tras cerrar contexto, logros, estadísticas, opciones persistentes y cancelación de borrado verificados`);
    await restored.close();

    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1, storageState: saved, serviceWorkers: 'block' });
    const mobilePage = await mobile.newPage();
    mobilePage.on('pageerror', e => report.errors.push(`${channel} móvil: ${e.message}`));
    for (const route of ['home', 'map', 'settings', 'achievements', 'stats', 'credits', ...Array.from({ length: 8 }, (_, i) => `game/${i + 1}`)]) {
      await mobilePage.goto(`${URL}/#/${route}`); await mobilePage.waitForTimeout(80);
      expect(await mobilePage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `mobile overflow at ${route}`).toBe(true);
      if (['home', 'map', 'game/1', 'game/8'].includes(route)) await mobilePage.screenshot({ animations: 'disabled', path: `test-results/${channel}-mobile-${route.replace('/', '-')}.png`, fullPage: true });
    }
    await mobilePage.goto(`${URL}/#/game/4`);
    await mobilePage.locator('[data-word="0"]').tap();
    await expect(mobilePage.locator('[data-remove="0"]')).toBeVisible();
    await mobilePage.locator('[data-remove="0"]').tap();
    await expect(mobilePage.locator('[data-word="0"]')).toBeEnabled();
    log(`${channel}: las pantallas y los ocho juegos no desbordan a 390 px; construcción táctil verificada`);
    await mobile.close();

    const failures = await browser.newContext({ serviceWorkers: 'block' });
    const failPage = await failures.newPage();
    await failPage.goto(`${URL}/#/game/1`);
    const title = await failPage.locator('.paper h2').textContent();
    const question = detective.find(q => q.title === title);
    const badTokens = parseText(question.text).map((t, i) => ({ ...t, i })).filter(t => !t.error && !/^\s+$/.test(t.text));
    for (let i = 0; i < 3; i++) await failPage.locator(`[data-token="${badTokens[i].i}"]`).click();
    await expect(failPage.locator('.result-card')).toHaveClass(/defeat/);
    await failPage.locator('#retry').click();
    await expect(failPage.locator('#hud-lives')).toHaveAttribute('aria-label', '3 de 3 vidas');
    await failPage.goto(`${URL}/#/game/1`);
    await failPage.clock.install();
    await failPage.clock.fastForward(220000);
    await expect(failPage.locator('.result-card')).toHaveClass(/defeat/);
    await expect(failPage.locator('.result-reason')).toContainText('tiempo se agotó');
    await failPage.goto(`${URL}/#/settings`);
    await failPage.locator('#reset-progress').click();
    await failPage.getByRole('button', { name: 'Sí, borrar todo' }).click();
    await expect(failPage.locator('.home-view')).toBeVisible();
    const reset = await failPage.evaluate(() => JSON.parse(localStorage.getItem('mision-palabra:v1')));
    expect(reset.stats.answered).toBe(0); expect(Object.keys(reset.levels)).toHaveLength(0);
    log(`${channel}: derrota por vidas, reintento, derrota por tiempo y borrado confirmado verificados`);
    await failures.close();
    await browser.close();
  }
  expect(report.errors).toEqual([]);
  await writeFile('test-results/report.json', JSON.stringify(report, null, 2));
  console.log(`OK: ${report.checks.length} grupos de comprobaciones, sin errores de JavaScript ni recursos HTTP fallidos.`);
} catch (error) {
  report.errors.push(error.stack); await writeFile('test-results/report.json', JSON.stringify(report, null, 2));
  console.error(error); process.exitCode = 1;
  setTimeout(() => process.exit(1), 1000);
}
