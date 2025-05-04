import { firebaseApp } from '@/firebase';
import {
  fetchAndActivate,
  getBoolean,
  getRemoteConfig,
} from 'firebase/remote-config';
import { onMounted, readonly, ref, type Ref } from 'vue';

const DEFAULT_ALLOW_ACCOUNT_CREATION = true;

const allowAccountCreation = ref<boolean>(DEFAULT_ALLOW_ACCOUNT_CREATION);

const isLoading = ref<boolean>(true);

/**
 * Provides access to remote config values (e.g., allowAccountCreation) and loading state.
 * Fetches and activates remote config on mount.
 * @returns An object with allowAccountCreation and isLoading refs.
 */
export function useRemoteConfig(): {
  allowAccountCreation: Readonly<Ref<boolean>>;
  isLoading: Readonly<Ref<boolean>>;
} {
  const fetchRemoteConfig = async () => {
    isLoading.value = true;
    try {
      const remoteConfig = getRemoteConfig(firebaseApp);

      remoteConfig.defaultConfig = {
        allow_account_creation: DEFAULT_ALLOW_ACCOUNT_CREATION,
      };

      remoteConfig.settings.minimumFetchIntervalMillis = import.meta.env.DEV
        ? 0
        : 3600000;

      const fetched = await fetchAndActivate(remoteConfig);

      if (fetched) {
        console.log('Remote config fetched and activated successfully.');
      } else {
        console.log(
          'Remote config not fetched; using cached or default values.'
        );
      }

      allowAccountCreation.value = getBoolean(
        remoteConfig,
        'allow_account_creation'
      );
    } catch (error) {
      console.error('Error fetching or activating remote config:', error);
      allowAccountCreation.value = DEFAULT_ALLOW_ACCOUNT_CREATION;
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(fetchRemoteConfig);

  return {
    allowAccountCreation: readonly(allowAccountCreation),
    isLoading: readonly(isLoading),
  };
}
