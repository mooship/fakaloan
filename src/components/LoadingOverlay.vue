/** * LoadingOverlay.vue * * Global loading overlay component for Fakaloan. *
Displays a spinner and loading text when the app is busy. * Uses UnoCSS for
styling and supports dark mode. * * @module components/LoadingOverlay */

<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
    >
      <div class="flex flex-col items-center">
        <svg
          class="mb-4 h-12 w-12 animate-spin drop-shadow-lg"
          :class="isDark ? 'text-primary' : 'text-primary'"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          ></path>
        </svg>
        <span
          class="text-lg font-medium drop-shadow-lg"
          :class="isDark ? 'text-on-primary' : 'text-on-surface'"
        >
          Loading...
        </span>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useLoading } from '@/composables/useLoading';
import { useTheme } from '@/composables/useTheme';
import { computed } from 'vue';
const { isLoading } = useLoading();
const { isDark } = useTheme();
const visible = computed(() => isLoading.value);
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
