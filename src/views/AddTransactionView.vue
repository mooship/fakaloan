<script setup lang="ts">
import BackButton from '@/components/BackButton.vue';
import { useAuth } from '@/composables/useAuth';
import { useLoading } from '@/composables/useLoading';
import { ToastMessages } from '@/constants/toastMessages.constants';
import { TransactionTypeEnum } from '@/enums/transaction.enums';
import { db } from '@/firebase';
import type { Customer } from '@/interfaces/customer.interfaces';
import AppLayout from '@/layouts/AppLayout.vue';
import { useHead } from '@vueuse/head';
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

const { currentUser, isLoading } = useAuth();
const { setLoading } = useLoading();
const router = useRouter();
const toast = useToast();

const customers = ref<Customer[]>([]);
const form = ref({
  customerId: '',
  type: TransactionTypeEnum.Credit,
  amount: '',
  note: '',
});
const submitting = ref(false);

useHead({
  title: 'Add Transaction | Fakaloan',
  meta: [
    {
      name: 'description',
      content: 'Add a new transaction to your Fakaloan account.',
    },
    { property: 'og:title', content: 'Add Transaction | Fakaloan' },
    {
      property: 'og:description',
      content: 'Add a new transaction to your Fakaloan account.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: window.location.href },
    { property: 'og:site_name', content: 'Fakaloan' },
  ],
});

onMounted(() => {
  if (!currentUser.value) {
    return;
  }

  const q = query(
    collection(db, 'customers'),
    where('userId', '==', currentUser.value.uid),
    where('isDeleted', '==', false)
  );
  onSnapshot(q, (snapshot) => {
    customers.value = snapshot.docs.map((doc) => ({
      uid: doc.id,
      userId: doc.data().userId,
      name: doc.data().name,
      cellphoneNumber: doc.data().cellphoneNumber,
      balance: doc.data().balance,
      address: doc.data().address ?? null,
      createdAt: doc.data().createdAt,
      updatedAt: doc.data().updatedAt ?? null,
      creditScore: doc.data().creditScore ?? null,
      defaultCreditTermDays: doc.data().defaultCreditTermDays ?? null,
      lastRepaymentAt: doc.data().lastRepaymentAt ?? null,
      isDeleted: doc.data().isDeleted ?? false,
    }));
  });
});

const resetForm = () => {
  form.value = {
    customerId: '',
    type: TransactionTypeEnum.Credit,
    amount: '',
    note: '',
  };
};

const handleSubmit = async () => {
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
  setLoading(true);
  submitting.value = true;
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
    submitting.value = false;
    setLoading(false);
  }
};
</script>

<template>
  <AppLayout>
    <div class="card-md">
      <h1 class="text-primary mb-6 text-center text-2xl font-bold">
        Add Transaction
      </h1>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="form-label" for="customer">Customer</label>
          <select
            v-model="form.customerId"
            id="customer"
            required
            class="material-select"
          >
            <option value="" disabled>Select customer</option>
            <option v-for="c in customers" :key="c.uid" :value="c.uid">
              {{ c.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="form-label" for="type">Type</label>
          <select
            v-model="form.type"
            id="type"
            required
            class="material-select"
          >
            <option :value="TransactionTypeEnum.Credit">Credit</option>
            <option :value="TransactionTypeEnum.Repayment">Repayment</option>
          </select>
        </div>
        <div>
          <label class="form-label" for="amount">Amount</label>
          <div class="relative flex items-center">
            <span class="absolute left-3 text-gray-500">R</span>
            <input
              v-model="form.amount"
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              required
              class="form-input-base bg-surface text-on-surface focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-gray-300 py-2 pl-8 pr-3 shadow-sm focus:ring-2"
              placeholder="e.g. 100.00"
            />
          </div>
        </div>
        <div>
          <label class="form-label" for="note">Note (optional)</label>
          <input
            v-model="form.note"
            id="note"
            type="text"
            class="form-input-base bg-surface text-on-surface focus:border-primary focus:ring-primary/20 rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-2"
            placeholder="Short description"
          />
        </div>
        <div>
          <button
            type="submit"
            class="btn-primary mx-auto block w-auto"
            :disabled="submitting || isLoading"
          >
            {{ submitting ? 'Saving...' : 'Add Transaction' }}
          </button>
        </div>
      </form>
      <div class="section-divider mt-8 flex justify-center">
        <BackButton />
      </div>
    </div>
  </AppLayout>
</template>
