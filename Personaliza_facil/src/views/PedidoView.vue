<script setup lang="ts">
import { computed } from 'vue'
import { CANCELADO, ETAPAS } from '../config/negocio'
import { usePedidosStore } from '../stores/pedidos'
import { useSessaoStore } from '../stores/sessao'
import { longo, moeda } from '../utils/datas'

const props = defineProps<{ codigo: string }>() // vem da rota (props: true)
const store = usePedidosStore()
const sessao = useSessaoStore()
const pedido = computed(() => store.buscar(props.codigo))
const produto = computed(() => store.produtoPorId(pedido.value?.produtoId ?? null))
const avancar = () => { if (pedido.value) store.definirStatus(pedido.value.codigo, pedido.value.status + 1) }
</script>

<template>
  <section>
    <template v-if="pedido">
      <h1>Pedido {{ pedido.codigo }}</h1>
      <p class="sub">
        {{ pedido.quantidade }} × {{ produto?.nome ?? 'Produto removido' }} · {{ longo(pedido.data) }} às {{ pedido.hora }}
        · {{ moeda(pedido.quantidade * pedido.precoUnitario) }} · {{ store.nomeCliente(pedido.clienteId) }}
      </p>

      <section v-if="pedido.descricaoPersonalizacao || pedido.imagemReferencia" class="card detalhes-personalizacao">
        <h2>Detalhes da personalização</h2>
        <p v-if="pedido.descricaoPersonalizacao" class="texto-personalizacao">{{ pedido.descricaoPersonalizacao }}</p>
        <img v-if="pedido.imagemReferencia" class="imagem-resumo" :src="pedido.imagemReferencia" alt="Imagem de referência da personalização" />
      </section>

      <p v-if="pedido.status === CANCELADO" class="erro">Este pedido foi cancelado e as vagas foram liberadas.</p>
      <ol v-else class="linha-tempo">
        <li v-for="(s, i) in ETAPAS" :key="s" :class="{ feito: i < pedido.status, atual: i === pedido.status }">{{ s }}</li>
      </ol>

      <button v-if="sessao.admin && pedido.status < 3" class="btn secundario" @click="avancar">Avançar para a próxima etapa</button>
    </template>

    <template v-else>
      <h1>Pedido não encontrado</h1>
      <p class="sub">Confira o código “{{ codigo }}” e tente de novo.</p>
      <RouterLink class="btn" to="/acompanhar">Buscar outro código</RouterLink>
    </template>
  </section>
</template>
