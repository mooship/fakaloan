import type { TransactionTypeEnum } from '@/enums/transaction.enums';
import type { Timestamp } from 'firebase/firestore';

/**
 * Transaction record as stored in Firestore.
 */
export interface Transaction {
  uid: string;
  customerId: string;
  type: TransactionTypeEnum;
  amount: number;
  note: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp | null;
  dueByDate?: Timestamp | null;
  repaidAt?: Timestamp | null;
}
