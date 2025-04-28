<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import { LanguageCode, SubscriptionStatus } from '@/enums/user.enums';
import { db } from '@/firebase';
import { useConfirmDialog, useTitle } from '@vueuse/core';
import { updateEmail, updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

useTitle('Profile | Fakaloan');

const { currentUser, userProfile, isLoading: authLoading } = useAuth();
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

const { isRevealed, reveal, confirm, cancel } = useConfirmDialog();

const goToHome = () => {
  router.push('/');
};

const updateCellphone = async () => {
  if (!currentUser.value || !userProfile.value) return;

  try {
    isUpdating.value = true;
    const userDocRef = doc(db, 'users', currentUser.value.uid);
    await updateDoc(userDocRef, {
      cellphone: cellphoneInput.value,
    });
    isEditingContact.value = false;
    toast.success('Phone number updated successfully');
  } catch (error) {
    console.error('Failed to update phone number:', error);
    toast.error('Failed to update phone number');
  } finally {
    isUpdating.value = false;
  }
};

const updateUserEmail = async () => {
  if (!currentUser.value) return;

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

const updateUserPassword = async () => {
  if (!currentUser.value) return;
  if (newPassword.value !== confirmPassword.value) {
    toast.error('Passwords do not match');
    return;
  }

  try {
    isUpdating.value = true;
    await updatePassword(currentUser.value, newPassword.value);
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
    isEditingPassword.value = false;
    toast.success('Password updated successfully');
  } catch (error) {
    console.error('Failed to update password:', error);
    toast.error(
      'Failed to update password. You may need to log in again for security reasons.'
    );
  } finally {
    isUpdating.value = false;
  }
};

const goToPremiumPage = () => {
  router.push('/premium');
};

const handleCancelSubscription = () => {
  reveal();
};

const confirmCancelSubscription = async (choice: boolean) => {
  if (!choice) return;
  try {
    // implement cancellation logic (e.g., API call)
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
        <!-- Premium Status -->
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
                  class="i-heroicons-star-solid mr-2 text-yellow-500 text-2xl"
                ></span>
                <span v-else class="i-heroicons-star mr-2 text-xl"></span>
                {{ isPremium ? 'Premium Account' : 'Free Account' }}
              </h2>
              <p v-if="hasActiveSubscription" class="text-gray-600 mt-1">
                Subscription: {{ subscriptionStatus }}
              </p>
            </div>
            <button
              v-if="!isPremium"
              @click="goToPremiumPage"
              class="btn-premium"
            >
              <span class="btn-premium-text">Upgrade to Premium</span>
            </button>
            <button
              v-else-if="hasActiveSubscription"
              @click="handleCancelSubscription"
              class="text-red-600 border-2 border-red-300 px-4 py-2 rounded-md hover:bg-red-50 font-bold"
            >
              Cancel Subscription
            </button>
            <button v-else @click="goToPremiumPage" class="btn-renew-premium">
              <span class="btn-premium-text">Renew Premium</span>
            </button>
          </div>
        </div>

        <!-- Account Information -->
        <div class="border rounded-lg p-4">
          <h2 class="text-xl font-medium text-gray-700 mb-4">
            Account Information
          </h2>

          <!-- Email -->
          <div class="mb-4">
            <div
              v-if="!isEditingEmail"
              class="flex justify-between items-center"
            >
              <div>
                <p class="text-gray-600 font-medium">Email:</p>
                <p class="text-gray-800">{{ userProfile.email }}</p>
              </div>
              <button
                @click="
                  isEditingEmail = true;
                  newEmail = userProfile.email || '';
                "
                class="btn-link"
              >
                <span class="i-heroicons-pencil mr-1"></span>
                Edit
              </button>
            </div>
            <div v-else class="space-y-3">
              <label class="form-label">New Email</label>
              <input
                v-model="newEmail"
                type="email"
                class="form-input-base form-input-valid"
              />
              <div class="flex space-x-2 mt-2">
                <button
                  @click="updateUserEmail"
                  :disabled="isUpdating"
                  class="btn-primary !w-auto"
                >
                  <span v-if="isUpdating">Updating...</span>
                  <span v-else>Update Email</span>
                </button>
                <button
                  @click="isEditingEmail = false"
                  :disabled="isUpdating"
                  class="btn-secondary !w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <!-- Password -->
          <div class="mb-4">
            <div
              v-if="!isEditingPassword"
              class="flex justify-between items-center"
            >
              <div>
                <p class="text-gray-600 font-medium">Password:</p>
                <p class="text-gray-800">•••••••••</p>
              </div>
              <button @click="isEditingPassword = true" class="btn-link">
                <span class="i-heroicons-pencil mr-1"></span>
                Change
              </button>
            </div>
            <div v-else class="space-y-3">
              <div class="space-y-2">
                <label class="form-label">Current Password</label>
                <input
                  v-model="currentPassword"
                  type="password"
                  class="form-input-base form-input-valid"
                />
              </div>
              <div class="space-y-2">
                <label class="form-label">New Password</label>
                <input
                  v-model="newPassword"
                  type="password"
                  class="form-input-base form-input-valid"
                />
              </div>
              <div class="space-y-2">
                <label class="form-label">Confirm New Password</label>
                <input
                  v-model="confirmPassword"
                  type="password"
                  class="form-input-base form-input-valid"
                />
              </div>
              <div class="flex space-x-2 mt-2">
                <button
                  @click="updateUserPassword"
                  :disabled="isUpdating"
                  class="btn-primary !w-auto"
                >
                  <span v-if="isUpdating">Updating...</span>
                  <span v-else>Update Password</span>
                </button>
                <button
                  @click="isEditingPassword = false"
                  :disabled="isUpdating"
                  class="btn-secondary !w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <!-- Phone -->
          <div>
            <div
              v-if="!isEditingContact"
              class="flex justify-between items-center"
            >
              <div>
                <p class="text-gray-600 font-medium">Phone:</p>
                <p class="text-gray-800">
                  {{ userProfile.cellphone || 'Not provided' }}
                </p>
              </div>
              <button
                @click="
                  isEditingContact = true;
                  cellphoneInput = userProfile.cellphone || '';
                "
                class="btn-link"
              >
                <span class="i-heroicons-pencil mr-1"></span>
                {{ userProfile.cellphone ? 'Edit' : 'Add' }}
              </button>
            </div>
            <div v-else class="space-y-3">
              <label class="form-label">Phone Number</label>
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
                  class="btn-primary !w-auto"
                >
                  <span v-if="isUpdating">Updating...</span>
                  <span v-else>Update Phone</span>
                </button>
                <button
                  @click="isEditingContact = false"
                  :disabled="isUpdating"
                  class="btn-secondary !w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="border rounded-lg p-4">
          <h2 class="text-xl font-medium text-gray-700 mb-4">
            Additional Information
          </h2>
          <div class="grid grid-cols-1 gap-3">
            <div class="flex justify-between items-center">
              <span class="text-gray-600 font-medium">Name:</span>
              <span class="text-gray-800">{{ userProfile.name }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 font-medium">User ID:</span>
              <span class="text-gray-800 text-xs">{{ userProfile.uid }}</span>
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
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center text-red-500">
        Could not load user information. Please try logging in again.
      </div>

      <!-- Back Button -->
      <div class="text-center mt-8 t-6">
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
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">Cancel Premium Subscription?</h3>
        <p class="mb-6 text-gray-600">
          Are you sure you want to cancel your premium subscription? You'll lose
          access to premium features when your current billing period ends.
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="cancel()" class="btn-secondary !w-auto">
            Keep Subscription
          </button>
          <button
            @click="
              confirm(true);
              confirmCancelSubscription(true);
            "
            class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Cancel Subscription
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
