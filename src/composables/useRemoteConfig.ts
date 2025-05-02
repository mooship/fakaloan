import { onMounted, ref } from 'vue';

const allowAccountCreation = ref(true);

function isLocal() {
  // Check for localhost or VITE_USE_LOCAL_CONFIG (optional)
  return (
    window?.location?.hostname === 'localhost' ||
    window?.location?.hostname === '127.0.0.1' ||
    import.meta.env.VITE_USE_LOCAL_CONFIG === 'true'
  );
}

export function useRemoteConfig() {
  const fetchRemoteConfig = async () => {
    if (isLocal()) {
      // Read from .env for local development
      allowAccountCreation.value =
        import.meta.env.VITE_ALLOW_ACCOUNT_CREATION !== 'false';
    } else {
      // Fetch from remote config (simulate or replace with real fetch)
      await new Promise((resolve) => setTimeout(resolve, 200));
      allowAccountCreation.value = false; // default for production/remote
    }
  };

  onMounted(fetchRemoteConfig);

  return { allowAccountCreation };
}
