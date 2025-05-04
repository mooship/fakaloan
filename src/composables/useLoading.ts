import { ref } from 'vue';

const isLoading = ref(false);

export function useLoading() {
  function setLoading(value: boolean) {
    isLoading.value = value;
  }
  return { isLoading, setLoading };
}
