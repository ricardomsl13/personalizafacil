<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { STATUS, CANCELADO } from '../config/negocio'
import { usePedidosStore } from '../stores/pedidos'
import { useSessaoStore } from '../stores/sessao'
import { curto } from '../utils/datas'

const store = usePedidosStore()
const sessao = useSessaoStore()
const router = useRouter()
const codigo = ref('')
const meus = computed(() => store.pedidos.filter(p => p.clienteId === sessao.clienteId).reverse())

const buscar = () => router.push({ name: 'pedido', params: { codigo: codigo.value.trim().toUpperCase() } })
</script>

<template>
  <section>
    <h1>Acompanhe seu pedido</h1>
    <form class="busca" @submit.prevent="buscar">
      <input v-model="codigo" placeholder="Código do pedido, ex.: PED-A1B2C" />
      <button class="btn" :disabled="!codigo.trim()">Buscar</button>
    </form>

    <h2>Meus pedidos</h2>
    <p v-if="!sessao.clienteId" class="sub">
      <RouterLink :to="{ name: 'entrar', query: { redirect: '/acompanhar' } }">Entre</RouterLink> para ver todos os seus pedidos.
    </p>
    <p v-else-if="!meus.length" class="sub">Você ainda não fez nenhum pedido.</p>
    <RouterLink v-for="p in meus" :key="p.codigo" class="card linha item"
                :to="{ name: 'pedido', params: { codigo: p.codigo } }">
      <strong>{{ p.codigo }}</strong>
      <span>{{ p.quantidade }} peças · {{ curto(p.data) }} às {{ p.hora }}</span>
      <span class="selo" :class="p.status === CANCELADO ? 'lotado' : 'livre'">{{ STATUS[p.status] }}</span>
    </RouterLink>
  </section>
</template>
