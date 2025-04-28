<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import type { RegisterFormValues } from '@/interfaces/auth.interfaces';
import AuthLayout from '@/layouts/AuthLayout.vue';
import type { GenericFormValues } from '@/types/forms.types';
import { useTitle } from '@vueuse/core';
import { ErrorMessage, Field, Form } from 'vee-validate';
import { useRouter } from 'vue-router';
import * as yup from 'yup';

useTitle('Register | Fakaloan');

const router = useRouter();
const { registerWithEmail, isLoading, error: authError, isOnline } = useAuth();

const schema = yup.object({
  name: yup.string().trim().required('Name is required'),
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

const handleRegister = (values: GenericFormValues) => {
  registerWithEmail(values as RegisterFormValues);
};

const goToLogin = () => {
  router.push('/login');
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
        <label for="name" class="form-label">Full Name</label>
        <Field
          id="name"
          name="name"
          type="text"
          autocomplete="name"
          v-slot="{ field, errors }"
          :validate-on-input="true"
        >
          <input
            v-bind="field"
            :class="[
              'form-input-base',
              errors.length ? 'form-input-invalid' : 'form-input-valid',
            ]"
            placeholder="Thabo Mokoena"
            aria-describedby="name-error"
          />
        </Field>
        <ErrorMessage name="name" id="name-error" class="form-error-text" />
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

      <div>
        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Creating...' : 'Create Account' }}
        </button>
      </div>
    </Form>

    <template #actions>
      <div class="text-sm text-center mt-4">
        <span class="text-gray-600">Already have an account? </span>
        <button @click="goToLogin" class="btn-link">Sign in</button>
      </div>
    </template>
  </AuthLayout>
</template>
