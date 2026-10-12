import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { SENHA_ADMIN, USUARIO_ADMIN } from '../config/negocio'

// Quem está usando o sistema agora: um cliente, o administrador ou ninguém.
export const useSessaoStore = defineStore('sessao', () => {
  const clienteId = ref<string | null>(localStorage.getItem('personalizados-v2-sessao-cliente'))
  const admin = ref(localStorage.getItem('personalizados-v2-sessao-admin') === '1')
  const loginAberto = ref(false)
  const destinoLogin = ref<string | null>(null)

  watch(clienteId, v => v ? localStorage.setItem('personalizados-v2-sessao-cliente', v)
                          : localStorage.removeItem('personalizados-v2-sessao-cliente'))
  watch(admin, v => localStorage.setItem('personalizados-v2-sessao-admin', v ? '1' : '0'))

  function entrarCliente(id: string) { clienteId.value = id; admin.value = false }
  function entrarAdmin(usuario: string, senha: string): boolean {
    if (usuario.trim().toLowerCase() !== USUARIO_ADMIN || senha !== SENHA_ADMIN) return false
    admin.value = true; clienteId.value = null
    return true
  }
  function sair() { clienteId.value = null; admin.value = false }
  function abrirLogin(destino?: string) {
    destinoLogin.value = destino ?? null
    loginAberto.value = true
  }
  function fecharLogin() {
    loginAberto.value = false
    destinoLogin.value = null
  }

  return { clienteId, admin, loginAberto, destinoLogin, entrarCliente, entrarAdmin, sair, abrirLogin, fecharLogin }
})
