<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import { useLoading } from '@/composables/useLoading';
import { PHONE_NUMBER_REGEX } from '@/constants/regex.constants';
import { db } from '@/firebase';
import AppLayout from '@/layouts/AppLayout.vue';
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import * as yup from 'yup';

const { currentUser, isLoading } = useAuth();
const router = useRouter();
const toast = useToast();
const { setLoading } = useLoading();

const form = ref({
  name: '',
  cellphoneNumber: '',
  address: '',
});

const errors = ref<{ [key: string]: string }>({});
const submitting = ref(false);

const schema = yup.object({
  name: yup.string().trim().required('Name is required'),
  cellphoneNumber: yup
    .string()
    .trim()
    .required('Cellphone number is required')
    .matches(PHONE_NUMBER_REGEX, 'Enter a valid phone number'),
  address: yup.string().trim().nullable(),
});

/**
 * Validates the add customer form using Yup schema.
 * @returns {Promise<boolean>} True if valid, false otherwise.
 */
const validate = async () => {
  try {
    await schema.validate(form.value, { abortEarly: false });
    errors.value = {};

    return true;
  } catch (err: unknown) {
    const errObj: { [key: string]: string } = {};
    if (err instanceof yup.ValidationError) {
      for (const e of err.inner ?? []) {
        if (e.path) errObj[e.path] = e.message;
      }
    }
    errors.value = errObj;

    return false;
  }
};

/**
 * Handles form submission to add a new customer to Firestore.
 */
const handleSubmit = async () => {
  if (!currentUser.value) {
    toast.error('You must be logged in to add a customer.');

    return;
  }
  if (!(await validate())) return;
  setLoading(true);
  submitting.value = true;
  try {
    const docRef = await addDoc(collection(db, 'customers'), {
      name: form.value.name,
      cellphoneNumber: form.value.cellphoneNumber,
      address: form.value.address || null,
      balance: 0,
      createdAt: serverTimestamp(),
      updatedAt: null,
      creditScore: 0,
      ownerUid: currentUser.value.uid,
    });
    await updateDoc(docRef, { id: docRef.id });
    toast.success('Customer added successfully!');
    router.push('/');
  } catch {
    toast.error('Failed to add customer.');
  } finally {
    submitting.value = false;
    setLoading(false);
  }
};
</script>

<template>
  <AppLayout>
    <div class="bg-surface mx-auto mt-10 w-full max-w-md rounded p-8 shadow-md">
      <h1 class="text-primary mb-6 text-center text-2xl font-bold">
        Add Customer
      </h1>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="form-label" for="name">Name</label>
          <input
            id="name"
            v-model="form.name"
            class="form-input-base bg-surface text-on-surface"
            :class="errors.name ? 'form-input-invalid' : 'form-input-valid'"
            placeholder="Thabo Mokoena"
            autocomplete="off"
          />
          <div v-if="errors.name" class="form-error-text">
            {{ errors.name }}
          </div>
        </div>
        <div>
          <label class="form-label" for="cellphone">Cellphone Number</label>
          <input
            id="cellphone"
            v-model="form.cellphoneNumber"
            class="form-input-base bg-surface text-on-surface"
            :class="
              errors.cellphoneNumber ? 'form-input-invalid' : 'form-input-valid'
            "
            placeholder="+27 12 3456 789"
            autocomplete="off"
          />
          <div v-if="errors.cellphoneNumber" class="form-error-text">
            {{ errors.cellphoneNumber }}
          </div>
        </div>
        <div>
          <label class="form-label" for="address">Address (optional)</label>
          <input
            id="address"
            v-model="form.address"
            class="form-input-base bg-surface text-on-surface"
            :class="errors.address ? 'form-input-invalid' : 'form-input-valid'"
            placeholder="Customer Address"
            autocomplete="off"
          />
          <div v-if="errors.address" class="form-error-text">
            {{ errors.address }}
          </div>
        </div>
        <div>
          <button
            type="submit"
            class="btn-primary"
            :disabled="submitting || isLoading"
          >
            {{ submitting ? 'Adding...' : 'Add Customer' }}
          </button>
        </div>
      </form>
      <div class="border-secondary-variant mt-8 border-t pt-6 text-center">
        <button @click="router.back()" class="btn-primary-outline !w-auto">
          Back
        </button>
      </div>
    </div>
  </AppLayout>
</template>
