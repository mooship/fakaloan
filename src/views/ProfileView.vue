<script setup lang="ts">
import FabSpeedDial from '@/components/FabSpeedDial.vue';
import { useAuth } from '@/composables/useAuth';
import { useLoading } from '@/composables/useLoading';
import { useTheme } from '@/composables/useTheme';
import {
  DISPLAY_PHONE_NUMBER_REGEX,
  GROUP_3_4_REGEX,
  PHONE_NUMBER_REGEX,
  WHITESPACE_REGEX,
} from '@/constants/regex.constants';
import { ToastMessages } from '@/constants/toastMessages.constants';
import { LanguageCode, SubscriptionStatus } from '@/enums/user.enums';
import { db } from '@/firebase';
import AppLayout from '@/layouts/AppLayout.vue';
import { goBackOrHome } from '@/utilities/navigationUtils';
import { useConfirmDialog, useTitle } from '@vueuse/core';
import { updateEmail } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

useTitle('Profile | Fakaloan');
const {
  currentUser,
  userProfile,
  isLoading: authLoading,
  updatePassword,
  error: authError,
} = useAuth();
const router = useRouter();
const toast = useToast();

const isEditingContact = ref(false);
const isEditingEmail = ref(false);
const isEditingPassword = ref(false);
const isUpdating = ref(false);

const cellphoneInput = ref(userProfile.value?.cellphone || '');
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const newEmail = ref(userProfile.value?.email || '');

const { colorMode, isDark, toggleTheme } = useTheme();
const { setLoading } = useLoading();

const { isRevealed, reveal, confirm, cancel } = useConfirmDialog();

const isPremium = computed(() => userProfile.value?.isPremium || false);
const subscriptionStatus = computed(
  () => userProfile.value?.subscriptionStatus || null
);
const hasActiveSubscription = computed(() =>
  [SubscriptionStatus.Active, SubscriptionStatus.Trialing].includes(
    subscriptionStatus.value as SubscriptionStatus
  )
);

const displayLanguage = computed(() => {
  const lang = userProfile.value?.preferences.preferredLanguage;
  switch (lang) {
    case LanguageCode.English:
      return 'English';
    case LanguageCode.Zulu:
      return 'Zulu';
    case LanguageCode.Xhosa:
      return 'Xhosa';
    default:
      return lang || 'Not set';
  }
});

