/**
 * Represents the structure of a customer's profile document stored in Firestore.
 * Contains personal details and credit score.
 */
export interface Customer {
  id: string;
  name: string;
  cellphoneNumber: string;
  balance: number;
  address: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  creditScore: number;
}
