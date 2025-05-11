import {
  AUTH_ERROR_MESSAGES,
  DEFAULT_AUTH_ERROR_MESSAGE,
} from '@/constants/authErrors.constants';
import { ToastMessages } from '@/constants/toastMessages.constants';
import type { AuthErrorCode } from '@/enums/authErrors.enums';
import { LanguageCode, Theme } from '@/enums/user.enums';
import { auth, db } from '@/firebase';
import type {
  ForgotPasswordForm,
  LoginFormValues,
  RegisterFormValues,
} from '@/interfaces/auth.interfaces';
import type { UserProfile } from '@/interfaces/user.interfaces';
import { ensureOnline, requireField } from '@/utilities/authUtils';
import { useNetwork, useToggle } from '@vueuse/core';
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  updatePassword as firebaseUpdatePassword,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type AuthError,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { computed, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useCurrentUser, useDocument } from 'vuefire';

export { db };

export const mapAuthError = (authError: AuthError): string => {
  if (authError.code in AUTH_ERROR_MESSAGES) {
    return AUTH_ERROR_MESSAGES[authError.code as AuthErrorCode];
  }
  console.error('Unhandled Auth Error:', authError);
  return DEFAULT_AUTH_ERROR_MESSAGE;
};

/**
 * Composable for authentication and user profile management.
 * Provides login, registration, logout, password reset, and user profile utilities.
 * Uses Firebase Auth and Firestore.
 */
