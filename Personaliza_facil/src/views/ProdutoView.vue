<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { CAPACIDADE } from '../config/negocio'
import { usePedidosStore } from '../stores/pedidos'
import { moeda } from '../utils/datas'
import StepBar from '../components/StepBar.vue'

const store = usePedidosStore()
const router = useRouter()
const r = store.rascunho
const max = CAPACIDADE.porHorario // um pedido precisa caber em UM horário

const valido = computed(() => !!r.produtoId && Number.isInteger(r.quantidade) &&
                              r.quantidade >= 1 && r.quantidade <= max)

function avancar() {
  r.data = null // a quantidade pode ter mudado, então a escolha de data anterior pode não valer mais
  r.hora = null
  router.push({ name: 'agenda' })
}
</script>

<template>
  <section>
    <StepBar :atual="1" />
    <h1>O que vamos personalizar?</h1>
    <div class="grade produtos">
      <label v-for="p in store.produtosAtivos" :key="p.id" class="card escolha" :class="{ ativo: r.produtoId === p.id }">
        <input type="radio" v-model="r.produtoId" :value="p.id" />
        <span class="emoji">{{ p.emoji }}</span>
        <strong>{{ p.nome }}</strong>
        <small>{{ moeda(p.preco) }} por unidade</small>
      </label>
    </div>

    <label class="campo">Quantidade (de 1 a {{ max }} por pedido)
      <input type="number" v-model.number="r.quantidade" min="1" :max="max" />
    </label>

    <button class="btn" :disabled="!valido" @click="avancar">Escolher data e horário</button>
  </section>
</template>
