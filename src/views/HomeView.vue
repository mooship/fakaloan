<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import { useTitle } from '@vueuse/core';
import { ref } from 'vue';

// Setup
useTitle('Home | Fakaloan');
const { currentUser, logout, isLoading } = useAuth();

// State for FAB speed dial
const showSpeedDial = ref(false);

// Methods
/**
 * Handles user logout action.
 */
const handleLogout = () => {
  logout();
};

const toggleSpeedDial = () => {
  showSpeedDial.value = !showSpeedDial.value;
};

const addCustomer = () => {
  console.log('Add Customer clicked');
  // TODO: Implement add customer logic
  showSpeedDial.value = false;
};

const addTransaction = () => {
  console.log('Add Transaction clicked');
  // TODO: Implement add transaction logic
  showSpeedDial.value = false;
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100 relative"
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

    <!-- Floating Action Button Speed Dial Container -->
    <div class="fixed bottom-6 right-6 flex flex-col items-center space-y-2">
      <!-- Secondary Buttons (conditionally rendered) -->
      <transition
        enter-active-class="transition ease-out duration-100 transform"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75 transform"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="showSpeedDial" class="flex flex-col items-center space-y-2">
          <!-- Add Transaction Button -->
          <button
            @click="addTransaction"
            class="bg-green-500 text-white p-3 rounded-full shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 flex items-center space-x-2"
            aria-label="Add Transaction"
          >
            <span class="text-sm font-medium hidden sm:inline"
              >Transaction</span
            >
            <i class="i-heroicons-currency-dollar h-5 w-5"></i>
          </button>

          <!-- Add Customer Button -->
          <button
            @click="addCustomer"
            class="bg-blue-500 text-white p-3 rounded-full shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 flex items-center space-x-2"
            aria-label="Add Customer"
          >
            <span class="text-sm font-medium hidden sm:inline">Customer</span>
            <i class="i-heroicons-user-plus h-5 w-5"></i>
          </button>
        </div>
      </transition>

      <!-- Main Floating Action Button -->
      <button
        @click="toggleSpeedDial"
        class="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        aria-label="Toggle Add Menu"
      >
        <!-- Change icon based on speed dial state -->
        <i
          :class="showSpeedDial ? 'i-heroicons-x-mark' : 'i-heroicons-plus'"
          class="h-6 w-6 transition-transform duration-200 ease-in-out"
          :style="{ transform: showSpeedDial ? 'rotate(45deg)' : 'rotate(0)' }"
        ></i>
      </button>
    </div>
  </div>
</template>
