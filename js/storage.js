const KEY = 'mision-palabra:v1';
const defaults = () => ({ version: 1, levels: {}, achievements: {}, bags: {}, settings: { music: true, effects: true, volume: .35, animations: true, difficulty: 'normal' }, stats: { answered: 0, correct: 0, incorrect: 0, seconds: 0, bestStreak: 0, points: 0, errorsFound: 0, fast: 0, stories: 0 }, stories: [], draft: null });
let storageFailed = false;
function failure() { storageFailed = true; globalThis.dispatchEvent?.(new Event('storage-unavailable')); }
const bounded = (value, fallback = 0) => Number.isFinite(value) && value >= 0 ? value : fallback;
export function load() {
  const initial = defaults();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    const data = JSON.parse(raw);
    if (!data || data.version !== 1) return initial;
    if (data.settings && typeof data.settings === 'object') {
      for (const key of ['music', 'effects', 'animations']) if (typeof data.settings[key] === 'boolean') initial.settings[key] = data.settings[key];
      initial.settings.volume = Math.min(1, bounded(data.settings.volume, .35));
      if (['easy', 'normal', 'hard'].includes(data.settings.difficulty)) initial.settings.difficulty = data.settings.difficulty;
    }
    for (const key of Object.keys(initial.stats)) initial.stats[key] = bounded(data.stats?.[key]);
    for (let id = 1; id <= 8; id++) {
      const item = data.levels?.[id];
      if (item && typeof item === 'object') initial.levels[id] = { completed: item.completed === true, score: bounded(item.score), stars: Math.min(3, Math.floor(bounded(item.stars))), accuracy: Math.min(1, bounded(item.accuracy)), plays: bounded(item.plays), date: typeof item.date === 'string' ? item.date : '' };
    }
    if (data.achievements && typeof data.achievements === 'object') for (const [id, date] of Object.entries(data.achievements)) if (typeof date === 'string' && !Number.isNaN(Date.parse(date))) initial.achievements[id] = date;
    if (data.bags && typeof data.bags === 'object') for (const [key, value] of Object.entries(data.bags)) if (Array.isArray(value)) initial.bags[key] = value.filter(id => typeof id === 'string').slice(0, 100);
    const validStory = item => item && typeof item.text === 'string' && item.prompt && Object.keys(item.prompt).length === 4 && Object.values(item.prompt).every(p => typeof p?.label === 'string' && Array.isArray(p.keys) && p.keys.every(k => typeof k === 'string'));
    initial.stories = Array.isArray(data.stories) ? data.stories.filter(validStory).slice(-30) : [];
    initial.draft = validStory(data.draft) ? data.draft : null;
    return initial;
  } catch { failure(); return initial; }
}
export function save(data) { try { localStorage.setItem(KEY, JSON.stringify(data)); return true; } catch { failure(); return false; } }
export function clear() { try { localStorage.removeItem(KEY); return true; } catch { failure(); return false; } }
export const fresh = defaults;
export const isStorageUnavailable = () => storageFailed;
