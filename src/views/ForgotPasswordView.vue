/** * ForgotPasswordView.vue * Handles password reset requests for users who
forgot their password. */
<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import { useLoading } from '@/composables/useLoading';
import { EMAIL_REGEX } from '@/constants/regex.constants';
import type { ForgotPasswordForm } from '@/interfaces/auth.interfaces';
import AuthLayout from '@/layouts/AuthLayout.vue';
import type { GenericFormValues } from '@/types/forms.types';
import { useDebounceFn } from '@vueuse/core';
import { useHead } from '@vueuse/head';
import { ErrorMessage, Field, Form } from 'vee-validate';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import * as yup from 'yup';

useHead({
  title: 'Forgot Password | Fakaloan',
  meta: [
    { name: 'description', content: 'Reset your Fakaloan account password.' },
    { property: 'og:title', content: 'Forgot Password | Fakaloan' },
    {
      property: 'og:description',
      content: 'Reset your Fakaloan account password.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: window.location.href },
    { property: 'og:site_name', content: 'Fakaloan' },
  ],
});
const router = useRouter();
const { sendPasswordReset, isLoading, error: authError, isOnline } = useAuth();
const { setLoading } = useLoading();

const schema = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .required('Email is required')
    .email('Please enter a valid email address'),
});

/**
 * Handles password reset form submission.
 */
const handlePasswordReset = async (
  values: GenericFormValues
): Promise<void> => {
  setLoading(true);
  try {
    const success = await sendPasswordReset(
      values as unknown as ForgotPasswordForm
    );
    if (success) {
      router.push({ name: 'login' });
    }
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

const email = ref('');
const emailValid = ref(true);
const emailCheckLoading = ref(false);

const checkEmailValid = useDebounceFn((value: string) => {
  emailCheckLoading.value = true;
  emailValid.value = EMAIL_REGEX.test(value);
  emailCheckLoading.value = false;
}, 300);

watch(email, (val) => {
  checkEmailValid(val);
});
</script>

<template>
  <AuthLayout title="Reset Password">
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
      @submit="handlePasswordReset"
      class="space-y-4"
    >
      <p class="text-on-surface/80 mb-4 text-sm">
        Enter the email address associated with your account, and we'll send you
        a link to reset your password.
      </p>
      <div>
        <label for="email" class="form-label">Email address</label>
        <Field
          id="email"
          name="email"
          type="email"
          :validate-on-input="true"
          class="input-material"
        />
        <ErrorMessage name="email" id="email-error" class="form-error-text" />
      </div>
      <div>
        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
        </button>
      </div>
    </Form>

    <template #actions>
      <div class="mt-4 text-center text-sm">
        <button @click="goToLogin" class="btn-link">Back to Login</button>
        <button @click="router.push('/')" class="btn-link ml-4">
          Back to Home
        </button>
      </div>
    </template>
  </AuthLayout>
</template>
