<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useCurrentUser } from 'vuefire';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import { useToast } from 'vue-toastification';

const currentUser = useCurrentUser();
const router = useRouter();
const toast = useToast();

const handleLogout = async () => {
  try {
    console.log('Attempting logout...');
    await signOut(auth);
    console.log('Logout successful.');
    toast.success('You have been logged out.');
    router.push({ name: 'login' });
  } catch (error) {
    console.error('Logout failed:', error);
    toast.error('Logout failed. Please try again.');
  }
};
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="p-8 bg-white rounded shadow-md text-center space-y-4">
      <h1 class="text-2xl font-bold">Welcome to Fakaloan!</h1>

      <div v-if="currentUser">
        <p class="text-gray-700">You are logged in as:</p>
        <p class="font-medium text-indigo-600">{{ currentUser.email }}</p>
      </div>
      <div v-else>
        <p class="text-gray-500">Loading user information...</p>
      </div>

      <div>
        <button @click="handleLogout" class="btn-secondary !w-auto">
          Logout
        </button>
      </div>
    </div>
  </div>
</template>
