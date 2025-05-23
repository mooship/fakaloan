import type { FieldValue, Timestamp } from 'firebase/firestore';

/**
 * Customer record as stored in Firestore.
 */
export interface Customer {
  uid: string;
  userId: string;
  name: string;
  cellphoneNumber: string;
  balance: number;
  address?: string | null;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue | null;
  creditScore: number | null;
  defaultCreditTermDays?: number | null;
  lastRepaymentAt?: Timestamp | FieldValue | null;
  isDeleted: boolean;
}
