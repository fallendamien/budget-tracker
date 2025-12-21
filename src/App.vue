<script setup>
import ConfirmDialog from 'primevue/confirmdialog';
import { RouterView } from 'vue-router';
</script>

<template>
  <confirm-dialog></confirm-dialog>
  <router-view></router-view>
</template>

<style scoped></style>

<style>
body {
  font-family: 'Poppins', system-ui, -apple-system, sans-serif;
}
</style>
