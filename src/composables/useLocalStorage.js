const STORAGE_KEY = 'budget_tracker_transactions';

export function useLocalStorage() {
  function loadTransactions() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return [];
    }
  }

  async function saveTransaction(transaction) {
    const transactions = loadTransactions();
    const id = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newTransaction = { id, ...transaction };
    transactions.push(newTransaction);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    return id;
  }

  async function updateTransaction(id, updatedData) {
    const transactions = loadTransactions();
    const index = transactions.findIndex((t) => t.id === id);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...updatedData };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }
  }

  async function removeTransaction(id) {
    const transactions = loadTransactions();
    const filtered = transactions.filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }

  async function clearAll() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    loadTransactions,
    saveTransaction,
    updateTransaction,
    removeTransaction,
    clearAll,
  };
}
