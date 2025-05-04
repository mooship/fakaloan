<template>
  <AppLayout>
    <div class="card-lg">
      <div class="mb-6 flex items-center justify-between">
        <BackButton />
        <button
          @click="goToAddCustomer"
          class="btn-primary flex !w-auto items-center gap-2"
        >
          <i class="i-heroicons-user-plus icon-btn h-5 w-5"></i>
          Add Customer
        </button>
      </div>
      <h1 class="text-primary mb-6 text-center text-2xl font-bold">
        Customers
      </h1>
      <div v-if="loading" class="text-on-surface-60 py-8 text-center">
        Loading customers...
      </div>
      <div v-else>
        <div
          v-if="customers.length === 0"
          class="flex flex-col items-center justify-center py-16"
        >
          <i class="i-heroicons-user-group text-primary mb-4 h-12 w-12"></i>
          <div class="text-on-surface-70 mb-2 text-lg font-medium">
            No customers found
          </div>
          <div class="text-on-surface-50 mb-4 text-sm">
            Add your first customer to get started.
          </div>
        </div>
        <ul v-else class="divide-y divide-gray-200">
          <li
            v-for="customer in customers"
            :key="customer.uid"
            class="flex items-center justify-between py-4"
          >
            <div>
              <div class="font-semibold">{{ customer.name }}</div>
              <div class="text-sm text-gray-500">
                {{ formatPhoneNumber(customer.cellphoneNumber) }}
              </div>
              <div class="text-xs text-gray-400">
                Balance: {{ customer.balance }}
              </div>
            </div>
            <button
              class="btn btn-primary ml-auto !w-auto"
              @click="goToCustomer(customer.uid)"
            >
              View
            </button>
          </li>
        </ul>
      </div>
    </div>
    <FabSpeedDial />
  </AppLayout>
</template>

<script setup lang="ts">
import BackButton from '@/components/BackButton.vue';
import FabSpeedDial from '@/components/FabSpeedDial.vue';
import { useAuth } from '@/composables/useAuth';
import type { Customer } from '@/interfaces/customer.interfaces';
import AppLayout from '@/layouts/AppLayout.vue';
import { formatPhoneNumber } from '@/utilities/formatUtils';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const customers = ref<Customer[]>([]);
const loading = ref(true);
const router = useRouter();
const db = getFirestore();
const { currentUser } = useAuth();

function goToCustomer(uid: string) {
  router.push(`/customers/${uid}`);
}

function goToAddCustomer() {
  router.push('/add-customer');
}

async function fetchCustomers() {
  if (!currentUser.value) {
    customers.value = [];
    loading.value = false;
    return;
  }
  loading.value = true;
  try {
    const q = query(
      collection(db, 'customers'),
      where('userId', '==', currentUser.value.uid)
    );
    const querySnapshot = await getDocs(q);
    customers.value = querySnapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    })) as Customer[];
  } catch {
    customers.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(fetchCustomers);
</script>

<style scoped>
.btn {
  @apply bg-primary text-on-primary hover:bg-primary-dark rounded px-4 py-2 transition;
}
</style>
