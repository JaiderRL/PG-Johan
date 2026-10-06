import { $, escapeHTML, shuffle } from '../utils.js';
import { icon } from '../icons.js';
export function renderChoices(session, question, intro) {
  let answered = false;
  const ordered = shuffle(question.answers.map((answer, index) => ({ answer, index })));
  session.container.innerHTML = `<div class="challenge-layout">${intro}<article class="paper choice-paper"><p class="paper-label">${session.level.category}</p>${question.text ? `<blockquote>${escapeHTML(question.text).replace(/\n/g, '<br>')}</blockquote>` : ''}<h2>${escapeHTML(question.question)}</h2><div class="answers">${ordered.map(({ answer, index }, i) => `<button class="answer" data-answer="${index}"><span class="answer-letter">${'ABCD'[i]}</span><span>${escapeHTML(answer)}</span><span class="answer-status"></span></button>`).join('')}</div><div class="feedback" role="status" aria-live="polite"></div><button class="button primary next-round" hidden>Siguiente</button></article></div>`;
  session.container.querySelectorAll('.answer').forEach(button => button.onclick = () => {
    if (answered || session.run.ended || session.paused || button.disabled) return;
    const success = Number(button.dataset.answer) === question.correct;
    button.classList.add(success ? 'correct' : 'incorrect');
    $('.answer-status', button).innerHTML = icon(success ? 'check' : 'close');
    button.disabled = true;
    session.grade(success, success ? question.explanation : 'Esa opción no encaja. Lee de nuevo y prueba otra respuesta.');
    if (session.run.ended) return;
    session.onAnswer?.(success, question);
    if (success) { answered = true; session.container.querySelectorAll('.answer').forEach(b => b.disabled = true); session.completeRound(); }
  });
}
