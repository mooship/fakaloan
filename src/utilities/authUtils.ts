import { ToastMessages } from '@/constants/toastMessages.constants';
import type { useToast } from 'vue-toastification';

/**
 * Ensures the user is online before proceeding. Sets error and shows toast if offline.
 *
 * @param isOnline - Whether the user is online.
 * @param setError - Function to set the error message.
 * @param toast - Toast instance for showing errors.
 * @returns True if online, false otherwise.
 */
export function ensureOnline(
  isOnline: boolean,
  setError: (msg: string | null) => void,
  toast: ReturnType<typeof useToast>
): boolean {
  if (!isOnline) {
    setError(ToastMessages.NetworkError);
    toast.error(ToastMessages.NetworkError);
    return false;
  }
  setError(null);
  return true;
}

/**
 * Ensures a required field is present. Sets error and shows toast if missing.
 *
 * @param value - The value to check.
 * @param errorMessage - Error message to show if missing.
 * @param setError - Function to set the error message.
 * @param toast - Toast instance for showing errors.
 * @returns True if value is present, false otherwise.
 */
export function requireField(
  value: unknown,
  errorMessage: string,
  setError: (msg: string | null) => void,
  toast: ReturnType<typeof useToast>
): boolean {
  if (value === null || value === undefined || value === '') {
    setError(errorMessage);
    toast.error(errorMessage);
    return false;
  }
  setError(null);
  return true;
}
