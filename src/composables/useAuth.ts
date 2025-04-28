import { LanguageCode, Theme } from '@/enums/user.enums';
import { auth, db } from '@/firebase';
import type {
  ForgotPasswordForm,
  LoginFormValues,
  RegisterFormValues,
} from '@/interfaces/auth.interfaces';
import { useNetwork, useToggle } from '@vueuse/core';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type AuthError,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useCurrentUser } from 'vuefire';

export function useAuth() {
  const router = useRouter();
  const toast = useToast();
  const currentUser = useCurrentUser();
  const { isOnline } = useNetwork();

  const [isLoading, toggleLoading] = useToggle(false);
  const error = ref<string | null>(null);
  const [emailSent, toggleEmailSent] = useToggle(false);

  const checkNetwork = (): boolean => {
    if (!isOnline.value) {
      const msg =
        'No internet connection. Please connect to the internet and try again.';
      error.value = msg;
      toast.error(msg);
      return false;
    }
    error.value = null;
    return true;
  };

  const mapAuthError = (authError: AuthError): string => {
    switch (authError.code) {
      case 'auth/invalid-email':
        return 'Invalid email address format.';
      case 'auth/user-disabled':
        return 'This user account has been disabled.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password.';
      case 'auth/email-already-in-use':
        return 'This email address is already registered.';
      case 'auth/weak-password':
        return 'Password is too weak. It must be at least 8 characters long.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in cancelled.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with this email using a different sign-in method.';
      default:
        console.error('Unhandled Auth Error:', authError);
        return 'An unexpected error occurred. Please try again.';
    }
  };

  const createUserProfile = async (
    userId: string,
    name: string,
    email: string | null
  ) => {
    const userDocRef = doc(db, 'users', userId);
    try {
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        await setDoc(userDocRef, {
          uid: userId,
          name: name,
          email: email,
          createdAt: serverTimestamp(),
          cellphone: null,
          isPremium: false,
          preferences: { theme: Theme.Light },
          preferredLanguage: LanguageCode.English,
          paystackCustomerId: null,
          paystackSubscriptionId: null,
          paystackPlanId: null,
          subscriptionStatus: null,
          subscriptionStartDate: null,
          nextBillingDate: null,
          lastPaymentDate: null,
          lastPaymentAmount: null,
          trialEndsAt: null,
        });
        console.log('Firestore document created for user:', userId);
      } else {
        console.log('Firestore document already exists for user:', userId);
      }
    } catch (firestoreError) {
      console.error(
        'Error accessing/creating Firestore document for user:',
        firestoreError
      );
      error.value =
        "Operation successful, but couldn't save/update profile details.";
      toast.warning(error.value);
    }
  };

  const loginWithEmail = async (values: LoginFormValues) => {
    if (!checkNetwork()) {
      return;
    }

    if (!values.email) {
      error.value = 'Email is required.';
      toast.error(error.value);
      return;
    }

    if (!values.password) {
      error.value = 'Password is required.';
      toast.error(error.value);
      return;
    }

    toggleLoading(true);
    error.value = null;

    try {
      console.log('Attempting Firebase email login with:', values.email);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      console.log('Successfully logged in:', userCredential.user);
      toast.success('Login successful!');
      router.push('/');
    } catch (err) {
      console.error('Firebase email login error:', err);
      error.value = mapAuthError(err as AuthError);
      toast.error(error.value || 'Login failed');
    } finally {
      toggleLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    if (!checkNetwork()) {
      return;
    }

    toggleLoading(true);
    error.value = null;
    const provider = new GoogleAuthProvider();

    try {
      console.log('Attempting Firebase Google login...');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(
        'Successfully logged in with Google:',
        user.uid,
        user.displayName
      );

      await createUserProfile(
        user.uid,
        user.displayName || 'Google User',
        user.email
      );

      toast.success('Login successful!');
      router.push('/');
    } catch (err) {
      console.error('Firebase Google login error:', err);
      error.value = mapAuthError(err as AuthError);
      toast.error(error.value || 'Google sign-in failed');
    } finally {
      toggleLoading(false);
    }
  };

  const registerWithEmail = async (values: RegisterFormValues) => {
    if (!checkNetwork()) {
      return;
    }

    if (!values.email) {
      error.value = 'Email is required for registration.';
      toast.error(error.value);
      return;
    }

    if (!values.password) {
      error.value = 'Password is required for registration.';
      toast.error(error.value);
      return;
    }

    if (!values.name) {
      error.value = 'Name is required for registration.';
      toast.error(error.value);
      return;
    }

    toggleLoading(true);
    error.value = null;

    try {
      console.log('Attempting Firebase registration for:', values.email);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      const user = userCredential.user;
      console.log('Firebase Auth user created:', user.uid);

      await createUserProfile(user.uid, values.name, user.email);

      toast.success('Registration successful! Please log in.');
      router.push({ name: 'login' });
    } catch (err) {
      console.error('Registration failed:', err);
      error.value = mapAuthError(err as AuthError);
      toast.error(error.value || 'Registration failed.');
    } finally {
      toggleLoading(false);
    }
  };

  const logout = async () => {
    toggleLoading(true);
    error.value = null;
    try {
      console.log('Attempting logout...');
      await signOut(auth);
      console.log('Logout successful.');
      toast.success('You have been logged out.');
      router.push({ name: 'login' });
    } catch (err) {
      console.error('Logout failed:', err);
      error.value = 'Logout failed. Please try again.';
      toast.error(error.value);
    } finally {
      toggleLoading(false);
    }
  };

  const sendPasswordReset = async (values: ForgotPasswordForm) => {
    if (!checkNetwork()) {
      return;
    }

    if (!values.email) {
      error.value = 'Email is required to reset password.';
      toast.error(error.value);
      return;
    }

    toggleLoading(true);
    error.value = null;
    toggleEmailSent(false);

    try {
      console.log('Attempting password reset for:', values.email);
      await sendPasswordResetEmail(auth, values.email);
      console.log('Password reset email sent successfully.');
      toggleEmailSent(true);
      toast.success(
        'Password reset email sent. Please check your inbox (and spam folder).'
      );
    } catch (err) {
      console.error('Password reset error:', err);
      error.value = mapAuthError(err as AuthError);
      toast.error(error.value || 'Password reset failed.');
      toggleEmailSent(false);
    } finally {
      toggleLoading(false);
    }
  };

  return {
    currentUser,
    isLoading,
    error,
    emailSent,
    isOnline,
    loginWithEmail,
    loginWithGoogle,
    registerWithEmail,
    logout,
    sendPasswordReset,
  };
}
