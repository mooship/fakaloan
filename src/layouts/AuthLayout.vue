<script setup lang="ts">
/**
 * AuthLayout component
 * Provides a consistent layout for authentication pages (Login, Register, Forgot Password).
 * @prop {string} title - The page title displayed.
 */
defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="auth-page-container">
    <div class="auth-card">
      <!-- Auth Page Title -->
      <h1 class="auth-title">{{ title }}</h1>

      <!-- Error/Message Slot -->
      <!-- Slot for notifications (errors, success messages) -->
      <slot name="errors"></slot>

      <!-- Main Content Slot -->
      <!-- Slot for the primary content (usually the form) -->
      <slot></slot>

      <!-- Additional Actions Slot -->
      <!-- Slot for secondary actions (links, OAuth buttons) -->
      <slot name="actions"></slot>
    </div>
  </div>
</template>
