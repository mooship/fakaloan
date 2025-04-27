import type {
  LanguageCode,
  SubscriptionStatus,
  Theme,
} from '@/enums/user.enums';
import type { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  name: string;
  email: string | null;
  createdAt: Timestamp;
  cellphone: string | null;
  isPremium: boolean;
  preferences: { theme: Theme };
  preferredLanguage: LanguageCode;
  paystackCustomerId: string | null;
  paystackSubscriptionId: string | null;
  paystackPlanId: string | null;
  subscriptionStatus: SubscriptionStatus | null;
  subscriptionStartDate: Timestamp | null;
  nextBillingDate: Timestamp | null;
  lastPaymentDate: Timestamp | null;
  lastPaymentAmount: number | null;
  trialEndsAt: Timestamp | null;
}
