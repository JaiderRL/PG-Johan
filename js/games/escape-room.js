import { escapeRoom } from '../../data/questions.js';
import { renderChoices } from './choice-game.js';
import { $, escapeHTML } from '../utils.js';
import { icon } from '../icons.js';
export function mount(session) {
  session.run.rounds = escapeRoom.length;
  session.onAnswer = (success, question) => {
    if (!success) return;
    $('.library-door').classList.add(session.run.index === 9 ? 'opened' : 'unlocked');
    $('#clue-text').textContent = question.clue;
    $('#clue-symbol').innerHTML = icon('key');
    $('#keys-found').textContent = `${session.run.index + 1} / 10`;
  };
  session.renderRound = () => renderChoices(session, escapeRoom[session.run.index], `<aside class="quest-aside"><span class="eyebrow">ESCAPE ROOM</span><div class="library-door"><div class="door-leaf">${icon('lock')}</div><span class="door-light"></span></div><h2>La puerta del saber</h2><p>Reúne las diez pistas del guardián para volver al valle.</p><div class="clue-card"><span id="clue-symbol">${icon('lock')}</span><strong>PISTA ${session.run.index + 1}</strong><p id="clue-text">${escapeHTML('Resuelve el enigma para revelar la siguiente pista.')}</p></div><p class="keys-total">${icon('key')} Pistas reunidas <b id="keys-found">${session.run.index} / 10</b></p></aside>`);
  session.renderRound();
}
