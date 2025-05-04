import type { TransactionTypeEnum } from '@/enums/transaction.enums';
import type { Timestamp } from 'firebase/firestore';

/**
 * Transaction record stored in Firestore.
 */
export interface Transaction {
  uid: string;
  customerId: string;
  type: TransactionTypeEnum;
  amount: number;
  /** Optional note for the transaction */
  note: string | null;
  createdAt: Timestamp;
  /** Last update timestamp (nullable) */
  updatedAt: Timestamp | null;
  /** Due date for repayment (nullable, optional) */
  dueByDate?: Timestamp | null;
  /** Repayment timestamp (nullable, optional) */
  repaidAt?: Timestamp | null;
}
