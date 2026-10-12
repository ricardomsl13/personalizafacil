<script setup lang="ts">
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { usePedidosStore } from './stores/pedidos'
import { useSessaoStore } from './stores/sessao'
import AuthModal from './components/AuthModal.vue'
const store = usePedidosStore()
const sessao = useSessaoStore()
const route = useRoute()
const router = useRouter()
const sair = () => { sessao.sair(); router.push('/') }
</script>

<template>
  <header class="topo">
    <RouterLink to="/" class="marca">Personaliza Fácil</RouterLink>
    <nav class="nav-principal">
      <RouterLink to="/">Disponibilidade</RouterLink>
      <RouterLink to="/pedido/produto">Fazer pedido</RouterLink>
      <RouterLink to="/acompanhar">Acompanhar</RouterLink>
      <RouterLink v-if="sessao.admin" to="/admin" :class="{ 'router-link-exact-active': route.path.startsWith('/admin') }">Administração</RouterLink>
      <div v-if="sessao.admin || sessao.clienteId" class="sessao-nav">
        <span class="quem">{{ sessao.admin ? 'Administrador' : store.nomeCliente(sessao.clienteId!) }}</span>
        <button class="link" @click="sair">Sair</button>
      </div>
      <button v-else class="link sessao-nav" type="button" @click="sessao.abrirLogin()">Entrar</button>
    </nav>
  </header>
  <main><RouterView /></main>
  <AuthModal v-if="sessao.loginAberto" />
  <footer class="rodape">
    Protótipo sem backend · dados salvos só neste navegador ·
    <button class="link" @click="store.reiniciar()">restaurar dados de exemplo</button>
  </footer>
</template>
