<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
</template>

<script setup>
import { useTransactionStore } from './stores/transaction';

const transactionStore=useTransactionStore()
console.log('Total Income is:', transactionStore.totalIncome);
console.log('Total Expense is:', transactionStore.totalExpense);
console.log('Balance is:', transactionStore.balance);

</script>


<style scoped></style>
