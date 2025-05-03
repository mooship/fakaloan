/**
 * customer.interfaces.ts
 *
 * Interface for customer documents in Fakaloan.
 * Represents customer details for credit management, stored in Firestore.
 *
 * @module interfaces/customer.interfaces
 */
import type { Timestamp } from 'firebase/firestore';

/**
 * Customer information for credit management.
 *
 * @typedef {Object} Customer
 * @property {string} uid - Customer document ID
 * @property {string} userId - Owning user's document ID (e.g. the shop owner)
 * @property {string} name - Customer's name
 * @property {string} cellphoneNumber - Customer's cellphone number
 * @property {number} balance - Current outstanding balance
 * @property {string|null} address - Customer's address
 * @property {Timestamp} createdAt - Account creation timestamp
 * @property {Timestamp|null} updatedAt - Last update timestamp
 * @property {number|null} creditScore - Calculated credit score (0–100), null if no history
 * @property {number|null} defaultCreditTermDays - Default credit term in days (used if dueByDate is missing)
 * @property {Timestamp|null} lastRepaymentAt - Timestamp of last repayment (if any)
 */
export interface Customer {
  uid: string;
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
}
