import { ToastMessages } from '@/constants/toastMessages.constants';
import type { useToast } from 'vue-toastification';

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
