import type {
  LanguageCode,
  SubscriptionStatus,
  Theme,
} from '@/enums/user.enums';
import type { Timestamp } from 'firebase/firestore';

/**
 * User profile information stored in Firestore.
 */
export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  /** User's email address (nullable) */
  email: string | null;
  createdAt: Timestamp;
  /** Cellphone number (nullable) */
  cellphone: string | null;
  isPremium: boolean;
  preferences: { theme: Theme; preferredLanguage: LanguageCode };
  /** Paystack customer code (nullable) */
  paystackCustomerCode: string | null;
  /** Paystack subscription code (nullable) */
  paystackSubscriptionCode: string | null;
  /** Paystack plan code (nullable) */
  paystackPlanCode: string | null;
  subscriptionStatus: SubscriptionStatus | null;
  subscriptionStartDate: Timestamp | null;
  nextBillingDate: Timestamp | null;
  lastPaymentDate: Timestamp | null;
  lastPaymentAmount: number | null;
  trialEndsAt: Timestamp | null;
}
