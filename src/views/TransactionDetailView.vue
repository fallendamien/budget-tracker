<script setup>
import { useFormatDate } from '@/composables/useFormatDate';
import { useTransactionStore } from '@/stores/transaction';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from 'primevue/button';
import { useConfirm } from 'primevue/useconfirm';
import Select from 'primevue/select';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';

// Stores/Composables
const route = useRoute();
const store = useTransactionStore();
const router = useRouter();
const confirm = useConfirm();
const { formatDate } = useFormatDate();

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
    accept: () => {
      store.deleteTransaction(transaction.value.id);
      router.push('/transactions');
    },
  });
}
function handleSave() {
  const formattedData = {
    ...editForm.value,
    date: editForm.value.date.toISOString().split('T')[0], // convert date back to YYYY-MM-DD
  };
  store.updateTransaction(transaction.value.id, formattedData);
  isEditing.value = false;
}
</script>

<template>
  <div>
    <h1>Transaction Detail</h1>

    <!-- View Mode -->
    <div v-if="!isEditing">
      <p><strong>Type:</strong> {{ transaction?.type }}</p>
      <p><strong>Amount:</strong> RM {{ transaction?.amount }}</p>
      <p><strong>Category:</strong> {{ transaction?.category }}</p>
      <p><strong>Description:</strong> {{ transaction?.description }}</p>
      <p><strong>Date:</strong> {{ formatDate(transaction?.date) }}</p>
      <div style="margin-top: 20px">
        <Button
          label="Edit"
          @click="toggleEdit"
          severity="info"
          style="margin-right: 10px"
        ></Button>
        <Button label="Delete" @click="handleDelete" severity="danger"></Button>
      </div>
    </div>

    <!-- Edit Mode -->
    <div v-else class="flex flex-column gap-3" style="max-width: 600px">
      <div class="flex align-items-center">
        <strong class="w-7rem">Type:</strong>
        <Select
          v-model="editForm.type"
          :options="['income', 'expense']"
          placeholder="Select type"
          class="flex-1"
        ></Select>
      </div>
      <div class="flex align-item-center">
        <strong class="w-7rem">Amount:</strong>
        <InputNumber
          v-model="editForm.amount"
          placeholder="Amount"
          mode="currency"
          currency="MYR"
          class="flex-1"
        ></InputNumber>
      </div>
      <div class="flex align-items-center">
        <strong class="w-7rem">Category:</strong>
        <InputText v-model="editForm.category" placeholder="Category" class="flex-1"></InputText>
      </div>
      <div class="flex align-items-center">
        <strong class="w-7rem">Description:</strong>
        <InputText
          v-model="editForm.description"
          placeholder="Description"
          class="flex-1"
        ></InputText>
      </div>
      <div class="flex align-items-center">
        <strong class="w-7rem">Date:</strong>
        <DatePicker
          v-model="editForm.date"
          placeholder="Select date"
          date-format="dd/mm/yy"
        ></DatePicker>
      </div>
      <div>
        <Button
          label="Save"
          @click="handleSave"
          severity="success"
          style="margin-right: 10px"
        ></Button>
        <Button label="Cancel" @click="toggleEdit" severity="secondary"></Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.p-datepicker-input {
  width: 100%;
}
</style>
