<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import type { LoginFormValues } from '@/interfaces/auth.interfaces';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  type AuthError
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/firebase';
import { useToast } from "vue-toastification";
import AuthLayout from '@/layouts/AuthLayout.vue';

const router = useRouter();
const toast = useToast();
const loginError = ref<string | null>(null);
const googleLoginError = ref<string | null>(null);

const schema = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup.string().required('Password is required'),
});

const loginWithEmail = async (values: LoginFormValues) => {
  loginError.value = null;
  googleLoginError.value = null;

  if (!values.email || !values.password) {
    loginError.value = 'Email and password are required.';
    return;
  }

  try {
    console.log('Attempting Firebase email login with:', values.email);
    const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
    console.log('Successfully logged in:', userCredential.user);
    toast.success("Login successful!");
    router.push('/');
  } catch (error) {
    console.error('Firebase email login error:', error);
    const authError = error as AuthError;
    switch (authError.code) {
      case 'auth/invalid-email':
        loginError.value = 'Invalid email address format.';
        break;
      case 'auth/user-disabled':
        loginError.value = 'This user account has been disabled.';
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        loginError.value = 'Invalid email or password.';
        break;
      default:
        loginError.value = 'An unexpected error occurred during login.';
    }
    toast.error(loginError.value || 'Login failed');
  }
};

const loginWithGoogle = async () => {
  loginError.value = null;
  googleLoginError.value = null;
  const provider = new GoogleAuthProvider();

  try {
    console.log('Attempting Firebase Google login...');
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log('Successfully logged in with Google:', user.uid, user.displayName);

    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      console.log('First time Google login, creating Firestore document for:', user.uid);
      try {
        await setDoc(userDocRef, {
          uid: user.uid,
          name: user.displayName || 'Google User',
          email: user.email,
          createdAt: serverTimestamp(),
          cellphone: null,
          isPremium: false,
        });
        console.log('Firestore document created for Google user.');
      } catch (firestoreError) {
        console.error("Error creating Firestore document for Google user:", firestoreError);
        googleLoginError.value = "Login successful, but couldn't save profile details.";
        toast.success("Login successful!");
        router.push('/');
        return;
      }
    }

    toast.success("Login successful!");
    router.push('/');

  } catch (error) {
    console.error('Firebase Google login error:', error);
    const authError = error as AuthError;
    googleLoginError.value = 'Failed to sign in with Google. Please try again.';
    switch (authError.code) {
        case 'auth/popup-closed-by-user':
            googleLoginError.value = 'Google sign-in cancelled.';
            break;
        case 'auth/account-exists-with-different-credential':
            googleLoginError.value = 'An account already exists with this email using a different sign-in method.';
            break;
        default:
            googleLoginError.value = 'An unexpected error occurred during Google sign-in.';
    }
    toast.error(googleLoginError.value || 'Google sign-in failed');
  }
};

const goToRegister = () => {
  router.push({ name: 'register' });
};

const goToForgotPassword = () => {
  router.push({ name: 'forgot-password' });
};
</script>

<template>
  <AuthLayout title="Login to Fakaloan">
    <template #errors>
      <div v-if="loginError" class="alert-error">
        {{ loginError }}
      </div>
      <div v-if="googleLoginError" class="alert-error">
        {{ googleLoginError }}
      </div>
    </template>

    <Form :validation-schema="schema" @submit="loginWithEmail" class="space-y-4">
      <div>
        <label for="email" class="form-label">Email address</label>
        <Field id="email" name="email" type="email" autocomplete="email" v-slot="{ field, errors }" :validate-on-input="true">
          <input v-bind="field" :class="['form-input-base', errors.length ? 'form-input-invalid' : 'form-input-valid']" placeholder="you@example.com" aria-describedby="email-error" />
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
        <Field id="password" name="password" type="password" autocomplete="current-password" v-slot="{ field, errors }" :validate-on-input="true">
          <input v-bind="field" type="password" :class="['form-input-base', errors.length ? 'form-input-invalid' : 'form-input-valid']" placeholder="Password" aria-describedby="password-error" />
        </Field>
        <ErrorMessage name="password" id="password-error" class="form-error-text" />
      </div>

      <div>
        <button type="submit" class="btn-primary">
          Sign in
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
        <button @click="loginWithGoogle" class="btn-secondary">
          <i class="i-logos-google-icon w-5 h-5 mr-2"></i>
          Sign in with Google
        </button>
      </div>

      <div class="text-sm text-center mt-4">
        <span class="text-gray-600">Don't have an account? </span>
        <button @click="goToRegister" class="btn-link">
          Create one
        </button>
      </div>
    </template>
  </AuthLayout>
</template>
