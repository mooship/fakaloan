/** * FabSpeedDial.vue * Floating action button for quick access to add
transaction or customer. */
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const showSpeedDial = ref(false);
const router = useRouter();

const toggleSpeedDial = () => {
  showSpeedDial.value = !showSpeedDial.value;
};

const handleAddTransaction = () => {
  router.push('/add-transaction');
};

const handleAddCustomer = () => {
  router.push('/add-customer');
};
</script>

<template>
  <div class="fixed bottom-6 right-6 z-40 flex flex-col items-center space-y-2">
    <transition
      enter-active-class="transition ease-out duration-100 transform"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75 transform"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="showSpeedDial" class="flex flex-col items-center space-y-2">
        <button
          @click="handleAddCustomer"
          class="btn-tertiary flex items-center space-x-2 !rounded-full !px-5 !py-3 shadow-lg"
          aria-label="Add Customer"
        >
          <span class="text-sm font-medium">Customer</span>
          <i class="i-heroicons-user-plus h-5 w-5"></i>
        </button>
        <button
          @click="handleAddTransaction"
          class="btn bg-lime hover:bg-lime/80 focus:ring-lime flex items-center space-x-2 !rounded-full !px-5 !py-3 text-white shadow-lg"
          aria-label="Add Transaction"
        >
          <span class="text-sm font-medium">Transaction</span>
          <i class="i-heroicons-currency-dollar h-5 w-5"></i>
        </button>
      </div>
    </transition>
    <button
      @click="toggleSpeedDial"
      class="btn-primary !rounded-full !p-4 shadow-xl"
      aria-label="Toggle Add Menu"
    >
      <i
        :class="showSpeedDial ? 'i-heroicons-x-mark' : 'i-heroicons-plus'"
        class="h-6 w-6 transition-transform duration-200 ease-in-out"
        :style="{ transform: showSpeedDial ? 'rotate(45deg)' : 'rotate(0)' }"
      ></i>
    </button>
  </div>
</template>
