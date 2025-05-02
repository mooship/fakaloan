<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import { useLoading } from '@/composables/useLoading';
import { useRemoteConfig } from '@/composables/useRemoteConfig';
import { PHONE_NUMBER_REGEX } from '@/constants/regex.constants';
import type { RegisterFormValues } from '@/interfaces/auth.interfaces';
import AuthLayout from '@/layouts/AuthLayout.vue';
import type { GenericFormValues } from '@/types/forms.types';
import { useTitle } from '@vueuse/core';
import { ErrorMessage, Field, Form } from 'vee-validate';
import { useRouter } from 'vue-router';
import * as yup from 'yup';

useTitle('Register | Fakaloan');

const router = useRouter();
const {
  registerWithEmail,
  isLoading: isAuthLoading,
  error: authError,
  isOnline,
} = useAuth();

const { setLoading } = useLoading();

const { allowAccountCreation, isLoading: isRemoteConfigLoading } =
  useRemoteConfig();

/** Validation schema for the registration form. */
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
    .matches(PHONE_NUMBER_REGEX, 'Enter a valid phone number')
    .notRequired(),
});

/**
 * Handles the registration form submission.
 * @param values Form values from VeeValidate.
 */
const handleRegister = async (values: GenericFormValues) => {
  setLoading(true);
  try {
    const success = await registerWithEmail(
      values as unknown as RegisterFormValues
    );
    if (success) {
      // Redirect to login page after successful registration
      router.push({ name: 'login' });
    }
  } finally {
    setLoading(false);
  }
};

/** Navigates the user to the login page. */
const goToLogin = () => {
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
      <div v-if="isRemoteConfigLoading" class="alert-info">
        Checking account creation status...
      </div>
      <div
        v-if="!isRemoteConfigLoading && !allowAccountCreation"
        class="alert-error"
      >
        Account creation is currently disabled.
      </div>
    </template>

    <!-- Registration form: Show only when remote config is loaded and creation is allowed -->
    <Form
      v-if="!isRemoteConfigLoading && allowAccountCreation"
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
              'bg-surface text-on-surface placeholder:text-on-surface/60',
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
              'bg-surface text-on-surface placeholder:text-on-surface/60',
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
        <button
          type="submit"
          :class="[
            'btn-primary',
            {
              'btn-disabled':
                isAuthLoading || isRemoteConfigLoading || !allowAccountCreation,
            },
          ]"
          :disabled="
            isAuthLoading || isRemoteConfigLoading || !allowAccountCreation
          "
        >
          {{ isAuthLoading ? 'Creating...' : 'Create Account' }}
        </button>
      </div>
    </Form>

    <template #actions>
      <div class="mt-4 text-center text-sm">
        <span class="text-on-background">Already have an account? </span>
        <button
          @click="goToLogin"
          :class="[
            'btn-link',
            // Disable link only while checking remote config
            { 'btn-disabled': isRemoteConfigLoading },
          ]"
          :disabled="isRemoteConfigLoading"
        >
          Sign in
        </button>
      </div>
    </template>
  </AuthLayout>
</template>
