<script setup lang="ts">
/**
 * RegisterView.vue
 * Handles user registration, including validation, password strength, and email uniqueness check.
 */
import { useAuth } from '@/composables/useAuth';
import { useLoading } from '@/composables/useLoading';
import { usePasswordStrength } from '@/composables/usePasswordStrength';
import {
  EMAIL_REGEX,
  PHONE_NUMBER_REGEX,
  normalizePhoneNumber,
} from '@/constants/regex.constants';
import { ToastMessages } from '@/constants/toastMessages.constants';
import type { RegisterFormValues } from '@/interfaces/auth.interfaces';
import AuthLayout from '@/layouts/AuthLayout.vue';
import type { GenericFormValues } from '@/types/forms.types';
import { useDebounceFn } from '@vueuse/core';
import { useHead } from '@vueuse/head';
import { fetchSignInMethodsForEmail, getAuth } from 'firebase/auth';
import { ErrorMessage, Field, Form } from 'vee-validate';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import * as yup from 'yup';

useHead({
  title: 'Register | Fakaloan',
  meta: [
    { name: 'description', content: 'Create a new Fakaloan account.' },
    { property: 'og:title', content: 'Register | Fakaloan' },
    { property: 'og:description', content: 'Create a new Fakaloan account.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: window.location.href },
    { property: 'og:site_name', content: 'Fakaloan' },
  ],
});

const router = useRouter();
const {
  registerWithEmail,
  isLoading: isAuthLoading,
  error: authError,
  isOnline,
} = useAuth();

const { setLoading } = useLoading();

const toast = useToast();

const schema = yup.object({
  firstName: yup.string().trim().required('First Name is required'),
  lastName: yup.string().trim().required('Last Name is required'),
  email: yup
    .string()
    .trim()
    .lowercase()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  passwordConfirmation: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  cellphone: yup
    .string()
    .trim()
    .matches(PHONE_NUMBER_REGEX, 'Enter a valid South African phone number')
    .notRequired(),
});

const password = ref('');
const passwordConfirmation = ref('');
const showPassword = ref(false);
const showPasswordConfirmation = ref(false);
const { label, color } = usePasswordStrength(password);

const email = ref('');
const emailUnique = ref(true);
const emailCheckLoading = ref(false);

const checkEmailUnique = useDebounceFn(async (value: string) => {
  if (!value || !EMAIL_REGEX.test(value)) {
    emailUnique.value = true;
    emailCheckLoading.value = false;
    return;
  }
  emailCheckLoading.value = true;
  try {
    const methods = await fetchSignInMethodsForEmail(getAuth(), value);
    emailUnique.value = methods.length === 0;
  } catch {
    emailUnique.value = true;
  } finally {
    emailCheckLoading.value = false;
  }
}, 400);

// Watch email input for uniqueness check
watch(email, (val) => {
  checkEmailUnique(val);
});

/**
 * Handles registration form submission, normalizes cellphone, and shows toast on success/failure.
 */
const handleRegister = async (values: GenericFormValues): Promise<void> => {
  setLoading(true);
  try {
    // Normalize cellphone before registration
    if (values.cellphone) {
      values.cellphone = normalizePhoneNumber(values.cellphone as string);
    }
    const success = await registerWithEmail(
      values as unknown as RegisterFormValues
    );
    if (success) {
      router.push({ name: 'login' });
      toast.success(ToastMessages.RegistrationSuccess);
    }
  } catch {
    toast.error(ToastMessages.RegistrationFailed);
  } finally {
    setLoading(false);
  }
};

/**
 * Navigates to the login page.
 */
const goToLogin = (): void => {
  router.push({ name: 'login' });
};
</script>

<template>
  <AuthLayout title="Create Fakaloan Account">
    <template #errors>
      <div v-if="!isOnline" class="alert-error">
        No internet connection. Please check your network.
      </div>
      <div v-if="authError" class="alert-error">
        {{ authError }}
      </div>
    </template>

    <Form
      :validation-schema="schema"
      @submit="handleRegister"
      class="space-y-4"
    >
      <div>
        <label for="firstName" class="form-label">First Name</label>
        <Field
          id="firstName"
          name="firstName"
          type="text"
          autocomplete="firstName"
          v-slot="{ field, errors }"
          :validate-on-input="true"
        >
          <input
            v-bind="field"
            :class="[
              'form-input-base',
              errors.length ? 'form-input-invalid' : 'form-input-valid',
              'bg-surface text-on-surface placeholder:text-on-surface/60',
            ]"
            placeholder="Thabo"
            aria-describedby="name-error"
          />
        </Field>
        <ErrorMessage
          name="firstName"
          id="name-error"
          class="form-error-text"
        />
      </div>

      <div>
        <label for="lastName" class="form-label">Last Name</label>
        <Field
          id="lastName"
          name="lastName"
          type="lastName"
          autocomplete="lastName"
          v-slot="{ field, errors }"
          :validate-on-input="true"
        >
          <input
            v-bind="field"
            :class="[
              'form-input-base',
              errors.length ? 'form-input-invalid' : 'form-input-valid',
              'bg-surface text-on-surface placeholder:text-on-surface/60',
            ]"
            placeholder="Mokoena"
            aria-describedby="name-error"
          />
        </Field>
        <ErrorMessage name="lastName" id="name-error" class="form-error-text" />
      </div>

      <div>
        <label for="email" class="form-label">Email address</label>
        <Field
          id="email"
          name="email"
          type="email"
          autocomplete="email"
          v-slot="{ field, errors }"
          :validate-on-input="true"
        >
          <input
            v-bind="field"
            v-model="email"
            :class="[
              'form-input-base',
              errors.length ? 'form-input-invalid' : 'form-input-valid',
              'bg-surface text-on-surface placeholder:text-on-surface/60',
            ]"
            placeholder="you@example.com"
            aria-describedby="email-error"
          />
        </Field>
        <ErrorMessage name="email" id="email-error" class="form-error-text" />
        <div v-if="emailCheckLoading" class="text-info mt-1 text-sm">
          Checking email...
        </div>
        <div
          v-if="!emailUnique && !emailCheckLoading"
          class="text-error mt-1 text-sm"
        >
          This email is already registered.
        </div>
      </div>

      <div>
        <label for="password" class="form-label">Password</label>
        <Field
          id="password"
          name="password"
          type="password"
          autocomplete="new-password"
          v-slot="{ field, errors }"
          :validate-on-input="true"
        >
          <div class="relative">
            <input
              v-bind="field"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              :class="[
                'form-input-base',
                errors.length ? 'form-input-invalid' : 'form-input-valid',
                'bg-surface text-on-surface placeholder:text-on-surface/60',
              ]"
              placeholder="Minimum 8 characters"
              aria-describedby="password-error"
            />
            <button
              type="button"
              class="text-on-surface/60 absolute right-2 top-1/2 -translate-y-1/2"
              @click="showPassword = !showPassword"
              tabindex="-1"
              aria-label="Toggle password visibility"
            >
              <i
                :class="
                  showPassword ? 'i-heroicons-eye-off' : 'i-heroicons-eye'
                "
                class="h-5 w-5"
              ></i>
            </button>
          </div>
        </Field>
        <ErrorMessage
          name="password"
          id="password-error"
          class="form-error-text"
        />
        <div v-if="label" :class="['mt-1 text-sm font-medium', color]">
          Password strength: {{ label }}
        </div>
      </div>

      <div>
        <label for="passwordConfirmation" class="form-label"
          >Confirm Password</label
        >
        <Field
          id="passwordConfirmation"
          name="passwordConfirmation"
          type="password"
          autocomplete="new-password"
          v-slot="{ field, errors }"
          :validate-on-input="true"
        >
          <div class="relative">
            <input
              v-bind="field"
              v-model="passwordConfirmation"
              :type="showPasswordConfirmation ? 'text' : 'password'"
              :class="[
                'form-input-base',
                errors.length ? 'form-input-invalid' : 'form-input-valid',
                'bg-surface text-on-surface placeholder:text-on-surface/60',
              ]"
              placeholder="Confirm your password"
              aria-describedby="passwordConfirmation-error"
            />
            <button
              type="button"
              class="text-on-surface/60 absolute right-2 top-1/2 -translate-y-1/2"
              @click="showPasswordConfirmation = !showPasswordConfirmation"
              tabindex="-1"
              aria-label="Toggle password confirmation visibility"
            >
              <i
                :class="
                  showPasswordConfirmation
                    ? 'i-heroicons-eye-off'
                    : 'i-heroicons-eye'
                "
                class="h-5 w-5"
              ></i>
            </button>
          </div>
        </Field>
        <ErrorMessage
          name="passwordConfirmation"
          id="passwordConfirmation-error"
          class="form-error-text"
        />
      </div>

      <div>
        <button
          type="submit"
          :class="['btn-primary', { 'btn-disabled': isAuthLoading }]"
          :disabled="isAuthLoading"
        >
          {{ isAuthLoading ? 'Creating...' : 'Create Account' }}
        </button>
      </div>
    </Form>

    <template #actions>
      <div class="mt-4 text-center text-sm">
        <span class="text-on-background">Already have an account? </span>
        <button @click="goToLogin" class="btn-link">Sign in</button>
      </div>
    </template>
  </AuthLayout>
</template>
