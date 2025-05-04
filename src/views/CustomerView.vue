<template>
  <AppLayout>
    <div class="card-lg">
      <div class="mb-6 flex items-center justify-between">
        <BackButton />
      </div>
      <h1 class="text-primary mb-6 text-center text-2xl font-bold">
        Customer Details
      </h1>
      <div v-if="loading" class="text-on-surface-60 py-8 text-center">
        Loading customer...
      </div>
      <div v-else-if="customer">
        <form @submit.prevent class="space-y-4">
          <!-- Name Field -->
          <div>
            <label class="mb-1 block text-sm font-medium">Name</label>
            <div class="flex items-center gap-2">
              <input
                v-model="form.name"
                :readonly="editField !== 'name'"
                class="input w-full"
              />
              <button
                v-if="editField !== 'name'"
                type="button"
                class="btn-link text-sm"
                @click="startEdit('name')"
              >
                <span class="i-heroicons-pencil mr-1 align-middle"></span>
                Edit
              </button>
              <div v-else class="flex gap-1">
                <button
                  type="button"
                  class="btn-primary !w-auto text-sm"
                  @click="saveField('name')"
                >
                  Save
                </button>
                <button
                  type="button"
                  class="btn-secondary !w-auto text-sm"
                  @click="cancelEdit()"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          <!-- Cellphone Number Field -->
          <div>
            <label class="mb-1 block text-sm font-medium"
              >Cellphone Number</label
            >
            <div class="flex items-center gap-2">
              <input
                v-model="form.cellphoneNumber"
                :readonly="editField !== 'cellphoneNumber'"
                class="input w-full"
              />
              <button
                v-if="editField !== 'cellphoneNumber'"
                type="button"
                class="btn-link text-sm"
                @click="startEdit('cellphoneNumber')"
              >
                <span class="i-heroicons-pencil mr-1 align-middle"></span>
                Edit
              </button>
              <div v-else class="flex gap-1">
                <button
                  type="button"
                  class="btn-primary !w-auto text-sm"
                  @click="saveField('cellphoneNumber')"
                >
                  Save
                </button>
                <button
                  type="button"
                  class="btn-secondary !w-auto text-sm"
                  @click="cancelEdit()"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          <!-- Address Field -->
          <div>
            <label class="mb-1 block text-sm font-medium">Address</label>
            <div class="flex items-center gap-2">
              <input
                v-model="form.address"
                :readonly="editField !== 'address'"
                class="input w-full"
                :placeholder="!form.address ? 'N/A' : ''"
              />
              <button
                v-if="editField !== 'address'"
                type="button"
                class="btn-link text-sm"
                @click="startEdit('address')"
              >
                <span class="i-heroicons-pencil mr-1 align-middle"></span>
                Edit
              </button>
              <div v-else class="flex gap-1">
                <button
                  type="button"
                  class="btn-primary !w-auto text-sm"
                  @click="saveField('address')"
                >
                  Save
                </button>
                <button
                  type="button"
                  class="btn-secondary !w-auto text-sm"
                  @click="cancelEdit()"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          <!-- Credit Score -->
          <div>
            <label class="mb-1 block text-sm font-medium">Credit Score</label>
            <div class="text-lg font-semibold">
              {{
                customer.creditScore === null
                  ? 'Calculating, check back later'
                  : customer.creditScore
              }}
            </div>
          </div>
        </form>
        <div v-if="!customer.deletedAt" class="mt-6 flex justify-end">
          <button
            class="bg-error text-on-primary hover:bg-error/80 flex items-center rounded px-4 py-2 text-sm font-medium"
            @click="showDeleteConfirm"
          >
            <span class="i-heroicons-trash mr-1 align-middle"></span>
            Delete Customer
          </button>
        </div>
        <div v-else class="mt-6 text-center font-semibold text-red-600">
          This customer has been deleted.
        </div>
        <div class="mt-8">
          <h2 class="text-primary mb-4 text-center text-xl font-bold">
            Transactions
          </h2>
          <div
            v-if="transactionsLoading"
            class="text-on-surface-60 py-4 text-center"
          >
            Loading transactions...
          </div>
          <ul
            v-else-if="transactions.length"
            class="mx-auto max-w-lg divide-y divide-gray-200"
          >
            <li v-for="tx in transactions" :key="tx.uid" class="py-3">
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-semibold">
                    {{ tx.type === 'credit' ? 'Credit' : 'Repayment' }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ tx.createdAt?.toDate().toLocaleString() }}
                  </div>
                  <div class="text-xs text-gray-400" v-if="tx.note">
                    Note: {{ tx.note }}
                  </div>
                </div>
                <div
                  :class="
                    tx.type === 'credit' ? 'text-red-600' : 'text-green-600'
                  "
                >
                  {{ tx.type === 'credit' ? '+' : '-' }}R{{
                    tx.amount.toFixed(2)
                  }}
                </div>
              </div>
            </li>
          </ul>
          <div v-else class="text-on-surface-60 py-4 text-center">
            No transactions found.
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
  <Teleport to="body">
    <div
      v-if="isRevealed"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      @click.self="cancel()"
    >
      <div class="bg-surface w-full max-w-md rounded-lg p-6 shadow-xl">
        <h3 class="text-error mb-4 text-lg font-bold">Delete Customer?</h3>
        <p class="text-on-surface/80 mb-6 text-sm">
          Are you sure you want to delete this customer? This action cannot be
          undone.
        </p>
        <div class="flex justify-center space-x-3">
          <button @click="cancel()" class="btn-primary !w-auto text-sm">
            Cancel
          </button>
          <button
            @click="
              confirm(true);
              confirmDeleteCustomer(true);
            "
            :disabled="deletePending"
            class="bg-error text-on-primary hover:bg-error/80 rounded px-4 py-2 text-sm font-medium"
          >
            <span v-if="deletePending">Deleting...</span>
            <span v-else>Yes, Delete</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import BackButton from '@/components/BackButton.vue';
