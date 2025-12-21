<script setup>
import ConfirmDialog from 'primevue/confirmdialog';
import { RouterView } from 'vue-router';
import { useTransactionStore } from './stores/transaction';
import { onMounted } from 'vue';

// Stores/Composables
const store = useTransactionStore();

onMounted(() => {
  store.fetchTransactions();
});
</script>

<template>
  <confirm-dialog></confirm-dialog>
  <router-view></router-view>
</template>

<style scoped></style>

<style>
body {
  font-family: 'Poppins', system-ui, -apple-system, sans-serif;
}
</style>
