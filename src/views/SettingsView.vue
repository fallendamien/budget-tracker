<script setup>
import { useTransactionStore } from '@/stores/transaction';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Toast from 'primevue/toast';
import { computed } from 'vue';

const store = useTransactionStore();
const confirm = useConfirm();
const toast = useToast();

const transactionCount = computed(() => store.transactions.length);

function exportData() {
  const data = JSON.stringify(store.transactions, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `budget_backup_${new Date().toISOString().split('T')[0]}.json`;

  // Append to body, click, then remove (better browser compatibility)
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Delay revoking URL to ensure download completes
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

function handleImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);

      // Validate structure
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format');
      }

      confirm.require({
        message: `Import will replace all existing data (${transactionCount.value} transactions). Continue?`,
        header: 'Confirm Import',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Import',
        rejectLabel: 'Cancel',
        acceptClass: 'p-button-success',
        accept: async () => {
          await store.clearAllData();
          for (const transaction of data) {
            await store.addTransaction({
              type: transaction.type,
              amount: transaction.amount,
              category: transaction.category,
              description: transaction.description,
              date: new Date(transaction.date),
            });
          }
          toast.add({
            severity: 'success',
            summary: 'Import Successful',
            detail: `Imported ${data.length} transactions`,
            life: 3000,
          });
        },
      });
    } catch {
      toast.add({
        severity: 'error',
        summary: 'Import Failed',
        detail: 'Invalid JSON file',
        life: 4000,
      });
    }
  };
  reader.readAsText(file);
  event.target.value = ''; // Reset input
}

function handleClearAll() {
  confirm.require({
    message: `Delete all ${transactionCount.value} transactions? This cannot be undone.`,
    header: 'Confirm Delete All',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Delete All',
    rejectLabel: 'Cancel',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await store.clearAllData();
      toast.add({
        severity: 'success',
        summary: 'Data Cleared',
        detail: 'All transactions have been deleted',
        life: 3000,
      });
    },
  });
}
</script>

<template>
  <Toast />
  <div class="settings-container">
    <h1 class="page-title">Settings</h1>

    <Card class="settings-card">
      <template #title>Data Management</template>
      <template #content>
        <div class="data-info">
          <i class="pi pi-database"></i>
          <span>{{ transactionCount }} transactions stored</span>
        </div>

        <div class="settings-actions">
          <div class="action-item">
            <div class="action-info">
              <h3>Export Data</h3>
              <p>Download all transactions as JSON file</p>
            </div>
            <Button
              label="Export"
              icon="pi pi-download"
              @click="exportData"
              :disabled="transactionCount === 0"
              outlined
            />
          </div>

          <div class="action-item">
            <div class="action-info">
              <h3>Import Data</h3>
              <p>Upload JSON file to restore transactions</p>
            </div>
            <label for="import-file">
              <Button label="Import" icon="pi pi-upload" outlined as="span" />
            </label>
            <input
              id="import-file"
              type="file"
              accept=".json"
              @change="handleImport"
              style="display: none"
            />
          </div>

          <div class="action-item danger-zone">
            <div class="action-info">
              <h3>Clear All Data</h3>
              <p class="danger-text">Permanently delete all transactions</p>
            </div>
            <Button
              label="Clear All"
              icon="pi pi-trash"
              @click="handleClearAll"
              :disabled="transactionCount === 0"
              severity="danger"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.settings-container {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.settings-card {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.data-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
  color: #4b5563;
}

.data-info .pi {
  font-size: 1.25rem;
  color: #10b981;
}

.settings-actions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.action-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.action-item.danger-zone {
  border-color: #fecaca;
  background-color: #fef2f2;
}

.action-info h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.action-info p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.danger-text {
  color: #dc2626 !important;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
    text-align: center;
  }

  .action-item {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .action-item button,
  .action-item label {
    width: 100%;
  }

  .action-item button {
    width: 100%;
  }
}
</style>
