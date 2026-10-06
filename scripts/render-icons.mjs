import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage();
  await page.goto('http://localhost:4173/assets/images/icons/emblem.svg');
  for (const size of [192, 512]) {
    const data = await page.evaluate(async size => {
      const image = new Image(); image.src = '/assets/images/icons/emblem.svg'; await image.decode();
      const canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas'); canvas.width = canvas.height = size;
      const context = canvas.getContext('2d'); context.fillStyle = '#123f38'; context.fillRect(0, 0, size, size);
      context.drawImage(image, 0, 0, size, size); return canvas.toDataURL('image/png').split(',')[1];
    }, size);
    await writeFile(`assets/images/icons/icon-${size}.png`, Buffer.from(data, 'base64'));
  }
  console.log('Iconos locales de 192 y 512 px generados desde el SVG original.');
} finally { await browser.close(); }
