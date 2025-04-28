/**
 * Supported languages for user preference.
 * Uses ISO 639-1 codes where available.
 * Currently supports English and two major South African languages.
 * More languages will be added in the future to support all official South African languages.
 */
export enum LanguageCode {
  English = 'en',
  Zulu = 'zu',
  Xhosa = 'xh',
}

/**
 * Possible subscription statuses, typically mirroring values from a payment processor like Paystack.
 *
 * - `active`: Subscription is active and payments are current.
 * - `trialing`: User is within a free trial period.
 * - `past_due`: Payment is overdue, subscription may be temporarily inactive. Requires attention.
 * - `canceled`: Subscription has been explicitly canceled by the user or admin.
 * - `non-renewing`: Subscription is active but set not to renew at the end of the current billing period.
 * - `attention`: Subscription requires attention, often due to payment issues or upcoming expiration.
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
 * Used in user preferences to customize the visual appearance.
 */
export enum Theme {
  Light = 'light',
  Dark = 'dark',
}
