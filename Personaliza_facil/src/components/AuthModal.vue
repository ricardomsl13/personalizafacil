<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ClienteForm from './ClienteForm.vue'
import { usePedidosStore } from '../stores/pedidos'
import { useSessaoStore } from '../stores/sessao'
import type { Cliente } from '../types'

const store = usePedidosStore()
const sessao = useSessaoStore()
const router = useRouter()
const usuario = ref('')
const senha = ref('')
const erro = ref('')
const cadastrando = ref(false)

function concluirLogin() {
  const destino = sessao.destinoLogin
  sessao.fecharLogin()
  if (destino) router.push(destino)
}

function fechar() {
  sessao.fecharLogin()
}

function entrar() {
  erro.value = ''
  if (sessao.entrarAdmin(usuario.value, senha.value)) {
    concluirLogin()
    return
  }

  const cliente = store.autenticarCliente(usuario.value, senha.value)
  if (!cliente) {
    erro.value = 'Usuário ou senha incorretos.'
    return
  }
  sessao.entrarCliente(cliente.id)
  concluirLogin()
}

function cadastroConcluido(cliente: Cliente) {
  sessao.entrarCliente(cliente.id)
  concluirLogin()
}
</script>

<template>
  <div class="modal-fundo" tabindex="-1" @click.self="fechar" @keydown.esc.stop="fechar">
    <section class="modal-login" role="dialog" aria-modal="true" aria-labelledby="titulo-login">
      <button class="modal-fechar" type="button" aria-label="Fechar" @click="fechar">×</button>
      <template v-if="!cadastrando">
        <h1 id="titulo-login">Entrar</h1>
        <p class="sub">Acesse sua conta para continuar.</p>
        <form @submit.prevent="entrar">
          <label class="campo">Nome de usuário
            <input v-model="usuario" autocomplete="username" autofocus required />
          </label>
          <label class="campo">Senha
            <input v-model="senha" type="password" autocomplete="current-password" required />
          </label>
          <p v-if="erro" class="erro" role="alert">{{ erro }}</p>
          <div class="acoes">
            <button class="btn">Entrar</button>
          </div>
        </form>
        <p class="modal-alternativa">
          Não tem cadastro?
          <button class="link" type="button" @click="cadastrando = true; erro = ''">Clique aqui</button>
        </p>
      </template>
      <template v-else>
        <h1 id="titulo-login">Criar cadastro</h1>
        <p class="sub">Preencha seus dados para criar sua conta.</p>
        <ClienteForm @salvo="cadastroConcluido" />
        <p class="modal-alternativa">
          Já tem cadastro?
          <button class="link" type="button" @click="cadastrando = false; erro = ''">Voltar para entrar</button>
        </p>
      </template>
    </section>
  </div>
</template>
