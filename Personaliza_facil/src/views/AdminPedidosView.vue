<script setup lang="ts">
import { computed, ref } from 'vue'
import { CANCELADO, STATUS } from '../config/negocio'
import { usePedidosStore } from '../stores/pedidos'
import { curto, moeda } from '../utils/datas'
import AdminNav from '../components/AdminNav.vue'

const store = usePedidosStore()
const filtro = ref<number | ''>('')
const erro = ref('')

const lista = computed(() =>
  store.pedidos.filter(p => filtro.value === '' || p.status === filtro.value)
               .sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora)))
const contagem = computed(() => STATUS.map((nome, i) => ({ nome, n: store.pedidos.filter(p => p.status === i).length })))

function mudar(codigo: string, e: Event) {
  const select = e.target as HTMLSelectElement
  const r = store.definirStatus(codigo, Number(select.value))
  erro.value = r.ok ? '' : r.erro
  if (!r.ok) select.value = String(store.buscar(codigo)?.status) // desfaz a escolha na tela
}
</script>

<template>
  <section>
    <h1>Administração</h1>
    <AdminNav />
    <div class="chips resumo-status">
      <span v-for="c in contagem" :key="c.nome" class="chip"><b>{{ c.n }}</b><small>{{ c.nome }}</small></span>
    </div>

    <label class="campo">Filtrar por status
      <select v-model="filtro">
        <option value="">Todos</option>
        <option v-for="(s, i) in STATUS" :key="s" :value="i">{{ s }}</option>
      </select>
    </label>
    <p v-if="erro" class="erro">{{ erro }}</p>

    <div class="rolagem">
      <table class="tabela">
        <thead><tr><th>Código</th><th>Cliente</th><th>Produto</th><th>Qtd</th><th>Agendamento</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>
          <tr v-for="p in lista" :key="p.codigo" :class="{ cancelado: p.status === CANCELADO }">
            <td><RouterLink :to="{ name: 'pedido', params: { codigo: p.codigo } }">{{ p.codigo }}</RouterLink></td>
            <td>{{ store.nomeCliente(p.clienteId) }}</td>
            <td>{{ store.produtoPorId(p.produtoId)?.nome ?? p.produtoId }}</td>
            <td>{{ p.quantidade }}</td>
            <td>{{ curto(p.data) }} · {{ p.hora }}</td>
            <td>{{ moeda(p.quantidade * p.precoUnitario) }}</td>
            <td>
              <select :value="p.status" @change="mudar(p.codigo, $event)">
                <option v-for="(s, i) in STATUS" :key="s" :value="i">{{ s }}</option>
              </select>
            </td>
          </tr>
          <tr v-if="!lista.length"><td colspan="7">Nenhum pedido com esse filtro.</td></tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
