<script setup lang="ts">
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import { useTheme } from '@/composables/useTheme';
import { RouterView } from 'vue-router';

useTheme();
</script>

<template>
  <main class="font-sans">
    <RouterView />
    <LoadingOverlay />
  </main>
</template>
