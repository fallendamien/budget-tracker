<script setup>
import { useTransactionStore } from '@/stores/transaction';
import Card from 'primevue/card';


const store = useTransactionStore()
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
</template>

<style scoped>
.card-container {
  display: flex;
  gap: 1rem;
}

@media (max-width:768px) {
  .card-container {
    flex-direction: column;
  }
}
</style>
