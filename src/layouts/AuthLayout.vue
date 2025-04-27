<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
      <h1 class="text-2xl font-bold text-center">{{ title }}</h1>

      <slot name="errors"></slot>

      <slot></slot>

      <slot name="actions"></slot>
    </div>
  </div>
</template>
