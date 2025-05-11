<template>
  <LoadingOverlay />
  <AppLayout>
    <div class="card-lg">
      <h1 class="text-primary mb-6 text-center text-2xl font-bold">
        Transactions
      </h1>
      <div class="mb-6 flex items-center justify-between">
        <BackButton />
        <button
          @click="goToAddTransaction"
          class="btn-primary flex !w-auto items-center gap-2"
        >
          <i class="i-heroicons-plus-circle icon-btn h-5 w-5"></i>
          Add Transaction
        </button>
      </div>
      <div class="mb-4 flex flex-col items-center gap-2">
        <label for="customerFilter" class="w-full text-center font-medium"
          >Filter by Customer:</label
        >
        <select
          id="customerFilter"
          v-model="selectedCustomerId"
          class="material-select mx-auto w-48"
        >
          <option value="">All</option>
          <option v-for="c in customers" :key="c.uid" :value="c.uid">
            {{ c.name }}
          </option>
        </select>
      </div>
      <div
        v-if="filteredTransactions.length === 0"
        class="flex flex-col items-center justify-center py-16"
      >
        <i class="i-heroicons-banknotes text-primary mb-4 h-12 w-12"></i>
        <div class="text-on-surface-70 mb-2 text-lg font-medium">
          No transactions found
        </div>
        <div class="text-on-surface-50 mb-4 text-sm">
          Add your first transaction to get started.
        </div>
      </div>
      <ul v-else class="divide-y divide-gray-200">
        <li
          v-for="tx in filteredTransactions"
          :key="tx.uid"
          class="flex items-center justify-between py-4"
        >
          <div>
            <div class="font-semibold">
              {{ getCustomerName(tx.customerId) }}
              <span
                class="ml-2 rounded px-2 py-0.5 text-xs"
                :class="
                  tx.type === TransactionTypeEnum.Credit
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'
                "
              >
                {{
                  tx.type === TransactionTypeEnum.Credit
                    ? 'Credit'
                    : 'Repayment'
                }}
              </span>
            </div>
            <div class="text-sm text-gray-500">
              Amount: R{{ tx.amount.toFixed(2) }}
            </div>
            <div class="text-xs text-gray-400">
              {{ formatDate(tx.createdAt) }}
              <span v-if="tx.note"> | {{ tx.note }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <FabSpeedDial />
  </AppLayout>
</template>

<script setup lang="ts">
/**
 * TransactionsView.vue
 * Lists all transactions for the current user, with filtering by customer.
 */
import BackButton from '@/components/BackButton.vue';
import FabSpeedDial from '@/components/FabSpeedDial.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import { useAuth } from '@/composables/useAuth';
import { useLoading } from '@/composables/useLoading';
import { TransactionTypeEnum } from '@/enums/transaction.enums';
import type { Customer } from '@/interfaces/customer.interfaces';
import type { Transaction } from '@/interfaces/transaction.interfaces';
import AppLayout from '@/layouts/AppLayout.vue';
import { formatDate } from '@/utilities/formatUtils';
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const transactions = ref<Transaction[]>([]);
const customers = ref<Customer[]>([]);
const selectedCustomerId = ref('');
const router = useRouter();
const db = getFirestore();
const { currentUser } = useAuth();
const { setLoading } = useLoading();

function goToAddTransaction() {
  router.push('/add-transaction');
}

function getCustomerName(customerId: string) {
  const customer = customers.value.find((c) => c.uid === customerId);

  return customer ? customer.name : 'Unknown';
}

const filteredTransactions = computed(() => {
  if (!selectedCustomerId.value) {
    return transactions.value;
  }

  return transactions.value.filter(
    (tx) => tx.customerId === selectedCustomerId.value
  );
});

/**
 * Fetches all customers for the current user from Firestore.
 */
async function fetchCustomers() {
  if (!currentUser.value) {
    customers.value = [];
    return;
  }

  const q = query(
    collection(db, 'customers'),
    where('userId', '==', currentUser.value.uid),
    where('isDeleted', '==', false)
  );
  const snapshot = await getDocs(q);
  customers.value = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      uid: doc.id,
      userId: data.userId,
      name: data.name,
      cellphoneNumber: data.cellphoneNumber,
      balance: data.balance,
      address: data.address ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt ?? null,
      creditScore: data.creditScore ?? null,
      defaultCreditTermDays: data.defaultCreditTermDays ?? null,
      lastRepaymentAt: data.lastRepaymentAt ?? null,
      isDeleted: data.isDeleted ?? false,
    };
  });
}

/**
 * Fetches all transactions for the current user from Firestore.
 */
async function fetchTransactions() {
  if (!currentUser.value) {
    transactions.value = [];
    setLoading(false);
    return;
  }
  setLoading(true);
  try {
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', currentUser.value.uid),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    transactions.value = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        uid: doc.id,
        customerId: data.customerId,
        type: data.type,
        amount: data.amount,
        note: data.note ?? null,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt ?? null,
        dueByDate: data.dueByDate ?? null,
        repaidAt: data.repaidAt ?? null,
      };
    });
  } catch (err) {
    console.error('Error fetching transactions:', err);
    transactions.value = [];
  } finally {
    setLoading(false);
  }
}

onMounted(async () => {
  await fetchCustomers();
  await fetchTransactions();
});
</script>

<style scoped>
.btn {
}
</style>
