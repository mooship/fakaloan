import type { Router } from 'vue-router';

export function goBackOrHome(router: Router) {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
}
