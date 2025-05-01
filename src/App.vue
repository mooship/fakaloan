<script setup lang="ts">
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import { useTheme } from '@/composables/useTheme';
import { RouterView } from 'vue-router';

useTheme();

/**
 * Root component of the application.
 * Renders the current route's component via RouterView.
 */
</script>

<template>
  <main class="font-sans">
    <RouterView />
    <LoadingOverlay />
  </main>
</template>
