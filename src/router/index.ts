import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import FirebaseLogoutView from '../views/FirebaseLogoutView.vue'
import AddBookView from '../views/AddBookView.vue'
import { firebaseAuthReady, firebaseUser, isAuthenticated } from '../stores/auth'
import GetBookCountView from '../views/GetBookCountView.vue'
import CountBookAPI from '../views/CountBookAPI.vue'
import GetAllBookAPI from '../views/GetAllBookAPI.vue'
import WeatherView from '../views/WeatherView.vue'
const router = createRouter({
  // Hash routing prevents a direct GitHub Pages visit from returning a 404,
  // while Cloudflare keeps the normal history-based URLs.
  history:
    import.meta.env.BASE_URL === '/FIT5032_2026_Shenzhi_Huang_36668206/'
      ? createWebHashHistory(import.meta.env.BASE_URL)
      : createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/book-counter',
      name: 'book-counter',
      component: GetBookCountView,
    },
    {
      path: '/CountBookAPI',
      name: 'CountBookAPI',
      component: CountBookAPI,
    },
    {
      path: '/GetAllBookAPI',
      name: 'GetAllBookAPI',
      component: GetAllBookAPI,
    },
    {
      path: '/weather',
      name: 'weather',
      component: WeatherView,
    },
    {
      path: '/access-denied',
      name: 'access-denied',
      component: () => import('../views/AccessDeniedView.vue'),
    },
    {
      path: '/FireRegister',
      name: 'FireRegister',
      component: FirebaseRegisterView,
    },
    {
      path: '/FirebaseSignin',
      name: 'FirebaseSignin',
      component: FirebaseSigninView,
    },
    {
      path: '/FirebaseLogout',
      name: 'FirebaseLogout',
      component: FirebaseLogoutView,
    },
    {
      path: '/addbook',
      name: 'addbook',
      component: AddBookView,
      meta: { requiresFirebaseUser: true },
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('../views/MyLibraryView.vue'),
      meta: { requiresFirebaseUser: true },
    },
    {
      path: '/reading-records',
      name: 'reading-records',
      component: () => import('../views/ReadingRecordsView.vue'),
      meta: { requiresFirebaseUser: true },
    },
    {
      path: '/map-explorer',
      name: 'map-explorer',
      component: () => import('../views/MapExplorerView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      // This route requires the user to be authenticated
      meta: { requiresAuth: true },
    },
  ],
})

// Global navigation guard - the core of secure routing.
// If an unauthenticated user tries to open a protected route,
// redirect them to the login page.
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresFirebaseUser) {
    await firebaseAuthReady
    if (!firebaseUser.value) {
      next({ name: 'FirebaseSignin', query: { redirect: to.fullPath } })
      return
    }
  }

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
