import { ref } from 'vue';

// Global loading state
const isLoading = ref(false);

/**
 * Provides a global loading state for the application.
 * @returns An object with the loading state and a setter function.
 */
export function useLoading() {
  function setLoading(value: boolean) {
    isLoading.value = value;
  }
  return { isLoading, setLoading };
}
