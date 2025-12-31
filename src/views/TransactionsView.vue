<script setup>
import { useFormatDate } from '@/composables/useFormatDate';
import { useTransactionValidation } from '@/composables/useTransactionValidation';
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
import Toast from 'primevue/toast';
import { useConfirm } from 'primevue/useconfirm';
import { computed, reactive, ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { PhCaretRight } from '@phosphor-icons/vue';

// Stores/Composables
const store = useTransactionStore();
const { formatDate } = useFormatDate();
const { validateTransaction, showValidationError, showSuccess } = useTransactionValidation();
const router = useRouter();
const confirm = useConfirm();

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
const isMobile = ref(false);

// Screen size detection
function checkMobile() {
  isMobile.value = window.innerWidth < 768;
}

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

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

  // Sort by date descending (newest first)
  return result.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
});

// Functions
function onRowClick(event) {
  router.push(`/transactions/${event.data.id}`);
}

function getCategoryIcon(category) {
  const iconMap = {
    Salary: 'pi pi-briefcase',
    Freelance: 'pi pi-users',
    Investment: 'pi pi-chart-line',
    Food: 'pi pi-shopping-cart',
    Transport: 'pi pi-car',
    Entertainment: 'pi pi-play',
    Bills: 'pi pi-file',
    Shopping: 'pi pi-shopping-bag',
    Healthcare: 'pi pi-heart',
    Education: 'pi pi-book',
  };
  return iconMap[category] || 'pi pi-wallet';
}

function resetForm() {
  form.type = '';
  form.amount = 0;
  form.category = '';
  form.description = '';
  form.date = '';
}

function handleSubmit() {
  // Validate form before submitting
  const validation = validateTransaction(form);

  if (!validation.valid) {
    showValidationError(validation.errors);
    return;
  }

  store.addTransaction(form);
  showSuccess('Transaction added successfully');
  showAddDialog.value = false;
  resetForm();
}

async function handleLoadSample() {
  confirm.require({
    message:
      'This will populate your app with sample transactions including income and expenses. You can edit or delete them anytime.',
    header: 'Load Sample Data?',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Load Data',
    acceptClass: 'p-button-success',
    accept: () => {
      store.loadSampleData();
      showSuccess('Sample data loaded! Feel free to edit or delete these transactions.');
    },
  });
}
</script>

<template>
  <Toast />
  <div>
    <!-- Header with title and Add button -->
    <div class="page-header">
      <h1 class="text-3xl font-bold text-gray-800 m-0">Transactions</h1>
      <Button
        v-if="store.transactions.length > 0"
        label="New Transaction"
        icon="pi pi-plus"
        @click="showAddDialog = true"
      ></Button>
    </div>

    <!-- Search -->
    <div class="search-container mb-3">
      <IconField icon-position="left">
        <InputIcon class="pi pi-search"></InputIcon>
        <InputText
          v-model="searchTerm"
          placeholder="Search transactions..."
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

    <!-- DataTable (Desktop) -->
    <DataTable
      v-if="!isMobile"
      :value="filteredTransactions"
      table-style="min-width:50rem"
      paginator
      :rows="5"
      @row-click="onRowClick"
      selection-mode="single"
      sort-field="createdAt"
      :sort-order="-1"
    >
      <template #empty>
        <div class="no-transactions">
          <i class="pi pi-inbox text-4xl text-gray-300 mb-2"></i>
          <p v-if="searchTerm" class="text-gray-500 font-medium">
            No transactions match "{{ searchTerm }}"
          </p>
          <p v-else class="text-gray-500 font-medium">No transactions yet</p>
          <p v-if="searchTerm" class="text-gray-400 text-sm mt-1">
            Try searching by description, category, or type
          </p>
          <div
            v-else
            class="mt-4 flex flex-column gap-3 align-items-center w-full max-w-xs mx-auto"
          >
            <Button
              label="Load Sample Data"
              icon="pi pi-chart-bar"
              @click="handleLoadSample"
              outlined
              class="w-full"
            />
            <Button
              label="Add Transaction"
              icon="pi pi-plus"
              @click="showAddDialog = true"
              class="w-full"
            />
          </div>
        </div>
      </template>
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

    <!-- Card List View (Mobile) -->
    <div v-else class="transaction-cards">
      <div
        v-for="transaction in filteredTransactions"
        :key="transaction.id"
        class="transaction-card"
        @click="router.push(`/transactions/${transaction.id}`)"
      >
        <div class="card-icon">
          <i :class="getCategoryIcon(transaction.category)"></i>
        </div>
        <div class="card-content">
          <div class="card-title">{{ transaction.description || transaction.category }}</div>
          <div class="card-meta">
            <span class="card-date">{{ formatDate(transaction.date) }}</span>
          </div>
        </div>
        <div class="card-right">
          <div class="card-amount" :class="transaction.type">
            {{ transaction.type === 'income' ? '+' : '-' }}RM{{ transaction.amount.toFixed(2) }}
          </div>
          <Tag
            :value="transaction.category"
            size="small"
            :severity="transaction.type === 'income' ? 'success' : 'secondary'"
            class="card-tag"
          />
        </div>
        <div class="card-arrow">
          <PhCaretRight weight="fill" :size="14" />
        </div>
      </div>
      <!-- Loading state -->
      <div v-if="!store.hasLoaded" class="loading-state">
        <i class="pi pi-spin pi-spinner text-4xl text-gray-400"></i>
        <p class="mt-3 text-gray-500">Loading transactions...</p>
      </div>

      <!-- Empty state (after loading) -->
      <div v-else-if="filteredTransactions.length === 0" class="no-transactions">
        <i class="pi pi-inbox text-4xl text-gray-300 mb-2"></i>
        <p v-if="searchTerm" class="text-gray-500 font-medium">
          No transactions match "{{ searchTerm }}"
        </p>
        <p v-else class="text-gray-500 font-medium">No transactions yet</p>
        <p v-if="searchTerm" class="text-gray-400 text-sm mt-1">
          Try searching by description, category, or type
        </p>
        <div v-else class="mt-4 flex flex-column gap-3 align-items-center w-full max-w-xs mx-auto">
          <Button
            label="Load Sample Data"
            icon="pi pi-chart-bar"
            @click="handleLoadSample"
            outlined
            class="w-full"
          />
          <Button
            label="Add Transaction"
            icon="pi pi-plus"
            @click="showAddDialog = true"
            class="w-full"
          />
        </div>
      </div>
    </div>

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

/* Mobile Card View Styles */
.transaction-cards {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.transaction-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  padding-right: 0.5rem; /* Less padding on right for arrow */
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.transaction-card:hover {
  background: #f9fafb;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-weight: 600;
  color: #111827;
  font-size: 0.9375rem;
  margin-bottom: 0.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
}

.card-date {
  color: #6b7280;
}

.card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  flex-shrink: 0;
}

.card-amount {
  font-weight: 700;
  font-size: 1rem;
  text-align: right;
  margin: 0; /* Reset previous margin */
}

.card-amount.income {
  color: #10b981;
}

.card-amount.expense {
  color: #ef4444;
}

.card-tag {
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
}

.card-arrow {
  color: #9ca3af;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
}

.loading-state {
  text-align: center;
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.no-transactions {
  text-align: center;
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (max-width: 768px) {
  .search-container {
    max-width: 100%;
  }

  .page-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
  }
}
</style>
