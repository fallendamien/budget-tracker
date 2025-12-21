import { db } from '@/firebase/config';
import { ref as dbRef, push, set, update, remove, onValue } from 'firebase/database';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([]);

  // Computed
  const totalIncome = computed(() => {
    return transactions.value
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  });
  const totalExpense = computed(() => {
    return transactions.value
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  });
  const balance = computed(() => totalIncome.value - totalExpense.value);

  // Functions
  async function addTransaction(formData) {
    const newTransaction = {
      type: formData.type,
      amount: formData.amount,
      category: formData.category,
      description: formData.description,
      date: formData.date.toISOString().split('T')[0],
      createdAt: Date.now(),
    };

    const transactionsRef = dbRef(db, 'transactions');
    await push(transactionsRef, newTransaction);
  }

  async function updateTransaction(id, updatedData) {
    const transactionsRef = dbRef(db, `transactions/${id}`);
    await update(transactionsRef, updatedData);
  }

  async function deleteTransaction(id) {
    const transactionsRef = dbRef(db, `transactions/${id}`);
    await remove(transactionsRef);
  }

  function fetchTransactions() {
    const transactionsRef = dbRef(db, 'transactions');
    onValue(transactionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        transactions.value = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
      } else {
        transactions.value = [];
      }
    });
  }

  return {
    transactions,
    balance,
    totalIncome,
    totalExpense,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    fetchTransactions,
  };
});
