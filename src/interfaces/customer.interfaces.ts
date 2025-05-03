import type { Timestamp } from 'firebase/firestore';

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
