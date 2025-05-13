/** * HomeView.vue * Dashboard and quick access to Fakaloan features for
authenticated users. * Handles logout and displays user info. */
<script setup lang="ts">
import FabSpeedDial from '@/components/FabSpeedDial.vue';
import { useAuth } from '@/composables/useAuth';
import { TransactionTypeEnum } from '@/enums/transaction.enums';
import { db } from '@/firebase';
import type { Customer } from '@/interfaces/customer.interfaces';
import type { Transaction } from '@/interfaces/transaction.interfaces';
import AppLayout from '@/layouts/AppLayout.vue';
import { useHead } from '@vueuse/head';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { computed, onMounted, ref } from 'vue';

useHead({
  title: 'Home | Fakaloan',
  meta: [
    {
      name: 'description',
      content: 'Dashboard and quick access to Fakaloan features.',
    },
    { property: 'og:title', content: 'Home | Fakaloan' },
    {
      property: 'og:description',
      content: 'Dashboard and quick access to Fakaloan features.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: window.location.href },
    { property: 'og:site_name', content: 'Fakaloan' },
  ],
});
const { currentUser, isLoading } = useAuth();

const customers = ref<Customer[]>([]);
const transactions = ref<Transaction[]>([]);

const analyticsLoading = ref(true);

const totalCustomers = computed(() => customers.value.length);
const totalOutstanding = computed(() =>
  customers.value.reduce((sum, c) => sum + (c.balance || 0), 0)
);
const totalTransactions = computed(() => transactions.value.length);
const activeLoans = computed(
  () =>
    transactions.value.filter(
      (tx) => tx.type === TransactionTypeEnum.Credit && !tx.repaidAt
    ).length
);
const recentTransactions = computed(() => transactions.value.slice(0, 5));

async function fetchAnalytics() {
  analyticsLoading.value = true;
  if (!currentUser.value) {
    analyticsLoading.value = false;
    return;
  }

  const qCustomers = query(
    collection(db, 'customers'),
    where('userId', '==', currentUser.value.uid),
    where('isDeleted', '==', false)
  );
  const customersSnap = await getDocs(qCustomers);
  customers.value = customersSnap.docs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
  })) as Customer[];

  const qTransactions = query(
    collection(db, 'transactions'),
    orderBy('createdAt', 'desc')
  );
  const transactionsSnap = await getDocs(qTransactions);
  transactions.value = transactionsSnap.docs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
  })) as Transaction[];
  analyticsLoading.value = false;
}

onMounted(fetchAnalytics);

function formatTransactionDate(date: unknown): string {
  if (
    date &&
    typeof date === 'object' &&
    'toDate' in date &&
    typeof (date as { toDate: () => Date }).toDate === 'function'
  ) {
    return (date as { toDate: () => Date }).toDate().toLocaleDateString();
  }
  if (
    date &&
    typeof date === 'object' &&
    'seconds' in date &&
    typeof (date as { seconds: number }).seconds === 'number'
  ) {
    return new Date(
      (date as { seconds: number }).seconds * 1000
    ).toLocaleDateString();
  }
  return '';
}
</script>

<template>
  <AppLayout>
    <div class="card-main app-home-hero text-center">
      <h1 class="text-primary mb-4 text-3xl font-extrabold tracking-tight">
        Welcome to Fakaloan!
      </h1>
      <div v-if="currentUser">
        <p class="text-on-surface mb-2 text-lg font-medium">
          Welcome{{
            currentUser.displayName ? `, ${currentUser.displayName}` : ''
          }}!
        </p>
        <p class="text-on-surface text-base">You are logged in as:</p>
        <p class="text-primary text-lg font-semibold">
          {{ currentUser.email }}
        </p>
      </div>
      <div v-else-if="isLoading && !currentUser">
        <p class="text-on-surface-60 text-lg">Loading user information...</p>
      </div>
    </div>
    <div v-if="analyticsLoading" class="my-8 text-center">
      <span class="text-on-surface-60 text-lg">Loading analytics...</span>
    </div>
    <div
      v-else
      class="my-8 grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-4"
    >
      <div class="card-analytics app-analytics-card">
        <div class="text-lg font-semibold">Total Customers</div>
        <div class="text-primary text-3xl font-bold">{{ totalCustomers }}</div>
      </div>
      <div class="card-analytics app-analytics-card">
        <div class="text-lg font-semibold">Outstanding Balance</div>
        <div class="text-primary text-3xl font-bold">
          R{{ totalOutstanding.toLocaleString() }}
        </div>
      </div>
      <div class="card-analytics app-analytics-card">
        <div class="text-lg font-semibold">Active Loans</div>
        <div class="text-primary text-3xl font-bold">{{ activeLoans }}</div>
      </div>
      <div class="card-analytics app-analytics-card">
        <div class="text-lg font-semibold">Total Transactions</div>
        <div class="text-primary text-3xl font-bold">
          {{ totalTransactions }}
        </div>
      </div>
      <div class="card-analytics app-analytics-card col-span-2 lg:col-span-4">
        <div class="mb-2 text-lg font-semibold">Recent Transactions</div>
        <ul>
          <li
            v-for="tx in recentTransactions"
            :key="tx.uid"
            class="flex justify-between border-b border-gray-100 py-2 last:border-b-0"
          >
            <span>
              <span
                :class="
                  tx.type === 'credit' ? 'text-red-600' : 'text-green-600'
                "
                class="font-semibold"
              >
                {{ tx.type === 'credit' ? 'Credit' : 'Repayment' }}
              </span>
              - R{{ tx.amount.toFixed(2) }}
            </span>
            <span class="ml-4 text-xs text-gray-500">
              {{ formatTransactionDate(tx.createdAt) }}
            </span>
          </li>
          <li v-if="recentTransactions.length === 0" class="text-on-surface-60">
            No recent transactions
          </li>
        </ul>
      </div>
    </div>
    <FabSpeedDial />
  </AppLayout>
</template>
