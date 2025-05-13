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
          <div class="mb-4 border-b border-gray-200 pb-4">
            <div
              class="flex items-center justify-between"
              v-if="!isEditingName"
            >
              <div>
                <p class="text-on-surface/80 text-sm font-medium">Name:</p>
                <span class="text-on-surface">{{ customer.name }}</span>
              </div>
              <button
                type="button"
                class="btn-link text-sm"
                @click="startEdit('name')"
              >
                <span class="i-heroicons-pencil mr-1 align-middle"></span>
                Edit
              </button>
            </div>
            <div v-else class="space-y-3">
              <label class="form-label text-sm">Name</label>
              <input
                v-model="nameInput"
                type="text"
                class="form-input-base form-input-valid bg-surface text-on-surface"
                placeholder="Enter name"
              />
              <div class="mt-2 flex space-x-2">
                <button
                  type="button"
                  @click="saveField('name')"
                  class="btn-primary !w-auto text-sm"
                >
                  Save
                </button>
                <button
                  type="button"
                  @click="cancelEdit('name')"
                  class="btn-secondary !w-auto text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          <!-- Cellphone Number Field -->
          <div class="mb-4 border-b border-gray-200 pb-4">
            <div
              class="flex items-center justify-between"
              v-if="!isEditingCellphone"
            >
              <div>
                <p class="text-on-surface/80 text-sm font-medium">
                  Cellphone Number:
                </p>
                <span class="text-on-surface">{{
                  customer.cellphoneNumber
                }}</span>
              </div>
              <button
                type="button"
                class="btn-link text-sm"
                @click="startEdit('cellphoneNumber')"
              >
                <span class="i-heroicons-pencil mr-1 align-middle"></span>
                Edit
              </button>
            </div>
            <div v-else class="space-y-3">
              <label class="form-label text-sm">Cellphone Number</label>
              <input
                v-model="cellphoneInput"
                type="tel"
                class="form-input-base form-input-valid bg-surface text-on-surface"
                placeholder="Enter cellphone number"
              />
              <div class="mt-2 flex space-x-2">
                <button
                  type="button"
                  @click="saveField('cellphoneNumber')"
                  class="btn-primary !w-auto text-sm"
                >
                  Save
                </button>
                <button
                  type="button"
                  @click="cancelEdit('cellphoneNumber')"
                  class="btn-secondary !w-auto text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          <!-- Address Field -->
          <div class="mb-4 border-b border-gray-200 pb-4">
            <div
              class="flex items-center justify-between"
              v-if="!isEditingAddress"
            >
              <div>
                <p class="text-on-surface/80 text-sm font-medium">Address:</p>
                <span class="text-on-surface">{{
                  customer.address || 'N/A'
                }}</span>
              </div>
              <button
                type="button"
                class="btn-link text-sm"
                @click="startEdit('address')"
              >
                <span class="i-heroicons-pencil mr-1 align-middle"></span>
                Edit
              </button>
            </div>
            <div v-else class="space-y-3">
              <label class="form-label text-sm">Address</label>
              <input
                v-model="addressInput"
                type="text"
                class="form-input-base form-input-valid bg-surface text-on-surface"
                placeholder="Enter address"
              />
              <div class="mt-2 flex space-x-2">
                <button
                  type="button"
                  @click="saveField('address')"
                  class="btn-primary !w-auto text-sm"
                >
                  Save
                </button>
                <button
                  type="button"
                  @click="cancelEdit('address')"
                  class="btn-secondary !w-auto text-sm"
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
        <div v-if="!customer.isDeleted" class="mt-6 flex justify-end">
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
                    {{ formatDate(tx.createdAt) }}
                  </div>
                  <div class="text-xs text-gray-400" v-if="tx.note">
                    Note:
                    <span class="truncate-ellipsis block max-w-[24rem]">{{
                      tx.note
                    }}</span>
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
/**
 * CustomerView.vue
 * Displays and allows editing of a single customer's details and their transactions.
 */
import BackButton from '@/components/BackButton.vue';
import { useAuth } from '@/composables/useAuth';
import type { Customer } from '@/interfaces/customer.interfaces';
import type { Transaction } from '@/interfaces/transaction.interfaces';
import AppLayout from '@/layouts/AppLayout.vue';
import type { EditableField } from '@/types/forms.types';
import { formatDate } from '@/utilities/formatUtils';
import { useConfirmDialog } from '@vueuse/core';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
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

const isEditingName = ref(false);
const isEditingCellphone = ref(false);
const isEditingAddress = ref(false);

const nameInput = ref('');
const cellphoneInput = ref('');
const addressInput = ref('');

const { currentUser } = useAuth();

/**
 * Fetches customer details from Firestore.
 */
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

/**
 * Fetches transactions for the customer from Firestore.
 */
async function fetchTransactions() {
  transactionsLoading.value = true;
  try {
    if (!currentUser.value || !currentUser.value.uid) {
      transactions.value = [];
      transactionsLoading.value = false;

      return;
    }
    const q = query(
      collection(db, 'transactions'),
      where('customerId', '==', customerId),
      where('userId', '==', currentUser.value.uid)
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

/**
 * Start editing a specific field for the customer.
 */
function startEdit(field: EditableField) {
  editField.value = field;
  if (field === 'name') {
    isEditingName.value = true;
    nameInput.value = form.value.name;
  } else if (field === 'cellphoneNumber') {
    isEditingCellphone.value = true;
    cellphoneInput.value = form.value.cellphoneNumber;
  } else if (field === 'address') {
    isEditingAddress.value = true;
    addressInput.value = form.value.address;
  }
}

/**
 * Cancel editing a specific field and revert changes.
 */
function cancelEdit(field: EditableField) {
  editField.value = null;
  if (field === 'name') {
    isEditingName.value = false;
  } else if (field === 'cellphoneNumber') {
    isEditingCellphone.value = false;
  } else if (field === 'address') {
    isEditingAddress.value = false;
  }
  if (customer.value) {
    form.value.name = customer.value.name;
    form.value.cellphoneNumber = customer.value.cellphoneNumber;
    form.value.address = customer.value.address ?? '';
  }
}

/**
 * Save changes to a specific field for the customer.
 */
async function saveField(field: EditableField) {
  if (!customer.value) {
    return;
  }

  await updateDoc(doc(db, 'customers', customerId), {
    [field]: form.value[field],
  });
  editField.value = null;
  if (field === 'name') {
    isEditingName.value = false;
  } else if (field === 'cellphoneNumber') {
    isEditingCellphone.value = false;
  } else if (field === 'address') {
    isEditingAddress.value = false;
  }
  await fetchCustomer();
}

/**
 * Soft-delete the customer in Firestore.
 */
async function deleteCustomer() {
  if (!customer.value) {
    return;
  }

  try {
    await updateDoc(doc(db, 'customers', customerId), {
      isDeleted: true,
    });
    toast.success('Customer deleted.');
    await fetchCustomer();
  } catch {
    toast.error('Failed to delete customer.');
  }
}

/**
 * Show the delete confirmation dialog.
 */
function showDeleteConfirm() {
  reveal();
}

/**
 * Handle confirmation of customer deletion.
 */
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
