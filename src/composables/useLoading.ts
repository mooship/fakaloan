/**
 * useLoading composable
 *
 * Provides a global loading state and setter for Fakaloan.
 * Useful for displaying loading overlays or disabling UI during async operations.
 *
 * @module composables/useLoading
 * @returns {Object} - { isLoading: Ref<boolean>, setLoading: (value: boolean) => void }
 */
import { ref } from 'vue';

const isLoading = ref(false);

export function useLoading() {
  /**
   * Set loading state globally.
   * @param {boolean} value - New loading state.
   */
  function setLoading(value: boolean) {
    isLoading.value = value;
  }
  return { isLoading, setLoading };
}
