import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';
import TransactionsView from '@/views/TransactionsView.vue';
import AddTransactionView from '@/views/AddTransactionView.vue';
import TransactionDetailView from '@/views/TransactionDetailView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'dashboard', component: DashboardView },
    { path: '/transactions', name: 'transactions', component: TransactionsView },
    { path: '/add-transaction', name: 'addTransaction', component: AddTransactionView },
    { path: '/transactions/:id', name: 'transactionDetail', component: TransactionDetailView },
  ],
});

export default router;
