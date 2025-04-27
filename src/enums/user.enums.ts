/**
 * Supported languages for user preference.
 */
export enum LanguageCode {
  English = 'en',
  Afrikaans = 'af',
  Zulu = 'zu',
  Xhosa = 'xh',
  Sotho = 'st',
  Tswana = 'tn',
}

/**
 * Possible subscription statuses from Paystack (and null for non-subscribers).
 */
export enum SubscriptionStatus {
  Active = 'active',
  Trialing = 'trialing',
  PastDue = 'past_due',
  Canceled = 'canceled',
  Inactive = 'inactive',
}

/**
 * Available UI themes.
 */
export enum Theme {
  Light = 'light',
  Dark = 'dark',
}
