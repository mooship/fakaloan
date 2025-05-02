/**
 * user.enums.ts
 *
 * Enums for user preferences and subscription status in Fakaloan.
 * Includes supported languages, subscription statuses, and UI themes.
 *
 * @module enums/user.enums
 * @enum {string}
 */

/**
 * Supported languages for user preference (ISO 639-1 codes).
 */
export enum LanguageCode {
  English = 'en',
  Zulu = 'zu',
  Xhosa = 'xh',
}

/**
 * Possible subscription statuses, typically mirroring values from a payment processor.
 */
export enum SubscriptionStatus {
  Active = 'active',
  Trialing = 'trialing',
  PastDue = 'past_due',
  Canceled = 'canceled',
  NonRenewing = 'non-renewing',
  Attention = 'attention',
}

/**
 * Available UI themes for the application.
 */
export enum Theme {
  Light = 'light',
  Dark = 'dark',
}
