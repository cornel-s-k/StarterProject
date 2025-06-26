// CSS imports
import '../styles/styles.css';
import '../styles/login.css';
import App from './pages/app';
import CONFIG from './config'; // Import CONFIG for VAPID key

console.log('App initialized');
console.log('Rendering page...');
console.log('Hash changed, re-rendering page...');

const subscribePushNotification = async () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();

      if (existingSubscription) {
        console.log('Existing push subscription found:', existingSubscription);
        return;
      }

      const applicationServerKey = urlBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY);
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey,
      };

      const pushSubscription = await registration.pushManager.subscribe(subscribeOptions);
      console.log('Push subscription successful:', pushSubscription);

      // Send subscription to your server if needed (not implemented in this starter)
      // fetch('/subscribe', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(pushSubscription),
      // });

    } catch (error) {
      console.error('Push subscription failed:', error);
    }
  }
};

// Utility function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}


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

  // Request notification permission and subscribe to push
  if ('Notification' in window && 'serviceWorker' in navigator) {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          subscribePushNotification();
        } else {
          console.warn('Notification permission denied.');
        }
      });
    } else if (Notification.permission === 'granted') {
      subscribePushNotification();
    }
  }
});
