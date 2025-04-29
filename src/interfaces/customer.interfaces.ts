import type { Timestamp } from 'firebase/firestore';

/**
 * Customer information for credit management.
 */
export interface Customer {
  id: string;
  name: string;
  cellphoneNumber: string;
  balance: number;
  address: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp | null;
  creditScore: number;
}
