/** * AuthLayout.vue * * Authentication layout component for Fakaloan. *
Provides a styled card with slots for title, errors, form, and actions. * *
@module layouts/AuthLayout * @prop {string} title - The title to display at the
top of the card. */
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
