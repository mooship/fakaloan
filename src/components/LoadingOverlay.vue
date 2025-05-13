<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
    >
      <div
        class="bg-surface flex flex-col items-center rounded-xl p-8 shadow-xl"
      >
        <svg
          class="text-primary mb-4 h-12 w-12 animate-spin drop-shadow-lg"
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
        <span class="text-on-surface text-lg font-medium drop-shadow-lg">
          {{ text }}
        </span>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
/**
 * LoadingOverlay.vue
 * Displays a loading overlay with a spinner and optional text.
 */
import { useLoading } from '@/composables/useLoading';
import { computed } from 'vue';
const { isLoading } = useLoading();
const visible = computed(() => isLoading.value);

defineProps({
  text: {
    type: String,
    default: 'Loading...',
  },
});
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
