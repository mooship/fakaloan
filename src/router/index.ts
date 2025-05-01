import { createRouter, createWebHistory } from 'vue-router';
import { getCurrentUser } from 'vuefire';

/**
 * Vue Router instance for the application.
 *
 * Handles authentication and guest route guards using navigation guards.
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPasswordView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/add-customer',
      name: 'add-customer',
      component: () => import('../views/AddCustomerView.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

/**
 * Global navigation guard for authentication and guest-only routes.
 * Redirects to login if authentication is required and user is not logged in.
 * Redirects to home if guest-only route is accessed by an authenticated user.
 */
router.beforeEach(async (to, from, next) => {
  const currentUser = await getCurrentUser();
  if (to.meta.requiresAuth && !currentUser) {
    next({ name: 'login' });
  } else if (to.meta.requiresGuest && currentUser) {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;
