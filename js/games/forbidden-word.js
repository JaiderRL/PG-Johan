import { forbidden } from '../../data/questions.js';
import { GameState } from '../game-state.js';
import { $, escapeHTML, forbiddenMatches, words } from '../utils.js';
import { icon } from '../icons.js';
import { feedback } from '../ui.js';

export function mount(session) {
  const questions = GameState.draw('forbidden', forbidden, session.run.rounds);
  session.renderRound = () => {
    const question = questions[session.run.index];
    session.container.innerHTML = `
      <div class="challenge-layout">
        <aside class="quest-aside">
          <div class="large-badge">${icon('message')}</div>
          <h2>El poder de explicar</h2>
          <p>Describe el concepto con al menos 12 palabras y 8 palabras distintas. No puedes mencionar el concepto ni sus palabras prohibidas.</p>
          <div class="concept-timer">${icon('clock')}<b>90 segundos por concepto</b></div>
          <p class="aside-note">Comprobamos longitud y palabras restringidas. El significado de tu explicación puedes revisarlo con tu docente.</p>
        </aside>
        <article class="paper forbidden-paper">
          <p class="paper-label">TU PALABRA ES</p>
          <h2 class="forbidden-target">${escapeHTML(question.word)}</h2>
          <div class="forbidden-list">
            <span>No puedes escribir:</span>
            ${question.forbidden.map(word => `<b>${escapeHTML(word)}</b>`).join('')}
          </div>
          <p class="mobile-forbidden-instruction instruction">Explica el concepto con 12 palabras como mínimo y 8 distintas, sin usar el concepto ni las palabras restringidas.</p>
          <label class="input-label" for="description">Escribe tu explicación</label>
          <textarea id="description" rows="5" maxlength="2500" placeholder="Es un lugar, objeto o idea que…"></textarea>
          <div class="text-meta"><span id="description-count">0 palabras</span><span></span></div>
          <div class="feedback" role="status" aria-live="polite"></div>
          <div class="paper-actions">
            <button class="button primary" id="check-description">Comprobar ${icon('check')}</button>
            <button class="button primary next-round" hidden>Siguiente</button>
          </div>
        </article>
      </div>`;

    const textarea = $('#description');
    const restrictionNote = $('.text-meta>span:last-child');
    restrictionNote.textContent = question.variants.length
      ? `También evita: ${question.variants.join(', ')} y plurales.`
      : 'Evita también los plurales de las palabras restringidas.';
    textarea.oninput = () => $('#description-count').textContent = `${words(textarea.value).length} palabras`;
    $('#check-description').onclick = () => {
      if (session.between || session.paused) return;
      const text = textarea.value.trim();
      if (words(text).length < 12 || new Set(words(text.toLowerCase())).size < 8) {
        feedback($('.feedback'), false, 'Desarrolla tu explicación: necesitas 12 palabras y al menos 8 distintas.');
        return;
      }
      const matches = forbiddenMatches(text, question);
      const success = matches.length === 0;
      session.grade(success, success
        ? 'Tu explicación cumple la longitud y evita todas las palabras restringidas. ¡Bien escrito!'
        : `Encontramos: ${matches.join(', ')}. Reformula tu explicación sin esas palabras.`, { noFast: true });
      if (success && !session.run.ended) {
        textarea.disabled = true;
        $('#check-description').hidden = true;
        session.completeRound();
      }
    };
  };
  session.renderRound();
}
