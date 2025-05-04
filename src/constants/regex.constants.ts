/**
 * Regex for validating international phone numbers (10-15 digits, optional +).
 */
export const PHONE_NUMBER_REGEX = /^\+?\d{10,15}$/;
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
