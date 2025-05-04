<script setup lang="ts">
import FabSpeedDial from '@/components/FabSpeedDial.vue';
import { useAuth } from '@/composables/useAuth';
import { useLoading } from '@/composables/useLoading';
import AppLayout from '@/layouts/AppLayout.vue';
import { useHead } from '@vueuse/head';
import { useRouter } from 'vue-router';

useHead({
  title: 'Home | Fakaloan',
  meta: [
    {
      name: 'description',
      content: 'Dashboard and quick access to Fakaloan features.',
    },
    { property: 'og:title', content: 'Home | Fakaloan' },
    {
      property: 'og:description',
      content: 'Dashboard and quick access to Fakaloan features.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: window.location.href },
    { property: 'og:site_name', content: 'Fakaloan' },
  ],
});
const { currentUser, logout, isLoading } = useAuth();
const router = useRouter();
const { setLoading } = useLoading();

const handleLogout = async (): Promise<void> => {
  setLoading(true);
  try {
    await logout();
    router.push({ name: 'login' });
  } finally {
    setLoading(false);
  }
};
</script>

<template>
  <AppLayout>
    <div class="card-main text-center">
      <h1 class="text-primary text-2xl font-bold">Welcome to Fakaloan!</h1>
      <div v-if="currentUser">
        <p class="text-on-surface mb-2">
          Welcome{{
            currentUser.displayName ? `, ${currentUser.displayName}` : ''
          }}!
        </p>
        <p class="text-on-surface">You are logged in as:</p>
        <p class="text-primary font-medium">{{ currentUser.email }}</p>
      </div>
      <div v-else-if="isLoading && !currentUser">
        <p class="text-on-surface-60">Loading user information...</p>
      </div>
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
