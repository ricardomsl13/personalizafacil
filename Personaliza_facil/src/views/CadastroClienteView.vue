<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useSessaoStore } from '../stores/sessao'
import ClienteForm from '../components/ClienteForm.vue'
import type { Cliente } from '../types'

const route = useRoute()
const router = useRouter()
const sessao = useSessaoStore()

function concluido(c: Cliente) {
  sessao.entrarCliente(c.id) // quem acabou de se cadastrar já entra
  const volta = route.query.redirect
  router.push(typeof volta === 'string' && volta.startsWith('/') ? volta : '/pedido/produto')
}
</script>

<template>
  <section>
    <h1>Crie seu cadastro</h1>
    <p class="sub">Precisamos dos seus dados para vincular o pedido a você.</p>
    <ClienteForm @salvo="concluido" />
  </section>
</template>
