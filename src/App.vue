<script setup lang="ts">
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
  </main>
</template>
