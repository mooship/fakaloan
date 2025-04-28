import type {
  LanguageCode,
  SubscriptionStatus,
  Theme,
} from '@/enums/user.enums';
import type { Timestamp } from 'firebase/firestore';

/**
 * Represents the structure of a user's profile document stored in Firestore.
 * Contains personal details, application preferences, and subscription/payment information.
 */
export interface UserProfile {
  // Basic user information
  uid: string;
  firstName: string;
  lastName: string;
  email: string | null;
  createdAt: Timestamp;
  /**
   * User's cellphone number.
   * Should adhere to E.164 format (e.g., +271234567890).
   */
  cellphone: string | null;

  // Premium status
  isPremium: boolean;

  // User preferences
  preferences: {
    theme: Theme;
    preferredLanguage: LanguageCode;
  };

  // Paystack payment integration details
  paystackCustomerCode: string | null;
  paystackSubscriptionCode: string | null;
  paystackPlanCode: string | null;

  // Subscription information
  subscriptionStatus: SubscriptionStatus | null;
  subscriptionStartDate: Timestamp | null;
  nextBillingDate: Timestamp | null;
  lastPaymentDate: Timestamp | null;
  lastPaymentAmount: number | null;
  trialEndsAt: Timestamp | null;
}
