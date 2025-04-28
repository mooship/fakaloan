<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import { useTitle } from '@vueuse/core';
import { useRouter } from 'vue-router';

// Set the page title
useTitle('Profile | Fakaloan');

// Get user data and authentication state
const { currentUser, isLoading: authLoading } = useAuth();
const router = useRouter();

/**
 * Navigate back to home page
 */
const goToHome = () => {
  router.push('/');
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4"
  >
    <div class="w-full max-w-lg p-8 bg-white rounded shadow-md space-y-6">
      <!-- Profile Header -->
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">
        Your Profile
      </h1>

      <!-- Loading State -->
      <div v-if="authLoading" class="text-center text-gray-500">
        Loading profile...
      </div>

      <!-- User Information Display -->
      <div v-else-if="currentUser" class="space-y-4">
        <div class="flex justify-between items-center">
          <span class="text-gray-600 font-medium">Email:</span>
          <span class="text-gray-800">{{ currentUser.email }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600 font-medium">User ID:</span>
          <span class="text-gray-800 text-xs">{{ currentUser.uid }}</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center text-red-500">
        Could not load user information. Please try logging in again.
      </div>

      <!-- Navigation Button -->
      <div class="text-center mt-8 border-t pt-6">
        <button @click="goToHome" class="btn-secondary !w-auto">
          Back to Home
        </button>
      </div>
    </div>
  </div>
</template>
