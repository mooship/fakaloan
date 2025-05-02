import { onMounted, ref } from 'vue';

/**
 * Reactive flag indicating if account creation is allowed.
 * Defaults to true for local development.
 */
const allowAccountCreation = ref(true);

/**
 * Determines if the app is running in a local development environment.
 * @returns {boolean} True if running locally, false otherwise.
 */
function isLocal() {
  return (
    window?.location?.hostname === 'localhost' ||
    window?.location?.hostname === '127.0.0.1' ||
    import.meta.env.VITE_USE_LOCAL_CONFIG === 'true'
  );
}

/**
 * Composable for fetching and exposing remote configuration flags.
 * Sets `allowAccountCreation` based on environment or remote config.
 * @returns {{ allowAccountCreation: Ref<boolean> }} Reactive config state.
 */
export function useRemoteConfig() {
  /**
   * Fetches remote configuration and updates reactive state.
   * In local mode, uses environment variable.
   * In production, simulates a remote fetch and disables account creation.
   */
  const fetchRemoteConfig = async () => {
    if (isLocal()) {
      allowAccountCreation.value =
        import.meta.env.VITE_ALLOW_ACCOUNT_CREATION !== 'false';
    } else {
      await new Promise((resolve) => setTimeout(resolve, 200));
      allowAccountCreation.value = false;
    }
  };

  onMounted(fetchRemoteConfig);

  return { allowAccountCreation };
}
