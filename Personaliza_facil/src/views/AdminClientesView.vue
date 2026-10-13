<script setup lang="ts">
import { computed } from 'vue'
import { usePedidosStore } from '../stores/pedidos'
import AdminNav from '../components/AdminNav.vue'
import ClienteForm from '../components/ClienteForm.vue'

const store = usePedidosStore()
const lista = computed(() => store.clientes.filter(c => c.id !== 'demo'))
const totalPedidos = (id: string) => store.pedidos.filter(p => p.clienteId === id).length
</script>

<template>
  <section class="admin-clientes">
    <h1>Administração</h1>
    <AdminNav />
    <h2>Cadastrar cliente</h2>
    <ClienteForm />
    <h2>Clientes ({{ lista.length }})</h2>
    <div class="rolagem">
      <table class="tabela">
        <thead><tr><th>Nome</th><th>E-mail</th><th>Telefone</th><th>Pedidos</th></tr></thead>
        <tbody>
          <tr v-for="c in lista" :key="c.id">
            <td>{{ c.nome }}</td><td>{{ c.email }}</td><td>{{ c.telefone }}</td><td>{{ totalPedidos(c.id) }}</td>
          </tr>
          <tr v-if="!lista.length"><td colspan="4">Nenhum cliente cadastrado.</td></tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
