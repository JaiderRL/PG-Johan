export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
export const escapeHTML = (value) => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const normalize = value => String(value).toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
export const words = value => String(value).match(/[\p{L}\p{N}]+(?:[-’'][\p{L}]+)*/gu) || [];
export const formatTime = seconds => `${Math.floor(Math.max(0, seconds) / 60).toString().padStart(2, '0')}:${Math.floor(Math.max(0, seconds) % 60).toString().padStart(2, '0')}`;
export const number = n => Math.round(n).toLocaleString('es-CO');
export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}
export const starsFor = accuracy => accuracy >= .8 ? 3 : accuracy >= .6 ? 2 : accuracy >= .4 ? 1 : 0;
export function earnedPoints(streak, fast, difficulty = 1) {
  const multiplier = streak >= 5 ? 3 : streak >= 3 ? 2 : 1;
  return Math.round((100 + (fast ? 50 : 0)) * multiplier * difficulty);
}
export function forbiddenMatches(text, entry) {
  const tokens = words(normalize(text));
  const blocked = [entry.word, ...entry.forbidden, ...(entry.variants || [])].map(normalize);
  return [...new Set(blocked.filter(term => tokens.some(token => token === term || token === `${term}s` || token === `${term}es`)))];
}
export function evaluateStory(text, prompt) {
  const tokens = words(normalize(text));
  return [
    { label: 'Al menos 60 palabras', pass: words(text).length >= 60 },
    ...Object.values(prompt).map(item => ({ label: `Incluye: ${item.label}`, pass: item.keys.some(key => tokens.includes(normalize(key))) })),
    { label: 'Comienza con mayúscula', pass: /^[\s«“"¡¿—-]*[A-ZÁÉÍÓÚÜÑ]/u.test(text) },
    { label: 'Utiliza puntuación y un cierre', pass: /[.!?…][\s»”"']*$/u.test(text.trim()) && (text.match(/[.!?…]/g) || []).length >= 2 }
  ];
}
