<script setup lang="ts">
/**
 * AuthLayout component
 * Provides consistent layout for all authentication-related pages
 * (Login, Register, Forgot Password).
 *
 * @prop {string} title - The page title displayed at the top of the layout.
 */
defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="auth-page-container">
    <div class="auth-card">
      <!-- ======================================================================= -->
      <!-- Auth Page Title                                                         -->
      <!-- ======================================================================= -->
      <h1 class="auth-title">{{ title }}</h1>

      <!-- ======================================================================= -->
      <!-- Error/Message Slot                                                      -->
      <!-- ======================================================================= -->
      <!-- Slot for displaying notifications like errors or success messages -->
      <slot name="errors"></slot>

      <!-- ======================================================================= -->
      <!-- Main Content Slot                                                       -->
      <!-- ======================================================================= -->
      <!-- Slot for the primary content, typically the form -->
      <slot></slot>

      <!-- ======================================================================= -->
      <!-- Additional Actions Slot                                                 -->
      <!-- ======================================================================= -->
      <!-- Slot for secondary actions like links to other auth pages or OAuth buttons -->
      <slot name="actions"></slot>
    </div>
  </div>
</template>
