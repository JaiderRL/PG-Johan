import { icon } from './icons.js';
import { escapeHTML } from './utils.js';
export function toast(message, type = 'success') {
  const element = document.createElement('div'); element.className = `toast ${type}`;
  element.innerHTML = `${icon(type === 'error' ? 'info' : 'check')}<span>${escapeHTML(message)}</span>`;
  document.getElementById('toasts').append(element);
  setTimeout(() => element.remove(), 4500);
}
export function openModal({ title, content, actions, onCancel }) {
  const modal = document.getElementById('modal');
  if (modal.open) modal.close();
  modal.innerHTML = `<button class="icon-button modal-close" aria-label="Cerrar">${icon('close')}</button><h2 id="modal-title">${title}</h2>${content}<div class="modal-actions">${actions.map((action, i) => `<button class="button ${action.className || 'secondary'}" data-modal-action="${i}">${action.label}</button>`).join('')}</div>`;
  const cancel = () => { modal.close(); onCancel?.(); };
  modal.querySelector('.modal-close').onclick = cancel;
  modal.oncancel = event => { event.preventDefault(); cancel(); };
  modal.querySelectorAll('[data-modal-action]').forEach(button => button.onclick = () => { modal.close(); actions[Number(button.dataset.modalAction)].action?.(); });
  modal.showModal();
}
export function closeModal() { const modal = document.getElementById('modal'); if (modal.open) modal.close(); }
export function feedback(container, success, message, points = 0) {
  container.className = `feedback ${success ? 'positive' : 'negative'}`;
  container.innerHTML = `${icon(success ? 'check' : 'info')}<div><strong>${success ? '¡Bien hecho!' : 'Sigue intentándolo'}</strong><span>${escapeHTML(message)}</span></div>${points ? `<b class="points-pop">+${points}</b>` : ''}`;
}
