<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import { useLoading } from '@/composables/useLoading';
import { useRemoteConfig } from '@/composables/useRemoteConfig';
import type { LoginFormValues } from '@/interfaces/auth.interfaces';
import AuthLayout from '@/layouts/AuthLayout.vue';
import type { GenericFormValues as AppGenericFormValues } from '@/types/forms.types';
import { useTitle } from '@vueuse/core';
import { ErrorMessage, Field, Form } from 'vee-validate';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import * as yup from 'yup';

/**
 * Sets the document title for this view.
 */
useTitle('Login | Fakaloan');

const router = useRouter();
const {
  loginWithEmail,
  loginWithGoogle,
  isLoading: isAuthLoading, // Renamed from useAuth's isLoading
  error: authError,
  isOnline,
} = useAuth();

/**
 * Ref to track loading state specifically for Google Sign-in.
 */
const googleLoading = ref(false);

const { setLoading } = useLoading();

// Destructure and rename isLoading from useRemoteConfig to avoid conflict
const { allowAccountCreation, isLoading: isRemoteConfigLoading } =
  useRemoteConfig();

/**
 * Yup validation schema for the login form.
 */
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
 * Handles the email/password login form submission.
 * @param values - Form values from VeeValidate.
 */
const handleEmailLogin = async (values: AppGenericFormValues) => {
  setLoading(true);
  googleLoading.value = false; // Ensure Google loading is false
  try {
    const success = await loginWithEmail(values as unknown as LoginFormValues);
    if (success) {
      router.push({ name: 'home' }); // Redirect to home on successful login
    }
  } finally {
    setLoading(false);
  }
};

/**
 * Handles the Google Sign-in button click.
 */
const handleGoogleLogin = async () => {
  setLoading(true);
  googleLoading.value = true;
  try {
    const success = await loginWithGoogle();
    if (success) {
      router.push({ name: 'home' }); // Redirect to home on successful login
    }
  } finally {
    googleLoading.value = false;
    setLoading(false);
  }
};

/**
 * Navigates the user to the registration page.
 */
const goToRegister = () => {
  router.push({ name: 'register' });
};

/**
 * Navigates the user to the forgot password page.
 */
const goToForgotPassword = () => {
  router.push({ name: 'forgot-password' });
};
</script>

<template>
  <AuthLayout title="Login to Fakaloan">
    <template #errors>
      <!-- Display network error -->
      <div v-if="!isOnline" class="alert-error">
        No internet connection. Please check your network.
      </div>
      <!-- Display authentication error -->
      <div v-if="authError" class="alert-error">
        {{ authError }}
      </div>
      <!-- Display message while checking remote config -->
      <div v-if="isRemoteConfigLoading" class="alert-info">
        Checking login status...
      </div>
      <!-- Display message if login is disabled via remote config -->
      <div
        v-if="!isRemoteConfigLoading && !allowAccountCreation"
        class="alert-error"
      >
        Login is currently disabled.
      </div>
    </template>

    <!-- Login form: Show only when remote config is loaded -->
    <Form
      v-if="!isRemoteConfigLoading"
      :validation-schema="schema"
      @submit="handleEmailLogin"
      class="space-y-4"
    >
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
              'bg-surface text-on-surface placeholder:text-on-surface/60',
            ]"
            placeholder="you@example.com"
            aria-describedby="email-error"
          />
        </Field>
        <ErrorMessage name="email" id="email-error" class="form-error-text" />
      </div>

      <!-- Password Field -->
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
              'bg-surface text-on-surface placeholder:text-on-surface/60',
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

      <!-- Submit Button -->
      <div>
        <button
          type="submit"
          :class="[
            'btn-primary',
            // Disable if auth is loading, remote config is loading, or account creation is disallowed
            {
              'btn-disabled':
                isAuthLoading || isRemoteConfigLoading || !allowAccountCreation,
            },
          ]"
          :disabled="
            isAuthLoading || isRemoteConfigLoading || !allowAccountCreation
          "
        >
          {{ isAuthLoading && !googleLoading ? 'Signing in...' : 'Sign in' }}
        </button>
      </div>
    </Form>

    <template #actions>
      <!-- Actions section: Show only when remote config is loaded -->
      <div v-if="!isRemoteConfigLoading">
        <!-- Separator -->
        <div class="relative my-4">
          <div class="absolute inset-0 flex items-center">
            <div class="border-secondary-variant w-full border-t"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="bg-surface text-secondary px-2">
              Or continue with
            </span>
          </div>
        </div>

        <!-- Google Sign-in Button -->
        <div>
          <button
            @click="handleGoogleLogin"
            :class="[
              'bg-surface text-on-surface border-primary hover:bg-primary/10 focus:ring-primary flex w-full items-center justify-center rounded-md border px-4 py-2 font-medium shadow-sm focus:outline-0 focus:ring-2',
              // Disable if auth is loading, Google sign-in is loading, remote config is loading, or account creation is disallowed
              isAuthLoading ||
              googleLoading ||
              isRemoteConfigLoading ||
              !allowAccountCreation
                ? 'btn-disabled'
                : '',
            ]"
            :disabled="
              isAuthLoading ||
              googleLoading ||
              isRemoteConfigLoading ||
              !allowAccountCreation
            "
          >
            <i class="i-logos-google-icon mr-2 h-5 w-5"></i>
            {{ googleLoading ? 'Signing in...' : 'Sign in with Google' }}
          </button>
        </div>

        <!-- Link to Register Page -->
        <div class="mt-4 text-center text-sm">
          <span class="text-on-background">Don't have an account? </span>
          <button
            @click="goToRegister"
            :class="[
              'btn-link',
              // Disable if remote config is loading or account creation is disallowed
              {
                'btn-disabled': isRemoteConfigLoading || !allowAccountCreation,
              },
            ]"
            :disabled="isRemoteConfigLoading || !allowAccountCreation"
          >
            Create one
          </button>
        </div>
      </div>
    </template>
  </AuthLayout>
</template>
