import { createRouter, createWebHistory } from 'vue-router'
import { usePedidosStore } from '../stores/pedidos'
import { useSessaoStore } from '../stores/sessao'

declare module 'vue-router' {
  interface RouteMeta { requer?: 'produto' | 'agenda'; cliente?: boolean; admin?: boolean }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'disponibilidade', component: () => import('../views/DisponibilidadeView.vue') },
    { path: '/entrar', name: 'entrar', component: () => import('../views/EntrarView.vue') },
    { path: '/cadastro', name: 'cadastro', component: () => import('../views/CadastroClienteView.vue') },
    { path: '/pedido/produto', name: 'produto', component: () => import('../views/ProdutoView.vue') },
    { path: '/pedido/agenda', name: 'agenda', meta: { requer: 'produto' }, component: () => import('../views/AgendaView.vue') },
    { path: '/pedido/resumo', name: 'resumo', meta: { requer: 'agenda', cliente: true }, component: () => import('../views/ResumoView.vue') },
    { path: '/acompanhar', name: 'acompanhar', component: () => import('../views/AcompanharView.vue') },
    { path: '/acompanhar/:codigo', name: 'pedido', props: true, component: () => import('../views/PedidoView.vue') },
    { path: '/admin', redirect: '/admin/pedidos' },
    { path: '/admin/pedidos', name: 'admin-pedidos', meta: { admin: true }, component: () => import('../views/AdminPedidosView.vue') },
    { path: '/admin/produtos', name: 'admin-produtos', meta: { admin: true }, component: () => import('../views/AdminProdutosView.vue') },
    { path: '/admin/clientes', name: 'admin-clientes', meta: { admin: true }, component: () => import('../views/AdminClientesView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

// O "porteiro": barra quem não tem permissão e quem pulou etapas do pedido.
router.beforeEach(to => {
  const sessao = useSessaoStore()
  const r = usePedidosStore().rascunho
  if (to.name === 'entrar') {
    sessao.abrirLogin()
    return false
  }
  if (to.meta.admin && !sessao.admin) {
    sessao.abrirLogin(to.fullPath)
    return false
  }
  if (to.meta.cliente && !sessao.clienteId && !sessao.admin) {
    sessao.abrirLogin(to.fullPath)
    return false
  }
  if (to.meta.requer === 'produto' && !r.produtoId) return { name: 'produto' }
  if (to.meta.requer === 'agenda' && (!r.data || !r.hora)) return { name: r.produtoId ? 'agenda' : 'produto' }
})

export default router
