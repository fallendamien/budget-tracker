import { db, auth } from '@/firebase/config';
import { ref as dbRef, push, update, remove, onValue } from 'firebase/database';

export function useFirebaseStorage() {
  let unsubscribe = null;

  function getUserPath() {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return `users/${user.uid}/transactions`;
  }

  function loadTransactions(callback) {
    const user = auth.currentUser;
    if (!user) {
      callback([]);
      return;
    }

    const transactionsRef = dbRef(db, getUserPath());
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
    const transactionsRef = dbRef(db, getUserPath());
    const user = auth.currentUser;

    // Add userId to transaction
    const transactionWithUser = {
      ...transaction,
      userId: user.uid,
    };

    const result = await push(transactionsRef, transactionWithUser);
    return result.key;
  }

  async function updateTransaction(id, updatedData) {
    const transactionsRef = dbRef(db, `${getUserPath()}/${id}`);
    await update(transactionsRef, updatedData);
  }

  async function removeTransaction(id) {
    const transactionsRef = dbRef(db, `${getUserPath()}/${id}`);
    await remove(transactionsRef);
  }

  async function clearAll() {
    const transactionsRef = dbRef(db, getUserPath());
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
