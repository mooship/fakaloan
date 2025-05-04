import type { TransactionTypeEnum } from '@/enums/transaction.enums';
import type { FieldValue, Timestamp } from 'firebase/firestore';

/**
 * Transaction record as stored in Firestore.
 */
export interface Transaction {
  uid?: string | null;
  customerId: string;
  type: TransactionTypeEnum;
  amount: number;
  note?: string | null;
  createdAt: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue | null;
  dueByDate?: Timestamp | null;
  repaidAt?: Timestamp | null;
}
