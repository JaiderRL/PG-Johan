import { accents } from '../../data/questions.js';
import { GameState } from '../game-state.js';
import { renderChoices } from './choice-game.js';
import { $ } from '../utils.js';
import { icon } from '../icons.js';
export function mount(session) {
  const questions = GameState.draw('accents', accents, session.run.rounds); let distance = 0;
  session.onAnswer = success => {
    distance = success ? (session.run.index + 1) / session.run.rounds * 100 : Math.max(0, distance - 7);
    $('.race-runner').style.left = `${distance * .8}%`; $('#race-fill').style.width = `${distance}%`;
    $('#distance').textContent = `${Math.round(distance)} %`;
  };
  session.renderRound = () => renderChoices(session, questions[session.run.index], `<aside class="quest-aside race-aside"><span class="eyebrow">EL SENDERO DE LAS TILDES</span><h2>¡Hacia la meta!</h2><div class="race-scene"><div class="race-mountains"></div><div class="race-path"></div><img class="race-runner" style="left:${distance * .8}%" src="assets/images/characters/lia.svg" alt="Lía avanza al responder correctamente"><span class="finish-flag">${icon('flag')}</span></div><div class="race-distance"><span>Tu recorrido</span><b id="distance">${Math.round(distance)} %</b></div><div class="energy"><i id="race-fill" style="width:${distance}%"></i></div><p>Un acierto te acerca a la meta.<br>Un error te hace retroceder un poco.</p><div class="rule-tags"><span>Agudas</span><span>Llanas</span><span>Esdrújulas</span><span>Hiatos</span></div></aside>`);
  session.renderRound();
}
