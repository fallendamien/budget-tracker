<script setup>
import { useFormatDate } from '@/composables/useFormatDate';
import { useTransactionStore } from '@/stores/transaction';
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import { computed, ref } from 'vue';

const store = useTransactionStore();
const { formatDate } = useFormatDate();

// Chart Configuration
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: '#e5e7eb',
      },
    },
    x: {
      grid: {
        color: '#e5e7eb',
      },
    },
  },
});

const chartData = computed(() => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const incomeData = new Array(12).fill(0);
  const expenseData = new Array(12).fill(0);

  store.transactions.forEach((t) => {
    const date = new Date(t.date);
    const monthIndex = date.getMonth();
    if (t.type === 'income') {
      incomeData[monthIndex] += parseFloat(t.amount);
    } else {
      expenseData[monthIndex] += parseFloat(t.amount);
    }
  });

  return {
    labels: months,
    datasets: [
      {
        label: 'Income',
        backgroundColor: '#10b981',
        data: incomeData,
        borderRadius: 4,
      },
      {
        label: 'Expense',
        backgroundColor: '#ef4444',
        data: expenseData,
        borderRadius: 4,
      },
    ],
  };
});

// Recent Transactions
const recentTransactions = computed(() => {
  return store.transactions
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
});
</script>

<template>
  <div class="dashboard-container">
    <div class="mb-4">
      <h1 class="text-3xl font-bold text-gray-800 m-0">Dashboard</h1>
      <p class="text-gray-500 m-0">Welcome back, here's your financial overview.</p>
    </div>

    <!-- Split Column Layout -->
    <div class="dashboard-grid">
      <!-- Left Sidebar - Balance Summary -->
      <div class="sidebar-section">
        <Card class="balance-summary-card">
          <template #content>
            <div class="balance-section">
              <span class="balance-label">
                <i class="pi pi-wallet"></i>
                Your Balance
              </span>
              <div class="balance-amount">RM {{ store.balance }}</div>
            </div>

            <!-- Stacked Income/Expense -->
            <div class="metrics-stack">
              <div class="metric-row">
                <div class="metric-info">
                  <span class="metric-label">Income</span>
                  <div class="metric-value income">
                    <i class="pi pi-arrow-up"></i>
                    <span>RM {{ store.totalIncome }}</span>
                  </div>
                </div>
                <div class="metric-badge income-badge">
                  <i class="pi pi-money-bill"></i>
                </div>
              </div>

              <div class="metric-row">
                <div class="metric-info">
                  <span class="metric-label">Expense</span>
                  <div class="metric-value expense">
                    <i class="pi pi-arrow-down"></i>
                    <span>RM {{ store.totalExpense }}</span>
                  </div>
                </div>
                <div class="metric-badge expense-badge">
                  <i class="pi pi-cart-minus"></i>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Right Column - Chart & Transactions -->
      <div class="content-section">
        <!-- Chart Section -->
        <Card class="chart-card mb-3">
          <template #title>Income vs Expense</template>
          <template #content>
            <div class="chart-container">
              <Chart type="bar" :data="chartData" :options="chartOptions" class="h-full" />
            </div>
          </template>
        </Card>

        <!-- Recent Transactions -->
        <Card class="transactions-card">
          <template #title>
            <div class="flex justify-content-between align-items-center">
              <span>Recent Transactions</span>
              <Button label="View All" text size="small" as="router-link" to="/transactions" />
            </div>
          </template>
          <template #content>
            <ul class="list-none p-0 m-0">
              <li
                v-for="transaction in recentTransactions"
                :key="transaction.id"
                class="transaction-item"
              >
                <div class="flex align-items-center gap-3">
                  <div class="category-icon shadow-1">
                    <i class="pi pi-receipt text-gray-500"></i>
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-gray-800">{{ transaction.description }}</div>
                    <div class="text-sm text-gray-500">{{ formatDate(transaction.date) }}</div>
                  </div>
                  <div class="text-right">
                    <div
                      class="font-bold"
                      :class="{
                        'text-green-500': transaction.type === 'income',
                        'text-red-500': transaction.type === 'expense',
                      }"
                    >
                      {{ transaction.type === 'income' ? '+' : '-' }} RM {{ transaction.amount }}
                    </div>
                    <Tag
                      :value="transaction.category"
                      severity="secondary"
                      class="text-xs"
                      style="font-size: 0.75rem; padding: 0.1rem 0.4rem"
                    ></Tag>
                  </div>
                </div>
              </li>
              <li v-if="recentTransactions.length === 0" class="text-center text-gray-500 py-4">
                No recent transactions
              </li>
            </ul>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Dashboard Grid - Split Column */
.dashboard-grid {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 1.5rem;
  align-items: start;
}

/* Left Sidebar - Balance Summary */
.sidebar-section {
  position: sticky;
  top: 1rem;
}

.balance-summary-card {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%) !important;
  border: 1px solid #bfdbfe !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important;
}

.balance-summary-card :deep(.p-card-content) {
  padding: 2rem !important;
}

.balance-section {
  text-align: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
  margin-bottom: 1.5rem;
}

.balance-label {
  display: block;
  font-size: 0.875rem;
  color: #3b82f6;
  font-weight: 500;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.balance-amount {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1e40af;
  letter-spacing: -1px;
}

/* Stacked Metrics */
.metrics-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.metric-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.metric-info {
  flex: 1;
}

.metric-label {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.metric-value {
  font-size: 1.125rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.metric-value.income {
  color: #10b981;
}

.metric-value.expense {
  color: #ef4444;
}

.metric-value i {
  font-size: 1rem;
}

.metric-badge {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.income-badge {
  background-color: #d1fae5;
  color: #10b981;
}

.expense-badge {
  background-color: #fee2e2;
  color: #ef4444;
}

/* Right Content Section */
.content-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.chart-card {
  min-height: 350px;
}

.chart-container {
  height: 300px;
  position: relative;
}

/* Transaction List */
.transaction-item {
  padding: 1rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.transaction-item:last-child {
  border-bottom: none;
}

.category-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive */
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .sidebar-section {
    position: relative;
  }
}
</style>
