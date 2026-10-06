import { ACHIEVEMENTS } from '../data/achievements.js';
import { GameState } from './game-state.js';
export function checkAchievements(result) {
  const unlocked = [];
  for (const achievement of ACHIEVEMENTS) {
    if (!GameState.progress.achievements[achievement.id] && achievement.test(GameState.progress, result)) {
      GameState.progress.achievements[achievement.id] = new Date().toISOString();
      unlocked.push(achievement);
    }
  }
  GameState.persist();
  return unlocked;
}
