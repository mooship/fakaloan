import { createRouter, createWebHistory } from 'vue-router';
import { getCurrentUser } from 'vuefire';

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
  ],
});

router.beforeEach(async (to, from, next) => {
  const currentUser = await getCurrentUser();

  if (to.meta.requiresAuth && !currentUser) {
    console.log(
      'Guard: Route requires auth, user not logged in. Redirecting to /login.'
    );
    next({ name: 'login' });
  } else if (to.meta.requiresGuest && currentUser) {
    console.log(
      'Guard: Route is guest-only, user logged in. Redirecting to /.'
    );
    next({ name: 'home' });
  } else {
    console.log('Guard: Allowing navigation to', to.path);
    next();
  }
});

export default router;
