<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { sendPasswordResetEmail, type AuthError } from 'firebase/auth';
import { auth } from '@/firebase';
import { useToast } from 'vue-toastification';
import AuthLayout from '@/layouts/AuthLayout.vue';
import type { ForgotPasswordForm } from '@/interfaces/auth.interfaces';

const router = useRouter();
const toast = useToast();
const emailSent = ref(false);
const resetError = ref<string | null>(null);
const processing = ref(false);

const schema = yup.object({
  email: yup.string().trim().lowercase().required('Email is required').email('Please enter a valid email address'),
});

const handlePasswordReset = async (values: ForgotPasswordForm) => {
  resetError.value = null;
  processing.value = true;

  try {
    console.log('Attempting password reset for:', values.email);
    await sendPasswordResetEmail(auth, values.email);
    console.log('Password reset email sent successfully.');

    emailSent.value = true;
    toast.success('Password reset email sent. Please check your inbox (and spam folder).');

    setTimeout(() => {
      router.push({ name: 'login' });
    }, 3000);

  } catch (error) {
    console.error('Password reset error:', error);
    const authError = error as AuthError;
    emailSent.value = false;
    switch (authError.code) {
      case 'auth/user-not-found':
        resetError.value = 'No account found with this email address.';
        break;
      case 'auth/invalid-email':
         resetError.value = 'Please enter a valid email address.';
         break;
      default:
        resetError.value = 'An unexpected error occurred. Please try again.';
    }
    toast.error(resetError.value || 'Password reset failed.');
  } finally {
    processing.value = false;
  }
};

const goToLogin = () => {
  router.push({ name: 'login' });
};
</script>

<template>
  <AuthLayout title="Reset Password">
    <template #errors>
      <div v-if="resetError && !emailSent" class="alert-error">
        {{ resetError }}
      </div>
      <div v-if="emailSent" class="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-md border border-green-300">
        Password reset email sent successfully to the provided address. Please check your inbox and spam folder. You will be redirected shortly.
      </div>
    </template>

    <Form v-if="!emailSent" :validation-schema="schema" @submit="handlePasswordReset" class="space-y-4">
      <p class="text-sm text-gray-600">Enter the email address associated with your account, and we'll send you a link to reset your password.</p>
      <div>
        <label for="email" class="form-label">Email address</label>
        <Field id="email" name="email" type="email" autocomplete="email" v-slot="{ field, errors }" :validate-on-input="true">
          <input v-bind="field" :class="['form-input-base', errors.length ? 'form-input-invalid' : 'form-input-valid']" placeholder="you@example.com" aria-describedby="email-error" />
        </Field>
        <ErrorMessage name="email" id="email-error" class="form-error-text" />
      </div>

      <div>
        <button type="submit" class="btn-primary" :disabled="processing">
          {{ processing ? 'Sending...' : 'Send Reset Link' }}
        </button>
      </div>
    </Form>

    <template #actions>
      <div class="text-sm text-center mt-4">
        <button @click="goToLogin" class="btn-link">
          Back to Login
        </button>
      </div>
    </template>
  </AuthLayout>
</template>
