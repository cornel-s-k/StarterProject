// import HomePage from '../pages/home/home-page';
// import AboutPage from '../pages/about/about-page';
// import AddStoryPage from '../pages/add/add-story-page';
// import LoginPage from '../pages/login/login-page';

// const routes = {
//   '/': HomePage,         // Hapus `new` karena HomePage adalah object, bukan class
//   '/home': HomePage,     // Sama dengan HomePage
//   '/about': AboutPage,
//   '/add': AddStoryPage,
//   '/login': LoginPage,   // Jangan pakai `new` di sini juga
// };

// export default routes;

import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import AddStoryPage from '../pages/add/add-story-page';
import LoginPage from '../pages/login/login-page';

const routes = {
  '/': LoginPage,       // Halaman default sekarang adalah LoginPage
  '/home': HomePage,
  '/about': AboutPage,
  '/add': AddStoryPage,
  '/login': LoginPage,
};

export default routes;
