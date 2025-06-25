import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';

<<<<<<< HEAD
let currentPage = null; // Keep as let, but handle its lifecycle more carefully
=======
let currentPage = null;
>>>>>>> 668ba7c5796b75f172d68a25a0c8b7daf5dbb4d9

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
<<<<<<< HEAD
    const PageClass = routes[url]; // Rename 'page' to 'PageClass' for clarity that it's a constructor

    if (!PageClass) { // Check if the class itself is defined
      this.#content.innerHTML = '<h1>Page not found</h1>';
      console.error(`Route "${url}" not found.`);
      return;
    }

    try {
      // Destroy the previous page instance if it exists and has a destroy method
      if (currentPage && typeof currentPage.destroy === 'function') {
        currentPage.destroy();
        currentPage = null; // Clear currentPage after destruction
      }

      // Instantiate the new page
      const newPageInstance = new PageClass();

      if (document.startViewTransition) {
        document.startViewTransition(async () => {
          this.#content.innerHTML = await newPageInstance.render();
          await newPageInstance.afterRender();
          currentPage = newPageInstance; // Assign only after successful rendering
        });
      } else {
        // For browsers without View Transitions
        this.#content.classList.remove('fade-in');
        this.#content.innerHTML = await newPageInstance.render();
        await newPageInstance.afterRender();
        void this.#content.offsetWidth; // Trigger reflow *before* adding class
        this.#content.classList.add('fade-in');
        currentPage = newPageInstance; // Assign only after successful rendering
      }
    } catch (error) {
      console.error('Error rendering page:', error);
      this.#content.innerHTML = '<h1>Error loading page.</h1><p>' + error.message + '</p>';
      currentPage = null; // Ensure currentPage is cleared on error
=======
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
>>>>>>> 668ba7c5796b75f172d68a25a0c8b7daf5dbb4d9
    }
  }
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> 668ba7c5796b75f172d68a25a0c8b7daf5dbb4d9
