import { db } from '@/firebase/config';
import { ref as dbRef, push, update, remove, onValue } from 'firebase/database';

export function useFirebaseStorage() {
  let unsubscribe = null;

  function loadTransactions(callback) {
    const transactionsRef = dbRef(db, 'transactions');
    unsubscribe = onValue(transactionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const transactions = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        callback(transactions);
      } else {
        callback([]);
      }
    });
  }

  async function saveTransaction(transaction) {
    const transactionsRef = dbRef(db, 'transactions');
    const result = await push(transactionsRef, transaction);
    return result.key;
  }

  async function updateTransaction(id, updatedData) {
    const transactionsRef = dbRef(db, `transactions/${id}`);
    await update(transactionsRef, updatedData);
  }

  async function removeTransaction(id) {
    const transactionsRef = dbRef(db, `transactions/${id}`);
    await remove(transactionsRef);
  }

  async function clearAll() {
    const transactionsRef = dbRef(db, 'transactions');
    await remove(transactionsRef);
  }

  function cleanup() {
    if (unsubscribe) {
      unsubscribe();
    }
  }

  return {
    loadTransactions,
    saveTransaction,
    updateTransaction,
    removeTransaction,
    clearAll,
    cleanup,
  };
}
