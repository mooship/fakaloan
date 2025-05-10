/**
 * Utility functions for formatting phone numbers and dates.
 */
import { LOCAL_PHONE_NUMBER_DISPLAY_REGEX } from '@/constants/regex.constants';
import type { FieldValue } from 'firebase/firestore';

/**
 * Normalizes a South African phone number to +27XXXXXXXXX format.
 * @param input - The input phone number string.
 * @returns The normalized phone number in +27XXXXXXXXX format, or an empty string if input is empty.
 */
export function normalizePhoneNumber(input: string): string {
  if (!input) {
    return '';
  }

  // Only allow and return local numbers like 0832342922
  const digits = input.replace(/\D/g, '');

  if (digits.startsWith('0') && digits.length === 10) {
    return digits;
  }

  return digits;
}

export function formatPhoneNumber(phone: string | null): string {
  if (!phone) {
    return '';
  }
  // Normalize to local format 0XXXXXXXXX
  const digits = normalizePhoneNumber(phone);
  // Format as 083 234 2922
  const match = digits.match(LOCAL_PHONE_NUMBER_DISPLAY_REGEX);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }
  return digits;
}

/**
 * Formats a Firestore Timestamp, Date, or string into a readable date/time string.
 * @param ts Firestore Timestamp, Date, string, or null/undefined
 * @returns string in 'dd/MM/yyyy HH:mm:ss' format, 'Pending...' if FieldValue, or '' if invalid
 */
export function formatDate(
  ts: { toDate?: () => Date } | Date | string | FieldValue | null | undefined
): string {
  if (!ts) {
    return '';
  }

  // If it's a Firestore FieldValue (no toDate method), show 'Pending...'
  if (typeof ts === 'object' && ts && !('toDate' in ts) && !('getTime' in ts)) {
    return 'Pending...';
  }

  let date: Date;
  if (
    typeof ts === 'object' &&
    ts &&
    'toDate' in ts &&
    typeof ts.toDate === 'function'
  ) {
    date = ts.toDate();
  } else if (ts instanceof Date) {
    date = ts;
  } else if (typeof ts === 'string') {
    date = new Date(ts);
  } else {
    return '';
  }

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const pad = (n: number) => n.toString().padStart(2, '0');

  // Format as dd/MM/yyyy HH:mm:ss
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
