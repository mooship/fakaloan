/**
 * Customer information for credit management.
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
