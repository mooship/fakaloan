/**
 * Utility for navigation: go back if possible, otherwise go home.
 */
import type { Router } from 'vue-router';

/**
 * Navigates back if possible, otherwise goes to home page.
 *
 * @param router - Vue Router instance.
 */
export function goBackOrHome(router: Router) {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
}
