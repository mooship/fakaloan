<script setup lang="ts">
import { auth, db } from '@/firebase';
import type { RegisterFormValues } from '@/interfaces/auth.interfaces';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { createUserWithEmailAndPassword, type AuthError } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { ErrorMessage, Field, Form } from 'vee-validate';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import * as yup from 'yup';

const router = useRouter();
const toast = useToast();
const registrationError = ref<string | null>(null);

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

const registerUser = async (values: RegisterFormValues) => {
  registrationError.value = null;

  if (!values.email || !values.password || !values.name) {
    registrationError.value = 'Please fill in all required fields.';
    return;
  }

  try {
    console.log('Attempting Firebase registration for:', values.email);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      values.email,
      values.password
    );
    const user = userCredential.user;
    console.log('Firebase Auth user created:', user.uid);

    console.log('Creating Firestore document for user:', user.uid);
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      name: values.name.trim(),
      email: user.email,
      createdAt: serverTimestamp(),
      cellphone: null,
      isPremium: false,
    });
    console.log('Firestore document created successfully.');

    toast.success('Registration successful! Please log in.');
    router.push('/login');
  } catch (error) {
    console.error('Registration failed:', error);
    const authError = error as AuthError;

    switch (authError.code) {
      case 'auth/email-already-in-use':
        registrationError.value = 'This email address is already registered.';
        break;
      case 'auth/invalid-email':
        registrationError.value = 'Please enter a valid email address.';
        break;
      case 'auth/weak-password':
        registrationError.value =
          'Password is too weak. It must be at least 8 characters long.';
        break;
      default:
        registrationError.value =
          'An unexpected error occurred during registration. Please try again.';
    }
    toast.error(registrationError.value || 'Registration failed.');
  }
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<template>
  <AuthLayout title="Create Fakaloan Account">
    <template #errors>
      <div v-if="registrationError" class="alert-error">
        {{ registrationError }}
      </div>
    </template>

    <Form :validation-schema="schema" @submit="registerUser" class="space-y-4">
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
            placeholder="Password (min. 8 characters)"
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
            placeholder="Confirm Password"
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
        <button type="submit" class="btn-primary">Create Account</button>
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
