<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import { useLoading } from '@/composables/useLoading';
import type { ForgotPasswordForm } from '@/interfaces/auth.interfaces';
import AuthLayout from '@/layouts/AuthLayout.vue';
import type { GenericFormValues } from '@/types/forms.types';
import { useTitle } from '@vueuse/core';
import { ErrorMessage, Field, Form } from 'vee-validate';
import { useRouter } from 'vue-router';
import * as yup from 'yup';

useTitle('Forgot Password | Fakaloan');
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
 * Handles password reset request.
 * @param values - The form values from VeeValidate
 */
const handlePasswordReset = async (values: GenericFormValues) => {
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
 * Navigates back to the login page.
 */
const goToLogin = () => {
  router.push({ name: 'login' });
};
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
      <p class="text-on-surface/80 text-sm">
        Enter the email address associated with your account, and we'll send you
        a link to reset your password.
      </p>

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
      </div>
    </template>
  </AuthLayout>
</template>
