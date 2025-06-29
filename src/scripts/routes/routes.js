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
import NewPage from '../pages/story-detail/story-detail-page';
import LoginPage from '../pages/auth/login/login-page';
import RegisterPage from '../pages/auth/register/register-page';
import DetailPage from '../pages/report/detail-page';
import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from '../utils/auth';
import BookmarkPage from '../pages/bookmark/bookmark-page';


const routes = {
  '/login':  checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': checkUnauthenticatedRouteOnly(new RegisterPage()),
  
  '/': checkAuthenticatedRoute(new HomePage()),
  '/tambah': checkAuthenticatedRoute(new NewPage()),
  '/stories/:id': checkAuthenticatedRoute(new DetailPage()), 
  '/bookmark': checkAuthenticatedRoute(new BookmarkPage()),
};

export default routes;



