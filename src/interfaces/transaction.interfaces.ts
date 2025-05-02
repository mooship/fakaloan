/**
 * transaction.interfaces.ts
 *
 * Interface for transaction documents in Fakaloan.
 * Represents credit and repayment transactions for customers.
 *
 * @module interfaces/transaction.interfaces
 * @typedef {Object} Transaction
 * @property {string} uid - Transaction document ID
 * @property {string} customerId - Related customer document ID
 * @property {TransactionTypeEnum} type - Transaction type (credit or repayment)
 * @property {number} amount - Transaction amount
 * @property {string|null} note - Optional note or description
 * @property {Timestamp} createdAt - Creation timestamp
 * @property {Timestamp|null} updatedAt - Last update timestamp
 */

import type { TransactionTypeEnum } from '@/enums/transaction.enums';
import type { Timestamp } from 'firebase/firestore';

/**
 * Transaction information for credits and repayments.
 *
 * @typedef {Object} Transaction
 * @property {string} uid - Transaction document ID
 * @property {string} customerId - Related customer document ID
 * @property {TransactionType} type - Transaction type (credit or repayment)
 * @property {number} amount - Transaction amount
 * @property {string|null} note - Optional note or description
 * @property {Timestamp} createdAt - Creation timestamp
 * @property {Timestamp|null} updatedAt - Last update timestamp
 */

export interface Transaction {
  uid: string;
  customerId: string;
  type: TransactionTypeEnum;
  amount: number;
  note: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp | null;
}
