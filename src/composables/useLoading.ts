import { ref } from 'vue';

/**
 * Provides a global loading state for the application.
 * @returns An object with the loading state and a setter function.
 */
export function useLoading() {
  const isLoading = ref(false);
  function setLoading(value: boolean) {
    isLoading.value = value;
  }
  return { isLoading, setLoading };
}
