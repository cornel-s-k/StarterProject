import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';

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
    const page = routes[url];
  
    if (!page) {
      this.#content.innerHTML = '<h1>Page not found</h1>';
      return;
    }
  
    if (currentPage && typeof currentPage.destroy === 'function') {
      currentPage.destroy();
    }
  
    currentPage = new page();
  
    if (document.startViewTransition) {
      document.startViewTransition(async () => {
        this.#content.innerHTML = await currentPage.render();
        await currentPage.afterRender();
      });
    } else {
      this.#content.classList.remove('fade-in');
      this.#content.innerHTML = await currentPage.render();
      await currentPage.afterRender();
      void this.#content.offsetWidth;
      this.#content.classList.add('fade-in');
    }
  }
}

export default App;
