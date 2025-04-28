import { LanguageCode, Theme } from '@/enums/user.enums';
import { auth, db } from '@/firebase';
import type {
  ForgotPasswordForm,
  LoginFormValues,
  RegisterFormValues,
} from '@/interfaces/auth.interfaces';
import type { UserProfile } from '@/interfaces/user.interfaces';
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
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useCurrentUser, useDocument } from 'vuefire';

export { db };

/**
 * Maps Firebase authentication error codes to user-friendly messages
 */
export const mapAuthError = (authError: AuthError): string => {
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
    case 'auth/requires-recent-login':
      return 'This operation is sensitive and requires recent authentication. Please log in again.';
    default:
      console.error('Unhandled Auth Error:', authError);
      return 'An unexpected error occurred. Please try again.';
  }
};

/**
 * Composable that provides authentication functionality
 * Handles login, logout, registration, password reset, and user profile data
 */
export function useAuth() {
  const router = useRouter();
  const toast = useToast();
  const currentUser = useCurrentUser();
  const { isOnline } = useNetwork();

  const [isLoading, toggleLoading] = useToggle(false);
  const authError = ref<string | null>(null);
  const [emailSent, toggleEmailSent] = useToggle(false);

  //------------------------------------------------------------
  // User Profile Management
  //------------------------------------------------------------

  // Create a ref for the user document path, dependent on currentUser
  const userDocRef = computed(() =>
    currentUser.value ? doc(db, 'users', currentUser.value.uid) : null
  );

  // Use useDocument to reactively fetch the user profile
  // Pass undefined as initial data type, let vuefire infer from Firestore
  const {
    data: userProfile,
    pending: profileLoading,
    error: profileError,
  } = useDocument<UserProfile>(userDocRef);

  // Watch for profile loading errors
  watch(profileError, (newError) => {
    if (newError) {
      console.error('Error loading user profile:', newError);
      toast.error('Could not load user profile details.');
    }
  });

  /**
   * Creates or updates a user profile in Firestore
   */
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
      authError.value =
        "Operation successful, but couldn't save/update profile details.";
      toast.warning(authError.value);
    }
  };

  //------------------------------------------------------------
  // Helper Functions
  //------------------------------------------------------------

  /**
   * Checks if the device is online before proceeding with auth operations
   * @returns boolean - true if online, false otherwise
   */
  const checkNetwork = (): boolean => {
    if (!isOnline.value) {
      const msg =
        'No internet connection. Please connect to the internet and try again.';
      authError.value = msg;
      toast.error(msg);
      return false;
    }
    authError.value = null;
    return true;
  };

  //------------------------------------------------------------
  // Authentication Methods
  //------------------------------------------------------------

  /**
   * Handles email/password login
   */
  const loginWithEmail = async (values: LoginFormValues) => {
    if (!checkNetwork()) {
      return;
    }

    if (!values.email) {
      authError.value = 'Email is required.';
      toast.error(authError.value);
      return;
    }

    if (!values.password) {
      authError.value = 'Password is required.';
      toast.error(authError.value);
      return;
    }

    toggleLoading(true);
    authError.value = null;

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
      authError.value = mapAuthError(err as AuthError);
      toast.error(authError.value || 'Login failed');
    } finally {
      toggleLoading(false);
    }
  };

  /**
   * Handles Google OAuth login
   */
  const loginWithGoogle = async () => {
    if (!checkNetwork()) {
      return;
    }

    toggleLoading(true);
    authError.value = null;
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
      authError.value = mapAuthError(err as AuthError);
      toast.error(authError.value || 'Google sign-in failed');
    } finally {
      toggleLoading(false);
    }
  };

  /**
   * Handles user registration with email and password
   */
  const registerWithEmail = async (values: RegisterFormValues) => {
    if (!checkNetwork()) {
      return;
    }

    if (!values.email) {
      authError.value = 'Email is required for registration.';
      toast.error(authError.value);
      return;
    }

    if (!values.password) {
      authError.value = 'Password is required for registration.';
      toast.error(authError.value);
      return;
    }

    if (!values.name) {
      authError.value = 'Name is required for registration.';
      toast.error(authError.value);
      return;
    }

    toggleLoading(true);
    authError.value = null;

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
      authError.value = mapAuthError(err as AuthError);
      toast.error(authError.value || 'Registration failed.');
    } finally {
      toggleLoading(false);
    }
  };

  /**
   * Logs out the current user
   */
  const logout = async () => {
    toggleLoading(true);
    authError.value = null;
    try {
      console.log('Attempting logout...');
      await signOut(auth);
      console.log('Logout successful.');
      toast.success('You have been logged out.');
      router.push({ name: 'login' });
    } catch (err) {
      console.error('Logout failed:', err);
      authError.value = 'Logout failed. Please try again.';
      toast.error(authError.value);
    } finally {
      toggleLoading(false);
    }
  };

  /**
   * Sends a password reset email to the provided address
   */
  const sendPasswordReset = async (values: ForgotPasswordForm) => {
    if (!checkNetwork()) {
      return;
    }

    if (!values.email) {
      authError.value = 'Email is required to reset password.';
      toast.error(authError.value);
      return;
    }

    toggleLoading(true);
    authError.value = null;
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
      authError.value = mapAuthError(err as AuthError);
      toast.error(authError.value || 'Password reset failed.');
      toggleEmailSent(false);
    } finally {
      toggleLoading(false);
    }
  };

  //------------------------------------------------------------
  // Exported state and methods
  //------------------------------------------------------------
  return {
    currentUser,
    userProfile,
    isLoading: computed(() => isLoading.value || profileLoading.value),
    authLoading: isLoading,
    profileLoading,
    error: authError,
    profileError,
    emailSent,
    isOnline,
    loginWithEmail,
    loginWithGoogle,
    registerWithEmail,
    logout,
    sendPasswordReset,
  };
}
