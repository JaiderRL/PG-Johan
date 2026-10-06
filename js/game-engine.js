import { GameState } from './game-state.js';
import { DIFFICULTIES } from '../data/levels.js';
import { icon } from './icons.js';
import { $, formatTime, number, earnedPoints, starsFor } from './utils.js';
import { Audio } from './audio.js';
import { checkAchievements } from './achievements.js';
import { toast, openModal, closeModal, feedback } from './ui.js';
import { navigate } from './router.js';

export class GameSession {
  constructor(level, onEnd) {
    this.level = level;
    this.onEnd = onEnd;
    this.difficulty = DIFFICULTIES[GameState.settings.difficulty];
    this.maxTime = level.perRound ? 90 : Math.round(level.time * this.difficulty.time);
    this.run = { level: level.id, score: 0, lives: this.difficulty.lives, correct: 0, mistakes: 0, streak: 0, bestStreak: 0, index: 0, remaining: this.maxTime, seconds: 0, rounds: level.rounds, ended: false };
    GameState.session = this.run;
    this.controller = new AbortController(); this.savedSeconds = 0;
    this.lastTick = performance.now(); this.questionStart = this.lastTick;
    this.paused = false; this.between = false;
  }
  mount() {
    document.body.dataset.scene = this.level.scene;
    $('#main').innerHTML = `<section class="game-shell screen-enter" style="--level-color:${this.level.color}">
      <header class="game-topbar"><button class="icon-button" id="game-back" aria-label="Volver al mapa">${icon('back')}</button><a class="wordmark" href="#/home">${icon('book')}<span>MISIÓN: <b>PALABRA</b></span></a>
      <div class="hud"><span class="hud-item score">${icon('star')}<b id="hud-score">0</b><small>puntos</small></span><span class="hud-item lives" id="hud-lives"></span><span class="hud-item timer" id="hud-timer">${icon('clock')}<b id="hud-time">${this.level.time ? formatTime(this.maxTime) : 'Sin límite'}</b></span></div><button class="icon-button" id="game-pause" aria-label="Pausar juego">${icon('pause')}</button></header>
      <div class="game-heading"><div class="game-emblem">${icon(this.level.icon)}</div><div><p class="eyebrow">DESAFÍO ${String(this.level.id).padStart(2, '0')} <span>·</span> ${this.level.category}</p><h1>${this.level.name}</h1></div><span class="difficulty-tag">${this.difficulty.name}</span></div>
      <div class="quest-progress"><span id="round-label">Etapa 1 de ${this.run.rounds}</span><div class="progress-track"><i id="round-progress"></i></div><span id="combo-label">¡Tú puedes!</span></div>
      <div id="game-content" class="game-content"></div>
      <div class="game-bottom"><span>${icon('shield')} Tu progreso se guarda al completar el desafío</span><span>ESC para pausar</span></div>
    </section>`;
    this.container = $('#game-content');
    $('#game-back').onclick = () => this.pause(true);
    $('#game-pause').onclick = () => this.pause();
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && !$('#modal').open && !this.run.ended) { event.preventDefault(); this.pause(); } }, { signal: this.controller.signal });
    document.addEventListener('visibilitychange', () => { if (document.hidden && !this.run.ended) this.pause(); }, { signal: this.controller.signal });
    window.addEventListener('pagehide', () => this.checkpoint(), { signal: this.controller.signal });
    this.interval = setInterval(() => this.tick(), 200);
    this.updateHUD();
  }
  tick() {
    const now = performance.now(), delta = (now - this.lastTick) / 1000;
    this.lastTick = now;
    if (this.paused || this.between || this.run.ended) return;
    this.run.seconds += delta;
    if (this.level.time) {
      this.run.remaining = Math.max(0, this.run.remaining - delta);
      const seconds = Math.ceil(this.run.remaining);
      $('#hud-time').textContent = formatTime(seconds);
      $('#hud-timer').classList.toggle('urgent', seconds <= 10);
      if (seconds <= 10 && seconds !== this.lastWarning) { Audio.play('warning'); this.lastWarning = seconds; }
      if (this.run.remaining <= 0) this.end(false, 'El tiempo se agotó. Respira, lee las pistas y vuelve a intentarlo.');
    }
    if (this.run.seconds - this.savedSeconds >= 10) this.checkpoint();
  }
  checkpoint() {
    GameState.progress.stats.seconds += Math.max(0, this.run.seconds - this.savedSeconds);
    this.savedSeconds = this.run.seconds;
    GameState.persist();
  }
  updateHUD() {
    if (!$('#hud-score')) return;
    $('#hud-score').textContent = number(this.run.score);
    $('#hud-lives').innerHTML = Array.from({ length: this.difficulty.lives }, (_, i) => icon('heart', i < this.run.lives ? '' : 'lost')).join('');
    $('#hud-lives').setAttribute('aria-label', `${this.run.lives} de ${this.difficulty.lives} vidas`);
    $('#round-label').textContent = `Etapa ${Math.min(this.run.index + 1, this.run.rounds)} de ${this.run.rounds}`;
    $('#round-progress').style.width = `${((this.run.index + (this.between ? 1 : 0)) / this.run.rounds) * 100}%`;
    $('#combo-label').textContent = this.run.streak >= 10 ? '✦ IMPARABLE · ×3' : this.run.streak >= 5 ? '✦ Racha ×3' : this.run.streak >= 3 ? '✦ Racha ×2' : '¡Tú puedes!';
    $('#combo-label').classList.toggle('combo-active', this.run.streak >= 3);
  }
  grade(success, message, options = {}) {
    if (this.run.ended || this.paused || this.between) return 0;
    this.tick();
    if (this.run.ended) return 0;
    const stats = GameState.progress.stats;
    stats.answered++;
    let points = 0;
    if (success) {
      this.run.correct++; stats.correct++; this.run.streak++;
      this.run.bestStreak = Math.max(this.run.bestStreak, this.run.streak);
      stats.bestStreak = Math.max(stats.bestStreak, this.run.streak);
      const fast = !options.noFast && performance.now() - this.questionStart < 5000;
      if (fast) stats.fast++;
      if (options.detective) stats.errorsFound++;
      points = earnedPoints(this.run.streak, fast, this.difficulty.points);
      this.run.score += points; stats.points += points;
      Audio.play('correct');
    } else {
      this.run.mistakes++; stats.incorrect++; this.run.streak = 0; this.run.lives--;
      const penalty = Math.min(this.run.score, 25); this.run.score -= penalty; stats.points = Math.max(0, stats.points - penalty);
      Audio.play('wrong');
      this.container.classList.remove('shake'); void this.container.offsetWidth; this.container.classList.add('shake');
    }
    this.questionStart = performance.now();
    this.updateHUD();
    const target = $('.feedback', this.container);
    if (target) feedback(target, success, message, points);
    this.checkpoint();
    checkAchievements().forEach(a => toast(`Logro desbloqueado: ${a.name}`));
    if (!this.run.lives) this.end(false, 'Te quedaste sin vidas. Cada intento es una nueva oportunidad de aprender.');
    return points;
  }
  completeRound() {
    if (this.run.ended) return;
    this.between = true; this.updateHUD();
    this.onPause?.();
    const next = $('.next-round', this.container);
    if (next) { next.hidden = false; next.textContent = this.run.index + 1 === this.run.rounds ? 'Ver resultado →' : 'Siguiente →'; next.onclick = () => this.next(); }
  }
  next() {
    if (this.run.ended || this.paused) return;
    if (this.run.index + 1 >= this.run.rounds) { this.end(true); return; }
    this.run.index++; this.between = false;
    this.questionStart = this.lastTick = performance.now();
    if (this.level.perRound) { this.run.remaining = this.maxTime; this.lastWarning = null; }
    this.updateHUD(); this.renderRound();
  }
  pause(leaving = false) {
    if (this.paused || this.run.ended) return;
    this.tick(); if (this.run.ended) return;
    this.paused = true; this.onPause?.(); this.checkpoint();
    const pausedAt = performance.now();
    const resume = () => { this.questionStart += performance.now() - pausedAt; this.paused = false; this.lastTick = performance.now(); };
    openModal({ title: leaving ? '¿Volvemos al mapa?' : 'Un pequeño descanso', content: `<div class="modal-symbol">${icon(leaving ? 'map' : 'leaf')}</div><p>${leaving ? 'Los desafíos completados se conservan. Esta partida tendrá que comenzar de nuevo.' : 'La aventura te espera. El tiempo está detenido.'}</p>`, actions: [{ label: 'Continuar jugando', className: 'primary', action: resume }, { label: 'Ir al mapa', action: () => navigate('map') }], onCancel: resume });
  }
  end(won, reason = '') {
    if (this.run.ended) return;
    this.run.ended = true; clearInterval(this.interval); this.onPause?.(); closeModal();
    const accuracy = this.accuracyOverride ?? this.run.correct / Math.max(1, this.run.correct + this.run.mistakes);
    const earnedStars = won ? starsFor(accuracy) : 0;
    if (won) {
      this.run.score += 500; GameState.progress.stats.points += 500;
      const previous = GameState.progress.levels[this.level.id] || { score: 0, stars: 0, accuracy: 0, plays: 0 };
      GameState.progress.levels[this.level.id] = { completed: true, score: Math.max(previous.score, this.run.score), stars: Math.max(previous.stars, earnedStars), accuracy: Math.max(previous.accuracy, accuracy), plays: previous.plays + 1, date: new Date().toISOString() };
    }
    this.checkpoint();
    const result = { ...this.run, won, reason, accuracy, stars: earnedStars, difficulty: this.difficulty.name };
    result.achievements = checkAchievements(result);
    Audio.play(won ? 'win' : 'lose');
    this.onEnd(result);
  }
  dispose() {
    clearInterval(this.interval); this.controller.abort(); this.cleanupGame?.(); this.checkpoint(); closeModal();
    GameState.session = null;
  }
}
