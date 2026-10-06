import test from 'node:test';
import assert from 'node:assert/strict';
import { detective, escapeRoom, synonyms, sentences, literature, accents, forbidden, storyElements } from '../data/questions.js';
import { LEVELS } from '../data/levels.js';
import { ACHIEVEMENTS } from '../data/achievements.js';
import { parseText } from '../js/games/detective.js';
import { shuffle, forbiddenMatches, evaluateStory, starsFor, earnedPoints, escapeHTML } from '../js/utils.js';
import * as Storage from '../js/storage.js';
import { GameState } from '../js/game-state.js';
const memory = new Map();
globalThis.localStorage = { getItem: key => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value), removeItem: key => memory.delete(key) };

test('The eight levels have the complete content banks and unique IDs', () => {
  assert.equal(LEVELS.length, 8);
  for (const [bank, min] of [[detective, 15], [escapeRoom, 10], [synonyms, 25], [sentences, 20], [literature, 15], [accents, 25], [forbidden, 20]]) {
    assert.ok(bank.length >= min); assert.equal(new Set(bank.map(q => q.id)).size, bank.length);
  }
  for (const bank of Object.values(storyElements)) assert.ok(bank.length >= 15);
  assert.ok(ACHIEVEMENTS.length >= 12);
});
test('Every multiple choice question has one valid index and four distinct canonical answers', () => {
  for (const bank of [escapeRoom, synonyms, literature, accents]) for (const q of bank) {
    assert.equal(q.answers.length, 4, q.id);
    assert.equal(new Set(q.answers.map(a => a.normalize('NFC'))).size, 4, q.id);
    assert.ok(q.correct >= 0 && q.correct < 4); assert.ok(q.explanation.length > 15);
  }
});
test('Detective texts parse into reconstructable tokens and three explained corrections', () => {
  for (const q of detective) {
    const tokens = parseText(q.text), errors = tokens.filter(t => t.error);
    assert.equal(errors.length, 3, q.id);
    assert.ok(tokens.every(t => !t.text.includes('[[')));
    assert.ok(errors.every(t => t.correction !== t.text && t.explanation.length > 15));
    assert.match(tokens.map(t => t.correction || t.text).join(''), /^[A-ZÁÉÍÓÚÑ]/);
    assert.match(tokens.map(t => t.correction || t.text).join(''), /[.!?]$/);
  }
});
test('Sentence tokens retain accents, capitals, punctuation and expected order', () => {
  for (const q of sentences) assert.equal(q.tokens.join(' '), q.answer);
  assert.deepEqual([...shuffle([1, 2, 3, 4])].sort(), [1, 2, 3, 4]);
});
test('Star thresholds and timed streak scoring follow the rules', () => {
  assert.deepEqual([0, .39, .4, .59, .6, .79, .8, 1].map(starsFor), [0, 0, 1, 1, 2, 2, 3, 3]);
  assert.equal(earnedPoints(1, false), 100); assert.equal(earnedPoints(1, true), 150);
  assert.equal(earnedPoints(3, true), 300); assert.equal(earnedPoints(5, true), 450);
  assert.equal(earnedPoints(1, false, 1.25), 125);
});
test('Forbidden checks ignore case and accents but respect word boundaries', () => {
  const entry = forbidden[0];
  assert.deepEqual(forbiddenMatches('Las ESTANTERÍAS contienen libros para LEER.', entry).sort(), ['estanteria', 'leer', 'libro', 'libros'].sort());
  assert.ok(forbiddenMatches('biblioteca', entry).includes('biblioteca'));
  assert.deepEqual(forbiddenMatches('Me gusta deliberar acerca de varios temas.', entry), []);
});
test('Story rules measure explicit criteria without claiming semantic judgment', () => {
  const prompt = Object.fromEntries(Object.entries(storyElements).map(([key, list]) => [key, list[0]]));
  const text = 'Una astrónoma visitó un castillo para investigar una desaparición. Encontró una llave. ' + 'Caminó con paciencia para descubrir el misterio y ayudar a su nueva amiga. '.repeat(5);
  assert.equal(evaluateStory(text, prompt).filter(c => c.pass).length, 7);
  assert.equal(evaluateStory('una frase corta', prompt).filter(c => c.pass).length, 0);
});
test('Persistence preserves progress, validates settings and recovers corrupt storage', () => {
  memory.clear(); let state = Storage.fresh(); state.levels[1] = { completed: true, score: 900, stars: 3, accuracy: 1, plays: 1, date: new Date().toISOString() };
  state.settings.volume = .7; Storage.save(state);
  assert.equal(Storage.load().levels[1].score, 900); assert.equal(Storage.load().settings.volume, .7);
  memory.set('mision-palabra:v1', '{bad json'); assert.equal(Storage.load().settings.difficulty, 'normal');
  memory.set('mision-palabra:v1', JSON.stringify({ version: 1, settings: { difficulty: 'impossible', volume: -1 }, levels: { 1: { completed: 'true', score: -5, stars: 900 } } }));
  state = Storage.load(); assert.equal(state.settings.difficulty, 'normal'); assert.equal(state.settings.volume, .35); assert.equal(state.levels[1].completed, false); assert.equal(state.levels[1].stars, 3); assert.equal(state.levels[1].score, 0);
});
test('Progression locks levels and bags avoid repeats until exhausted', () => {
  GameState.progress = Storage.fresh(); assert.equal(GameState.unlocked(1), true); assert.equal(GameState.unlocked(2), false);
  GameState.progress.levels[1] = { completed: true }; assert.equal(GameState.unlocked(2), true);
  const first = GameState.draw('test', synonyms, 10), second = GameState.draw('test', synonyms, 10);
  assert.equal(new Set([...first, ...second].map(q => q.id)).size, 20);
  assert.equal(GameState.draw('test', synonyms, 10).length, 10);
});
test('User text is escaped before HTML rendering', () => {
  assert.equal(escapeHTML('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
});
