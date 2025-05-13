<template>
  <div class="bg-background flex min-h-screen flex-col">
    <!-- App Bar -->
    <header
      class="bg-primary text-on-primary relative flex h-14 w-full items-center px-4 shadow"
    >
      <div class="flex flex-1 items-center">
        <span class="text-lg font-bold tracking-wide">Fakaloan</span>
      </div>
      <!-- Desktop Nav -->
      <nav class="hidden items-center space-x-4 md:flex">
        <router-link v-if="currentUser" to="/" class="btn-link text-on-primary"
          >Home</router-link
        >
        <router-link
          v-if="currentUser"
          to="/customers"
          class="btn-link text-on-primary"
          >Customers</router-link
        >
        <router-link
          v-if="currentUser"
          to="/transactions"
          class="btn-link text-on-primary"
          >Transactions</router-link
        >
        <router-link
          v-if="currentUser"
          to="/profile"
          class="btn-link text-on-primary"
          >Profile</router-link
        >
        <router-link to="/about" class="btn-link text-on-primary"
          >About</router-link
        >
        <router-link
          v-if="!currentUser"
          to="/login"
          class="btn-link text-on-primary"
          >Login</router-link
        >
        <router-link
          v-if="!currentUser"
          to="/register"
          class="btn-link text-on-primary"
          >Register</router-link
        >
        <button
          v-if="currentUser"
          @click="handleLogout"
          class="btn-secondary ml-2 !w-auto"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Logging out...' : 'Logout' }}
        </button>
      </nav>
      <!-- Hamburger (Mobile) -->
      <button
        class="ml-2 flex items-center justify-center focus:outline-none md:hidden"
        @click="showMenu = !showMenu"
        aria-label="Open navigation menu"
      >
        <svg
          class="text-on-primary h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <!-- Mobile Menu Dropdown -->
      <transition name="fade">
        <div
          v-if="showMenu"
          class="bg-surface absolute right-4 top-14 z-50 flex w-56 flex-col rounded-xl border border-gray-200 py-2 shadow-xl md:hidden"
        >
          <router-link
            v-if="currentUser"
            to="/"
            class="text-on-surface flex items-center gap-3 rounded-none px-4 py-3 transition hover:bg-gray-100 active:bg-gray-200"
            @click="showMenu = false"
          >
            <i class="i-heroicons-home text-primary h-5 w-5"></i>
            <span>Home</span>
          </router-link>
          <router-link
            v-if="currentUser"
            to="/customers"
            class="text-on-surface flex items-center gap-3 rounded-none px-4 py-3 transition hover:bg-gray-100 active:bg-gray-200"
            @click="showMenu = false"
          >
            <i class="i-heroicons-user-group text-tertiary h-5 w-5"></i>
            <span>Customers</span>
          </router-link>
          <router-link
            v-if="currentUser"
            to="/transactions"
            class="text-on-surface flex items-center gap-3 rounded-none px-4 py-3 transition hover:bg-gray-100 active:bg-gray-200"
            @click="showMenu = false"
          >
            <i class="i-heroicons-currency-dollar text-lime h-5 w-5"></i>
            <span>Transactions</span>
          </router-link>
          <router-link
            v-if="currentUser"
            to="/profile"
            class="text-on-surface flex items-center gap-3 rounded-none px-4 py-3 transition hover:bg-gray-100 active:bg-gray-200"
            @click="showMenu = false"
          >
            <i class="i-heroicons-user-circle text-primary h-5 w-5"></i>
            <span>Profile</span>
          </router-link>
          <div class="my-1 border-t border-gray-200"></div>
          <router-link
            to="/about"
            class="text-on-surface flex items-center gap-3 rounded-none px-4 py-3 transition hover:bg-gray-100 active:bg-gray-200"
            @click="showMenu = false"
          >
            <i class="i-heroicons-information-circle text-primary h-5 w-5"></i>
            <span>About</span>
          </router-link>
          <router-link
            v-if="!currentUser"
            to="/login"
            class="text-on-surface flex items-center gap-3 rounded-none px-4 py-3 transition hover:bg-gray-100 active:bg-gray-200"
            @click="showMenu = false"
          >
            <i
              class="i-heroicons-arrow-right-on-rectangle text-primary h-5 w-5"
            ></i>
            <span>Login</span>
          </router-link>
          <router-link
            v-if="!currentUser"
            to="/register"
            class="text-on-surface flex items-center gap-3 rounded-none px-4 py-3 transition hover:bg-gray-100 active:bg-gray-200"
            @click="showMenu = false"
          >
            <i class="i-heroicons-user-plus text-tertiary h-5 w-5"></i>
            <span>Register</span>
          </router-link>
          <button
            v-if="currentUser"
            @click="handleLogout"
            class="btn-secondary mx-4 my-2 w-auto"
            style="width: calc(100%-2rem); min-width: 0"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Logging out...' : 'Logout' }}
          </button>
        </div>
      </transition>
    </header>
    <!-- Main Content -->
    <main class="flex w-full flex-1 flex-col items-center justify-center">
      <div class="w-full max-w-2xl px-4 py-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * AppLayout.vue
 * Main application layout with navigation bar and responsive menu.
 */
import { useAuth } from '@/composables/useAuth';
import { useLoading } from '@/composables/useLoading';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const { currentUser } = useAuth();
const showMenu = ref(false);
const { isLoading } = useLoading();
const router = useRouter();

const handleLogout = async (): Promise<void> => {
  isLoading.value = true;
  try {
    await import('@/composables/useAuth').then((m) => m.useAuth().logout());
    router.push({ name: 'login' });
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
