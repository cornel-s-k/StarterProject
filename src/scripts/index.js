// CSS imports
import '../styles/styles.css';
import { getLogout } from './utils/auth';
import Camera from './utils/cam';
import App from './pages/app';
import { registerServiceWorker } from './utils/index';

document.addEventListener('DOMContentLoaded', async () => {
  toggleNavbarVisibility();
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  await app.renderPage();

  await registerServiceWorker();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });

  window.addEventListener('hashchange', async () => {
    toggleNavbarVisibility();
    if (location.hash === '#/logout') {
      const confirmLogout = confirm('Apakah kamu yakin ingin keluar?');

      if (confirmLogout) {
        getLogout();
        window.location.hash = '/login';
      } else {
        window.history.back();
      }
    }
   
    // Stop all active media
    Camera.stopAllStreams();
  });

  const mainContent = document.querySelector('#main-content');
  const skipLink = document.querySelector('.skip-to-content');

  skipLink.addEventListener('click', function (event) {
    event.preventDefault(); // Mencegah refresh halaman
    skipLink.blur(); // Menghilangkan fokus skip to content
    mainContent.focus(); // Fokus ke konten utama
    mainContent.scrollIntoView(); // Halaman scroll ke konten utama
  });
});

function toggleNavbarVisibility() {
  const navbar = document.querySelector('.main-header');
  if (!navbar) return;

  // Mengecek jika hash berada di halaman login atau register
  if (location.hash === '#/login' || location.hash === '#/register') {
    navbar.style.display = 'none'; // Menyembunyikan navbar
  } else {
    navbar.style.display = 'flex'; // Menampilkan navbar (menggunakan flex untuk layout)
  }
}