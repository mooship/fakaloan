import type { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  name: string;
  email: string | null;
  createdAt: Timestamp | Date;
  cellphone: string | null;
  isPremium: boolean;
  preferences?: { theme: 'light' | 'dark' };
}
