import type {
  LanguageCode,
  SubscriptionStatus,
  Theme,
} from '@/enums/user.enums';
import type { FieldValue, Timestamp } from 'firebase/firestore';

/**
 * User profile as stored in Firestore.
 */

export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  email: string | null;
  createdAt: Timestamp | FieldValue;
  cellphone: string | null;
  isPremium: boolean;
  preferences: { theme: Theme; preferredLanguage: LanguageCode };
  paystackCustomerCode: string | null;
  paystackSubscriptionCode: string | null;
  paystackPlanCode: string | null;
  subscriptionStatus: SubscriptionStatus | null;
  subscriptionStartDate: Timestamp | FieldValue | null;
  nextBillingDate: Timestamp | FieldValue | null;
  lastPaymentDate: Timestamp | FieldValue | null;
  lastPaymentAmount: number | null;
  trialEndsAt: Timestamp | FieldValue | null;
}
