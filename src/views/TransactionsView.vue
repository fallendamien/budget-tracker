<script setup>
import { useTransactionStore } from '@/stores/transaction';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
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
const searchTerm = ref('');

const filteredTransactions = computed(() => {
  let result = store.transactions;

  // Filter by type (All/Income/Expense)
  if (selectedFilter.value !== 'all') {
    result = result.filter((t) => t.type === selectedFilter.value);
  }

  // Filter by search term
  if (searchTerm.value) {
    const lowerCaseSearch = searchTerm.value.toLowerCase();
    result = result.filter(
      (t) =>
        t.category.toLowerCase().includes(lowerCaseSearch) ||
        t.description.toLowerCase().includes(lowerCaseSearch) ||
        t.type.toLowerCase().includes(lowerCaseSearch)
    );
  }
  return result; //final filtered result
});
</script>

<template>
  <div>
    <h1>Transactions</h1>
    <div class="search-container mb-3">
      <IconField icon-position="left">
        <InputIcon class="pi pi-search"></InputIcon>
        <InputText
          v-model="searchTerm"
          placeholder="Search by type, category, or description..."
          class="w-full"
        ></InputText>
      </IconField>
    </div>
    <div class="filter-button">
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
.filter-button {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
}

.search-container {
  max-width: 500px;
}

@media (max-width: 768px) {
  .search-container {
    max-width: 100%;
  }
}
</style>
