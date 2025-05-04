import type { Timestamp } from 'firebase/firestore';

/**
 * Customer record as stored in Firestore.
 */
export interface Customer {
  uid?: string | null;
  userId: string;
  name: string;
  cellphoneNumber: string;
  balance: number;
  address: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp | null;
  creditScore: number | null;
  defaultCreditTermDays?: number | null;
  lastRepaymentAt?: Timestamp | null;
  isDeleted: boolean;
}
