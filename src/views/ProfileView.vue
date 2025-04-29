<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import { LanguageCode, SubscriptionStatus } from '@/enums/user.enums';
import { db } from '@/firebase';
import { useConfirmDialog, useTitle } from '@vueuse/core';
import { updateEmail } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

// Setup & State
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

// UI state
const isEditingContact = ref(false);
const isEditingEmail = ref(false);
const isEditingPassword = ref(false);
const isUpdating = ref(false);

// Input models
const cellphoneInput = ref(userProfile.value?.cellphone || '');
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const newEmail = ref(userProfile.value?.email || '');

// Confirmation dialog
const { isRevealed, reveal, confirm, cancel } = useConfirmDialog();

// Computed Properties
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

// Methods
/** Navigate back to the home page. */
const goToHome = () => {
  router.push('/');
};

/** Update user's cellphone number in Firestore. */
const updateCellphone = async () => {
  if (!currentUser.value || !userProfile.value) {
    return;
  }

  const trimmedCellphone = cellphoneInput.value.replace(/\s+/g, '');

  try {
    isUpdating.value = true;
    const userDocRef = doc(db, 'users', currentUser.value.uid);
    await updateDoc(userDocRef, {
      cellphone: trimmedCellphone,
    });
    cellphoneInput.value = trimmedCellphone;
    isEditingContact.value = false;
    toast.success('Phone number updated successfully');
  } catch (error) {
    console.error('Failed to update phone number:', error);
    toast.error('Failed to update phone number');
  } finally {
    isUpdating.value = false;
  }
};

/** Update user's email in Firebase Auth and Firestore. */
const updateUserEmail = async () => {
  if (!currentUser.value) {
    return;
  }

  try {
    isUpdating.value = true;
    await updateEmail(currentUser.value, newEmail.value);
    const userDocRef = doc(db, 'users', currentUser.value.uid);
    await updateDoc(userDocRef, {
      email: newEmail.value,
    });
    isEditingEmail.value = false;
    toast.success('Email updated successfully');
  } catch (error) {
    console.error('Failed to update email:', error);
    toast.error('Failed to update email. You may need to log in again.');
  } finally {
    isUpdating.value = false;
  }
};

/** Handle the password update process using the useAuth composable. */
const handlePasswordUpdate = async () => {
  if (!currentUser.value) {
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    toast.error('New passwords do not match');
    return;
  }

  if (!currentPassword.value) {
    toast.error('Current password is required');
    return;
  }

  if (!newPassword.value) {
    toast.error('New password is required');
    return;
  }

  isUpdating.value = true;
  authError.value = null; // Clear previous auth errors

  const success = await updatePassword(
    currentPassword.value,
    newPassword.value
  );

  if (success) {
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
    isEditingPassword.value = false;
    toast.success('Password updated successfully');
  }
  // Error message is handled within useAuth via toast

  isUpdating.value = false;
};

/** Navigate to the premium features/upgrade page. */
const goToPremiumPage = () => {
  router.push('/premium');
};

/** Trigger the confirmation dialog for subscription cancellation. */
const handleCancelSubscription = () => {
  reveal();
};

/**
 * Handle the confirmation result for subscription cancellation.
 * Placeholder for actual cancellation logic.
 * @param choice - Boolean indicating if the user confirmed cancellation.
 */
