/**
 * Supported language codes for the app.
 */
export enum LanguageCode {
  English = 'en',
  Zulu = 'zu',
  Xhosa = 'xh',
}

/**
 * Subscription status values for user accounts.
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
 * Theme options for user preferences.
 */
export enum Theme {
  Light = 'light',
  Dark = 'dark',
}
