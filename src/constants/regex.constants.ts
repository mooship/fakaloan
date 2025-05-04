/**
 * Regex for validating South African phone numbers: +27XXXXXXXXX or 0XXXXXXXXX (10 digits after prefix).
 */
export const PHONE_NUMBER_REGEX = /^(\+27|0)\d{9}$/;
/**
 * Utility to normalize SA numbers to +27XXXXXXXXX
 */
export function normalizePhoneNumber(input: string): string {
  if (!input) {
    return '';
  }

  const digits = input.replace(/\D/g, '');

  if (digits.startsWith('27') && digits.length === 11) {
    return `+${digits}`;
  }

  if (digits.startsWith('0') && digits.length === 10) {
    return `+27${digits.slice(1)}`;
  }

  if (digits.startsWith('27') && digits.length === 9) {
    return `+27${digits}`;
  }

  return input.startsWith('+') ? input : `+${digits}`;
}
/**
 * Regex for formatting phone numbers for display (e.g., +27 68 599 5633).
 */
export const DISPLAY_PHONE_NUMBER_REGEX = /^(\+\d{2})(\d{2})(\d{3})(\d{4})$/;
/**
 * Regex for matching whitespace in strings.
 */
export const WHITESPACE_REGEX = /\s+/g;
/**
 * Regex for grouping digits in phone numbers for display.
 */
export const GROUP_3_4_REGEX = /(\d{3,4})(?=\d)/g;
/**
 * Regex for validating email addresses (simple version).
 */
export const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
/**
 * Regex for basic email validation (used in ProfileView.vue for quick checks).
 */
export const SIMPLE_EMAIL_REGEX = /^\S+@\S+\.\S+$/;
