<script setup>
import { useFormatDate } from '@/composables/useFormatDate';
import { useTransactionStore } from '@/stores/transaction';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, TYPE_OPTIONS } from '@/constants';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import DatePicker from 'primevue/datepicker';
import Dialog from 'primevue/dialog';
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

// Stores/Composables
const store = useTransactionStore();
const { formatDate } = useFormatDate();
const router = useRouter();

// Constants
const columns = [
  { field: 'amount', header: 'Amount' },
  { field: 'category', header: 'Category' },
  { field: 'description', header: 'Description' },
];
const typeOptions = TYPE_OPTIONS;
const categoryOptions = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

// Local reactive state
const selectedFilter = ref('all'); // 'all', 'income', or 'expense'
const searchTerm = ref('');
const showAddDialog = ref(false);

// Form state
const form = reactive({
  type: '',
  amount: 0,
  category: '',
  description: '',
  date: '',
});

// Computed
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

// Functions
function onRowClick(event) {
  router.push(`/transactions/${event.data.id}`);
}

function resetForm() {
  form.type = '';
  form.amount = 0;
  form.category = '';
  form.description = '';
  form.date = '';
}

function handleSubmit() {
  store.addTransaction(form);
  showAddDialog.value = false;
  resetForm();
}
</script>

<template>
  <div>
    <!-- Header with title and Add button -->
    <div class="page-header">
      <h1>Transactions</h1>
      <Button label="New Transaction" icon="pi pi-plus" @click="showAddDialog = true"></Button>
    </div>

    <!-- Search -->
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

    <!-- Filter buttons -->
    <div class="filter-button">
      <Button
        label="All"
        @click="selectedFilter = 'all'"
        :outlined="selectedFilter !== 'all'"
      ></Button>
      <Button
        label="Income"
        @click="selectedFilter = 'income'"
        :outlined="selectedFilter !== 'income'"
        severity="success"
      ></Button>
      <Button
        label="Expense"
        @click="selectedFilter = 'expense'"
        :outlined="selectedFilter !== 'expense'"
        severity="danger"
      ></Button>
    </div>

    <!-- DataTable -->
    <DataTable
      :value="filteredTransactions"
      table-style="min-width:50rem"
      paginator
      :rows="5"
      @row-click="onRowClick"
      selection-mode="single"
      sort-field="createdAt"
      :sort-order="-1"
    >
      <Column header="#" :exportable="false">
        <template #body="slotProps">
          {{ slotProps.index + 1 }}
        </template>
      </Column>
      <Column field="type" header="Type" sortable>
        <template #body="slotProps">
          <Tag
            :value="slotProps.data.type.charAt(0).toUpperCase() + slotProps.data.type.slice(1)"
            :severity="slotProps.data.type === 'income' ? 'success' : 'danger'"
          >
          </Tag>
        </template>
      </Column>
      <Column
        v-for="col in columns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        sortable
      ></Column>
      <Column field="date" header="Date" sortable>
        <template #body="slotProps">
          {{ formatDate(slotProps.data.date) }}
        </template>
      </Column>
    </DataTable>

    <!-- Add Transaction Dialog -->
    <Dialog
      v-model:visible="showAddDialog"
      header="Add Transaction"
      :modal="true"
      :style="{ width: '450px' }"
    >
      <div class="form-container">
        <!-- Type -->
        <div class="form-field">
          <label>Type</label>
          <Select
            v-model="form.type"
            :options="typeOptions"
            option-label="label"
            option-value="value"
            placeholder="Select type"
            class="w-full"
          ></Select>
        </div>
        <!-- Amount -->
        <div class="form-field">
          <label>Amount</label>
          <InputNumber
            v-model="form.amount"
            placeholder="Enter amount"
            class="w-full"
          ></InputNumber>
        </div>
        <!-- Category -->
        <div class="form-field">
          <label>Category</label>
          <Select
            v-model="form.category"
            :options="categoryOptions"
            placeholder="Select category"
            class="w-full"
          ></Select>
        </div>
        <!-- Description -->
        <div class="form-field">
          <label>Description</label>
          <InputText
            v-model="form.description"
            placeholder="Enter description"
            class="w-full"
          ></InputText>
        </div>
        <!-- Date -->
        <div class="form-field">
          <label>Date</label>
          <DatePicker
            v-model="form.date"
            placeholder="Select date"
            date-format="dd/mm/yy"
            class="w-full"
          ></DatePicker>
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" severity="secondary" @click="showAddDialog = false"></Button>
        <Button label="Add Transaction" @click="handleSubmit"></Button>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-header h1 {
  margin: 0;
}

.filter-button {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
}

.search-container {
  max-width: 500px;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field label {
  font-weight: 600;
  color: #4b5563;
}

@media (max-width: 768px) {
  .search-container {
    max-width: 100%;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
