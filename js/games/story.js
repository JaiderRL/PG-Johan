import { storyElements } from '../../data/questions.js';
import { GameState } from '../game-state.js';
import { $, escapeHTML, words, evaluateStory } from '../utils.js';
import { icon } from '../icons.js';
import { feedback, toast, openModal } from '../ui.js';
import { checkAchievements } from '../achievements.js';

export const randomPrompt = () => Object.fromEntries(Object.entries(storyElements).map(([key, list]) => [key, list[Math.floor(Math.random() * list.length)]]));
const newDraft = () => ({ id: globalThis.crypto?.randomUUID?.() || `story-${Date.now()}`, prompt: randomPrompt(), text: '', date: new Date().toISOString() });
export function mount(session) {
  let draft = GameState.progress.draft || newDraft();
  const persist = () => { GameState.progress.draft = { ...draft }; return GameState.persist(); };
  session.cleanupGame = persist;
  session.renderRound = () => {
    const categories = { character: ['Personaje', 'user'], place: ['Lugar', 'mountain'], conflict: ['Conflicto', 'bolt'], object: ['Objeto', 'key'] };
    session.container.innerHTML = `<article class="paper story-paper"><div class="story-heading"><div><p class="paper-label">EL ESCRITOR ERES TÚ</p><h2>Una historia por descubrir</h2></div><button class="button secondary small" id="new-story">${icon('refresh')} Nueva historia</button></div><p class="instruction">Escribe al menos 60 palabras e incluye estos cuatro elementos. Dale un comienzo, un nudo y un desenlace.</p><div class="story-prompts">${Object.entries(draft.prompt).map(([key, item]) => `<div class="story-prompt">${icon(categories[key][1])}<span>${categories[key][0]}</span><strong>${escapeHTML(item.label)}</strong></div>`).join('')}</div><label class="sr-only" for="story-text">Escribe tu historia</label><textarea id="story-text" rows="8" maxlength="18000" placeholder="Todo comenzó cuando…">${escapeHTML(draft.text)}</textarea><div class="text-meta"><span id="word-count">${words(draft.text).length} / 60 palabras</span><span id="save-status">Borrador guardado en este dispositivo</span></div><div class="story-evaluation" id="story-evaluation" aria-live="polite"></div><div class="feedback" role="status" aria-live="polite"></div><div class="paper-actions"><button class="button secondary" id="save-story">${icon('save')} Guardar historia</button><button class="button primary" id="evaluate-story">Evaluar y completar ${icon('arrow')}</button><button class="button primary next-round" hidden>Ver resultado</button></div><details class="saved-stories"><summary>${icon('book')} Mis historias guardadas <span>${GameState.progress.stories.length}</span></summary><div id="saved-stories-list"></div></details><p class="evaluation-note">Evaluación orientativa por reglas: extensión, palabras clave, mayúscula inicial y puntuación. No evalúa la calidad literaria ni utiliza inteligencia artificial.</p></article>`;
    const textarea = $('#story-text');
    const savedList = () => {
      $('#saved-stories-list').innerHTML = GameState.progress.stories.length ? GameState.progress.stories.slice().reverse().map(story => `<button class="saved-story" data-story="${escapeHTML(story.id)}"><b>${escapeHTML(story.prompt.character.label)} · ${escapeHTML(story.prompt.place.label)}</b><span>${words(story.text).length} palabras · ${new Date(story.date).toLocaleDateString('es-CO')}</span></button>`).join('') : '<p>Tus historias aparecerán aquí al guardarlas.</p>';
      session.container.querySelectorAll('[data-story]').forEach(button => button.onclick = () => {
        const story = GameState.progress.stories.find(s => s.id === button.dataset.story);
        openModal({ title: 'Tu historia', content: `<p class="story-reader">${escapeHTML(story.text).replace(/\n/g, '<br>')}</p>`, actions: [{ label: 'Cerrar', className: 'primary' }] });
      });
    };
    textarea.oninput = () => { draft.text = textarea.value; draft.date = new Date().toISOString(); $('#word-count').textContent = `${words(draft.text).length} / 60 palabras`; $('#save-status').textContent = persist() ? 'Borrador guardado en este dispositivo' : 'No se pudo guardar. Copia tu texto antes de salir.'; };
    const saveStory = () => {
      draft.text = textarea.value;
      if (!draft.text.trim()) { feedback($('.feedback'), false, 'Escribe unas líneas antes de guardar tu historia.'); return false; }
      const existing = GameState.progress.stories.findIndex(s => s.id === draft.id);
      const wasCounted = existing >= 0 && GameState.progress.stories[existing].counted;
      draft.counted = wasCounted || words(draft.text).length >= 60;
      if (!wasCounted && draft.counted) GameState.progress.stats.stories++;
      if (existing >= 0) GameState.progress.stories[existing] = { ...draft }; else GameState.progress.stories.push({ ...draft });
      GameState.progress.stories = GameState.progress.stories.slice(-30);
      const saved = persist(); savedList(); $('.saved-stories summary span').textContent = GameState.progress.stories.length;
      checkAchievements().forEach(a => toast(`Logro desbloqueado: ${a.name}`));
      return saved;
    };
    $('#save-story').onclick = () => { if (saveStory()) toast('Tu historia está guardada. ¡Sigue creando!'); };
    $('#new-story').onclick = () => {
      if (session.between) return;
      const create = () => { draft = newDraft(); persist(); session.renderRound(); };
      if (!textarea.value.trim()) { create(); return; }
      openModal({ title: 'Una nueva página', content: '<p>Guardaremos tu relato actual en «Mis historias» antes de generar cuatro elementos nuevos.</p>', actions: [{ label: 'Guardar y crear otra', className: 'primary', action: () => { if (saveStory()) create(); } }, { label: 'Seguir escribiendo' }] });
    };
    $('#evaluate-story').onclick = () => {
      if (session.between || session.paused) return;
      const checks = evaluateStory(textarea.value, draft.prompt), passed = checks.filter(c => c.pass).length;
      $('#story-evaluation').innerHTML = checks.map(c => `<span class="criterion ${c.pass ? 'passed' : ''}">${icon(c.pass ? 'check' : 'info')}${escapeHTML(c.label)}</span>`).join('');
      if (!checks[0].pass || passed < 5) { feedback($('.feedback'), false, 'Aún puedes enriquecer tu relato: necesitas 60 palabras y al menos 5 de los 7 criterios. Tu borrador está conservado.'); return; }
      saveStory(); session.accuracyOverride = passed / checks.length;
      session.grade(true, `Has cumplido ${passed} de 7 criterios. ¡Tu historia ya forma parte del reino!`, { noFast: true });
      if (!session.run.ended) { textarea.disabled = true; $('#evaluate-story').hidden = true; $('#new-story').disabled = true; session.completeRound(); }
    };
    savedList();
    if (!persist()) $('#save-status').textContent = 'No se pudo guardar. Copia tu texto antes de salir.';
  };
  session.renderRound();
}
