import { sentences } from '../../data/questions.js';
import { GameState } from '../game-state.js';
import { $, escapeHTML, shuffle } from '../utils.js';
import { icon } from '../icons.js';
import { feedback } from '../ui.js';
export function mount(session) {
  const ceiling = GameState.settings.difficulty === 'easy' ? 2 : 3;
  const bank = sentences.filter(q => q.difficulty <= ceiling);
  const questions = GameState.draw(`sentences-${ceiling}`, bank, session.run.rounds).sort((a, b) => a.difficulty - b.difficulty);
  session.renderRound = () => {
    const question = questions[session.run.index], selected = [], shuffled = shuffle(question.tokens.map((text, id) => ({ text, id })));
    session.container.innerHTML = `<article class="paper sentence-paper"><p class="paper-label">EL TALLER DE LAS ORACIONES · DIFICULTAD ${question.difficulty}</p><h2>Todo tiene su lugar</h2><p class="instruction">Toca las palabras en el orden correcto o arrástralas al recuadro. Toca una palabra elegida para devolverla.</p><div class="sentence-art" aria-hidden="true">${icon('puzzle')}<span>Una idea empieza con una palabra.</span>${icon('leaf')}</div><div class="word-bank" aria-label="Palabras disponibles"></div><p class="slot-label">TU ORACIÓN</p><div class="sentence-slots" tabindex="0" aria-label="Oración construida"><span class="slot-placeholder">Empieza por la primera palabra…</span></div><div class="feedback" role="status" aria-live="polite"></div><div class="paper-actions"><button class="button secondary" id="undo-word">${icon('refresh')} Deshacer</button><button class="button primary" id="verify">Verificar ${icon('check')}</button><button class="button primary next-round" hidden>Siguiente</button></div></article>`;
    const draw = () => {
      $('.word-bank').innerHTML = shuffled.map(token => `<button class="word-tile" draggable="true" data-word="${token.id}" ${selected.includes(token.id) ? 'disabled' : ''}>${escapeHTML(token.text)}</button>`).join('');
      $('.sentence-slots').innerHTML = selected.length ? selected.map(id => `<button class="word-tile selected" data-remove="${id}">${escapeHTML(question.tokens[id])}</button>`).join('') : '<span class="slot-placeholder">Empieza por la primera palabra…</span>';
      session.container.querySelectorAll('[data-word]').forEach(button => {
        button.onclick = () => add(Number(button.dataset.word));
        button.ondragstart = event => { event.dataTransfer.setData('text/plain', button.dataset.word); event.dataTransfer.effectAllowed = 'move'; };
      });
      session.container.querySelectorAll('[data-remove]').forEach(button => button.onclick = event => {
        if (session.between || session.paused) return;
        const id = Number(button.dataset.remove);
        selected.splice(selected.indexOf(id), 1); draw();
        if (event.detail === 0) $(`[data-word="${id}"]`).focus({ preventScroll: true });
      });
    };
    const add = id => {
      if (session.between || session.paused || !Number.isInteger(id) || id < 0 || id >= question.tokens.length || selected.includes(id)) return;
      const keyboard = document.activeElement?.matches(`[data-word="${id}"]:focus-visible`);
      selected.push(id); draw();
      if (keyboard) ($('.word-bank .word-tile:not(:disabled)') || $('#verify')).focus({ preventScroll: true });
    };
    $('.sentence-slots').ondragover = event => event.preventDefault();
    $('.sentence-slots').ondrop = event => { event.preventDefault(); const value = event.dataTransfer.getData('text/plain'); if (/^\d+$/.test(value)) add(Number(value)); };
    $('#undo-word').onclick = () => { if (session.between || session.paused) return; selected.pop(); draw(); };
    $('#verify').onclick = () => {
      if (session.between || session.paused) return;
      if (selected.length !== question.tokens.length) { feedback($('.feedback'), false, 'Utiliza todas las palabras antes de verificar.'); return; }
      const constructed = selected.map(id => question.tokens[id]).join(' ');
      const success = constructed === question.answer;
      session.grade(success, success ? 'La oración tiene sentido y su puntuación está en orden.' : `Un orden correcto es: «${question.answer}». Reorganiza las palabras y vuelve a probar.`);
      if (success && !session.run.ended) { $('#verify').hidden = true; $('#undo-word').disabled = true; session.container.querySelectorAll('.word-tile').forEach(b => b.disabled = true); session.completeRound(); }
    };
    draw();
  };
  session.renderRound();
}