function formatPhoneNumber(phone: string | null): string {
  if (!phone) {
    return '';
  }

  const digits = phone.replace(WHITESPACE_REGEX, '');
  const match = digits.match(DISPLAY_PHONE_NUMBER_REGEX);

  if (match) {
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`.trim();
  }

  return digits.replace(GROUP_3_4_REGEX, '$1 ').trim();
}

const updateCellphone = async (): Promise<void> => {
  if (!currentUser.value || !userProfile.value) {
    return;
  }

  const trimmedCellphone = cellphoneInput.value.replace(WHITESPACE_REGEX, '');
  if (!PHONE_NUMBER_REGEX.test(trimmedCellphone)) {
    toast.error(ToastMessages.ValidationError);
    return;
  }

  setLoading(true);
  try {
    isUpdating.value = true;
    const userDocRef = doc(db, 'users', currentUser.value.uid);
    await updateDoc(userDocRef, {
      cellphone: trimmedCellphone,
    });
    cellphoneInput.value = trimmedCellphone;
    isEditingContact.value = false;
    toast.success(ToastMessages.ProfileUpdateSuccess);
  } catch (error) {
    console.error('Failed to update phone number:', error);
    toast.error(ToastMessages.ProfileUpdateFailed);
  } finally {
    isUpdating.value = false;
    setLoading(false);
  }
};

const updateUserEmail = async (): Promise<void> => {
  if (!currentUser.value) {
    return;
  }
  setLoading(true);
  try {
    isUpdating.value = true;
    await updateEmail(currentUser.value, newEmail.value);
    const userDocRef = doc(db, 'users', currentUser.value.uid);
    await updateDoc(userDocRef, {
      email: newEmail.value,
    });
    isEditingEmail.value = false;
    toast.success(ToastMessages.ProfileUpdateSuccess);
  } catch (error) {
    console.error('Failed to update email:', error);
    toast.error(ToastMessages.ProfileUpdateFailed);
  } finally {
    isUpdating.value = false;
    setLoading(false);
  }
};

const handlePasswordUpdate = async (): Promise<void> => {
  if (!currentUser.value) {
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    toast.error(ToastMessages.ValidationError);

    return;
  }

  if (!currentPassword.value) {
    toast.error(ToastMessages.ValidationError);

    return;
  }

  if (!newPassword.value) {
    toast.error(ToastMessages.ValidationError);

    return;
  }

  setLoading(true);
  isUpdating.value = true;
  authError.value = null;
  const success = await updatePassword(
    currentPassword.value,
    newPassword.value
  );

  if (success) {
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
    isEditingPassword.value = false;
    toast.success(ToastMessages.PasswordUpdateSuccess);
  }
  isUpdating.value = false;
  setLoading(false);
};

const goToPremiumPage = (): void => {
  router.push('/premium');
};

const handleCancelSubscription = (): void => {
  reveal();
};

const confirmCancelSubscription = async (choice: boolean): Promise<void> => {
  if (!choice) {
    return;
  }
  try {
    // TODO: implement subscription cancellation API call
    toast.success(ToastMessages.SubscriptionCancelSuccess);
  } catch {
    toast.error(ToastMessages.SubscriptionCancelFailed);
  }
};

watch(
  () => colorMode.value,
  async (newMode, oldMode) => {
    if (!currentUser.value || !userProfile.value) {
      return;
    }

    if (newMode === oldMode) {
      return;
    }

    const modeToSave =
      newMode === 'auto'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : newMode;
    isUpdating.value = true;
    try {
      const userDocRef = doc(db, 'users', currentUser.value.uid);
      await updateDoc(userDocRef, {
        'preferences.theme': modeToSave,
      });
      toast.success(ToastMessages.ThemeUpdateSuccess);
    } catch (error) {
      console.error('Failed to update theme:', error);
      toast.error(ToastMessages.ThemeUpdateFailed);
    } finally {
      isUpdating.value = false;
    }
  }
);
</script>

<template>
  <AppLayout>
    <div class="bg-surface w-full max-w-2xl space-y-6 rounded p-8 shadow-md">
      <h1 class="text-primary mb-6 text-center text-3xl font-bold">
        Your Profile
      </h1>

      <!-- Loading State -->
      <div v-if="authLoading" class="text-on-surface/60 text-center">
        Loading profile...
      </div>

      <!-- Profile Content -->
      <div v-else-if="currentUser && userProfile" class="space-y-8">
        <!-- Premium Status Section -->
        <div
          class="rounded-lg border-2 p-5"
          :class="
            isPremium
              ? 'border-primary-variant bg-primary-variant/10'
              : 'border-secondary-variant bg-secondary-variant/20'
          "
        >
          <div class="flex items-center justify-between">
            <div>
              <h2
                class="text-xl font-bold"
                :class="isPremium ? 'text-primary' : 'text-on-surface'"
              >
                <span
                  v-if="isPremium"
                  class="i-heroicons-star-solid mr-2 align-middle text-2xl text-yellow-500"
                ></span>
                <span
                  v-else
                  class="i-heroicons-star mr-2 align-middle text-xl"
                ></span>
                {{ isPremium ? 'Premium Account' : 'Free Account' }}
              </h2>
              <p
                v-if="hasActiveSubscription"
                class="text-on-surface/80 mt-1 text-sm"
              >
                Subscription Status:
                <span class="text-primary font-medium capitalize">{{
                  subscriptionStatus
                }}</span>
              </p>
            </div>
            <!-- Action Buttons -->
            <button
              v-if="!isPremium && !hasActiveSubscription"
              @click="goToPremiumPage"
              class="btn-premium !w-auto"
            >
              <span class="btn-premium-text">Upgrade to Premium</span>
            </button>
            <button
              v-else-if="hasActiveSubscription"
              @click="handleCancelSubscription"
              class="border-error text-error hover:bg-error/10 !w-auto rounded-md border-2 px-4 py-2 text-sm font-medium"
            >
              Cancel Subscription
            </button>
            <button
              v-else
              @click="goToPremiumPage"
              class="btn-renew-premium !w-auto"
            >
              <span class="btn-premium-text">Renew Premium</span>
            </button>
          </div>
        </div>

        <!-- Account Information Section -->
        <div class="border-secondary-variant bg-surface rounded-lg border p-4">
          <h2 class="text-on-surface mb-4 text-xl font-medium">
            Account Information
          </h2>

          <!-- Email Display/Edit -->
          <div class="border-secondary-variant mb-4 border-b pb-4">
            <div
              v-if="!isEditingEmail"
              class="flex items-center justify-between"
            >
              <div>
                <p class="text-on-surface/80 text-sm font-medium">Email:</p>
                <p class="text-on-surface">{{ userProfile.email }}</p>
              </div>
              <button
                @click="
                  isEditingEmail = true;
                  newEmail = userProfile.email || '';
                "
                class="btn-link text-sm"
              >
                <span class="i-heroicons-pencil mr-1 align-middle"></span>
                Edit
              </button>
            </div>
            <!-- Email Edit Form -->
            <div v-else class="space-y-3">
              <label class="form-label">New Email Address</label>
              <input
                v-model="newEmail"
                type="email"
                class="form-input-base form-input-valid bg-surface text-on-surface"
                placeholder="Enter new email"
              />
              <div
                v-if="!/^\S+@\S+\.\S+$/.test(newEmail)"
                class="form-error-text"
              >
                Please enter a valid email address
              </div>
              <div class="mt-2 flex space-x-2">
                <button
                  @click="updateUserEmail"
                  :disabled="isUpdating || !/^\S+@\S+\.\S+$/.test(newEmail)"
                  class="btn-primary !w-auto text-sm"
                >
                  <span v-if="isUpdating">Updating...</span>
                  <span v-else>Update Email</span>
                </button>
                <button
                  @click="isEditingEmail = false"
                  :disabled="isUpdating"
                  class="btn-secondary !w-auto text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <!-- Password Display/Edit -->
          <div class="border-secondary-variant mb-4 border-b pb-4">
            <div
              v-if="!isEditingPassword"
              class="flex items-center justify-between"
            >
              <div>
                <p class="text-on-surface/80 text-sm font-medium">Password:</p>
                <p class="text-on-surface">•••••••••</p>
              </div>
              <button
                @click="isEditingPassword = true"
                class="btn-link text-sm"
              >
                <span class="i-heroicons-pencil mr-1 align-middle"></span>
                Change
              </button>
            </div>
            <!-- Password Change Form -->
            <div v-else class="space-y-3">
              <div class="space-y-1">
                <label class="form-label text-sm">Current Password</label>
                <input
                  v-model="currentPassword"
                  type="password"
                  class="form-input-base form-input-valid bg-surface text-on-surface"
                  placeholder="Enter current password"
                />
              </div>
              <div class="space-y-1">
                <label class="form-label text-sm">New Password</label>
                <input
                  v-model="newPassword"
                  type="password"
                  class="form-input-base form-input-valid bg-surface text-on-surface"
                  placeholder="Enter new password"
                />
              </div>
              <div class="space-y-1">
                <label class="form-label text-sm">Confirm New Password</label>
                <input
                  v-model="confirmPassword"
                  type="password"
                  class="form-input-base form-input-valid bg-surface text-on-surface"
                  placeholder="Confirm new password"
                />
              </div>
              <div class="mt-2 flex space-x-2">
                <button
                  @click="handlePasswordUpdate"
                  :disabled="isUpdating"
                  class="btn-primary !w-auto text-sm"
                >
                  <span v-if="isUpdating">Updating...</span>
                  <span v-else>Update Password</span>
                </button>
                <button
                  @click="isEditingPassword = false"
                  :disabled="isUpdating"
                  class="btn-secondary !w-auto text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <!-- Phone Display/Edit -->
          <div>
            <div
              v-if="!isEditingContact"
              class="flex items-center justify-between"
            >
              <div>
                <p class="text-on-surface/80 text-sm font-medium">Phone:</p>
                <p class="text-on-surface">
                  {{
                    formatPhoneNumber(userProfile.cellphone) || 'Not provided'
                  }}
                </p>
              </div>
              <button
                @click="
                  isEditingContact = true;
                  cellphoneInput = userProfile.cellphone || '';
                "
                class="btn-link text-sm"
              >
                <span class="i-heroicons-pencil mr-1 align-middle"></span>
                {{ userProfile.cellphone ? 'Edit' : 'Add' }}
              </button>
            </div>
            <!-- Phone Edit Form -->
            <div v-else class="space-y-3">
              <label class="form-label text-sm">Phone Number</label>
              <input
                v-model="cellphoneInput"
                type="tel"
                class="form-input-base form-input-valid bg-surface text-on-surface"
                placeholder="+27 12 3456 789"
              />
              <div class="mt-2 flex space-x-2">
                <button
                  @click="updateCellphone"
                  :disabled="isUpdating"
                  class="btn-primary !w-auto text-sm"
                >
                  <span v-if="isUpdating">Updating...</span>
                  <span v-else>Update Phone</span>
                </button>
                <button
                  @click="isEditingContact = false"
                  :disabled="isUpdating"
                  class="btn-secondary !w-auto text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Information Section -->
        <div class="border-secondary-variant bg-surface rounded-lg border p-4">
          <h2 class="text-on-surface mb-4 text-xl font-medium">
            Additional Information
          </h2>
          <div class="grid grid-cols-1 gap-3 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-on-surface/80 font-medium">Name:</span>
              <span class="text-on-surface">{{
                `${userProfile.firstName} ${userProfile.lastName}`
              }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-on-surface/80 font-medium">User ID:</span>
              <span class="text-on-surface break-all text-xs">{{
                userProfile.uid
              }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-on-surface/80 font-medium"
                >Account Created:</span
              >
              <span class="text-on-surface">{{
                userProfile.createdAt?.toDate().toLocaleDateString() ||
                'Unknown'
              }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-on-surface/80 font-medium"
                >Language Preference:</span
              >
              <span class="text-on-surface capitalize">
                {{ displayLanguage }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-on-surface/80 font-medium">Theme:</span>
              <span class="flex items-center gap-2">
                <button
                  @click="toggleTheme()"
                  :aria-label="
                    isDark
                      ? 'Switch to light mode'
                      : colorMode === 'auto'
                        ? 'Switch to system mode'
                        : 'Switch to dark mode'
                  "
                  class="btn-primary-outline flex !w-auto items-center gap-1"
                  :disabled="isUpdating"
                  type="button"
                >
                  <i
                    v-if="colorMode === 'auto'"
                    class="i-heroicons-computer-desktop h-5 w-5"
                  ></i>
                  <i v-else-if="isDark" class="i-heroicons-moon h-5 w-5"></i>
                  <i v-else class="i-heroicons-sun h-5 w-5"></i>
                  <span>
                    {{
                      colorMode === 'auto' ? 'Auto' : isDark ? 'Dark' : 'Light'
                    }}
                  </span>
                </button>
                <select
                  v-model="colorMode"
                  class="ml-2 rounded border px-2 py-1 text-sm"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
                <span v-if="isUpdating" class="text-on-surface/60 ml-2 text-xs"
                  >Saving...</span
                >
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-error text-center">
        Could not load user information. Please try logging in again.
      </div>

      <!-- Back Button -->
      <div class="border-secondary-variant mt-8 border-t pt-6 text-center">
        <button
          @click="goBackOrHome(router)"
          class="btn-primary-outline !w-auto"
        >
          Back
        </button>
      </div>
    </div>
    <FabSpeedDial />
  </AppLayout>

  <!-- Confirmation Dialog -->
  <Teleport to="body">
    <div
      v-if="isRevealed"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      @click.self="cancel()"
    >
      <div class="bg-surface w-full max-w-md rounded-lg p-6 shadow-xl">
        <h3 class="text-error mb-4 text-lg font-bold">
          Cancel Premium Subscription?
        </h3>
        <p class="text-on-surface/80 mb-6 text-sm">
          Are you sure you want to cancel your premium subscription? You'll lose
          access to premium features when your current billing period ends. This
          action cannot be undone easily.
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="cancel()" class="btn-secondary !w-auto text-sm">
            Keep Subscription
          </button>
          <button
            @click="
              confirm(true);
              confirmCancelSubscription(true);
            "
            class="bg-error text-on-primary hover:bg-error/80 rounded px-4 py-2 text-sm font-medium"
          >
            Yes, Cancel Subscription
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