import type { Customer } from '@/interfaces/customer.interfaces';
import type { Transaction } from '@/interfaces/transaction.interfaces';
import AppLayout from '@/layouts/AppLayout.vue';
import type { EditableField } from '@/types/forms.types';
import { useConfirmDialog } from '@vueuse/core';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';

const route = useRoute();
const db = getFirestore();
const customerId = route.params.id as string;
const customer = ref<Customer | null>(null);
const loading = ref(true);
const form = ref({ name: '', cellphoneNumber: '', address: '' });
const editField = ref<EditableField | null>(null);

const transactions = ref<Transaction[]>([]);
const transactionsLoading = ref(true);

const toast = useToast();
const { isRevealed, reveal, confirm, cancel } = useConfirmDialog();
const deletePending = ref(false);

async function fetchCustomer() {
  loading.value = true;
  try {
    const docRef = doc(db, 'customers', customerId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      customer.value = { uid: docSnap.id, ...docSnap.data() } as Customer;
      form.value.name = customer.value.name;
      form.value.cellphoneNumber = customer.value.cellphoneNumber;
      form.value.address = customer.value.address ?? '';
    } else {
      customer.value = null;
    }
  } finally {
    loading.value = false;
  }
}

async function fetchTransactions() {
  transactionsLoading.value = true;
  try {
    const q = query(
      collection(db, 'transactions'),
      where('customerId', '==', customerId)
    );
    const querySnapshot = await getDocs(q);
    transactions.value = querySnapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    })) as Transaction[];
  } finally {
    transactionsLoading.value = false;
  }
}

function startEdit(field: EditableField) {
  editField.value = field;
}

function cancelEdit() {
  editField.value = null;
  if (customer.value) {
    form.value.name = customer.value.name;
    form.value.cellphoneNumber = customer.value.cellphoneNumber;
    form.value.address = customer.value.address ?? '';
  }
}

async function saveField(field: EditableField) {
  if (!customer.value) {
    return;
  }

  await updateDoc(doc(db, 'customers', customerId), {
    [field]: form.value[field],
  });
  editField.value = null;
  await fetchCustomer();
}

async function deleteCustomer() {
  if (!customer.value) {
    return;
  }

  try {
    await updateDoc(doc(db, 'customers', customerId), {
      deletedAt: serverTimestamp(),
    });
    toast.success('Customer deleted.');
    await fetchCustomer();
  } catch {
    toast.error('Failed to delete customer.');
  }
}

function showDeleteConfirm() {
  reveal();
}

async function confirmDeleteCustomer(choice: boolean) {
  if (!choice) return;
  deletePending.value = true;
  await deleteCustomer();
  deletePending.value = false;
}

onMounted(() => {
  fetchCustomer();
  fetchTransactions();
});
</script>

<style scoped>
.input {
  @apply bg-surface text-on-surface w-full rounded border px-3 py-2;
}
.btn {
  @apply bg-primary text-on-primary hover:bg-primary-dark rounded px-4 py-2 transition;
}
</style>
