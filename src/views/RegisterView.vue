<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import type { RegisterFormValues } from '@/interfaces/auth.interfaces';
import AuthLayout from '@/layouts/AuthLayout.vue';
import type { GenericFormValues } from '@/types/forms.types';
import { useTitle } from '@vueuse/core';
import { ErrorMessage, Field, Form } from 'vee-validate';
import { useRouter } from 'vue-router';
import * as yup from 'yup';

// Setup
useTitle('Register | Fakaloan');
// TODO: Implement analytics tracking for registration page views and form submissions.
// TODO: Integrate CAPTCHA (e.g., reCAPTCHA) to prevent spam registrations.
const router = useRouter();
const { registerWithEmail, isLoading, error: authError, isOnline } = useAuth();

// Form Validation Schema
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
});

// Methods
/**
 * Handle registration form submission.
 */
const handleRegister = (values: GenericFormValues) => {
  registerWithEmail(values as RegisterFormValues);
};

/**
 * Navigate to login page.
 */
const goToLogin = () => {
  router.push('/login');
};
</script>

<template>
  <AuthLayout title="Create Fakaloan Account">
    <!-- Error Notifications -->
    <template #errors>
      <div v-if="!isOnline" class="alert-error">
        No internet connection. Please check your network.
      </div>
      <div v-if="authError" class="alert-error">
        {{ authError }}
      </div>
    </template>

    <!-- Registration Form -->
    <Form
      :validation-schema="schema"
      @submit="handleRegister"
      class="space-y-4"
    >
      <!-- First Name Field -->
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

      <!-- Last Name Field -->
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
            ]"
            placeholder="Mokoena"
            aria-describedby="name-error"
          />
        </Field>
        <ErrorMessage name="lastName" id="name-error" class="form-error-text" />
      </div>

      <!-- Email Field -->
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
            ]"
            placeholder="you@example.com"
            aria-describedby="email-error"
          />
        </Field>
        <ErrorMessage name="email" id="email-error" class="form-error-text" />
      </div>

      <!-- Password Field -->
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
          <input
            v-bind="field"
            type="password"
            :class="[
              'form-input-base',
              errors.length ? 'form-input-invalid' : 'form-input-valid',
            ]"
            placeholder="Minimum 8 characters"
            aria-describedby="password-error"
          />
        </Field>
        <ErrorMessage
          name="password"
          id="password-error"
          class="form-error-text"
        />
      </div>

      <!-- Password Confirmation Field -->
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
          <input
            v-bind="field"
            type="password"
            :class="[
              'form-input-base',
              errors.length ? 'form-input-invalid' : 'form-input-valid',
            ]"
            placeholder="Confirm your password"
            aria-describedby="passwordConfirmation-error"
          />
        </Field>
        <ErrorMessage
          name="passwordConfirmation"
          id="passwordConfirmation-error"
          class="form-error-text"
        />
      </div>

      <!-- Submit Button -->
      <div>
        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Creating...' : 'Create Account' }}
        </button>
      </div>
    </Form>

    <!-- Login Link -->
    <template #actions>
      <div class="text-sm text-center mt-4">
        <span class="text-gray-600">Already have an account? </span>
        <button @click="goToLogin" class="btn-link">Sign in</button>
      </div>
    </template>
  </AuthLayout>
</template>
