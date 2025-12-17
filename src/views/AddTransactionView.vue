<script setup>
import { reactive } from 'vue';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import DatePicker from 'primevue/datepicker';
import Button from 'primevue/button';

const form = reactive({
  type: '',
  amount: 0,
  category: '',
  description: '',
  date: '',
});

const typeOptions = [
  { label: 'Income', value: 'income' },
  { label: 'Expense', value: 'expense' },
];

const categoryOptions = [
  'Food',
  'Transport',
  'Entertainment',
  'Bills',
  'Shopping',
  'Health',
  'Salary',
  'Freelance',
  'Gift',
  'Other',
];

function handleSubmit() {
  console.log('Form data:', form);
}
</script>

<template>
  <div>
    <h1>Add Transaction</h1>
  </div>

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
      ></Select>
    </div>

    <!-- Amount -->
    <div class="form-field">
      <label>Amount</label>
      <InputNumber v-model="form.amount" placeholder="Enter amount"></InputNumber>
    </div>

    <!-- Category -->
    <div class="form-field">
      <label>Category</label>
      <Select
        v-model="form.category"
        :options="categoryOptions"
        placeholder="Select category"
      ></Select>
    </div>

    <!-- Description -->
    <div class="form-field">
      <label>Description</label>
      <InputText v-model="form.description" placeholder="Enter description"></InputText>
    </div>

    <!-- Date -->
    <div class="form-field">
      <label>Date</label>
      <DatePicker v-model="form.date" placeholder="Select date"></DatePicker>
    </div>

    <Button label="Add Transaction" @click="handleSubmit"></Button>
  </div>
</template>

<style scoped>
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

label {
  font-weight: 600;
}
</style>
