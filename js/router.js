const routes = new Map();
let cleanup = null;
export function register(name, render) { routes.set(name, render); }
export function navigate(path) { if (location.hash === `#/${path}`) render(); else location.hash = `/${path}`; }
function render() {
  cleanup?.(); cleanup = null;
  const modal = document.getElementById('modal');
  if (modal?.open) modal.close();
  const [route = 'home', parameter] = location.hash.replace(/^#\/?/, '').split('/');
  const renderPage = routes.get(route || 'home') || routes.get('home');
  document.body.dataset.route = route || 'home';
  cleanup = renderPage(parameter) || null;
  const main = document.querySelector('main');
  main.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
}
export function startRouter() { window.addEventListener('hashchange', render); render(); }
