<script setup lang="ts">
/**
 * AuthLayout component
 * Provides consistent layout for all authentication-related pages
 *
 * @prop title - The page title displayed at the top of the layout
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

      <!-- Error/Message Slot - For displaying notifications -->
      <slot name="errors"></slot>

      <!-- Main Content Slot - For forms and primary content -->
      <slot></slot>

      <!-- Additional Actions Slot - For links, buttons, etc. -->
      <slot name="actions"></slot>
    </div>
  </div>
</template>