export function useAuth() {
  const toast = useToast();
  const currentUser = useCurrentUser();
  const { isOnline } = useNetwork();

  const [isLoading, toggleLoading] = useToggle(false);
  const authError = ref<string | null>(null);

  const [emailSent, toggleEmailSent] = useToggle(false);

  const userDocRef = computed(() =>
    currentUser.value ? doc(db, 'users', currentUser.value.uid) : null
  );

  const {
    data: userProfile,
    pending: profileLoading,
    error: profileError,
  } = useDocument<UserProfile>(userDocRef);

  const userProfileWithDefaults = computed<UserProfile | null>(() => {
    const profile = userProfile.value;
    if (!profile) {
      return null;
    }

    return {
      ...profile,
      preferences: {
        theme: profile.preferences?.theme ?? Theme.Light,
        preferredLanguage:
          profile.preferences?.preferredLanguage ?? LanguageCode.English,
      },
    };
  });

  watch(profileError, (newError) => {
    if (newError) {
      console.error('Error loading user profile:', newError);
      toast.error(ToastMessages.ProfileUpdateFailed);
    }
  });

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
          preferences: {
            theme: Theme.Light,
            preferredLanguage: LanguageCode.English,
          },
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

  const checkNetwork = () =>
    ensureOnline(
      isOnline.value,
      (msg) => {
        authError.value = msg;
      },
      toast
    );

  const loginWithEmail = async (values: LoginFormValues): Promise<boolean> => {
    if (!checkNetwork()) {
      return false;
    }

    if (
      !requireField(
        values.email,
        'Email is required.',
        (msg) => {
          authError.value = msg;
        },
        toast
      )
    )
      return false;
    if (
      !requireField(
        values.password,
        'Password is required.',
        (msg) => {
          authError.value = msg;
        },
        toast
      )
    )
      return false;
    toggleLoading(true);
    authError.value = null;
    try {
      if (!values.email || !values.password) {
        throw new Error('Email and password are required.');
      }

      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast.success(ToastMessages.LoginSuccess);

      return true;
    } catch (err) {
      authError.value = mapAuthError(err as AuthError);
      toast.error(authError.value || ToastMessages.LoginFailed);

      return false;
    } finally {
      toggleLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    if (!checkNetwork()) {
      return false;
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

      let firstName = 'Google';
      let lastName = '';
      if (user.displayName) {
        const nameParts = user.displayName.trim().split(' ');
        firstName = nameParts[0];
        lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      }

      await createUserProfile(user.uid, firstName, lastName, user.email);

      toast.success(ToastMessages.LoginSuccess);

      return true;
    } catch (err) {
      authError.value = mapAuthError(err as AuthError);
      toast.error(authError.value || ToastMessages.LoginFailed);

      return false;
    } finally {
      toggleLoading(false);
    }
  };

  const registerWithEmail = async (
    values: RegisterFormValues
  ): Promise<boolean> => {
    if (!checkNetwork()) {
      return false;
    }

    if (
      !requireField(
        values.email,
        'Email is required for registration.',
        (msg) => {
          authError.value = msg;
        },
        toast
      )
    )
      return false;
    if (
      !requireField(
        values.password,
        'Password is required for registration.',
        (msg) => {
          authError.value = msg;
        },
        toast
      )
    )
      return false;
    if (
      !requireField(
        values.firstName,
        'First name is required for registration.',
        (msg) => {
          authError.value = msg;
        },
        toast
      )
    )
      return false;
    if (
      !requireField(
        values.lastName,
        'Last name is required for registration.',
        (msg) => {
          authError.value = msg;
        },
        toast
      )
    )
      return false;
    toggleLoading(true);
    authError.value = null;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email as string,
        values.password as string
      );

      const user = userCredential.user;
      console.log('Firebase Auth user created:', user.uid);

      await createUserProfile(
        user.uid,
        values.firstName as string,
        values.lastName as string,
        user.email
      );

      toast.success(ToastMessages.RegistrationSuccess);

      return true;
    } catch (err) {
      authError.value = mapAuthError(err as AuthError);
      toast.error(authError.value || ToastMessages.RegistrationFailed);

      return false;
    } finally {
      toggleLoading(false);
    }
  };

  const logout = async (): Promise<boolean> => {
    toggleLoading(true);
    authError.value = null;
    try {
      await signOut(auth);
      toast.success(ToastMessages.LogoutSuccess);
      return true;
    } catch {
      authError.value = ToastMessages.LogoutFailed;
      toast.error(authError.value);
      return false;
    } finally {
      toggleLoading(false);
    }
  };

  const sendPasswordReset = async (
    values: ForgotPasswordForm
  ): Promise<boolean> => {
    if (!checkNetwork()) {
      return false;
    }

    if (
      !requireField(
        values.email,
        'Email is required to reset password.',
        (msg) => {
          authError.value = msg;
        },
        toast
      )
    )
      return false;
    toggleLoading(true);
    authError.value = null;
    toggleEmailSent(false);

    try {
      console.log('Attempting password reset for:', values.email);
      await sendPasswordResetEmail(auth, values.email);
      console.log('Password reset email sent successfully.');
      toggleEmailSent(true);
      toast.success(ToastMessages.PasswordResetSent);
      return true;
    } catch (err) {
      authError.value = mapAuthError(err as AuthError);
      toast.error(authError.value || ToastMessages.PasswordResetFailed);
      toggleEmailSent(false);
      return false;
    } finally {
      toggleLoading(false);
    }
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    if (!checkNetwork()) {
      return false;
    }

    if (!currentUser.value || !currentUser.value.email) {
      authError.value = 'User not logged in or email missing.';
      toast.error(authError.value);
      return false;
    }

    if (
      !requireField(
        currentPassword,
        'Current password is required.',
        (msg) => {
          authError.value = msg;
        },
        toast
      )
    ) {
      return false;
    }
    if (
      !requireField(
        newPassword,
        'New password is required.',
        (msg) => {
          authError.value = msg;
        },
        toast
      )
    ) {
      return false;
    }

    toggleLoading(true);
    authError.value = null;

    try {
      const credential = EmailAuthProvider.credential(
        currentUser.value.email,
        currentPassword
      );

      console.log('Attempting re-authentication for password change...');
      await reauthenticateWithCredential(currentUser.value, credential);
      console.log('Re-authentication successful.');

      console.log('Attempting password update...');
      await firebaseUpdatePassword(currentUser.value, newPassword);
      console.log('Password updated successfully in Firebase Auth.');
      toast.success(ToastMessages.PasswordUpdateSuccess);
      return true;
    } catch (err) {
      console.error('Password update failed:', err);
      authError.value = mapAuthError(err as AuthError);
      toast.error(authError.value || ToastMessages.PasswordUpdateFailed);
      return false;
    } finally {
      toggleLoading(false);
    }
  };

  return {
    currentUser,
    userProfile: userProfileWithDefaults,
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
    updatePassword,
  };
}
