<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePedidosStore } from '../stores/pedidos'
import { useSessaoStore } from '../stores/sessao'
import { longo, moeda } from '../utils/datas'
import StepBar from '../components/StepBar.vue'

const store = usePedidosStore()
const sessao = useSessaoStore()
const router = useRouter()
const r = store.rascunho
const produto = computed(() => store.produtoPorId(r.produtoId))
const cliente = computed(() => store.clientePorId(sessao.clienteId))
const total = computed(() => (produto.value ? produto.value.preco * r.quantidade : 0))
const dataLonga = computed(() => (r.data ? longo(r.data) : ''))

function confirmar() {
  if (!sessao.clienteId) return
  const res = store.confirmar(sessao.clienteId)
  if (res.ok) router.push({ name: 'pedido', params: { codigo: res.codigo } })
  else { alert(res.erro); r.hora = null; router.push({ name: 'agenda' }) }
}
</script>

<template>
  <section>
    <StepBar :atual="3" />
    <h1>Confira e confirme</h1>
    <dl v-if="produto" class="card resumo">
      <dt>Cliente</dt><dd>{{ cliente?.nome }}</dd>
      <dt>Produto</dt><dd>{{ produto.emoji }} {{ produto.nome }}</dd>
      <dt>Quantidade</dt><dd>{{ r.quantidade }} peças</dd>
      <dt>Data</dt><dd>{{ dataLonga }}</dd>
      <dt>Horário</dt><dd>{{ r.hora }}</dd>
      <dt>Total</dt><dd><strong>{{ moeda(total) }}</strong></dd>
    </dl>
    <div class="acoes">
      <button class="btn secundario" @click="router.push({ name: 'agenda' })">Voltar</button>
      <button class="btn" :disabled="!cliente || !produto" @click="confirmar">Confirmar pedido</button>
    </div>
  </section>
</template>
