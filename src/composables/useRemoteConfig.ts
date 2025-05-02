import { firebaseApp } from '@/firebase';
import {
  fetchAndActivate,
  getBoolean,
  getRemoteConfig,
} from 'firebase/remote-config';
import { onMounted, readonly, ref, type Ref } from 'vue';

// Default value used before fetch or if fetch fails
const DEFAULT_ALLOW_ACCOUNT_CREATION = true;

/**
 * Reactive flag indicating if account creation is allowed via Remote Config.
 */
const allowAccountCreation = ref<boolean>(DEFAULT_ALLOW_ACCOUNT_CREATION);

/**
 * Reactive flag indicating if the remote config is currently being fetched.
 */
const isLoading = ref<boolean>(true);

/**
 * Composable for fetching and accessing Firebase Remote Config values.
 *
 * Provides reactive state for configuration parameters (`allow_account_creation`)
 * and the loading status.
 *
 * @returns An object containing readonly reactive refs:
 *  - `allowAccountCreation`: Whether account creation is enabled.
 *  - `isLoading`: Whether the remote config is currently being fetched.
 */
export function useRemoteConfig(): {
  allowAccountCreation: Readonly<Ref<boolean>>;
  isLoading: Readonly<Ref<boolean>>;
} {
  /**
   * Fetches remote configuration from Firebase, activates it, and updates reactive state.
   */
  const fetchRemoteConfig = async () => {
    isLoading.value = true;
    try {
      const remoteConfig = getRemoteConfig(firebaseApp);

      // Set default values in the app (fallback if fetch fails or key missing)
      remoteConfig.defaultConfig = {
        allow_account_creation: DEFAULT_ALLOW_ACCOUNT_CREATION,
      };

      // Use 0ms interval in development for immediate updates, longer in production
      remoteConfig.settings.minimumFetchIntervalMillis = import.meta.env.DEV
        ? 0
        : 3600000; // 1 hour

      // Fetch and activate the latest configuration from Firebase
      const fetched = await fetchAndActivate(remoteConfig);

      if (fetched) {
        console.log('Remote config fetched and activated successfully.');
      } else {
        console.log(
          'Remote config not fetched; using cached or default values.'
        );
      }

      // Update reactive state with the fetched (or default/cached) value
      allowAccountCreation.value = getBoolean(
        remoteConfig,
        'allow_account_creation'
      );
    } catch (error) {
      console.error('Error fetching or activating remote config:', error);
      // Fallback to the hardcoded default value on error
      allowAccountCreation.value = DEFAULT_ALLOW_ACCOUNT_CREATION;
    } finally {
      isLoading.value = false;
    }
  };

  // Fetch configuration when the composable is mounted
  onMounted(fetchRemoteConfig);

  // Return readonly refs to prevent modification outside this composable
  return {
    allowAccountCreation: readonly(allowAccountCreation),
    isLoading: readonly(isLoading),
  };
}
