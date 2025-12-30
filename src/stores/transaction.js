import { useStorage } from '@/composables/useStorage';
import { SAMPLE_TRANSACTIONS } from '@/constants/sampleData';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([]);
  const hasLoaded = ref(false);
  const storage = useStorage();

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

    await storage.saveTransaction(newTransaction);
    await fetchTransactions();
  }

  async function updateTransaction(id, updatedData) {
    await storage.updateTransaction(id, updatedData);
    await fetchTransactions();
  }

  async function deleteTransaction(id) {
    await storage.removeTransaction(id);
    await fetchTransactions();
  }

  async function fetchTransactions() {
    transactions.value = storage.loadTransactions();
    hasLoaded.value = true;
  }

  async function loadSampleData() {
    for (const transaction of SAMPLE_TRANSACTIONS) {
      await storage.saveTransaction(transaction);
    }
    await fetchTransactions();
  }

  async function clearAllData() {
    await storage.clearAll();
    await fetchTransactions();
  }

  return {
    transactions,
    hasLoaded,
    balance,
    totalIncome,
    totalExpense,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    fetchTransactions,
    loadSampleData,
    clearAllData,
  };
});
