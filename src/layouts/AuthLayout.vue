<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <div class="auth-page-container">
    <div class="auth-card">
      <h1 class="auth-title text-primary">{{ title }}</h1>
      <slot name="errors" />
      <slot />
      <slot name="actions" />
    </div>
  </div>
</template>
