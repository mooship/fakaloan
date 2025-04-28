import type {
  LanguageCode,
  SubscriptionStatus,
  Theme,
} from '@/enums/user.enums';
import type { Timestamp } from 'firebase/firestore';

/**
 * Represents a user's profile information stored in Firestore
 * Contains personal details, preferences, and subscription information
 */
export interface UserProfile {
  // Basic user information
  uid: string; // Firebase Authentication UID
  name: string; // User's full name
  email: string | null; // User's email address
  createdAt: Timestamp; // When the user account was created
  cellphone: string | null; // User's contact number

  // Premium status
  isPremium: boolean; // Whether user has premium features

  // User preferences
  preferences: { theme: Theme }; // UI preferences like light/dark mode
  preferredLanguage: LanguageCode; // Preferred language for the interface

  // Paystack payment integration details
  paystackCustomerId: string | null; // ID in Paystack system
  paystackSubscriptionId: string | null; // Subscription ID in Paystack
  paystackPlanId: string | null; // Plan ID in Paystack

  // Subscription information
  subscriptionStatus: SubscriptionStatus | null; // Current subscription status
  subscriptionStartDate: Timestamp | null; // When subscription started
  nextBillingDate: Timestamp | null; // Next payment due date
  lastPaymentDate: Timestamp | null; // When last payment was made
  lastPaymentAmount: number | null; // Amount of last payment
  trialEndsAt: Timestamp | null; // When free trial ends
}
