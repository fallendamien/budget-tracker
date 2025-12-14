import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([
    {
      id: '1',
      type: 'income',
      amount: 5000,
      category: 'Salary',
      description: 'Monthly salary',
      date: '2024-01-01',
      createdAt: Date.now(),
    },
    {
      id: '2',
      type: 'expense',
      amount: 50,
      category: 'Food',
      description: 'Groceries',
      date: '2024-01-02',
      createdAt: Date.now(),
    },
    {
      id: '3',
      type: 'expense',
      amount: 120,
      category: 'Sports',
      description: 'Gym Membership',
      date: '2024-01-05',
      createdAt: Date.now(),
    },
    {
      id: '4',
      type: 'expense',
      amount: 250,
      category: 'Shopping',
      description: 'New running shoes',
      date: '2024-01-10',
      createdAt: Date.now(),
    },
    {
      id: '5',
      type: 'expense',
      amount: 85,
      category: 'Supplements',
      description: 'Whey Protein & Vitamins',
      date: '2024-01-12',
      createdAt: Date.now(),
    },
    {
      id: '6',
      type: 'income',
      amount: 1200,
      category: 'Freelance',
      description: 'Website design project',
      date: '2024-01-15',
      createdAt: Date.now(),
    },
    {
      id: '7',
      type: 'income',
      amount: 350,
      category: 'Investment',
      description: 'Quarterly stock dividends',
      date: '2024-01-20',
      createdAt: Date.now(),
    },
    {
      id: '8',
      type: 'income',
      amount: 200,
      category: 'Gift',
      description: 'Birthday cash gift',
      date: '2024-01-25',
      createdAt: Date.now(),
    },
  ]);

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

  function addTransaction() {
    alert('test');
  }

  function updateTransaction() {}

  function deleteTransaction() {}

  return {
    transactions,
    balance,
    totalIncome,
    totalExpense,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
});
