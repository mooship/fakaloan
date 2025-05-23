import type { LanguageCode, Theme } from '@/enums/user.enums';
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
  preferences: { theme: Theme; preferredLanguage: LanguageCode };
}
