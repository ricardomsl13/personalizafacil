<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="subnav">
    <RouterLink to="/admin/pedidos">Pedidos</RouterLink>
    <RouterLink to="/admin/produtos">Produtos</RouterLink>
    <RouterLink to="/admin/clientes">Clientes</RouterLink>
  </nav>
</template>
