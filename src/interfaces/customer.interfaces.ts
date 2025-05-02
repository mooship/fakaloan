/**
 * customer.interfaces.ts
 *
 * Interface for customer documents in Fakaloan.
 * Represents customer details for credit management, stored in Firestore.
 *
 * @module interfaces/customer.interfaces
 * @typedef {Object} Customer
 * @property {string} uid - Customer document ID
 * @property {string} name - Customer's name
 * @property {string} cellphoneNumber - Customer's cellphone number
 * @property {number} balance - Current balance
 * @property {string|null} address - Customer's address
 * @property {Timestamp} createdAt - Creation timestamp
 * @property {Timestamp|null} updatedAt - Last update timestamp
 * @property {number|null} creditScore - Customer's credit score
 */
import type { Timestamp } from 'firebase/firestore';

/**
 * Customer information for credit management.
 *
 * @typedef {Object} Customer
 * @property {string} uid - Customer document ID
 * @property {string} name - Customer's name
 * @property {string} cellphoneNumber - Customer's cellphone number
 * @property {number} balance - Current balance
 * @property {string|null} address - Customer's address
 * @property {Timestamp} createdAt - Creation timestamp
 * @property {Timestamp|null} updatedAt - Last update timestamp
 * @property {number|null} creditScore - Customer's credit score
 */
export interface Customer {
  uid: string;
  name: string;
  cellphoneNumber: string;
  balance: number;
  address: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp | null;
  creditScore: number | null;
}
