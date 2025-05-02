import { firebaseApp } from '@/firebase';
import {
  fetchAndActivate,
  getBoolean,
  getRemoteConfig,
} from 'firebase/remote-config';
import { onMounted, readonly, ref, type Ref } from 'vue';

// Default value used before fetch or if fetch fails
const DEFAULT_ALLOW_ACCOUNT_CREATION = false;

/**
 * Reactive flag indicating if account creation is allowed via Remote Config.
 * Initialized with the default value.
 */
const allowAccountCreation = ref<boolean>(DEFAULT_ALLOW_ACCOUNT_CREATION);

/**
 * Reactive flag indicating if the remote config is currently being fetched.
 */
const isLoading = ref<boolean>(true);

/**
 * Composable hook for fetching and accessing Firebase Remote Config values.
 *
 * Provides reactive state for configuration parameters and loading status.
 * Currently fetches the `allow_account_creation` parameter.
 *
 * @returns An object containing readonly reactive refs:
 *  - `allowAccountCreation`: Boolean flag indicating if account creation is enabled.
 *  - `isLoading`: Boolean flag indicating if the remote config is being fetched.
 */
export function useRemoteConfig(): {
  allowAccountCreation: Readonly<Ref<boolean>>;
  isLoading: Readonly<Ref<boolean>>;
} {
  /**
   * Fetches remote configuration from Firebase, activates it, and updates reactive state.
   * Handles potential errors and ensures loading state is managed.
   */
  const fetchRemoteConfig = async () => {
    isLoading.value = true; // Indicate loading start
    try {
      const remoteConfig = getRemoteConfig(firebaseApp);

      // Set default values in the app (fallback if fetch fails or key missing)
      remoteConfig.defaultConfig = {
        allow_account_creation: DEFAULT_ALLOW_ACCOUNT_CREATION,
      };

      // Configure fetch settings
      // Use 0ms interval in development for immediate updates, longer in production
      remoteConfig.settings.minimumFetchIntervalMillis = import.meta.env.DEV
        ? 0
        : 3600000; // 1 hour (3,600,000 ms)

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
      // Ensure the key 'allow_account_creation' matches the parameter key in Firebase Console
      allowAccountCreation.value = getBoolean(
        remoteConfig,
        'allow_account_creation'
      );
    } catch (error) {
      console.error('Error fetching or activating remote config:', error);
      // Fallback to the hardcoded default value on error
      allowAccountCreation.value = DEFAULT_ALLOW_ACCOUNT_CREATION;
    } finally {
      isLoading.value = false; // Indicate loading finished
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
