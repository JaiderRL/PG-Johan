import { synonyms } from '../../data/questions.js';
import { GameState } from '../game-state.js';
import { renderChoices } from './choice-game.js';
import { $ } from '../utils.js';
export function mount(session) {
  const questions = GameState.draw('synonyms', synonyms, session.run.rounds);
  session.onAnswer = success => {
    const attacker = $(success ? '.fighter.lia' : '.fighter.rival'); attacker.classList.remove('attack'); void attacker.offsetWidth; attacker.classList.add('attack');
    $('#rival-health').style.width = `${(1 - (session.run.index + (success ? 1 : 0)) / session.run.rounds) * 100}%`;
    $('#player-health').style.width = `${session.run.lives / session.difficulty.lives * 100}%`;
  };
  session.renderRound = () => {
    const original = questions[session.run.index];
    renderChoices(session, { ...original, question: `¿Cuál es el sinónimo de «${original.question}»?` }, `<aside class="battle-aside"><div class="fighter-label"><b>Lía</b><span>Exploradora de palabras</span><div class="energy"><i id="player-health" style="width:${session.run.lives / session.difficulty.lives * 100}%"></i></div></div><div class="battle-stage"><img class="fighter lia" src="assets/images/characters/lia.svg" alt="Lía preparada para la batalla"><span class="versus">VS</span><img class="fighter rival" src="assets/images/characters/borron.svg" alt="Borrón, una traviesa criatura de tinta"></div><div class="fighter-label rival-label"><b>Borrón</b><span>El ladrón de palabras</span><div class="energy rival-energy"><i id="rival-health" style="width:${(1 - session.run.index / session.run.rounds) * 100}%"></i></div></div><p class="battle-tip">Cada acierto debilita a Borrón.<br>¡Defiende el poder de las palabras!</p></aside>`);
  };
  session.renderRound();
}
