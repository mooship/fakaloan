export enum AuthErrorCode {
  InvalidEmail = 'auth/invalid-email',
  UserDisabled = 'auth/user-disabled',
  UserNotFound = 'auth/user-not-found',
  WrongPassword = 'auth/wrong-password',
  InvalidCredential = 'auth/invalid-credential',
  EmailAlreadyInUse = 'auth/email-already-in-use',
  WeakPassword = 'auth/weak-password',
  PopupClosedByUser = 'auth/popup-closed-by-user',
  AccountExistsWithDifferentCredential = 'auth/account-exists-with-different-credential',
  RequiresRecentLogin = 'auth/requires-recent-login',
}

export const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  [AuthErrorCode.InvalidEmail]: 'Invalid email address format.',
  [AuthErrorCode.UserDisabled]: 'This user account has been disabled.',
  [AuthErrorCode.UserNotFound]: 'Invalid email or password.',
  [AuthErrorCode.WrongPassword]: 'Invalid email or password.',
  [AuthErrorCode.InvalidCredential]: 'Invalid email or password.',
  [AuthErrorCode.EmailAlreadyInUse]:
    'This email address is already registered.',
  [AuthErrorCode.WeakPassword]:
    'Password is too weak. It must be at least 8 characters long.',
  [AuthErrorCode.PopupClosedByUser]: 'Sign-in cancelled.',
  [AuthErrorCode.AccountExistsWithDifferentCredential]:
    'An account already exists with this email using a different sign-in method.',
  [AuthErrorCode.RequiresRecentLogin]:
    'This operation is sensitive and requires recent authentication. Please log in again.',
};

export const DEFAULT_AUTH_ERROR_MESSAGE =
  'An unexpected error occurred. Please try again.';
