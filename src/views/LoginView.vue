<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import type { LoginFormValues } from '@/interfaces/auth.interfaces';
import AuthLayout from '@/layouts/AuthLayout.vue';
import type { GenericFormValues as AppGenericFormValues } from '@/types/forms.types';
import { useTitle } from '@vueuse/core';
import { ErrorMessage, Field, Form } from 'vee-validate';
import { useRouter } from 'vue-router';
import * as yup from 'yup';

useTitle('Login | Fakaloan');
const router = useRouter();
const {
  loginWithEmail,
  loginWithGoogle,
  isLoading,
  error: authError,
  isOnline,
} = useAuth();

const schema = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup.string().required('Password is required'),
});

/**
 * Handles login with email and password.
 * @param values - The form values from VeeValidate
 */
const handleEmailLogin = async (values: AppGenericFormValues) => {
  const success = await loginWithEmail(values as LoginFormValues);
  if (success) {
    router.push({ name: 'home' });
  }
};

/**
 * Handles login with Google OAuth.
 */
const handleGoogleLogin = async () => {
  const success = await loginWithGoogle();
  if (success) {
    router.push({ name: 'home' });
  }
};

/**
 * Navigates to the registration page.
 */
const goToRegister = () => {
  router.push({ name: 'register' });
};

/**
 * Navigates to the forgot password page.
 */
const goToForgotPassword = () => {
  router.push({ name: 'forgot-password' });
};
</script>

<template>
  <AuthLayout title="Login to Fakaloan">
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
      @submit="handleEmailLogin"
      class="space-y-4"
    >
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
        <div class="flex items-center justify-between">
          <label for="password" class="form-label">Password</label>
          <div class="text-sm">
            <button type="button" @click="goToForgotPassword" class="btn-link">
              Forgot password?
            </button>
          </div>
        </div>
        <Field
          id="password"
          name="password"
          type="password"
          autocomplete="current-password"
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
            placeholder="Password"
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
        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Signing in...' : 'Sign in' }}
        </button>
      </div>
    </Form>

    <template #actions>
      <div class="relative my-4">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 text-gray-500 bg-white"> Or continue with </span>
        </div>
      </div>

      <div>
        <button
          @click="handleGoogleLogin"
          class="btn-secondary"
          :disabled="isLoading"
        >
          <i class="i-logos-google-icon w-5 h-5 mr-2"></i>
          {{ isLoading ? 'Signing in...' : 'Sign in with Google' }}
        </button>
      </div>

      <div class="text-sm text-center mt-4">
        <span class="text-gray-600">Don't have an account? </span>
        <button @click="goToRegister" class="btn-link">Create one</button>
      </div>
    </template>
  </AuthLayout>
</template>
