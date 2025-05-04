import type { Timestamp } from 'firebase/firestore';

/**
 * Customer record stored in Firestore.
 */
export interface Customer {
  uid: string;
  userId: string;
  name: string;
  cellphoneNumber: string;
  balance: number;
  /** Customer's address (nullable) */
  address: string | null;
  createdAt: Timestamp;
  /** Last update timestamp (nullable) */
  updatedAt: Timestamp | null;
  /** Credit score (nullable) */
  creditScore: number | null;
  /** Default credit term in days (nullable, optional) */
  defaultCreditTermDays?: number | null;
  /** Last repayment timestamp (nullable, optional) */
  lastRepaymentAt?: Timestamp | null;
}
