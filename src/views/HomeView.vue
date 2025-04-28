<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import { useTitle } from '@vueuse/core';

// Setup
useTitle('Home | Fakaloan');
const { currentUser, logout, isLoading } = useAuth();

// Methods
/**
 * Handles user logout action.
 */
const handleLogout = () => {
  logout();
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100"
  >
    <div class="p-8 bg-white rounded shadow-md text-center space-y-4">
      <h1 class="text-2xl font-bold">Welcome to Fakaloan!</h1>

      <!-- User Information Display -->
      <div v-if="currentUser">
        <p class="text-gray-700">You are logged in as:</p>
        <p class="font-medium text-indigo-600">{{ currentUser.email }}</p>
      </div>
      <div v-else-if="isLoading && !currentUser">
        <p class="text-gray-500">Loading user information...</p>
      </div>
      <div v-else>
        <p class="text-gray-500">Not logged in.</p>
      </div>

      <!-- Logout Button -->
      <div>
        <button
          @click="handleLogout"
          class="btn-secondary !w-auto"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Logging out...' : 'Logout' }}
        </button>
      </div>

      <!-- Navigation Links -->
      <div class="pt-4 border-t border-gray-200">
        <router-link to="/profile" class="btn-link mr-4">Profile</router-link>
        <router-link to="/about" class="btn-link">About</router-link>
      </div>
    </div>
  </div>
</template>
