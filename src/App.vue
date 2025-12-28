<script setup>
import ConfirmDialog from 'primevue/confirmdialog';
import { RouterLink, RouterView } from 'vue-router';
import { useTransactionStore } from './stores/transaction';
import { onMounted } from 'vue';

// Stores/Composables
const store = useTransactionStore();

onMounted(() => {
  store.fetchTransactions();
});
</script>

<template>
  <confirm-dialog></confirm-dialog>
  <nav class="navbar">
    <div class="nav-brand">
      <i class="pi pi-chart-bar brand-icon"></i>
      Budget Tracker
    </div>
    <div class="nav-links">
      <router-link to="/" class="nav-link">
        <i class="pi pi-chart-line"></i>
        <span>Dashboard</span>
      </router-link>
      <router-link to="/transactions" class="nav-link">
        <i class="pi pi-list"></i>
        <span>Transactions</span>
      </router-link>
    </div>
  </nav>

  <main class="container">
    <router-view></router-view>
  </main>
</template>

<style scoped>
.navbar {
  background-color: #ffffff;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: 700;
  color: #4b5563;
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.brand-icon {
  font-size: 1.75rem;
  color: #4b5563; /* Softer gray */
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.nav-link i {
  font-size: 1.125rem;
}

.nav-link:hover {
  color: #111827;
}

.nav-link.router-link-active {
  color: #10b981;
}

.container {
  padding: 0 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }

  .nav-brand {
    font-size: 1rem;
  }

  .nav-links {
    gap: 1.5rem;
  }

  .nav-link span {
    font-size: 0.625rem;
    font-weight: 500;
  }

  .nav-link i {
    font-size: 1.25rem;
  }

  .container {
    padding: 0 1rem;
  }
}
</style>

<style>
body {
  font-family: 'Poppins', system-ui, -apple-system, sans-serif;
  background-color: #f8f9fa;
  color: #1f2937;
  margin: 0;
}

/* Mobile Dialog Styles - Add breathing room */
@media (max-width: 768px) {
  .p-dialog {
    margin: 1rem !important;
    max-width: calc(100% - 2rem) !important;
    width: 100% !important;
  }

  .p-confirmdialog {
    margin: 1rem !important;
    max-width: calc(100% - 2rem) !important;
  }
}
</style>
