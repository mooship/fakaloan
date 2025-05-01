import { ref } from 'vue';

const isLoading = ref(false);

export function useLoading() {
  /**
   * Set loading state globally.
   * @param value boolean
   */
  function setLoading(value: boolean) {
    isLoading.value = value;
  }
  return { isLoading, setLoading };
}
