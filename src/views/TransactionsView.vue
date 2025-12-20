<script setup>
import { useTransactionStore } from '@/stores/transaction';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { computed, ref } from 'vue';

const store = useTransactionStore();
const columns = [
  { field: 'type', header: 'Type' },
  { field: 'amount', header: 'Amount' },
  { field: 'category', header: 'Category' },
  { field: 'description', header: 'Description' },
  { field: 'date', header: 'Date' },
];

const selectedFilter = ref('all'); // 'all', 'income', or 'expense'

const filteredTransactions = computed(() => {
  if (selectedFilter.value === 'all') {
    return store.transactions;
  }
  return store.transactions.filter((t) => t.type === selectedFilter.value);
});
</script>

<template>
  <div>
    <h1>Transactions</h1>
    <div class="filterButton">
      <Button label="All" @click="selectedFilter = 'all'"></Button>
      <Button label="Income" @click="selectedFilter = 'income'"></Button>
      <Button label="Expense" @click="selectedFilter = 'expense'"></Button>
    </div>
    <DataTable :value="filteredTransactions" table-style="min-width:50rem" paginator :rows="5">
      <Column header="#" :exportable="false">
        <template #body="slotProps">
          {{ slotProps.index + 1 }}
        </template>
      </Column>
      <Column
        v-for="col in columns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        sortable
      ></Column>
    </DataTable>
  </div>
</template>

<style scoped>
.filterButton {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
}
</style>
