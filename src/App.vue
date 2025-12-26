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
    <div class="nav-brand">Budget Tracker</div>
    <div class="nav-links">
      <router-link to="/" class="nav-link">Dashboard</router-link>
      <router-link to="/transactions" class="nav-link">Transactions</router-link>
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
  color: #1f2937;
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
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
    gap: 1rem;
  }

  .nav-brand {
    font-size: 1.25rem;
  }

  .nav-links {
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
  }

  .nav-link {
    padding: 0.5rem 0;
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
</style>
