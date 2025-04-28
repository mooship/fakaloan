<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import type { ForgotPasswordForm } from '@/interfaces/auth.interfaces';
import AuthLayout from '@/layouts/AuthLayout.vue';
import type { GenericFormValues } from '@/types/forms.types';
import { useTitle } from '@vueuse/core';
import { ErrorMessage, Field, Form } from 'vee-validate';
import { useRouter } from 'vue-router';
import * as yup from 'yup';

//---------------------------------------------------------------------------------
// Setup
//---------------------------------------------------------------------------------
useTitle('Forgot Password | Fakaloan');
const router = useRouter();
const {
  sendPasswordReset,
  isLoading,
  error: authError,
  emailSent,
  isOnline,
} = useAuth();

//---------------------------------------------------------------------------------
// Form Validation Schema
//---------------------------------------------------------------------------------
const schema = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .required('Email is required')
    .email('Please enter a valid email address'),
});

//---------------------------------------------------------------------------------
// Methods
//---------------------------------------------------------------------------------
/**
 * Handle password reset request submission.
 */
const handlePasswordReset = (values: GenericFormValues) => {
  sendPasswordReset(values as unknown as ForgotPasswordForm);
};

/**
 * Navigate back to login page.
 */
const goToLogin = () => {
  router.push({ name: 'login' });
};
</script>

<template>
  <AuthLayout title="Reset Password">
    <!-- ======================================================================= -->
    <!-- Status and Error Notifications                                          -->
    <!-- ======================================================================= -->
    <template #errors>
      <div v-if="!isOnline" class="alert-error">
        No internet connection. Please check your network.
      </div>
      <div v-if="authError && !emailSent" class="alert-error">
        {{ authError }}
      </div>
      <div v-if="emailSent" class="alert-success">
        Password reset email sent successfully to the provided address. Please
        check your inbox and spam folder.
      </div>
    </template>

    <!-- ======================================================================= -->
    <!-- Password Reset Form                                                     -->
    <!-- ======================================================================= -->
    <!-- Only shown if reset email not yet sent -->
    <Form
      v-if="!emailSent"
      :validation-schema="schema"
      @submit="handlePasswordReset"
      class="space-y-4"
    >
      <p class="text-sm text-gray-600">
        Enter the email address associated with your account, and we'll send you
        a link to reset your password.
      </p>

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

      <!-- Submit Button -->
      <div>
        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
        </button>
      </div>
    </Form>

    <!-- ======================================================================= -->
    <!-- Back to Login Link                                                      -->
    <!-- ======================================================================= -->
    <template #actions>
      <div class="text-sm text-center mt-4">
        <button @click="goToLogin" class="btn-link">Back to Login</button>
      </div>
    </template>
  </AuthLayout>
</template>
