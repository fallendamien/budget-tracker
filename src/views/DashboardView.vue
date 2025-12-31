<script setup>
import { useFormatDate } from '@/composables/useFormatDate';
import { useTransactionStore } from '@/stores/transaction';
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import { computed, ref } from 'vue';
import { PhWallet, PhTrendUp, PhTrendDown } from '@phosphor-icons/vue';

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
    <div class="mb-4 dashboard-header">
      <h1 class="text-3xl font-bold text-gray-800 m-0">Dashboard</h1>
      <p class="text-gray-500 m-0">Welcome back, here's your financial overview.</p>
    </div>

    <!-- Split Column Layout -->
    <div class="dashboard-grid">
      <!-- Left Sidebar - Balance Summary -->
      <div class="sidebar-section">
        <div class="balance-card bg-gray-100 shadow-1 border-round-xl p-4 border-1 border-gray-100">
          <div class="mb-4">
            <div class="flex align-items-center gap-2 justify-content-center mb-2">
              <PhWallet :size="18" weight="duotone" class="text-gray-400" />
              <span class="text-gray-500 font-medium text-sm">Total Balance</span>
            </div>
            <div class="text-4xl font-bold text-gray-800 text-center">RM {{ store.balance }}</div>
          </div>

          <div class="flex gap-3 pt-3 border-top-1 border-gray-100">
            <div class="flex-1 flex flex-column align-items-center">
              <div class="flex align-items-center gap-2 mb-1">
                <div
                  class="bg-green-50 w-2rem h-2rem border-round-circle flex align-items-center justify-content-center"
                >
                  <PhTrendUp :size="16" weight="bold" class="text-green-500" />
                </div>
                <span class="text-xs text-gray-500 font-medium uppercase">Income</span>
              </div>
              <div class="text-lg font-bold text-green-500">RM {{ store.totalIncome }}</div>
            </div>

            <div class="w-1px bg-gray-100"></div>

            <div class="flex-1 flex flex-column align-items-center">
              <div class="flex align-items-center gap-2 mb-1">
                <div
                  class="bg-red-50 w-2rem h-2rem border-round-circle flex align-items-center justify-content-center"
                >
                  <PhTrendDown :size="16" weight="bold" class="text-red-500" />
                </div>
                <span class="text-xs text-gray-500 font-medium uppercase">Expense</span>
              </div>
              <div class="text-lg font-bold text-red-500">RM {{ store.totalExpense }}</div>
            </div>
          </div>
        </div>
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
  .dashboard-header {
    text-align: center;
    margin-bottom: 1.5rem !important;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .sidebar-section {
    position: relative;
  }
}
</style>
