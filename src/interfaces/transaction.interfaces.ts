/**
 * transaction.interfaces.ts
 *
 * Interface for transaction documents in Fakaloan.
 * Represents credit and repayment transactions for customers.
 *
 * @module interfaces/transaction.interfaces
 */

import type { TransactionTypeEnum } from '@/enums/transaction.enums';
import type { Timestamp } from 'firebase/firestore';

/**
 * Transaction information for credits and repayments.
 *
 * @typedef {Object} Transaction
 * @property {string} uid - Transaction document ID
 * @property {string} customerId - Related customer document ID
 * @property {TransactionTypeEnum} type - Transaction type (credit or repayment)
 * @property {number} amount - Transaction amount
 * @property {string|null} note - Optional note or description
 * @property {Timestamp} createdAt - Transaction creation timestamp
 * @property {Timestamp|null} updatedAt - Last modification timestamp
 * @property {Timestamp|null} dueByDate - Optional due date (only used for credit transactions)
 * @property {Timestamp|null} repaidAt - Optional actual repayment date (used for repayments)
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
