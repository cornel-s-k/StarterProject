// CSS imports
import '../styles/styles.css';
import '../styles/login.css';console.log('App initialized');
console.log('Rendering page...');
console.log('Hash changed, re-rendering page...');
import App from './pages/app';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});
