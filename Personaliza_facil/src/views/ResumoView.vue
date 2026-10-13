<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePedidosStore } from '../stores/pedidos'
import { useSessaoStore } from '../stores/sessao'
import { ADMIN_CLIENTE_ID, ADMIN_CLIENTE_NOME } from '../config/negocio'
import { longo, moeda } from '../utils/datas'
import StepBar from '../components/StepBar.vue'

const store = usePedidosStore()
const sessao = useSessaoStore()
const router = useRouter()
const r = store.rascunho
const produto = computed(() => store.produtoPorId(r.produtoId))
const clienteNome = computed(() =>
  sessao.admin ? ADMIN_CLIENTE_NOME : store.clientePorId(sessao.clienteId)?.nome)
const total = computed(() => (produto.value ? produto.value.preco * r.quantidade : 0))
const dataLonga = computed(() => (r.data ? longo(r.data) : ''))

function confirmar() {
  const clienteId = sessao.admin ? ADMIN_CLIENTE_ID : sessao.clienteId
  if (!clienteId) return
  const res = store.confirmar(clienteId)
  if (res.ok) router.push({ name: 'pedido', params: { codigo: res.codigo } })
  else { alert(res.erro); r.hora = null; router.push({ name: 'agenda' }) }
}
</script>

<template>
  <section>
    <StepBar :atual="3" />
    <h1>Confira e confirme</h1>
    <dl v-if="produto" class="card resumo">
      <dt>Cliente</dt><dd>{{ clienteNome }}</dd>
      <dt>Produto</dt><dd>{{ produto.emoji }} {{ produto.nome }}</dd>
      <dt>Quantidade</dt><dd>{{ r.quantidade }} peças</dd>
      <template v-if="r.descricaoPersonalizacao.trim()">
        <dt>Personalização</dt><dd class="texto-personalizacao">{{ r.descricaoPersonalizacao }}</dd>
      </template>
      <template v-if="r.imagemReferencia">
        <dt>Imagem de referência</dt><dd><img class="imagem-resumo" :src="r.imagemReferencia" alt="Imagem de referência da personalização" /></dd>
      </template>
      <dt>Data</dt><dd>{{ dataLonga }}</dd>
      <dt>Horário</dt><dd>{{ r.hora }}</dd>
      <dt>Total</dt><dd><strong>{{ moeda(total) }}</strong></dd>
    </dl>
    <div class="acoes">
      <button class="btn secundario" @click="router.push({ name: 'agenda' })">Voltar</button>
      <button class="btn" :disabled="!clienteNome || !produto" @click="confirmar">Confirmar pedido</button>
    </div>
  </section>
</template>
