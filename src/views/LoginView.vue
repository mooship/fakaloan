/** * LoginView.vue * Handles user login via email/password or Google, with
validation and error handling. */
<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import { useLoading } from '@/composables/useLoading';
import { EMAIL_REGEX } from '@/constants/regex.constants';
import type { LoginFormValues } from '@/interfaces/auth.interfaces';
import AuthLayout from '@/layouts/AuthLayout.vue';
import type { GenericFormValues as AppGenericFormValues } from '@/types/forms.types';
import { useDebounceFn } from '@vueuse/core';
import { useHead } from '@vueuse/head';
import { ErrorMessage, Field, Form } from 'vee-validate';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import * as yup from 'yup';

useHead({
  title: 'Login | Fakaloan',
  meta: [
    { name: 'description', content: 'Login to your Fakaloan account.' },
    { property: 'og:title', content: 'Login | Fakaloan' },
    { property: 'og:description', content: 'Login to your Fakaloan account.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: window.location.href },
    { property: 'og:site_name', content: 'Fakaloan' },
  ],
});

const router = useRouter();
const {
  loginWithEmail,
  loginWithGoogle,
  isLoading: isAuthLoading,
  error: authError,
  isOnline,
} = useAuth();

const googleLoading = ref(false);

const { setLoading } = useLoading();

const schema = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup.string().required('Password is required'),
});

const showPassword = ref(false);

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

/**
 * Handles login with email and password.
 * @param values - The form values for login.
 */
const handleEmailLogin = async (
  values: AppGenericFormValues
): Promise<void> => {
  setLoading(true);
  googleLoading.value = false;
  try {
    await loginWithEmail(values as unknown as LoginFormValues);
    router.push({ name: 'home' });
  } finally {
    setLoading(false);
  }
};

/**
 * Handles login with Google provider.
 */
const handleGoogleLogin = async (): Promise<void> => {
  setLoading(true);
  googleLoading.value = true;
  try {
    const success = await loginWithGoogle();
    if (success) {
      router.push({ name: 'home' });
    }
  } finally {
    googleLoading.value = false;
    setLoading(false);
  }
};

const goToRegister = (): void => {
  router.push({ name: 'register' });
};

const goToForgotPassword = (): void => {
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
            v-model="email"
            :class="[
              'form-input-base',
              errors.length || !emailValid
                ? 'form-input-invalid'
                : 'form-input-valid',
              'bg-surface text-on-surface placeholder:text-on-surface/60',
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
          <div class="relative">
            <input
              v-bind="field"
              :type="showPassword ? 'text' : 'password'"
              :class="[
                'form-input-base',
                errors.length ? 'form-input-invalid' : 'form-input-valid',
                'bg-surface text-on-surface placeholder:text-on-surface/60',
              ]"
              placeholder="Password"
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
      </div>

      <div>
        <button
          type="submit"
          :class="['btn-primary', { 'btn-disabled': isAuthLoading }]"
          :disabled="isAuthLoading"
        >
          {{ isAuthLoading && !googleLoading ? 'Signing in...' : 'Sign in' }}
        </button>
      </div>
    </Form>

    <template #actions>
      <div class="relative my-4">
        <div class="absolute inset-0 flex items-center">
          <div class="border-secondary-variant w-full border-t"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="bg-surface text-secondary px-2"> Or continue with </span>
        </div>
      </div>

      <div>
        <button
          @click="handleGoogleLogin"
          :class="[
            'bg-surface text-on-surface border-primary hover:bg-primary/10 focus:ring-primary flex w-full items-center justify-center rounded-md border px-4 py-2 font-medium shadow-sm focus:outline-0 focus:ring-2',
            isAuthLoading || googleLoading ? 'btn-disabled' : '',
          ]"
          :disabled="isAuthLoading || googleLoading"
        >
          <i class="i-logos-google-icon mr-2 h-5 w-5"></i>
          {{ googleLoading ? 'Signing in...' : 'Sign in with Google' }}
        </button>
      </div>

      <div class="mt-4 text-center text-sm">
        <span class="text-on-background">Don't have an account? </span>
        <button @click="goToRegister" class="btn-link">Create one</button>
      </div>
    </template>
  </AuthLayout>
</template>
