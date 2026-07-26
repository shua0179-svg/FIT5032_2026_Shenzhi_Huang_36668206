import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import FirebaseLogoutView from '../views/FirebaseLogoutView.vue'
import AddBookView from '../views/AddBookView.vue'
import { isAuthenticated } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
