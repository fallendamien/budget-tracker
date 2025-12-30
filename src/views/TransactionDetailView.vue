<script setup>
import { useFormatDate } from '@/composables/useFormatDate';
import { useTransactionValidation } from '@/composables/useTransactionValidation';
import { useTransactionStore } from '@/stores/transaction';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import Toast from 'primevue/toast';
import { useConfirm } from 'primevue/useconfirm';
import Select from 'primevue/select';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, TYPE_OPTIONS } from '@/constants';

// Stores/Composables
const route = useRoute();
const store = useTransactionStore();
const router = useRouter();
const confirm = useConfirm();
const { formatDate } = useFormatDate();
const { validateTransaction, showValidationError, showSuccess } = useTransactionValidation();

// Constants
const typeOptions = TYPE_OPTIONS;

// Local state
const isEditing = ref(false);
const editForm = ref({
  type: '',
  amount: '',
  category: '',
  description: '',
  date: '',
});

// Computed
const transaction = computed(() => {
  const id = route.params.id;
  return store.transactions.find((t) => t.id === id);
});

const categoryOptions = computed(() => {
  if (editForm.value.type === 'income') {
    return INCOME_CATEGORIES;
  } else if (editForm.value.type === 'expense') {
    return EXPENSE_CATEGORIES;
  }
  return [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
});

// Functions
function toggleEdit() {
  isEditing.value = !isEditing.value;

  if (isEditing.value) {
    // entering edit mode - populate form with current transaction data
    editForm.value = {
      type: transaction.value.type,
      amount: transaction.value.amount,
      category: transaction.value.category,
      description: transaction.value.description,
      date: new Date(transaction.value.date),
    };
  }
}

function handleDelete() {
  confirm.require({
    message: 'Are you sure you want to delete this transaction?',
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    acceptClass: 'p-button-danger',
    accept: () => {
      store.deleteTransaction(transaction.value.id);
      router.push('/transactions');
    },
  });
}

function handleSave() {
  // Validate form before saving
  const validation = validateTransaction(editForm.value);

  if (!validation.valid) {
    showValidationError(validation.errors);
    return;
  }

  const formattedData = {
    ...editForm.value,
    date: editForm.value.date.toISOString().split('T')[0], // convert date back to YYYY-MM-DD
  };
  store.updateTransaction(transaction.value.id, formattedData);

  showSuccess('Transaction updated successfully');

  isEditing.value = false;
}

function goBack() {
  router.push('/transactions');
}
</script>

<template>
  <Toast />
  <div>
    <Button
      label="Back"
      icon="pi pi-arrow-left"
      @click="goBack"
      severity="secondary"
      text
      class="mb-3"
    ></Button>

    <!-- Loading state while Firebase loads data -->
    <Card v-if="!transaction">
      <template #content>
        <div class="text-center py-5">
          <i class="pi pi-spin pi-spinner text-4xl text-gray-400"></i>
          <p class="mt-3 text-gray-500">Loading transaction...</p>
        </div>
      </template>
    </Card>

    <!-- Transaction not found -->
    <Card v-else-if="transaction === null">
      <template #content>
        <div class="text-center py-5">
          <i class="pi pi-exclamation-triangle text-4xl text-red-500"></i>
          <p class="mt-3 text-gray-700">Transaction not found</p>
          <Button label="Back to Transactions" @click="goBack" class="mt-3"></Button>
        </div>
      </template>
    </Card>

    <!-- Main content - only renders when transaction exists -->
    <Card v-else>
      <template #title>
        <div class="card-header mb-4">
          <span>Transaction Detail</span>
          <div class="header-actions" v-if="!isEditing">
            <Button
              label="Edit"
              icon="pi pi-pencil"
              @click="toggleEdit"
              severity="info"
              size="small"
              outlined
            ></Button>
            <Button
              label="Delete"
              icon="pi pi-trash"
              @click="handleDelete"
              severity="danger"
              size="small"
              outlined
            ></Button>
          </div>
        </div>
      </template>

      <template #content>
        <!-- View Mode -->
        <div v-if="!isEditing" class="detail-grid">
          <div class="detail-row">
            <span class="detail-label">Type</span>
            <Tag
              :value="transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)"
              :severity="transaction.type === 'income' ? 'success' : 'danger'"
            ></Tag>
          </div>
          <div class="detail-row">
            <span class="detail-label">Amount</span>
            <span class="detail-value amount" :class="transaction.type">
              RM {{ transaction.amount }}
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Category</span>
            <span class="detail-value">{{ transaction.category }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Description</span>
            <span class="detail-value">{{ transaction.description }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Date</span>
            <span class="detail-value">{{ formatDate(transaction.date) }}</span>
          </div>
        </div>

        <!-- Edit Mode -->
        <div v-else class="form-container">
          <div class="form-field">
            <label>Type</label>
            <Select
              v-model="editForm.type"
              :options="typeOptions"
              option-label="label"
              option-value="value"
              placeholder="Select type"
              class="w-full"
            ></Select>
          </div>
          <div class="form-field">
            <label>Amount</label>
            <InputNumber
              v-model="editForm.amount"
              placeholder="Amount"
              mode="currency"
              currency="MYR"
              class="w-full"
            ></InputNumber>
          </div>
          <div class="form-field">
            <label>Category</label>
            <Select
              v-model="editForm.category"
              :options="categoryOptions"
              placeholder="Select category"
              class="w-full"
            ></Select>
          </div>
          <div class="form-field">
            <label>Description</label>
            <InputText
              v-model="editForm.description"
              placeholder="Description"
              class="w-full"
            ></InputText>
          </div>
          <div class="form-field">
            <label>Date</label>
            <DatePicker
              v-model="editForm.date"
              placeholder="Select date"
              date-format="dd/mm/yy"
              class="w-full"
            ></DatePicker>
          </div>
          <div class="button-group">
            <Button label="Save" @click="handleSave" severity="success"></Button>
            <Button label="Cancel" @click="toggleEdit" severity="secondary"></Button>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.detail-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  width: 120px;
  color: #6b7280;
  font-weight: 500;
}

.detail-value {
  color: #111827;
  font-weight: 500;
}

.detail-value.amount {
  font-size: 1.5rem;
  font-weight: 700;
}

.detail-value.amount.income {
  color: #10b981;
}

.detail-value.amount.expense {
  color: #ef4444;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
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

.button-group {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions button {
    flex: 1;
  }

  .form-container {
    padding-bottom: 2rem;
  }

  .button-group {
    padding-bottom: 2rem;
  }
}
</style>
