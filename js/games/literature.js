import { literature } from '../../data/questions.js';
import { GameState } from '../game-state.js';
import { renderChoices } from './choice-game.js';
import { icon } from '../icons.js';
export function mount(session) {
  const questions = GameState.draw('literature', literature, session.run.rounds);
  session.renderRound = () => renderChoices(session, questions[session.run.index], `<aside class="quest-aside literature-aside"><div class="large-badge">${icon('quill')}</div><h2>Voces que perduran</h2><p>Entre estas páginas viven personajes, autores e historias que han cruzado los siglos.</p><div class="book-stack" aria-hidden="true"><span>LAS GRANDES HISTORIAS</span><span>EL ARTE DE IMAGINAR</span><span>EL REINO DE LAS LETRAS</span></div><p class="aside-note">Todas las descripciones de este desafío son originales.</p></aside>`);
  session.renderRound();
}
