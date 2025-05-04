import { AuthErrorCode } from '@/enums/authErrors.enums';

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
