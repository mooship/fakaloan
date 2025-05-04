/** * AddCustomerView.vue * Handles adding a new customer, including validation
and Firestore integration. */
<script setup lang="ts">
import BackButton from '@/components/BackButton.vue';
import { useAuth } from '@/composables/useAuth';
import { useLoading } from '@/composables/useLoading';
import {
  normalizePhoneNumber,
  PHONE_NUMBER_REGEX,
} from '@/constants/regex.constants';
import { ToastMessages } from '@/constants/toastMessages.constants';
import { db } from '@/firebase';
import AppLayout from '@/layouts/AppLayout.vue';
import { useHead } from '@vueuse/head';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
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
  defaultCreditTermDays: null as number | null,
});

const errors = ref<{ [key: string]: string }>({});
const submitting = ref(false);

const schema = yup.object({
  name: yup.string().trim().required('Name is required'),
  cellphoneNumber: yup
    .string()
    .trim()
    .required('Cellphone number is required')
    .matches(PHONE_NUMBER_REGEX, 'Enter a valid South African phone number'),
  address: yup.string().trim().nullable(),
  defaultCreditTermDays: yup
    .number()
    .nullable()
    .min(1, 'Minimum is 1 day')
    .max(90, 'Maximum is 90 days'),
});

/**
 * Validates the add customer form using Yup schema.
 * @returns {Promise<boolean>} True if valid, false otherwise.
 */
const validate = async (): Promise<boolean> => {
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
const handleSubmit = async (): Promise<void> => {
  if (!currentUser.value) {
    toast.error(ToastMessages.AuthRequired);
    return;
  }

  if (!(await validate())) {
    return;
  }

  // Normalize cellphone before saving
  form.value.cellphoneNumber = normalizePhoneNumber(form.value.cellphoneNumber);

  setLoading(true);
  submitting.value = true;

  try {
    await addDoc(collection(db, 'customers'), {
      name: form.value.name,
      cellphoneNumber: form.value.cellphoneNumber,
      address: form.value.address || null,
      balance: 0,
      createdAt: serverTimestamp(),
      updatedAt: null,
      userId: currentUser.value.uid,
      creditScore: null,
      defaultCreditTermDays: form.value.defaultCreditTermDays,
      lastRepaymentAt: null,
      isDeleted: false,
    });

    toast.success(ToastMessages.CustomerAddSuccess);
    router.push({ name: 'customers' });
  } catch {
    toast.error(ToastMessages.CustomerAddFailed);
  } finally {
    submitting.value = false;
    setLoading(false);
  }
};

useHead({
  title: 'Add Customer | Fakaloan',
  meta: [
    {
      name: 'description',
      content: 'Add a new customer to your Fakaloan account.',
    },
    { property: 'og:title', content: 'Add Customer | Fakaloan' },
    {
      property: 'og:description',
      content: 'Add a new customer to your Fakaloan account.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: window.location.href },
    { property: 'og:site_name', content: 'Fakaloan' },
  ],
});
</script>

<template>
  <AppLayout>
    <div class="card-lg">
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
          <label class="form-label" for="term"
            >Default Credit Term (days)</label
          >
          <input
            id="term"
            type="number"
            v-model.number="form.defaultCreditTermDays"
            class="form-input-base bg-surface text-on-surface"
            :class="
              errors.defaultCreditTermDays
                ? 'form-input-invalid'
                : 'form-input-valid'
            "
            placeholder="e.g. 30"
            autocomplete="off"
            min="1"
            max="90"
          />
          <div v-if="errors.defaultCreditTermDays" class="form-error-text">
            {{ errors.defaultCreditTermDays }}
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="btn-primary mx-auto block w-auto"
            :disabled="submitting || isLoading"
          >
            {{ submitting ? 'Adding...' : 'Add Customer' }}
          </button>
        </div>
      </form>

      <div class="section-divider mt-8 flex justify-center">
        <BackButton />
      </div>
    </div>
  </AppLayout>
</template>
