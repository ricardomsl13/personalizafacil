<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePedidosStore } from '../stores/pedidos'
import { useSessaoStore } from '../stores/sessao'

const store = usePedidosStore()
const sessao = useSessaoStore()
const route = useRoute()
const router = useRouter()
const clienteId = ref('')
const pin = ref('')
const erro = ref('')
const clientes = computed(() => store.clientes.filter(c => c.id !== 'demo'))

// Para onde voltar depois de entrar (só aceita caminhos internos do site).
const destino = (padrao: string) => {
  const r = route.query.redirect
  return typeof r === 'string' && r.startsWith('/') ? r : padrao
}
function entrarCliente() {
  if (!clienteId.value) return
  sessao.entrarCliente(clienteId.value)
  router.push(destino('/pedido/produto'))
}
function entrarAdmin() {
  if (!sessao.entrarAdmin(pin.value)) { erro.value = 'PIN incorreto.'; return }
  router.push(destino('/admin/pedidos'))
}
</script>

<template>
  <section>
    <h1>Entrar</h1>
    <div class="grade dois">
      <div class="card">
        <h2>Sou cliente</h2>
        <label class="campo">Escolha seu cadastro
          <select v-model="clienteId">
            <option value="" disabled>Selecione…</option>
            <option v-for="c in clientes" :key="c.id" :value="c.id">{{ c.nome }} · {{ c.email }}</option>
          </select>
        </label>
        <div class="acoes">
          <button class="btn" :disabled="!clienteId" @click="entrarCliente">Entrar</button>
          <RouterLink class="btn secundario" :to="{ name: 'cadastro', query: route.query }">Criar cadastro</RouterLink>
        </div>
      </div>
      <form class="card" @submit.prevent="entrarAdmin">
        <h2>Sou administrador</h2>
        <label class="campo">PIN <input v-model="pin" type="password" autocomplete="off" /></label>
        <small>PIN de demonstração: admin123</small>
        <p v-if="erro" class="erro">{{ erro }}</p>
        <div class="acoes"><button class="btn" :disabled="!pin">Entrar como administrador</button></div>
      </form>
    </div>
  </section>
</template>
