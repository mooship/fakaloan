/** * AuthLayout.vue * Layout for authentication-related pages, providing a
consistent card UI. */
<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <div class="auth-page-container">
    <div class="auth-card elevation-2">
      <h1 class="auth-title text-primary mb-4">{{ title }}</h1>
      <slot name="errors" />
      <slot />
      <slot name="actions" />
    </div>
  </div>
</template>
