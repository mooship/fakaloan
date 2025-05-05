import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';

initializeApp();

export const updateCustomerBalanceOnTransaction = onDocumentWritten(
  'transactions/{transactionId}',
  async (event) => {
    const db = getFirestore();
    const transaction = event.data?.after?.data();

    if (!transaction || !transaction.customerId) {
      return;
    }

    const customerId = transaction.customerId;

    // Fetch all transactions for this customer
    const txSnapshot = await db
      .collection('transactions')
      .where('customerId', '==', customerId)
      .get();
    let balance = 0;
    for (const doc of txSnapshot.docs) {
      const tx = doc.data();
      if (tx.type === 'credit') {
        balance += Number(tx.amount);
      } else if (tx.type === 'repayment') {
        balance -= Number(tx.amount);
      }
    }
    // Update the customer's balance
    await db.collection('customers').doc(customerId).update({ balance });
  }
);
