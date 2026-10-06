export const ACHIEVEMENTS = [
  { id: 'first', name: 'Primer paso', description: 'Completa tu primer desafío.', icon: 'compass', test: s => Object.values(s.levels).some(l => l.completed) },
  { id: 'detective', name: 'Ojo de detective', description: 'Encuentra 20 errores ortográficos.', icon: 'search', test: s => s.stats.errorsFound >= 20 },
  { id: 'perfect', name: 'Sin un tropiezo', description: 'Completa un desafío sin perder vidas.', icon: 'shield', test: (s, r) => r?.won && r.mistakes === 0 },
  { id: 'fast', name: 'Mente veloz', description: 'Responde 5 veces en menos de 5 segundos.', icon: 'bolt', test: s => s.stats.fast >= 5 },
  { id: 'library', name: 'Ratón de biblioteca', description: 'Escapa de la biblioteca.', icon: 'book', test: s => s.levels[2]?.completed },
  { id: 'words', name: 'Maestro de palabras', description: 'Consigue 100 respuestas correctas.', icon: 'quill', test: s => s.stats.correct >= 100 },
  { id: 'legend', name: 'Leyenda de las letras', description: 'Consigue 3 estrellas en los 8 desafíos.', icon: 'crown', test: s => Array.from({ length: 8 }, (_, i) => s.levels[i + 1]?.stars === 3).every(Boolean) },
  { id: 'combo', name: 'En racha', description: 'Encadena 5 respuestas correctas.', icon: 'flame', test: s => s.stats.bestStreak >= 5 },
  { id: 'unstoppable', name: 'Imparable', description: 'Encadena 10 respuestas correctas.', icon: 'swords', test: s => s.stats.bestStreak >= 10 },
  { id: 'writer', name: 'Una voz propia', description: 'Guarda tu primera historia de 60 palabras.', icon: 'feather', test: s => s.stats.stories >= 1 },
  { id: 'explorer', name: 'Exploradora del reino', description: 'Completa los 8 desafíos.', icon: 'map', test: s => Object.values(s.levels).filter(l => l.completed).length === 8 },
  { id: 'treasure', name: 'Tesoro de palabras', description: 'Acumula 10.000 puntos.', icon: 'gem', test: s => s.stats.points >= 10000 }
];
