<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="auth-page-container">
    <div class="auth-card">
      <h1 class="auth-title">{{ title }}</h1>

      <slot name="errors"></slot>

      <slot></slot>

      <slot name="actions"></slot>
    </div>
  </div>
</template>
