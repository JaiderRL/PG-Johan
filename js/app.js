import { LEVELS, DIFFICULTIES } from '../data/levels.js';
import { ACHIEVEMENTS } from '../data/achievements.js';
import { GameState } from './game-state.js';
import { Audio } from './audio.js';
import { register, navigate, startRouter } from './router.js';
import { icon, stars } from './icons.js';
import { $, escapeHTML, number, formatTime } from './utils.js';
import { toast, openModal } from './ui.js';
import { isStorageUnavailable } from './storage.js';
import { GameSession } from './game-engine.js';
import * as detective from './games/detective.js';
import * as escapeRoom from './games/escape-room.js';
import * as synonyms from './games/synonyms.js';
import * as sentenceBuilder from './games/sentence-builder.js';
import * as literature from './games/literature.js';
import * as accents from './games/accents.js';
import * as forbiddenWord from './games/forbidden-word.js';
import * as story from './games/story.js';

const games = [detective, escapeRoom, synonyms, sentenceBuilder, literature, accents, forbiddenWord, story];
let lastResult = null;
function applySettings() { document.body.classList.toggle('reduce-motion', !GameState.settings.animations); Audio.configure(); }
const topbar = (back = 'home') => `<header class="page-topbar"><a class="icon-button" href="#/${back}" aria-label="${back === 'home' ? 'Volver al inicio' : 'Volver al mapa'}">${icon('back')}</a><a class="wordmark" href="#/home">${icon('book')}<span>MISIÓN: <b>PALABRA</b></span></a><div class="topbar-right"><span class="stat-pill">${icon('star')} ${GameState.stars}<small>/ 24</small></span><a class="icon-button" href="#/settings" aria-label="Opciones">${icon('gear')}</a></div></header>`;
function shell(title, eyebrow, content, back = 'home') {
  document.body.dataset.scene = 'valley';
  $('#main').innerHTML = `<section class="page-shell screen-enter">${topbar(back)}<div class="page-heading"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1></div>${content}</section>`;
}
function home() {
  document.body.dataset.scene = 'home';
  const completed = GameState.completedLevels.length;
  const next = LEVELS.find(l => !GameState.progress.levels[l.id]?.completed) || LEVELS[7];
  $('#main').innerHTML = `<section class="home-view screen-enter">
    <header class="home-header"><div class="kingdom-brand"><img src="assets/images/icons/emblem.svg" alt=""><span>EL REINO<br><b>DE LAS LETRAS</b></span></div><div class="home-tools"><span class="stat-pill">${icon('star')} ${GameState.stars}<small>/ 24</small></span><button class="icon-button" id="home-sound" aria-label="${GameState.settings.music ? 'Desactivar' : 'Activar'} música" aria-pressed="${GameState.settings.music}">${icon(GameState.settings.music ? 'volume' : 'mute')}</button><a class="icon-button" href="#/settings" aria-label="Configuración">${icon('gear')}</a></div></header>
    <div class="home-main"><div class="adventure-label"><span></span> UNA AVENTURA ENTRE PALABRAS</div><h1 class="game-logo"><span>Misión<span class="logo-colon">:</span></span><strong>PALABRA</strong></h1><div class="logo-flourish" aria-hidden="true"><i></i>${icon('star')}<i></i></div><p class="home-tagline">Aventura, lectura y muchos<br>desafíos en español.</p>
      <nav class="home-menu" aria-label="Menú principal"><a class="button play-button" href="#/map"><span class="play-symbol">${icon('play')}</span><span>Jugar<small>${completed ? 'Tu aventura continúa' : 'Tu aventura comienza aquí'}</small></span>${icon('arrow')}</a><div class="menu-pair"><a class="button forest-button" href="#/settings">${icon('gear')} Opciones</a><a class="button forest-button" href="#/achievements">${icon('trophy')} Logros ${Object.keys(GameState.progress.achievements).length ? '<i class="notification-dot"></i>' : ''}</a></div><div class="menu-links"><a href="#/stats">${icon('chart')} Estadísticas</a><span></span><a href="#/credits">${icon('info')} Créditos</a></div></nav>
    </div>
    <aside class="adventure-card"><div class="adventure-card-icon">${icon('compass')}</div><div class="adventure-card-content"><p>TU AVENTURA</p><h2>${completed === 8 ? '¡El reino está a salvo!' : completed ? 'Cada palabra te lleva más lejos' : 'Un mundo por descubrir'}</h2><div class="adventure-progress"><div><i style="width:${completed / 8 * 100}%"></i></div><span>${completed} / 8 desafíos</span></div><a href="#/map">${completed === 8 ? 'Vuelve por las 24 estrellas' : `Próxima parada: ${next.name}`} ${icon('arrow')}</a></div></aside>
    <div class="hero-character-label"><span>LÍA</span><small>Tu compañera de aventura</small></div>
    <footer class="home-footer"><span>${icon('shield')} Tu progreso se guarda automáticamente</span><span>EXPLORA. APRENDE. IMAGINA.</span><span>Hecho para mentes curiosas ${icon('star')}</span></footer>
  </section>`;
  $('#home-sound').onclick = () => { GameState.settings.music = !GameState.settings.music; GameState.persist(); applySettings(); const button = $('#home-sound'); button.innerHTML = icon(GameState.settings.music ? 'volume' : 'mute'); button.setAttribute('aria-label', `${GameState.settings.music ? 'Desactivar' : 'Activar'} música`); button.setAttribute('aria-pressed', String(GameState.settings.music)); };
}
function map() {
  const completed = GameState.completedLevels.length;
  shell('Elige tu próxima aventura', 'EL MAPA DEL REINO', `<div class="map-intro"><p>Ocho desafíos. Un viaje para descubrir el poder de las palabras.</p><label class="difficulty-selector">Dificultad <select id="map-difficulty" aria-label="Dificultad">${Object.entries(DIFFICULTIES).map(([key, value]) => `<option value="${key}" ${GameState.settings.difficulty === key ? 'selected' : ''}>${value.name}</option>`).join('')}</select></label></div><div class="map-overview"><span>${icon('compass')} <b>${completed}</b> de 8 desafíos completados</span><div class="progress-track"><i style="width:${completed / 8 * 100}%"></i></div><span>${icon('star')} ${GameState.stars} / 24 estrellas</span></div><div class="level-map">${LEVELS.map(level => {
    const unlocked = GameState.unlocked(level.id), saved = GameState.progress.levels[level.id];
    return `<button class="level-card ${unlocked ? 'available' : 'locked'} ${saved?.completed ? 'completed' : ''}" data-level="${level.id}" ${unlocked ? '' : 'disabled'} style="--level-color:${level.color}" aria-label="Desafío ${level.id}: ${level.name}. ${unlocked ? saved?.completed ? 'Completado' : 'Disponible' : `Bloqueado; completa el desafío ${level.id - 1}`}."><div class="level-card-art ${level.scene}"><span class="level-number">${String(level.id).padStart(2, '0')}</span><span class="level-icon">${icon(level.icon)}</span><span class="level-status">${icon(unlocked ? saved?.completed ? 'check' : 'play' : 'lock')}</span></div><div class="level-card-body"><p>${level.category}</p><h2>${level.name}</h2><div class="level-card-bottom">${stars(saved?.stars || 0)}<span>${unlocked ? `${number(saved?.score || 0)} pts` : `Completa el ${level.id - 1}`}</span></div></div></button>`;
  }).join('')}</div><div class="map-note">${icon('key')} Completa un desafío para abrir el siguiente. Puedes repetirlos para mejorar tus estrellas.</div>`);
  $('#map-difficulty').onchange = event => { GameState.settings.difficulty = event.target.value; GameState.persist(); toast(`Dificultad ${DIFFICULTIES[event.target.value].name.toLowerCase()} seleccionada`); };
  document.querySelectorAll('[data-level]').forEach(button => button.onclick = () => {
    const level = LEVELS[Number(button.dataset.level) - 1], difficulty = DIFFICULTIES[GameState.settings.difficulty];
    if (!GameState.unlocked(level.id)) return;
    openModal({ title: level.name, content: `<div class="modal-symbol" style="color:${level.color}">${icon(level.icon)}</div><p>${level.description}</p><div class="preview-stats"><span>${icon('heart')} ${difficulty.lives} vidas</span><span>${icon('clock')} ${level.time ? formatTime(level.perRound ? 90 : Math.round(level.time * difficulty.time)) : 'Sin límite'}</span><span>${icon('flag')} ${difficulty.name}</span></div>`, actions: [{ label: `Comenzar ${icon('play')}`, className: 'primary', action: () => navigate(`game/${level.id}`) }, { label: 'Volver al mapa' }] });
  });
}
function settings() {
  shell('A tu manera', 'OPCIONES DE LA AVENTURA', `<div class="settings-grid"><article class="glass-panel"><h2>${icon('volume')} Sonido y experiencia</h2>${[['music', 'Música de ambiente', 'Una melodía suave para acompañar tu viaje.'], ['effects', 'Efectos de sonido', 'Botones, aciertos, pistas y celebraciones.'], ['animations', 'Animaciones', 'Movimiento de personajes y efectos visuales.']].map(([key, title, description]) => `<div class="setting-row"><div><label for="setting-${key}">${title}</label><p>${description}</p></div><button class="toggle ${GameState.settings[key] ? 'on' : ''}" role="switch" aria-checked="${GameState.settings[key]}" aria-label="${title}" id="setting-${key}" data-setting="${key}"><i></i></button></div>`).join('')}<div class="setting-row volume-row"><div><label for="volume">Volumen general</label><p>Encuentra el equilibrio perfecto.</p></div><div><input id="volume" type="range" min="0" max="100" value="${GameState.settings.volume * 100}"><output id="volume-output" for="volume">${Math.round(GameState.settings.volume * 100)} %</output></div></div><div class="setting-row"><div><b>Pantalla completa</b><p>Sumérgete en el reino de las letras.</p></div><button class="button secondary small" id="fullscreen">${icon('expand')} ${document.fullscreenElement ? 'Desactivar' : 'Activar'}</button></div></article><div class="settings-side"><article class="glass-panel"><h2>${icon('flag')} Tu nivel de desafío</h2><div class="difficulty-options">${Object.entries(DIFFICULTIES).map(([key, value]) => `<label class="difficulty-option"><input type="radio" name="difficulty" value="${key}" ${GameState.settings.difficulty === key ? 'checked' : ''}><span><b>${value.name}</b><small>${value.description}</small></span>${icon('check')}</label>`).join('')}</div><p class="aside-note">En Palabra prohibida siempre dispones de 90 segundos por concepto. La escritura creativa no tiene límite de tiempo.</p></article><article class="glass-panel reset-panel"><h2>${icon('save')} Tus recuerdos del viaje</h2><p>El progreso y las historias se guardan en este navegador y dispositivo.</p><button class="button danger small" id="reset-progress">${icon('trash')} Borrar progreso</button></article></div></div>`);
  document.querySelectorAll('[data-setting]').forEach(button => button.onclick = () => { const key = button.dataset.setting; GameState.settings[key] = !GameState.settings[key]; button.classList.toggle('on', GameState.settings[key]); button.setAttribute('aria-checked', String(GameState.settings[key])); GameState.persist(); applySettings(); });
  $('#volume').oninput = event => { GameState.settings.volume = Number(event.target.value) / 100; $('#volume-output').textContent = `${event.target.value} %`; GameState.persist(); applySettings(); };
  document.querySelectorAll('[name=difficulty]').forEach(input => input.onchange = () => { GameState.settings.difficulty = input.value; GameState.persist(); });
  $('#fullscreen').onclick = async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen(); else toast('La pantalla completa no está disponible en este navegador.', 'error'); }
    catch { toast('El navegador no permitió activar la pantalla completa.', 'error'); }
  };
  const onFullscreen = () => { if ($('#fullscreen')) $('#fullscreen').innerHTML = `${icon('expand')} ${document.fullscreenElement ? 'Desactivar' : 'Activar'}`; };
  document.addEventListener('fullscreenchange', onFullscreen);
  $('#reset-progress').onclick = () => openModal({ title: '¿Seguro que deseas eliminar todo tu progreso?', content: '<p>Se borrarán las estrellas, los niveles completados, los logros, las estadísticas, la configuración y todas tus historias guardadas. Esta acción no se puede deshacer.</p>', actions: [{ label: 'Conservar mi aventura', className: 'primary' }, { label: 'Sí, borrar todo', className: 'danger', action: () => { if (GameState.reset()) { applySettings(); toast('Tu nueva aventura está lista.'); navigate('home'); } else toast('No fue posible borrar el almacenamiento del navegador.', 'error'); } }] });
  return () => document.removeEventListener('fullscreenchange', onFullscreen);
}
function achievements() {
  const unlocked = GameState.progress.achievements;
  shell('Pequeñas hazañas, grandes historias', 'TU COLECCIÓN DE LOGROS', `<div class="collection-summary">${icon('trophy')}<span><b>${Object.keys(unlocked).length}</b> de ${ACHIEVEMENTS.length} logros descubiertos</span></div><div class="achievements-grid">${ACHIEVEMENTS.map(a => `<article class="achievement-card ${unlocked[a.id] ? 'unlocked' : ''}"><span class="achievement-medal">${icon(a.icon)}</span><div><h2>${a.name}</h2><p>${a.description}</p><small>${unlocked[a.id] ? `${icon('check')} ${new Date(unlocked[a.id]).toLocaleDateString('es-CO')}` : `${icon('lock')} Por descubrir`}</small></div></article>`).join('')}</div>`);
}
function stats() {
  const stats = GameState.progress.stats, completed = GameState.completedLevels.length;
  const entries = [['star', 'Puntos totales', number(stats.points)], ['check', 'Respuestas correctas', number(stats.correct)], ['chart', 'Precisión', `${stats.answered ? Math.round(stats.correct / stats.answered * 100) : 0} %`], ['clock', 'Tiempo de aventura', formatTime(stats.seconds)], ['flame', 'Mejor racha', `${stats.bestStreak} seguidas`], ['flag', 'Desafíos completados', `${completed} / 8`], ['quill', 'Preguntas respondidas', number(stats.answered)], ['info', 'Respuestas incorrectas', number(stats.incorrect)]];
  shell('Cada paso cuenta', 'TU DIARIO DE AVENTURA', `<div class="stats-grid">${entries.map(([i, label, value]) => `<article class="glass-panel stat-card">${icon(i)}<strong>${value}</strong><span>${label}</span></article>`).join('')}</div><article class="glass-panel personal-records"><h2>Tu recorrido por el reino</h2>${LEVELS.map(l => `<div class="record-row"><span class="record-icon" style="color:${l.color}">${icon(l.icon)}</span><span>${l.name}<small>${GameState.progress.levels[l.id]?.completed ? 'Completado' : GameState.unlocked(l.id) ? 'Por explorar' : 'Bloqueado'}</small></span>${stars(GameState.progress.levels[l.id]?.stars || 0)}<b>${number(GameState.progress.levels[l.id]?.score || 0)} pts</b></div>`).join('')}</article>`);
}
function credits() {
  shell('Las palabras abren mundos', 'CRÉDITOS Y PROPÓSITO', `<article class="glass-panel credits-panel"><img src="assets/images/icons/emblem.svg" width="90" height="90" alt="Emblema del reino de las letras"><h2>Misión: Palabra</h2><p class="credits-lead">Una aventura educativa para leer con curiosidad,<br>pensar con libertad y escribir con imaginación.</p><div class="credits-columns"><div><h3>El universo</h3><p>Lía, una exploradora del valle, y Borrón, una criatura de tinta, son personajes originales de este proyecto.</p><h3>Contenido</h3><p>Ejercicios, relatos y descripciones originales en español. La sección literaria utiliza referencias a obras clásicas. Evaluaciones de escritura y vocabulario basadas en reglas locales.</p></div><div><h3>Arte y sonido</h3><p>Escenarios originales generados con la herramienta de imágenes de OpenAI. Personajes e iconos SVG creados para el juego. Música y efectos originales sintetizados con Web Audio.</p><h3>Desarrollo</h3><p>Proyecto de Grado · Johan<br>HTML5, CSS3 y JavaScript.<br>Versión 1.0 · Sin cuentas ni publicidad.</p></div></div><p class="credits-end">Para todas las mentes curiosas que se atreven a preguntar: «¿Y si…?»</p></article>`);
}
function game(parameter) {
  const id = Number(parameter), level = LEVELS[id - 1];
  if (!Number.isInteger(id) || !level || !GameState.unlocked(id)) { toast('Primero completa el desafío anterior.', 'error'); navigate('map'); return; }
  const session = new GameSession(level, result => { lastResult = result; navigate('result'); });
  session.mount(); games[id - 1].mount(session);
  return () => session.dispose();
}
function result() {
  if (!lastResult) { navigate('map'); return; }
  const r = lastResult, level = LEVELS[r.level - 1];
  document.body.dataset.scene = level.scene;
  $('#main').innerHTML = `<section class="result-shell screen-enter">${topbar('map')}<article class="result-card ${r.won ? 'victory' : 'defeat'}"><div class="result-emblem">${icon(r.won ? 'trophy' : 'leaf')}</div><p class="eyebrow">${r.won ? '¡DESAFÍO COMPLETADO!' : 'CADA INTENTO TE ENSEÑA ALGO'}</p><h1>${r.won ? r.level === 8 ? 'Tu historia es parte del reino' : '¡Una gran aventura!' : 'Inténtalo de nuevo'}</h1><p class="result-level">${level.name}</p>${r.won ? stars(r.stars, 'result-stars') : `<p class="result-reason">${escapeHTML(r.reason)}</p>`}<strong class="result-score">${number(r.score)}<span>puntos ${r.won ? '· incluye 500 por completar' : ''}</span></strong><div class="result-metrics"><div>${icon('chart')}<b>${Math.round(r.accuracy * 100)} %</b><span>${r.level === 8 ? 'Criterios cumplidos' : 'Precisión'}</span></div><div>${icon('clock')}<b>${formatTime(r.seconds)}</b><span>Tiempo de juego</span></div><div>${icon('flame')}<b>${r.bestStreak}</b><span>Mejor racha</span></div></div>${r.won && r.level < 8 ? `<div class="unlock-banner">${icon('key')} Desbloqueaste: <b>${LEVELS[r.level].name}</b></div>` : ''}${r.achievements.length ? `<div class="result-achievements">${r.achievements.map(a => `<span>${icon(a.icon)} ${a.name}</span>`).join('')}</div>` : ''}<div class="result-actions">${r.won && r.level < 8 ? `<button class="button primary" data-next="${r.level + 1}">Siguiente desafío ${icon('arrow')}</button>` : ''}<button class="button ${r.won ? 'secondary' : 'primary'}" id="retry">${icon('refresh')} ${r.won ? 'Repetir' : 'Reintentar'}</button><a class="button secondary" href="#/map">${icon('map')} Volver al mapa</a></div></article>${r.won ? '<div class="confetti" aria-hidden="true">' + Array.from({ length: 20 }, (_, i) => `<i style="--i:${i}"></i>`).join('') + '</div>' : ''}</section>`;
  $('#retry').onclick = () => navigate(`game/${r.level}`);
  $('[data-next]')?.addEventListener('click', () => navigate(`game/${r.level + 1}`));
  const starSounds = r.won ? Array.from({ length: r.stars }, (_, index) => setTimeout(() => Audio.play('star'), 250 + index * 180)) : [];
  return () => starSounds.forEach(clearTimeout);
}

for (const [route, renderer] of Object.entries({ home, map, settings, achievements, stats, credits, game, result })) register(route, renderer);
$('.skip-link').addEventListener('click', event => { event.preventDefault(); $('#main').focus({ preventScroll: true }); });
document.addEventListener('pointerdown', () => Audio.unlock(), { once: true });
document.addEventListener('keydown', () => Audio.unlock(), { once: true });
document.addEventListener('click', event => { if (event.target.closest('button,a') && !event.target.closest('[disabled]')) Audio.play('click'); });
document.addEventListener('visibilitychange', () => { if (document.hidden) Audio.suspend(); else Audio.unlock(); });
let warnedStorage = false;
function storageWarning() { if (!warnedStorage) { warnedStorage = true; toast('El navegador no permite guardar. Tu progreso durará solo esta sesión; copia tus historias antes de cerrar.', 'error'); } }
window.addEventListener('storage-unavailable', storageWarning);
applySettings(); startRouter();
if (isStorageUnavailable()) storageWarning();
if ('serviceWorker' in navigator && ['http:', 'https:'].includes(location.protocol)) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => { /* The game remains playable when installation is unavailable. */ }));
}
