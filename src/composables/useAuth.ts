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
  EmailAuthProvider,
  updatePassword as firebaseUpdatePassword, // Add import
  GoogleAuthProvider,
  reauthenticateWithCredential, // Add import
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut, // Add import and alias
  type AuthError,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useCurrentUser, useDocument } from 'vuefire';

// Re-export db for potential use elsewhere if needed, though typically imported directly
export { db };

//--------------------------------------------------------------------------
// Error Mapping
//--------------------------------------------------------------------------
/**
 * Maps Firebase authentication error codes to user-friendly messages.
 * @param authError - The Firebase AuthError object.
 * @returns A user-friendly error message string.
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

//--------------------------------------------------------------------------
// useAuth Composable
//--------------------------------------------------------------------------
/**
 * Composable that provides authentication functionality.
 * Handles login, logout, registration, password reset, and user profile data management.
 */
export function useAuth() {
  //------------------------------------------------------------
  // Core Dependencies & State
  //------------------------------------------------------------
  const router = useRouter();
  const toast = useToast();
  const currentUser = useCurrentUser(); // Reactive Firebase Auth user state
  const { isOnline } = useNetwork(); // Reactive network status

  // Loading and error states for general auth operations
  const [isLoading, toggleLoading] = useToggle(false);
  const authError = ref<string | null>(null);

  // State specific to password reset flow
  const [emailSent, toggleEmailSent] = useToggle(false);

  //------------------------------------------------------------
  // User Profile Management (Firestore)
  //------------------------------------------------------------

  // Reactive Firestore document reference based on the current user's UID
  const userDocRef = computed(() =>
    currentUser.value ? doc(db, 'users', currentUser.value.uid) : null
  );

  // Reactive user profile data fetched from Firestore using vuefire
  const {
    data: userProfile, // Raw profile data from Firestore
    pending: profileLoading, // Loading state specifically for the profile fetch
    error: profileError, // Error state specifically for the profile fetch
  } = useDocument<UserProfile>(userDocRef);

  // Computed property to provide default preferences if they are missing in the fetched profile
  const userProfileWithDefaults = computed<UserProfile | null>(() => {
    const profile = userProfile.value;
    if (!profile) return null;
    return {
      ...profile,
      preferences: {
        theme: profile.preferences?.theme ?? Theme.Light,
        preferredLanguage:
          profile.preferences?.preferredLanguage ?? LanguageCode.English,
      },
    };
  });

  // Watcher to handle errors during profile fetching
  watch(profileError, (newError) => {
    if (newError) {
      console.error('Error loading user profile:', newError);
      toast.error('Could not load user profile details.');
    }
  });

  /**
   * Creates a user profile document in Firestore if it doesn't exist.
   * Called after successful registration or first Google login.
   * @param userId - The Firebase Auth UID of the user.
   * @param firstName - The user's first name.
   * @param lastName - The user's last name.
   * @param email - The user's email address.
   */
  const createUserProfile = async (
    userId: string,
    firstName: string,
    lastName: string,
    email: string | null
  ) => {
    const userDocRef = doc(db, 'users', userId);
    try {
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        await setDoc(userDocRef, {
          uid: userId,
          firstName: firstName,
          lastName: lastName,
          email: email,
          createdAt: serverTimestamp(),
          cellphone: null,
          isPremium: false,
          preferences: {
            theme: Theme.Light,
            preferredLanguage: LanguageCode.English,
          },
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
   * Checks if the device is online before proceeding with network-dependent auth operations.
   * Displays a toast message and sets authError if offline.
   * @returns boolean - true if online, false otherwise.
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
   * Handles user login with email and password.
   * @param values - Object containing email and password.
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
   * Handles user login via Google OAuth popup.
   * Creates a user profile if it's the first time logging in with Google.
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
        user.displayName?.split(' ')[0] || 'Google',
        user.displayName?.split(' ')[1] || 'User',
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
   * Handles user registration with email, password, and name.
   * Creates a user profile upon successful registration.
   * @param values - Object containing first name, last name, email, and password.
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

    if (!values.firstName) {
      authError.value = 'First name is required for registration.';
      toast.error(authError.value);
      return;
    }

    if (!values.lastName) {
      authError.value = 'Last name is required for registration.';
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

      await createUserProfile(
        user.uid,
        values.firstName,
        values.lastName,
        user.email
      );

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
   * Logs out the currently authenticated user.
   * Redirects to the login page upon successful logout.
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
   * Sends a password reset email to the provided email address.
   * @param values - Object containing the user's email.
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

  /**
   * Updates the user's password after re-authenticating with the current password.
   * @param currentPassword - The user's current password.
   * @param newPassword - The desired new password.
   * @returns boolean - True if the password update was successful, false otherwise.
   */
  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    if (!checkNetwork()) return false;
    if (!currentUser.value || !currentUser.value.email) {
      authError.value = 'User not logged in or email missing.';
      toast.error(authError.value);
      return false;
    }

    toggleLoading(true);
    authError.value = null;

    try {
      // Create credential with current password
      const credential = EmailAuthProvider.credential(
        currentUser.value.email,
        currentPassword
      );

      // Re-authenticate the user
      console.log('Attempting re-authentication for password change...');
      await reauthenticateWithCredential(currentUser.value, credential);
      console.log('Re-authentication successful.');

      // Update the password
      console.log('Attempting password update...');
      await firebaseUpdatePassword(currentUser.value, newPassword);
      console.log('Password updated successfully in Firebase Auth.');
      toggleLoading(false);
      return true; // Indicate success
    } catch (err) {
      console.error('Password update failed:', err);
      authError.value = mapAuthError(err as AuthError);
      toast.error(authError.value || 'Failed to update password.');
      toggleLoading(false);
      return false; // Indicate failure
    }
  };

  //------------------------------------------------------------
  // Exported State and Methods
  //------------------------------------------------------------
  return {
    // --- Reactive State ---
    currentUser, // The authenticated Firebase user object (or null)
    userProfile: userProfileWithDefaults, // User profile data from Firestore (with defaults)
    isLoading: computed(() => isLoading.value || profileLoading.value), // Combined loading state
    authLoading: isLoading, // Loading state for general auth operations
    profileLoading, // Loading state specifically for profile fetching
    error: authError, // Error message for general auth operations
    profileError, // Error object specifically from profile fetching
    emailSent, // Flag indicating if password reset email was sent
    isOnline, // Network connection status

    // --- Methods ---
    loginWithEmail,
    loginWithGoogle,
    registerWithEmail,
    logout,
    sendPasswordReset,
    updatePassword,
  };
}
