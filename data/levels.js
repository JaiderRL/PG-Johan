export const LEVELS = [
  { id: 1, name: 'Detective de palabras', category: 'Ortografía', icon: 'search', color: '#ebba57', scene: 'library', subtitle: 'Cada palabra esconde una pista.', description: 'Encuentra y corrige los errores que se han colado en los manuscritos.', rounds: 3, time: 210 },
  { id: 2, name: 'El misterio de la biblioteca', category: 'Comprensión lectora', icon: 'book', color: '#b79be6', scene: 'library', subtitle: 'Diez pistas. Una puerta. Tu ingenio.', description: 'Un escape room entre libros: interpreta los textos y reúne las diez pistas para salir.', rounds: 10, time: 420 },
  { id: 3, name: 'Batalla de sinónimos', category: 'Vocabulario', icon: 'swords', color: '#66c9db', scene: 'valley', subtitle: 'Las palabras son tu mejor defensa.', description: 'Ayuda a Lía a vencer a Borrón eligiendo el sinónimo correcto.', rounds: 7, time: 100 },
  { id: 4, name: 'Construye la oración', category: 'Gramática', icon: 'puzzle', color: '#87cea1', scene: 'valley', subtitle: 'Pon cada palabra en su lugar.', description: 'Toca o arrastra las palabras y construye oraciones de dificultad creciente.', rounds: 5, time: 180 },
  { id: 5, name: '¿Quién dijo qué?', category: 'Literatura', icon: 'quill', color: '#d5a0cb', scene: 'library', subtitle: 'Los clásicos tienen algo que contarte.', description: 'Descubre obras, autores y personajes de la literatura clásica.', rounds: 5, time: 150 },
  { id: 6, name: 'La carrera de las tildes', category: 'Acentuación', icon: 'flag', color: '#f1b15e', scene: 'valley', subtitle: 'Una tilde puede llevarte muy lejos.', description: 'Acierta para avanzar. Aprende reglas de acentuación y alcanza la meta.', rounds: 7, time: 120 },
  { id: 7, name: 'Palabra prohibida', category: 'Expresión escrita y vocabulario', icon: 'message', color: '#a6a0eb', scene: 'library', subtitle: 'Explícalo con tus palabras.', description: 'Describe por escrito tres conceptos sin usar las palabras prohibidas.', rounds: 3, time: 90, perRound: true },
  { id: 8, name: 'Crea tu propia historia', category: 'Escritura creativa', icon: 'feather', color: '#edbd75', scene: 'library', subtitle: 'La última aventura la escribes tú.', description: 'Combina cuatro elementos, da vida a tu relato y guarda tus historias.', rounds: 1, time: 0 }
];
export const DIFFICULTIES = {
  easy: { name: 'Fácil', lives: 5, time: 1.5, points: 0.8, description: '5 vidas · más tiempo para explorar' },
  normal: { name: 'Normal', lives: 3, time: 1, points: 1, description: '3 vidas · la aventura original' },
  hard: { name: 'Difícil', lives: 2, time: 0.75, points: 1.25, description: '2 vidas · menos tiempo, más puntos' }
};
