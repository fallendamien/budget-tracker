<script setup>
import { useTransactionStore } from '@/stores/transaction';
import Card from 'primevue/card';
import { computed } from 'vue';

const store = useTransactionStore();

const recentTransaction = computed(() => {
  return store.transactions
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
});
console.log(recentTransaction.value);
</script>

<template>
  <h1>Dashboard</h1>
  <div class="card-container">
    <Card>
      <template #title>Balance:</template>
      <template #content>{{ store.balance }}</template>
    </Card>
    <Card>
      <template #title>Income:</template>
      <template #content>{{ store.totalIncome }}</template>
    </Card>
    <Card>
      <template #title>Expense:</template>
      <template #content>{{ store.totalExpense }}</template>
    </Card>
  </div>
  <div>
    <h2>Recent Transactions</h2>
    <Card v-for="transaction in recentTransaction" :key="transaction.id" class="transaction-card">
      <template #content>
        <div>{{ transaction.description }}</div>
        <div>{{ transaction.amount }}</div>
        <div>{{ transaction.date }}</div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.card-container {
  display: flex;
  gap: 1rem;
}

.transaction-card {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .card-container {
    flex-direction: column;
  }
}
</style>
