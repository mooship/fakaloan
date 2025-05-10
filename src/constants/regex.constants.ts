/**
 * Regex for validating South African phone numbers: +27XXXXXXXXX or 0XXXXXXXXX (10 digits after prefix).
 */
export const PHONE_NUMBER_REGEX = /^0\d{9}$/;

/**
 * Regex for formatting phone numbers for display (e.g., +27 68 599 5633).
 */
export const DISPLAY_PHONE_NUMBER_REGEX = /^(\+\d{2})(\d{2})(\d{3})(\d{4})$/;

/**
 * Regex for formatting local phone numbers for display (e.g., 083 234 2922).
 */
export const LOCAL_PHONE_NUMBER_DISPLAY_REGEX = /^(0\d{3})(\d{3})(\d{4})$/;

/**
 * Matches whitespace in strings.
 */
export const WHITESPACE_REGEX = /\s+/g;

/**
 * Groups digits in phone numbers for display.
 */
export const GROUP_3_4_REGEX = /(\d{3,4})(?=\d)/g;

/**
 * Simple regex for validating email addresses.
 */
export const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Basic email validation regex (used for quick checks).
 */
export const SIMPLE_EMAIL_REGEX = /^\S+@\S+\.\S+$/;