const confirmCancelSubscription = async (choice: boolean) => {
  if (!choice) {
    return;
  }
  try {
    // TODO: Implement cancellation logic (e.g., API call)
    toast.success('Subscription cancellation request submitted');
  } catch (error) {
    console.error('Failed to cancel subscription:', error);
    toast.error('Failed to cancel subscription');
  }
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4"
  >
    <div class="w-full max-w-2xl p-8 bg-white rounded shadow-md space-y-6">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">
        Your Profile
      </h1>

      <!-- Loading State -->
      <div v-if="authLoading" class="text-center text-gray-500">
        Loading profile...
      </div>

      <!-- Profile Content -->
      <div v-else-if="currentUser && userProfile" class="space-y-8">
        <!-- Premium Status Section -->
        <div
          class="border-2 rounded-lg p-5"
          :class="
            isPremium
              ? 'bg-indigo-50 border-indigo-300'
              : 'bg-gray-50 border-gray-300'
          "
        >
          <div class="flex justify-between items-center">
            <div>
              <h2
                class="text-xl font-bold"
                :class="isPremium ? 'text-indigo-800' : 'text-gray-700'"
              >
                <span
                  v-if="isPremium"
                  class="i-heroicons-star-solid mr-2 text-yellow-500 text-2xl align-middle"
                ></span>
                <span
                  v-else
                  class="i-heroicons-star mr-2 text-xl align-middle"
                ></span>
                {{ isPremium ? 'Premium Account' : 'Free Account' }}
              </h2>
              <p
                v-if="hasActiveSubscription"
                class="text-gray-600 mt-1 text-sm"
              >
                Subscription Status:
                <span class="font-medium capitalize">{{
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
              class="text-red-600 border-2 border-red-300 px-4 py-2 rounded-md hover:bg-red-50 font-medium text-sm !w-auto"
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
        <div class="border rounded-lg p-4">
          <h2 class="text-xl font-medium text-gray-700 mb-4">
            Account Information
          </h2>

          <!-- Email Display/Edit -->
          <div class="mb-4 pb-4 border-b border-gray-200">
            <div
              v-if="!isEditingEmail"
              class="flex justify-between items-center"
            >
              <div>
                <p class="text-gray-600 font-medium text-sm">Email:</p>
                <p class="text-gray-800">{{ userProfile.email }}</p>
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
                class="form-input-base form-input-valid"
                placeholder="Enter new email"
              />
              <div class="flex space-x-2 mt-2">
                <button
                  @click="updateUserEmail"
                  :disabled="isUpdating"
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
          <div class="mb-4 pb-4 border-b border-gray-200">
            <div
              v-if="!isEditingPassword"
              class="flex justify-between items-center"
            >
              <div>
                <p class="text-gray-600 font-medium text-sm">Password:</p>
                <p class="text-gray-800">•••••••••</p>
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
                  class="form-input-base form-input-valid"
                  placeholder="Enter current password"
                />
              </div>
              <div class="space-y-1">
                <label class="form-label text-sm">New Password</label>
                <input
                  v-model="newPassword"
                  type="password"
                  class="form-input-base form-input-valid"
                  placeholder="Enter new password"
                />
              </div>
              <div class="space-y-1">
                <label class="form-label text-sm">Confirm New Password</label>
                <input
                  v-model="confirmPassword"
                  type="password"
                  class="form-input-base form-input-valid"
                  placeholder="Confirm new password"
                />
              </div>
              <div class="flex space-x-2 mt-2">
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
              class="flex justify-between items-center"
            >
              <div>
                <p class="text-gray-600 font-medium text-sm">Phone:</p>
                <p class="text-gray-800">
                  {{ userProfile.cellphone || 'Not provided' }}
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
                class="form-input-base form-input-valid"
                placeholder="+27 12 345 6789"
              />
              <div class="flex space-x-2 mt-2">
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
        <div class="border rounded-lg p-4">
          <h2 class="text-xl font-medium text-gray-700 mb-4">
            Additional Information
          </h2>
          <div class="grid grid-cols-1 gap-3 text-sm">
            <div class="flex justify-between items-center">
              <span class="text-gray-600 font-medium">Name:</span>
              <span class="text-gray-800">{{
                `${userProfile.firstName} ${userProfile.lastName}`
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 font-medium">User ID:</span>
              <span class="text-gray-800 text-xs break-all">{{
                userProfile.uid
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 font-medium">Account Created:</span>
              <span class="text-gray-800">{{
                userProfile.createdAt?.toDate().toLocaleDateString() ||
                'Unknown'
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 font-medium"
                >Language Preference:</span
              >
              <span class="text-gray-800 capitalize">
                {{ displayLanguage }}
                <!-- TODO: Add edit button for language preference -->
              </span>
            </div>
            <!-- TODO: Add Theme Preference display -->
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center text-red-500">
        Could not load user information. Please try logging in again.
      </div>

      <!-- Back Button -->
      <div class="text-center mt-8 pt-6 border-t border-gray-200">
        <button @click="goToHome" class="btn-secondary !w-auto">
          Back to Home
        </button>
      </div>
    </div>
  </div>

  <!-- Confirmation Dialog -->
  <Teleport to="body">
    <div
      v-if="isRevealed"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="cancel()"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 class="text-lg font-bold mb-4">Cancel Premium Subscription?</h3>
        <p class="mb-6 text-gray-600 text-sm">
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
            class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm font-medium"
          >
            Yes, Cancel Subscription
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
