/** * BackButton.vue * A reusable back button that navigates to the previous
page or home if no history. */
<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  label: { type: String, default: 'Back' },
  class: { type: String, default: '' },
});

const router = useRouter();

function handleBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
}

const classes = computed(
  () => `btn-primary-outline !w-auto flex items-center gap-2 ${props.class}`
);
</script>

<template>
  <button @click="handleBack" :class="classes">
    <i class="i-heroicons-arrow-left h-5 w-5"></i>
    <span>{{ label }}</span>
  </button>
</template>
