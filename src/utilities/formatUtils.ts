import { normalizePhoneNumber } from '@/constants/regex.constants';

export function formatPhoneNumber(phone: string | null): string {
  if (!phone) {
    return '';
  }
  // Always normalize to +27XXXXXXXXX
  const digits = normalizePhoneNumber(phone);
  // Format as +27 XX XXX XXXX
  if (/^\+27\d{9}$/.test(digits)) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return digits;
}

/**
 * Formats a Firestore Timestamp, Date, or string into a readable date/time string.
 * @param ts Firestore Timestamp, Date, string, or null/undefined
 * @returns string in 'YYYY/MM/DD HH:mm:ss' format or '' if invalid
 */
export function formatDate(
  ts: { toDate?: () => Date } | Date | string | null | undefined
): string {
  if (!ts) return '';
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

  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
