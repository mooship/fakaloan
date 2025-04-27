import ForgotPasswordView from '@/views/ForgotPasswordView.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { getCurrentUser } from 'vuefire';
import AboutView from '../views/AboutView.vue';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true },
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: { requiresAuth: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresGuest: true },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView,
      meta: { requiresGuest: true },
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
