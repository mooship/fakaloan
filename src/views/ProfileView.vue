/** * ProfileView.vue * Allows users to view and update their profile, including
name, email, password, phone, language, and theme. */
<script setup lang="ts">
import BackButton from '@/components/BackButton.vue';
import FabSpeedDial from '@/components/FabSpeedDial.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import { useAuth } from '@/composables/useAuth';
import { useLoading } from '@/composables/useLoading';
import { useTheme } from '@/composables/useTheme';
import {
  EMAIL_REGEX,
  PHONE_NUMBER_REGEX,
  SIMPLE_EMAIL_REGEX,
} from '@/constants/regex.constants';
import { ToastMessages } from '@/constants/toastMessages.constants';
import { LanguageCode } from '@/enums/user.enums';
import { db } from '@/firebase';
import AppLayout from '@/layouts/AppLayout.vue';
import {
  formatDate,
  formatPhoneNumber,
  normalizePhoneNumber,
} from '@/utilities/formatUtils';
import { useDebounceFn } from '@vueuse/core';
import { useHead } from '@vueuse/head';
import { updateEmail } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, watch } from 'vue';
import { useToast } from 'vue-toastification';

useHead({
  title: 'Profile | Fakaloan',
  meta: [
    {
      name: 'description',
      content: 'View and edit your Fakaloan user profile.',
    },
    { property: 'og:title', content: 'Profile | Fakaloan' },
    {
      property: 'og:description',
      content: 'View and edit your Fakaloan user profile.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: window.location.href },
    { property: 'og:site_name', content: 'Fakaloan' },
  ],
});
const {
  currentUser,
  userProfile,
  isLoading: authLoading,
  updatePassword,
  error: authError,
} = useAuth();
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

/**
 * Update the user's cellphone number in Firestore after validation.
 */
const updateCellphone = async (): Promise<void> => {
  if (!currentUser.value || !userProfile.value) {
    return;
  }

  // Normalize input before validation and saving
  const trimmedCellphone = normalizePhoneNumber(cellphoneInput.value);
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

/**
 * Update the user's email address in Firebase Auth and Firestore.
 */
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

/**
 * Update the user's password after validation.
 */
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

const debouncedEmailValid = ref(true);
const debouncedPhoneValid = ref(true);
const emailCheckLoading = ref(false);
const phoneCheckLoading = ref(false);

const checkEmailValid = useDebounceFn((value: string) => {
  emailCheckLoading.value = true;
  debouncedEmailValid.value = EMAIL_REGEX.test(value);
  emailCheckLoading.value = false;
}, 300);

const checkPhoneValid = useDebounceFn((value: string) => {
  phoneCheckLoading.value = true;
  debouncedPhoneValid.value = PHONE_NUMBER_REGEX.test(
    normalizePhoneNumber(value)
  );
  phoneCheckLoading.value = false;
}, 300);

watch(newEmail, (val) => {
  checkEmailValid(val);
});

watch(cellphoneInput, (val) => {
  // Always normalize for validation
  checkPhoneValid(normalizePhoneNumber(val));
});

watch(
  () => colorMode.value,
  async (newMode, oldMode) => {
    if (!currentUser.value || !userProfile.value) {
      return;
    }

    if (newMode === oldMode) {
      return;
    }

    const modeToSave = newMode;
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

const isEditingName = ref(false);
const firstNameInput = ref(userProfile.value?.firstName || '');
const lastNameInput = ref(userProfile.value?.lastName || '');

/**
 * Update the user's name in Firestore.
 */
const updateName = async (): Promise<void> => {
  if (!currentUser.value || !userProfile.value) {
    return;
  }

  if (!firstNameInput.value.trim() || !lastNameInput.value.trim()) {
    toast.error(ToastMessages.ValidationError);
    return;
  }

  setLoading(true);
  try {
    isUpdating.value = true;
    const userDocRef = doc(db, 'users', currentUser.value.uid);
    await updateDoc(userDocRef, {
      firstName: firstNameInput.value.trim(),
      lastName: lastNameInput.value.trim(),
    });
    isEditingName.value = false;
    toast.success(ToastMessages.ProfileUpdateSuccess);
  } catch (error) {
    console.error('Failed to update name:', error);
    toast.error(ToastMessages.ProfileUpdateFailed);
  } finally {
    isUpdating.value = false;
    setLoading(false);
  }
};

// expose LanguageCode to template
const LanguageCodeEnum = LanguageCode;

const isEditingLanguage = ref(false);
const languageInput = ref(
  userProfile.value?.preferences?.preferredLanguage || LanguageCode.English
);

/**
 * Update the user's preferred language in Firestore.
 */
const updateLanguage = async (): Promise<void> => {
  if (!currentUser.value || !userProfile.value) {
    return;
  }
  setLoading(true);
  try {
    isUpdating.value = true;
    const userDocRef = doc(db, 'users', currentUser.value.uid);
    await updateDoc(userDocRef, {
      'preferences.preferredLanguage': languageInput.value,
    });
    isEditingLanguage.value = false;
    toast.success(ToastMessages.ProfileUpdateSuccess);
  } catch (error) {
    console.error('Failed to update language:', error);
    toast.error(ToastMessages.ProfileUpdateFailed);
  } finally {
    isUpdating.value = false;
    setLoading(false);
  }
};
</script>

<template>
  <AppLayout>
    <LoadingOverlay v-if="isUpdating" text="Saving..." />
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
        <!-- Account Information Section -->
        <div class="bg-surface rounded-lg border border-gray-300 p-4">
          <h2 class="text-on-surface mb-4 text-xl font-medium">
            Account Information
          </h2>

          <!-- Name Display/Edit -->
          <div class="mb-4 border-b border-gray-200 pb-4">
            <div
              class="flex items-center justify-between"
              v-if="!isEditingName"
            >
              <div>
                <p class="text-on-surface/80 text-sm font-medium">Name:</p>
                <span class="text-on-surface">{{
                  `${userProfile.firstName} ${userProfile.lastName}`
                }}</span>
              </div>
              <button
                @click="
                  isEditingName = true;
                  firstNameInput = userProfile.firstName || '';
                  lastNameInput = userProfile.lastName || '';
                "
                class="btn-link text-sm"
              >
                <span class="i-heroicons-pencil mr-1 align-middle"></span>
                Edit
              </button>
            </div>
            <div v-else class="space-y-3">
              <p class="text-on-surface/80 mb-1 text-sm font-medium">Name</p>
              <label class="form-label text-sm">First Name</label>
              <input
                v-model="firstNameInput"
                type="text"
                class="form-input-base form-input-valid bg-surface text-on-surface"
                placeholder="Enter first name"
              />
              <label class="form-label text-sm">Last Name</label>
              <input
                v-model="lastNameInput"
                type="text"
                class="form-input-base form-input-valid bg-surface text-on-surface"
                placeholder="Enter last name"
              />
              <div class="mt-2 flex space-x-2">
                <button
                  @click="updateName"
                  :disabled="isUpdating"
                  class="btn-primary !w-auto text-sm"
                >
                  <span v-if="isUpdating">Updating...</span>
                  <span v-else>Update Name</span>
                </button>
                <button
                  @click="isEditingName = false"
                  :disabled="isUpdating"
                  class="btn-secondary !w-auto text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <!-- Email Display/Edit -->
          <div class="mb-4 border-b border-gray-200 pb-4">
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
                v-if="!SIMPLE_EMAIL_REGEX.test(newEmail)"
                class="form-error-text"
              >
                Please enter a valid email address
              </div>
              <div class="mt-2 flex space-x-2">
                <button
                  @click="updateUserEmail"
                  :disabled="isUpdating || !SIMPLE_EMAIL_REGEX.test(newEmail)"
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
          <div class="mb-4 border-b border-gray-200 pb-4">
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
                placeholder="083 234 2922"
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
        <div class="bg-surface rounded-lg border border-gray-300 p-4">
          <h2 class="text-on-surface mb-4 text-xl font-medium">
            Additional Information
          </h2>
          <div class="grid grid-cols-1 gap-3 text-sm">
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
                formatDate(userProfile.createdAt) || 'Unknown'
              }}</span>
            </div>
            <!-- Language Preference Dropdown -->
            <div class="flex items-center justify-between">
              <label class="form-label mb-0" for="language-select"
                >Language Preference</label
              >
              <select
                v-model="languageInput"
                @change="updateLanguage"
                id="language-select"
                class="material-select w-26 max-w-xs"
                :disabled="isUpdating"
              >
                <option :value="LanguageCodeEnum.English">English</option>
                <option :value="LanguageCodeEnum.Zulu">Zulu</option>
                <option :value="LanguageCodeEnum.Xhosa">Xhosa</option>
              </select>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-on-surface/80 font-medium">Theme:</span>
              <span class="flex items-center gap-2">
                <button
                  @click="toggleTheme()"
                  :aria-label="
                    isDark ? 'Switch to light mode' : 'Switch to dark mode'
                  "
                  class="btn-primary-outline flex !w-auto items-center gap-1"
                  :disabled="isUpdating"
                  type="button"
                >
                  <i v-if="isDark" class="i-heroicons-moon h-5 w-5"></i>
                  <i v-else class="i-heroicons-sun h-5 w-5"></i>
                  <span>{{ isDark ? 'Dark' : 'Light' }}</span>
                </button>
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
      <div class="mt-8 flex justify-center border-t border-gray-200 pt-6">
        <BackButton />
      </div>
    </div>
    <FabSpeedDial />
  </AppLayout>
</template>
