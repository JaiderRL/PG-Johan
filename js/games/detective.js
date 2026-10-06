import { detective } from '../../data/questions.js';
import { GameState } from '../game-state.js';
import { $, escapeHTML } from '../utils.js';
import { icon } from '../icons.js';
import { feedback } from '../ui.js';

export function parseText(text) {
  const tokens = []; let cursor = 0;
  for (const match of text.matchAll(/\[\[([^|]+)\|([^|]+)\|([^\]]+)\]\]/g)) {
    const before = text.slice(cursor, match.index).match(/\S+|\s+/g) || [];
    tokens.push(...before.map(text => ({ text, error: false })));
    tokens.push({ text: match[1], correction: match[2], explanation: match[3], error: true });
    cursor = match.index + match[0].length;
  }
  tokens.push(...(text.slice(cursor).match(/\S+|\s+/g) || []).map(text => ({ text, error: false })));
  // Keep punctuation attached to its word so it cannot wrap onto its own line.
  for (let i = 0; i < tokens.length - 1; i++) {
    if (tokens[i].error && /^[.,;:!?]+$/.test(tokens[i + 1].text)) {
      tokens[i].text += tokens[i + 1].text;
      tokens[i].correction += tokens[i + 1].text;
      tokens.splice(i + 1, 1);
    }
  }
  return tokens;
}
export function mount(session) {
  const exercises = GameState.draw('detective', detective, session.run.rounds);
  session.renderRound = () => {
    const exercise = exercises[session.run.index], tokens = parseText(exercise.text);
    const total = tokens.filter(token => token.error).length; let found = 0;
    session.container.innerHTML = `<div class="challenge-layout"><aside class="quest-aside"><div class="large-badge">${icon('search')}</div><h2>El ojo de Lía</h2><p>Alguien ha alterado estos manuscritos. ¡Ayúdanos a repararlos!</p><div class="clue-counter"><b id="found-errors">0</b><span>de ${total} errores encontrados</span></div><img class="lia-portrait float" src="assets/images/characters/lia.svg" alt="Lía, la exploradora del reino"></aside><article class="paper"><p class="paper-label">MANUSCRITO ${session.run.index + 1}</p><h2>${escapeHTML(exercise.title)}</h2><p class="instruction">Toca las palabras con errores de ortografía, tildes, mayúsculas o puntuación.</p><div class="detective-text">${tokens.map((token, i) => /^\s+$/.test(token.text) ? token.text : `<button class="word-detect" data-token="${i}">${escapeHTML(token.text)}</button>`).join('')}</div><div class="feedback" role="status" aria-live="polite"></div><div class="paper-actions"><button class="button secondary" id="review">${icon('search')} Revisar</button><button class="button primary next-round" hidden>Siguiente</button></div></article></div>`;
    const mobileCounter = document.createElement('div');
    mobileCounter.className = 'mobile-detective-count';
    mobileCounter.innerHTML = `Errores encontrados: <b id="mobile-found-errors">0</b> / ${total}`;
    $('.instruction', session.container).after(mobileCounter);
    session.container.querySelectorAll('.word-detect').forEach(button => button.onclick = () => {
      if (session.between || session.paused || session.run.ended || button.disabled) return;
      const token = tokens[Number(button.dataset.token)]; button.disabled = true;
      button.classList.add(token.error ? 'fixed' : 'wrong-word');
      session.grade(token.error, token.error ? `${token.text} → ${token.correction}. ${token.explanation}` : `«${token.text}» ya está bien escrito. Busca otra palabra.`, { detective: true });
      if (session.run.ended) return;
      if (token.error) { button.textContent = token.correction; found++; $('#found-errors').textContent = found; $('#mobile-found-errors').textContent = found; }
      if (found === total) { session.between = true; session.updateHUD(); $('#review').classList.replace('secondary', 'primary'); }
    });
    $('#review').onclick = () => {
      if (found < total) { feedback($('.feedback', session.container), false, `Has encontrado ${found} de ${total} errores. Revisa el texto con atención; esta revisión no cuesta vidas.`); return; }
      feedback($('.feedback', session.container), true, '¡Manuscrito restaurado! Todas las correcciones están en verde.');
      $('#review').disabled = true; session.completeRound();
    };
  };
  session.renderRound();
}
