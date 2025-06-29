import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import "../../styles/styles.css";
import { isServiceWorkerAvailable } from "../utils/index";
import { subscribe, unsubscribe } from '../utils/notification-helper';
import LoginPage from "./auth/login/login-page";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content, routes }) {
    // this.routes = {
    //   '/login': new LoginPage(),}
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

 
async #setupPushNotification() {
  const pushNotificationTools = document.getElementById("push-notification-tools");
  if (!pushNotificationTools) return;

  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return;

  const getCurrentSubscription = async () => {
    return await registration.pushManager.getSubscription();
  };

  const renderButton = async () => {
    const subscription = await getCurrentSubscription();
    pushNotificationTools.innerHTML = `
      <button id="subscribe-button" class="btn">
        ${subscription ? 'Unsubscribe' : 'Subscribe'}
      </button>
    `;

    const subscribeButton = document.getElementById("subscribe-button");
    if (!subscribeButton) return;

    subscribeButton.addEventListener("click", async () => {
      const currentSub = await getCurrentSubscription();

      if (currentSub) {
        await unsubscribe(); // panggil fungsi helper, bukan unsubscribe manual
      } else {
        await subscribe();
      }

      // Render ulang tombol berdasarkan status terbaru
      await renderButton();
    });
  };

  // Panggil render pertama kali
  await renderButton();
}




  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    const loadContent = async () => {
      this.#content.innerHTML = await page.render();

      void this.#content.offsetWidth;

      this.#content.innerHTML = await page.render();

      if (typeof page.afterRender === "function") {
        await page.afterRender();

        if (isServiceWorkerAvailable()) {
          this.#setupPushNotification();
        }
      }
    };

    if (document.startViewTransition) {
      document.startViewTransition(loadContent);
    } else {
      await loadContent();
    }
  }
}

export default App;
