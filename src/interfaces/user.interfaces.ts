import type {
  LanguageCode,
  SubscriptionStatus,
  Theme,
} from '@/enums/user.enums';
import type { Timestamp } from 'firebase/firestore';

/**
 * User profile information stored in Firestore.
 *
 * @typedef {Object} UserProfile
 * @property {string} uid - Firebase Auth UID
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {string|null} email - User's email address
 * @property {Timestamp} createdAt - Account creation timestamp
 * @property {string|null} cellphone - User's cellphone number
 * @property {boolean} isPremium - Whether the user is a premium subscriber
 * @property {Object} preferences - User preferences (theme, language)
 * @property {string|null} paystackCustomerCode - Paystack customer code
 * @property {string|null} paystackSubscriptionCode - Paystack subscription code
 * @property {string|null} paystackPlanCode - Paystack plan code
 * @property {string|null} subscriptionStatus - Subscription status
 * @property {Timestamp|null} subscriptionStartDate - Subscription start date
 * @property {Timestamp|null} nextBillingDate - Next billing date
 * @property {Timestamp|null} lastPaymentDate - Last payment date
 * @property {number|null} lastPaymentAmount - Last payment amount
 * @property {Timestamp|null} trialEndsAt - Trial end date
 */
export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  email: string | null;
  createdAt: Timestamp;
  cellphone: string | null;
  isPremium: boolean;
  preferences: { theme: Theme; preferredLanguage: LanguageCode };
  paystackCustomerCode: string | null;
  paystackSubscriptionCode: string | null;
  paystackPlanCode: string | null;
  subscriptionStatus: SubscriptionStatus | null;
  subscriptionStartDate: Timestamp | null;
  nextBillingDate: Timestamp | null;
  lastPaymentDate: Timestamp | null;
  lastPaymentAmount: number | null;
  trialEndsAt: Timestamp | null;
}
