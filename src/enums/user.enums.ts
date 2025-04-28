/**
 * Supported languages for user preference.
 * Currently supports English and two major South African languages.
 * More languages will be added in the future to support all official South African languages.
 */
export enum LanguageCode {
  English = 'en',
  Zulu = 'zu',
  Xhosa = 'xh',
}

/**
 * Possible subscription statuses from Paystack payment processor.
 * These match the status values returned by Paystack's API.
 *
 * active - Subscription is active and payments are being processed
 * trialing - User is in free trial period
 * past_due - Payment is overdue
 * canceled - Subscription has been canceled
 * inactive - Subscription is not active (default for new users)
 */
export enum SubscriptionStatus {
  Active = 'active',
  Trialing = 'trialing',
  PastDue = 'past_due',
  Canceled = 'canceled',
  Inactive = 'inactive',
}

/**
 * Available UI themes for the application.
 * Used in user preferences to customize the UI appearance.
 */
export enum Theme {
  Light = 'light',
  Dark = 'dark',
}
