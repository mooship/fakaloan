<script setup lang="ts">
import FabSpeedDial from '@/components/FabSpeedDial.vue';
import { useAuth } from '@/composables/useAuth';
import { useLoading } from '@/composables/useLoading';
import { ToastMessages } from '@/constants/toastMessages.constants';
import AppLayout from '@/layouts/AppLayout.vue';
import { useTitle } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

useTitle('Home | Fakaloan');
const { currentUser, logout, isLoading } = useAuth();
const router = useRouter();
const { setLoading } = useLoading();
const toast = useToast();

const handleLogout = async (): Promise<void> => {
  setLoading(true);
  try {
    await logout();
    router.push({ name: 'login' });
    toast.success(ToastMessages.LogoutSuccess);
  } catch {
    toast.error(ToastMessages.LogoutFailed);
  } finally {
    setLoading(false);
  }
};
</script>

<template>
  <AppLayout>
    <div class="bg-surface space-y-4 rounded p-8 text-center shadow-md">
      <h1 class="text-primary text-2xl font-bold">Welcome to Fakaloan!</h1>
      <!-- TODO: Add personalized greeting with user's name if available -->
      <div v-if="currentUser">
        <p class="text-on-surface">You are logged in as:</p>
        <p class="text-primary font-medium">{{ currentUser.email }}</p>
        <!-- TODO: Add quick links to main features (e.g., Add Customer, View Transactions) -->
      </div>
      <div v-else-if="isLoading && !currentUser">
        <p class="text-on-surface/60">Loading user information...</p>
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
    </div>
    <FabSpeedDial />
  </AppLayout>
</template>
