<script setup lang="ts">
/**
 * AddTransactionView
 *
 * View for adding a new transaction (credit or repayment) for a customer.
 * - Fetches customers from Firestore for the current user.
 * - Submits a new transaction to Firestore.
 * - Uses UnoCSS utility classes for styling.
 *
 * @file AddTransactionView.vue
 * @module views/AddTransactionView
 */

import { useAuth } from '@/composables/useAuth';
import { ToastMessages } from '@/constants/toastMessages.constants';
import { TransactionTypeEnum } from '@/enums/transaction.enums';
import { db } from '@/firebase';
import type { Customer } from '@/interfaces/customer.interfaces';
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const { currentUser } = useAuth();
const customers = ref<Customer[]>([]);
const toast = useToast();
const router = useRouter();

onMounted(() => {
  if (!currentUser.value) {
    return;
  }

  const q = query(
    collection(db, 'customers'),
    where('userId', '==', currentUser.value.uid)
  );

  onSnapshot(q, (snapshot) => {
    customers.value = snapshot.docs.map(
      (doc) => ({ ...doc.data(), uid: doc.id }) as Customer
    );
  });
});

const form = ref({
  customerId: '',
  type: TransactionTypeEnum.Credit,
  amount: '',
  note: '',
});

const isSubmitting = ref(false);

function resetForm() {
  form.value = {
    customerId: '',
    type: TransactionTypeEnum.Credit,
    amount: '',
    note: '',
  };
}

async function handleSubmit() {
  if (!currentUser.value) {
    toast.error(ToastMessages.AuthRequired);
    return;
  }

  const parsedAmount = Number.parseFloat(form.value.amount);
  if (
    !form.value.customerId ||
    Number.isNaN(parsedAmount) ||
    parsedAmount <= 0
  ) {
    toast.error(ToastMessages.ValidationError);
    return;
  }

  isSubmitting.value = true;
  try {
    await addDoc(collection(db, 'transactions'), {
      customerId: form.value.customerId,
      type: form.value.type,
      amount: parsedAmount,
      note: form.value.note || null,
      createdAt: serverTimestamp(),
      updatedAt: null,
      userId: currentUser.value.uid,
    });

    toast.success(ToastMessages.TransactionAddSuccess);
    resetForm();
    router.push('/');
  } catch {
    toast.error(ToastMessages.TransactionAddFailed);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="bg-surface mx-auto mt-10 max-w-md rounded p-6 shadow">
    <h1 class="text-primary mb-4 text-xl font-bold">Add Transaction</h1>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="form-label" for="customer">Customer</label>
        <select
          v-model="form.customerId"
          id="customer"
          required
          class="form-input-base"
        >
          <option value="" disabled>Select customer</option>
          <option v-for="c in customers" :key="c.uid" :value="c.uid">
            {{ c.name }}
          </option>
        </select>
      </div>

      <div>
        <label class="form-label" for="type">Type</label>
        <select v-model="form.type" id="type" required class="form-input-base">
          <option :value="TransactionTypeEnum.Credit">Credit</option>
          <option :value="TransactionTypeEnum.Repayment">Repayment</option>
        </select>
      </div>

      <div>
        <label class="form-label" for="amount">Amount</label>
        <input
          v-model="form.amount"
          id="amount"
          type="number"
          min="0.01"
          step="0.01"
          required
          class="form-input-base"
          placeholder="e.g. 100.00"
        />
        <!-- TODO: Add validation for max value, decimal places -->
      </div>

      <div>
        <label class="form-label" for="note">Note (optional)</label>
        <input
          v-model="form.note"
          id="note"
          type="text"
          class="form-input-base"
          placeholder="Short description"
        />
      </div>

      <button type="submit" class="btn-primary" :disabled="isSubmitting">
        <span v-if="isSubmitting">Saving...</span>
        <span v-else>Add Transaction</span>
      </button>
      <!-- TODO: Add support for editing or deleting transactions -->
      <!-- TODO: Add category or type for transactions (beyond credit/repayment) -->
    </form>
  </div>
</template>
