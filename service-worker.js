const CACHE = 'mision-palabra-v1.0.1';
const FILES = [
  './', './index.html', './manifest.json',
  './css/styles.css', './css/animations.css', './css/responsive.css',
  './js/app.js', './js/game-state.js', './js/router.js', './js/audio.js', './js/storage.js', './js/achievements.js', './js/utils.js', './js/icons.js', './js/ui.js', './js/game-engine.js',
  './js/games/choice-game.js', './js/games/detective.js', './js/games/escape-room.js', './js/games/synonyms.js', './js/games/sentence-builder.js', './js/games/literature.js', './js/games/accents.js', './js/games/forbidden-word.js', './js/games/story.js',
  './data/levels.js', './data/questions.js', './data/achievements.js',
  './assets/images/backgrounds/valley.png', './assets/images/backgrounds/library.png',
  './assets/images/characters/lia.svg', './assets/images/characters/borron.svg',
  './assets/images/icons/emblem.svg', './assets/images/icons/icon-192.png', './assets/images/icons/icon-512.png'
];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('mision-palabra-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
