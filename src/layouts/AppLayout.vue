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
          class="bg-surface border border-gray-200 shadow-xl rounded-xl absolute right-4 top-14 z-50 flex w-56 flex-col py-2 md:hidden"
        >
          <router-link
            v-if="currentUser"
            to="/"
            class="flex items-center gap-3 px-4 py-3 text-on-surface hover:bg-gray-100 active:bg-gray-200 transition rounded-none"
            @click="showMenu = false"
          >
            <i class="i-heroicons-home h-5 w-5 text-primary"></i>
            <span>Home</span>
          </router-link>
          <router-link
            v-if="currentUser"
            to="/customers"
            class="flex items-center gap-3 px-4 py-3 text-on-surface hover:bg-gray-100 active:bg-gray-200 transition rounded-none"
            @click="showMenu = false"
          >
            <i class="i-heroicons-user-group h-5 w-5 text-tertiary"></i>
            <span>Customers</span>
          </router-link>
          <router-link
            v-if="currentUser"
            to="/transactions"
            class="flex items-center gap-3 px-4 py-3 text-on-surface hover:bg-gray-100 active:bg-gray-200 transition rounded-none"
            @click="showMenu = false"
          >
            <i class="i-heroicons-currency-dollar h-5 w-5 text-lime"></i>
            <span>Transactions</span>
          </router-link>
          <router-link
            v-if="currentUser"
            to="/profile"
            class="flex items-center gap-3 px-4 py-3 text-on-surface hover:bg-gray-100 active:bg-gray-200 transition rounded-none"
            @click="showMenu = false"
          >
            <i class="i-heroicons-user-circle h-5 w-5 text-primary"></i>
            <span>Profile</span>
          </router-link>
          <div class="my-1 border-t border-gray-200"></div>
          <router-link
            to="/about"
            class="flex items-center gap-3 px-4 py-3 text-on-surface hover:bg-gray-100 active:bg-gray-200 transition rounded-none"
            @click="showMenu = false"
          >
            <i class="i-heroicons-information-circle h-5 w-5 text-primary"></i>
            <span>About</span>
          </router-link>
          <router-link
            v-if="!currentUser"
            to="/login"
            class="flex items-center gap-3 px-4 py-3 text-on-surface hover:bg-gray-100 active:bg-gray-200 transition rounded-none"
            @click="showMenu = false"
          >
            <i class="i-heroicons-arrow-right-on-rectangle h-5 w-5 text-primary"></i>
            <span>Login</span>
          </router-link>
          <router-link
            v-if="!currentUser"
            to="/register"
            class="flex items-center gap-3 px-4 py-3 text-on-surface hover:bg-gray-100 active:bg-gray-200 transition rounded-none"
            @click="showMenu = false"
          >
            <i class="i-heroicons-user-plus h-5 w-5 text-tertiary"></i>
            <span>Register</span>
          </router-link>
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
import { ref } from 'vue';
const { currentUser } = useAuth();
const showMenu = ref(false);
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
