import * as Storage from './storage.js';
import { shuffle } from './utils.js';
export const GameState = {
  progress: Storage.load(),
  session: null,
  get settings() { return this.progress.settings; },
  get stars() { return Object.values(this.progress.levels).reduce((sum, l) => sum + l.stars, 0); },
  get completedLevels() { return Object.entries(this.progress.levels).filter(([, l]) => l.completed).map(([id]) => Number(id)); },
  unlocked(id) { return id === 1 || this.progress.levels[id - 1]?.completed === true; },
  persist() { return Storage.save(this.progress); },
  reset() { if (!Storage.clear()) return false; this.progress = Storage.fresh(); this.session = null; return this.persist(); },
  draw(key, bank, count) {
    const valid = new Set(bank.map(q => q.id));
    let bag = (this.progress.bags[key] || []).filter(id => valid.has(id));
    const result = [];
    while (result.length < Math.min(count, bank.length)) {
      if (!bag.length) bag = shuffle(bank.map(q => q.id).filter(id => !result.includes(id)));
      const id = bag.pop(); if (!result.includes(id)) result.push(id);
    }
    this.progress.bags[key] = bag;
    this.persist();
    return result.map(id => bank.find(q => q.id === id));
  }
};
