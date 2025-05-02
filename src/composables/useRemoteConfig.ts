import { firebaseApp } from '@/firebase';
import {
  fetchAndActivate,
  getBoolean,
  getRemoteConfig,
} from 'firebase/remote-config';
import { onMounted, ref } from 'vue';

// Default value (used before fetch or if fetch fails)
const DEFAULT_ALLOW_ACCOUNT_CREATION = true;

/**
 * Reactive flag indicating if account creation is allowed.
 * Initialized with the default value.
 */
const allowAccountCreation = ref(DEFAULT_ALLOW_ACCOUNT_CREATION);

/**
 * Composable for fetching and exposing remote configuration flags.
 * Sets `allowAccountCreation` based on Firebase Remote Config.
 * @returns {{ allowAccountCreation: Ref<boolean> }} Reactive config state.
 */
export function useRemoteConfig() {
  /**
   * Fetches remote configuration and updates reactive state.
   */
  const fetchRemoteConfig = async () => {
    try {
      const remoteConfig = getRemoteConfig(firebaseApp);

      // Set default values in the app
      // Keys should match those defined in the Firebase console
      remoteConfig.defaultConfig = {
        allow_account_creation: DEFAULT_ALLOW_ACCOUNT_CREATION,
      };

      // Set fetch settings (optional)
      // Use 0 for development to bypass caching, longer interval for production
      remoteConfig.settings.minimumFetchIntervalMillis = import.meta.env.DEV
        ? 0
        : 3600000; // 0ms (dev) or 1 hour (prod)

      // Fetch and activate the configuration
      const fetched = await fetchAndActivate(remoteConfig);

      if (fetched) {
        console.log('Remote config fetched and activated.');
      } else {
        console.log(
          'Remote config not fetched (using defaults or cached values).'
        );
      }

      // Get the value after fetching (or use cached/default if not fetched)
      // Ensure the key 'allow_account_creation' matches your Firebase console parameter key
      allowAccountCreation.value = getBoolean(
        remoteConfig,
        'allow_account_creation'
      );
    } catch (error) {
      console.error('Error fetching or activating remote config:', error);
      // Fallback to default value on error
      allowAccountCreation.value = DEFAULT_ALLOW_ACCOUNT_CREATION;
    }
  };

  onMounted(fetchRemoteConfig);

  return { allowAccountCreation };
}
