// src/scripts/pages/app.js
import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { isTokenExpired } from '../utils/token'; // <-- Import isTokenExpired

let currentPage = null;

class App {
  #content;
  #drawerButton;
  #navigationDrawer;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }
    });

    this.#navigationDrawer.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (link) {
        this.#navigationDrawer.classList.remove('open');
      }
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    let targetUrl = url; // <-- Deklarasikan targetUrl di sini
    let PageClass;      // <-- Deklarasikan PageClass dengan 'let' di sini

    // <-- Logika untuk rute yang membutuhkan autentikasi
    const authRequiredRoutes = ['/add', '/home']; // Tambahkan rute lain yang memerlukan login di sini

    if (authRequiredRoutes.includes(url)) {
      const token = localStorage.getItem('token');
      if (!token || isTokenExpired(token)) {
        alert('Anda harus login untuk mengakses halaman ini.');
        targetUrl = '/login'; // <-- Sekarang targetUrl sudah dideklarasikan
        location.hash = '#/login'; // Ini akan memicu renderPage lagi untuk '/login'
      }
    }
    // -- Akhir logika autentikasi --

    // Tetapkan PageClass setelah potensi pengalihan targetUrl
    PageClass = routes[targetUrl]; // <-- Gunakan PageClass yang sudah dideklarasikan

    if (!PageClass) {
      this.#content.innerHTML = '<h1>Page not found</h1>';
      console.error(`Route "${targetUrl}" not found.`);
      return;
    }

    try {
      if (currentPage && typeof currentPage.destroy === 'function') {
        currentPage.destroy();
        currentPage = null;
      }

      const newPageInstance = new PageClass();

      if (document.startViewTransition) {
        document.startViewTransition(async () => {
          this.#content.innerHTML = await newPageInstance.render();
          await newPageInstance.afterRender();
          currentPage = newPageInstance;
        });
      } else {
        this.#content.classList.remove('fade-in');
        this.#content.innerHTML = await newPageInstance.render();
        await newPageInstance.afterRender();
        void this.#content.offsetWidth;
        this.#content.classList.add('fade-in');
        currentPage = newPageInstance;
      }
    } catch (error) {
      console.error('Error rendering page:', error);
      this.#content.innerHTML = '<h1>Error loading page.</h1><p>' + error.message + '</p>';
      currentPage = null;
    }
  }
}

export default App;